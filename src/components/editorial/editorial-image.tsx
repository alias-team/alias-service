import type { CSSProperties } from "react";

type EditorialImageProps = {
  alt: string;
  height: number;
  productId?: string;
  src: string;
};

export const PRODUCT_IMAGE_CARD_HEIGHT = 520;
export const PRODUCT_IMAGE_CARD_WIDTH = "58%";

const productImageIds = new Set([
  "82b1d35d-fe77-4d5d-a53a-fda086dbcb03",
  "cce8a3a1-a140-47a9-9268-d2d30f9f841a",
  "b6ea3afc-100d-468a-80d9-840168c217e5",
]);

const productImageFrameStyle = (height: number): CSSProperties => ({
  backgroundColor: "#fff",
  boxSizing: "border-box",
  display: "block",
  height: `${height}px`,
  overflow: "hidden",
  width: "100%",
});

const productImageStyle: CSSProperties = {
  backgroundColor: "#fff",
  boxSizing: "border-box",
  filter: "brightness(1.08) contrast(1.14)",
  objectFit: "contain",
  objectPosition: "center center",
  padding: 0,
  transform: "scale(1.06)",
  transformOrigin: "center center",
};

export function EditorialImage({ alt, height, productId, src }: EditorialImageProps) {
  const isProductImage = productId ? productImageIds.has(productId) : false;
  const image = (
    // Native image markup is intentional because this component targets email HTML.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      data-product-id={productId}
      height={height}
      src={src}
      width="100%"
      style={{ display: "block", height: `${height}px`, objectFit: "cover", width: "100%", ...(isProductImage ? productImageStyle : undefined) }}
    />
  );

  if (isProductImage) {
    return (
      <span data-editorial-element="ProductImageFrame" style={productImageFrameStyle(height)}>
        {image}
      </span>
    );
  }

  return image;
}
