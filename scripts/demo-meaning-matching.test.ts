// TASK-204-C: Meaning Matching -> Gatekeeper 로그 검증용 통합 테스트
//
// 목적: 실제 OpenAI를 호출하기 전에, 204(matchMeaning) -> adapter
// (adaptMeaningMatchingToGatekeeperInput) -> 205(evaluateGatekeeper)로 이어지는 데이터
// 흐름이 사람이 읽을 수 있는 로그로도 정상적으로 보이는지 확인한다. AI 품질 검증이 아니다.
//
// 데이터 출처 구분 (반드시 지킬 것 — 실제 산출물처럼 위장하지 않는다):
//   - 실제 seed: mcm_seed_source_30.json / mcm_seed_events_final.json /
//     mcm_seed_customers_selections_final.json (raw product/event/선택 이력)
//   - 실제 TASK-201 AI 산출물: scripts/fixtures/task201-customer-a-latest-validation.json
//     (Customer A가 실제로 선택한 5개 상품의 gpt-4o 실행 결과 — ai_generated)
//   - 아래는 전부 손작성 fixture다(TASK-201/202/203 실제 실행 결과 아님):
//     - customer_profile.taste_summary / ai_traits — core_preference만 실제 TASK-201
//       산출물에 대해 TASK-202의 실제 함수 computeCorePreference()를 돌려 얻는다(AI 호출
//       없이 결정론적으로 계산되는 순수 함수라 실행 가능). taste_summary/ai_traits까지
//       생성하려면 discoverCustomerTaste()의 OpenAI 호출이 필요해 이 테스트 범위 밖이다.
//     - event_meaning_profile — EVT_TRAVEL_EDIT_2026의 실제 seed 필드(name/
//       campaign_overview/brand_message/collection_concept)에만 근거해 손으로 구성했다.
//       TASK-203의 새로운 비즈니스 규칙을 추가하지 않는다.
//     - candidate product_profile — Event related products 3개의 실제 raw
//       description/material/category에만 근거해 손으로 구성했다. 실제 Core4 분류가
//       아니므로 core4 필드명도 colorTone/silhouetteForm 등 정식 Core4 키를 쓰지 않고
//       raw 값 그대로(material_raw/category_raw/color_raw)를 담아 구분한다.
//
//   pnpm exec vitest run scripts/demo-meaning-matching.test.ts --reporter=verbose

import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { matchMeaning } from "@/lib/ai/meaning-matching";
import { evaluateGatekeeper } from "@/lib/ai/gatekeeper";
import { computeCorePreference, toCorePreferenceRecord } from "@/lib/ai/customer-taste-discovery";
import { adaptMeaningMatchingToGatekeeperInput } from "@/lib/pipeline/meaning-matching-to-gatekeeper";
import { gatekeeperInputSchema } from "@/lib/validation/gatekeeper.schema";
import { passProductCandidateSchema } from "@/lib/validation/issue-composition.schema";
import type { SelectedProductProfile } from "@/types/customer";
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

// 실제 TASK-201 산출물(gpt-4o)에서 core_preference만 실제 TASK-202 함수로 계산한다.
// taste_summary/ai_traits는 discoverCustomerTaste()의 OpenAI 호출이 있어야 나오므로
// 이 테스트 범위에서는 위 core_preference 계산 근거를 그대로 설명하는 손작성 fixture다.
function buildCustomerProfile(): MeaningMatchingInput["customer_profile"] {
  const fixture = readTask201Fixture();
  const validatedProfiles: SelectedProductProfile[] = Object.entries(fixture.products)
    .filter(([, entry]) => entry.status === "validated" && entry.profile)
    .map(([productId, entry]) => ({
      product_id: productId,
      core4: entry.profile!.core4,
      ai_product_traits: entry.profile!.ai_product_traits,
    }));

  // task201 fixture의 product_id가 실제 seed 선택 이력(Customer A)과 여전히 일치하는지
  // 확인한다 — fixture가 stale해지면(선택 이력이 바뀌면) 여기서 바로 드러난다.
  const { customer_product_selections: selections } = readSeed<SeedCustomersFile>(
    "mcm_seed_customers_selections_final.json",
  );
  const realSelectionIds = new Set(
    selections
      .filter(({ customer_code }) => customer_code === CUSTOMER_CODE)
      .map(({ product_code }) => product_code),
  );
  for (const { product_id } of validatedProfiles) {
    if (!realSelectionIds.has(product_id)) {
      throw new Error(
        `task201 fixture의 ${product_id}가 ${CUSTOMER_CODE}의 실제 seed 선택 이력에 없습니다 — fixture가 stale합니다.`,
      );
    }
  }

  const corePreference = computeCorePreference(validatedProfiles);

  return {
    // fixture (TASK-202 실제 AI 실행 아님) — 아래 core_preference 계산 결과를 요약 설명한다.
    taste_summary:
      "실제 TASK-201 결과(gpt-4o) 5건에 computeCorePreference()를 적용한 결과, " +
      "구조적(structured)이거나 부드러운(soft) 실루엣과 가죽/시그니처 모노그램 소재를 " +
      "반복적으로 선택하는 패턴이 확인됩니다.",
    // CustomerProfileContext.core_preference는 Record<string, unknown>으로 선언돼 있다
    // (TASK-205가 임의의 Core4 축 구성을 받아들이기 위해 의도적으로 느슨하다) — 실제
    // TASK-202 함수가 반환하는 CorePreference를 toCorePreferenceRecord()로 옮겨 담는다.
    core_preference: toCorePreferenceRecord(corePreference),
    ai_traits: [
      {
        name: "Heritage Material Repetition",
        reason:
          "실제 TASK-201 Product Profile 5건 중 다수가 가죽 또는 시그니처 모노그램 소재로 분류됐습니다.",
        evidenceProductIds: validatedProfiles.map(({ product_id }) => product_id),
      },
    ],
    evidence_product_ids: validatedProfiles.map(({ product_id }) => product_id),
  };
}

// EVT_TRAVEL_EDIT_2026의 실제 seed 필드에만 근거한 손작성 fixture (TASK-203 실제 AI 실행 아님).
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
// fixture (TASK-201 실제 AI 실행 아님) — core4 키를 raw_* 로 두어 실제 Core4 분류와 구분한다.
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
          reason: `실제 seed 원본 설명(mcm_seed_source_30.json)의 핵심 문장을 그대로 인용한 손작성 항목입니다.`,
          evidence: [{ source: "product_description", text: product.description }],
        },
      ],
      evidence: [
        { source: "mcm_seed_source_30.json.description", text: product.description },
      ],
    },
  };
}

function buildMeaningMatchingInput(): MeaningMatchingInput {
  const products = readSeed<SeedProduct[]>("mcm_seed_source_30.json");
  const { events } = readSeed<SeedEventsFile>("mcm_seed_events_final.json");

  const event = events.find(({ event_code }) => event_code === EVENT_CODE);
  if (!event) throw new Error(`Seed Event를 찾을 수 없습니다: ${EVENT_CODE}`);

  const productById = new Map(products.map((product) => [product.product_id, product]));
  const relatedProducts = event.related_product_ids.map((productId) => {
    const product = productById.get(productId);
    if (!product) throw new Error(`Seed Product를 찾을 수 없습니다: ${productId}`);
    return product;
  });

  return {
    event_id: event.event_code,
    customer_profile: buildCustomerProfile(),
    event_meaning_profile: buildEventMeaningProfile(event),
    candidates: relatedProducts.map(buildCandidateProduct),
  };
}

// TASK-204 mock generator: 실제 OpenAI 대신 candidate별로 입력 데이터를 그대로 반영한
// 결정론적 결과를 반환한다. 첫 candidate만 meaningful_extension으로 만들어 TASK-205의
// 결정론적 REJECT 경로(existing_preference_repetition)도 로그에서 함께 보이게 한다.
function mockMeaningMatchingGenerator(input: MeaningMatchingInput) {
  return Promise.resolve({
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
      extension_result:
        index === 0
          ? {
              extension_type: "meaningful_extension" as const,
              existing_preference: "구조적 실루엣과 헤리티지 소재를 반복 선택",
              new_expression: "여행 특화 구조로 확장된 동일 헤리티지 소재 표현",
              extension_reason:
                "기존 소재 선호를 여행이라는 새로운 사용 맥락으로 확장합니다.",
            }
          : {
              extension_type: "existing_preference_repetition" as const,
              existing_preference: "구조적 실루엣과 헤리티지 소재를 반복 선택",
              new_expression: "동일한 헤리티지 소재 표현",
              extension_reason: "새로운 발견보다 기존 소재 선호를 반복합니다.",
            },
    })),
  });
}

function logSection(title: string, payload: unknown) {
  console.log(`\n=== ${title} ===`);
  console.log(JSON.stringify(payload, null, 2));
}

describe("TASK-204 -> TASK-205 handoff demo (no OpenAI calls)", () => {
  it("flows a real-seed + fixture MeaningMatchingInput through matchMeaning -> adapter -> evaluateGatekeeper", async () => {
    const matchingInput = buildMeaningMatchingInput();

    // Event related_product_ids가 실제 seed와 동일한지 먼저 확인한다.
    const { events } = readSeed<SeedEventsFile>("mcm_seed_events_final.json");
    const seedEvent = events.find(({ event_code }) => event_code === EVENT_CODE)!;
    expect(matchingInput.candidates.map((c) => c.product_id)).toEqual(
      seedEvent.related_product_ids,
    );

    logSection("TASK-204 INPUT", {
      event_id: matchingInput.event_id,
      customer_profile: matchingInput.customer_profile,
      event_meaning_profile: matchingInput.event_meaning_profile,
      candidates: matchingInput.candidates.map(({ product_id, product, product_profile }) => ({
        product_id,
        product,
        product_profile,
      })),
    });

    const matchingOutput = await matchMeaning(matchingInput, mockMeaningMatchingGenerator);

    logSection("TASK-204 OUTPUT", {
      event_id: matchingOutput.event_id,
      customer_event_match: matchingOutput.customer_event_match,
      candidates: matchingOutput.candidates,
    });

    const gatekeeperInput = adaptMeaningMatchingToGatekeeperInput(
      matchingOutput,
      matchingInput,
    );

    // 204 Output이 205 Input에서 누락/변형되지 않았는지 확인한다.
    expect(gatekeeperInput.customer_profile).toEqual(matchingInput.customer_profile);
    expect(gatekeeperInput.event_meaning_profile).toEqual(matchingInput.event_meaning_profile);
    expect(gatekeeperInput.customer_event_match).toEqual(matchingOutput.customer_event_match);
    for (const upstream of matchingInput.candidates) {
      const producedMatch = matchingOutput.candidates.find(
        (c) => c.product_id === upstream.product_id,
      )!;
      const assembled = gatekeeperInput.candidates.find(
        (c) => c.product_id === upstream.product_id,
      )!;
      expect(assembled.product).toEqual(upstream.product);
      expect(assembled.product_profile).toEqual(upstream.product_profile);
      expect(assembled.customer_product_match).toEqual(producedMatch.customer_product_match);
      expect(assembled.meaning_bridge).toBe(producedMatch.meaning_bridge);
      expect(assembled.extension_result).toEqual(producedMatch.extension_result);
    }

    // gatekeeperInputSchema 통과 확인 (adapter 내부에서도 이미 검증하지만 여기서 재확인).
    expect(() => gatekeeperInputSchema.parse(gatekeeperInput)).not.toThrow();

    logSection("TASK-205 INPUT", gatekeeperInput);

    const gatekeeperOutput = await evaluateGatekeeper(
      gatekeeperInput,
      async (eligibleInput) => ({
        evaluations: eligibleInput.candidates.map((candidate) => ({
          product_id: candidate.product_id,
          decision: "PASS" as const,
          reason: "기존 헤리티지 소재 선호를 여행 특화 구조로 확장할 근거가 충분합니다.",
          editorial_angle: "헤리티지 소재를 modern nomad의 이동성으로 확장",
        })),
      }),
    );

    logSection("TASK-205 OUTPUT", {
      event_id: gatekeeperOutput.event_id,
      evaluations: gatekeeperOutput.evaluations,
      passProductPool: gatekeeperOutput.passProductPool,
    });

    // candidate 0(meaningful_extension)만 PASS, 나머지는 205의 결정론적 규칙으로 REJECT된다.
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
  });
});
