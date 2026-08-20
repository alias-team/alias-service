// TASK-201: Product Understanding Engine
// Source: documents/[개발 문서] 07_DATABASE_SCHEMA.md (4.2 product_profiles)
//
// AI 응답을 저장/반환하기 전 검증하는 Zod Schema.
// 07_DATABASE_SCHEMA.md 4.2 핵심 규칙:
// - AI Product Trait은 2~3개를 기준으로 저장한다.
// - 각 Trait에는 이름, 이유, Evidence가 있어야 한다.
// - core4의 값은 허용된 Enum 또는 null만 허용한다.
// - 검증에 실패한 AI 결과는 저장하지 않는다.

import { z } from "zod";
import {
  Core4Schema,
  COLOR_TONE_VALUES,
  SILHOUETTE_FORM_VALUES,
  MATERIAL_VALUES,
  MONOGRAM_DENSITY_VALUES,
  // @ts-expect-error TS5097: 플레인 node로 직접 실행하기 위해 명시적 .ts 확장자를 유지한다
  // (moduleResolution: "bundler"에서는 allowImportingTsExtensions 없이 tsc가 이를 거부하지만,
  // 런타임 동작에는 영향이 없다).
} from "./core4.ts";

// 07_DATABASE_SCHEMA.md 4.2 ai_product_traits 예시의 evidence 형태: { source, text }
const EvidenceItemSchema = z.object({
  source: z.enum(["product_image", "product_description"]),
  text: z.string().min(1),
});

const AiProductTraitSchema = z.object({
  name: z.string().min(1),
  reason: z.string().min(1),
  evidence: z.array(EvidenceItemSchema).min(1),
});

export const ProductProfileAiOutputSchema = z.object({
  core4: Core4Schema,
  ai_product_traits: z.array(AiProductTraitSchema).min(2).max(3),
  evidence: z.array(EvidenceItemSchema).min(1),
});

export type ProductProfileAiOutput = z.infer<typeof ProductProfileAiOutputSchema>;

// OpenAI Structured Outputs(json_schema, strict)용 스키마.
// 위 ProductProfileAiOutputSchema(Zod)와 반드시 같은 제약을 유지한다 — 이 스키마는 API 응답
// 생성 단계에서, Zod는 응답 이후 검증 단계에서 동일한 제약(특히 ai_product_traits 2~3개,
// 07_DATABASE_SCHEMA.md 4.2 "AI Product Trait은 2~3개를 기준으로 저장한다")을 강제한다.
// strict mode 요구사항: 모든 object에 additionalProperties:false, properties의 모든 key를
// required에 포함해야 한다(nullable은 required 생략이 아니라 type/anyOf로 표현한다).
const EVIDENCE_ITEM_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["source", "text"],
  properties: {
    source: { type: "string", enum: ["product_image", "product_description"] },
    text: { type: "string", minLength: 1 },
  },
} as const;

export const productProfileAiJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["core4", "ai_product_traits", "evidence"],
  properties: {
    core4: {
      type: "object",
      additionalProperties: false,
      required: ["colorTone", "silhouetteForm", "material", "monogramDensity"],
      properties: {
        colorTone: {
          type: ["string", "null"],
          enum: [...COLOR_TONE_VALUES, null],
        },
        silhouetteForm: {
          type: ["string", "null"],
          enum: [...SILHOUETTE_FORM_VALUES, null],
        },
        // material/monogramDensity: AI_CORE4_SCHEMA.md 4.3/4.4 Multi-value 예외
        // (대등한 두 번째 몸체가 실제로 존재할 때만) 그대로 유지 — 단일 값 | 2개 이상 배열 | null.
        material: {
          anyOf: [
            { type: "string", enum: [...MATERIAL_VALUES] },
            {
              type: "array",
              items: { type: "string", enum: [...MATERIAL_VALUES] },
              minItems: 2,
            },
            { type: "null" },
          ],
        },
        monogramDensity: {
          anyOf: [
            { type: "string", enum: [...MONOGRAM_DENSITY_VALUES] },
            {
              type: "array",
              items: { type: "string", enum: [...MONOGRAM_DENSITY_VALUES] },
              minItems: 2,
            },
            { type: "null" },
          ],
        },
      },
    },
    ai_product_traits: {
      type: "array",
      minItems: 2,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "reason", "evidence"],
        properties: {
          name: { type: "string", minLength: 1 },
          reason: { type: "string", minLength: 1 },
          evidence: { type: "array", minItems: 1, items: EVIDENCE_ITEM_JSON_SCHEMA },
        },
      },
    },
    evidence: { type: "array", minItems: 1, items: EVIDENCE_ITEM_JSON_SCHEMA },
  },
} as const;

export class ProductProfileValidationError extends Error {
  readonly issues: z.ZodError["issues"];

  constructor(issues: z.ZodError["issues"]) {
    super(
      `Product Profile 검증 실패: ${issues
        .map((issue) => `${issue.path.join(".")} - ${issue.message}`)
        .join("; ")}`
    );
    this.name = "ProductProfileValidationError";
    this.issues = issues;
  }
}
