export type DataSource = "seed" | "ai_generated";
export type EventType = "collection" | "campaign" | "brand_event";

export interface Event {
  id: string;
  event_code: string;
  name: string;
  event_type: EventType;
  campaign_overview: string;
  brand_message: string;
  collection_concept: string | null;
  related_product_ids: string[];
  // TASK-301 DB 연결: Event 단위 대표 이미지 / MCM 공식 페이지 링크. 아직 실제 값이 없는
  // Event가 많아 nullable이다 — "값 없음"을 null로, placeholder 문자열로 대체하지 않는다.
  hero_image_url: string | null;
  official_url: string | null;
  source: DataSource;
}

export interface RelatedProductProfile {
  id: string;
  product_id: string;
  core4: unknown;
  ai_product_traits: unknown[];
  evidence: unknown[];
}

export type EventEvidenceSource =
  | "campaign_overview"
  | "brand_message"
  | "collection_concept"
  | "related_product_profile";

export interface EventMeaningEvidence {
  source: EventEvidenceSource;
  text: string;
}

export interface EventMeaningAnalysis {
  event_theme: string;
  brand_direction: string;
  event_traits: string[];
  evidence: EventMeaningEvidence[];
}

export interface EventMeaningProfile extends EventMeaningAnalysis {
  id: string;
  event_id: string;
  analysis_model: string | null;
  source: DataSource;
  is_current: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface NewEventMeaningProfile extends EventMeaningAnalysis {
  event_id: string;
  analysis_model: string | null;
  source: "ai_generated";
  is_current: true;
}

export interface EventMeaningInput {
  event: Event;
  relatedProductProfiles?: RelatedProductProfile[];
}
