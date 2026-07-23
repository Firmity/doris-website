"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Horizontal scroll-snap strip with real affordances instead of a bare
 * overflow-x div. Why the original was "buggy on desktop": a mouse wheel
 * doesn't scroll a horizontal container by default (needs shift+wheel, which
 * ~nobody knows), and with the scrollbar hidden there was zero visual hint
 * that the row even continued off-screen. Fix is three-layered:
 *   1. Visible prev/next arrow buttons that scroll by one card width.
 *   2. Click-and-drag scrolling for mouse users (guarded to pointerType
 *      "mouse" only — touch keeps its native momentum-scroll untouched, so
 *      phones are unaffected and stay smooth).
 *   3. Arrow disabled state at each end so it's obvious when you've reached
 *      the edge instead of the buttons silently doing nothing.
 * Touch devices never relied on the wheel/hover affordances in the first
 * place — native swipe already worked there, so this only adds capability,
 * nothing to regress.
 */
export default function Carousel({
  children,
  className = "",
  itemSelector = "[data-carousel-item]",
}: {
  children: React.ReactNode;
  className?: string;
  itemSelector?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const dragState = useRef<{ down: boolean; startX: number; startScroll: number }>({
    down: false,
    startX: 0,
    startScroll: 0,
  });

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => updateArrows();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(itemSelector);
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = scrollerRef.current;
    if (!el) return;
    dragState.current = { down: true, startX: e.clientX, startScroll: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !dragState.current.down) return;
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = dragState.current.startScroll - (e.clientX - dragState.current.startX);
  };
  const endDrag = () => {
    dragState.current.down = false;
  };

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        className={`scrollx cursor-default md:cursor-grab active:md:cursor-grabbing select-none ${className}`}
      >
        {children}
      </div>

      <button
        type="button"
        aria-label="Previous"
        onClick={() => scrollByCard(-1)}
        disabled={!canPrev}
        className="hidden md:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-cream border border-line text-ink shadow-[0_8px_20px_rgba(36,31,26,0.15)] transition-all duration-300 hover:bg-terracotta hover:text-cream hover:border-terracotta disabled:opacity-0 disabled:pointer-events-none"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => scrollByCard(1)}
        disabled={!canNext}
        className="hidden md:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-cream border border-line text-ink shadow-[0_8px_20px_rgba(36,31,26,0.15)] transition-all duration-300 hover:bg-terracotta hover:text-cream hover:border-terracotta disabled:opacity-0 disabled:pointer-events-none"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
