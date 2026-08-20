import { gatekeeperInputSchema } from "@/lib/validation/gatekeeper.schema";
import type { GatekeeperCandidateInput, GatekeeperInput } from "@/types/gatekeeper";
import type {
  MeaningMatchingCandidateProduct,
  MeaningMatchingInput,
  MeaningMatchingOutput,
} from "@/types/meaning-matching";

// TASK-204-C: Meaning Matching -> Gatekeeper Handoff
// Source: documents/[개발 문서] 09_PRODUCT_BACKLOG.md "TASK-204"
//
// TASK-204(customer_event_match / candidate별 customer_product_match·meaning_bridge·
// extension_result)와 upstream 데이터(customer_profile/event_meaning_profile/product/
// product_profile — 이 upstream은 matchMeaning()에 넘겼던 MeaningMatchingInput 그대로다)를
// product_id 기준으로 병합해 완전한 GatekeeperInput을 만드는 얇은 pure adapter다.
// DB 조회, OpenAI 호출, 의미 판단, PASS/REJECT 판단은 하지 않는다. 최종 결과는 TASK-205의
// 기존 gatekeeperInputSchema로 검증한다 — 새 Gatekeeper 스키마를 만들지 않는다.

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

export function adaptMeaningMatchingToGatekeeperInput(
  matchingOutput: MeaningMatchingOutput,
  matchingInput: MeaningMatchingInput,
): GatekeeperInput {
  if (matchingOutput.event_id !== matchingInput.event_id) {
    throw new Error(
      "Meaning Matching Output must belong to the same Event as the Meaning Matching Input",
    );
  }

  const upstreamByProductId = indexByProductId<MeaningMatchingCandidateProduct>(
    matchingInput.candidates,
    "Meaning Matching Input candidates",
  );
  const resultByProductId = indexByProductId(
    matchingOutput.candidates,
    "Meaning Matching Output candidates",
  );

  for (const productId of resultByProductId.keys()) {
    if (!upstreamByProductId.has(productId)) {
      throw new Error(`Meaning Matching Output contains an unknown Product ID: ${productId}`);
    }
  }

  const candidates: GatekeeperCandidateInput[] = [];
  for (const [productId, upstream] of upstreamByProductId) {
    const result = resultByProductId.get(productId);
    if (!result) {
      throw new Error(
        `Meaning Matching Output is missing a result for Product ID: ${productId}`,
      );
    }
    candidates.push({
      product_id: productId,
      product: upstream.product,
      product_profile: upstream.product_profile,
      customer_product_match: result.customer_product_match,
      meaning_bridge: result.meaning_bridge,
      extension_result: result.extension_result,
    });
  }

  return gatekeeperInputSchema.parse({
    event_id: matchingOutput.event_id,
    customer_profile: matchingInput.customer_profile,
    event_meaning_profile: matchingInput.event_meaning_profile,
    customer_event_match: matchingOutput.customer_event_match,
    candidates,
  });
}
