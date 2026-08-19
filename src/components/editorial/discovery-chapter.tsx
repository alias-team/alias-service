import { colors, sectionCellStyle } from "./layout-tokens";
import { ProductStoryBlock } from "./product-story-block";
import type { DiscoveryChapterData } from "@/types/editorial-ui";

type DiscoveryChapterProps = {
  chapter: DiscoveryChapterData;
};

export function DiscoveryChapter({ chapter }: DiscoveryChapterProps) {
  return (
    <section data-editorial-component="DiscoveryChapter" aria-label={chapter.chapter_title}>
      <table role="presentation" width="100%" cellPadding="0" cellSpacing="0"><tbody><tr><td style={sectionCellStyle}>
        <p style={{ color: colors.muted, fontSize: "10px", letterSpacing: "0.18em", margin: "0 0 12px" }}>DISCOVERY CHAPTER</p>
        <h2 style={{ color: colors.ink, fontFamily: "Georgia, serif", fontSize: "30px", fontWeight: 400, margin: "0 0 12px" }}>{chapter.chapter_title}</h2>
        <p style={{ color: colors.muted, fontSize: "14px", lineHeight: 1.8, margin: "0 0 28px" }}>{chapter.chapter_intro}</p>
        {chapter.products.map((product, index) => (
          <ProductStoryBlock key={product.product_id} layout={index % 2 === 0 ? "image-first" : "text-first"} product={product} />
        ))}
      </td></tr></tbody></table>
    </section>
  );
}
