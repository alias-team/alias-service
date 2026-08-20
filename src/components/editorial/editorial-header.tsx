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
        <td style={{ borderBottom: `1px solid ${colors.line}`, padding: "64px 96px 56px" }}>
          <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: "64px" }}><tbody><tr>
            <td valign="top">
              <p data-editorial-element="BrandLogo" style={{ border: `1px solid ${colors.cognac}`, color: colors.ink, display: "inline-block", fontFamily: fonts.editorial, fontSize: "13px", letterSpacing: "0.3em", lineHeight: 1, margin: 0, padding: "12px 20px" }}>{emailHeader.sender}</p>
            </td>
            <td align="right" valign="top">
              <p style={{ color: colors.muted, fontFamily: fonts.sans, fontSize: "10px", letterSpacing: "0.2em", lineHeight: 1.4, margin: "0 0 4px", textTransform: "uppercase" }}>{emailHeader.subject}</p>
              <p style={{ color: colors.muted, fontFamily: fonts.sans, fontSize: "11px", lineHeight: 1.5, margin: 0 }}>{emailHeader.preview}</p>
            </td>
          </tr></tbody></table>
          <p style={{ color: colors.cognac, fontFamily: fonts.sans, fontSize: "12px", fontWeight: 500, letterSpacing: "0.28em", lineHeight: 1, margin: "0 0 20px", textTransform: "uppercase" }}>{cover.subtitle}</p>
          <h1 style={{ color: colors.ink, fontFamily: fonts.display, fontSize: "84px", fontWeight: 400, lineHeight: 1.02, margin: "0 0 28px", maxWidth: "900px" }}>{cover.title}</h1>
          <p style={{ color: colors.body, fontFamily: fonts.editorial, fontSize: "19px", lineHeight: 1.75, margin: 0, maxWidth: "560px" }}>{cover.hero_message}</p>
        </td>
      </tr></tbody></table>
    </header>
  );
}
