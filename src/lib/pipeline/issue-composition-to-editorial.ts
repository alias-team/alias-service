import { toCorePreferenceRecord } from "@/lib/ai/customer-taste-discovery";
import { editorialGeneratorInputSchema } from "@/lib/validation/editorial.schema";
import type { CustomerTasteProfile } from "@/types/customer";
import type { BrandAsset, EditorialGeneratorInput } from "@/types/editorial";
import type { Event, EventMeaningProfile, RelatedProductProfile } from "@/types/event";
import type { IssueComposition, PassProductCandidate } from "@/types/issue-composition";
import type { Product } from "@/types/product";

// TASK-301 DB 연결 6단계: TASK-206 -> TASK-207 handoff.
// Source: documents/[개발 문서] 09_PRODUCT_BACKLOG.md "TASK-206"/"TASK-207"
//
// IssueComposition(206 결과) + passProductPool(205 결과 — 206을 거치며 product/product_profile
// 원본 상세가 사라지므로 별도로 필요)와, TASK-207이 요구하지만 지금까지의 Pipeline 어디에도
// 남아있지 않은 upstream 데이터(customer_taste_profile/event/product 원본/product_profile
// evidence)를 product_id 기준으로 병합해 완전한 EditorialGeneratorInput을 만드는 얇은 pure
// adapter다. DB 조회, OpenAI 호출, 의미 판단은 하지 않는다. 최종 결과는 TASK-207의 기존
// editorialGeneratorInputSchema로 검증한다 — 새 Editorial 스키마를 만들지 않는다.
//
// brand_asset은 이 함수가 값을 만들지 않는다 — 현재 어떤 DB 테이블에도 이 개념의 실제
// 산출물이 없으므로(TASK-301 분석에서 확인), 호출자가 명시적으로 전달해야 한다.

export interface EditorialUpstreamContext {
  eventMeaningProfile: EventMeaningProfile;
  customerTasteProfile: CustomerTasteProfile;
  event: Event;
  brandAsset: BrandAsset;
  products: Product[];
  productProfiles: RelatedProductProfile[];
}

function indexById<T extends { id: string }>(items: T[], label: string): Map<string, T> {
  const map = new Map<string, T>();
  for (const item of items) {
    if (map.has(item.id)) {
      throw new Error(`${label} must not contain duplicate IDs: ${item.id}`);
    }
    map.set(item.id, item);
  }
  return map;
}

function indexByProductId<T extends { product_id: string }>(
  items: T[],
  label: string,
): Map<string, T> {
  const map = new Map<string, T>();
  for (const item of items) {
    if (map.has(item.product_id)) {
      throw new Error(`${label} must not contain duplicate Product IDs: ${item.product_id}`);
    }
    map.set(item.product_id, item);
  }
  return map;
}

// TASK-301 DB 연결: Event.hero_image_url -> BrandAsset 투영. adaptIssueCompositionToEditorialInput()의
// brandAsset 인자는 여전히 호출자가 명시적으로 채운다(계약 변경 없음) — 이 함수는 그 값을
// Event에서 만들고 싶을 때 쓸 수 있는 순수 헬퍼일 뿐이다. hero_image_url이 아직 없는 Event(현재
// seed 상태)에는 fallback 값을 지어내지 않고 명확한 에러로 알린다.
export function toBrandAsset(event: Event): BrandAsset {
  if (!event.hero_image_url) {
    throw new Error(
      `Event has no hero_image_url yet, cannot derive a BrandAsset: ${event.id}`,
    );
  }
  return { image_url: event.hero_image_url };
}

export function adaptIssueCompositionToEditorialInput(
  issueComposition: IssueComposition,
  passProductPool: PassProductCandidate[],
  context: EditorialUpstreamContext,
): EditorialGeneratorInput {
  if (issueComposition.event_id !== context.eventMeaningProfile.event_id) {
    throw new Error(
      "Event Meaning Profile must belong to the same Event as the Issue Composition",
    );
  }
  if (issueComposition.event_id !== context.event.id) {
    throw new Error("Event must belong to the same Event as the Issue Composition");
  }

  const passProductById = indexByProductId(passProductPool, "passProductPool");
  const productById = indexById(context.products, "Upstream products");
  const productProfileById = indexByProductId(
    context.productProfiles,
    "Upstream product profiles",
  );

  const products = issueComposition.selected_products.map(({ product_id }) => {
    const passProduct = passProductById.get(product_id);
    if (!passProduct) {
      throw new Error(`Missing passProductPool entry for Product ID: ${product_id}`);
    }
    const product = productById.get(product_id);
    if (!product) {
      throw new Error(`Missing upstream Product data for Product ID: ${product_id}`);
    }
    const productProfile = productProfileById.get(product_id);
    if (!productProfile) {
      throw new Error(`Missing upstream Product Profile data for Product ID: ${product_id}`);
    }

    return {
      product_id,
      product_name: passProduct.product.name,
      image_url: passProduct.product.image_url ?? "",
      description: product.official_description,
      product_profile: {
        core4: passProduct.product_profile.core4 as Record<string, unknown>,
        ai_product_traits: passProduct.product_profile.ai_product_traits,
        evidence: productProfile.evidence,
      },
    };
  });

  return editorialGeneratorInputSchema.parse({
    issue_composition: issueComposition,
    event_meaning_profile: context.eventMeaningProfile,
    customer_taste_profile: {
      id: context.customerTasteProfile.id,
      customer_id: context.customerTasteProfile.customer_id,
      taste_summary: context.customerTasteProfile.taste_summary,
      core_preference: toCorePreferenceRecord(context.customerTasteProfile.core_preference),
      ai_traits: context.customerTasteProfile.ai_traits,
      evidence_product_ids: context.customerTasteProfile.evidence_product_ids,
      source: context.customerTasteProfile.source,
      is_current: context.customerTasteProfile.is_current,
      created_at: context.customerTasteProfile.created_at,
      updated_at: context.customerTasteProfile.updated_at,
    },
    event: {
      event_id: context.event.id,
      event_type: context.event.event_type,
    },
    brand_asset: context.brandAsset,
    products,
  });
}
