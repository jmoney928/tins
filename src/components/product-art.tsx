import Image from "next/image";
import { IceCore } from "./ice-core";
import type { Product } from "@/lib/catalog";

/** Photograph where we have one, drawn art where we do not. */
export function ProductArt({
  product,
  src,
  alt,
  className = "",
  sizes,
  onLoad,
}: {
  product: Product;
  src?: string;
  /** defaults to the matching galleryAlt entry when src is a gallery photo */
  alt?: string;
  className?: string;
  sizes?: string;
  /** fires once the photograph has decoded — the gallery crossfades on it */
  onLoad?: () => void;
}) {
  const file = src ?? product.image;

  if (!file) {
    return (
      <div className={`grid place-items-center bg-ice-100/60 ${className}`}>
        <IceCore scope={`art-${product.id}`} className="w-[68%]" />
      </div>
    );
  }

  const resolvedAlt =
    alt ?? product.galleryAlt[product.gallery.indexOf(file)] ?? product.name;

  return (
    <Image
      src={file}
      alt={resolvedAlt}
      width={1000}
      height={1000}
      sizes={sizes}
      onLoad={onLoad}
      className={`object-cover ${className}`}
    />
  );
}
