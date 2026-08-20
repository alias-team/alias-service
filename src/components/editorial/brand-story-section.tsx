import type { BrandStoryData } from "@/types/editorial-ui";
import { EditorialImage } from "./editorial-image";
import { colors, fonts, sectionCellStyle } from "./layout-tokens";

type BrandStorySectionProps = {
  story: BrandStoryData;
};

const HERITAGE_IN_MOTION_IMAGE_URL =
  "https://cdn.media.amplience.net/i/mcmworldwide/TravelLP_IMG3?$poi$&w=2240&fmt=auto&qlt=default&sm=aspect&aspect=4:5";

export function BrandStorySection({ story }: BrandStorySectionProps) {
  const [initial = "", ...content] = Array.from(story.content);

  return (
    <section data-editorial-component="BrandStorySection" aria-label="Brand story">
      <table role="presentation" width="100%" cellPadding="0" cellSpacing="0"><tbody><tr><td style={sectionCellStyle}>
        <p style={{ color: colors.cognac, fontFamily: fonts.sans, fontSize: "12px", fontWeight: 500, letterSpacing: "0.24em", lineHeight: 1, margin: "0 0 20px", textTransform: "uppercase" }}>BRAND STORY</p>
        <h2 style={{ color: colors.ink, fontFamily: fonts.editorial, fontSize: "52px", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.04, margin: "0 0 18px", maxWidth: "860px" }}>{story.title}</h2>
        <div aria-hidden="true" data-editorial-element="BrandStoryTitleRule" style={{ backgroundColor: colors.gold, height: "1px", marginBottom: "33px", maxWidth: "100%", width: "360px" }} />
        <table role="presentation" width="100%" cellPadding="0" cellSpacing="0"><tbody><tr>
          <td valign="middle" width="58%" style={{ paddingRight: "40px" }}>
            <EditorialImage alt={story.title} height={520} src={HERITAGE_IN_MOTION_IMAGE_URL} />
          </td>
          <td valign="middle" width="42%" style={{ paddingLeft: "40px" }}>
            <p style={{ color: colors.body, fontFamily: fonts.editorial, fontSize: "20px", fontWeight: 400, letterSpacing: "0.005em", lineHeight: 1.9, margin: 0 }}>
              {initial && (
                <span data-editorial-element="BrandStoryDropCap" style={{ color: colors.cognac, float: "left", fontFamily: fonts.display, fontSize: "88px", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 0.8, margin: "8px 12px 0 0" }}>
                  {initial}
                </span>
              )}
              {content.join("")}
            </p>
          </td>
        </tr></tbody></table>
      </td></tr></tbody></table>
    </section>
  );
}
