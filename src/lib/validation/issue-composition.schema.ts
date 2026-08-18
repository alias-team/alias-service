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

export const issueCompositionSchema = z
  .object({
    event_id: nonEmptyString,
    issue_theme: nonEmptyString,
    editorial_angle: nonEmptyString,
    selected_products: z.array(selectedProductCompositionSchema).min(1),
    brand_connection: brandConnectionSchema,
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
    evidence: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
  },
} as const;
