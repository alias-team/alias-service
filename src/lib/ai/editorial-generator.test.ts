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
      personal_connection: {
        existing_preference: "The customer has favored established heritage craft.",
        new_expression: "The Event expresses that craft through contemporary movement.",
        connection_reason: "It extends the customer's own preference rather than repeating it.",
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

  // TASK-207 개인화 보완: issue_composition.personal_connection이 prompt input에
  // 포함되고(기존 JSON.stringify(input)로 이미 전달됨), 지시문이 이를 편집 근거로
  // 명시적으로 요구하는지 확인한다. 새 판단/새 evidence 생성을 지시하지 않는지도 함께 확인.
  it("includes issue_composition.personal_connection in the prompt input", () => {
    const prompt = buildEditorialGeneratorPrompt(input());
    const promptInput = JSON.parse(prompt.input);

    expect(promptInput.issue_composition.personal_connection).toEqual(
      input().issue_composition.personal_connection,
    );
  });

  it("explicitly requires personal_connection as the narrative basis, without inventing new facts", () => {
    const prompt = buildEditorialGeneratorPrompt(input());

    expect(prompt.instructions).toContain("personal_connection");
    expect(prompt.instructions).toContain("existing_preference");
    expect(prompt.instructions).toContain("new_expression");
    expect(prompt.instructions).toContain("connection_reason");
    expect(prompt.instructions).toContain("never invent facts");
    expect(prompt.instructions).toContain("new connection reason");
  });

  // 제품별 connection_reason이 브랜드 캠페인 톤("modern nomad"류)에 치우치지 않고
  // 고객 개인화 중심을 유지하도록 요구하는지 확인. brand_story에는 브랜드/Event 언어가
  // 허용됨을 함께 확인해 기존 personal_connection 규칙과 충돌하지 않는지 본다.
  it("requires per-Product connection_reason to stay centered on the customer, not generic campaign/brand phrasing", () => {
    const prompt = buildEditorialGeneratorPrompt(input());

    expect(prompt.instructions).toContain(
      "connection_reason for each Product must center on why this Product meaningfully extends this customer's own established taste",
    );
    expect(prompt.instructions).toContain("Generic campaign phrasing");
    expect(prompt.instructions).toContain("brand_story and the general background may carry it");
  });

  // connection_reason의 순서(취향 해석 먼저, 기능/스펙은 뒷받침 근거로만)를 요구하는지,
  // discovery_story도 기능 소개가 아니라 취향 해석 중심이어야 함을 명시하는지 확인.
  it("requires taste interpretation to lead connection_reason/discovery_story, with functional details only as brief supporting evidence", () => {
    const prompt = buildEditorialGeneratorPrompt(input());

    expect(prompt.instructions).toContain(
      "Lead each Product's connection_reason with the taste interpretation (what this reveals, preserves, or meaningfully extends about the customer), and let functional or specification details such as pockets, materials, compartments, or convertibility serve only as brief supporting evidence, never as the sentence's main subject.",
    );
    expect(prompt.instructions).toContain(
      "never lead with what the Product does and only afterward tie it to the customer",
    );
    expect(prompt.instructions).toContain(
      "write it as what this Product reveals about the customer's established taste in a new form, not as a tour of the Product's features",
    );
  });

  // email_header.subject 전용 지시: 짧은 personalized hook, 캠페인 문구/제품명·기능 나열 금지,
  // curiosity 유발. preview 관련 규칙은 이번 변경 대상이 아니므로 별도로 건드리지 않았는지도 확인.
  it("requires a short, personalized, curiosity-driving subject that avoids campaign titles and Product names/features", () => {
    const prompt = buildEditorialGeneratorPrompt(input());

    expect(prompt.instructions).toContain(
      "Write email_header.subject as a short, personalized hook, not a descriptive sentence",
    );
    expect(prompt.instructions).toContain("create a small pull of curiosity");
    expect(prompt.instructions).toContain("avoid phrasing like 'New Collection' or 'Discover Now'");
    expect(prompt.instructions).toContain("without naming a Product or listing a Product feature");
    expect(prompt.instructions).toContain("For calibration only, not as fixed wording to reuse verbatim");
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
