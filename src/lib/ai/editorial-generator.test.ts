import { describe, expect, it, vi } from "vitest";

import { generateEditorial } from "./editorial-generator";
import { buildEditorialGeneratorPrompt } from "./prompts/editorial-generator.prompt";
import type {
  EditorialDraft,
  EditorialGeneratorInput,
  PersonalEditorial,
} from "@/types/editorial";

const EVENT_ID = "6ebeb5f4-f60f-45df-9008-f0641f7166af";

const eventMeaningProfile = {
  id: "3902fe0c-29b0-43bb-920b-c20bb782d83b",
  event_id: EVENT_ID,
  event_theme: "Modern Heritage",
  brand_direction: "Heritage reinterpreted for contemporary movement",
  event_traits: ["Contemporary Heritage", "Mobility"],
  evidence: [
    { source: "brand_message" as const, text: "Designed for modern nomads." },
  ],
  analysis_model: "gpt-5-mini",
  source: "ai_generated" as const,
  is_current: true,
};

function product(productId: string) {
  return {
    product_id: productId,
    product_name: `Product ${productId}`,
    image_url: `https://example.com/${productId}.jpg`,
    description: `Official description for ${productId}.`,
    product_profile: {
      core4: { material: "leather" },
      ai_product_traits: [
        {
          name: "Modern Heritage",
          reason: "A contemporary interpretation of familiar craft.",
        },
      ],
      evidence: [
        { source: "product_description", text: `Evidence for ${productId}.` },
      ],
    },
  };
}

function input(productIds = ["PRODUCT_001", "PRODUCT_002"]): EditorialGeneratorInput {
  return {
    issue_composition: {
      event_id: EVENT_ID,
      issue_theme: "Heritage in Motion",
      editorial_angle: "Familiar craft moving into a contemporary context",
      selected_products: productIds.map((productId, index) => ({
        product_id: productId,
        product_role: index === 0 ? "Theme anchor" : "Material variation",
        discovery_direction: "A contemporary expression of established taste",
      })),
      brand_connection: {
        event_theme: "Modern Heritage",
        brand_direction: "Heritage reinterpreted for contemporary movement",
        connection_narrative: "Familiar craft moves into a new urban context.",
      },
      evidence: ["The Event and selected Products passed composition validation."],
    },
    event_meaning_profile: eventMeaningProfile,
    customer_taste_profile: {
      id: "7a176cba-b7db-4e9d-aad9-18440bc09a44",
      customer_id: "0b98646d-0f7e-4dd5-902b-60434aec8886",
      taste_summary: "Previous choices show an affinity for refined heritage forms.",
      core_preference: { material: ["leather"] },
      ai_traits: [{ name: "Heritage-oriented Style" }],
      evidence_product_ids: ["HISTORY_001"],
      source: "seed",
      is_current: true,
    },
    event: {
      event_id: EVENT_ID,
      event_type: "collection",
    },
    brand_asset: {
      image_url: "https://example.com/brand-story.jpg",
    },
    products: productIds.map(product),
  };
}

function draft(productIds = ["PRODUCT_001", "PRODUCT_002"]): EditorialDraft {
  return {
    email_header: {
      subject: "Heritage, Set in Motion",
      preview: "A new expression of familiar MCM codes.",
    },
    editorial: {
      cover: {
        title: "Heritage in Motion",
        subtitle: "A contemporary MCM chapter",
        hero_message: "Familiar codes find a new rhythm.",
      },
      opening_message: {
        title: "A Familiar Point of Departure",
        content: "Previous choices meet a more fluid expression of heritage.",
      },
      brand_story: {
        title: "A New Movement",
        content: "MCM heritage is carried into a contemporary urban context.",
      },
      discovery_chapters: [
        {
          chapter_title: "Expressions in Motion",
          chapter_intro: "Each piece extends the Event through a distinct form.",
          products: productIds.map((productId) => ({
            product_id: productId,
            discovery_story: `A new expression carried by ${productId}.`,
            connection_reason: "It extends a familiar heritage sensibility.",
          })),
        },
      ],
      closing_message: {
        content: "A familiar sensibility, seen through a new MCM expression.",
        cta_label: "Discover the Collection",
      },
    },
  };
}

function expected(productIds = ["PRODUCT_001", "PRODUCT_002"]): PersonalEditorial {
  const generated = draft(productIds);
  return {
    email_header: {
      sender: "MCM Editorial Team",
      ...generated.email_header,
    },
    editorial: {
      ...generated.editorial,
      brand_story: {
        story_type: "collection",
        image_url: "https://example.com/brand-story.jpg",
        ...generated.editorial.brand_story,
      },
      discovery_chapters: generated.editorial.discovery_chapters.map(
        (chapter) => ({
          ...chapter,
          products: chapter.products.map((discovery) => {
            const source = product(discovery.product_id);
            return {
              product_id: source.product_id,
              product_name: source.product_name,
              image_url: source.image_url,
              discovery_story: discovery.discovery_story,
              connection_reason: discovery.connection_reason,
            };
          }),
        }),
      ),
    },
  };
}

describe("generateEditorial", () => {
  it("generates the Personal Editorial contract and directly maps source metadata", async () => {
    const generate = vi.fn(async () => draft());

    const result = await generateEditorial(input(), generate);

    expect(result).toEqual(expected());
    expect(generate).toHaveBeenCalledOnce();
    expect(generate).toHaveBeenCalledWith(input());
  });

  it("passes every input context to the prompt without gatekeeper_results", () => {
    const prompt = buildEditorialGeneratorPrompt(input());
    const promptInput = JSON.parse(prompt.input);

    expect(promptInput).toEqual(input());
    expect(promptInput).not.toHaveProperty("gatekeeper_results");
    expect(prompt.instructions).toContain("English");
    expect(prompt.instructions).toContain("not recommendations");
  });

  it("keeps the entire Product Pool when more than three Products are selected", async () => {
    const productIds = [
      "PRODUCT_001",
      "PRODUCT_002",
      "PRODUCT_003",
      "PRODUCT_004",
    ];

    const result = await generateEditorial(input(productIds), async () =>
      draft(productIds),
    );

    expect(
      result.editorial.discovery_chapters.flatMap((chapter) =>
        chapter.products.map(({ product_id }) => product_id),
      ),
    ).toEqual(productIds);
  });

  it("preserves source-owned Product metadata without normalization", async () => {
    const sourceInput = input();
    sourceInput.products[0].product_name = " Product PRODUCT_001 ";

    const result = await generateEditorial(sourceInput, async () => draft());

    expect(
      result.editorial.discovery_chapters[0].products[0].product_name,
    ).toBe(" Product PRODUCT_001 ");
  });

  it("rejects an Event Meaning Profile from another Event before generation", async () => {
    const invalidInput = input();
    invalidInput.event_meaning_profile = {
      ...eventMeaningProfile,
      event_id: "9cf8101c-420a-4ef3-af25-2c96f9cd4b46",
    };
    const generate = vi.fn(async () => draft());

    await expect(generateEditorial(invalidInput, generate)).rejects.toThrow(
      /same Event/i,
    );
    expect(generate).not.toHaveBeenCalled();
  });

  it("rejects Product Contexts that do not exactly match IssueComposition", async () => {
    const invalidInput = input();
    invalidInput.products[1] = product("PRODUCT_003");
    const generate = vi.fn(async () => draft());

    await expect(generateEditorial(invalidInput, generate)).rejects.toThrow(
      /Product Context.*exactly match/i,
    );
    expect(generate).not.toHaveBeenCalled();
  });

  it.each([
    ["missing", ["PRODUCT_001"]],
    ["additional", ["PRODUCT_001", "PRODUCT_002", "PRODUCT_003"]],
    ["duplicate", ["PRODUCT_001", "PRODUCT_001"]],
    ["reordered", ["PRODUCT_002", "PRODUCT_001"]],
  ])("rejects a draft with %s Product references", async (_caseName, ids) => {
    await expect(
      generateEditorial(input(), async () => draft(ids)),
    ).rejects.toThrow(/every selected Product exactly once in input order/i);
  });

  it("rejects a generated Product reference with surrounding whitespace", async () => {
    await expect(
      generateEditorial(input(), async () =>
        draft([" PRODUCT_001 ", "PRODUCT_002"]),
      ),
    ).rejects.toThrow(/surrounding whitespace/i);
  });

  it("rejects generated metadata that must be mapped from source input", async () => {
    const generated = draft();

    await expect(
      generateEditorial(input(), async () => ({
        ...generated,
        editorial: {
          ...generated.editorial,
          brand_story: {
            ...generated.editorial.brand_story,
            image_url: "https://example.com/invented.jpg",
          },
        },
      })),
    ).rejects.toThrow();
  });

  it("rejects empty generated content", async () => {
    await expect(
      generateEditorial(input(), async () => ({
        ...draft(),
        email_header: { ...draft().email_header, subject: "   " },
      })),
    ).rejects.toThrow();
  });

  it("rejects a draft missing a required Editorial section", async () => {
    const incompleteEditorial = { ...draft().editorial };
    Reflect.deleteProperty(incompleteEditorial, "closing_message");

    await expect(
      generateEditorial(input(), async () => ({
        ...draft(),
        editorial: incompleteEditorial,
      })),
    ).rejects.toThrow();
  });
});
