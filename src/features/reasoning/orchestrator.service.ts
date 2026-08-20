import type { SupabaseClient } from "@supabase/supabase-js";

import { matchMeaning, MEANING_MATCHING_MODEL } from "@/lib/ai/meaning-matching";
import { evaluateGatekeeper } from "@/lib/ai/gatekeeper";
import { generateEditorial } from "@/lib/ai/editorial-generator";
import { EDITORIAL_GENERATOR_MODEL } from "@/lib/ai/editorial-generator";
import { toCustomerProfileContext } from "@/lib/ai/customer-taste-discovery";
import { toEventMeaningContext } from "@/lib/ai/event-meaning-analysis";
import { adaptMeaningMatchingToGatekeeperInput } from "@/lib/pipeline/meaning-matching-to-gatekeeper";
import { adaptIssueCompositionToEditorialInput, toBrandAsset } from "@/lib/pipeline/issue-composition-to-editorial";
import {
  composeIssueFromGatekeeper,
  type ComposeIssueFromGatekeeperInput,
  type ComposeIssueFromGatekeeperResult,
} from "@/features/editorial/issue-composition.service";
import { createCustomerRepository, type CustomerRepository } from "@/features/knowledge-base/customer.repository";
import { createEventRepository, type EventRepository } from "@/features/knowledge-base/event.repository";
import { createProductRepository, type ProductRepository } from "@/features/knowledge-base/product.repository";
import { createPersonalEditorialRepository, type PersonalEditorialRepository } from "@/features/editorial/personal-editorial.repository";
import { createReasoningRunRepository, type ReasoningRunRepository } from "./reasoning-run.repository";
import { createMatchingResultRepository, type MatchingResultRepository } from "./matching-result.repository";
import { createGatekeeperResultRepository, type GatekeeperResultRepository } from "./gatekeeper-result.repository";
import type { MeaningMatchingCandidateProduct, MeaningMatchingInput, MeaningMatchingOutput } from "@/types/meaning-matching";
import type { GatekeeperInput, GatekeeperOutput } from "@/types/gatekeeper";
import type { IssueComposition } from "@/types/issue-composition";
import type { EditorialGeneratorInput, PersonalEditorial } from "@/types/editorial";

// TASK-301 Backend Orchestrator: 204 -> 205 -> 206 -> 207을 DB read/write와 연결한다.
// Source: documents/[개발 문서] 07_DATABASE_SCHEMA.md (4.8~4.11), 감사 결과(Gatekeeper 대표
// 결과 저장 방식 확인)에서 정리한 규칙을 그대로 구현한다.
//
// TASK-204~207의 AI 로직/prompt/schema, 기존 pipeline adapter는 전혀 수정하지 않는다 —
// 이 파일은 그것들을 순서대로 호출하고 DB에 read/write만 연결하는 얇은 조립 계층이다.

export type MatchMeaningRunner = (input: MeaningMatchingInput) => Promise<MeaningMatchingOutput>;
export type EvaluateGatekeeperRunner = (input: GatekeeperInput) => Promise<GatekeeperOutput>;
export type ComposeIssueFromGatekeeperRunner = (
  input: ComposeIssueFromGatekeeperInput,
) => Promise<ComposeIssueFromGatekeeperResult>;
export type GenerateEditorialRunner = (input: EditorialGeneratorInput) => Promise<PersonalEditorial>;

export interface OrchestratorDependencies {
  customerRepository: CustomerRepository;
  eventRepository: EventRepository;
  productRepository: ProductRepository;
  reasoningRunRepository: ReasoningRunRepository;
  matchingResultRepository: MatchingResultRepository;
  gatekeeperResultRepository: GatekeeperResultRepository;
  personalEditorialRepository: PersonalEditorialRepository;
  matchMeaning: MatchMeaningRunner;
  evaluateGatekeeper: EvaluateGatekeeperRunner;
  composeIssueFromGatekeeper: ComposeIssueFromGatekeeperRunner;
  generateEditorial: GenerateEditorialRunner;
}

export interface RunReasoningInput {
  customerCode: string;
  eventId: string;
}

export type OrchestratorResult =
  | { status: "precondition_failed"; reason: string }
  | { status: "already_running"; reasoningRunId: string }
  | { status: "completed"; reasoningRunId: string; personalEditorialId: string }
  | { status: "skipped"; reasoningRunId: string; reason: "no_meaningful_discovery" }
  | { status: "failed"; reasoningRunId: string; errorMessage: string };

// TASK-301 Backend E2E 감사 결과 반영: 204/205/206/207 각 단계에 application-level
// timeout을 건다. dependency/config로 주입 가능해야 mock timeout 테스트가 실제로 120초를
// 기다리지 않아도 된다 — runReasoning()의 세 번째(선택) 인자로 주입한다.
export interface OrchestratorTimeoutConfig {
  task204Ms: number;
  task205Ms: number;
  task206Ms: number;
  task207Ms: number;
}

// 120초로 두지 않는다: OpenAI client(src/lib/ai/openai-client.ts)가 timeout=120_000ms,
// maxRetries=1로 설정돼 있고, openai SDK는 매 attempt(최초 시도 + 재시도)마다 동일한
// this.timeout을 새로 적용한다(공유/차감되는 총 예산이 아니다 — node_modules/openai의
// client.mjs buildRequest()에서 `options.timeout = options.timeout ?? this.timeout`을
// 매 attempt마다 다시 계산하는 것으로 확인). 따라서 SDK가 재시도 1회까지 전부 소진하는
// 최악의 경우 실제 소요 시간은:
//   attempt 1 timeout(120_000) + backoff(~500ms, calculateDefaultRetryTimeoutMillis)
//   + attempt 2 timeout(120_000) ≈ 240_500ms
// application timeout을 이보다 짧게 두면 SDK의 재시도가 끝나기도 전에 orchestrator가
// 먼저 포기해버려 maxRetries=1을 설정한 의미가 없어진다. 250_000ms(약 9.5초 여유)로
// 이 최악의 경우보다 확실히 길게 잡는다.
const DEFAULT_TASK_TIMEOUT_MS = 250_000;

export const DEFAULT_TIMEOUT_CONFIG: OrchestratorTimeoutConfig = {
  task204Ms: DEFAULT_TASK_TIMEOUT_MS,
  task205Ms: DEFAULT_TASK_TIMEOUT_MS,
  task206Ms: DEFAULT_TASK_TIMEOUT_MS,
  task207Ms: DEFAULT_TASK_TIMEOUT_MS,
};

export class TaskTimeoutError extends Error {
  constructor(taskLabel: string, ms: number) {
    super(`${taskLabel}: did not resolve within ${ms}ms`);
    this.name = "TaskTimeoutError";
  }
}

// 원본 promise를 취소하지 않는다 — matchMeaning/evaluateGatekeeper/composeIssueFromGatekeeper/
// generateEditorial(TASK-204~207)은 AbortSignal을 받지 않으므로 진짜 취소는 불가능하다
// (감사 결과에 명시된 한계, 그 함수들의 시그니처를 바꾸지 않기 위해 임의 구현하지 않는다).
// 여기서 하는 일은 "orchestrator가 언제까지만 기다릴지"를 정하는 것뿐이다 — 시간이 지나면
// 기다리기를 포기하고 reject하며, 원래 promise는 배경에서 계속 실행되다가 자체적으로
// 끝나지만 그 결과는 아무도 사용하지 않는다.
function withTaskTimeout<T>(promise: Promise<T>, ms: number, taskLabel: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new TaskTimeoutError(taskLabel, ms)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export async function runReasoning(
  input: RunReasoningInput,
  deps: OrchestratorDependencies,
  timeoutConfig: OrchestratorTimeoutConfig = DEFAULT_TIMEOUT_CONFIG,
): Promise<OrchestratorResult> {
  const { customerCode, eventId } = input;

  // -------------------------------------------------------------------
  // Precondition (TASK-204 실행/reasoning_run 생성 전) — 하나라도 없으면
  // 이후 어떤 것도 실행/저장하지 않는다. reasoning_runs.customer_taste_profile_id /
  // event_meaning_profile_id가 NOT NULL FK라 이 값들이 없으면 reasoning_run 자체를
  // 만들 수도 없다 — 그래서 reasoning_run 생성보다 먼저 전부 확인한다.
  // -------------------------------------------------------------------
  const customer = await deps.customerRepository.findCustomerByCode(customerCode);
  if (!customer) {
    return { status: "precondition_failed", reason: `Customer not found: ${customerCode}` };
  }

  const event = await deps.eventRepository.findEventById(eventId);
  if (!event) {
    return { status: "precondition_failed", reason: `Event not found: ${eventId}` };
  }

  // 중복 요청 최소 방어(best-effort) — schema unique constraint 없음, race condition을
  // 완전히 막지는 못한다.
  const activeRun = await deps.reasoningRunRepository.findActiveByCustomerAndEvent(
    customer.id,
    event.id,
  );
  if (activeRun) {
    return { status: "already_running", reasoningRunId: activeRun.id };
  }

  const customerTasteProfile = await deps.customerRepository.findCurrentTasteProfile(customer.id);
  if (!customerTasteProfile) {
    return {
      status: "precondition_failed",
      reason: `No current Customer Taste Profile for customer: ${customerCode}`,
    };
  }

  const eventMeaningProfile = await deps.eventRepository.findCurrentMeaningProfile(event.id);
  if (!eventMeaningProfile) {
    return {
      status: "precondition_failed",
      reason: `No current Event Meaning Profile for event: ${eventId}`,
    };
  }

  if (event.related_product_ids.length === 0) {
    return { status: "precondition_failed", reason: `Event has no related products: ${eventId}` };
  }

  const products = await deps.productRepository.findByIds(event.related_product_ids);
  if (products.length !== event.related_product_ids.length) {
    const foundIds = new Set(products.map((p) => p.id));
    const missing = event.related_product_ids.filter((id) => !foundIds.has(id));
    return {
      status: "precondition_failed",
      reason: `Missing related products for event ${eventId}: ${missing.join(", ")}`,
    };
  }

  const productProfiles = await deps.productRepository.findByProductIds(event.related_product_ids);
  if (productProfiles.length !== products.length) {
    const profiledIds = new Set(productProfiles.map((p) => p.product_id));
    const missing = products.filter((p) => !profiledIds.has(p.id)).map((p) => p.id);
    return {
      status: "precondition_failed",
      reason: `Missing current Product Profile for products: ${missing.join(", ")}`,
    };
  }

  // -------------------------------------------------------------------
  // reasoning_run 생성 (pending -> processing)
  // -------------------------------------------------------------------
  const created = await deps.reasoningRunRepository.create({
    customer_id: customer.id,
    event_id: event.id,
    customer_taste_profile_id: customerTasteProfile.id,
    event_meaning_profile_id: eventMeaningProfile.id,
    source: "ai_generated",
  });
  const reasoningRun = await deps.reasoningRunRepository.markProcessing(created.id);

  try {
    // -----------------------------------------------------------------
    // TASK-204 입력 조립 (DB row -> MeaningMatchingInput) + 실행
    // -----------------------------------------------------------------
    const productById = new Map(products.map((p) => [p.id, p]));
    const profileByProductId = new Map(productProfiles.map((p) => [p.product_id, p]));

    const candidates: MeaningMatchingCandidateProduct[] = event.related_product_ids.map(
      (productId) => {
        const product = productById.get(productId);
        const profile = profileByProductId.get(productId);
        if (!product || !profile) {
          throw new Error(`Internal inconsistency: missing product/profile for ${productId}`);
        }
        return {
          product_id: productId,
          product: {
            name: product.name,
            category: product.category ?? "",
            collection: product.collection,
            image_url: product.image_url,
          },
          product_profile: {
            core4: profile.core4,
            ai_product_traits: profile.ai_product_traits,
            evidence: profile.evidence as Array<{ source: string; text: string }>,
          },
        };
      },
    );

    const meaningMatchingInput: MeaningMatchingInput = {
      event_id: event.id,
      customer_profile: toCustomerProfileContext(customerTasteProfile),
      event_meaning_profile: toEventMeaningContext(eventMeaningProfile),
      candidates,
    };

    const matchingOutput = await withTaskTimeout(
      deps.matchMeaning(meaningMatchingInput),
      timeoutConfig.task204Ms,
      "TASK_204_TIMEOUT",
    );

    // -----------------------------------------------------------------
    // matching_results 저장 — 검증을 통과한 결과만(matchMeaning이 검증 실패 시 이미 throw
    // 했으므로 여기 도달했다는 것 자체가 통과를 의미한다). 07_DATABASE_SCHEMA.md 4.9
    // 컬럼 의미에 맞춰 204 output을 명시적으로 투영한다 — 새 구조를 발명하지 않는다.
    // -----------------------------------------------------------------
    const matchingResult = await deps.matchingResultRepository.insert({
      reasoning_run_id: reasoningRun.id,
      customer_evidence: matchingOutput.customer_event_match,
      product_event_evidence: matchingOutput.candidates.map((c) => ({
        product_id: c.product_id,
        customer_product_match: c.customer_product_match,
        extension_result: c.extension_result,
      })),
      meaning_bridge: matchingOutput.candidates.map((c) => ({
        product_id: c.product_id,
        meaning_bridge: c.meaning_bridge,
      })),
      candidate_product_ids: matchingOutput.candidates.map((c) => c.product_id),
      is_valid: true,
      validation_errors: [],
      analysis_model: MEANING_MATCHING_MODEL,
      source: "ai_generated",
    });

    // -----------------------------------------------------------------
    // TASK-205 — 기존 adapter로 입력 조립, 기존 evaluateGatekeeper() 그대로 실행.
    // product별 GatekeeperEvaluation[] 구조는 그대로 유지된다(runtime에서만).
    // -----------------------------------------------------------------
    const gatekeeperInput: GatekeeperInput = adaptMeaningMatchingToGatekeeperInput(
      matchingOutput,
      meaningMatchingInput,
    );
    const gatekeeperOutput = await withTaskTimeout(
      deps.evaluateGatekeeper(gatekeeperInput),
      timeoutConfig.task205Ms,
      "TASK_205_TIMEOUT",
    );

    // -----------------------------------------------------------------
    // gatekeeper_results 대표 결과 매핑 (reasoning_run당 1 row, 07_DATABASE_SCHEMA.md
    // 1:1 cardinality). TASK-205 판단 자체는 바꾸지 않는다 — DB 저장용 대표값 도출뿐이다.
    // -----------------------------------------------------------------
    const isPass = gatekeeperOutput.passProductPool.length > 0;

    const gatekeeperResult = isPass
      ? await (async () => {
          const passEvaluation = gatekeeperOutput.evaluations.find((e) => e.decision === "PASS");
          if (!passEvaluation) {
            throw new Error(
              "Internal inconsistency: passProductPool is non-empty but no PASS evaluation found",
            );
          }
          return deps.gatekeeperResultRepository.insert({
            reasoning_run_id: reasoningRun.id,
            matching_result_id: matchingResult.id,
            decision: "PASS",
            reason: passEvaluation.reason,
            editorial_angle: passEvaluation.editorial_angle,
            failed_rules: [],
            candidate_product_ids: gatekeeperOutput.passProductPool.map((p) => p.product_id),
            source: "ai_generated",
          });
        })()
      : await deps.gatekeeperResultRepository.insert({
          reasoning_run_id: reasoningRun.id,
          matching_result_id: matchingResult.id,
          decision: "REJECT",
          reason: gatekeeperOutput.evaluations[0].reason,
          editorial_angle: null,
          failed_rules: gatekeeperOutput.evaluations.map((e) => ({
            product_id: e.product_id,
            failed_rules: e.failed_rules,
          })),
          candidate_product_ids: [],
          source: "ai_generated",
        });

    // -----------------------------------------------------------------
    // all REJECT -> skipped (정상 완료, 실패 아님). 206/207 미실행, editorial 미생성.
    // -----------------------------------------------------------------
    if (!isPass) {
      await deps.reasoningRunRepository.markCompleted(reasoningRun.id);
      return {
        status: "skipped",
        reasoningRunId: reasoningRun.id,
        reason: "no_meaningful_discovery",
      };
    }

    // -----------------------------------------------------------------
    // TASK-206 — 기존 composeIssueFromGatekeeper()(205->206 adapter + composeIssue())
    // 그대로 재사용. PASS product만 전달된다(adapter 자체 계약).
    // -----------------------------------------------------------------
    const composeResult = await withTaskTimeout(
      deps.composeIssueFromGatekeeper({ gatekeeperOutput, eventMeaningProfile }),
      timeoutConfig.task206Ms,
      "TASK_206_TIMEOUT",
    );
    if (composeResult.status === "skipped") {
      // isPass=true인데 여기서 skipped가 나오는 것은 adapter 계약과 orchestrator 판단이
      // 어긋났다는 뜻이므로 조용히 넘어가지 않고 실제 오류로 처리한다.
      throw new Error(
        "Internal inconsistency: Gatekeeper produced a PASS pool but composeIssueFromGatekeeper reported skipped",
      );
    }
    const issueComposition: IssueComposition = composeResult.issueComposition;

    // -----------------------------------------------------------------
    // TASK-207 입력 조립(기존 adapter) + 실행
    // -----------------------------------------------------------------
    const editorialInput: EditorialGeneratorInput = adaptIssueCompositionToEditorialInput(
      issueComposition,
      gatekeeperOutput.passProductPool,
      {
        eventMeaningProfile,
        customerTasteProfile,
        event,
        brandAsset: toBrandAsset(event),
        products,
        productProfiles,
      },
    );
    const personalEditorial = await withTaskTimeout(
      deps.generateEditorial(editorialInput),
      timeoutConfig.task207Ms,
      "TASK_207_TIMEOUT",
    );

    // -----------------------------------------------------------------
    // personal_editorials 저장. editorial_content에 PersonalEditorial 전체를 그대로
    // 담는다(07_DATABASE_SCHEMA.md 지시 — 별도 매핑 스키마를 새로 만들지 않는다).
    // 개별 컬럼은 문서 설명에 맞는 값만 명시적으로 채운다.
    // -----------------------------------------------------------------
    const savedEditorial = await deps.personalEditorialRepository.insert({
      gatekeeper_result_id: gatekeeperResult.id,
      reasoning_run_id: reasoningRun.id,
      customer_id: customer.id,
      event_id: event.id,
      title: personalEditorial.editorial.cover.title,
      hero_image_url: personalEditorial.editorial.brand_story.image_url,
      brand_story: personalEditorial.editorial.brand_story.content,
      personal_connection: issueComposition.personal_connection.connection_reason,
      product_discovery: personalEditorial.editorial.discovery_chapters,
      closing_message: personalEditorial.editorial.closing_message.content,
      editorial_content: personalEditorial,
      generation_model: EDITORIAL_GENERATOR_MODEL,
      source: "ai_generated",
    });

    await deps.reasoningRunRepository.markCompleted(reasoningRun.id);
    return {
      status: "completed",
      reasoningRunId: reasoningRun.id,
      personalEditorialId: savedEditorial.id,
    };
  } catch (error) {
    // 실제 error/validation failure — 즉시 중단, retry 없음, 이미 저장된 matching_result/
    // gatekeeper_result가 있어도 임의로 지우지 않는다(부분 결과 그대로 남김).
    const message = error instanceof Error ? error.message : String(error);
    await deps.reasoningRunRepository.markFailed(reasoningRun.id, message);
    return { status: "failed", reasoningRunId: reasoningRun.id, errorMessage: message };
  }
}

export function createOrchestratorDependencies(
  supabase?: SupabaseClient,
): OrchestratorDependencies {
  return {
    customerRepository: createCustomerRepository(supabase),
    eventRepository: createEventRepository(supabase),
    productRepository: createProductRepository(supabase),
    reasoningRunRepository: createReasoningRunRepository(supabase),
    matchingResultRepository: createMatchingResultRepository(supabase),
    gatekeeperResultRepository: createGatekeeperResultRepository(supabase),
    personalEditorialRepository: createPersonalEditorialRepository(supabase),
    matchMeaning,
    evaluateGatekeeper,
    composeIssueFromGatekeeper,
    generateEditorial,
  };
}

export async function runReasoningLive(input: RunReasoningInput): Promise<OrchestratorResult> {
  return runReasoning(input, createOrchestratorDependencies());
}
