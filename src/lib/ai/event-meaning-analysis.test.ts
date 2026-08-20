import { describe, expect, it } from "vitest";

import { analyzeEventMeaning, toEventMeaningContext } from "./event-meaning-analysis";
import { gatekeeperInputSchema } from "@/lib/validation/gatekeeper.schema";
import type { EventMeaningProfile } from "@/types/event";

const event = {
  id: "6ebeb5f4-f60f-45df-9008-f0641f7166af",
  event_code: "EVT_TEST",
  name: "MCM Test Collection",
  event_type: "collection" as const,
  campaign_overview: "A campaign about movement and craft.",
  brand_message: "Designed for modern nomads.",
  collection_concept: "Functional forms for travel.",
  related_product_ids: [],
  hero_image_url: null,
  official_url: null,
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

describe("toEventMeaningContext", () => {
  const profile: EventMeaningProfile = {
    id: "event-meaning-1",
    event_id: event.id,
    event_theme: "Mobility and craft",
    brand_direction: "Functional luxury for modern movement",
    event_traits: ["Mobility", "Craft"],
    evidence: [{ source: "brand_message", text: "Designed for modern nomads." }],
    analysis_model: "gpt-5-mini",
    source: "ai_generated",
    is_current: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  };

  it("keeps only event_id/event_theme/brand_direction/event_traits/evidence", () => {
    const result = toEventMeaningContext(profile);

    expect(result).toEqual({
      event_id: profile.event_id,
      event_theme: profile.event_theme,
      brand_direction: profile.brand_direction,
      event_traits: profile.event_traits,
      evidence: profile.evidence,
    });
  });

  it("drops DB row metadata TASK-204 does not need (id/analysis_model/source/is_current/timestamps)", () => {
    const result = toEventMeaningContext(profile);

    expect(result).not.toHaveProperty("id");
    expect(result).not.toHaveProperty("analysis_model");
    expect(result).not.toHaveProperty("source");
    expect(result).not.toHaveProperty("is_current");
    expect(result).not.toHaveProperty("created_at");
    expect(result).not.toHaveProperty("updated_at");
  });

  it("produces a value that satisfies the existing GatekeeperInput.event_meaning_profile schema", () => {
    const result = toEventMeaningContext(profile);

    expect(() =>
      gatekeeperInputSchema.shape.event_meaning_profile.parse(result),
    ).not.toThrow();
  });
});
