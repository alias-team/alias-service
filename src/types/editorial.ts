import type { DataSource, EventMeaningProfile, EventType } from "./event";
import type { IssueComposition } from "./issue-composition";

export interface CustomerTasteProfile {
  id: string;
  customer_id: string;
  taste_summary: string;
  core_preference: Record<string, unknown>;
  ai_traits: unknown[];
  evidence_product_ids: string[];
  source: DataSource;
  is_current: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EditorialEventContext {
  event_id: string;
  event_type: EventType;
}

export interface BrandAsset {
  image_url: string;
}

export interface EditorialProductProfile {
  core4: Record<string, unknown>;
  ai_product_traits: unknown[];
  evidence: unknown[];
}

export interface EditorialProductContext {
  product_id: string;
  product_name: string;
  image_url: string;
  description: string;
  product_profile: EditorialProductProfile;
}

export interface EditorialGeneratorInput {
  issue_composition: IssueComposition;
  event_meaning_profile: EventMeaningProfile;
  customer_taste_profile: CustomerTasteProfile;
  event: EditorialEventContext;
  brand_asset: BrandAsset;
  products: EditorialProductContext[];
}

export interface EmailHeaderDraft {
  subject: string;
  preview: string;
}

export interface Cover {
  title: string;
  subtitle: string;
  hero_message: string;
}

export interface OpeningMessage {
  title: string;
  content: string;
}

export interface BrandStoryDraft {
  title: string;
  content: string;
}

export interface ProductDiscoveryDraft {
  product_id: string;
  discovery_story: string;
  connection_reason: string;
}

export interface DiscoveryChapterDraft {
  chapter_title: string;
  chapter_intro: string;
  products: ProductDiscoveryDraft[];
}

export interface ClosingMessage {
  content: string;
  cta_label: string;
}

export interface EditorialDraft {
  email_header: EmailHeaderDraft;
  editorial: {
    cover: Cover;
    opening_message: OpeningMessage;
    brand_story: BrandStoryDraft;
    discovery_chapters: DiscoveryChapterDraft[];
    closing_message: ClosingMessage;
  };
}

export interface EmailHeader extends EmailHeaderDraft {
  sender: "MCM Editorial Team";
}

export interface BrandStory extends BrandStoryDraft {
  story_type: EventType;
  image_url: string;
}

export interface ProductDiscovery extends ProductDiscoveryDraft {
  product_name: string;
  image_url: string;
}

export interface DiscoveryChapter
  extends Omit<DiscoveryChapterDraft, "products"> {
  products: ProductDiscovery[];
}

export interface PersonalEditorial {
  email_header: EmailHeader;
  editorial: {
    cover: Cover;
    opening_message: OpeningMessage;
    brand_story: BrandStory;
    discovery_chapters: DiscoveryChapter[];
    closing_message: ClosingMessage;
  };
}
