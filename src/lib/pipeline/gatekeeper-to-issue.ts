import { issueCompositionInputSchema } from "@/lib/validation/issue-composition.schema";
import type { EventMeaningProfile } from "@/types/event";
import type { GatekeeperOutput } from "@/types/gatekeeper";
import type { IssueCompositionInput } from "@/types/issue-composition";

export type GatekeeperToIssueResult =
  | {
      status: "ready";
      input: IssueCompositionInput;
    }
  | {
      status: "skipped";
      reason: "EMPTY_PASS_PRODUCT_POOL";
    };

export function adaptGatekeeperToIssueInput(
  gatekeeperOutput: GatekeeperOutput,
  eventMeaningProfile: EventMeaningProfile,
): GatekeeperToIssueResult {
  if (!Array.isArray(gatekeeperOutput.passProductPool)) {
    throw new Error("Gatekeeper Output must contain a passProductPool");
  }

  if (eventMeaningProfile.event_id !== gatekeeperOutput.event_id) {
    throw new Error(
      "Event Meaning Profile must belong to the same Event as the Gatekeeper Output",
    );
  }

  if (gatekeeperOutput.passProductPool.length === 0) {
    return {
      status: "skipped",
      reason: "EMPTY_PASS_PRODUCT_POOL",
    };
  }

  if (
    gatekeeperOutput.passProductPool.some(
      ({ decision }) => decision !== "PASS",
    )
  ) {
    throw new Error("Every Product in passProductPool must have a PASS decision");
  }

  if (
    gatekeeperOutput.passProductPool.some(
      ({ event_id }) => event_id !== gatekeeperOutput.event_id,
    )
  ) {
    throw new Error(
      "Every Product in passProductPool must belong to the same Event",
    );
  }

  const input = issueCompositionInputSchema.parse({
    event_id: gatekeeperOutput.event_id,
    eventMeaningProfile,
    passProductPool: gatekeeperOutput.passProductPool,
  });

  const productIds = input.passProductPool.map(
    ({ product_id }) => product_id,
  );
  if (new Set(productIds).size !== productIds.length) {
    throw new Error("passProductPool must not contain duplicate Product IDs");
  }

  return { status: "ready", input };
}
