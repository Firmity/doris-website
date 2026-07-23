import { shuffledIllustrations } from "@/lib/illustrations";

/**
 * "Grass" hover effect for CTA buttons — a handful of illustrations sprout
 * up from the bottom edge on hover/press instead of the old drop-shadow glow
 * (see .cta-btn:hover in globals.css, which no longer sets box-shadow — this
 * *is* the hover feedback now). Pure CSS animation (opacity + scaleY, driven
 * by .cta-btn:hover/:active/:focus-visible), this component only supplies
 * the markup: one absolutely-positioned wrapper (z-index 1, so it renders
 * behind the button's label — see the `<span>` z-index: 2 wrapping every
 * CTA's text) containing `count` small illustration "blades" at staggered
 * left offsets and animation delays.
 *
 * `seed` picks which illustrations sprout via the same deterministic shuffle
 * used for page-section accents (lib/illustrations.ts) — different buttons
 * get a different-looking trio, but the same button always gets the same
 * trio on every render (no flicker/hydration mismatch from real randomness).
 * This is a Server Component (no "use client", no state/effects needed) so
 * it costs nothing at runtime beyond the markup itself.
 */
export default function CtaBloom({ seed, count = 3 }: { seed: string; count?: number }) {
  const names = shuffledIllustrations(seed).slice(0, count);
  // Spread blades across the button width with a little jitter per seed so
  // rows of identical buttons (e.g. repeated "Enquire" links) don't all
  // sprout in visually identical spots.
  const positions = ["18%", "50%", "82%"];

  return (
    <span className="cta-bloom" aria-hidden="true">
      {names.map((name, i) => (
        <img
          key={name}
          src={`/assets/photos/optimized/illustrations/${name}.png`}
          alt=""
          className="cta-bloom__blade"
          style={{
            left: positions[i % positions.length],
            transitionDelay: `${i * 70}ms`,
          }}
        />
      ))}
    </span>
  );
}
