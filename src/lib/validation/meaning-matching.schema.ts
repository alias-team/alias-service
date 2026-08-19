// TASK-204: Meaning Matching Engine
// Source: documents/[개발 문서] 09_PRODUCT_BACKLOG.md "TASK-204"
//
// customer_event_match / meaning_bridge / extension_result는 TASK-205 Gatekeeper의
// 기존 Zod 계약(src/lib/validation/gatekeeper.schema.ts)을 그 자리에서(.shape로) 그대로
// 재사용한다 — 205의 스키마 파일 자체는 수정하지 않는다.
//
// customer_product_match만 205보다 구체적이다: 205는 core4_connections/trait_connections를
// unknown[]로 느슨하게 받지만, TASK-204는 OpenAI strict json_schema로 구조화 출력을 받아야
// 하므로 이 파일 안에서만 최소 아이템 구조를 확정한다. 205의 느슨한 계약은 그대로 유지된다.

import { z } from "zod";

import {
  gatekeeperCandidateInputSchema,
  gatekeeperInputSchema,
} from "./gatekeeper.schema";

const nonEmptyString = z.string().trim().min(1);

export const meaningMatchingCandidateProductSchema = z
  .object({
    product_id: nonEmptyString,
    product: gatekeeperCandidateInputSchema.shape.product,
    product_profile: gatekeeperCandidateInputSchema.shape.product_profile,
  })
  .strict();

export const meaningMatchingInputSchema = z
  .object({
    event_id: nonEmptyString,
    customer_profile: gatekeeperInputSchema.shape.customer_profile,
    event_meaning_profile: gatekeeperInputSchema.shape.event_meaning_profile,
    candidates: z.array(meaningMatchingCandidateProductSchema).min(1),
  })
  .strict();

const core4ConnectionSchema = z
  .object({
    attribute: nonEmptyString,
    customer_value: nonEmptyString,
    product_value: nonEmptyString,
  })
  .strict();

const traitConnectionSchema = z
  .object({
    customer_trait: nonEmptyString,
    product_trait: nonEmptyString,
  })
  .strict();

export const meaningMatchingCustomerProductMatchSchema = z
  .object({
    connection: z.boolean(),
    core4_connections: z.array(core4ConnectionSchema),
    trait_connections: z.array(traitConnectionSchema),
    matching_reason: nonEmptyString,
    evidence: z.array(nonEmptyString).min(1),
  })
  .strict();

export const meaningMatchingCandidateResultSchema = z
  .object({
    product_id: nonEmptyString,
    customer_product_match: meaningMatchingCustomerProductMatchSchema,
    meaning_bridge: gatekeeperCandidateInputSchema.shape.meaning_bridge,
    extension_result: gatekeeperCandidateInputSchema.shape.extension_result,
  })
  .strict();

export const meaningMatchingAiOutputSchema = z
  .object({
    customer_event_match: gatekeeperInputSchema.shape.customer_event_match,
    candidates: z.array(meaningMatchingCandidateResultSchema).min(1),
  })
  .strict();

const CORE4_CONNECTION_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["attribute", "customer_value", "product_value"],
  properties: {
    attribute: { type: "string", minLength: 1 },
    customer_value: { type: "string", minLength: 1 },
    product_value: { type: "string", minLength: 1 },
  },
} as const;

const TRAIT_CONNECTION_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["customer_trait", "product_trait"],
  properties: {
    customer_trait: { type: "string", minLength: 1 },
    product_trait: { type: "string", minLength: 1 },
  },
} as const;

const CUSTOMER_EVENT_MATCH_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["connection", "matching_reason", "evidence"],
  properties: {
    connection: { type: "boolean" },
    matching_reason: { type: "string", minLength: 1 },
    evidence: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
  },
} as const;

const CUSTOMER_PRODUCT_MATCH_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "connection",
    "core4_connections",
    "trait_connections",
    "matching_reason",
    "evidence",
  ],
  properties: {
    connection: { type: "boolean" },
    core4_connections: { type: "array", items: CORE4_CONNECTION_JSON_SCHEMA },
    trait_connections: { type: "array", items: TRAIT_CONNECTION_JSON_SCHEMA },
    matching_reason: { type: "string", minLength: 1 },
    evidence: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 1 },
    },
  },
} as const;

const EXTENSION_RESULT_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "extension_type",
    "existing_preference",
    "new_expression",
    "extension_reason",
  ],
  properties: {
    extension_type: {
      type: "string",
      enum: ["meaningful_extension", "existing_preference_repetition"],
    },
    existing_preference: { type: "string", minLength: 1 },
    new_expression: { type: "string", minLength: 1 },
    extension_reason: { type: "string", minLength: 1 },
  },
} as const;

export const meaningMatchingAiOutputJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["customer_event_match", "candidates"],
  properties: {
    customer_event_match: CUSTOMER_EVENT_MATCH_JSON_SCHEMA,
    candidates: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "product_id",
          "customer_product_match",
          "meaning_bridge",
          "extension_result",
        ],
        properties: {
          product_id: { type: "string", minLength: 1 },
          customer_product_match: CUSTOMER_PRODUCT_MATCH_JSON_SCHEMA,
          meaning_bridge: { type: "string", minLength: 1 },
          extension_result: EXTENSION_RESULT_JSON_SCHEMA,
        },
      },
    },
  },
} as const;
