import { describe, expect, it, vi } from "vitest";

import type { EventMeaningProfile } from "@/types/event";
import type { GatekeeperOutput } from "@/types/gatekeeper";
import type {
  IssueComposition,
  PassProductCandidate,
} from "@/types/issue-composition";

import { composeIssueFromGatekeeper } from "./issue-composition.service";

const EVENT_ID = "EVENT_001";

const eventMeaningProfile: EventMeaningProfile = {
  id: "EVENT_MEANING_001",
  event_id: EVENT_ID,
  event_theme: "Modern Heritage",
  brand_direction: "Heritage reinterpreted for contemporary movement",
  event_traits: ["Contemporary Heritage", "Mobility"],
  evidence: [
    { source: "brand_message", text: "Designed for modern nomads." },
  ],
  analysis_model: "gpt-5-mini",
  source: "ai_generated",
  is_current: true,
};

function passProduct(productId: string): PassProductCandidate {
  return {
    event_id: EVENT_ID,
    product_id: productId,
    decision: "PASS",
    product: {
      name: `Product ${productId}`,
      category: "bag",
      collection: "Travel Collection",
      image_url: `/images/${productId}.jpg`,
    },
    product_profile: {
      core4: { material: "leather" },
      ai_product_traits: ["Mobility"],
    },
    editorial_angle: "Heritage adapted for movement",
    matching_reason: "The product extends an established preference.",
    meaning_bridge: "Familiar craft expressed through movement.",
    extension: "A mobile expression of heritage.",
    evidence: [`${productId} supports mobile use.`],
  };
}

function gatekeeperOutput(
  passProductPool: PassProductCandidate[],
): GatekeeperOutput {
  return {
    event_id: EVENT_ID,
    evaluations: passProductPool.map(({ product_id }) => ({
      event_id: EVENT_ID,
      product_id,
      decision: "PASS",
      reason: "The product creates meaningful discovery.",
      editorial_angle: "Heritage adapted for movement",
      failed_rules: [],
    })),
    passProductPool,
  };
}

const issueComposition: IssueComposition = {
  event_id: EVENT_ID,
  issue_theme: "Heritage in Motion",
  editorial_angle: "Familiar craft for contemporary movement",
  selected_products: [
    {
      product_id: "PRODUCT_001",
      product_role: "Theme anchor",
      discovery_direction: "A mobile expression of heritage",
    },
    {
      product_id: "PRODUCT_002",
      product_role: "Theme extension",
      discovery_direction: "A lighter expression of heritage",
    },
  ],
  brand_connection: {
    event_theme: "Modern Heritage",
    brand_direction: "Heritage reinterpreted for contemporary movement",
    connection_narrative: "The Event carries familiar craft into motion.",
  },
  evidence: ["The supplied products support mobile use."],
};

describe("composeIssueFromGatekeeper", () => {
  it("adapts the complete PASS Product Pool and returns the composed Issue", async () => {
    const passProductPool = [
      passProduct("PRODUCT_001"),
      passProduct("PRODUCT_002"),
    ];
    const composer = vi.fn(async () => issueComposition);

    const result = await composeIssueFromGatekeeper(
      {
        gatekeeperOutput: gatekeeperOutput(passProductPool),
        eventMeaningProfile,
      },
      composer,
    );

    expect(result).toEqual({
      status: "composed",
      issueComposition,
    });
    expect(composer).toHaveBeenCalledOnce();
    expect(composer).toHaveBeenCalledWith({
      event_id: EVENT_ID,
      eventMeaningProfile,
      passProductPool,
    });
  });

  it("returns the adapter skip result without composing an Issue", async () => {
    const composer = vi.fn(async () => issueComposition);

    const result = await composeIssueFromGatekeeper(
      {
        gatekeeperOutput: gatekeeperOutput([]),
        eventMeaningProfile,
      },
      composer,
    );

    expect(result).toEqual({
      status: "skipped",
      reason: "EMPTY_PASS_PRODUCT_POOL",
    });
    expect(composer).not.toHaveBeenCalled();
  });

  it("propagates adapter validation errors without composing an Issue", async () => {
    const composer = vi.fn(async () => issueComposition);

    await expect(
      composeIssueFromGatekeeper(
        {
          gatekeeperOutput: gatekeeperOutput([passProduct("PRODUCT_001")]),
          eventMeaningProfile: {
            ...eventMeaningProfile,
            event_id: "EVENT_002",
          },
        },
        composer,
      ),
    ).rejects.toThrow(/Event Meaning Profile.*same Event/i);
    expect(composer).not.toHaveBeenCalled();
  });
});
