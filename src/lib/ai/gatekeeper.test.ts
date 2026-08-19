import { describe, expect, it, vi } from "vitest";

import { evaluateGatekeeper } from "./gatekeeper";
import { passProductCandidateSchema } from "@/lib/validation/issue-composition.schema";
import type { GatekeeperInput } from "@/types/gatekeeper";

const EVENT_ID = "6ebeb5f4-f60f-45df-9008-f0641f7166af";

function candidate(
  productId: string,
  overrides: Partial<GatekeeperInput["candidates"][number]> = {},
): GatekeeperInput["candidates"][number] {
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
          customer_trait: "Heritage-oriented style",
          product_trait: "Adaptive Carry",
        },
      ],
      matching_reason:
        "The product carries an established heritage preference into movement.",
      evidence: ["The customer repeatedly selected leather products."],
    },
    meaning_bridge:
      "A familiar material expression connects with a more mobile form.",
    extension_result: {
      extension_type: "meaningful_extension",
      existing_preference: "Refined heritage leather",
      new_expression: "A mobile contemporary construction",
      extension_reason:
        "The product introduces mobility without abandoning the established preference.",
    },
    ...overrides,
  };
}

function input(productIds = ["PRODUCT_001"]): GatekeeperInput {
  return {
    event_id: EVENT_ID,
    customer_profile: {
      taste_summary: "The customer repeatedly selects refined heritage pieces.",
      core_preference: { material: "leather" },
      ai_traits: [{ name: "Heritage-oriented style" }],
      evidence_product_ids: ["HISTORY_001"],
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
    customer_event_match: {
      connection: true,
      matching_reason:
        "The Event extends the customer's heritage preference through mobility.",
      evidence: ["The customer profile contains a heritage-oriented trait."],
    },
    candidates: productIds.map((productId) => candidate(productId)),
  };
}

describe("evaluateGatekeeper", () => {
  it("hydrates a PASS decision from the original Product data for TASK-206", async () => {
    const source = input();

    const result = await evaluateGatekeeper(source, async () => ({
      evaluations: [
        {
          product_id: "PRODUCT_001",
          decision: "PASS",
          reason: "The evidence supports a meaningful new discovery.",
          editorial_angle: "Heritage adapted for contemporary movement",
        },
      ],
    }));

    expect(result.passProductPool).toEqual([
      {
        event_id: EVENT_ID,
        product_id: "PRODUCT_001",
        decision: "PASS",
        product: source.candidates[0].product,
        product_profile: {
          core4: source.candidates[0].product_profile.core4,
          ai_product_traits:
            source.candidates[0].product_profile.ai_product_traits,
        },
        editorial_angle: "Heritage adapted for contemporary movement",
        matching_reason:
          source.candidates[0].customer_product_match.matching_reason,
        meaning_bridge: source.candidates[0].meaning_bridge,
        extension: source.candidates[0].extension_result.extension_reason,
        evidence: [
          ...source.customer_event_match.evidence,
          ...source.candidates[0].customer_product_match.evidence,
          "Made from refined leather.",
          "Designed for modern nomads.",
        ],
      },
    ]);
    expect(() =>
      passProductCandidateSchema.parse(result.passProductPool[0]),
    ).not.toThrow();
  });

  it("keeps REJECT evaluations for audit but excludes them from passProductPool", async () => {
    const result = await evaluateGatekeeper(input(), async () => ({
      evaluations: [
        {
          product_id: "PRODUCT_001",
          decision: "REJECT",
          reason: "The connection repeats an existing preference.",
          editorial_angle: null,
        },
      ],
    }));

    expect(result.evaluations).toEqual([
      {
        event_id: EVENT_ID,
        product_id: "PRODUCT_001",
        decision: "REJECT",
        reason: "The connection repeats an existing preference.",
        editorial_angle: null,
        failed_rules: [],
      },
    ]);
    expect(result.passProductPool).toEqual([]);
  });

  it("rejects simple repetition deterministically without invoking AI", async () => {
    const source = input();
    source.candidates[0] = candidate("PRODUCT_001", {
      extension_result: {
        extension_type: "existing_preference_repetition",
        existing_preference: "Refined heritage leather",
        new_expression: "The same refined heritage leather",
        extension_reason: "The Product only repeats the existing preference.",
      },
    });
    const generate = vi.fn();

    const result = await evaluateGatekeeper(source, generate);

    expect(generate).not.toHaveBeenCalled();
    expect(result.passProductPool).toEqual([]);
    expect(result.evaluations[0]).toMatchObject({
      decision: "REJECT",
      failed_rules: ["MEANINGFUL_EXTENSION_REQUIRED"],
    });
  });

  it("rejects disconnected Event matching deterministically", async () => {
    const source = input();
    source.customer_event_match.connection = false;
    const generate = vi.fn();

    const result = await evaluateGatekeeper(source, generate);

    expect(generate).not.toHaveBeenCalled();
    expect(result.evaluations[0].failed_rules).toContain(
      "CUSTOMER_EVENT_CONNECTION_REQUIRED",
    );
  });

  it("rejects disconnected Product matching deterministically", async () => {
    const source = input();
    source.candidates[0].customer_product_match.connection = false;
    const generate = vi.fn();

    const result = await evaluateGatekeeper(source, generate);

    expect(generate).not.toHaveBeenCalled();
    expect(result.evaluations[0].failed_rules).toContain(
      "CUSTOMER_PRODUCT_CONNECTION_REQUIRED",
    );
  });

  it("rejects insufficient evidence before invoking AI", async () => {
    const source = input();
    source.candidates[0].customer_product_match.evidence = [];
    const generate = vi.fn();

    await expect(evaluateGatekeeper(source, generate)).rejects.toThrow();
    expect(generate).not.toHaveBeenCalled();
  });

  it("rejects an Event Meaning Profile for a different Event", async () => {
    const source = input();
    source.event_meaning_profile.event_id = "OTHER_EVENT";
    const generate = vi.fn();

    await expect(evaluateGatekeeper(source, generate)).rejects.toThrow(
      /same Event/i,
    );
    expect(generate).not.toHaveBeenCalled();
  });

  it("rejects AI output that does not preserve every eligible Product ID", async () => {
    await expect(
      evaluateGatekeeper(input(["PRODUCT_001", "PRODUCT_002"]), async () => ({
        evaluations: [
          {
            product_id: "PRODUCT_001",
            decision: "PASS",
            reason: "Meaningful.",
            editorial_angle: "A meaningful angle",
          },
        ],
      })),
    ).rejects.toThrow(/every eligible Product exactly once/i);
  });
});
