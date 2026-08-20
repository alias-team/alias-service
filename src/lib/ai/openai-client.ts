import OpenAI from "openai";

let client: OpenAI | undefined;

// OPENAI_MAX_RETRIES가 설정되지 않으면 OpenAI SDK 기본값(2)을 그대로 쓴다 — 평소 동작은
// 바뀌지 않는다. 특정 실행에서만(예: 재시도 금지 검증) transport-level 자동 재시도를 끄고
// 싶을 때 OPENAI_MAX_RETRIES=0을 설정해 opt-in으로만 사용한다.
export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  if (!client) {
    const maxRetriesEnv = process.env.OPENAI_MAX_RETRIES;
    const maxRetries = maxRetriesEnv === undefined ? undefined : Number(maxRetriesEnv);
    client = new OpenAI({ apiKey, ...(maxRetries === undefined ? {} : { maxRetries }) });
  }
  return client;
}
