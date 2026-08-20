import type { DataSource } from "./event";
import type { GatekeeperDecision } from "./gatekeeper";

// TASK-301 DB 연결: reasoning_runs / matching_results / gatekeeper_results / personal_editorials
// 저장/조회 타입. Source: documents/[개발 문서] 07_DATABASE_SCHEMA.md (4.8~4.11)
//
// 07_DATABASE_SCHEMA.md 63-70행이 명시한 cardinality를 그대로 따른다:
//   reasoning_runs -> matching_results = 1:1 ("한 번의 MVP 실행은 하나의 대표 Matching Result")
//   matching_results -> gatekeeper_results = 1:1 ("매칭 결과는 하나의 PASS 또는 REJECT 판단")
//   gatekeeper_results -> personal_editorials = 1:0..1 ("PASS 결과만 Personal Editorial 생성")

export type ReasoningRunStatus = "pending" | "processing" | "completed" | "failed";

export interface ReasoningRun {
  id: string;
  customer_id: string;
  event_id: string;
  customer_taste_profile_id: string;
  event_meaning_profile_id: string;
  status: ReasoningRunStatus;
  source: DataSource;
  started_at: string;
  completed_at: string | null;
  error_message: string | null;
  created_at: string;
}

export interface NewReasoningRun {
  customer_id: string;
  event_id: string;
  customer_taste_profile_id: string;
  event_meaning_profile_id: string;
  source: DataSource;
}

// matching_results 3개 jsonb 컬럼은 TASK-204 실제 output(customer_event_match / candidates[])을
// 컬럼 의미(07_DATABASE_SCHEMA.md 4.9 설명)에 맞춰 명시적으로 투영한 값을 담는다. 구조를
// 새로 발명하지 않고, 204 output을 그대로/부분적으로 옮겨 담는다 — orchestrator.service.ts의
// buildMatchingResultColumns()에서 그 매핑을 그대로 볼 수 있다.
export interface NewMatchingResult {
  reasoning_run_id: string;
  customer_evidence: unknown;
  product_event_evidence: unknown;
  meaning_bridge: unknown;
  candidate_product_ids: string[];
  is_valid: boolean;
  validation_errors: unknown[];
  analysis_model: string | null;
  source: DataSource;
}

export interface MatchingResult extends NewMatchingResult {
  id: string;
  created_at: string;
}

// gatekeeper_results는 reasoning_run당 1 row(대표 결과)다. decision/reason/editorial_angle은
// 이 reasoning_run 전체를 대표하는 단일 값이며, TASK-205가 만드는 product별 GatekeeperEvaluation[]
// 자체를 대체하지 않는다 — orchestrator.service.ts가 대표값을 도출하는 규칙(PASS 1개 이상 존재
// -> decision=PASS, candidate_product_ids=passProductPool; 전부 REJECT -> decision=REJECT,
// candidate_product_ids=[])을 그대로 구현한다.
export interface NewGatekeeperResult {
  reasoning_run_id: string;
  matching_result_id: string;
  decision: GatekeeperDecision;
  reason: string;
  editorial_angle: string | null;
  failed_rules: unknown[];
  candidate_product_ids: string[];
  source: DataSource;
}

export interface GatekeeperResult extends NewGatekeeperResult {
  id: string;
  created_at: string;
}

export interface NewPersonalEditorial {
  gatekeeper_result_id: string;
  reasoning_run_id: string;
  customer_id: string;
  event_id: string;
  title: string;
  hero_image_url: string | null;
  brand_story: string;
  personal_connection: string;
  product_discovery: unknown[];
  closing_message: string;
  editorial_content: unknown;
  generation_model: string | null;
  source: DataSource;
}

export interface PersonalEditorialRow extends NewPersonalEditorial {
  id: string;
  created_at: string;
  updated_at: string;
}
