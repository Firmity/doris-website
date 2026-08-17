"use client";
import { useState, type FormEvent } from "react";
import CtaBloom from "@/components/CtaBloom";
import DatePicker, { formatDateDisplay } from "@/components/DatePicker";

const ENQUIRY_EMAIL = "dorismbhotel@gmail.com";

type Status = "idle" | "sending" | "sent" | "fallback" | "error";

/**
 * Turns the two ISO date-picker values into the single human-readable
 * string the backend still expects (EnquiryDetails.dates, unchanged — see
 * lib/mailer.ts / lib/sheets.ts). Keeping the wire format as one string
 * means the check-in/check-out UI split is purely a frontend concern; the
 * API route, Sheets row, and confirmation email didn't need to change.
 */
function formatDateRange(checkIn: string, checkOut: string): string {
  if (checkIn && checkOut) return `${formatDateDisplay(checkIn)} → ${formatDateDisplay(checkOut)}`;
  if (checkIn) return `Check-in ${formatDateDisplay(checkIn)}`;
  if (checkOut) return `Check-out ${formatDateDisplay(checkOut)}`;
  return "";
}

/**
 * Submits to /api/enquire (Next.js route handler -> nodemailer -> Gmail SMTP,
 * see lib/mailer.ts), which emails the hotel and sends the guest a
 * confirmation copy. If that request fails for any reason (network down,
 * SMTP misconfigured, server error), this falls back to the old mailto:
 * behavior so the enquiry still has a path to reach the hotel instead of
 * just vanishing with a generic error.
 *
 * `website` is a honeypot: a real guest never sees or fills this field
 * (visually hidden below, and never announced to screen readers), but a bot
 * that blindly fills every input on the page usually does. The API route
 * silently rejects the submission if it's non-empty.
 */
export default function EnquiryForm() {
  const [form, setForm] = useState({ name: "", email: "", checkIn: "", checkOut: "", message: "", website: "" });
  const [status, setStatus] = useState<Status>("idle");

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const datesLabel = formatDateRange(form.checkIn, form.checkOut);

  const openMailtoFallback = () => {
    const subject = `Enquiry from ${form.name || "website"}`;
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Dates: ${datesLabel || "—"}`,
      "",
      form.message,
    ].join("\n");
    window.location.href = `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return; // guards against double-submit while a request is in flight
    setStatus("sending");

    try {
      const res = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Wire format is unchanged (name/email/dates/message/website) — the
        // API route, Sheets row, and confirmation email all still just see
        // a single `dates` string, per formatDateRange() above.
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          dates: datesLabel,
          message: form.message,
          website: form.website,
        }),
      });

      if (!res.ok) {
        // Server reached us but rejected/failed the send (bad input, SMTP
        // down, rate-limited, etc.) — still worth a real path to the hotel.
        openMailtoFallback();
        setStatus("fallback");
        return;
      }

      setStatus("sent");
    } catch (err) {
      // Network-level failure (offline, DNS, CORS, etc.) — request never
      // reached the server at all.
      console.error("[NETWORK_ERR] enquiry submission failed:", err instanceof Error ? err.message : err);
      openMailtoFallback();
      setStatus("fallback");
    }
  };

  return (
    <form className="relative z-10 flex flex-col gap-5" onSubmit={handleSubmit}>
      <div>
        <label className="text-xs tracking-wide uppercase text-muted block mb-2">Name</label>
        <input
          type="text"
          required
          placeholder="Your name"
          value={form.name}
          onChange={update("name")}
          className="w-full text-base sm:text-sm px-3.5 py-3 border border-line bg-white text-ink"
        />
      </div>
      <div>
        <label className="text-xs tracking-wide uppercase text-muted block mb-2">Email</label>
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChange={update("email")}
          className="w-full text-base sm:text-sm px-3.5 py-3 border border-line bg-white text-ink"
        />
      </div>
      {/* grid-cols-2 even on mobile (not stacked) — two half-width fields
          side by side reads clearly as a "from / to" pair at any width, and
          each popover calendar below still has its own
          calc(100vw-3rem) clamp so it never overflows the viewport. */}
      <div className="grid grid-cols-2 gap-3">
        <DatePicker
          label="Check-in"
          value={form.checkIn}
          onChange={(iso) =>
            setForm((f) => ({
              ...f,
              checkIn: iso,
              // Clear an already-picked check-out if it's now before the
              // newly-picked check-in, instead of silently leaving an
              // invalid (checkOut < checkIn) pair sitting in state.
              checkOut: f.checkOut && f.checkOut < iso ? "" : f.checkOut,
            }))
          }
          placeholder="Select date"
        />
        <DatePicker
          label="Check-out"
          value={form.checkOut}
          onChange={(iso) => setForm((f) => ({ ...f, checkOut: iso }))}
          minDate={form.checkIn || undefined}
          placeholder="Select date"
          align="end"
        />
      </div>
      <div>
        <label className="text-xs tracking-wide uppercase text-muted block mb-2">Message</label>
        <textarea
          rows={5}
          placeholder="Tell us about your stay"
          value={form.message}
          onChange={update("message")}
          className="w-full text-base sm:text-sm px-3.5 py-3 border border-line bg-white text-ink"
        />
      </div>

      {/* Honeypot — real guests never see this (off-screen, not just
          opacity-0/display:none, since some bots skip fields hidden that
          way) and it's not reachable by keyboard tab order or announced to
          screen readers, so it never interferes with real form use. */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={update("website")}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] w-px h-px overflow-hidden"
      />

      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-terracotta cta-btn text-cream text-[13px] tracking-wide uppercase px-6 py-4 border-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <CtaBloom seed="enquiry-form-submit" />
        <span>{status === "sending" ? "Sending…" : "Send Enquiry"}</span>
      </button>

      {status === "sent" && (
        <p className="text-[13px] text-muted" role="status">
          Thanks — your enquiry has been sent, and a confirmation is on its way to your email.
        </p>
      )}
      {status === "fallback" && (
        <p className="text-[13px] text-muted" role="status">
          We couldn't reach our server just now, so we've opened your email app with this enquiry
          pre-filled instead — just hit send there to reach us.
        </p>
      )}
    </form>
  );
}
