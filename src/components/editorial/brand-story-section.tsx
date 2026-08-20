import type { BrandStoryData } from "@/types/editorial-ui";
import { EditorialImage } from "./editorial-image";
import { colors, fonts, sectionCellStyle } from "./layout-tokens";

type BrandStorySectionProps = {
  story: BrandStoryData;
};

export function BrandStorySection({ story }: BrandStorySectionProps) {
  return (
    <section data-editorial-component="BrandStorySection" aria-label="Brand story">
      <table role="presentation" width="100%" cellPadding="0" cellSpacing="0"><tbody><tr><td style={sectionCellStyle}>
        <p style={{ color: colors.cognac, fontFamily: fonts.sans, fontSize: "12px", fontWeight: 500, letterSpacing: "0.24em", lineHeight: 1, margin: "0 0 16px", textTransform: "uppercase" }}>BRAND STORY</p>
        <h2 style={{ color: colors.ink, fontFamily: fonts.display, fontSize: "42px", fontWeight: 400, lineHeight: 1.15, margin: "0 0 40px", maxWidth: "760px" }}>{story.title}</h2>
        <table role="presentation" width="100%" cellPadding="0" cellSpacing="0"><tbody><tr>
          <td valign="middle" width="55%" style={{ paddingRight: "28px" }}>
            <EditorialImage alt={story.title} height={520} src={story.image_url} />
          </td>
          <td valign="middle" width="45%" style={{ paddingLeft: "28px" }}>
            <p style={{ color: colors.body, fontFamily: fonts.editorial, fontSize: "17px", lineHeight: 1.85, margin: 0 }}>{story.content}</p>
          </td>
        </tr></tbody></table>
      </td></tr></tbody></table>
    </section>
  );
}
