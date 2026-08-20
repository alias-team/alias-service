import { colors, fonts, sectionCellStyle } from "./layout-tokens";
import { ProductStoryBlock } from "./product-story-block";
import type { DiscoveryChapterData } from "@/types/editorial-ui";

type DiscoveryChapterProps = {
  chapter: DiscoveryChapterData;
};

export function DiscoveryChapter({ chapter }: DiscoveryChapterProps) {
  return (
    <section data-editorial-component="DiscoveryChapter" aria-label={chapter.chapter_title}>
      <table role="presentation" width="100%" cellPadding="0" cellSpacing="0"><tbody><tr><td style={{ ...sectionCellStyle, paddingBottom: "80px" }}>
        <p style={{ color: colors.cognac, fontFamily: fonts.sans, fontSize: "12px", fontWeight: 500, letterSpacing: "0.24em", lineHeight: 1, margin: "0 0 16px", textTransform: "uppercase" }}>DISCOVERY CHAPTER</p>
        <h2 style={{ color: colors.ink, fontFamily: fonts.display, fontSize: "42px", fontWeight: 400, lineHeight: 1.15, margin: "0 0 16px", maxWidth: "760px" }}>{chapter.chapter_title}</h2>
        <p style={{ color: colors.body, fontFamily: fonts.editorial, fontSize: "17px", lineHeight: 1.85, margin: "0 0 56px", maxWidth: "720px" }}>{chapter.chapter_intro}</p>
        {chapter.products.map((product, index) => (
          <ProductStoryBlock key={product.product_id} layout={index % 2 === 0 ? "image-first" : "text-first"} product={product} />
        ))}
      </td></tr></tbody></table>
    </section>
  );
}
