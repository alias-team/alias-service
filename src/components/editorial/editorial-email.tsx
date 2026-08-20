import { BrandStorySection } from "./brand-story-section";
import { DiscoveryChapter } from "./discovery-chapter";
import { EditorialFooter } from "./editorial-footer";
import { EditorialHeader } from "./editorial-header";
import { HeroSection } from "./hero-section";
import { colors } from "./layout-tokens";
import { SectionDivider } from "./section-divider";
import type { EditorialData } from "@/types/editorial-ui";

type EditorialEmailProps = {
  data: EditorialData;
};

export function EditorialEmail({ data }: EditorialEmailProps) {
  const { editorial, email_header: emailHeader } = data;
  return (
    <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: colors.canvas }}><tbody><tr>
      <td align="center" style={{ padding: "40px 0 80px" }}>
        <table data-editorial-container="true" role="presentation" width="1440" cellPadding="0" cellSpacing="0" style={{ backgroundColor: colors.paper, maxWidth: "1440px", width: "100%" }}><tbody>
          <tr><td><EditorialHeader cover={editorial.cover} emailHeader={emailHeader} /></td></tr>
          <tr><td><SectionDivider label="Hero" /></td></tr>
          <tr><td><HeroSection hero={editorial.brand_story} openingMessage={editorial.opening_message} /></td></tr>
          <tr><td><SectionDivider label="Brand Story" /></td></tr>
          <tr><td><BrandStorySection story={editorial.brand_story} /></td></tr>
          <tr><td><SectionDivider label="Discovery" /></td></tr>
          {editorial.discovery_chapters.map((chapter, index) => (
            <tr key={`${chapter.chapter_title}-${index}`}><td><DiscoveryChapter chapter={chapter} /></td></tr>
          ))}
          <tr><td><EditorialFooter closing={editorial.closing_message} /></td></tr>
        </tbody></table>
      </td>
    </tr></tbody></table>
  );
}
