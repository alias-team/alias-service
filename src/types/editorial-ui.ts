import type {
  BrandStory,
  ClosingMessage,
  Cover,
  DiscoveryChapter,
  EmailHeader,
  OpeningMessage,
  PersonalEditorial,
  ProductDiscovery,
} from "./editorial";

export type EditorialData = PersonalEditorial;

export type EditorialHeaderData = Cover;
export type EditorialEmailHeaderData = EmailHeader;
export type HeroData = Pick<BrandStory, "image_url">;
export type OpeningMessageData = OpeningMessage;
export type BrandStoryData = BrandStory;
export type DiscoveryChapterData = DiscoveryChapter;
export type ProductStoryData = ProductDiscovery;
export type EditorialFooterData = ClosingMessage;
