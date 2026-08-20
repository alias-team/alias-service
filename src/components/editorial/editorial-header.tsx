import { colors, fonts } from "./layout-tokens";
import type {
  EditorialEmailHeaderData,
  EditorialHeaderData,
} from "@/types/editorial-ui";

type EditorialHeaderProps = {
  cover: EditorialHeaderData;
  emailHeader: EditorialEmailHeaderData;
};

export function EditorialHeader({ cover, emailHeader }: EditorialHeaderProps) {
  return (
    <header data-editorial-component="EditorialHeader">
      <table role="presentation" width="100%" cellPadding="0" cellSpacing="0"><tbody><tr>
        <td style={{ padding: "64px 96px 52px" }}>
          <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: "52px" }}><tbody><tr>
            <td valign="top">
              <p data-editorial-element="EditionLabel" style={{ border: `1.5px solid ${colors.cognac}`, color: colors.cognac, display: "inline-block", fontFamily: fonts.issue, fontSize: "13px", fontWeight: 700, letterSpacing: "0.3em", lineHeight: 1, margin: 0, padding: "12px 20px", textShadow: "0 1px 0 rgba(255, 255, 255, 0.55)", textTransform: "uppercase" }}>AUGUST 2026 EDITION</p>
            </td>
            <td align="right" valign="top" width="96">
              {/* Native image markup is intentional because this component targets email HTML. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="MCM"
                data-editorial-element="MCMLogo"
                height="72"
                src="/images/mcm-logo.png"
                width="72"
                style={{ display: "block", height: "72px", margin: "0 0 0 auto", opacity: 0.58, width: "72px" }}
              />
            </td>
          </tr></tbody></table>
          <p data-editorial-element="EmailSubject" style={{ color: colors.cognac, fontFamily: fonts.sans, fontSize: "12px", fontWeight: 600, letterSpacing: "0.16em", lineHeight: 1.4, margin: "0 0 10px", textTransform: "uppercase" }}>{emailHeader.subject}</p>
          <p data-editorial-element="EmailPreview" style={{ color: colors.body, fontFamily: fonts.sans, fontSize: "13px", fontWeight: 400, lineHeight: 1.6, margin: "0 0 30px", maxWidth: "820px" }}>{emailHeader.preview}</p>
          <p style={{ color: colors.cognac, fontFamily: fonts.display, fontSize: "14px", fontWeight: 400, letterSpacing: "0.28em", lineHeight: 1.2, margin: "0 0 22px", textTransform: "uppercase" }}>{cover.subtitle}</p>
          <h1 style={{ color: colors.ink, fontFamily: fonts.display, fontSize: "84px", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 0.94, margin: "0 0 32px", maxWidth: "1080px", whiteSpace: "nowrap" }}>{cover.title}</h1>
          <p style={{ color: colors.body, fontFamily: fonts.editorial, fontSize: "22px", fontWeight: 400, letterSpacing: "0.005em", lineHeight: 1.6, margin: 0, maxWidth: "100%", whiteSpace: "normal" }}>{cover.hero_message}</p>
        </td>
      </tr></tbody></table>
    </header>
  );
}
