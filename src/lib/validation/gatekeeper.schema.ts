import { z } from "zod";

const nonEmptyString = z.string().trim().min(1);
const evidenceTextSchema = z
  .object({
    source: nonEmptyString,
    text: nonEmptyString,
  })
  .strict();

export const gatekeeperCandidateInputSchema = z
  .object({
    product_id: nonEmptyString,
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
        evidence: z.array(evidenceTextSchema).min(1),
      })
      .strict(),
    customer_product_match: z
      .object({
        connection: z.boolean(),
        core4_connections: z.array(z.unknown()),
        trait_connections: z.array(z.unknown()),
        matching_reason: nonEmptyString,
        evidence: z.array(nonEmptyString).min(1),
      })
      .strict(),
    meaning_bridge: nonEmptyString,
    extension_result: z
      .object({
        extension_type: z.enum([
          "meaningful_extension",
          "existing_preference_repetition",
        ]),
        existing_preference: nonEmptyString,
        new_expression: nonEmptyString,
        extension_reason: nonEmptyString,
      })
      .strict(),
  })
  .strict();

export const gatekeeperInputSchema = z
  .object({
    event_id: nonEmptyString,
    customer_profile: z
      .object({
        taste_summary: nonEmptyString,
        core_preference: z.record(z.string(), z.unknown()),
        ai_traits: z.array(z.unknown()),
        evidence_product_ids: z.array(nonEmptyString).min(1),
      })
      .strict(),
    event_meaning_profile: z
      .object({
        event_id: nonEmptyString,
        event_theme: nonEmptyString,
        brand_direction: nonEmptyString,
        event_traits: z.array(nonEmptyString).min(1),
        evidence: z.array(evidenceTextSchema).min(1),
      })
      .strict(),
    customer_event_match: z
      .object({
        connection: z.boolean(),
        matching_reason: nonEmptyString,
        evidence: z.array(nonEmptyString).min(1),
      })
      .strict(),
    candidates: z.array(gatekeeperCandidateInputSchema).min(1),
  })
  .strict();

export const gatekeeperAiEvaluationSchema = z
  .object({
    product_id: nonEmptyString,
    decision: z.enum(["PASS", "REJECT"]),
    reason: nonEmptyString,
    editorial_angle: nonEmptyString.nullable(),
  })
  .strict()
  .superRefine((evaluation, context) => {
    if (evaluation.decision === "PASS" && evaluation.editorial_angle === null) {
      context.addIssue({
        code: "custom",
        path: ["editorial_angle"],
        message: "PASS evaluation requires an editorial angle",
      });
    }

    if (evaluation.decision === "REJECT" && evaluation.editorial_angle !== null) {
      context.addIssue({
        code: "custom",
        path: ["editorial_angle"],
        message: "REJECT evaluation must not contain an editorial angle",
      });
    }
  });

export const gatekeeperAiOutputSchema = z
  .object({
    evaluations: z.array(gatekeeperAiEvaluationSchema).min(1),
  })
  .strict();

export const gatekeeperAiOutputJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["evaluations"],
  properties: {
    evaluations: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["product_id", "decision", "reason", "editorial_angle"],
        properties: {
          product_id: { type: "string", minLength: 1 },
          decision: { type: "string", enum: ["PASS", "REJECT"] },
          reason: { type: "string", minLength: 1 },
          editorial_angle: {
            anyOf: [
              { type: "string", minLength: 1 },
              { type: "null" },
            ],
          },
        },
      },
    },
  },
} as const;

