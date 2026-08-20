import { getOpenAIClient } from "./openai-client";
import { buildGatekeeperPrompt } from "./prompts/gatekeeper.prompt";
import {
  gatekeeperAiOutputJsonSchema,
  gatekeeperAiOutputSchema,
  gatekeeperInputSchema,
} from "@/lib/validation/gatekeeper.schema";
import { passProductCandidateSchema } from "@/lib/validation/issue-composition.schema";
import type {
  GatekeeperAiOutput,
  GatekeeperCandidateInput,
  GatekeeperEvaluation,
  GatekeeperInput,
  GatekeeperOutput,
} from "@/types/gatekeeper";
import type { PassProductCandidate } from "@/types/issue-composition";

export const GATEKEEPER_MODEL =
  process.env.OPENAI_GATEKEEPER_MODEL ?? "gpt-5-mini";

export type GatekeeperGenerator = (
  input: GatekeeperInput,
) => Promise<unknown>;

const generateWithOpenAI: GatekeeperGenerator = async (input) => {
  const prompt = buildGatekeeperPrompt(input);
  const response = await getOpenAIClient().responses.create({
    model: GATEKEEPER_MODEL,
    instructions: prompt.instructions,
    input: prompt.input,
    text: {
      format: {
        type: "json_schema",
        name: "gatekeeper_evaluations",
        strict: true,
        schema: gatekeeperAiOutputJsonSchema,
      },
    },
  });

  if (!response.output_text) {
    throw new Error("OpenAI returned an empty Gatekeeper response");
  }

  try {
    return JSON.parse(response.output_text) as unknown;
  } catch (error) {
    throw new Error("OpenAI returned invalid JSON for Gatekeeper", {
      cause: error,
    });
  }
};

function assertInputIdentity(input: GatekeeperInput) {
  if (input.event_meaning_profile.event_id !== input.event_id) {
    throw new Error(
      "Event Meaning Profile must belong to the same Event as the Gatekeeper input",
    );
  }

  const productIds = input.candidates.map(({ product_id }) => product_id);
  if (new Set(productIds).size !== productIds.length) {
    throw new Error("Gatekeeper candidates must not contain duplicate Product IDs");
  }
}

function failedRules(
  input: GatekeeperInput,
  candidate: GatekeeperCandidateInput,
) {
  const rules: string[] = [];

  if (!input.customer_event_match.connection) {
    rules.push("CUSTOMER_EVENT_CONNECTION_REQUIRED");
  }
  if (!candidate.customer_product_match.connection) {
    rules.push("CUSTOMER_PRODUCT_CONNECTION_REQUIRED");
  }
  if (
    candidate.extension_result.extension_type !== "meaningful_extension"
  ) {
    rules.push("MEANINGFUL_EXTENSION_REQUIRED");
  }

  return rules;
}

function deterministicRejection(
  eventId: string,
  productId: string,
  rules: string[],
): GatekeeperEvaluation {
  return {
    event_id: eventId,
    product_id: productId,
    decision: "REJECT",
    reason: `Gatekeeper rule validation failed: ${rules.join(", ")}`,
    editorial_angle: null,
    failed_rules: rules,
  };
}

function assertAiIdentity(
  eligibleCandidates: GatekeeperCandidateInput[],
  output: GatekeeperAiOutput,
) {
  const expectedIds = eligibleCandidates.map(({ product_id }) => product_id);
  const actualIds = output.evaluations.map(({ product_id }) => product_id);

  if (
    expectedIds.length !== actualIds.length ||
    expectedIds.some((productId, index) => productId !== actualIds[index])
  ) {
    throw new Error(
      "Gatekeeper AI must evaluate every eligible Product exactly once in input order",
    );
  }
}

function collectEvidence(
  input: GatekeeperInput,
  candidate: GatekeeperCandidateInput,
) {
  return [
    ...input.customer_event_match.evidence,
    ...candidate.customer_product_match.evidence,
    ...candidate.product_profile.evidence.map(({ text }) => text),
    ...input.event_meaning_profile.evidence.map(({ text }) => text),
  ];
}

function hydratePassCandidate(
  input: GatekeeperInput,
  candidate: GatekeeperCandidateInput,
  evaluation: GatekeeperEvaluation,
): PassProductCandidate {
  return passProductCandidateSchema.parse({
    event_id: input.event_id,
    product_id: candidate.product_id,
    decision: "PASS",
    product: candidate.product,
    product_profile: {
      core4: candidate.product_profile.core4,
      ai_product_traits: candidate.product_profile.ai_product_traits,
    },
    editorial_angle: evaluation.editorial_angle,
    matching_reason: candidate.customer_product_match.matching_reason,
    meaning_bridge: candidate.meaning_bridge,
    extension: candidate.extension_result.extension_reason,
    // TASK-206 personal_connection이 근거로 쓸 수 있도록 TASK-204 extension_result의
    // existing_preference/new_expression을 변형 없이 그대로 보존한다 — 새 판단 아님,
    // PASS/REJECT 로직도 그대로다.
    existing_preference: candidate.extension_result.existing_preference,
    new_expression: candidate.extension_result.new_expression,
    evidence: collectEvidence(input, candidate),
  });
}

export async function evaluateGatekeeper(
  input: GatekeeperInput,
  generate: GatekeeperGenerator = generateWithOpenAI,
): Promise<GatekeeperOutput> {
  const validatedInput = gatekeeperInputSchema.parse(input);
  assertInputIdentity(validatedInput);

  const evaluationsByProductId = new Map<string, GatekeeperEvaluation>();
  const eligibleCandidates: GatekeeperCandidateInput[] = [];

  for (const candidate of validatedInput.candidates) {
    const rules = failedRules(validatedInput, candidate);
    if (rules.length > 0) {
      evaluationsByProductId.set(
        candidate.product_id,
        deterministicRejection(validatedInput.event_id, candidate.product_id, rules),
      );
    } else {
      eligibleCandidates.push(candidate);
    }
  }

  if (eligibleCandidates.length > 0) {
    const aiInput = { ...validatedInput, candidates: eligibleCandidates };
    const rawOutput = await generate(aiInput);
    const aiOutput = gatekeeperAiOutputSchema.parse(rawOutput);
    assertAiIdentity(eligibleCandidates, aiOutput);

    for (const evaluation of aiOutput.evaluations) {
      evaluationsByProductId.set(evaluation.product_id, {
        event_id: validatedInput.event_id,
        ...evaluation,
        failed_rules: [],
      });
    }
  }

  const evaluations = validatedInput.candidates.map((candidate) => {
    const evaluation = evaluationsByProductId.get(candidate.product_id);
    if (!evaluation) {
      throw new Error(`Missing Gatekeeper evaluation: ${candidate.product_id}`);
    }
    return evaluation;
  });

  const passProductPool = validatedInput.candidates.flatMap((candidate) => {
    const evaluation = evaluationsByProductId.get(candidate.product_id);
    if (!evaluation || evaluation.decision !== "PASS") return [];
    return [hydratePassCandidate(validatedInput, candidate, evaluation)];
  });

  return {
    event_id: validatedInput.event_id,
    evaluations,
    passProductPool,
  };
}
