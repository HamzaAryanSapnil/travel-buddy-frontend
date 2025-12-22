"use client";

import Image from "next/image";
import Link from "next/link";
import { PublicGalleryItem } from "@/services/media/getPublicGallery";

interface GalleryImageCardProps {
  image: PublicGalleryItem;
}

export default function GalleryImageCard({ image }: GalleryImageCardProps) {
  const altText = image.planTitle || image.destination || "Travel photo";
  const hasOverlay = image.planTitle || image.destination;

  // Base card structure
  const cardContent = (
    <div className="relative group overflow-hidden rounded-lg aspect-square bg-muted">
      <Image
        src={image.url}
        alt={altText}
        fill
        className="object-cover transition-transform duration-150 ease-out group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        unoptimized
      />
      {hasOverlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-out flex items-end p-3 md:p-4 pointer-events-none">
          <div className="text-white w-full">
            {image.planTitle && (
              <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                {image.planTitle}
              </h3>
            )}
            {image.destination && (
              <p className="text-xs text-gray-200 line-clamp-1">
                {image.destination}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (!image.planId) {
    return cardContent;
  }

  return (
    <Link
      href={`/travel-plans/${image.planId}`}
      className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
    >
      {cardContent}
    </Link>
  );
}

