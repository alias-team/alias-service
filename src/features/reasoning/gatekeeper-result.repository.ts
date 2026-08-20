import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseServerClient } from "@/lib/database/supabase-server";
import type { GatekeeperResult, NewGatekeeperResult } from "@/types/reasoning";

// TASK-301 DB 연결: Backend Orchestrator 3단계 — gatekeeper_results read/write.
// Source: documents/[개발 문서] 07_DATABASE_SCHEMA.md (4.10 gatekeeper_results)
//
// 07_DATABASE_SCHEMA.md 69행: matching_results -> gatekeeper_results = 1:1("매칭 결과는
// 하나의 PASS 또는 REJECT 판단으로 이어진다"). insert()는 orchestrator.service.ts가
// TASK-205(evaluateGatekeeper)의 product별 evaluations[]에서 이미 도출한 reasoning_run
// 전체의 "대표" 결과 1건만 받는다 — product별 개별 판단은 이 테이블에 저장하지 않는다
// (runtime GatekeeperOutput에서만 유지됨, 07_확인 감사 결과에 따른 설계).

export interface GatekeeperResultRepository {
  insert(input: NewGatekeeperResult): Promise<GatekeeperResult>;
  findByReasoningRunId(reasoningRunId: string): Promise<GatekeeperResult | null>;
}

const SELECT_COLUMNS =
  "id,reasoning_run_id,matching_result_id,decision,reason,editorial_angle,failed_rules,candidate_product_ids,source,created_at";

export function createGatekeeperResultRepository(
  supabase: SupabaseClient = getSupabaseServerClient(),
): GatekeeperResultRepository {
  return {
    async insert(input) {
      const { data, error } = await supabase
        .from("gatekeeper_results")
        .insert(input)
        .select(SELECT_COLUMNS)
        .single();

      if (error) throw new Error(`Failed to save Gatekeeper Result: ${error.message}`);
      return data as GatekeeperResult;
    },

    async findByReasoningRunId(reasoningRunId) {
      const { data, error } = await supabase
        .from("gatekeeper_results")
        .select(SELECT_COLUMNS)
        .eq("reasoning_run_id", reasoningRunId)
        .maybeSingle();

      if (error) throw new Error(`Failed to load Gatekeeper Result: ${error.message}`);
      return (data as GatekeeperResult | null) ?? null;
    },
  };
}
