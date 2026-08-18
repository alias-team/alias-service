import { describe, expect, it } from "vitest";

import { createEventService } from "./event.service";
import type { NewEventMeaningProfile } from "@/types/event";

const event = {
  id: "6ebeb5f4-f60f-45df-9008-f0641f7166af",
  event_code: "EVT_TEST",
  name: "MCM Test Collection",
  event_type: "collection" as const,
  campaign_overview: "A campaign about movement and craft.",
  brand_message: "Designed for modern nomads.",
  collection_concept: null,
  related_product_ids: [],
  source: "seed" as const,
};

describe("EventService", () => {
  it("analyzes and saves an event even when it has no related products", async () => {
    const savedProfiles: unknown[] = [];
    const repository = {
      findEventById: async () => event,
      findRelatedProductProfiles: async () => [],
      replaceCurrentMeaningProfile: async (profile: NewEventMeaningProfile) => {
        savedProfiles.push(profile);
        return { id: "profile-id", ...profile };
      },
    };
    const analyzer = async () => ({
      event_theme: "Mobility",
      brand_direction: "Modern movement",
      event_traits: ["Mobility"],
      evidence: [{ source: "brand_message" as const, text: event.brand_message }],
    });

    const service = createEventService({ repository, analyzer });
    const result = await service.generateMeaningProfile(event.id);

    expect(savedProfiles).toEqual([
      {
        event_id: event.id,
        event_theme: "Mobility",
        brand_direction: "Modern movement",
        event_traits: ["Mobility"],
        evidence: [{ source: "brand_message", text: event.brand_message }],
        analysis_model: null,
        source: "ai_generated",
        is_current: true,
      },
    ]);
    expect(result.id).toBe("profile-id");
  });

  it("fails without calling the analyzer when the event does not exist", async () => {
    let analyzed = false;
    const service = createEventService({
      repository: {
        findEventById: async () => null,
        findRelatedProductProfiles: async () => [],
        replaceCurrentMeaningProfile: async () => {
          throw new Error("must not save");
        },
      },
      analyzer: async () => {
        analyzed = true;
        throw new Error("must not analyze");
      },
    });

    await expect(service.generateMeaningProfile("missing")).rejects.toThrow(
      "Event not found: missing",
    );
    expect(analyzed).toBe(false);
  });
});
