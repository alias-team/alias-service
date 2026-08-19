// TASK-204-C: Meaning Matching → Gatekeeper Handoff
//
// 실제 seed raw(products/events/customer selections)는 파일에서 읽는다. TASK-201/202/203의
// 실제 산출물(product_profiles/customer_taste_profiles/event_meaning_profiles)은 아직
// 비어 있으므로(TASK-204-A/C 분석에서 확인), scripts/demo-gatekeeper.test.ts와 동일하게
// 그 upstream profile만 계약에 맞는 명시적 fixture로 직접 구성한다.

import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { evaluateGatekeeper } from "@/lib/ai/gatekeeper";
import { gatekeeperInputSchema } from "@/lib/validation/gatekeeper.schema";
import { passProductCandidateSchema } from "@/lib/validation/issue-composition.schema";
import type {
  MeaningMatchingCandidateProduct,
  MeaningMatchingInput,
  MeaningMatchingOutput,
} from "@/types/meaning-matching";

import { adaptMeaningMatchingToGatekeeperInput } from "./meaning-matching-to-gatekeeper";

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

const ROOT = path.resolve(import.meta.dirname, "../../..");
const EVENT_CODE = "EVT_TRAVEL_EDIT_2026";
const CUSTOMER_CODE = "DEMO-CUSTOMER-A";

function readSeed<T>(fileName: string): T {
  return JSON.parse(
    readFileSync(path.join(ROOT, "seed", fileName), "utf8"),
  ) as T;
}

function buildCandidateProduct(
  product: SeedProduct,
): MeaningMatchingCandidateProduct {
  return {
    product_id: product.product_id,
    product: {
      name: product.product_name,
      category: product.category,
      collection: null,
      image_url: product.image_url,
    },
    product_profile: {
      core4: { material: product.material, color: product.color_name },
      ai_product_traits: [
        { name: "Travel-ready utility", reason: product.description },
      ],
      evidence: [
        { source: "mcm_seed_source_30.json.description", text: product.description },
      ],
    },
  };
}

// TASK-201/202/203의 실제 AI 산출물은 아직 seed/DB에 없으므로(TASK-204-C 분석 확인),
// 실제 seed raw(products/events/selections)에 근거해 upstream profile을 fixture로
// 직접 구성한다 — scripts/demo-gatekeeper.test.ts와 동일한 패턴.
function buildMeaningMatchingInput(): MeaningMatchingInput {
  const products = readSeed<SeedProduct[]>("mcm_seed_source_30.json");
  const { events } = readSeed<SeedEventsFile>("mcm_seed_events_final.json");
  const { customer_product_selections: selections } = readSeed<SeedCustomersFile>(
    "mcm_seed_customers_selections_final.json",
  );

  const event = events.find(({ event_code }) => event_code === EVENT_CODE);
  if (!event) throw new Error(`Seed Event를 찾을 수 없습니다: ${EVENT_CODE}`);

  const productById = new Map(products.map((product) => [product.product_id, product]));
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
        { source: "mcm_seed_events_final.json.brand_message", text: event.brand_message },
      ],
    },
    candidates: relatedProducts.map(buildCandidateProduct),
  };
}

function buildMeaningMatchingOutput(
  matchingInput: MeaningMatchingInput,
): MeaningMatchingOutput {
  return {
    event_id: matchingInput.event_id,
    customer_event_match: {
      connection: true,
      matching_reason:
        "고객의 실용적인 이동 선호가 Event의 mobility 및 modern nomad 방향에 연결됩니다.",
      evidence: [`${CUSTOMER_CODE}의 seed 선택 이력을 근거로 구성한 검증용 match입니다.`],
    },
    candidates: matchingInput.candidates.map((candidate, index) => ({
      product_id: candidate.product_id,
      customer_product_match: {
        connection: true,
        core4_connections: [
          {
            attribute: "material",
            customer_value: "practical utility",
            product_value: String(candidate.product_profile.core4),
          },
        ],
        trait_connections: [
          {
            customer_trait: "practical mobility",
            product_trait: "Travel-ready utility",
          },
        ],
        matching_reason: `고객의 실용적 이동 취향이 ${candidate.product_id}의 여행용 구조와 연결됩니다.`,
        evidence: [`${CUSTOMER_CODE}의 실제 seed 선택 이력에는 업무 및 이동용 가방이 포함됩니다.`],
      },
      meaning_bridge:
        "고객의 실용적인 이동 취향을 Travel Edit의 modern nomad 관점으로 확장합니다.",
      extension_result:
        index === 0
          ? {
              extension_type: "meaningful_extension" as const,
              existing_preference: "업무와 일상을 위한 실용적인 가방",
              new_expression: "modern nomad를 위한 여행 특화 구조",
              extension_reason:
                "기존 실용성 선호를 여행과 이동성이라는 새로운 사용 맥락으로 확장합니다.",
            }
          : {
              extension_type: "existing_preference_repetition" as const,
              existing_preference: "컴팩트한 이동용 액세서리",
              new_expression: "동일한 이동용 액세서리 표현",
              extension_reason: "새로운 발견보다 기존 이동 액세서리 선호를 반복합니다.",
            },
    })),
  };
}

describe("adaptMeaningMatchingToGatekeeperInput", () => {
  it("assembles a complete GatekeeperInput from TASK-204 output and upstream data", () => {
    const matchingInput = buildMeaningMatchingInput();
    const matchingOutput = buildMeaningMatchingOutput(matchingInput);

    const result = adaptMeaningMatchingToGatekeeperInput(matchingOutput, matchingInput);

    expect(result.event_id).toBe(EVENT_CODE);
    expect(result.candidates).toHaveLength(3);
  });

  it("passes gatekeeperInputSchema validation", () => {
    const matchingInput = buildMeaningMatchingInput();
    const matchingOutput = buildMeaningMatchingOutput(matchingInput);

    const result = adaptMeaningMatchingToGatekeeperInput(matchingOutput, matchingInput);

    expect(() => gatekeeperInputSchema.parse(result)).not.toThrow();
  });

  it("carries the customer_profile through unchanged", () => {
    const matchingInput = buildMeaningMatchingInput();
    const matchingOutput = buildMeaningMatchingOutput(matchingInput);

    const result = adaptMeaningMatchingToGatekeeperInput(matchingOutput, matchingInput);

    expect(result.customer_profile).toEqual(matchingInput.customer_profile);
  });

  it("carries the event_meaning_profile through unchanged", () => {
    const matchingInput = buildMeaningMatchingInput();
    const matchingOutput = buildMeaningMatchingOutput(matchingInput);

    const result = adaptMeaningMatchingToGatekeeperInput(matchingOutput, matchingInput);

    expect(result.event_meaning_profile).toEqual(matchingInput.event_meaning_profile);
  });

  it("joins each candidate's product/product_profile and matching result by matching product_id", () => {
    const matchingInput = buildMeaningMatchingInput();
    const matchingOutput = buildMeaningMatchingOutput(matchingInput);

    const result = adaptMeaningMatchingToGatekeeperInput(matchingOutput, matchingInput);

    for (const upstream of matchingInput.candidates) {
      const output = matchingOutput.candidates.find(
        (candidate) => candidate.product_id === upstream.product_id,
      );
      const assembled = result.candidates.find(
        (candidate) => candidate.product_id === upstream.product_id,
      );
      expect(assembled?.product).toEqual(upstream.product);
      expect(assembled?.product_profile).toEqual(upstream.product_profile);
      expect(assembled?.customer_product_match).toEqual(output?.customer_product_match);
      expect(assembled?.meaning_bridge).toBe(output?.meaning_bridge);
      expect(assembled?.extension_result).toEqual(output?.extension_result);
    }
  });

  it("assembles correctly by product_id even when the AI output candidate order differs from the input", () => {
    const matchingInput = buildMeaningMatchingInput();
    const matchingOutput = buildMeaningMatchingOutput(matchingInput);
    const shuffled: MeaningMatchingOutput = {
      ...matchingOutput,
      candidates: [...matchingOutput.candidates].reverse(),
    };

    const result = adaptMeaningMatchingToGatekeeperInput(shuffled, matchingInput);

    expect(result.candidates.map((c) => c.product_id)).toEqual(
      matchingInput.candidates.map((c) => c.product_id),
    );
  });

  it("rejects a Meaning Matching Output missing a candidate present in the upstream input", () => {
    const matchingInput = buildMeaningMatchingInput();
    const matchingOutput = buildMeaningMatchingOutput(matchingInput);
    const incomplete: MeaningMatchingOutput = {
      ...matchingOutput,
      candidates: matchingOutput.candidates.slice(1),
    };

    expect(() =>
      adaptMeaningMatchingToGatekeeperInput(incomplete, matchingInput),
    ).toThrow();
  });

  it("rejects a Meaning Matching Output containing an unknown product_id", () => {
    const matchingInput = buildMeaningMatchingInput();
    const matchingOutput = buildMeaningMatchingOutput(matchingInput);
    const withUnknown: MeaningMatchingOutput = {
      ...matchingOutput,
      candidates: [
        ...matchingOutput.candidates,
        { ...matchingOutput.candidates[0], product_id: "UNKNOWN_PRODUCT" },
      ],
    };

    expect(() =>
      adaptMeaningMatchingToGatekeeperInput(withUnknown, matchingInput),
    ).toThrow();
  });

  it("rejects a Meaning Matching Output containing a duplicate product_id", () => {
    const matchingInput = buildMeaningMatchingInput();
    const matchingOutput = buildMeaningMatchingOutput(matchingInput);
    const withDuplicate: MeaningMatchingOutput = {
      ...matchingOutput,
      candidates: [...matchingOutput.candidates, matchingOutput.candidates[0]],
    };

    expect(() =>
      adaptMeaningMatchingToGatekeeperInput(withDuplicate, matchingInput),
    ).toThrow();
  });

  it("rejects mismatched event_id between the Meaning Matching Output and upstream input", () => {
    const matchingInput = buildMeaningMatchingInput();
    const matchingOutput = buildMeaningMatchingOutput(matchingInput);
    const mismatched: MeaningMatchingOutput = {
      ...matchingOutput,
      event_id: "OTHER_EVENT",
    };

    expect(() =>
      adaptMeaningMatchingToGatekeeperInput(mismatched, matchingInput),
    ).toThrow();
  });

  it("rejects a duplicate product_id within the upstream candidates", () => {
    const matchingInput = buildMeaningMatchingInput();
    const matchingOutput = buildMeaningMatchingOutput(matchingInput);
    const duplicatedInput: MeaningMatchingInput = {
      ...matchingInput,
      candidates: [...matchingInput.candidates, matchingInput.candidates[0]],
    };

    expect(() =>
      adaptMeaningMatchingToGatekeeperInput(matchingOutput, duplicatedInput),
    ).toThrow();
  });

  it("feeds the assembled GatekeeperInput into evaluateGatekeeper end to end (204 -> 205, mocked)", async () => {
    const matchingInput = buildMeaningMatchingInput();
    const matchingOutput = buildMeaningMatchingOutput(matchingInput);
    const gatekeeperInput = adaptMeaningMatchingToGatekeeperInput(
      matchingOutput,
      matchingInput,
    );

    const result = await evaluateGatekeeper(gatekeeperInput, async (eligibleInput) => ({
      evaluations: eligibleInput.candidates.map((candidate) => ({
        product_id: candidate.product_id,
        decision: "PASS" as const,
        reason: "The evidence supports a meaningful new discovery.",
        editorial_angle: "일상의 실용성을 modern nomad의 이동성으로 확장",
      })),
    }));

    expect(result.event_id).toBe(EVENT_CODE);
    // candidate index 0은 meaningful_extension, 나머지는 existing_preference_repetition이라
    // TASK-205의 결정론적 규칙(MEANINGFUL_EXTENSION_REQUIRED)에 의해 AI 호출 없이 REJECT된다.
    expect(result.evaluations).toHaveLength(3);
    expect(result.passProductPool).toHaveLength(1);
    expect(() =>
      result.passProductPool.forEach((candidate) =>
        passProductCandidateSchema.parse(candidate),
      ),
    ).not.toThrow();
  });
});
