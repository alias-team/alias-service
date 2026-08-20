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

// TASK-301 원인 격리: gpt-5-mini가 실제 production input에서 반복 250~300초 TIMEOUT을
// 일으키는 것이 모델 특성인지 확인하기 위한 1회성 비교 테스트 — model만 gpt-5로 바꾼다.
// 결과에 따라 되돌리거나(gpt-5-mini) 확정할 것(gpt-5). prompt/schema는 건드리지 않는다.
export const ISSUE_COMPOSITION_MODEL =
  process.env.OPENAI_ISSUE_COMPOSITION_MODEL ?? "gpt-5";

export type IssueCompositionGenerator = (
  input: IssueCompositionInput,
) => Promise<unknown>;

const generateWithOpenAI: IssueCompositionGenerator = async (input) => {
  const prompt = buildIssueCompositionPrompt(input);
  const response = await getOpenAIClient().responses.create({
    model: ISSUE_COMPOSITION_MODEL,
    instructions: prompt.instructions,
    input: prompt.input,
    // TASK-301 E2E 감사 결과: 206 output에 상한이 없어 생성이 비정상적으로 길어질 여지가
    // 있었다(코드/prompt/schema는 그대로, 생성량만 제한). 상한에 걸려 잘리면 output_text가
    // 불완전한 JSON이 되어 아래 JSON.parse가 그대로 실패하고, 기존 에러 처리 경로(호출부
    // catch -> orchestrator markFailed)를 그대로 탄다 — 새 fallback/재생성 로직은 추가하지 않는다.
    max_output_tokens: 8000,
    // TASK-301 gpt-5 비교 테스트: reasoning:{effort:"low"}는 gpt-5-mini 반복 타임아웃에
    // 효과가 없었던 것으로 이미 확인됐다(runtime 로그). "모델만" 비교하기 위해 이번
    // 테스트에서는 reasoning 옵션을 빼고 gpt-5 기본 reasoning 설정으로 호출한다. gpt-5-mini로
    // 되돌릴 경우 reasoning:{effort:"low"}도 함께 복원해야 한다.
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
