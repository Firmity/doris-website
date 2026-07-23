"use client";
import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], input, textarea, select, label[for], summary";

// Trailing/lag feel — the dot eases toward the pointer instead of snapping to
// it. Lower = floatier/more lag, higher = snappier/closer to instant. 0.15
// reads as a soft, deliberate trail without feeling laggy/unresponsive.
const EASING = 0.15;

/**
 * Replaces the OS cursor with the flower bloom used for decorative accents
 * (public/assets/cursor/cursor-flower-32.png). Requirement was specific: the
 * flower should get *more vivid* on hover, not swap to a pointer/hand — so
 * this can't be a plain CSS `cursor: url()` (static bitmap, no hover state,
 * no trailing motion either). Instead: a fixed <img> whose position is
 * eased toward the real pointer position every animation frame, plus a
 * delegated hover listener that toggles a CSS class controlling `filter`
 * (saturate/brightness/glow) — never `cursor`.
 *
 * Two refs, not React state: `target` is the real pointer position (updated
 * on every pointermove), `current` is where the dot is actually drawn this
 * frame, eased a fraction of the way toward `target` each tick. A single
 * requestAnimationFrame loop runs continuously (not just on pointermove) so
 * the easing keeps animating in between move events until it catches up —
 * that's what produces the trail. Writing to el.style directly instead of
 * React state, since this updates ~60x/sec and has no other reason to
 * re-render.
 *
 * Native cursor is only hidden (`.has-custom-cursor` on <html>) after
 * confirming `(pointer: fine)` — touch/coarse-pointer devices never get this
 * component's effects and keep their normal (non-)cursor behavior untouched.
 * If matchMedia or the effect never runs for any reason, the native cursor
 * is simply never hidden — there's no failure mode where a guest ends up
 * with literally no visible cursor.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLImageElement>(null);
  const rafId = useRef<number | undefined>(undefined);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const primed = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const el = dotRef.current;
    if (!el) return;

    document.documentElement.classList.add("has-custom-cursor");

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * EASING;
      current.current.y += (target.current.y - current.current.y) * EASING;
      el.style.transform = `translate3d(${current.current.x - 16}px, ${current.current.y - 16}px, 0)`;
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    const onPointerMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!primed.current) {
        // First move after mount/page-load: snap instantly instead of
        // easing in all the way from (0,0), which would otherwise look like
        // the flower flying in from the corner of the screen.
        current.current = { x: e.clientX, y: e.clientY };
        primed.current = true;
      }
      el.style.opacity = "1";
    };
    const onPointerOver = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest?.(INTERACTIVE_SELECTOR)) {
        el.classList.add("cursor-vivid");
      }
    };
    const onPointerOut = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest?.(INTERACTIVE_SELECTOR)) {
        el.classList.remove("cursor-vivid");
      }
    };
    const onLeaveWindow = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    document.addEventListener("mouseleave", onLeaveWindow);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("mouseleave", onLeaveWindow);
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <img
      ref={dotRef}
      src="/assets/cursor/cursor-flower-32.png"
      alt=""
      aria-hidden="true"
      className="cursor-dot"
      style={{ opacity: 0 }}
    />
  );
}
