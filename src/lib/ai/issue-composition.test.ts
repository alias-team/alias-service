import { describe, expect, it, vi } from "vitest";

import { composeIssue } from "./issue-composition";
import type {
  IssueComposition,
  IssueCompositionInput,
} from "@/types/issue-composition";

const EVENT_ID = "6ebeb5f4-f60f-45df-9008-f0641f7166af";

const eventMeaning = {
  event_theme: "Modern Heritage",
  brand_direction: "Heritage reinterpreted for contemporary movement",
  event_traits: ["Contemporary Heritage", "Mobility"],
  evidence: [
    { source: "brand_message" as const, text: "Designed for modern nomads." },
  ],
};

const eventMeaningProfile = {
  id: "3902fe0c-29b0-43bb-920b-c20bb782d83b",
  event_id: EVENT_ID,
  ...eventMeaning,
  analysis_model: "gpt-5-mini",
  source: "ai_generated" as const,
  is_current: true,
};

function product(
  productId: string,
  overrides: Partial<IssueCompositionInput["passProductPool"][number]> = {},
) {
  return {
    event_id: EVENT_ID,
    product_id: productId,
    decision: "PASS" as const,
    product: {
      name: `Product ${productId}`,
      category: "bag",
      collection: "Tokyo Collection",
      image_url: `/images/${productId}.jpg`,
    },
    product_profile: {
      core4: { material: ["leather"] },
      ai_product_traits: ["Modern Heritage"],
    },
    editorial_angle: "A contemporary extension of heritage",
    matching_reason: "The product extends an established heritage preference.",
    meaning_bridge: "Familiar craft expressed through modern movement.",
    extension: "A lighter urban expression.",
    existing_preference: "Established heritage craft preference.",
    new_expression: "A lighter, more urban expression of that same craft.",
    evidence: [`${productId} uses a refined leather construction.`],
    ...overrides,
  };
}

function input(productIds = ["PRODUCT_001", "PRODUCT_002"]): IssueCompositionInput {
  return {
    event_id: EVENT_ID,
    eventMeaningProfile,
    passProductPool: productIds.map((productId) => product(productId)),
  };
}

function generated(productIds = ["PRODUCT_001", "PRODUCT_002"]): IssueComposition {
  return {
    event_id: EVENT_ID,
    issue_theme: "Heritage in Motion",
    editorial_angle: "How familiar MCM codes move into a contemporary context",
    selected_products: productIds.map((productId, index) => ({
      product_id: productId,
      product_role: index === 0 ? "Theme anchor" : "Material variation",
      discovery_direction: "A contemporary expression of established taste",
    })),
    brand_connection: {
      event_theme: "Modern Heritage",
      brand_direction: "Heritage reinterpreted for contemporary movement",
      connection_narrative: "The collection carries familiar craft into motion.",
    },
    personal_connection: {
      existing_preference: "The customer has consistently favored established heritage craft.",
      new_expression: "This Event expresses that same craft through contemporary movement.",
      connection_reason: "It extends the customer's own preference into a new context rather than repeating or generically recommending it.",
    },
    evidence: [
      "The event centers on Modern Heritage.",
      "Each selected product passed the Editorial Gatekeeper.",
    ],
  };
}

describe("composeIssue", () => {
  it("composes one Issue from every PASS Product in the same Event", async () => {
    const generate = vi.fn(async () => generated());

    const result = await composeIssue(input(), generate);

    expect(result).toEqual(generated());
    expect(generate).toHaveBeenCalledOnce();
    expect(generate).toHaveBeenCalledWith(input());
  });

  // brand_connection.event_theme/brand_direction은 모델이 재생성한 문자열을 신뢰하지
  // 않고 composeIssue()가 input.eventMeaningProfile에서 이미 아는 값을 결정론적으로
  // 그대로 쓴다 — 구두점/띄어쓰기 재생성 오차로 인한 identity 실패를 애초에 없앤다.
  it("overwrites brand_connection.event_theme/brand_direction with the input Event Meaning verbatim, even if the generator returns different text", async () => {
    const driftedGenerated = generated();
    driftedGenerated.brand_connection = {
      ...driftedGenerated.brand_connection,
      event_theme: "Modern Heritage — reinterpreted", // 원본과 다른 구두점/문구
      brand_direction: "heritage reinterpreted for contemporary movement.", // 대소문자/마침표 차이
    };

    const result = await composeIssue(input(), async () => driftedGenerated);

    expect(result.brand_connection.event_theme).toBe(eventMeaning.event_theme);
    expect(result.brand_connection.brand_direction).toBe(
      eventMeaning.brand_direction,
    );
    expect(result.brand_connection.connection_narrative).toBe(
      driftedGenerated.brand_connection.connection_narrative,
    );
  });

  // TASK-301 조사: passProductPool의 matching_reason/meaning_bridge/extension이 206
  // output에서 사라져 Issue가 브랜드/카탈로그 서술처럼 읽히는 문제를 해결하기 위해
  // personal_connection을 추가한다 — 기존 취향(existing_preference) -> 새 표현
  // (new_expression) -> 왜 의미있는 확장인지(connection_reason)를 강제한다.
  it("rejects a generated Issue that omits personal_connection", async () => {
    const generatedWithoutPersonalConnection = { ...generated() } as Record<
      string,
      unknown
    >;
    delete generatedWithoutPersonalConnection.personal_connection;

    await expect(
      composeIssue(input(), async () => generatedWithoutPersonalConnection),
    ).rejects.toThrow();
  });

  it("returns the personal_connection built from the generator's output", async () => {
    const result = await composeIssue(input(), async () => generated());

    expect(result.personal_connection).toEqual(
      generated().personal_connection,
    );
  });

  it("keeps the entire PASS Product Pool when it contains more than three products", async () => {
    const productIds = [
      "PRODUCT_001",
      "PRODUCT_002",
      "PRODUCT_003",
      "PRODUCT_004",
    ];

    const result = await composeIssue(input(productIds), async () =>
      generated(productIds),
    );

    expect(result.selected_products.map(({ product_id }) => product_id)).toEqual(
      productIds,
    );
  });

  it("rejects a Product Pool containing products from different Events before generation", async () => {
    const mixedInput = input();
    mixedInput.passProductPool[1] = product("PRODUCT_002", {
      event_id: "9cf8101c-420a-4ef3-af25-2c96f9cd4b46",
    });
    const generate = vi.fn(async () => generated());

    await expect(composeIssue(mixedInput, generate)).rejects.toThrow(
      /same Event/i,
    );
    expect(generate).not.toHaveBeenCalled();
  });

  it("rejects an Event Meaning Profile belonging to a different Event", async () => {
    const invalidInput = {
      ...input(),
      eventMeaningProfile: {
        ...eventMeaningProfile,
        event_id: "9cf8101c-420a-4ef3-af25-2c96f9cd4b46",
      },
    };
    const generate = vi.fn(async () => generated());

    await expect(composeIssue(invalidInput, generate)).rejects.toThrow(
      /Event Meaning Profile.*same Event/i,
    );
    expect(generate).not.toHaveBeenCalled();
  });

  it("rejects a non-PASS Product before generation", async () => {
    const invalidInput = input();
    invalidInput.passProductPool[1] = {
      ...product("PRODUCT_002"),
      decision: "REJECT",
    } as unknown as IssueCompositionInput["passProductPool"][number];
    const generate = vi.fn(async () => generated());

    await expect(composeIssue(invalidInput, generate)).rejects.toThrow(/PASS/i);
    expect(generate).not.toHaveBeenCalled();
  });

  it("rejects an empty PASS Product Pool before generation", async () => {
    const generate = vi.fn(async () => generated([]));

    await expect(
      composeIssue({ ...input(), passProductPool: [] }, generate),
    ).rejects.toThrow();
    expect(generate).not.toHaveBeenCalled();
  });

  it("rejects duplicate Product IDs in the input Pool before generation", async () => {
    const generate = vi.fn(async () =>
      generated(["PRODUCT_001", "PRODUCT_001"]),
    );

    await expect(
      composeIssue(input(["PRODUCT_001", "PRODUCT_001"]), generate),
    ).rejects.toThrow(/duplicate/i);
    expect(generate).not.toHaveBeenCalled();
  });

  it.each([
    ["missing", ["PRODUCT_001"]],
    ["additional", ["PRODUCT_001", "PRODUCT_002", "PRODUCT_003"]],
    ["duplicate", ["PRODUCT_001", "PRODUCT_001"]],
    ["reordered", ["PRODUCT_002", "PRODUCT_001"]],
  ])(
    "rejects a generated Issue with %s Product IDs",
    async (_caseName, productIds) => {
      await expect(
        composeIssue(input(), async () => generated(productIds)),
      ).rejects.toThrow(/exactly once.*input order/i);
    },
  );

  it("rejects generated editorial fields without meaningful content", async () => {
    await expect(
      composeIssue(input(), async () => ({
        ...generated(),
        issue_theme: "   ",
      })),
    ).rejects.toThrow();
  });
});
