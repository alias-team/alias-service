import { Core4Schema } from "@/lib/ai/core4";
import { discoverCustomerTaste } from "@/lib/ai/customer-taste-discovery";
import { ProductProfileAiOutputSchema } from "@/lib/ai/product-profile.schema";
import { createCustomerRepository, type CustomerRepository } from "./customer.repository";
import {
  createProductRepository,
  type ProductProfileLookup,
} from "./product.repository";
import type {
  CustomerTasteAnalysis,
  CustomerTasteInput,
  CustomerTasteProfile,
  SelectedProductProfile,
} from "@/types/customer";
import type { RelatedProductProfile } from "@/types/event";

// TASK-301 DB 연결 5단계: TASK-202 Pipeline Orchestration Service.
// event.service.ts의 createEventService/generateEventMeaningProfile 구조를 그대로 따른다 —
// AI 판단 로직(discoverCustomerTaste)은 수정하지 않고, repository와 연결만 담당한다.
//
// product_profiles 조회 방법(ProductProfileLookup)은 product.repository.ts에서 재사용한다
// (TASK-301 5단계 후속 리팩토링 — 이전에는 event.repository.ts에 있었다).

// discoverCustomerTaste()를 그대로 감싼 analyzer. event.service.ts의 EventAnalyzer와
// 동일한 역할이다 — 실제 OpenAI 호출은 analyzer 내부(discoverCustomerTaste의 generate
// 매개변수)에서 결정되며, 이 service는 그 결정에 관여하지 않는다.
export type CustomerTasteAnalyzer = (
  input: CustomerTasteInput,
) => Promise<CustomerTasteAnalysis & { evidence_product_ids: string[] }>;

// product_profiles.core4/ai_product_traits는 jsonb라 Supabase가 구조를 보장하지 않는다 —
// 억지로 캐스트하지 않고, TASK-201이 쓰는 기존 스키마(Core4Schema, ai_product_traits
// 서브스키마)로 실제 검증한다. evidence는 discoverCustomerTaste()의 입력(SelectedProductProfile)에
// 필요 없어 담지 않는다.
function toSelectedProductProfile(row: RelatedProductProfile): SelectedProductProfile {
  return {
    product_id: row.product_id,
    core4: Core4Schema.parse(row.core4),
    ai_product_traits: ProductProfileAiOutputSchema.shape.ai_product_traits.parse(
      row.ai_product_traits,
    ),
  };
}

interface CustomerTasteServiceDependencies {
  customerRepository: CustomerRepository;
  findProductProfiles: ProductProfileLookup;
  analyzer: CustomerTasteAnalyzer;
}

export function createCustomerTasteService({
  customerRepository,
  findProductProfiles,
  analyzer,
}: CustomerTasteServiceDependencies) {
  return {
    async generateTasteProfile(customerCode: string): Promise<CustomerTasteProfile> {
      const customer = await customerRepository.findCustomerByCode(customerCode);
      if (!customer) throw new Error(`Customer not found: ${customerCode}`);

      const selections = await customerRepository.findSelectionsByCustomerId(customer.id);
      if (selections.length === 0) {
        throw new Error(`Customer has no purchase/wishlist selections: ${customerCode}`);
      }

      const productIds = selections.map(({ product_id }) => product_id);
      const relatedProfiles = await findProductProfiles(productIds);
      const productProfiles = relatedProfiles.map(toSelectedProductProfile);

      const input: CustomerTasteInput = {
        customerId: customer.id,
        selections,
        productProfiles,
      };

      const analysis = await analyzer(input);

      return customerRepository.replaceCurrentTasteProfile({
        customer_id: customer.id,
        ...analysis,
        source: "ai_generated",
        is_current: true,
      });
    },
  };
}

export async function generateCustomerTasteProfile(customerCode: string) {
  const service = createCustomerTasteService({
    customerRepository: createCustomerRepository(),
    findProductProfiles: createProductRepository().findByProductIds,
    analyzer: discoverCustomerTaste,
  });
  return service.generateTasteProfile(customerCode);
}
