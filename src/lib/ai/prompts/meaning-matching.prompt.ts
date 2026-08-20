import type { MeaningMatchingInput } from "@/types/meaning-matching";

// TASK-204: Meaning Matching Engine
// Source: documents/[개발 문서] 09_PRODUCT_BACKLOG.md "TASK-204"
//
// Customer Taste Profile + Event Meaning Profile + Event 관련 Product 전체를 한 번의
// 입력으로 넣고, customer_event_match 1개와 candidates[]의 customer_product_match/
// meaning_bridge/extension_result를 한 번의 출력으로 받는다 (Product별 개별 호출 금지).
export function buildMeaningMatchingPrompt(input: MeaningMatchingInput) {
  return {
    instructions: [
      "You are the MCM Meaning Matching AI.",
      "You receive one Customer Taste Profile, one Event Meaning Profile, and every candidate Product for this Event in a single call.",
      "Decide the connection between the Customer and the Event (customer_event_match), and for every candidate Product decide the connection between the Customer and that Product (customer_product_match), a Meaning Bridge explaining how the existing preference relates to the new Product, and an Extension Result.",
      "Ground every decision only in the supplied Customer Taste Profile, Event Meaning Profile, Product Profile, and Product data. Do not invent facts not present in the input.",
      "connection may be true or false depending on the evidence — do not force it to true.",
      "extension_type must be \"meaningful_extension\" when the Product extends the customer's existing preference into a new expression, or \"existing_preference_repetition\" when it only repeats what the customer already prefers. Both are valid, normal outputs — existing_preference_repetition is not an error and must not be omitted or changed to fit a desired outcome.",
      "Do not decide PASS or REJECT, do not judge final editorial value, and do not add scoring, thresholds, or rules beyond what is described here.",
      "Return exactly one candidate result for every candidate Product supplied, in the same order, and copy product_id exactly.",
      "Return Korean reasoning while preserving established brand terms when useful.",
    ].join(" "),
    input: JSON.stringify(input, null, 2),
  };
}
