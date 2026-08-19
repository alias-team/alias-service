import { z } from "zod";

import {
  COLOR_TONE_VALUES,
  SILHOUETTE_FORM_VALUES,
  MATERIAL_VALUES,
  MONOGRAM_DENSITY_VALUES,
} from "@/lib/ai/core4";

// 07_DATABASE_SCHEMA.md 4.5 core_preference 예시는 축마다 배열을 사용한다
// (product_profiles.core4와 달리, 반복 관측된 값의 "집합"을 표현하는 구조이기 때문).
// 값 자체는 TASK-201의 Core4 Enum(core4.ts)을 그대로 재사용한다 — 새 값을 만들지 않는다.
export const corePreferenceSchema = z
  .object({
    colorTone: z.array(z.enum(COLOR_TONE_VALUES)),
    silhouetteForm: z.array(z.enum(SILHOUETTE_FORM_VALUES)),
    material: z.array(z.enum(MATERIAL_VALUES)),
    monogramDensity: z.array(z.enum(MONOGRAM_DENSITY_VALUES)),
  })
  .strict();

// 07_DATABASE_SCHEMA.md 4.5 ai_traits 예시: {name, reason, evidenceProductIds}.
// 핵심 규칙: "AI Trait은 단일 제품만으로 생성하지 않는다" -> evidenceProductIds에 서로 다른
// product_id가 최소 2개 있어야 한다(배열 길이만으로는 ["P1","P1"] 같은 중복을 걸러내지 못한다).
export const customerAiTraitSchema = z
  .object({
    name: z.string().trim().min(1),
    reason: z.string().trim().min(1),
    evidenceProductIds: z
      .array(z.string().trim().min(1))
      .min(2)
      .refine((ids) => new Set(ids).size >= 2, {
        message: "evidenceProductIds에는 서로 다른 product_id가 최소 2개 있어야 합니다.",
      }),
  })
  .strict();

// LLM 호출(AI Trait Discovery) 결과만 검증하는 스키마. core_preference는 별도 결정 로직(순수 함수)의
// 산출물이라 LLM 응답에는 포함하지 않는다.
export const customerTasteAiOutputSchema = z
  .object({
    taste_summary: z.string().trim().min(1),
    ai_traits: z.array(customerAiTraitSchema),
  })
  .strict();

export const customerTasteAiJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["taste_summary", "ai_traits"],
  properties: {
    taste_summary: { type: "string", minLength: 1 },
    ai_traits: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "reason", "evidenceProductIds"],
        properties: {
          name: { type: "string", minLength: 1 },
          reason: { type: "string", minLength: 1 },
          evidenceProductIds: {
            type: "array",
            minItems: 2,
            items: { type: "string", minLength: 1 },
          },
        },
      },
    },
  },
} as const;

// core_preference(결정 로직 산출물) + AI 응답을 합친 최종 Customer Taste Profile 전체를 검증한다.
// 07_DATABASE_SCHEMA.md 10.2: "Customer Taste Profile - 근거 제품 ID 존재" -> evidence_product_ids 최소 1개.
export const customerTasteProfileSchema = z
  .object({
    taste_summary: z.string().trim().min(1),
    core_preference: corePreferenceSchema,
    ai_traits: z.array(customerAiTraitSchema),
    evidence_product_ids: z.array(z.string().trim().min(1)).min(1),
  })
  .strict();
