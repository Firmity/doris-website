/**
 * Purely decorative botanical accent — one of the 12 cropped illustrations.
 * Always aria-hidden + pointer-events-none (it must never be mistaken for
 * content or steal a tap on mobile), and always rendered below full opacity
 * via the `opacity` prop so it stays a background texture, never a hard
 * graphic competing with real content or text for attention.
 *
 * OPACITY CONTROL — one place for the whole site:
 * `DEFAULT_ILLUSTRATION_OPACITY` below is what every <Illustration /> call
 * uses unless it explicitly passes its own `opacity` prop. Almost every page
 * accent in app/**\/page.tsx relies on this default — change the number here
 * and every one of them gets lighter/darker at once. A few call sites (the
 * Nav bar accent that fades in with scroll, and the 4 illustrations stacked
 * behind the mobile hamburger menu) pass an explicit opacity instead, because
 * those are either state-driven or deliberately dimmer since multiple
 * illustrations overlap there — search for `opacity={` in components/Nav.tsx
 * to tune those two spots separately.
 */
export const DEFAULT_ILLUSTRATION_OPACITY = 0.78;

const ILLUSTRATIONS = [
  "fern-1", "fern-2", "wildflower-spray", "wildflower-bouquet",
  "petals-scattered", "leaf-sprig", "pink-flower", "babys-breath",
  "eucalyptus", "lavender", "hydrangea", "cherry-blossom",
] as const;

export type IllustrationName = (typeof ILLUSTRATIONS)[number];

export default function Illustration({
  name,
  className = "",
  opacity = DEFAULT_ILLUSTRATION_OPACITY,
}: {
  name: IllustrationName;
  className?: string;
  opacity?: number;
}) {
  return (
    <img
      src={`/assets/photos/optimized/illustrations/${name}.png`}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none select-none transition-opacity duration-300 ease-out ${className}`}
      style={{ opacity }}
    />
  );
}
