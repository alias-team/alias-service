import { composeIssue } from "@/lib/ai/issue-composition";
import { adaptGatekeeperToIssueInput } from "@/lib/pipeline/gatekeeper-to-issue";
import type { EventMeaningProfile } from "@/types/event";
import type { GatekeeperOutput } from "@/types/gatekeeper";
import type {
  IssueComposition,
  IssueCompositionInput,
} from "@/types/issue-composition";

export interface ComposeIssueFromGatekeeperInput {
  gatekeeperOutput: GatekeeperOutput;
  eventMeaningProfile: EventMeaningProfile;
}

export type ComposeIssueFromGatekeeperResult =
  | {
      status: "composed";
      issueComposition: IssueComposition;
    }
  | {
      status: "skipped";
      reason: "EMPTY_PASS_PRODUCT_POOL";
    };

export type IssueComposer = (
  input: IssueCompositionInput,
) => Promise<IssueComposition>;

export async function composeIssueFromGatekeeper(
  input: ComposeIssueFromGatekeeperInput,
  composer: IssueComposer = composeIssue,
): Promise<ComposeIssueFromGatekeeperResult> {
  const adapted = adaptGatekeeperToIssueInput(
    input.gatekeeperOutput,
    input.eventMeaningProfile,
  );

  if (adapted.status === "skipped") return adapted;

  const issueComposition = await composer(adapted.input);
  return { status: "composed", issueComposition };
}
