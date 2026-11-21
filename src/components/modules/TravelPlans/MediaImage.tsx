"use client";

import AppImage from "@/components/shared/AppImage";
import { cn } from "@/lib/utils";

interface MediaImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

const MediaImage = ({
  src,
  alt,
  className,
  fallbackSrc = "https://placehold.co/600x400/png?text=Photo",
}: MediaImageProps) => {
  const safeSrc = src || fallbackSrc;

  return (
    <AppImage
      src={safeSrc}
      alt={alt}
      fill
      className={cn("object-cover", className)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onError={(e) => {
        console.error("Image load error:", safeSrc);
        e.currentTarget.style.display = "none";
      }}
    />
  );
};

export default MediaImage;

