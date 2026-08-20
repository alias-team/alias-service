import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseServerClient } from "@/lib/database/supabase-server";
import { eventMeaningAnalysisSchema } from "@/lib/validation/event-meaning.schema";
import type {
  DataSource,
  Event,
  EventMeaningProfile,
  NewEventMeaningProfile,
} from "@/types/event";

// TASK-301 DB 연결 3단계: event_meaning_profiles의 현재(is_current=true) 프로필 조회.
// event_traits/evidence는 jsonb라 Supabase가 구조를 보장하지 않는다 — 억지로 캐스트하지
// 않고, 기존 eventMeaningAnalysisSchema(Zod)로 실제 검증한다(07_DATABASE_SCHEMA.md 10.3).
interface EventMeaningProfileRow {
  id: string;
  event_id: string;
  event_theme: string;
  brand_direction: string;
  event_traits: unknown;
  evidence: unknown;
  analysis_model: string | null;
  source: DataSource;
  is_current: boolean;
  created_at?: string;
  updated_at?: string;
}

function toEventMeaningProfile(row: EventMeaningProfileRow): EventMeaningProfile {
  const validated = eventMeaningAnalysisSchema.parse({
    event_theme: row.event_theme,
    brand_direction: row.brand_direction,
    event_traits: row.event_traits,
    evidence: row.evidence,
  });

  return {
    id: row.id,
    event_id: row.event_id,
    ...validated,
    analysis_model: row.analysis_model,
    source: row.source,
    is_current: row.is_current,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export interface EventRepository {
  findEventById(eventId: string): Promise<Event | null>;
  findCurrentMeaningProfile(eventId: string): Promise<EventMeaningProfile | null>;
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
          "id,event_code,name,event_type,campaign_overview,brand_message,collection_concept,related_product_ids,hero_image_url,official_url,source",
        )
        .eq("id", eventId)
        .maybeSingle();

      if (error) throw new Error(`Failed to load event: ${error.message}`);
      return data as Event | null;
    },

    async findCurrentMeaningProfile(eventId) {
      const { data, error } = await supabase
        .from("event_meaning_profiles")
        .select(
          "id,event_id,event_theme,brand_direction,event_traits,evidence,analysis_model,source,is_current,created_at,updated_at",
        )
        .eq("event_id", eventId)
        .eq("is_current", true)
        .maybeSingle();

      if (error) {
        throw new Error(`Failed to load current Event Meaning Profile: ${error.message}`);
      }
      if (!data) return null;
      return toEventMeaningProfile(data as EventMeaningProfileRow);
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
