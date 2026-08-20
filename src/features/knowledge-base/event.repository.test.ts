import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

import { createEventRepository } from "./event.repository";
import type {
  EventMeaningProfile,
  NewEventMeaningProfile,
} from "@/types/event";

describe("EventRepository", () => {
  it("returns the event including hero_image_url/official_url when present", async () => {
    const row = {
      id: "6ebeb5f4-f60f-45df-9008-f0641f7166af",
      event_code: "EVT_TRAVEL_EDIT_2026",
      name: "MCM Travel | Edit",
      event_type: "brand_event",
      campaign_overview: "A campaign about mobility.",
      brand_message: "Designed for modern nomads.",
      collection_concept: null,
      related_product_ids: [],
      hero_image_url: "/images/travel-edit-hero.jpg",
      official_url: "https://www.mcmworldwide.com/travel-edit",
      source: "seed",
    };
    const table = {
      select: () => ({
        eq: () => ({ maybeSingle: async () => ({ data: row, error: null }) }),
      }),
    };
    const supabase = { from: () => table } as unknown as SupabaseClient;

    const event = await createEventRepository(supabase).findEventById(row.id);

    expect(event).toEqual(row);
  });

  it("returns the event with hero_image_url/official_url as null when the Event has none yet", async () => {
    const row = {
      id: "6ebeb5f4-f60f-45df-9008-f0641f7166af",
      event_code: "EVT_TRAVEL_EDIT_2026",
      name: "MCM Travel | Edit",
      event_type: "brand_event",
      campaign_overview: "A campaign about mobility.",
      brand_message: "Designed for modern nomads.",
      collection_concept: null,
      related_product_ids: [],
      hero_image_url: null,
      official_url: null,
      source: "seed",
    };
    const table = {
      select: () => ({
        eq: () => ({ maybeSingle: async () => ({ data: row, error: null }) }),
      }),
    };
    const supabase = { from: () => table } as unknown as SupabaseClient;

    const event = await createEventRepository(supabase).findEventById(row.id);

    expect(event?.hero_image_url).toBeNull();
    expect(event?.official_url).toBeNull();
  });

  it("returns null when no event matches the id", async () => {
    const table = {
      select: () => ({
        eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }),
      }),
    };
    const supabase = { from: () => table } as unknown as SupabaseClient;

    const event = await createEventRepository(supabase).findEventById("missing");

    expect(event).toBeNull();
  });

  it("throws when Supabase returns an error for findEventById", async () => {
    const table = {
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: null, error: { message: "connection refused" } }),
        }),
      }),
    };
    const supabase = { from: () => table } as unknown as SupabaseClient;

    await expect(
      createEventRepository(supabase).findEventById("6ebeb5f4-f60f-45df-9008-f0641f7166af"),
    ).rejects.toThrow(/connection refused/);
  });

  it("returns the current Event Meaning Profile, validating the stored jsonb shape", async () => {
    const row = {
      id: "2e352337-9590-44de-9fc8-f90dc16f8434",
      event_id: "6ebeb5f4-f60f-45df-9008-f0641f7166af",
      event_theme: "Mobility",
      brand_direction: "Modern movement",
      event_traits: ["Mobility"],
      evidence: [{ source: "brand_message", text: "Modern nomads" }],
      analysis_model: "test-model",
      source: "ai_generated",
      is_current: true,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    };
    const table = {
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: row, error: null }),
          }),
        }),
      }),
    };
    const supabase = { from: () => table } as unknown as SupabaseClient;

    const profile = await createEventRepository(supabase).findCurrentMeaningProfile(
      row.event_id,
    );

    expect(profile).toEqual(row);
  });

  it("returns null when the event has no current Meaning Profile", async () => {
    const table = {
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: null, error: null }),
          }),
        }),
      }),
    };
    const supabase = { from: () => table } as unknown as SupabaseClient;

    const profile = await createEventRepository(supabase).findCurrentMeaningProfile(
      "6ebeb5f4-f60f-45df-9008-f0641f7166af",
    );

    expect(profile).toBeNull();
  });

  it("throws when the stored evidence jsonb does not match the schema", async () => {
    const table = {
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: async () => ({
              data: {
                id: "2e352337-9590-44de-9fc8-f90dc16f8434",
                event_id: "6ebeb5f4-f60f-45df-9008-f0641f7166af",
                event_theme: "Mobility",
                brand_direction: "Modern movement",
                event_traits: ["Mobility"],
                evidence: [{ source: "invented_fact", text: "Not a real source" }],
                analysis_model: "test-model",
                source: "ai_generated",
                is_current: true,
              },
              error: null,
            }),
          }),
        }),
      }),
    };
    const supabase = { from: () => table } as unknown as SupabaseClient;

    await expect(
      createEventRepository(supabase).findCurrentMeaningProfile(
        "6ebeb5f4-f60f-45df-9008-f0641f7166af",
      ),
    ).rejects.toThrow();
  });

  it("throws when Supabase returns an error for findCurrentMeaningProfile", async () => {
    const table = {
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: async () => ({
              data: null,
              error: { message: "connection refused" },
            }),
          }),
        }),
      }),
    };
    const supabase = { from: () => table } as unknown as SupabaseClient;

    await expect(
      createEventRepository(supabase).findCurrentMeaningProfile(
        "6ebeb5f4-f60f-45df-9008-f0641f7166af",
      ),
    ).rejects.toThrow(/connection refused/);
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
