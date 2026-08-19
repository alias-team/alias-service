import { colors, sectionCellStyle } from "./layout-tokens";
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
        <td style={{ ...sectionCellStyle, paddingBottom: "32px" }}>
          <p data-editorial-element="BrandLogo" style={{ border: `1px solid ${colors.line}`, color: colors.muted, display: "inline-block", fontSize: "11px", letterSpacing: "0.22em", margin: "0 0 40px", padding: "10px 14px" }}>{emailHeader.sender}</p>
          <p style={{ color: colors.muted, fontSize: "10px", letterSpacing: "0.16em", margin: "0 0 8px" }}>{emailHeader.subject}</p>
          <p style={{ color: colors.muted, fontSize: "11px", margin: "0 0 28px" }}>{emailHeader.preview}</p>
          <p style={{ color: colors.muted, fontSize: "12px", margin: "0 0 12px" }}>{cover.subtitle}</p>
          <h1 style={{ color: colors.ink, fontFamily: "Georgia, serif", fontSize: "42px", fontWeight: 400, lineHeight: 1.08, margin: "0 0 20px" }}>{cover.title}</h1>
          <p style={{ color: colors.muted, fontSize: "15px", lineHeight: 1.7, margin: 0 }}>{cover.hero_message}</p>
        </td>
      </tr></tbody></table>
    </header>
  );
}
