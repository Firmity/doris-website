import type { Metadata } from "next";

const SITE_NAME = "Doris Mountain Boutique Hotel";
const DEFAULT_IMAGE = "/assets/photos/optimized/deluxe.jpg";

/**
 * Builds a per-page Metadata object (title, description, canonical URL,
 * OpenGraph, Twitter card) from a handful of inputs instead of every page
 * hand-rolling the same OpenGraph/Twitter boilerplate. Every route passes
 * its own title/description/path here — nothing site-wide gets reused
 * across pages except the brand name suffix (via layout.tsx's title
 * template) and the fallback share image.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: path,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630 }],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [image],
    },
  };
}
