import { colors, sectionCellStyle } from "./layout-tokens";
import type { EditorialFooterData } from "@/types/editorial-ui";

type EditorialFooterProps = {
  closing: EditorialFooterData;
};

export function EditorialFooter({ closing }: EditorialFooterProps) {
  return (
    <footer data-editorial-component="EditorialFooter">
      <table role="presentation" width="100%" cellPadding="0" cellSpacing="0"><tbody><tr>
        <td style={{ ...sectionCellStyle, borderTop: `1px solid ${colors.line}`, textAlign: "center" }}>
          <p style={{ color: colors.ink, fontFamily: "Georgia, serif", fontSize: "20px", margin: "0 0 12px" }}>{closing.content}</p>
          <p style={{ color: colors.muted, fontSize: "10px", letterSpacing: "0.18em", margin: 0 }}>{closing.cta_label}</p>
        </td>
      </tr></tbody></table>
    </footer>
  );
}
