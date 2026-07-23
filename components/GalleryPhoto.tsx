"use client";
import { useState } from "react";
import Image from "next/image";

/**
 * Zoomable gallery cell. Desktop: hover scales the image in (pure CSS, via
 * group-hover). Touch devices have no hover state, so tap toggles the same
 * scale via local state instead — first tap zooms in, second tap zooms back
 * out. overflow-hidden on the wrapper clips the scaled image to its own grid
 * cell so it never spills into neighboring cells.
 */
export default function GalleryPhoto({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [zoomed, setZoomed] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setZoomed((z) => !z)}
      aria-pressed={zoomed}
      aria-label={`${zoomed ? "Zoom out of" : "Zoom into"} ${alt}`}
      className={`group relative overflow-hidden border-none p-0 m-0 bg-transparent cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className={`object-cover transition-transform duration-500 ease-out group-hover:scale-110 ${
          zoomed ? "scale-125" : "scale-100"
        }`}
      />
    </button>
  );
}
