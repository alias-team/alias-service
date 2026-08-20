import { getOpenAIClient } from "./openai-client";
import { buildEditorialGeneratorPrompt } from "./prompts/editorial-generator.prompt";
import {
  editorialDraftJsonSchema,
  editorialDraftSchema,
  editorialGeneratorInputSchema,
  personalEditorialSchema,
} from "@/lib/validation/editorial.schema";
import type {
  EditorialDraft,
  EditorialGeneratorInput,
  PersonalEditorial,
} from "@/types/editorial";

// TASK-301 원인 격리: 최종 통합 E2E에서 gpt-5-mini가 TASK-207에서 250,000ms TIMEOUT을
// 일으켰다(204/205/206은 전부 SUCCESS) — 이전에 TASK-205/206에서 관찰된 것과 동일한 패턴.
// 모델 특성인지 확인하기 위한 1회성 비교 테스트 — model만 gpt-5로 바꾼다. 결과에 따라
// 되돌리거나(gpt-5-mini) 확정할 것(gpt-5). prompt/schema는 건드리지 않는다.
export const EDITORIAL_GENERATOR_MODEL =
  process.env.OPENAI_EDITORIAL_GENERATOR_MODEL ?? "gpt-5";

export type EditorialGenerator = (
  input: EditorialGeneratorInput,
) => Promise<unknown>;

const generateWithOpenAI: EditorialGenerator = async (input) => {
  const prompt = buildEditorialGeneratorPrompt(input);
  const response = await getOpenAIClient().responses.create({
    model: EDITORIAL_GENERATOR_MODEL,
    instructions: prompt.instructions,
    input: prompt.input,
    text: {
      format: {
        type: "json_schema",
        name: "personal_editorial_draft",
        strict: true,
        schema: editorialDraftJsonSchema,
      },
    },
  });

  if (!response.output_text) {
    throw new Error("OpenAI returned an empty Personal Editorial response");
  }

  try {
    return JSON.parse(response.output_text) as unknown;
  } catch (error) {
    throw new Error("OpenAI returned invalid JSON for Personal Editorial", {
      cause: error,
    });
  }
};

function selectedProductIds(input: EditorialGeneratorInput) {
  return input.issue_composition.selected_products.map(
    ({ product_id }) => product_id,
  );
}

function assertInputIntegrity(input: EditorialGeneratorInput) {
  const eventId = input.issue_composition.event_id;
  if (
    input.event.event_id !== eventId ||
    input.event_meaning_profile.event_id !== eventId
  ) {
    throw new Error(
      "Issue Composition, Event, and Event Meaning Profile must belong to the same Event",
    );
  }

  const selectedIds = selectedProductIds(input);
  const contextIds = input.products.map(({ product_id }) => product_id);
  if (
    selectedIds.length !== contextIds.length ||
    selectedIds.some((productId, index) => productId !== contextIds[index])
  ) {
    throw new Error(
      "Product Context IDs must exactly match IssueComposition in input order",
    );
  }
}

function assertDraftProductIntegrity(
  input: EditorialGeneratorInput,
  draft: EditorialDraft,
) {
  const selectedIds = selectedProductIds(input);
  const draftIds = draft.editorial.discovery_chapters.flatMap((chapter) =>
    chapter.products.map(({ product_id }) => product_id),
  );

  if (
    selectedIds.length !== draftIds.length ||
    selectedIds.some((productId, index) => productId !== draftIds[index])
  ) {
    throw new Error(
      "Editorial Draft must include every selected Product exactly once in input order",
    );
  }
}

function hydrateEditorial(
  input: EditorialGeneratorInput,
  draft: EditorialDraft,
): PersonalEditorial {
  const productsById = new Map(
    input.products.map((product) => [product.product_id, product]),
  );

  return personalEditorialSchema.parse({
    email_header: {
      sender: "MCM Editorial Team",
      ...draft.email_header,
    },
    editorial: {
      ...draft.editorial,
      brand_story: {
        story_type: input.event.event_type,
        image_url: input.brand_asset.image_url,
        ...draft.editorial.brand_story,
      },
      discovery_chapters: draft.editorial.discovery_chapters.map((chapter) => ({
        ...chapter,
        products: chapter.products.map((discovery) => {
          const source = productsById.get(discovery.product_id);
          if (!source) {
            throw new Error(
              `Editorial Draft contains unknown Product: ${discovery.product_id}`,
            );
          }

          return {
            product_id: source.product_id,
            product_name: source.product_name,
            image_url: source.image_url,
            discovery_story: discovery.discovery_story,
            connection_reason: discovery.connection_reason,
          };
        }),
      })),
    },
  });
}

export async function generateEditorial(
  input: EditorialGeneratorInput,
  generate: EditorialGenerator = generateWithOpenAI,
): Promise<PersonalEditorial> {
  const validatedInput = editorialGeneratorInputSchema.parse(input);
  assertInputIntegrity(validatedInput);

  const response = await generate(validatedInput);
  const draft = editorialDraftSchema.parse(response);
  assertDraftProductIntegrity(validatedInput, draft);

  return hydrateEditorial(validatedInput, draft);
}
