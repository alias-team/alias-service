import { getOpenAIClient } from "./openai-client";
import { buildIssueCompositionPrompt } from "./prompts/issue-composition.prompt";
import {
  issueCompositionInputSchema,
  issueCompositionJsonSchema,
  issueCompositionSchema,
} from "@/lib/validation/issue-composition.schema";
import type {
  IssueComposition,
  IssueCompositionInput,
} from "@/types/issue-composition";

export const ISSUE_COMPOSITION_MODEL =
  process.env.OPENAI_ISSUE_COMPOSITION_MODEL ?? "gpt-5-mini";

export type IssueCompositionGenerator = (
  input: IssueCompositionInput,
) => Promise<unknown>;

const generateWithOpenAI: IssueCompositionGenerator = async (input) => {
  const prompt = buildIssueCompositionPrompt(input);
  const response = await getOpenAIClient().responses.create({
    model: ISSUE_COMPOSITION_MODEL,
    instructions: prompt.instructions,
    input: prompt.input,
    text: {
      format: {
        type: "json_schema",
        name: "issue_composition",
        strict: true,
        schema: issueCompositionJsonSchema,
      },
    },
  });

  if (!response.output_text) {
    throw new Error("OpenAI returned an empty Issue Composition response");
  }

  try {
    return JSON.parse(response.output_text) as unknown;
  } catch (error) {
    throw new Error("OpenAI returned invalid JSON for Issue Composition", {
      cause: error,
    });
  }
};

function assertSingleEvent(input: IssueCompositionInput) {
  if (input.eventMeaningProfile.event_id !== input.event_id) {
    throw new Error(
      "Event Meaning Profile must belong to the same Event as the Issue",
    );
  }

  if (
    input.passProductPool.some(
      (candidate) => candidate.event_id !== input.event_id,
    )
  ) {
    throw new Error("Every PASS Product must belong to the same Event");
  }
}

function assertUniqueProducts(input: IssueCompositionInput) {
  const productIds = input.passProductPool.map(({ product_id }) => product_id);
  if (new Set(productIds).size !== productIds.length) {
    throw new Error("PASS Product Pool must not contain duplicate Product IDs");
  }
}

function assertCompositionIdentity(
  input: IssueCompositionInput,
  composition: IssueComposition,
) {
  if (composition.event_id !== input.event_id) {
    throw new Error("Issue Composition event_id must match the input Event");
  }

  const inputProductIds = input.passProductPool.map(({ product_id }) => product_id);
  const outputProductIds = composition.selected_products.map(
    ({ product_id }) => product_id,
  );

  if (
    inputProductIds.length !== outputProductIds.length ||
    inputProductIds.some((productId, index) => productId !== outputProductIds[index])
  ) {
    throw new Error(
      "Issue Composition must include every PASS Product exactly once in input order",
    );
  }

  if (
    composition.brand_connection.event_theme !==
      input.eventMeaningProfile.event_theme ||
    composition.brand_connection.brand_direction !==
      input.eventMeaningProfile.brand_direction
  ) {
    throw new Error(
      "Issue Composition brand connection must preserve the Event Meaning",
    );
  }
}

export async function composeIssue(
  input: IssueCompositionInput,
  generate: IssueCompositionGenerator = generateWithOpenAI,
): Promise<IssueComposition> {
  const validatedInput = issueCompositionInputSchema.parse(input);
  assertSingleEvent(validatedInput);
  assertUniqueProducts(validatedInput);

  const response = await generate(validatedInput);
  const composition = issueCompositionSchema.parse(response);
  assertCompositionIdentity(validatedInput, composition);

  return composition;
}
