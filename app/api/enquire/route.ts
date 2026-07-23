import { NextResponse } from "next/server";
import { sendGuestConfirmation, sendHotelNotification, type EnquiryDetails } from "@/lib/mailer";
import { isRateLimited } from "@/lib/rateLimit";

// nodemailer opens a real TCP/TLS socket to Gmail's SMTP servers — that API
// is only available in the Node.js runtime, not the Edge runtime, so this
// must be pinned explicitly (App Router route handlers don't default to
// Node.js on every hosting target).
export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ValidationResult =
  | { ok: true; data: EnquiryDetails }
  | { ok: false; error: string };

/**
 * Input validation, isolated from the route handler so it stays unit-testable
 * without needing a mock Request/NextResponse. Also doubles as the honeypot
 * check: `website` is a hidden field real guests never see or fill (rendered
 * off-screen in EnquiryForm) — bots that blindly fill every input trip it,
 * humans never do.
 */
function validate(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Invalid request body" };
  }
  const { name, email, dates, message, website } = body as Record<string, unknown>;

  if (typeof website === "string" && website.trim() !== "") {
    return { ok: false, error: "Rejected" };
  }
  if (typeof name !== "string" || !name.trim()) {
    return { ok: false, error: "Name is required" };
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return { ok: false, error: "A valid email is required" };
  }

  return {
    ok: true,
    data: {
      name: name.trim().slice(0, 200),
      email: email.trim().slice(0, 200),
      dates: typeof dates === "string" ? dates.trim().slice(0, 200) : "",
      message: typeof message === "string" ? message.trim().slice(0, 4000) : "",
    },
  };
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "[RATE_LIMITED] Too many enquiries — please try again later" },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "[INVALID_INPUT] Malformed request body" },
      { status: 400 }
    );
  }

  const validation = validate(body);
  if (!validation.ok) {
    return NextResponse.json(
      { success: false, error: `[INVALID_INPUT] ${validation.error}` },
      { status: 400 }
    );
  }

  // Hotel notification is the critical path — if this fails, the enquiry
  // never reached anyone, so the request is reported as failed and the
  // client falls back to mailto:.
  try {
    await sendHotelNotification(validation.data);
  } catch (err) {
    console.error("[SMTP_ERR] hotel notification failed:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { success: false, error: "[SMTP_ERR] Failed to send enquiry" },
      { status: 502 }
    );
  }

  // Guest confirmation is a nice-to-have, not the critical path — the hotel
  // already has the enquiry at this point regardless, so a failure here is
  // logged but doesn't turn the whole request into a failure for the guest.
  try {
    await sendGuestConfirmation(validation.data);
  } catch (err) {
    console.error("[SMTP_ERR] guest confirmation failed:", err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ success: true });
}
