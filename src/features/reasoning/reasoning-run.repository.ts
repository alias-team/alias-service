import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseServerClient } from "@/lib/database/supabase-server";
import type { NewReasoningRun, ReasoningRun } from "@/types/reasoning";

// TASK-301 DB 연결: Backend Orchestrator 1단계 — reasoning_runs read/write.
// Source: documents/[개발 문서] 07_DATABASE_SCHEMA.md (4.8 reasoning_runs)
//
// AI 판단 로직은 다루지 않는다 — DB read/write와 상태 전이(pending -> processing ->
// completed/failed)만 담당한다. reasoning_run_status enum에 없는 값('skipped' 등)은
// 절대 쓰지 않는다 — enum에 실제로 존재하는 4개 값만 사용한다.

const ACTIVE_STATUSES = ["pending", "processing"] as const;

export interface ReasoningRunRepository {
  create(input: NewReasoningRun): Promise<ReasoningRun>;
  markProcessing(id: string): Promise<ReasoningRun>;
  markCompleted(id: string): Promise<ReasoningRun>;
  markFailed(id: string, errorMessage: string): Promise<ReasoningRun>;
  findById(id: string): Promise<ReasoningRun | null>;
  // TASK-301: 동일 customer+event의 중복 요청 최소 방어(best-effort, race condition을
  // 완전히 막지는 못한다 — unique constraint가 없으므로 schema로 강제하지 않는다).
  findActiveByCustomerAndEvent(
    customerId: string,
    eventId: string,
  ): Promise<ReasoningRun | null>;
}

const SELECT_COLUMNS =
  "id,customer_id,event_id,customer_taste_profile_id,event_meaning_profile_id,status,source,started_at,completed_at,error_message,created_at";

export function createReasoningRunRepository(
  supabase: SupabaseClient = getSupabaseServerClient(),
): ReasoningRunRepository {
  return {
    async create(input) {
      const { data, error } = await supabase
        .from("reasoning_runs")
        .insert(input)
        .select(SELECT_COLUMNS)
        .single();

      if (error) throw new Error(`Failed to create Reasoning Run: ${error.message}`);
      return data as ReasoningRun;
    },

    async markProcessing(id) {
      const { data, error } = await supabase
        .from("reasoning_runs")
        .update({ status: "processing" })
        .eq("id", id)
        .select(SELECT_COLUMNS)
        .single();

      if (error) throw new Error(`Failed to mark Reasoning Run processing: ${error.message}`);
      return data as ReasoningRun;
    },

    async markCompleted(id) {
      const { data, error } = await supabase
        .from("reasoning_runs")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", id)
        .select(SELECT_COLUMNS)
        .single();

      if (error) throw new Error(`Failed to mark Reasoning Run completed: ${error.message}`);
      return data as ReasoningRun;
    },

    async markFailed(id, errorMessage) {
      const { data, error } = await supabase
        .from("reasoning_runs")
        .update({
          status: "failed",
          completed_at: new Date().toISOString(),
          error_message: errorMessage,
        })
        .eq("id", id)
        .select(SELECT_COLUMNS)
        .single();

      if (error) throw new Error(`Failed to mark Reasoning Run failed: ${error.message}`);
      return data as ReasoningRun;
    },

    async findById(id) {
      const { data, error } = await supabase
        .from("reasoning_runs")
        .select(SELECT_COLUMNS)
        .eq("id", id)
        .maybeSingle();

      if (error) throw new Error(`Failed to load Reasoning Run: ${error.message}`);
      return (data as ReasoningRun | null) ?? null;
    },

    async findActiveByCustomerAndEvent(customerId, eventId) {
      const { data, error } = await supabase
        .from("reasoning_runs")
        .select(SELECT_COLUMNS)
        .eq("customer_id", customerId)
        .eq("event_id", eventId)
        .in("status", [...ACTIVE_STATUSES])
        .limit(1)
        .maybeSingle();

      if (error) {
        throw new Error(`Failed to check for an active Reasoning Run: ${error.message}`);
      }
      return (data as ReasoningRun | null) ?? null;
    },
  };
}
