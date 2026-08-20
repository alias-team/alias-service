import type { HeroData, OpeningMessageData } from "@/types/editorial-ui";
import { EditorialImage } from "./editorial-image";
import { colors, fonts, sectionCellStyle } from "./layout-tokens";

type HeroSectionProps = {
  hero: HeroData;
  openingMessage: OpeningMessageData;
};

export function HeroSection({ hero, openingMessage }: HeroSectionProps) {
  return (
    <section data-editorial-component="HeroSection" aria-label="Editorial hero image">
      <table role="presentation" width="100%" cellPadding="0" cellSpacing="0"><tbody><tr>
        <td style={sectionCellStyle}>
          <div style={{ marginBottom: "40px" }}><EditorialImage alt="Editorial hero" height={680} src={hero.image_url} /></div>
          <table role="presentation" width="100%" cellPadding="0" cellSpacing="0"><tbody><tr>
            <td valign="top" width="50%" style={{ paddingRight: "40px" }}>
              <h2 style={{ color: colors.ink, fontFamily: fonts.display, fontSize: "38px", fontWeight: 400, lineHeight: 1.15, margin: 0 }}>{openingMessage.title}</h2>
            </td>
            <td valign="top" width="50%" style={{ paddingLeft: "40px" }}>
              <p style={{ color: colors.body, fontFamily: fonts.editorial, fontSize: "16px", lineHeight: 1.85, margin: 0 }}>{openingMessage.content}</p>
            </td>
          </tr></tbody></table>
        </td>
      </tr></tbody></table>
    </section>
  );
}
