import type { DataSource } from "./event";

// TASK-301 DB 연결 2단계: customers 테이블 읽기 전용 타입.
// Source: documents/[개발 문서] 07_DATABASE_SCHEMA.md (4.3 customers)
export interface Customer {
  id: string;
  customer_code: string;
  display_name: string;
  description: string | null;
  source: DataSource;
}

export type SelectionType = "purchase" | "wishlist";

export interface CustomerProductSelection {
  product_id: string;
  selection_type: SelectionType;
}

/** TASK-201 product_profiles.core4 — 단일 값이거나(대등한 두 번째 몸체가 있으면) 배열일 수 있다. */
export interface ProductCore4 {
  colorTone: string | string[] | null;
  silhouetteForm: string | string[] | null;
  material: string | string[] | null;
  monogramDensity: string | string[] | null;
}

export interface ProductAiTrait {
  name: string;
  reason: string;
  evidence: Array<{ source: string; text: string }>;
}

/** TASK-201 산출물 중 TASK-202 입력으로 쓰는 부분만 취한다. */
export interface SelectedProductProfile {
  product_id: string;
  core4: ProductCore4;
  ai_product_traits: ProductAiTrait[];
}

export interface CorePreference {
  colorTone: string[];
  silhouetteForm: string[];
  material: string[];
  monogramDensity: string[];
}

export interface CustomerAiTrait {
  name: string;
  reason: string;
  evidenceProductIds: string[];
}

export interface CustomerTasteAnalysis {
  taste_summary: string;
  core_preference: CorePreference;
  ai_traits: CustomerAiTrait[];
}

export interface CustomerTasteProfile extends CustomerTasteAnalysis {
  id: string;
  customer_id: string;
  evidence_product_ids: string[];
  source: DataSource;
  is_current: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface NewCustomerTasteProfile extends CustomerTasteAnalysis {
  customer_id: string;
  evidence_product_ids: string[];
  source: "ai_generated";
  is_current: true;
}

export interface CustomerTasteInput {
  customerId: string;
  selections: CustomerProductSelection[];
  productProfiles: SelectedProductProfile[];
}
