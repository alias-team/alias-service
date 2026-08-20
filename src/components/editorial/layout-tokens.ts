import type { CSSProperties } from "react";

export const colors = {
  canvas: "#efece5",
  paper: "#F6F3EE",
  ink: "#111111",
  muted: "#746d63",
  body: "#4a463e",
  line: "#D7C6A5",
  cognac: "#A4612A",
  gold: "#C8A66B",
  charcoal: "#2A2A2A",
  placeholder: "#D7C6A5",
} as const;

export const fonts = {
  display: "var(--font-editorial-display), Georgia, serif",
  editorial: "var(--font-editorial-serif), Georgia, serif",
  issue: "var(--font-editorial-issue), Georgia, serif",
  sans: "var(--font-editorial-sans), Arial, sans-serif",
} as const;

export const sectionCellStyle: CSSProperties = { padding: "52px 96px 64px" };
