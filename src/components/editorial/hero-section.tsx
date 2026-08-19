import type { HeroData, OpeningMessageData } from "@/types/editorial-ui";
import { EditorialImage } from "./editorial-image";
import { colors, sectionCellStyle } from "./layout-tokens";

type HeroSectionProps = {
  hero: HeroData;
  openingMessage: OpeningMessageData;
};

export function HeroSection({ hero, openingMessage }: HeroSectionProps) {
  return (
    <section data-editorial-component="HeroSection" aria-label="Editorial hero image">
      <table role="presentation" width="100%" cellPadding="0" cellSpacing="0"><tbody><tr>
        <td style={sectionCellStyle}>
          <EditorialImage alt="Editorial hero" height={300} src={hero.image_url} />
          <h2 style={{ color: colors.ink, fontFamily: "Georgia, serif", fontSize: "26px", fontWeight: 400, margin: "28px 0 12px" }}>{openingMessage.title}</h2>
          <p style={{ color: colors.muted, fontSize: "14px", lineHeight: 1.8, margin: 0 }}>{openingMessage.content}</p>
        </td>
      </tr></tbody></table>
    </section>
  );
}
