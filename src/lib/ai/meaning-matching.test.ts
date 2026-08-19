import { describe, expect, it, vi } from "vitest";

import { matchMeaning } from "./meaning-matching";
import type {
  MeaningMatchingCandidateProduct,
  MeaningMatchingInput,
} from "@/types/meaning-matching";

const EVENT_ID = "6ebeb5f4-f60f-45df-9008-f0641f7166af";

function candidateProduct(
  productId: string,
  overrides: Partial<MeaningMatchingCandidateProduct> = {},
): MeaningMatchingCandidateProduct {
  return {
    product_id: productId,
    product: {
      name: `Product ${productId}`,
      category: "bag",
      collection: "Tokyo Collection",
      image_url: `/images/${productId}.jpg`,
    },
    product_profile: {
      core4: { material: "leather" },
      ai_product_traits: [
        {
          name: "Adaptive Carry",
          reason: "The construction supports movement.",
          evidence: [
            { source: "product_description", text: "Designed for movement." },
          ],
        },
      ],
      evidence: [
        { source: "product_description", text: "Made from refined leather." },
      ],
    },
    ...overrides,
  };
}

function input(productIds = ["PRODUCT_001"]): MeaningMatchingInput {
  return {
    event_id: EVENT_ID,
    customer_profile: {
      taste_summary: "The customer repeatedly selects refined heritage pieces.",
      core_preference: {
        colorTone: ["warm_neutral"],
        silhouetteForm: ["structured"],
        material: ["leather"],
        monogramDensity: ["medium"],
      },
      ai_traits: [
        {
          name: "Heritage-oriented Style",
          reason: "Repeated selection of structured leather pieces.",
          evidenceProductIds: ["HISTORY_001", "HISTORY_002"],
        },
      ],
      evidence_product_ids: ["HISTORY_001", "HISTORY_002"],
    },
    event_meaning_profile: {
      event_id: EVENT_ID,
      event_theme: "Modern Heritage in Motion",
      brand_direction: "Heritage interpreted through contemporary mobility.",
      event_traits: ["Contemporary mobility"],
      evidence: [
        { source: "brand_message", text: "Designed for modern nomads." },
      ],
    },
    candidates: productIds.map((productId) => candidateProduct(productId)),
  };
}

function candidateResult(
  productId: string,
  overrides: Partial<{
    customer_product_match: Record<string, unknown>;
    meaning_bridge: string;
    extension_result: Record<string, unknown>;
  }> = {},
) {
  return {
    product_id: productId,
    customer_product_match: {
      connection: true,
      core4_connections: [
        {
          attribute: "material",
          customer_value: "leather",
          product_value: "leather",
        },
      ],
      trait_connections: [
        {
          customer_trait: "Heritage-oriented Style",
          product_trait: "Modern Heritage",
        },
      ],
      matching_reason:
        "The product carries an established heritage preference into movement.",
      evidence: ["The customer repeatedly selected leather products."],
      ...overrides.customer_product_match,
    },
    meaning_bridge:
      overrides.meaning_bridge ??
      "A familiar material expression connects with a more mobile form.",
    extension_result: {
      extension_type: "meaningful_extension",
      existing_preference: "Refined heritage leather",
      new_expression: "A mobile contemporary construction",
      extension_reason:
        "The product introduces mobility without abandoning the established preference.",
      ...overrides.extension_result,
    },
  };
}

function aiOutput(productIds: string[], connection = true) {
  return {
    customer_event_match: {
      connection,
      matching_reason:
        "The Event extends the customer's heritage preference through mobility.",
      evidence: ["The customer profile contains a heritage-oriented trait."],
    },
    candidates: productIds.map((productId) => candidateResult(productId)),
  };
}

describe("matchMeaning", () => {
  it("returns a meaningful_extension result for TASK-205 handoff", async () => {
    const source = input();

    const result = await matchMeaning(source, async () => aiOutput(["PRODUCT_001"]));

    expect(result).toEqual({
      event_id: EVENT_ID,
      customer_event_match: aiOutput(["PRODUCT_001"]).customer_event_match,
      candidates: [candidateResult("PRODUCT_001")],
    });
  });

  it("passes existing_preference_repetition through as a normal result", async () => {
    const source = input();
    const raw = aiOutput(["PRODUCT_001"]);
    raw.candidates[0] = candidateResult("PRODUCT_001", {
      extension_result: {
        extension_type: "existing_preference_repetition",
        existing_preference: "Refined heritage leather",
        new_expression: "The same refined heritage leather",
        extension_reason: "The product only repeats the existing preference.",
      },
    });

    const result = await matchMeaning(source, async () => raw);

    expect(result.candidates[0].extension_result.extension_type).toBe(
      "existing_preference_repetition",
    );
  });

  it("allows customer_event_match.connection to be false", async () => {
    const source = input();

    const result = await matchMeaning(source, async () =>
      aiOutput(["PRODUCT_001"], false),
    );

    expect(result.customer_event_match.connection).toBe(false);
  });

  it("processes multiple candidates and preserves input order regardless of AI response order", async () => {
    const source = input(["PRODUCT_001", "PRODUCT_002"]);
    const raw = aiOutput(["PRODUCT_002", "PRODUCT_001"]);

    const result = await matchMeaning(source, async () => raw);

    expect(result.candidates.map((c) => c.product_id)).toEqual([
      "PRODUCT_001",
      "PRODUCT_002",
    ]);
  });

  it("rejects AI output missing a candidate present in the input", async () => {
    const source = input(["PRODUCT_001", "PRODUCT_002"]);
    const raw = aiOutput(["PRODUCT_001"]);

    await expect(matchMeaning(source, async () => raw)).rejects.toThrow();
  });

  it("rejects AI output containing an unknown product_id", async () => {
    const source = input(["PRODUCT_001"]);
    const raw = aiOutput(["PRODUCT_001"]);
    raw.candidates.push(candidateResult("PRODUCT_999"));

    await expect(matchMeaning(source, async () => raw)).rejects.toThrow();
  });

  it("rejects AI output containing a duplicate product_id", async () => {
    const source = input(["PRODUCT_001"]);
    const raw = aiOutput(["PRODUCT_001"]);
    raw.candidates.push(candidateResult("PRODUCT_001"));

    await expect(matchMeaning(source, async () => raw)).rejects.toThrow();
  });

  it("rejects an invalid extension_type", async () => {
    const source = input(["PRODUCT_001"]);
    const raw = aiOutput(["PRODUCT_001"]);
    raw.candidates[0] = candidateResult("PRODUCT_001", {
      extension_result: {
        extension_type: "not_a_real_type",
        existing_preference: "Refined heritage leather",
        new_expression: "A mobile contemporary construction",
        extension_reason: "Invalid extension type.",
      },
    });

    await expect(matchMeaning(source, async () => raw)).rejects.toThrow();
  });

  it("rejects empty required evidence on customer_product_match", async () => {
    const source = input(["PRODUCT_001"]);
    const raw = aiOutput(["PRODUCT_001"]);
    raw.candidates[0] = candidateResult("PRODUCT_001", {
      customer_product_match: { evidence: [] },
    });

    await expect(matchMeaning(source, async () => raw)).rejects.toThrow();
  });

  it("rejects a malformed structured output", async () => {
    const source = input(["PRODUCT_001"]);

    await expect(
      matchMeaning(source, async () => ({ candidates: [] })),
    ).rejects.toThrow();
  });

  it("rejects duplicate product_id within the input candidates", async () => {
    const source = input(["PRODUCT_001"]);
    source.candidates.push(candidateProduct("PRODUCT_001"));
    const generate = vi.fn();

    await expect(matchMeaning(source, generate)).rejects.toThrow();
    expect(generate).not.toHaveBeenCalled();
  });
});
