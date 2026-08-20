import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseServerClient } from "@/lib/database/supabase-server";
import { ProductProfileAiOutputSchema } from "@/lib/ai/product-profile.schema";
import type { DataSource, RelatedProductProfile } from "@/types/event";
import type { NewProductProfile, Product, ProductProfile } from "@/types/product";

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

// TASK-301 DB 연결: TASK-201(Product Understanding) 결과 저장/조회. customer_id 사이의
// customer.repository.ts.findCurrentTasteProfile/replaceCurrentTasteProfile, event_id
// 사이의 event.repository.ts.findCurrentMeaningProfile/replaceCurrentMeaningProfile과
// 동일한 "현재(is_current=true) 1개 조회 + insert 새 row 후 이전 current row들을
// is_current=false로 내리는" 기존 패턴을 product_id 기준으로 그대로 적용한다. 새 저장
// 방식(진짜 upsert 등)을 도입하지 않는다 — product_profiles에도 이 둘처럼 unique
// constraint가 없고 is_current + partial index로만 "현재 1개"를 표현하는 동일한 설계라
// 기존 패턴을 그대로 재사용할 수 있다.
interface ProductProfileRow {
  id: string;
  product_id: string;
  // core4/ai_product_traits/evidence는 jsonb라 Supabase가 구조를 보장하지 않는다 —
  // 억지로 캐스트하지 않고, TASK-201이 쓰는 기존 스키마(ProductProfileAiOutputSchema,
  // lib/ai/product-profile.schema.ts)로 실제 검증한다(07_DATABASE_SCHEMA.md 10.3과 동일한
  // customer/event repository 검증 패턴).
  core4: unknown;
  ai_product_traits: unknown;
  evidence: unknown;
  analysis_model: string | null;
  source: DataSource;
  is_current: boolean;
  created_at?: string;
  updated_at?: string;
}

function toProductProfile(row: ProductProfileRow): ProductProfile {
  const validated = ProductProfileAiOutputSchema.parse({
    core4: row.core4,
    ai_product_traits: row.ai_product_traits,
    evidence: row.evidence,
  });

  return {
    id: row.id,
    product_id: row.product_id,
    ...validated,
    analysis_model: row.analysis_model,
    source: row.source,
    is_current: row.is_current,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export interface ProductRepository {
  findByProductCode(productCode: string): Promise<Product | null>;
  findByProductCodes(productCodes: string[]): Promise<Product[]>;
  // TASK-301 DB 연결: Backend Orchestrator용. event.related_product_ids가 이미 products.id(uuid)
  // 배열이라 product_code 기준 조회로는 원본 Product를 가져올 수 없다 — findByProductCodes와
  // 동일한 조회/에러 처리 패턴을 id 기준으로만 다시 쓴다.
  findByIds(productIds: string[]): Promise<Product[]>;
  // event.repository.ts에서 이동(TASK-301 5단계 후속 리팩토링) — product_profiles는
  // event 도메인이 아니라 product 도메인 데이터라 여기로 옮겼다. 조회 결과/에러 처리
  // 의미는 이전 event.repository.ts.findRelatedProductProfiles()와 동일하게 유지한다.
  findByProductIds: ProductProfileLookup;
  // TASK-301 DB 연결: TASK-201 결과 저장 경로. analyzeProduct()(TASK-201, lib/ai/product-understanding.ts)의
  // 로직/prompt/schema는 전혀 건드리지 않고, 이미 검증까지 끝난 결과를 저장/조회하는
  // 얇은 연결 계층만 추가한다.
  findCurrentProfile(productId: string): Promise<ProductProfile | null>;
  replaceCurrentProfile(profile: NewProductProfile): Promise<ProductProfile>;
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

    async findByIds(productIds) {
      if (productIds.length === 0) return [];

      const { data, error } = await supabase
        .from("products")
        .select("id,product_code,name,official_description,image_url,metadata")
        .in("id", productIds);

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

    async findCurrentProfile(productId) {
      const { data, error } = await supabase
        .from("product_profiles")
        .select(
          "id,product_id,core4,ai_product_traits,evidence,analysis_model,source,is_current,created_at,updated_at",
        )
        .eq("product_id", productId)
        .eq("is_current", true)
        .maybeSingle();

      if (error) {
        throw new Error(`Failed to load current Product Profile: ${error.message}`);
      }
      if (!data) return null;
      return toProductProfile(data as ProductProfileRow);
    },

    async replaceCurrentProfile(profile) {
      const { data, error } = await supabase
        .from("product_profiles")
        .insert(profile)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to save Product Profile: ${error.message}`);
      }

      const saved = toProductProfile(data as ProductProfileRow);
      const { error: updateError } = await supabase
        .from("product_profiles")
        .update({ is_current: false })
        .eq("product_id", profile.product_id)
        .eq("is_current", true)
        .neq("id", saved.id);

      if (updateError) {
        throw new Error(
          `Saved the new profile but failed to clear older current profiles: ${updateError.message}`,
        );
      }
      return saved;
    },
  };
}
