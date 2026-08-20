import type { PassProductCandidate } from "./issue-composition";

export type GatekeeperDecision = "PASS" | "REJECT";

export interface GatekeeperProduct {
  name: string;
  category: string;
  collection: string | null;
  image_url: string | null;
}

export interface GatekeeperProductProfile {
  core4: unknown;
  ai_product_traits: unknown[];
  evidence: Array<{ source: string; text: string }>;
}

export interface CustomerProfileContext {
  taste_summary: string;
  core_preference: Record<string, unknown>;
  ai_traits: unknown[];
  evidence_product_ids: string[];
}

export interface EventMeaningContext {
  event_id: string;
  event_theme: string;
  brand_direction: string;
  event_traits: string[];
  evidence: Array<{ source: string; text: string }>;
}

export interface CustomerEventMatch {
  connection: boolean;
  matching_reason: string;
  evidence: string[];
}

export interface CustomerProductMatch {
  connection: boolean;
  core4_connections: unknown[];
  trait_connections: unknown[];
  matching_reason: string;
  evidence: string[];
}

export interface ExtensionResult {
  extension_type:
    | "meaningful_extension"
    | "existing_preference_repetition";
  existing_preference: string;
  new_expression: string;
  extension_reason: string;
}

export interface GatekeeperCandidateInput {
  product_id: string;
  product: GatekeeperProduct;
  product_profile: GatekeeperProductProfile;
  customer_product_match: CustomerProductMatch;
  meaning_bridge: string;
  extension_result: ExtensionResult;
}

export interface GatekeeperInput {
  event_id: string;
  customer_profile: CustomerProfileContext;
  event_meaning_profile: EventMeaningContext;
  customer_event_match: CustomerEventMatch;
  candidates: GatekeeperCandidateInput[];
}

export interface GatekeeperAiEvaluation {
  product_id: string;
  decision: GatekeeperDecision;
  reason: string;
  editorial_angle: string | null;
}

export interface GatekeeperAiOutput {
  evaluations: GatekeeperAiEvaluation[];
}

export interface GatekeeperEvaluation extends GatekeeperAiEvaluation {
  event_id: string;
  failed_rules: string[];
}

export interface GatekeeperOutput {
  event_id: string;
  evaluations: GatekeeperEvaluation[];
  passProductPool: PassProductCandidate[];
}

