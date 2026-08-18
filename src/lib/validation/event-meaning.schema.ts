import { z } from "zod";

export const eventMeaningEvidenceSchema = z
  .object({
    source: z.enum([
      "campaign_overview",
      "brand_message",
      "collection_concept",
      "related_product_profile",
    ]),
    text: z.string().trim().min(1),
  })
  .strict();

export const eventMeaningAnalysisSchema = z
  .object({
    event_theme: z.string().trim().min(1),
    brand_direction: z.string().trim().min(1),
    event_traits: z.array(z.string().trim().min(1)).min(1),
    evidence: z.array(eventMeaningEvidenceSchema).min(1),
  })
  .strict();

export const eventMeaningJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["event_theme", "brand_direction", "event_traits", "evidence"],
  properties: {
    event_theme: { type: "string", minLength: 1 },
    brand_direction: { type: "string", minLength: 1 },
    event_traits: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
    evidence: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["source", "text"],
        properties: {
          source: {
            type: "string",
            enum: [
              "campaign_overview",
              "brand_message",
              "collection_concept",
              "related_product_profile",
            ],
          },
          text: { type: "string", minLength: 1 },
        },
      },
    },
  },
} as const;
