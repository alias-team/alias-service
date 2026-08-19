import type { ProductStoryData } from "@/types/editorial-ui";
import { EditorialImage } from "./editorial-image";
import { colors } from "./layout-tokens";

type ProductStoryBlockProps = {
  layout: "image-first" | "text-first";
  product: ProductStoryData;
};

function ProductStory({ product }: Pick<ProductStoryBlockProps, "product">) {
  return <div>
    <h3 style={{ color: colors.ink, fontFamily: "Georgia, serif", fontSize: "23px", fontWeight: 400, lineHeight: 1.25, margin: "0 0 14px" }}>{product.product_name}</h3>
    <p style={{ color: colors.muted, fontSize: "13px", lineHeight: 1.7, margin: "0 0 12px" }}>{product.connection_reason}</p>
    <p style={{ color: colors.muted, fontSize: "13px", lineHeight: 1.7, margin: 0 }}>{product.discovery_story}</p>
  </div>;
}

export function ProductStoryBlock({ layout, product }: ProductStoryBlockProps) {
  const imageFirst = layout === "image-first";
  return (
    <table data-editorial-component="ProductStoryBlock" data-layout={layout} data-product-id={product.product_id} role="presentation" width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: "32px" }}><tbody><tr>
      <td
        data-image-column={imageFirst ? "58%" : undefined}
        data-story-column={imageFirst ? undefined : "42%"}
        width={imageFirst ? "58%" : "42%"}
        valign="top"
        style={{ paddingRight: "16px" }}
      >
        {imageFirst ? <EditorialImage alt={product.product_name} height={210} src={product.image_url} /> : <ProductStory product={product} />}
      </td>
      <td
        data-image-column={imageFirst ? undefined : "58%"}
        data-story-column={imageFirst ? "42%" : undefined}
        width={imageFirst ? "42%" : "58%"}
        valign="top"
        style={{ paddingLeft: "16px" }}
      >
        {imageFirst ? <ProductStory product={product} /> : <EditorialImage alt={product.product_name} height={210} src={product.image_url} />}
      </td>
    </tr></tbody></table>
  );
}
