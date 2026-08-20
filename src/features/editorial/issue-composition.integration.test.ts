import { describe, expect, it, vi } from "vitest";

import { composeIssue } from "@/lib/ai/issue-composition";
import type { EventMeaningProfile } from "@/types/event";
import type { GatekeeperOutput } from "@/types/gatekeeper";
import type {
  IssueComposition,
  IssueCompositionInput,
  PassProductCandidate,
} from "@/types/issue-composition";

import { composeIssueFromGatekeeper } from "./issue-composition.service";

const EVENT_ID = "EVENT_001";
const PRODUCT_IDS = ["PRODUCT_001", "PRODUCT_002"];

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
    existing_preference: "Established heritage craft preference.",
    new_expression: "A mobile expression of that same heritage craft.",
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

function generatedIssue(productIds = PRODUCT_IDS): IssueComposition {
  return {
    event_id: EVENT_ID,
    issue_theme: "Heritage in Motion",
    editorial_angle: "Familiar craft for contemporary movement",
    selected_products: productIds.map((productId, index) => ({
      product_id: productId,
      product_role: index === 0 ? "Theme anchor" : "Theme extension",
      discovery_direction: "A mobile expression of heritage",
    })),
    brand_connection: {
      event_theme: "Modern Heritage",
      brand_direction: "Heritage reinterpreted for contemporary movement",
      connection_narrative: "The Event carries familiar craft into motion.",
    },
    personal_connection: {
      existing_preference: "The customer has favored established heritage craft.",
      new_expression: "The Event expresses that craft through contemporary movement.",
      connection_reason: "It extends the customer's own preference rather than repeating it.",
    },
    evidence: ["The supplied products support mobile use."],
  };
}

describe("TASK-205 to TASK-206 pipeline integration", () => {
  it("preserves the Event and complete PASS Product order through Issue Composition", async () => {
    const passProductPool = PRODUCT_IDS.map(passProduct);
    let compositionInput: IssueCompositionInput | undefined;
    const fakeGenerator = vi.fn(async () => generatedIssue());
    const composer = async (input: IssueCompositionInput) => {
      compositionInput = input;
      return composeIssue(input, fakeGenerator);
    };

    const result = await composeIssueFromGatekeeper(
      {
        gatekeeperOutput: gatekeeperOutput(passProductPool),
        eventMeaningProfile,
      },
      composer,
    );

    expect(result).toEqual({
      status: "composed",
      issueComposition: generatedIssue(),
    });
    expect(compositionInput?.event_id).toBe(EVENT_ID);
    expect(
      compositionInput?.passProductPool.map(({ product_id }) => product_id),
    ).toEqual(["PRODUCT_001", "PRODUCT_002"]);
    expect(new Set(compositionInput?.passProductPool.map(({ product_id }) => product_id)).size).toBe(2);

    if (result.status !== "composed") {
      throw new Error("Expected a composed Issue");
    }

    console.log(`=== TASK-205 → TASK-206 Pipeline Test ===
Event ID:
${result.issueComposition.event_id}
Gatekeeper PASS Products:
${passProductPool.map(({ product_id }) => product_id).join("\n")}
↓
Issue Composition Result:
Issue Theme:
${result.issueComposition.issue_theme}
Selected Products:
${result.issueComposition.selected_products.map(({ product_id }) => product_id).join("\n")}
Status:
COMPOSED`);
  });

  it("skips an empty PASS Product Pool without invoking Issue Composition", async () => {
    const composer = vi.fn(async () => generatedIssue([]));

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

  it("preserves adapter validation for mismatched Event IDs", async () => {
    const composer = vi.fn(async () => generatedIssue());

    await expect(
      composeIssueFromGatekeeper(
        {
          gatekeeperOutput: gatekeeperOutput(PRODUCT_IDS.map(passProduct)),
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

  it("preserves adapter validation for duplicate Product IDs", async () => {
    const composer = vi.fn(async () => generatedIssue());
    const duplicatePool = [
      passProduct("PRODUCT_001"),
      passProduct("PRODUCT_001"),
    ];

    await expect(
      composeIssueFromGatekeeper(
        {
          gatekeeperOutput: gatekeeperOutput(duplicatePool),
          eventMeaningProfile,
        },
        composer,
      ),
    ).rejects.toThrow(/duplicate/i);
    expect(composer).not.toHaveBeenCalled();
  });
});
