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
