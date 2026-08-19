import type { CorePreference, CustomerTasteInput } from "@/types/customer";

// TASK-202: Customer Taste Discovery Engine
// Source: docs/[개발 문서] 09_PRODUCT_BACKLOG.md "TASK-202" (Process: Purchase/Wishlist Products
// -> Pattern Analysis -> Core Preference Extraction -> AI Trait Discovery)
//
// 이 프롬프트는 "AI Trait Discovery" 단계만 담당한다. Core Preference는 이미 결정된 값을
// 참고 컨텍스트로만 넘기고(재계산/재포장 대상이 아님), taste_summary와 ai_traits만 생성하게 한다.
export function buildCustomerTastePrompt(
  input: CustomerTasteInput,
  corePreference: CorePreference,
) {
  const products = input.selections.map((selection) => {
    const profile = input.productProfiles.find(
      (p) => p.product_id === selection.product_id,
    );
    return {
      product_id: selection.product_id,
      selection_type: selection.selection_type,
      ai_product_traits: profile?.ai_product_traits ?? [],
    };
  });

  return {
    instructions: [
      "You are analyzing a demo customer's repeated taste, not recommending products.",
      "Input: the customer's purchased/wishlisted products, each with its own AI Product Traits from Product Understanding, and a pre-computed Core Preference (repeated Core4 values across these products).",
      "Task: find higher-level aesthetic/usage patterns that repeat across MULTIPLE of these products' traits or descriptions. Do not analyze a single product in isolation.",
      "A trait is only valid if it is backed by evidenceProductIds from at least 2 different products in the input.",
      "Before finalizing each trait, re-check every product you are about to list in its evidenceProductIds against that specific product's own AI Product Traits. Individually judge whether each product genuinely, reasonably supports this trait's meaning. If even one product does not actually relate to it, either drop that product from evidenceProductIds or rework the trait into one that at least 2 different products genuinely share. The wording or trait names do not need to match exactly — different phrasing is fine as long as the underlying higher-level taste pattern is reasonably supported by each product's actual Product Profile. Do not include a product in evidenceProductIds just because it exists in the input or is loosely related.",
      "As part of that same self-check, only create a trait when the evidenceProductIds you listed actually share the SAME underlying taste meaning — not when each product merely has its own different strength that you then combined under one broad umbrella label. For example, if one product's real strength is 'multiple carrying options' and a different product's real strength is 'ample storage', do not merge these two different things into one trait like 'versatility', 'carrying options and storage', or 'overall usefulness' — that is combining different products' different features under an abstract umbrella concept, not a genuine repeated pattern. Different wording is still fine as long as each product independently, specifically supports the exact same core taste meaning on its own.",
      "Never restate Core Preference axis values as a trait under a different name (e.g. do not turn 'mono' into something like 'Monochrome Lover', do not turn 'medium monogram density' into a trait name). The Core Preference is already known; only report what it does NOT already capture.",
      "Before finalizing each trait, also compare it against the already-derived core_preference you were given. Do not create a trait whose main, central claim is simply a restatement, renaming, or decorative rephrasing of a core_preference value that is already represented there — adding adjectives or extra context wording (e.g. turning a repeated 'structured' silhouette into a trait like 'Structural Elegance' whose reason is just that a structured silhouette repeats) does not make it a new trait if the underlying claim is still only that same repeated Core4 preference. This does not forbid mentioning a core_preference value as supporting context inside a genuinely different, higher-level trait — that is fine as long as the trait's core meaning comes from an additional repeated pattern across the products, not from the Core Preference value itself.",
      "Do not copy a single product's own trait name/reason verbatim as a customer trait; a customer trait must synthesize something observed across multiple products.",
      "Do not write purchase recommendations, next-purchase suggestions, or any 'this customer should/would like X' language.",
      "Do not evaluate fit with any brand event, campaign, or collection. Only describe the customer's own existing pattern.",
      "purchase and wishlist are both valid evidence; do not treat purchase as stronger evidence than wishlist unless the pattern itself only appears in purchases.",
      "taste_summary: 1-2 Korean sentences summarizing the repeated pattern factually, without recommending anything.",
      "Return Korean text for name/reason, keeping established brand/material terms in their original language when useful.",
    ].join(" "),
    input: JSON.stringify(
      {
        core_preference: corePreference,
        products,
      },
      null,
      2,
    ),
  };
}
