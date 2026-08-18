import { describe, expect, it } from "vitest";

import { analyzeEventMeaning } from "./event-meaning-analysis";

const event = {
  id: "6ebeb5f4-f60f-45df-9008-f0641f7166af",
  event_code: "EVT_TEST",
  name: "MCM Test Collection",
  event_type: "collection" as const,
  campaign_overview: "A campaign about movement and craft.",
  brand_message: "Designed for modern nomads.",
  collection_concept: "Functional forms for travel.",
  related_product_ids: [],
  source: "seed" as const,
};

describe("analyzeEventMeaning", () => {
  it("returns a validated meaning profile when related products are empty", async () => {
    const result = await analyzeEventMeaning(
      { event, relatedProductProfiles: [] },
      async () => ({
        event_theme: "Mobility and craft",
        brand_direction: "Functional luxury for modern movement",
        event_traits: ["Mobility", "Craft"],
        evidence: [
          { source: "brand_message", text: "Designed for modern nomads." },
        ],
      }),
    );

    expect(result).toEqual({
      event_theme: "Mobility and craft",
      brand_direction: "Functional luxury for modern movement",
      event_traits: ["Mobility", "Craft"],
      evidence: [
        { source: "brand_message", text: "Designed for modern nomads." },
      ],
    });
  });

  it("rejects an AI response whose evidence has an unsupported source", async () => {
    await expect(
      analyzeEventMeaning({ event, relatedProductProfiles: [] }, async () => ({
        event_theme: "Mobility",
        brand_direction: "Modern movement",
        event_traits: ["Mobility"],
        evidence: [{ source: "invented_fact", text: "Not in the input" }],
      })),
    ).rejects.toThrow();
  });
});
