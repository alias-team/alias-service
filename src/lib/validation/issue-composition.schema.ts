import { z } from "zod";

import { eventMeaningAnalysisSchema } from "./event-meaning.schema";

const nonEmptyString = z.string().trim().min(1);

export const passProductCandidateSchema = z
  .object({
    event_id: nonEmptyString,
    product_id: nonEmptyString,
    decision: z.literal("PASS"),
    product: z
      .object({
        name: nonEmptyString,
        category: nonEmptyString,
        collection: nonEmptyString.nullable(),
        image_url: nonEmptyString.nullable(),
      })
      .strict(),
    product_profile: z
      .object({
        core4: z.unknown(),
        ai_product_traits: z.array(z.unknown()),
      })
      .strict(),
    editorial_angle: nonEmptyString,
    matching_reason: nonEmptyString,
    meaning_bridge: nonEmptyString,
    extension: nonEmptyString,
    existing_preference: nonEmptyString,
    new_expression: nonEmptyString,
    evidence: z.array(nonEmptyString).min(1),
  })
  .strict();

export const eventMeaningProfileSchema = eventMeaningAnalysisSchema
  .extend({
    id: nonEmptyString,
    event_id: nonEmptyString,
    analysis_model: nonEmptyString.nullable(),
    source: z.enum(["seed", "ai_generated"]),
    is_current: z.boolean(),
    created_at: nonEmptyString.optional(),
    updated_at: nonEmptyString.optional(),
  })
  .strict();

export const issueCompositionInputSchema = z
  .object({
    event_id: nonEmptyString,
    eventMeaningProfile: eventMeaningProfileSchema,
    passProductPool: z.array(passProductCandidateSchema).min(1),
  })
  .strict();

export const selectedProductCompositionSchema = z
  .object({
    product_id: nonEmptyString,
    product_role: nonEmptyString,
    discovery_direction: nonEmptyString,
  })
  .strict();

export const brandConnectionSchema = z
  .object({
    event_theme: nonEmptyString,
    brand_direction: nonEmptyString,
    connection_narrative: nonEmptyString,
  })
  .strict();

// passProductPool[].matching_reason/meaning_bridge/extension을 근거로 구성하는
// 고객 개인화 연결 — existing_preference/new_expression/extension_reason과 동일한
// existing->new->why-meaningful 구조를 issue_composition.ts의 ExtensionResult에서
// 그대로 가져왔다(새 개념 아님).
export const personalConnectionSchema = z
  .object({
    existing_preference: nonEmptyString,
    new_expression: nonEmptyString,
    connection_reason: nonEmptyString,
  })
  .strict();

export const issueCompositionSchema = z
  .object({
    event_id: nonEmptyString,
    issue_theme: nonEmptyString,
    editorial_angle: nonEmptyString,
    selected_products: z.array(selectedProductCompositionSchema).min(1),
    brand_connection: brandConnectionSchema,
    personal_connection: personalConnectionSchema,
    evidence: z.array(nonEmptyString).min(1),
  })
  .strict();

export const issueCompositionJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "event_id",
    "issue_theme",
    "editorial_angle",
    "selected_products",
    "brand_connection",
    "personal_connection",
    "evidence",
  ],
  properties: {
    event_id: { type: "string", minLength: 1 },
    issue_theme: { type: "string", minLength: 1 },
    editorial_angle: { type: "string", minLength: 1 },
    selected_products: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["product_id", "product_role", "discovery_direction"],
        properties: {
          product_id: { type: "string", minLength: 1 },
          product_role: { type: "string", minLength: 1 },
          discovery_direction: { type: "string", minLength: 1 },
        },
      },
    },
    brand_connection: {
      type: "object",
      additionalProperties: false,
      required: [
        "event_theme",
        "brand_direction",
        "connection_narrative",
      ],
      properties: {
        event_theme: { type: "string", minLength: 1 },
        brand_direction: { type: "string", minLength: 1 },
        connection_narrative: { type: "string", minLength: 1 },
      },
    },
    personal_connection: {
      type: "object",
      additionalProperties: false,
      required: ["existing_preference", "new_expression", "connection_reason"],
      properties: {
        existing_preference: { type: "string", minLength: 1 },
        new_expression: { type: "string", minLength: 1 },
        connection_reason: { type: "string", minLength: 1 },
      },
    },
    evidence: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
  },
} as const;
