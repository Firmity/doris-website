import { NextResponse } from "next/server";
import { isMailerConfigured, sendGuestConfirmation, type EnquiryDetails } from "@/lib/mailer";
import { appendEnquiryRow } from "@/lib/sheets";
import { isRateLimited } from "@/lib/rateLimit";

// Both nodemailer (real TCP/TLS socket to Gmail) and google-auth-library's
// JWT signing (Node's crypto module) need APIs that only exist in the
// Node.js runtime, not the Edge runtime — must be pinned explicitly since
// App Router route handlers don't default to Node.js on every hosting
// target.
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

  // Google Sheets is the critical path — if this fails, the enquiry never
  // reached anyone, so the request is reported as failed and the client
  // falls back to mailto:. (Previously this was the Gmail SMTP send; that
  // moved to best-effort-only below since this Gmail account can't
  // generate App Passwords, making SMTP unusable as the primary path.)
  try {
    await appendEnquiryRow(validation.data);
  } catch (err) {
    console.error("[SHEETS_ERR] appending enquiry row failed:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { success: false, error: "[SHEETS_ERR] Failed to record enquiry" },
      { status: 502 }
    );
  }

  // Guest confirmation email is a nice-to-have, not the critical path — the
  // enquiry is already recorded in the sheet at this point regardless. Skip
  // cleanly (one log line) rather than attempt-and-fail on every request
  // when SMTP isn't configured, instead of throwing the same [CONFIG_ERR]
  // repeatedly.
  if (isMailerConfigured()) {
    try {
      await sendGuestConfirmation(validation.data);
    } catch (err) {
      console.error("[SMTP_ERR] guest confirmation failed:", err instanceof Error ? err.message : err);
    }
  } else {
    console.info("[SMTP_SKIP] guest confirmation skipped — EMAIL_APP_PASSWORD not configured");
  }

  return NextResponse.json({ success: true });
}
