import type { DataSource } from "./event";

// TASK-301 DB 연결 1단계: products 테이블 읽기 전용 타입
// Source: documents/[개발 문서] 07_DATABASE_SCHEMA.md (4.1 products)
//
// products 테이블에는 category/collection 컬럼이 없다 — 07_DATABASE_SCHEMA.md 4.1
// metadata 예시({"category":"backpack","collection":"Visetos",...})대로 metadata jsonb
// 안에 들어 있다. category/collection은 그 metadata에서 추출한 편의 필드이고, 원본
// metadata 전체도 함께 보존한다.

export interface Product {
  id: string;
  product_code: string;
  name: string;
  category: string | null;
  collection: string | null;
  official_description: string;
  image_url: string;
  metadata: Record<string, unknown>;
}

// TASK-301 DB 연결: product_profiles 저장/조회 타입. customer.repository.ts의
// CustomerTasteProfile/NewCustomerTasteProfile, event.repository.ts의
// EventMeaningProfile/NewEventMeaningProfile과 동일한 짝(현재 조회용 전체 row 타입 +
// 저장용 입력 타입) 패턴을 그대로 따른다. core4/ai_product_traits/evidence는
// RelatedProductProfile(types/event.ts)과 동일하게 unknown으로 둔다 — 실제 구조 검증은
// TASK-201의 기존 ProductProfileAiOutputSchema(lib/ai/product-profile.schema.ts)가 담당한다.
export interface ProductProfile {
  id: string;
  product_id: string;
  core4: unknown;
  ai_product_traits: unknown[];
  evidence: unknown[];
  analysis_model: string | null;
  source: DataSource;
  is_current: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface NewProductProfile {
  product_id: string;
  core4: unknown;
  ai_product_traits: unknown[];
  evidence: unknown[];
  analysis_model: string | null;
  source: "ai_generated";
  is_current: true;
}
