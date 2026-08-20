import type { ProductStoryData } from "@/types/editorial-ui";
import { EditorialImage } from "./editorial-image";
import { colors, fonts } from "./layout-tokens";

type ProductStoryBlockProps = {
  layout: "image-first" | "text-first";
  product: ProductStoryData;
};

function ProductStory({ product }: Pick<ProductStoryBlockProps, "product">) {
  return <div>
    <h3 style={{ color: colors.ink, fontFamily: fonts.display, fontSize: "30px", fontWeight: 400, lineHeight: 1.3, margin: "0 0 16px" }}>{product.product_name}</h3>
    <p style={{ color: colors.muted, fontFamily: fonts.editorial, fontSize: "15px", lineHeight: 1.75, margin: "0 0 14px" }}>{product.connection_reason}</p>
    <p style={{ color: colors.muted, fontFamily: fonts.editorial, fontSize: "15px", lineHeight: 1.75, margin: 0 }}>{product.discovery_story}</p>
  </div>;
}

export function ProductStoryBlock({ layout, product }: ProductStoryBlockProps) {
  const imageFirst = layout === "image-first";
  return (
    <table data-editorial-component="ProductStoryBlock" data-layout={layout} data-product-id={product.product_id} role="presentation" width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: "64px" }}><tbody><tr>
      <td
        data-image-column={imageFirst ? "58%" : undefined}
        data-story-column={imageFirst ? undefined : "42%"}
        width={imageFirst ? "58%" : "42%"}
        valign="middle"
        style={{ paddingRight: "32px" }}
      >
        {imageFirst ? <EditorialImage alt={product.product_name} height={460} src={product.image_url} /> : <ProductStory product={product} />}
      </td>
      <td
        data-image-column={imageFirst ? undefined : "58%"}
        data-story-column={imageFirst ? "42%" : undefined}
        width={imageFirst ? "42%" : "58%"}
        valign="middle"
        style={{ paddingLeft: "32px" }}
      >
        {imageFirst ? <ProductStory product={product} /> : <EditorialImage alt={product.product_name} height={460} src={product.image_url} />}
      </td>
    </tr></tbody></table>
  );
}
