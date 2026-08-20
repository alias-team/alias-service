import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseServerClient } from "@/lib/database/supabase-server";
import type { RelatedProductProfile } from "@/types/event";
import type { Product } from "@/types/product";

// product_profiles를 product_id[] 기준으로 조회하는 함수 형태. event.service.ts와
// customer-taste.service.ts가 이 형태로 의존성을 주입받는다 — 전체 ProductRepository가
// 아니라 이 조회 기능 하나만 필요로 하기 때문이다.
export type ProductProfileLookup = (
  productIds: string[],
) => Promise<RelatedProductProfile[]>;

// TASK-301 DB 연결 1단계: products 테이블 읽기 전용 repository.
// Source: documents/[개발 문서] 07_DATABASE_SCHEMA.md (4.1 products)
// AI 판단 로직은 다루지 않는다 — products 테이블 read만 담당한다.

interface ProductRow {
  id: string;
  product_code: string;
  name: string;
  official_description: string;
  image_url: string;
  metadata: Record<string, unknown> | null;
}

// products.metadata(jsonb)에서 category/collection을 편의 필드로 추출한다. 07_DATABASE_SCHEMA.md
// 4.1 예시({"category":"backpack","collection":"Visetos",...})처럼 문자열이 아닐 수도 있는
// 임의의 jsonb라 타입 가드 없이 신뢰하지 않는다 — 원본 metadata 전체도 함께 보존한다.
function toProduct(row: ProductRow): Product {
  const metadata = row.metadata ?? {};
  const category = typeof metadata.category === "string" ? metadata.category : null;
  const collection = typeof metadata.collection === "string" ? metadata.collection : null;

  return {
    id: row.id,
    product_code: row.product_code,
    name: row.name,
    category,
    collection,
    official_description: row.official_description,
    image_url: row.image_url,
    metadata,
  };
}

export interface ProductRepository {
  findByProductCode(productCode: string): Promise<Product | null>;
  findByProductCodes(productCodes: string[]): Promise<Product[]>;
  // event.repository.ts에서 이동(TASK-301 5단계 후속 리팩토링) — product_profiles는
  // event 도메인이 아니라 product 도메인 데이터라 여기로 옮겼다. 조회 결과/에러 처리
  // 의미는 이전 event.repository.ts.findRelatedProductProfiles()와 동일하게 유지한다.
  findByProductIds: ProductProfileLookup;
}

export function createProductRepository(
  supabase: SupabaseClient = getSupabaseServerClient(),
): ProductRepository {
  return {
    async findByProductCode(productCode) {
      const { data, error } = await supabase
        .from("products")
        .select("id,product_code,name,official_description,image_url,metadata")
        .eq("product_code", productCode)
        .maybeSingle();

      if (error) throw new Error(`Failed to load product: ${error.message}`);
      if (!data) return null;
      return toProduct(data as ProductRow);
    },

    async findByProductCodes(productCodes) {
      if (productCodes.length === 0) return [];

      const { data, error } = await supabase
        .from("products")
        .select("id,product_code,name,official_description,image_url,metadata")
        .in("product_code", productCodes);

      if (error) throw new Error(`Failed to load products: ${error.message}`);
      return ((data ?? []) as ProductRow[]).map(toProduct);
    },

    async findByProductIds(productIds) {
      if (productIds.length === 0) return [];

      const { data, error } = await supabase
        .from("product_profiles")
        .select("id,product_id,core4,ai_product_traits,evidence")
        .in("product_id", productIds)
        .eq("is_current", true);

      if (error) {
        throw new Error(`Failed to load related product profiles: ${error.message}`);
      }
      return (data ?? []) as RelatedProductProfile[];
    },
  };
}
