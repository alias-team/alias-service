import type { EventMeaningProfile } from "./event";

export interface IssueCompositionProduct {
  name: string;
  category: string;
  collection: string | null;
  image_url: string | null;
}

export interface IssueCompositionProductProfile {
  core4: unknown;
  ai_product_traits: unknown[];
}

export interface PassProductCandidate {
  event_id: string;
  product_id: string;
  decision: "PASS";
  product: IssueCompositionProduct;
  product_profile: IssueCompositionProductProfile;
  editorial_angle: string;
  matching_reason: string;
  meaning_bridge: string;
  extension: string;
  evidence: string[];
}

export interface IssueCompositionInput {
  event_id: string;
  eventMeaningProfile: EventMeaningProfile;
  passProductPool: PassProductCandidate[];
}

export interface SelectedProductComposition {
  product_id: string;
  product_role: string;
  discovery_direction: string;
}

export interface BrandConnection {
  event_theme: string;
  brand_direction: string;
  connection_narrative: string;
}

export interface IssueComposition {
  event_id: string;
  issue_theme: string;
  editorial_angle: string;
  selected_products: SelectedProductComposition[];
  brand_connection: BrandConnection;
  evidence: string[];
}
