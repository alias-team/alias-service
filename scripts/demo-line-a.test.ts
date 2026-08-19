// Line A 통합 테스트: TASK-201 -> TASK-202 -> TASK-204 -> TASK-205
//
// 목적: DEMO-CUSTOMER-A의 실제 구매/위시 seed를 시작점으로, 실제 코드 계약 기준으로 끝까지
// 정상 연결되는지 확인한다. "구조/데이터 아귀 통합 검증"이며 AI 품질 검증이 아니다.
// TASK-203은 Line B 영역이라 이번 테스트에서는 현재 EventMeaningProfile 계약에 맞는
// fixture만 사용한다. 실제 OpenAI 호출은 0회다 — 아래 각 실제 함수(discoverCustomerTaste/
// matchMeaning/evaluateGatekeeper)에 전부 mock generator를 주입한다.
//
// 데이터 출처 구분 (반드시 지킬 것 — fixture/mock을 실제 AI 산출물로 표기하지 않는다):
//   실제 seed: mcm_seed_customers_selections_final.json / mcm_seed_source_30.json /
//              mcm_seed_events_final.json
//   실제 TASK-201 AI 산출물: scripts/fixtures/task201-customer-a-latest-validation.json
//              (Customer A가 실제 선택한 5개 상품, gpt-4o, ai_generated)
//   실제 함수 실행(LLM 아님): computeCorePreference()는 discoverCustomerTaste() 내부에서
//              실제 TASK-201 산출물에 대해 그대로 실행된다 — 결정론적 순수 함수라 재현 가능.
//   fixture(손작성, AI 아님):
//     - discoverCustomerTaste()에 주입하는 mock generator의 taste_summary/ai_traits
//       (실제로는 OpenAI 호출이 필요한 부분)
//     - event_meaning_profile 전체 (TASK-203은 Line B 영역) — EVT_TRAVEL_EDIT_2026의 실제
//       seed 필드(name/campaign_overview/brand_message/collection_concept)에만 근거
//     - Event related products 3개의 product_profile — 실제 raw description/material/
//       category/color_name에만 근거, core4 키를 material_raw/category_raw/color_raw로
//       둬서 진짜 Core4 분류와 구분
//   mock(손작성, AI 아님): matchMeaning()/evaluateGatekeeper()에 주입하는 generator
//
//   pnpm exec vitest run scripts/demo-line-a.test.ts --reporter=verbose

import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { discoverCustomerTaste, toCorePreferenceRecord } from "@/lib/ai/customer-taste-discovery";
import { matchMeaning } from "@/lib/ai/meaning-matching";
import { evaluateGatekeeper } from "@/lib/ai/gatekeeper";
import { adaptMeaningMatchingToGatekeeperInput } from "@/lib/pipeline/meaning-matching-to-gatekeeper";
import { customerTasteProfileSchema } from "@/lib/validation/customer-taste.schema";
import { gatekeeperInputSchema } from "@/lib/validation/gatekeeper.schema";
import { passProductCandidateSchema } from "@/lib/validation/issue-composition.schema";
import type { CustomerProductSelection, SelectedProductProfile } from "@/types/customer";
import type { GatekeeperInput, GatekeeperOutput } from "@/types/gatekeeper";
import type {
  MeaningMatchingCandidateProduct,
  MeaningMatchingInput,
} from "@/types/meaning-matching";

const ROOT = path.resolve(import.meta.dirname, "..");
const EVENT_CODE = "EVT_TRAVEL_EDIT_2026";
const CUSTOMER_CODE = "DEMO-CUSTOMER-A";

interface SeedProduct {
  product_id: string;
  product_name: string;
  color_name: string | null;
  description: string;
  material: string;
  category: string;
  image_url: string;
}

interface SeedEvent {
  event_code: string;
  name: string;
  campaign_overview: string;
  brand_message: string;
  collection_concept: string | null;
  related_product_ids: string[];
}

interface SeedEventsFile {
  events: SeedEvent[];
}

interface SeedSelection {
  customer_code: string;
  product_code: string;
  selection_type: "purchase" | "wishlist";
}

interface SeedCustomersFile {
  customer_product_selections: SeedSelection[];
}

interface Task201FixtureFile {
  products: Record<
    string,
    {
      status: "validated" | "pending";
      profile?: {
        core4: SelectedProductProfile["core4"];
        ai_product_traits: SelectedProductProfile["ai_product_traits"];
      };
    }
  >;
}

function readSeed<T>(fileName: string): T {
  return JSON.parse(readFileSync(path.join(ROOT, "seed", fileName), "utf8")) as T;
}

function readTask201Fixture(): Task201FixtureFile {
  return JSON.parse(
    readFileSync(
      path.join(ROOT, "scripts", "fixtures", "task201-customer-a-latest-validation.json"),
      "utf8",
    ),
  ) as Task201FixtureFile;
}

function logSection(title: string, payload: unknown) {
  console.log(`\n=== ${title} ===`);
  console.log(JSON.stringify(payload, null, 2));
}

// EVT_TRAVEL_EDIT_2026의 실제 seed 필드에만 근거한 손작성 fixture (TASK-203은 Line B 영역).
function buildEventMeaningProfile(
  event: SeedEvent,
): MeaningMatchingInput["event_meaning_profile"] {
  return {
    event_id: event.event_code,
    event_theme: event.name,
    brand_direction: event.campaign_overview,
    event_traits: ["mobility", "modern nomad", "functional innovation"],
    evidence: [
      { source: "mcm_seed_events_final.json.brand_message", text: event.brand_message },
      ...(event.collection_concept
        ? [
            {
              source: "mcm_seed_events_final.json.collection_concept",
              text: event.collection_concept,
            },
          ]
        : []),
    ],
  };
}

// Event related product 3개의 실제 raw description/material/category에만 근거한 손작성
// fixture (TASK-201 실제 AI 실행 아님) — core4 키를 raw_* 로 둬서 실제 Core4 분류와 구분한다.
function buildCandidateProduct(product: SeedProduct): MeaningMatchingCandidateProduct {
  return {
    product_id: product.product_id,
    product: {
      name: product.product_name,
      category: product.category,
      collection: null,
      image_url: product.image_url,
    },
    product_profile: {
      core4: {
        material_raw: product.material,
        category_raw: product.category,
        color_raw: product.color_name,
      },
      ai_product_traits: [
        {
          name: "Raw Description Highlight (fixture)",
          reason: "실제 seed 원본 설명(mcm_seed_source_30.json)의 핵심 문장을 그대로 인용한 손작성 항목입니다.",
          evidence: [{ source: "product_description", text: product.description }],
        },
      ],
      evidence: [
        { source: "mcm_seed_source_30.json.description", text: product.description },
      ],
    },
  };
}

function logFinalRecommendation(
  gatekeeperInput: GatekeeperInput,
  gatekeeperOutput: GatekeeperOutput,
) {
  console.log("\n=== FINAL RECOMMENDATION ===");
  for (const evaluation of gatekeeperOutput.evaluations) {
    const candidate = gatekeeperInput.candidates.find(
      (c) => c.product_id === evaluation.product_id,
    )!;
    console.log(`\n[${evaluation.product_id} / ${candidate.product.name}]`);
    console.log(`추천 여부: ${evaluation.decision}`);
    console.log(`근거: ${evaluation.reason}`);
    console.log(`Meaning Bridge: ${candidate.meaning_bridge}`);
    console.log(`Extension Type: ${candidate.extension_result.extension_type}`);
    console.log(
      `Failed Rules: ${evaluation.failed_rules.length > 0 ? evaluation.failed_rules.join(", ") : "(none)"}`,
    );
    console.log(`Editorial Angle: ${evaluation.editorial_angle ?? "(none)"}`);
  }
  console.log("\npassProductPool:");
  console.log(JSON.stringify(gatekeeperOutput.passProductPool, null, 2));
}

describe("Line A integration: TASK-201 -> TASK-202 -> TASK-204 -> TASK-205 (no OpenAI calls)", () => {
  it("flows DEMO-CUSTOMER-A's real seed selections through the real pipeline functions to a final PASS/REJECT recommendation", async () => {
    // ---------------------------------------------------------------------
    // 1. 입력 데이터 (실제 seed)
    // ---------------------------------------------------------------------
    const { customer_product_selections: allSelections } = readSeed<SeedCustomersFile>(
      "mcm_seed_customers_selections_final.json",
    );
    const products = readSeed<SeedProduct[]>("mcm_seed_source_30.json");
    const { events } = readSeed<SeedEventsFile>("mcm_seed_events_final.json");

    const customerSelections = allSelections.filter(
      ({ customer_code }) => customer_code === CUSTOMER_CODE,
    );
    const event = events.find(({ event_code }) => event_code === EVENT_CODE);
    if (!event) throw new Error(`Seed Event를 찾을 수 없습니다: ${EVENT_CODE}`);

    const purchaseProductIds = customerSelections
      .filter((s) => s.selection_type === "purchase")
      .map((s) => s.product_code);
    const wishlistProductIds = customerSelections
      .filter((s) => s.selection_type === "wishlist")
      .map((s) => s.product_code);

    logSection("LINE A INPUT", {
      customer_id: CUSTOMER_CODE,
      purchase_product_ids: purchaseProductIds,
      wishlist_product_ids: wishlistProductIds,
      event_id: event.event_code,
      event_related_product_ids: event.related_product_ids,
    });

    // ---------------------------------------------------------------------
    // 2. TASK-201: Customer A 5개 상품은 실제 산출물 재사용, Event 후보 3개는 fixture
    // ---------------------------------------------------------------------
    const task201Fixture = readTask201Fixture();
    const validatedProfiles: SelectedProductProfile[] = Object.entries(task201Fixture.products)
      .filter(([, entry]) => entry.status === "validated" && entry.profile)
      .map(([productId, entry]) => ({
        product_id: productId,
        core4: entry.profile!.core4,
        ai_product_traits: entry.profile!.ai_product_traits,
      }));

    // 검증: task201 fixture의 product_id가 Customer A의 실제 현재 seed 선택 이력과 일치
    expect(new Set(validatedProfiles.map((p) => p.product_id))).toEqual(
      new Set(customerSelections.map((s) => s.product_code)),
    );

    const productById = new Map(products.map((product) => [product.product_id, product]));
    const eventCandidateProducts = event.related_product_ids.map((productId) => {
      const product = productById.get(productId);
      if (!product) throw new Error(`Seed Product를 찾을 수 없습니다: ${productId}`);
      return product;
    });

    logSection("TASK-201 OUTPUT", {
      customer_selected_products: validatedProfiles.map((p) => ({
        product_id: p.product_id,
        source: "REAL TASK-201 AI output (scripts/fixtures/task201-customer-a-latest-validation.json, gpt-4o, ai_generated)",
        core4: p.core4,
        ai_product_traits: p.ai_product_traits,
      })),
      event_candidate_products: eventCandidateProducts.map((product) => ({
        product_id: product.product_id,
        source: "FIXTURE (raw seed description/material/category/color_name 근거, AI 미실행)",
        product_profile: buildCandidateProduct(product).product_profile,
      })),
    });

    // ---------------------------------------------------------------------
    // 3. TASK-202: 실제 discoverCustomerTaste() 실행 (mock generator 주입)
    // ---------------------------------------------------------------------
    const selections: CustomerProductSelection[] = customerSelections.map((s) => ({
      product_id: s.product_code,
      selection_type: s.selection_type,
    }));

    const customerTasteProfile = await discoverCustomerTaste(
      { customerId: CUSTOMER_CODE, selections, productProfiles: validatedProfiles },
      // mock generator: 실제로는 OpenAI가 담당하는 AI Trait Discovery만 대신한다.
      // core_preference는 이 함수 내부에서 실제 computeCorePreference()가 계산한다.
      async () => ({
        taste_summary:
          "(fixture) 실제 TASK-201 산출물 5건을 근거로, 헤리티지 소재(가죽/시그니처 모노그램)를 " +
          "반복적으로 선택하는 패턴이 확인됩니다.",
        ai_traits: [
          {
            name: "Heritage Material Repetition",
            reason: "(fixture) 여러 실제 Product Profile이 가죽 또는 시그니처 모노그램 소재로 분류됐습니다.",
            evidenceProductIds: validatedProfiles.map((p) => p.product_id),
          },
        ],
      }),
    );

    // 검증: TASK-202 결과가 실제 customerTasteProfileSchema를 통과
    expect(() => customerTasteProfileSchema.parse(customerTasteProfile)).not.toThrow();

    logSection("TASK-202 OUTPUT", {
      taste_summary: customerTasteProfile.taste_summary,
      core_preference: customerTasteProfile.core_preference,
      ai_traits: customerTasteProfile.ai_traits,
      evidence_product_ids: customerTasteProfile.evidence_product_ids,
      _source: {
        taste_summary: "MOCK generator 결과 (fixture, 실제 OpenAI 미호출)",
        core_preference:
          "REAL computeCorePreference() 실행 결과 (discoverCustomerTaste 내부, LLM 미사용, 결정론적 순수 함수)",
        ai_traits: "MOCK generator 결과 (fixture) — evidenceProductIds는 실제 assertKnownEvidenceProductIds()로 검증 통과",
        evidence_product_ids:
          "REAL 함수 결과(productsContributingToCorePreference + AI trait 인용 병합, discoverCustomerTaste 내부)",
      },
    });

    // ---------------------------------------------------------------------
    // 4. TASK-203: Line B 영역 — fixture만 사용
    // ---------------------------------------------------------------------
    const eventMeaningProfile = buildEventMeaningProfile(event);
    logSection("TASK-203 FIXTURE", eventMeaningProfile);

    // ---------------------------------------------------------------------
    // 5. TASK-204: 실제 matchMeaning() 실행 (mock generator 주입)
    // ---------------------------------------------------------------------
    const matchingInput: MeaningMatchingInput = {
      event_id: event.event_code,
      customer_profile: {
        taste_summary: customerTasteProfile.taste_summary,
        core_preference: toCorePreferenceRecord(customerTasteProfile.core_preference),
        ai_traits: customerTasteProfile.ai_traits,
        evidence_product_ids: customerTasteProfile.evidence_product_ids,
      },
      event_meaning_profile: eventMeaningProfile,
      candidates: eventCandidateProducts.map(buildCandidateProduct),
    };

    // 검증: Event related_product_ids가 실제 seed와 정확히 일치
    expect(matchingInput.candidates.map((c) => c.product_id)).toEqual(
      event.related_product_ids,
    );

    logSection("TASK-204 INPUT", matchingInput);

    const matchingOutput = await matchMeaning(matchingInput, async (input) => ({
      customer_event_match: {
        connection: true,
        matching_reason:
          "고객의 헤리티지 소재 반복 선호가 Event의 mobility/modern nomad 방향과 연결됩니다.",
        evidence: [`${CUSTOMER_CODE}의 실제 seed 선택 이력에 반복되는 소재 패턴이 있습니다.`],
      },
      candidates: input.candidates.map((candidate, index) => ({
        product_id: candidate.product_id,
        customer_product_match: {
          connection: true,
          core4_connections: [
            {
              attribute: "material",
              customer_value: "leather / signature_monogram",
              product_value: String(
                (candidate.product_profile.core4 as { material_raw?: string }).material_raw,
              ),
            },
          ],
          trait_connections: [
            {
              customer_trait: "Heritage Material Repetition",
              product_trait: "Raw Description Highlight (fixture)",
            },
          ],
          matching_reason: `${candidate.product.name}의 소재/구조가 고객의 반복 선호와 연결됩니다.`,
          evidence: [`${CUSTOMER_CODE}의 실제 seed 선택 이력에는 유사한 소재의 제품이 포함됩니다.`],
        },
        meaning_bridge: `고객의 기존 소재 선호를 ${candidate.product.name}을(를) 통해 Travel Edit 맥락으로 연결합니다.`,
        // 최소 meaningful_extension 1개 + existing_preference_repetition 1개 이상을 만든다.
        extension_result:
          index === 0
            ? {
                extension_type: "meaningful_extension" as const,
                existing_preference: "구조적 실루엣과 헤리티지 소재를 반복 선택",
                new_expression: "여행 특화 구조로 확장된 동일 헤리티지 소재 표현",
                extension_reason: "기존 소재 선호를 여행이라는 새로운 사용 맥락으로 확장합니다.",
              }
            : {
                extension_type: "existing_preference_repetition" as const,
                existing_preference: "구조적 실루엣과 헤리티지 소재를 반복 선택",
                new_expression: "동일한 헤리티지 소재 표현",
                extension_reason: "새로운 발견보다 기존 소재 선호를 반복합니다.",
              },
      })),
    }));

    // 검증: 204 output product_id가 candidate와 정확히 일치 (matchMeaning 내부 identity 보장을 재확인)
    expect(matchingOutput.candidates.map((c) => c.product_id)).toEqual(
      matchingInput.candidates.map((c) => c.product_id),
    );
    expect(
      matchingOutput.candidates.some(
        (c) => c.extension_result.extension_type === "meaningful_extension",
      ),
    ).toBe(true);
    expect(
      matchingOutput.candidates.some(
        (c) => c.extension_result.extension_type === "existing_preference_repetition",
      ),
    ).toBe(true);

    logSection("TASK-204 OUTPUT", {
      customer_event_match: matchingOutput.customer_event_match,
      candidates: matchingOutput.candidates,
    });

    // ---------------------------------------------------------------------
    // 6. TASK-205: adapter -> gatekeeperInputSchema -> 실제 evaluateGatekeeper()
    // ---------------------------------------------------------------------
    const gatekeeperInput = adaptMeaningMatchingToGatekeeperInput(matchingOutput, matchingInput);

    // 검증: 204 -> 205 조립 중 누락/변형 없음
    expect(gatekeeperInput.customer_profile).toEqual(matchingInput.customer_profile);
    expect(gatekeeperInput.event_meaning_profile).toEqual(matchingInput.event_meaning_profile);
    expect(gatekeeperInput.customer_event_match).toEqual(matchingOutput.customer_event_match);
    for (const upstream of matchingInput.candidates) {
      const produced = matchingOutput.candidates.find((c) => c.product_id === upstream.product_id)!;
      const assembled = gatekeeperInput.candidates.find((c) => c.product_id === upstream.product_id)!;
      expect(assembled.product).toEqual(upstream.product);
      expect(assembled.product_profile).toEqual(upstream.product_profile);
      expect(assembled.customer_product_match).toEqual(produced.customer_product_match);
      expect(assembled.meaning_bridge).toBe(produced.meaning_bridge);
      expect(assembled.extension_result).toEqual(produced.extension_result);
    }

    // 검증: GatekeeperInput schema 통과
    expect(() => gatekeeperInputSchema.parse(gatekeeperInput)).not.toThrow();

    logSection("TASK-205 INPUT", gatekeeperInput);

    const gatekeeperOutput = await evaluateGatekeeper(gatekeeperInput, async (eligibleInput) => ({
      evaluations: eligibleInput.candidates.map((candidate) => ({
        product_id: candidate.product_id,
        decision: "PASS" as const,
        reason: "기존 헤리티지 소재 선호를 여행 특화 구조로 확장할 근거가 충분합니다.",
        editorial_angle: "헤리티지 소재를 modern nomad의 이동성으로 확장",
      })),
    }));

    // 검증: 205 최종 결과까지 정상 실행, PASS/REJECT + 근거 확보
    expect(gatekeeperOutput.event_id).toBe(EVENT_CODE);
    expect(gatekeeperOutput.evaluations).toHaveLength(3);
    expect(gatekeeperOutput.evaluations[0].decision).toBe("PASS");
    expect(gatekeeperOutput.evaluations[1].decision).toBe("REJECT");
    expect(gatekeeperOutput.evaluations[1].failed_rules).toEqual([
      "MEANINGFUL_EXTENSION_REQUIRED",
    ]);
    expect(gatekeeperOutput.evaluations[2].decision).toBe("REJECT");
    expect(gatekeeperOutput.passProductPool).toHaveLength(1);
    expect(() =>
      gatekeeperOutput.passProductPool.forEach((candidate) =>
        passProductCandidateSchema.parse(candidate),
      ),
    ).not.toThrow();

    logFinalRecommendation(gatekeeperInput, gatekeeperOutput);
  });
});
