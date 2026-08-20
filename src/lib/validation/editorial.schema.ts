import { z } from "zod";

import {
  eventMeaningProfileSchema,
  issueCompositionSchema,
} from "./issue-composition.schema";

const nonEmptyString = z.string().trim().min(1);
const nonBlankSourceString = z
  .string()
  .refine((value) => value.trim().length > 0, "String must not be blank");
const exactReferenceString = nonBlankSourceString.refine(
  (value) => value === value.trim(),
  "Reference must not contain surrounding whitespace",
);
const eventTypeSchema = z.enum(["collection", "campaign", "brand_event"]);

export const customerTasteProfileSchema = z
  .object({
    id: exactReferenceString,
    customer_id: exactReferenceString,
    taste_summary: nonEmptyString,
    core_preference: z.record(z.string(), z.unknown()),
    ai_traits: z.array(z.unknown()),
    evidence_product_ids: z.array(exactReferenceString),
    source: z.enum(["seed", "ai_generated"]),
    is_current: z.boolean(),
    created_at: nonEmptyString.optional(),
    updated_at: nonEmptyString.optional(),
  })
  .strict();

export const editorialProductContextSchema = z
  .object({
    product_id: exactReferenceString,
    product_name: nonBlankSourceString,
    image_url: nonBlankSourceString,
    description: nonBlankSourceString,
    product_profile: z
      .object({
        core4: z.record(z.string(), z.unknown()),
        ai_product_traits: z.array(z.unknown()),
        evidence: z.array(z.unknown()),
      })
      .strict(),
  })
  .strict();

export const editorialGeneratorInputSchema = z
  .object({
    issue_composition: issueCompositionSchema,
    event_meaning_profile: eventMeaningProfileSchema,
    customer_taste_profile: customerTasteProfileSchema,
    event: z
      .object({
        event_id: exactReferenceString,
        event_type: eventTypeSchema,
      })
      .strict(),
    brand_asset: z.object({ image_url: nonBlankSourceString }).strict(),
    products: z.array(editorialProductContextSchema).min(1),
  })
  .strict();

const emailHeaderDraftSchema = z
  .object({
    subject: nonEmptyString,
    preview: nonEmptyString,
  })
  .strict();

const coverSchema = z
  .object({
    title: nonEmptyString,
    subtitle: nonEmptyString,
    hero_message: nonEmptyString,
  })
  .strict();

const openingMessageSchema = z
  .object({
    title: nonEmptyString,
    content: nonEmptyString,
  })
  .strict();

const brandStoryDraftSchema = z
  .object({
    title: nonEmptyString,
    content: nonEmptyString,
  })
  .strict();

const productDiscoveryDraftSchema = z
  .object({
    product_id: exactReferenceString,
    discovery_story: nonEmptyString,
    connection_reason: nonEmptyString,
  })
  .strict();

const discoveryChapterDraftSchema = z
  .object({
    chapter_title: nonEmptyString,
    chapter_intro: nonEmptyString,
    products: z.array(productDiscoveryDraftSchema).min(1),
  })
  .strict();

const closingMessageSchema = z
  .object({
    content: nonEmptyString,
    cta_label: nonEmptyString,
  })
  .strict();

export const editorialDraftSchema = z
  .object({
    email_header: emailHeaderDraftSchema,
    editorial: z
      .object({
        cover: coverSchema,
        opening_message: openingMessageSchema,
        brand_story: brandStoryDraftSchema,
        discovery_chapters: z.array(discoveryChapterDraftSchema).min(1),
        closing_message: closingMessageSchema,
      })
      .strict(),
  })
  .strict();

const productDiscoverySchema = productDiscoveryDraftSchema.extend({
  product_name: nonBlankSourceString,
  image_url: nonBlankSourceString,
});

const discoveryChapterSchema = discoveryChapterDraftSchema.extend({
  products: z.array(productDiscoverySchema).min(1),
});

export const personalEditorialSchema = z
  .object({
    email_header: emailHeaderDraftSchema
      .extend({ sender: z.literal("MCM Editorial Team") })
      .strict(),
    editorial: z
      .object({
        cover: coverSchema,
        opening_message: openingMessageSchema,
        brand_story: brandStoryDraftSchema
          .extend({
            story_type: eventTypeSchema,
            image_url: nonBlankSourceString,
          })
          .strict(),
        discovery_chapters: z.array(discoveryChapterSchema).min(1),
        closing_message: closingMessageSchema,
      })
      .strict(),
  })
  .strict();

const nonEmptyJsonString = { type: "string", minLength: 1 } as const;

export const editorialDraftJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["email_header", "editorial"],
  properties: {
    email_header: {
      type: "object",
      additionalProperties: false,
      required: ["subject", "preview"],
      properties: {
        subject: nonEmptyJsonString,
        preview: nonEmptyJsonString,
      },
    },
    editorial: {
      type: "object",
      additionalProperties: false,
      required: [
        "cover",
        "opening_message",
        "brand_story",
        "discovery_chapters",
        "closing_message",
      ],
      properties: {
        cover: {
          type: "object",
          additionalProperties: false,
          required: ["title", "subtitle", "hero_message"],
          properties: {
            title: nonEmptyJsonString,
            subtitle: nonEmptyJsonString,
            hero_message: nonEmptyJsonString,
          },
        },
        opening_message: {
          type: "object",
          additionalProperties: false,
          required: ["title", "content"],
          properties: {
            title: nonEmptyJsonString,
            content: nonEmptyJsonString,
          },
        },
        brand_story: {
          type: "object",
          additionalProperties: false,
          required: ["title", "content"],
          properties: {
            title: nonEmptyJsonString,
            content: nonEmptyJsonString,
          },
        },
        discovery_chapters: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["chapter_title", "chapter_intro", "products"],
            properties: {
              chapter_title: nonEmptyJsonString,
              chapter_intro: nonEmptyJsonString,
              products: {
                type: "array",
                minItems: 1,
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: [
                    "product_id",
                    "discovery_story",
                    "connection_reason",
                  ],
                  properties: {
                    product_id: nonEmptyJsonString,
                    discovery_story: nonEmptyJsonString,
                    connection_reason: nonEmptyJsonString,
                  },
                },
              },
            },
          },
        },
        closing_message: {
          type: "object",
          additionalProperties: false,
          required: ["content", "cta_label"],
          properties: {
            content: nonEmptyJsonString,
            cta_label: nonEmptyJsonString,
          },
        },
      },
    },
  },
} as const;
