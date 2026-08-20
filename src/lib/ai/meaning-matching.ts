import { getOpenAIClient } from "./openai-client";
import { buildMeaningMatchingPrompt } from "./prompts/meaning-matching.prompt";
import {
  meaningMatchingAiOutputJsonSchema,
  meaningMatchingAiOutputSchema,
  meaningMatchingInputSchema,
} from "@/lib/validation/meaning-matching.schema";
import type {
  MeaningMatchingAiOutput,
  MeaningMatchingCandidateResult,
  MeaningMatchingInput,
  MeaningMatchingOutput,
} from "@/types/meaning-matching";

// TASK-204: Meaning Matching Engine
// Source: documents/[개발 문서] 09_PRODUCT_BACKLOG.md "TASK-204"
//
// 이 파일은 이벤트당 OpenAI 호출 1회로 customer_event_match와 candidates[]의
// customer_product_match/meaning_bridge/extension_result를 생성한다. PASS/REJECT
// 판단과 GatekeeperInput 조립은 다루지 않는다 — 각각 TASK-205, TASK-204-C의 책임이다.

// TASK-301 원인 격리: 최종 통합 E2E에서 gpt-5-mini가 TASK-204에서 candidates[2].
// extension_result.new_expression = "" (빈 문자열)을 생성해 schema validation에 실패했다
// (타임아웃이 아니라 콘텐츠 자체가 스키마를 위반한 경우). 모델 특성인지 확인하기 위한
// 1회성 비교 테스트 — model만 gpt-5로 바꾼다. 결과에 따라 되돌리거나(gpt-5-mini) 확정할
// 것(gpt-5). prompt/schema는 건드리지 않는다.
export const MEANING_MATCHING_MODEL =
  process.env.OPENAI_MEANING_MATCHING_MODEL ?? "gpt-5";

export type MeaningMatchingGenerator = (
  input: MeaningMatchingInput,
) => Promise<unknown>;

const generateWithOpenAI: MeaningMatchingGenerator = async (input) => {
  const prompt = buildMeaningMatchingPrompt(input);
  const response = await getOpenAIClient().responses.create({
    model: MEANING_MATCHING_MODEL,
    instructions: prompt.instructions,
    input: prompt.input,
    text: {
      format: {
        type: "json_schema",
        name: "meaning_matching_result",
        strict: true,
        schema: meaningMatchingAiOutputJsonSchema,
      },
    },
  });

  if (!response.output_text) {
    throw new Error("OpenAI returned an empty Meaning Matching response");
  }

  try {
    return JSON.parse(response.output_text) as unknown;
  } catch (error) {
    throw new Error("OpenAI returned invalid JSON for Meaning Matching", {
      cause: error,
    });
  }
};

function assertInputIdentity(input: MeaningMatchingInput) {
  const productIds = input.candidates.map(({ product_id }) => product_id);
  if (new Set(productIds).size !== productIds.length) {
    throw new Error(
      "Meaning Matching candidates must not contain duplicate Product IDs",
    );
  }
}

function reconcileCandidates(
  input: MeaningMatchingInput,
  aiOutput: MeaningMatchingAiOutput,
): MeaningMatchingCandidateResult[] {
  const resultsByProductId = new Map<string, MeaningMatchingCandidateResult>();

  for (const candidate of aiOutput.candidates) {
    if (resultsByProductId.has(candidate.product_id)) {
      throw new Error(
        `Meaning Matching AI must not return duplicate Product IDs: ${candidate.product_id}`,
      );
    }
    resultsByProductId.set(candidate.product_id, candidate);
  }

  const expectedProductIds = new Set(
    input.candidates.map(({ product_id }) => product_id),
  );
  for (const productId of resultsByProductId.keys()) {
    if (!expectedProductIds.has(productId)) {
      throw new Error(
        `Meaning Matching AI returned an unknown Product ID: ${productId}`,
      );
    }
  }

  return input.candidates.map(({ product_id }) => {
    const result = resultsByProductId.get(product_id);
    if (!result) {
      throw new Error(
        `Meaning Matching AI is missing a result for Product ID: ${product_id}`,
      );
    }
    return result;
  });
}

export async function matchMeaning(
  input: MeaningMatchingInput,
  generate: MeaningMatchingGenerator = generateWithOpenAI,
): Promise<MeaningMatchingOutput> {
  const validatedInput = meaningMatchingInputSchema.parse(input);
  assertInputIdentity(validatedInput);

  const rawOutput = await generate(validatedInput);
  const aiOutput = meaningMatchingAiOutputSchema.parse(rawOutput);
  const candidates = reconcileCandidates(validatedInput, aiOutput);

  return {
    event_id: validatedInput.event_id,
    customer_event_match: aiOutput.customer_event_match,
    candidates,
  };
}
