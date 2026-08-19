import { getOpenAIClient } from "./openai-client";
import { buildCustomerTastePrompt } from "./prompts/customer-taste.prompt";
import {
  customerTasteAiOutputSchema,
  customerTasteAiJsonSchema,
  customerTasteProfileSchema,
} from "@/lib/validation/customer-taste.schema";
import type {
  CorePreference,
  CustomerAiTrait,
  CustomerTasteAnalysis,
  CustomerTasteInput,
  SelectedProductProfile,
} from "@/types/customer";

// TASK-202: Customer Taste Discovery Engine
// Source: docs/[개발 문서] 09_PRODUCT_BACKLOG.md "TASK-202", docs/[개발 문서] 07_DATABASE_SCHEMA.md 4.5
//
// 이 파일은 추천 엔진이 아니다. 고객이 이미 선택한 제품들의 Core4/AI Product Trait에서
// "반복되는 취향"을 해석하는 것까지만 담당한다. 어떤 제품을 추천할지, Event와 맞는지는 다루지 않는다.

export const CUSTOMER_TASTE_MODEL =
  process.env.OPENAI_CUSTOMER_TASTE_MODEL ?? "gpt-4o-mini";

// core4 값 하나를 개별 관측치 배열로 펼친다. 배열형 Core4(대등한 두 번째 몸체)는 각 원소를
// 그대로 관측치로 센다 — TASK-201 schema의 의미를 유지한다. null은 관측치에 포함하지 않는다.
function flattenObservations(value: string | string[] | null): string[] {
  if (value === null) return [];
  return Array.isArray(value) ? value : [value];
}

const CORE4_AXES = ["colorTone", "silhouetteForm", "material", "monogramDensity"] as const;

// 07_DATABASE_SCHEMA.md 4.5 core_preference: 축마다 "반복 관측된" 값만 배열로 담는다.
// 2개 이상 제품에서 확인된 값만 포함한다(단순 1회 등장은 제외 — 억지 다수결 금지).
// 근거가 없는 축은 빈 배열([])을 사용한다(null 대신).
export function computeCorePreference(
  profiles: SelectedProductProfile[],
): CorePreference {
  const result = {
    colorTone: [] as string[],
    silhouetteForm: [] as string[],
    material: [] as string[],
    monogramDensity: [] as string[],
  };

  for (const axis of CORE4_AXES) {
    const counts = new Map<string, number>();
    for (const profile of profiles) {
      for (const value of flattenObservations(profile.core4[axis])) {
        counts.set(value, (counts.get(value) ?? 0) + 1);
      }
    }
    result[axis] = [...counts.entries()]
      .filter(([, count]) => count >= 2)
      .map(([value]) => value);
  }

  return result;
}

// CorePreference는 index signature가 없는 명시적 인터페이스라, downstream(TASK-204/205)의
// core_preference: Record<string, unknown> 필드에 이름 있는 CorePreference 변수를 직접
// 대입하면 TS가 "Index signature is missing"으로 거부한다(별도 `as` 캐스트가 필요해진다).
// 필드를 하나씩 옮겨 담아 새 object literal을 만들면 TS가 캐스트 없이도 Record<string,
// unknown>으로 구조적 대입을 허용하므로, 이 함수가 유일하고 명시적인 변환 지점이 된다.
export function toCorePreferenceRecord(
  corePreference: CorePreference,
): Record<string, unknown> {
  return {
    colorTone: corePreference.colorTone,
    silhouetteForm: corePreference.silhouetteForm,
    material: corePreference.material,
    monogramDensity: corePreference.monogramDensity,
  };
}

// 어떤 제품이 core_preference의 반복 축 중 하나 이상에 실제로 기여했는지 찾는다.
function productsContributingToCorePreference(
  profiles: SelectedProductProfile[],
  corePreference: CorePreference,
): string[] {
  const contributing = new Set<string>();
  for (const profile of profiles) {
    for (const axis of CORE4_AXES) {
      const observed = flattenObservations(profile.core4[axis]);
      if (observed.some((value) => corePreference[axis].includes(value))) {
        contributing.add(profile.product_id);
        break;
      }
    }
  }
  return [...contributing];
}

export class CustomerTasteValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomerTasteValidationError";
  }
}

// AI Trait이 인용한 product_id가 실제 입력 제품 목록 안에 있는지 확인한다(환각 방지).
function assertKnownEvidenceProductIds(
  aiTraits: CustomerAiTrait[],
  knownProductIds: Set<string>,
): void {
  for (const trait of aiTraits) {
    const unknown = trait.evidenceProductIds.filter((id) => !knownProductIds.has(id));
    if (unknown.length > 0) {
      throw new CustomerTasteValidationError(
        `AI Trait "${trait.name}"이 입력에 없는 product_id를 근거로 인용했습니다: ${unknown.join(", ")}`,
      );
    }
  }
}

export type CustomerTasteGenerator = (
  input: CustomerTasteInput,
  corePreference: CorePreference,
) => Promise<unknown>;

const generateWithOpenAI: CustomerTasteGenerator = async (input, corePreference) => {
  const prompt = buildCustomerTastePrompt(input, corePreference);
  const response = await getOpenAIClient().responses.create({
    model: CUSTOMER_TASTE_MODEL,
    instructions: prompt.instructions,
    input: prompt.input,
    text: {
      format: {
        type: "json_schema",
        name: "customer_taste_analysis",
        strict: true,
        schema: customerTasteAiJsonSchema,
      },
    },
  });

  if (!response.output_text) {
    throw new Error("OpenAI returned an empty Customer Taste response");
  }

  try {
    return JSON.parse(response.output_text) as unknown;
  } catch (error) {
    throw new Error("OpenAI returned invalid JSON for Customer Taste", {
      cause: error,
    });
  }
};

export async function discoverCustomerTaste(
  input: CustomerTasteInput,
  generate: CustomerTasteGenerator = generateWithOpenAI,
): Promise<CustomerTasteAnalysis & { evidence_product_ids: string[] }> {
  if (input.selections.length === 0) {
    throw new Error("selections가 비어 있습니다.");
  }

  // Pattern Analysis -> Core Preference Extraction (결정적 계산, LLM 미사용)
  const corePreference = computeCorePreference(input.productProfiles);

  // AI Trait Discovery (LLM)
  const rawAiOutput = await generate(input, corePreference);
  const aiParsed = customerTasteAiOutputSchema.safeParse(rawAiOutput);
  if (!aiParsed.success) {
    throw new CustomerTasteValidationError(
      `AI Trait Discovery 결과 검증 실패: ${aiParsed.error.issues
        .map((issue) => `${issue.path.join(".")} - ${issue.message}`)
        .join("; ")}`,
    );
  }

  const knownProductIds = new Set(input.selections.map((s) => s.product_id));
  assertKnownEvidenceProductIds(aiParsed.data.ai_traits, knownProductIds);

  const evidenceProductIds = new Set<string>([
    ...productsContributingToCorePreference(input.productProfiles, corePreference),
    ...aiParsed.data.ai_traits.flatMap((trait) => trait.evidenceProductIds),
  ]);

  const result = {
    taste_summary: aiParsed.data.taste_summary,
    core_preference: corePreference,
    ai_traits: aiParsed.data.ai_traits,
    evidence_product_ids: [...evidenceProductIds],
  };

  // 07_DATABASE_SCHEMA.md 4.2/10.3와 동일한 원칙: 검증에 실패한 AI 결과는 최종 결과로 인정하지 않는다.
  const finalParsed = customerTasteProfileSchema.safeParse(result);
  if (!finalParsed.success) {
    throw new CustomerTasteValidationError(
      `Customer Taste Profile 검증 실패: ${finalParsed.error.issues
        .map((issue) => `${issue.path.join(".")} - ${issue.message}`)
        .join("; ")}`,
    );
  }

  return finalParsed.data;
}
