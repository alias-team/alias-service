import { colors, fonts } from "./layout-tokens";
import type { EditorialFooterData } from "@/types/editorial-ui";

type EditorialFooterProps = {
  closing: EditorialFooterData;
};

export function EditorialFooter({ closing }: EditorialFooterProps) {
  return (
    <footer data-editorial-component="EditorialFooter">
      <table role="presentation" width="100%" cellPadding="0" cellSpacing="0"><tbody><tr>
        <td style={{ borderTop: `1px solid ${colors.line}`, padding: "64px 96px", textAlign: "center" }}>
          <p style={{ color: colors.ink, fontFamily: fonts.display, fontSize: "30px", fontStyle: "italic", fontWeight: 400, lineHeight: 1.4, margin: "0 0 20px" }}>{closing.content}</p>
          <p style={{ color: colors.cognac, fontFamily: fonts.sans, fontSize: "11px", fontWeight: 500, letterSpacing: "0.26em", lineHeight: 1, margin: 0, textTransform: "uppercase" }}>{closing.cta_label}</p>
        </td>
      </tr></tbody></table>
    </footer>
  );
}
