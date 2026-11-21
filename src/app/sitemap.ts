import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "http://localhost:3000";
  return [
    { url: `${base}/` },
    { url: `${base}/travel-plans` },
    { url: `${base}/about` },
    { url: `${base}/contact` },
  ];
}