import { colors, fonts, sectionCellStyle } from "./layout-tokens";
import { ProductStoryBlock } from "./product-story-block";
import type { DiscoveryChapterData } from "@/types/editorial-ui";

type DiscoveryChapterProps = {
  chapter: DiscoveryChapterData;
};

export function DiscoveryChapter({ chapter }: DiscoveryChapterProps) {
  return (
    <section data-editorial-component="DiscoveryChapter" aria-label={chapter.chapter_title}>
      <table role="presentation" width="100%" cellPadding="0" cellSpacing="0"><tbody><tr><td style={{ ...sectionCellStyle, paddingBottom: "64px" }}>
        <p style={{ color: colors.cognac, fontFamily: fonts.sans, fontSize: "12px", fontWeight: 500, letterSpacing: "0.24em", lineHeight: 1, margin: "0 0 20px", textTransform: "uppercase" }}>DISCOVERY CHAPTER</p>
        <h2 style={{ color: colors.ink, fontFamily: fonts.editorial, fontSize: "54px", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.02, margin: "0 0 20px", maxWidth: "900px" }}>{chapter.chapter_title}</h2>
        <p style={{ color: colors.body, fontFamily: fonts.editorial, fontSize: "20px", fontWeight: 400, letterSpacing: "0.005em", lineHeight: 1.8, margin: "0 0 44px", maxWidth: "820px" }}>{chapter.chapter_intro}</p>
        {chapter.products.map((product, index) => (
          <ProductStoryBlock key={product.product_id} layout={index % 2 === 0 ? "image-first" : "text-first"} product={product} />
        ))}
      </td></tr></tbody></table>
    </section>
  );
}
