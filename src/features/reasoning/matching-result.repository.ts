import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseServerClient } from "@/lib/database/supabase-server";
import type { MatchingResult, NewMatchingResult } from "@/types/reasoning";

// TASK-301 DB 연결: Backend Orchestrator 2단계 — matching_results read/write.
// Source: documents/[개발 문서] 07_DATABASE_SCHEMA.md (4.9 matching_results)
//
// 07_DATABASE_SCHEMA.md 68행: reasoning_runs -> matching_results = 1:1("한 번의 MVP 실행은
// 하나의 대표 Matching Result를 생성한다"). insert()는 orchestrator.service.ts가 이미
// TASK-204(matchMeaning) 결과를 이 컬럼 의미에 맞게 매핑한 값만 받는다 — 여기서 다시
// 매핑하거나 검증 실패 결과를 저장하지 않는다.

export interface MatchingResultRepository {
  insert(input: NewMatchingResult): Promise<MatchingResult>;
  findByReasoningRunId(reasoningRunId: string): Promise<MatchingResult | null>;
}

const SELECT_COLUMNS =
  "id,reasoning_run_id,customer_evidence,product_event_evidence,meaning_bridge,candidate_product_ids,is_valid,validation_errors,analysis_model,source,created_at";

export function createMatchingResultRepository(
  supabase: SupabaseClient = getSupabaseServerClient(),
): MatchingResultRepository {
  return {
    async insert(input) {
      const { data, error } = await supabase
        .from("matching_results")
        .insert(input)
        .select(SELECT_COLUMNS)
        .single();

      if (error) throw new Error(`Failed to save Matching Result: ${error.message}`);
      return data as MatchingResult;
    },

    async findByReasoningRunId(reasoningRunId) {
      const { data, error } = await supabase
        .from("matching_results")
        .select(SELECT_COLUMNS)
        .eq("reasoning_run_id", reasoningRunId)
        .maybeSingle();

      if (error) throw new Error(`Failed to load Matching Result: ${error.message}`);
      return (data as MatchingResult | null) ?? null;
    },
  };
}
