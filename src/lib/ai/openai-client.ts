import OpenAI from "openai";

let client: OpenAI | undefined;

// TASK-301 Backend E2E 감사 결과 반영: SDK 기본값(timeout=10분, maxRetries=2)에 전적으로
// 의존하던 이전 상태에서, 실제 실행 중 하나가 10분 가까이 응답을 기다리다 reasoning_run이
// processing 상태로 orphan되는 문제가 실측됐다. 이 공용 client를 쓰는 모든 AI 호출
// (TASK-201~207 전부, product-understanding.ts/customer-taste-discovery.ts/
// event-meaning-analysis.ts/meaning-matching.ts/gatekeeper.ts/issue-composition.ts/
// editorial-generator.ts)에 동일하게 적용된다 — TASK별로 다르게 주지 않는다.
const DEFAULT_TIMEOUT_MS = 120_000;
const DEFAULT_MAX_RETRIES = 1;

// OPENAI_MAX_RETRIES가 설정되면 그 값을 그대로 쓴다(기존 override 메커니즘 유지) —
// 설정되지 않으면 SDK 기본값(2)이 아니라 이번에 확정한 기본값(1)을 명시적으로 쓴다.
export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  if (!client) {
    const maxRetriesEnv = process.env.OPENAI_MAX_RETRIES;
    const maxRetries = maxRetriesEnv === undefined ? DEFAULT_MAX_RETRIES : Number(maxRetriesEnv);
    client = new OpenAI({ apiKey, timeout: DEFAULT_TIMEOUT_MS, maxRetries });
  }
  return client;
}
