import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseServerClient } from "@/lib/database/supabase-server";
import type {
  Event,
  EventMeaningProfile,
  NewEventMeaningProfile,
  RelatedProductProfile,
} from "@/types/event";

export interface EventRepository {
  findEventById(eventId: string): Promise<Event | null>;
  findRelatedProductProfiles(
    productIds: string[],
  ): Promise<RelatedProductProfile[]>;
  replaceCurrentMeaningProfile(
    profile: NewEventMeaningProfile,
  ): Promise<EventMeaningProfile>;
}

export function createEventRepository(
  supabase: SupabaseClient = getSupabaseServerClient(),
): EventRepository {
  return {
    async findEventById(eventId) {
      const { data, error } = await supabase
        .from("events")
        .select(
          "id,event_code,name,event_type,campaign_overview,brand_message,collection_concept,related_product_ids,source",
        )
        .eq("id", eventId)
        .maybeSingle();

      if (error) throw new Error(`Failed to load event: ${error.message}`);
      return data as Event | null;
    },

    async findRelatedProductProfiles(productIds) {
      if (productIds.length === 0) return [];

      const { data, error } = await supabase
        .from("product_profiles")
        .select("id,product_id,core4,ai_product_traits,evidence")
        .in("product_id", productIds)
        .eq("is_current", true);

      if (error) {
        throw new Error(`Failed to load related product profiles: ${error.message}`);
      }
      return (data ?? []) as RelatedProductProfile[];
    },

    async replaceCurrentMeaningProfile(profile) {
      const { data, error } = await supabase
        .from("event_meaning_profiles")
        .insert(profile)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to save Event Meaning Profile: ${error.message}`);
      }

      const saved = data as EventMeaningProfile;
      const { error: updateError } = await supabase
        .from("event_meaning_profiles")
        .update({ is_current: false })
        .eq("event_id", profile.event_id)
        .eq("is_current", true)
        .neq("id", saved.id);

      if (updateError) {
        throw new Error(
          `Saved the new profile but failed to clear older current profiles: ${updateError.message}`,
        );
      }
      return saved;
    },
  };
}
