import type { EventMeaningProfile } from "./event";

export interface IssueCompositionProduct {
  name: string;
  category: string;
  collection: string | null;
  image_url: string | null;
}

export interface IssueCompositionProductProfile {
  core4: unknown;
  ai_product_traits: unknown[];
}

export interface PassProductCandidate {
  event_id: string;
  product_id: string;
  decision: "PASS";
  product: IssueCompositionProduct;
  product_profile: IssueCompositionProductProfile;
  editorial_angle: string;
  matching_reason: string;
  meaning_bridge: string;
  extension: string;
  // TASK-205 pass-through 보완: TASK-204 extension_result.existing_preference/
  // new_expression을 변형 없이 그대로 보존한다(hydratePassCandidate에서만 사용,
  // extension_reason만 옮기던 기존 방식은 유지하고 이 둘을 추가한다). 새 판단 아님.
  existing_preference: string;
  new_expression: string;
  evidence: string[];
}

export interface IssueCompositionInput {
  event_id: string;
  eventMeaningProfile: EventMeaningProfile;
  passProductPool: PassProductCandidate[];
}

export interface SelectedProductComposition {
  product_id: string;
  product_role: string;
  discovery_direction: string;
}

export interface BrandConnection {
  event_theme: string;
  brand_direction: string;
  connection_narrative: string;
}

// TASK-301 조사 결과 대응: passProductPool[].matching_reason/meaning_bridge/extension
// (TASK-204/205가 이미 만든 고객 개인화 근거)이 brand_connection(브랜드/이벤트 중심)에는
// 담기지 않고 사라지던 지점 — 고객의 기존 취향(existing_preference) -> 이번 발견에서
// 드러나는 새 표현(new_expression) -> 왜 단순 반복이 아니라 이 고객에게 의미 있는 확장인지
// (connection_reason)를 위해 전용 필드로 분리한다.
export interface PersonalConnection {
  existing_preference: string;
  new_expression: string;
  connection_reason: string;
}

export interface IssueComposition {
  event_id: string;
  issue_theme: string;
  editorial_angle: string;
  selected_products: SelectedProductComposition[];
  brand_connection: BrandConnection;
  personal_connection: PersonalConnection;
  evidence: string[];
}
