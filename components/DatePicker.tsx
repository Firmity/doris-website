"use client";
import { useEffect, useRef, useState } from "react";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Local-calendar-date ISO string (yyyy-mm-dd), deliberately NOT
// `Date.toISOString()` — that converts to UTC first, which silently shifts
// the date by a day for anyone west of UTC in the evening. Every date in
// this component is a plain calendar day with no time/timezone component,
// so it's built and read back using local getters only.
function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseISODate(iso: string | undefined): Date | null {
  if (!iso) return null;
  const parts = iso.split("-").map(Number);
  const [y, m, d] = parts;
  if (!y || !m || !d) return null;
  const parsed = new Date(y, m - 1, d);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function formatDateDisplay(iso: string): string {
  const d = parseISODate(iso);
  if (!d) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

interface DatePickerProps {
  label: string;
  value: string; // ISO yyyy-mm-dd, or "" for unset
  onChange: (iso: string) => void;
  /** ISO yyyy-mm-dd — dates before this are disabled. Defaults to today. */
  minDate?: string;
  placeholder?: string;
  /**
   * Which edge of the trigger the popover hugs — grows rightward from the
   * left edge ("start", the default) or leftward from the right edge
   * ("end"). Matters on phones: two DatePickers side by side in a
   * grid-cols-2 (Check-in / Check-out) each get roughly half the form's
   * width, so a popover that's always left-anchored would push the
   * right-hand one's calendar past the edge of the screen. Pass "end" for
   * the right-hand picker in that layout.
   */
  align?: "start" | "end";
}

/**
 * A custom dropdown calendar — deliberately not `<input type="date">`. The
 * native date input's picker UI is entirely browser/OS-controlled (Chrome,
 * Safari, and mobile Android/iOS all render it differently, some quite
 * dated-looking) with zero styling hooks beyond the closed-state text. This
 * renders the trigger as a plain button (so there's no native picker to
 * fight) and draws its own popover calendar, giving full control over how
 * it looks and guaranteeing it's visually identical everywhere.
 */
export default function DatePicker({ label, value, onChange, minDate, placeholder = "Select date", align = "start" }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const min = startOfDay(parseISODate(minDate) ?? new Date());
  const selected = parseISODate(value);

  const [viewMonth, setViewMonth] = useState(() => {
    const base = selected ?? min;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  // Outside-click and Escape both close the popover — standard dropdown
  // behavior, and important on touch devices where there's no natural
  // "blur" the way there is with a native input.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const firstOfMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d));

  const today = startOfDay(new Date());
  const canGoPrevMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0) > min;

  return (
    <div className="relative" ref={rootRef}>
      <label className="text-xs tracking-wide uppercase text-muted block mb-2">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="w-full text-base sm:text-sm px-3.5 py-3 border border-line bg-white text-left flex items-center justify-between gap-2"
      >
        <span className={value ? "text-ink" : "text-muted"}>{value ? formatDateDisplay(value) : placeholder}</span>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.6} className="shrink-0 text-terracotta">
          <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
          <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={`${label} calendar`}
          // w-[min(280px,calc(100vw-3rem))] keeps the popover from ever
          // overflowing the viewport horizontally on narrow phone screens —
          // the #1 way a "responsive" calendar dropdown breaks on mobile.
          // align="end" (right-0 instead of the default left edge) is what
          // actually keeps it on-screen for a right-column trigger, though:
          // width alone only bounds the popover's own size, not where its
          // left edge lands relative to a button that's already near the
          // right side of a narrow viewport.
          className={`absolute z-30 mt-2 w-[min(280px,calc(100vw-3rem))] bg-white border border-line shadow-[0_12px_32px_rgba(36,31,26,0.16)] p-3.5 ${
            align === "end" ? "right-0" : "left-0"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
              disabled={!canGoPrevMonth}
              aria-label="Previous month"
              className="w-8 h-8 flex items-center justify-center text-ink disabled:text-line disabled:cursor-not-allowed hover:text-terracotta text-lg leading-none"
            >
              &#8249;
            </button>
            <div className="text-[13px] font-medium text-ink">
              {MONTH_LABELS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
            </div>
            <button
              type="button"
              onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
              aria-label="Next month"
              className="w-8 h-8 flex items-center justify-center text-ink hover:text-terracotta text-lg leading-none"
            >
              &#8250;
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-1 mb-1">
            {WEEKDAY_LABELS.map((w, i) => (
              <div key={i} className="text-[10px] text-center text-muted">{w}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const iso = toISODate(d);
              const disabled = d < min;
              const isSelected = selected != null && toISODate(selected) === iso;
              const isToday = toISODate(today) === iso;
              return (
                <button
                  key={iso}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                  }}
                  aria-label={d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  aria-current={isToday ? "date" : undefined}
                  className={[
                    "h-9 sm:h-8 text-[13px] sm:text-[12.5px] flex items-center justify-center mx-auto w-9 sm:w-8 transition-colors",
                    isSelected
                      ? "bg-terracotta text-cream"
                      : disabled
                        ? "text-line cursor-not-allowed"
                        : "text-ink hover:bg-sand",
                    isToday && !isSelected ? "border border-terracotta" : "",
                  ].join(" ")}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
