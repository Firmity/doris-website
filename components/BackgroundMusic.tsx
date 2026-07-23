"use client";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "doris-music-muted";
const DEFAULT_VOLUME = 0.58; // gentle/low per the brief — this is on top of the track already being mixed quiet

/**
 * Loops a soft ambient piano track behind the whole site. Two hard
 * constraints from browsers/accessibility drove the shape of this:
 *
 * 1. Autoplay-with-sound is blocked by every major browser until the visitor
 *    has interacted with the page — there's no way around that from app
 *    code. So this tries `play()` on mount (works in browsers/sessions where
 *    the policy allows it), and if that promise rejects, it falls back to
 *    starting on the guest's very first click/tap/keypress anywhere on the
 *    site. Net effect: music starts the instant the browser will allow it,
 *    which in practice is either immediately or on first interaction.
 * 2. WCAG 1.4.2 requires that audio playing automatically for more than 3
 *    seconds have a visible control to pause/stop it, independent of the
 *    OS/hardware volume control — auto-playing audio with no way to kill it
 *    is an accessibility failure, not just an annoyance. Hence the toggle
 *    button this component also renders, and why mute state is persisted
 *    (localStorage) so a guest who mutes it once doesn't have to re-mute it
 *    on every page navigation — this component lives in layout.tsx outside
 *    PageTransition specifically so it's never unmounted/remounted on route
 *    changes (same reasoning as Nav/Footer).
 */
export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(true); // starts true until we know better, so the icon never flashes the wrong state
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const startMuted = stored === "true";
    setMuted(startMuted);
    setReady(true);

    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = DEFAULT_VOLUME;
    if (startMuted) return;

    const tryPlay = () => audio.play().catch(() => {
      // Blocked by autoplay policy — wait for the first real user gesture.
      // `touchend` is included alongside `pointerdown`/`keydown` specifically
      // for iOS Safari/Chrome-iOS: their audio-unlock heuristic historically
      // keys off a discrete touch gesture rather than pointerdown, so relying
      // on pointerdown alone left the very first tap on a phone silently
      // failing to unlock playback on some iOS versions.
      const start = () => {
        audio.play().catch(() => undefined);
        cleanup();
      };
      const cleanup = () => {
        window.removeEventListener("pointerdown", start);
        window.removeEventListener("keydown", start);
        window.removeEventListener("touchend", start);
      };
      window.addEventListener("pointerdown", start, { once: true });
      window.addEventListener("keydown", start, { once: true });
      window.addEventListener("touchend", start, { once: true, passive: true });
    });
    tryPlay();
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    const next = !muted;
    setMuted(next);
    localStorage.setItem(STORAGE_KEY, String(next));
    if (!audio) return;
    if (next) {
      audio.pause();
    } else {
      audio.play().catch(() => undefined);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/assets/audio/ambient-piano.mp3" loop preload="auto" />
      <button
        type="button"
        onClick={toggle}
        aria-label={muted ? "Play background music" : "Pause background music"}
        aria-pressed={!muted}
        title={muted ? "Play background music" : "Pause background music"}
        className={`fixed bottom-5 right-5 z-[250] flex items-center justify-center w-11 h-11 rounded-full border border-line bg-cream/90 backdrop-blur-sm text-ink shadow-[0_6px_20px_rgba(36,31,26,0.16)] transition-colors duration-300 hover:bg-terracotta hover:text-cream hover:border-terracotta ${
          ready ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {muted ? (
          // Note with a slash — muted state
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 17V5.5L19 3v10.5" />
            <circle cx="6.5" cy="17" r="2.5" />
            <circle cx="16.5" cy="14.5" r="2.5" />
            <path d="M3 3l18 18" />
          </svg>
        ) : (
          // Plain note with soft soundwave lines — playing state
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 17V5.5L19 3v10.5" />
            <circle cx="6.5" cy="17" r="2.5" />
            <circle cx="16.5" cy="14.5" r="2.5" />
          </svg>
        )}
      </button>
    </>
  );
}
