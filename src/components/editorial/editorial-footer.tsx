import { colors, fonts } from "./layout-tokens";
import type { EditorialFooterData } from "@/types/editorial-ui";

type EditorialFooterProps = {
  closing: EditorialFooterData;
};

export function EditorialFooter({ closing }: EditorialFooterProps) {
  return (
    <footer data-editorial-component="EditorialFooter">
      <table role="presentation" width="100%" cellPadding="0" cellSpacing="0"><tbody><tr>
        <td style={{ padding: "80px 80px 68px", textAlign: "center" }}>
          <p style={{ color: colors.ink, fontFamily: fonts.display, fontSize: "38px", fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.22, margin: "0 auto 36px", maxWidth: "100%", opacity: 0.48, whiteSpace: "normal" }}>{closing.content}</p>
          {/* Native image markup is intentional because this component targets email HTML. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="MCM"
            data-editorial-element="FooterMCMLogo"
            height="62"
            src="/images/mcm-logo.png"
            width="60"
            style={{ display: "block", height: "62px", margin: "0 auto", opacity: 0.48, width: "60px" }}
          />
        </td>
      </tr></tbody></table>
    </footer>
  );
}
