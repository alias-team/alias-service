import { describe, expect, it } from "vitest";

import { composeIssue } from "@/lib/ai/issue-composition";
import { issueCompositionInputSchema } from "@/lib/validation/issue-composition.schema";
import type { EventMeaningProfile } from "@/types/event";
import type { GatekeeperOutput } from "@/types/gatekeeper";
import type { PassProductCandidate } from "@/types/issue-composition";

import { adaptGatekeeperToIssueInput } from "./gatekeeper-to-issue";

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
  passProductPool: PassProductCandidate[] = [passProduct("PRODUCT_001")],
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

describe("adaptGatekeeperToIssueInput", () => {
  it("creates a schema-valid IssueCompositionInput from a PASS Product Pool", async () => {
    const result = adaptGatekeeperToIssueInput(
      gatekeeperOutput(),
      eventMeaningProfile,
    );

    expect(result).toEqual({
      status: "ready",
      input: {
        event_id: EVENT_ID,
        eventMeaningProfile,
        passProductPool: [passProduct("PRODUCT_001")],
      },
    });
    if (result.status !== "ready") throw new Error("Expected ready input");
    expect(() => issueCompositionInputSchema.parse(result.input)).not.toThrow();

    const issue = await composeIssue(result.input, async () => ({
      event_id: EVENT_ID,
      issue_theme: "Heritage in Motion",
      editorial_angle: "Familiar craft for contemporary movement",
      selected_products: [
        {
          product_id: "PRODUCT_001",
          product_role: "Theme anchor",
          discovery_direction: "A mobile expression of heritage",
        },
      ],
      brand_connection: {
        event_theme: "Modern Heritage",
        brand_direction: "Heritage reinterpreted for contemporary movement",
        connection_narrative: "The Event carries familiar craft into motion.",
      },
      evidence: ["PRODUCT_001 supports mobile use."],
    }));

    expect(issue.selected_products[0].product_id).toBe("PRODUCT_001");
  });

  it("ignores REJECT evaluations and forwards only passProductPool", () => {
    const output = gatekeeperOutput();
    output.evaluations.push({
      event_id: EVENT_ID,
      product_id: "PRODUCT_REJECTED",
      decision: "REJECT",
      reason: "The product repeats an existing preference.",
      editorial_angle: null,
      failed_rules: ["MEANINGFUL_EXTENSION_REQUIRED"],
    });

    const result = adaptGatekeeperToIssueInput(output, eventMeaningProfile);

    expect(result.status).toBe("ready");
    if (result.status !== "ready") throw new Error("Expected ready input");
    expect(result.input.passProductPool.map(({ product_id }) => product_id)).toEqual([
      "PRODUCT_001",
    ]);
  });

  it("returns an explicit skip result for an empty PASS Product Pool", () => {
    const result = adaptGatekeeperToIssueInput(
      gatekeeperOutput([]),
      eventMeaningProfile,
    );

    expect(result).toEqual({
      status: "skipped",
      reason: "EMPTY_PASS_PRODUCT_POOL",
    });
  });

  it("rejects a PASS Product belonging to a different Event", () => {
    const mismatchedProduct = {
      ...passProduct("PRODUCT_001"),
      event_id: "EVENT_002",
    };

    expect(() =>
      adaptGatekeeperToIssueInput(
        gatekeeperOutput([mismatchedProduct]),
        eventMeaningProfile,
      ),
    ).toThrow(/same Event/i);
  });

  it("rejects a non-PASS Product placed in passProductPool", () => {
    const rejectedProduct = {
      ...passProduct("PRODUCT_001"),
      decision: "REJECT",
    } as unknown as PassProductCandidate;

    expect(() =>
      adaptGatekeeperToIssueInput(
        gatekeeperOutput([rejectedProduct]),
        eventMeaningProfile,
      ),
    ).toThrow(/PASS/i);
  });

  it("rejects duplicate Product IDs", () => {
    expect(() =>
      adaptGatekeeperToIssueInput(
        gatekeeperOutput([
          passProduct("PRODUCT_001"),
          passProduct("PRODUCT_001"),
        ]),
        eventMeaningProfile,
      ),
    ).toThrow(/duplicate/i);
  });

  it("rejects Product IDs that become duplicates after schema normalization", () => {
    expect(() =>
      adaptGatekeeperToIssueInput(
        gatekeeperOutput([
          passProduct("PRODUCT_001"),
          passProduct(" PRODUCT_001 "),
        ]),
        eventMeaningProfile,
      ),
    ).toThrow(/duplicate/i);
  });

  it("rejects an Event Meaning Profile belonging to a different Event", () => {
    expect(() =>
      adaptGatekeeperToIssueInput(gatekeeperOutput(), {
        ...eventMeaningProfile,
        event_id: "EVENT_002",
      }),
    ).toThrow(/Event Meaning Profile.*same Event/i);
  });

  it("rejects a mismatched Event Meaning Profile even when the pool is empty", () => {
    expect(() =>
      adaptGatekeeperToIssueInput(gatekeeperOutput([]), {
        ...eventMeaningProfile,
        event_id: "EVENT_002",
      }),
    ).toThrow(/Event Meaning Profile.*same Event/i);
  });
});
