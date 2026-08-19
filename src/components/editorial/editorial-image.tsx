type EditorialImageProps = {
  alt: string;
  height: number;
  src: string;
};

export function EditorialImage({ alt, height, src }: EditorialImageProps) {
  return (
    // Native image markup is intentional because this component targets email HTML.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      height={height}
      src={src}
      width="100%"
      style={{ display: "block", height: "auto", width: "100%" }}
    />
  );
}
