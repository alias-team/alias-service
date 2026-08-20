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

  // brand_connection.event_theme/brand_direction은 모델이 재생성한 문자열을 신뢰하지
  // 않는다 — composeIssue()가 이미 아는 input.eventMeaningProfile 값을 결정론적으로
  // 그대로 쓴다(새 판단 아님, 문자열 재생성 오차로 인한 identity 실패를 원천 차단).
  // connection_narrative만 모델이 생성한 값을 그대로 쓴다.
  return {
    ...composition,
    brand_connection: {
      ...composition.brand_connection,
      event_theme: validatedInput.eventMeaningProfile.event_theme,
      brand_direction: validatedInput.eventMeaningProfile.brand_direction,
    },
  };
}
