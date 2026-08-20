// TASK-204: Meaning Matching Engine
// Source: documents/[개발 문서] 09_PRODUCT_BACKLOG.md "TASK-204"
//
// 이 파일은 TASK-204가 직접 생성하는 결과(customer_event_match, candidate별
// customer_product_match/meaning_bridge/extension_result)만 다룬다. GatekeeperInput
// 전체 조립(customer_profile/event_meaning_profile/product/product_profile 병합)은
// TASK-204-C의 책임이다.
//
// TASK-205 Gatekeeper 계약(src/types/gatekeeper.ts)과 candidate별 필드 이름/타입이
// 그대로 호환되도록 CustomerEventMatch/CustomerProductMatch/ExtensionResult와
// GatekeeperProduct/GatekeeperProductProfile을 재사용한다 — 중복 정의하지 않는다.

import type {
  CustomerEventMatch,
  CustomerProductMatch,
  CustomerProfileContext,
  EventMeaningContext,
  ExtensionResult,
  GatekeeperProduct,
  GatekeeperProductProfile,
} from "./gatekeeper";

// TASK-202 Customer Taste Profile과 TASK-203 Event Meaning Profile 중 Matching에
// 필요한 부분은 TASK-205 Gatekeeper가 이미 동일한 모양으로 정의해 두었으므로
// (CustomerProfileContext / EventMeaningContext) 그대로 재사용한다 — 중복 정의하지 않는다.
export type MeaningMatchingCustomerProfile = CustomerProfileContext;
export type MeaningMatchingEventMeaningProfile = EventMeaningContext;

/** TASK-201 Product Profile + Event 관련 Product 원본 — 이벤트당 후보 상품 하나. */
export interface MeaningMatchingCandidateProduct {
  product_id: string;
  product: GatekeeperProduct;
  product_profile: GatekeeperProductProfile;
}

export interface MeaningMatchingInput {
  event_id: string;
  customer_profile: MeaningMatchingCustomerProfile;
  event_meaning_profile: MeaningMatchingEventMeaningProfile;
  candidates: MeaningMatchingCandidateProduct[];
}

export interface MeaningMatchingCandidateResult {
  product_id: string;
  customer_product_match: CustomerProductMatch;
  meaning_bridge: string;
  extension_result: ExtensionResult;
}

/** OpenAI가 이벤트당 1회 호출로 반환하는 원본 구조. */
export interface MeaningMatchingAiOutput {
  customer_event_match: CustomerEventMatch;
  candidates: MeaningMatchingCandidateResult[];
}

/** TASK-204가 직접 생성하는 최종 결과 — GatekeeperInput 조립은 TASK-204-C가 담당한다. */
export interface MeaningMatchingOutput {
  event_id: string;
  customer_event_match: CustomerEventMatch;
  candidates: MeaningMatchingCandidateResult[];
}
