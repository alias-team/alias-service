import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseServerClient } from "@/lib/database/supabase-server";
import type { NewPersonalEditorial, PersonalEditorialRow } from "@/types/reasoning";

// TASK-301 DB 연결: Backend Orchestrator 4단계 — personal_editorials read/write.
// Source: documents/[개발 문서] 07_DATABASE_SCHEMA.md (4.11 personal_editorials)
//
// 07_DATABASE_SCHEMA.md 70행: gatekeeper_results -> personal_editorials = 1:0..1("PASS
// 결과만 Personal Editorial을 생성할 수 있다"). insert()는 orchestrator.service.ts가 이미
// TASK-207(generateEditorial) 결과를 검증까지 마친 뒤에만 호출한다.

export interface PersonalEditorialRepository {
  insert(input: NewPersonalEditorial): Promise<PersonalEditorialRow>;
  findById(id: string): Promise<PersonalEditorialRow | null>;
  findByReasoningRunId(reasoningRunId: string): Promise<PersonalEditorialRow | null>;
}

const SELECT_COLUMNS =
  "id,gatekeeper_result_id,reasoning_run_id,customer_id,event_id,title,hero_image_url,brand_story,personal_connection,product_discovery,closing_message,editorial_content,generation_model,source,created_at,updated_at";

export function createPersonalEditorialRepository(
  supabase: SupabaseClient = getSupabaseServerClient(),
): PersonalEditorialRepository {
  return {
    async insert(input) {
      const { data, error } = await supabase
        .from("personal_editorials")
        .insert(input)
        .select(SELECT_COLUMNS)
        .single();

      if (error) throw new Error(`Failed to save Personal Editorial: ${error.message}`);
      return data as PersonalEditorialRow;
    },

    async findById(id) {
      const { data, error } = await supabase
        .from("personal_editorials")
        .select(SELECT_COLUMNS)
        .eq("id", id)
        .maybeSingle();

      if (error) throw new Error(`Failed to load Personal Editorial: ${error.message}`);
      return (data as PersonalEditorialRow | null) ?? null;
    },

    async findByReasoningRunId(reasoningRunId) {
      const { data, error } = await supabase
        .from("personal_editorials")
        .select(SELECT_COLUMNS)
        .eq("reasoning_run_id", reasoningRunId)
        .maybeSingle();

      if (error) throw new Error(`Failed to load Personal Editorial: ${error.message}`);
      return (data as PersonalEditorialRow | null) ?? null;
    },
  };
}
