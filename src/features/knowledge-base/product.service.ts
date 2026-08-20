import { analyzeProduct } from "@/lib/ai/product-understanding";
import {
  createProductRepository,
  type ProductRepository,
} from "./product.repository";
import type {
  ProductProfileResult,
  ProductUnderstandingInput,
} from "@/lib/ai/product-understanding";
import type { NewProductProfile, ProductProfile } from "@/types/product";

// TASK-301 DB 연결: TASK-201 Pipeline Orchestration Service.
// event.service.ts/customer-taste.service.ts와 동일한 구조(repository read -> AI 함수 ->
// repository write)를 따른다. analyzeProduct()(TASK-201, lib/ai/product-understanding.ts)의
// 로직/prompt/schema는 수정하지 않는다 — 실제 OpenAI 호출은 analyzer 내부(analyzeProduct)에서
// 결정되며, 이 service는 그 결정에 관여하지 않는다.

export type ProductAnalyzer = (
  input: ProductUnderstandingInput,
) => Promise<ProductProfileResult>;

interface ProductServiceDependencies {
  repository: ProductRepository;
  analyzer: ProductAnalyzer;
}

function extractOfficialColor(metadata: Record<string, unknown>): string | null {
  const value = metadata.officialColor;
  return typeof value === "string" ? value : null;
}

export function createProductService({
  repository,
  analyzer,
}: ProductServiceDependencies) {
  return {
    async generateProductProfile(productCode: string): Promise<ProductProfile> {
      const product = await repository.findByProductCode(productCode);
      if (!product) throw new Error(`Product not found: ${productCode}`);

      const result = await analyzer({
        imageUrl: product.image_url,
        officialDescription: product.official_description,
        metadata: {
          category: product.category,
          officialColor: extractOfficialColor(product.metadata),
        },
      });

      const profile: NewProductProfile = {
        product_id: product.id,
        core4: result.core4,
        ai_product_traits: result.ai_product_traits,
        evidence: result.evidence,
        analysis_model: result.analysis_model,
        source: result.source,
        is_current: result.is_current,
      };

      return repository.replaceCurrentProfile(profile);
    },
  };
}

export async function generateProductProfile(productCode: string) {
  const service = createProductService({
    repository: createProductRepository(),
    analyzer: analyzeProduct,
  });
  return service.generateProductProfile(productCode);
}
