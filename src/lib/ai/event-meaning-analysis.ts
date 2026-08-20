import { getOpenAIClient } from "./openai-client";
import { buildEventMeaningPrompt } from "./prompts/event-meaning.prompt";
import {
  eventMeaningAnalysisSchema,
  eventMeaningJsonSchema,
} from "@/lib/validation/event-meaning.schema";
import type {
  EventMeaningAnalysis,
  EventMeaningInput,
  EventMeaningProfile,
} from "@/types/event";
import type { EventMeaningContext } from "@/types/gatekeeper";

export const EVENT_MEANING_MODEL =
  process.env.OPENAI_EVENT_MEANING_MODEL ?? "gpt-5-mini";

export type EventMeaningGenerator = (
  input: EventMeaningInput,
) => Promise<unknown>;

const generateWithOpenAI: EventMeaningGenerator = async (input) => {
  const prompt = buildEventMeaningPrompt(input);
  const response = await getOpenAIClient().responses.create({
    model: EVENT_MEANING_MODEL,
    instructions: prompt.instructions,
    input: prompt.input,
    text: {
      format: {
        type: "json_schema",
        name: "event_meaning_profile",
        strict: true,
        schema: eventMeaningJsonSchema,
      },
    },
  });

  if (!response.output_text) {
    throw new Error("OpenAI returned an empty Event Meaning response");
  }

  try {
    return JSON.parse(response.output_text) as unknown;
  } catch (error) {
    throw new Error("OpenAI returned invalid JSON for Event Meaning", {
      cause: error,
    });
  }
};

export async function analyzeEventMeaning(
  input: EventMeaningInput,
  generate: EventMeaningGenerator = generateWithOpenAI,
): Promise<EventMeaningAnalysis> {
  const response = await generate({
    ...input,
    relatedProductProfiles: input.relatedProductProfiles ?? [],
  });
  return eventMeaningAnalysisSchema.parse(response);
}

// TASK-301 DB 연결 4단계: TASK-204 입력 투영. DB에서 읽은 EventMeaningProfile(id/
// analysis_model/source/is_current 등 DB row 메타데이터 포함)에서 TASK-204/205가 쓰는
// EventMeaningContext 5개 필드만 추린다 — 순수 필드 선택이며 값을 만들거나 해석하지 않는다.
export function toEventMeaningContext(
  profile: EventMeaningProfile,
): EventMeaningContext {
  return {
    event_id: profile.event_id,
    event_theme: profile.event_theme,
    brand_direction: profile.brand_direction,
    event_traits: profile.event_traits,
    evidence: profile.evidence,
  };
}
