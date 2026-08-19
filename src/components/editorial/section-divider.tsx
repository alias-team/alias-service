import { colors } from "./layout-tokens";

type SectionDividerProps = {
  label: "Hero" | "Brand Story" | "Discovery";
};

export function SectionDivider({ label }: SectionDividerProps) {
  return (
    <div data-editorial-component="SectionDivider" data-section={label} style={{ padding: "0 48px" }}>
      <table role="presentation" width="100%" cellPadding="0" cellSpacing="0"><tbody><tr>
        <td style={{ borderTop: `1px solid ${colors.line}`, color: colors.muted, fontSize: "10px", letterSpacing: "0.18em", paddingTop: "12px" }}>{label.toUpperCase()}</td>
      </tr></tbody></table>
    </div>
  );
}
