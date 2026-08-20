import type { HeroData, OpeningMessageData } from "@/types/editorial-ui";
import { EditorialImage } from "./editorial-image";
import { colors, fonts, sectionCellStyle } from "./layout-tokens";

type HeroSectionProps = {
  hero: HeroData;
  openingMessage: OpeningMessageData;
};

const TRAVEL_EDIT_HERO_IMAGE_URL =
  "https://cdn.media.amplience.net/i/mcmworldwide/TravelLP_IMG2?$poi$&w=2240&fmt=auto&qlt=default&sm=aspect&aspect=4:5";

export function HeroSection({ openingMessage }: HeroSectionProps) {
  return (
    <section data-editorial-component="HeroSection" aria-label="Editorial hero image">
      <table role="presentation" width="100%" cellPadding="0" cellSpacing="0"><tbody><tr>
        <td style={sectionCellStyle}>
          <div style={{ marginBottom: "36px" }}><EditorialImage alt="Editorial hero" height={720} src={TRAVEL_EDIT_HERO_IMAGE_URL} /></div>
          <table role="presentation" width="100%" cellPadding="0" cellSpacing="0"><tbody><tr>
            <td valign="middle" width="44%" style={{ paddingRight: "48px" }}>
              <h2 style={{ color: colors.ink, fontFamily: fonts.display, fontSize: "46px", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.02, margin: 0 }}>{openingMessage.title}</h2>
            </td>
            <td valign="middle" width="56%" style={{ borderLeft: `1px solid ${colors.line}`, paddingLeft: "48px" }}>
              <p style={{ color: colors.body, fontFamily: fonts.editorial, fontSize: "19px", fontWeight: 400, letterSpacing: "0.005em", lineHeight: 1.8, margin: 0 }}>{openingMessage.content}</p>
            </td>
          </tr></tbody></table>
        </td>
      </tr></tbody></table>
    </section>
  );
}
