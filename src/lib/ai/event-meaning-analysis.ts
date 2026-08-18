import { getOpenAIClient } from "./openai-client";
import { buildEventMeaningPrompt } from "./prompts/event-meaning.prompt";
import {
  eventMeaningAnalysisSchema,
  eventMeaningJsonSchema,
} from "@/lib/validation/event-meaning.schema";
import type { EventMeaningAnalysis, EventMeaningInput } from "@/types/event";

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
