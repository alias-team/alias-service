import { Cormorant_Garamond, Jost } from "next/font/google";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-landing-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-landing-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const landingFontVariables = `${cormorantGaramond.variable} ${jost.variable}`;
