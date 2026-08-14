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
}: {
  product: Product;
  src?: string;
  /** defaults to the matching galleryAlt entry when src is a gallery photo */
  alt?: string;
  className?: string;
  sizes?: string;
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
      className={`object-cover ${className}`}
    />
  );
}
