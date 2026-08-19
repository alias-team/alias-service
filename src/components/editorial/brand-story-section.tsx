import type { BrandStoryData } from "@/types/editorial-ui";
import { EditorialImage } from "./editorial-image";
import { colors, sectionCellStyle } from "./layout-tokens";

type BrandStorySectionProps = {
  story: BrandStoryData;
};

export function BrandStorySection({ story }: BrandStorySectionProps) {
  return (
    <section data-editorial-component="BrandStorySection" aria-label="Brand story">
      <table role="presentation" width="100%" cellPadding="0" cellSpacing="0"><tbody><tr><td style={sectionCellStyle}>
        <p style={{ color: colors.muted, fontSize: "10px", letterSpacing: "0.18em", margin: "0 0 12px" }}>BRAND STORY</p>
        <h2 style={{ color: colors.ink, fontFamily: "Georgia, serif", fontSize: "30px", fontWeight: 400, margin: "0 0 24px" }}>{story.title}</h2>
        <div style={{ marginBottom: "24px" }}><EditorialImage alt={story.title} height={220} src={story.image_url} /></div>
        <p style={{ color: colors.muted, fontSize: "14px", lineHeight: 1.8, margin: 0 }}>{story.content}</p>
      </td></tr></tbody></table>
    </section>
  );
}
