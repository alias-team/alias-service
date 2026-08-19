// TASK-205: Gatekeeper 실행 검증
//
// 실제 seed의 Event와 Product를 GatekeeperInput으로 조립하고,
// 재현 가능한 테스트 generator를 주입해 evaluateGatekeeper()의 전체 흐름을 확인한다.
//
//   pnpm exec vitest run scripts/demo-gatekeeper.test.ts --reporter=verbose

import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { evaluateGatekeeper } from "@/lib/ai/gatekeeper";
import { passProductCandidateSchema } from "@/lib/validation/issue-composition.schema";
import type {
  GatekeeperCandidateInput,
  GatekeeperInput,
} from "@/types/gatekeeper";

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

const ROOT = path.resolve(import.meta.dirname, "..");
const EVENT_CODE = "EVT_TRAVEL_EDIT_2026";
const CUSTOMER_CODE = "DEMO-CUSTOMER-A";

function readSeed<T>(fileName: string): T {
  return JSON.parse(
    readFileSync(path.join(ROOT, "seed", fileName), "utf8"),
  ) as T;
}

function createCandidate(
  product: SeedProduct,
  index: number,
): GatekeeperCandidateInput {
  const repeatsExistingPreference = index === 2;

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
        material: product.material,
        color: product.color_name,
        category: product.category,
      },
      ai_product_traits: [
        {
          name: "Travel-ready utility",
          reason: product.description,
        },
      ],
      evidence: [
        {
          source: "mcm_seed_source_30.json.description",
          text: product.description,
        },
      ],
    },
    customer_product_match: {
      connection: true,
      core4_connections: [
        {
          attribute: "category",
          customer_value: "mobile bags and accessories",
          product_value: product.category,
        },
      ],
      trait_connections: [
        {
          customer_trait: "practical mobility",
          product_trait: "Travel-ready utility",
        },
      ],
      matching_reason:
        "고객의 이동성과 실용성 선호가 상품의 여행용 구조와 연결됩니다.",
      evidence: [
        `${CUSTOMER_CODE}의 실제 seed 선택 이력에는 업무 및 이동용 가방이 포함됩니다.`,
      ],
    },
    meaning_bridge:
      "고객의 실용적인 이동 취향을 Travel Edit의 modern nomad 관점으로 확장합니다.",
    extension_result: repeatsExistingPreference
      ? {
          extension_type: "existing_preference_repetition",
          existing_preference: "컴팩트한 이동용 액세서리",
          new_expression: "동일한 이동용 액세서리 표현",
          extension_reason:
            "새로운 발견보다 기존 이동 액세서리 선호를 반복합니다.",
        }
      : {
          extension_type: "meaningful_extension",
          existing_preference: "업무와 일상을 위한 실용적인 가방",
          new_expression: "modern nomad를 위한 여행 특화 구조",
          extension_reason:
            "기존 실용성 선호를 여행과 이동성이라는 새로운 사용 맥락으로 확장합니다.",
        },
  };
}

function createGatekeeperInput(): GatekeeperInput {
  const products = readSeed<SeedProduct[]>("mcm_seed_source_30.json");
  const { events } = readSeed<SeedEventsFile>("mcm_seed_events_final.json");
  const { customer_product_selections: selections } =
    readSeed<SeedCustomersFile>("mcm_seed_customers_selections_final.json");

  const event = events.find(({ event_code }) => event_code === EVENT_CODE);
  if (!event) throw new Error(`Seed Event를 찾을 수 없습니다: ${EVENT_CODE}`);

  const productById = new Map(
    products.map((product) => [product.product_id, product]),
  );
  const relatedProducts = event.related_product_ids.map((productId) => {
    const product = productById.get(productId);
    if (!product) throw new Error(`Seed Product를 찾을 수 없습니다: ${productId}`);
    return product;
  });
  const evidenceProductIds = selections
    .filter(({ customer_code }) => customer_code === CUSTOMER_CODE)
    .map(({ product_code }) => product_code);

  return {
    event_id: event.event_code,
    customer_profile: {
      taste_summary:
        "업무와 일상에서 이동하기 편하고 수납이 실용적인 MCM 제품을 선호합니다.",
      core_preference: {
        use_case: "work and everyday mobility",
        silhouette: "functional bags and accessories",
      },
      ai_traits: ["practical mobility", "organized carry"],
      evidence_product_ids: evidenceProductIds,
    },
    event_meaning_profile: {
      event_id: event.event_code,
      event_theme: event.name,
      brand_direction: event.campaign_overview,
      event_traits: ["mobility", "modern nomad", "functional innovation"],
      evidence: [
        {
          source: "mcm_seed_events_final.json.brand_message",
          text: event.brand_message,
        },
        ...(event.collection_concept
          ? [
              {
                source: "mcm_seed_events_final.json.collection_concept",
                text: event.collection_concept,
              },
            ]
          : []),
      ],
    },
    customer_event_match: {
      connection: true,
      matching_reason:
        "고객의 실용적인 이동 선호가 Event의 mobility와 modern nomad 방향에 연결됩니다.",
      evidence: [
        `${CUSTOMER_CODE}의 seed 구매 및 위시리스트 이력을 근거로 구성한 검증용 match입니다.`,
      ],
    },
    candidates: relatedProducts.map(createCandidate),
  };
}

describe("TASK-205 Gatekeeper demo", () => {
  it("evaluates seed-backed candidates and exposes the TASK-206 passProductPool", async () => {
    const input = createGatekeeperInput();
    const result = await evaluateGatekeeper(input, async (eligibleInput) => ({
      evaluations: eligibleInput.candidates.map((candidate, index) =>
        index === 0
          ? {
              product_id: candidate.product_id,
              decision: "PASS" as const,
              reason:
                "기존 실용성 선호를 여행 특화 수납과 이동성으로 확장할 근거가 충분합니다.",
              editorial_angle: "일상의 실용성을 modern nomad의 이동성으로 확장",
            }
          : {
              product_id: candidate.product_id,
              decision: "REJECT" as const,
              reason:
                "상품과 Event의 연결은 있으나 새로운 발견을 만들 차별화가 부족합니다.",
              editorial_angle: null,
            },
      ),
    }));

    expect(result.event_id).toBe(EVENT_CODE);
    expect(result.evaluations).toHaveLength(3);
    expect(result.evaluations.map(({ decision }) => decision)).toEqual([
      "PASS",
      "REJECT",
      "REJECT",
    ]);
    expect(result.evaluations[2].failed_rules).toEqual([
      "MEANINGFUL_EXTENSION_REQUIRED",
    ]);
    expect(result.passProductPool).toHaveLength(1);
    expect(() =>
      result.passProductPool.forEach((candidate) =>
        passProductCandidateSchema.parse(candidate),
      ),
    ).not.toThrow();

    console.log("\n== TASK-205 Gatekeeper 실행 결과 ==");
    console.log("Event ID:", result.event_id);
    console.log("전체 evaluations:");
    console.log(
      JSON.stringify(
        result.evaluations.map(
          ({ product_id, decision, reason, failed_rules }) => ({
            product_id,
            decision,
            reason,
            failed_rules,
          }),
        ),
        null,
        2,
      ),
    );
    console.log("passProductPool 개수:", result.passProductPool.length);
    console.log("passProductPool 전체 JSON:");
    console.log(JSON.stringify(result.passProductPool, null, 2));
    console.log(
      "TASK-206 전달 스키마 검증:",
      "PASS (PassProductCandidate[])",
    );
  });
});
