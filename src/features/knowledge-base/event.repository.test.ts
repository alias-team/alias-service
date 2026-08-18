import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

import { createEventRepository } from "./event.repository";
import type {
  EventMeaningProfile,
  NewEventMeaningProfile,
} from "@/types/event";

describe("EventRepository", () => {
  it("does not query Supabase when an event has no related products", async () => {
    const supabase = {
      from: () => {
        throw new Error("Supabase must not be queried");
      },
    } as unknown as SupabaseClient;

    const profiles = await createEventRepository(
      supabase,
    ).findRelatedProductProfiles([]);

    expect(profiles).toEqual([]);
  });

  it("inserts the new current profile before clearing older current profiles", async () => {
    const operations: string[] = [];
    const profile: NewEventMeaningProfile = {
      event_id: "6ebeb5f4-f60f-45df-9008-f0641f7166af",
      event_theme: "Mobility",
      brand_direction: "Modern movement",
      event_traits: ["Mobility"],
      evidence: [{ source: "brand_message", text: "Modern nomads" }],
      analysis_model: "test-model",
      source: "ai_generated",
      is_current: true,
    };
    const saved: EventMeaningProfile = {
      id: "2e352337-9590-44de-9fc8-f90dc16f8434",
      ...profile,
    };
    const table = {
      insert: () => {
        operations.push("insert");
        return { select: () => ({ single: async () => ({ data: saved, error: null }) }) };
      },
      update: () => {
        operations.push("update");
        return {
          eq: () => ({
            eq: () => ({
              neq: async () => ({ data: null, error: null }),
            }),
          }),
        };
      },
    };
    const supabase = { from: () => table } as unknown as SupabaseClient;

    const result = await createEventRepository(
      supabase,
    ).replaceCurrentMeaningProfile(profile);

    expect(operations).toEqual(["insert", "update"]);
    expect(result).toEqual(saved);
  });
});
