import type { ProductStoryData } from "@/types/editorial-ui";
import { EditorialImage } from "./editorial-image";
import { colors, fonts } from "./layout-tokens";

type ProductStoryBlockProps = {
  layout: "image-first" | "text-first";
  product: ProductStoryData;
};

function ProductStory({ product }: Pick<ProductStoryBlockProps, "product">) {
  const [initial = "", ...story] = Array.from(product.discovery_story);

  return <div>
    <h3 style={{ color: colors.ink, fontFamily: fonts.display, fontSize: "36px", fontWeight: 500, letterSpacing: "-0.015em", lineHeight: 1.12, margin: "0 0 22px" }}>{product.product_name}</h3>
    <p style={{ borderTop: `1px solid ${colors.line}`, color: colors.cognac, fontFamily: fonts.sans, fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", lineHeight: 1.65, margin: "0 0 22px", paddingTop: "14px" }}>{product.connection_reason}</p>
    <p aria-label={product.discovery_story} style={{ color: colors.body, fontFamily: fonts.editorial, fontSize: "20px", fontWeight: 400, letterSpacing: "0.005em", lineHeight: 1.9, margin: 0 }}>
      {initial && (
        <span aria-hidden="true" data-editorial-element="DiscoveryStoryDropCap" style={{ color: colors.cognac, float: "left", fontFamily: fonts.display, fontSize: "84px", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 0.78, margin: "7px 12px 0 0" }}>
          {initial}
        </span>
      )}
      {story.join("")}
    </p>
  </div>;
}

export function ProductStoryBlock({ layout, product }: ProductStoryBlockProps) {
  const imageFirst = layout === "image-first";
  return (
    <table data-editorial-component="ProductStoryBlock" data-layout={layout} data-product-id={product.product_id} role="presentation" width="100%" cellPadding="0" cellSpacing="0" style={{ borderTop: `1px solid ${colors.line}`, marginBottom: "48px" }}><tbody><tr>
      <td
        data-image-column={imageFirst ? "58%" : undefined}
        data-story-column={imageFirst ? undefined : "42%"}
        width={imageFirst ? "58%" : "42%"}
        valign="middle"
        style={{ padding: "32px 40px 32px 0" }}
      >
        {imageFirst ? <EditorialImage alt={product.product_name} height={500} src={product.image_url} /> : <ProductStory product={product} />}
      </td>
      <td
        data-image-column={imageFirst ? undefined : "58%"}
        data-story-column={imageFirst ? "42%" : undefined}
        width={imageFirst ? "42%" : "58%"}
        valign="middle"
        style={{ padding: "32px 0 32px 40px" }}
      >
        {imageFirst ? <ProductStory product={product} /> : <EditorialImage alt={product.product_name} height={500} src={product.image_url} />}
      </td>
    </tr></tbody></table>
  );
}
