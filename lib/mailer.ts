import nodemailer, { type Transporter } from "nodemailer";

export interface EnquiryDetails {
  name: string;
  email: string;
  dates: string;
  message: string;
}

// Single cached transporter per server instance (module-level, survives
// across requests in the same process) — nodemailer pools connections
// internally, so re-creating a transporter per request would just discard
// that pooling for no benefit. On serverless platforms each cold-started
// instance builds its own, which is fine: SMTP connection setup is cheap
// relative to the request itself.
let transporter: Transporter | null = null;

/**
 * Cheap, side-effect-free check for whether SMTP is even worth attempting —
 * same shape validation as getTransporter() below, but returns a boolean
 * instead of throwing. Google Sheets (lib/sheets.ts) is now the critical
 * path for an enquiry actually reaching the hotel; this lets the guest-
 * confirmation email stay purely best-effort and skip itself cleanly (one
 * log line, no stack trace) when SMTP isn't configured, instead of throwing
 * the same [CONFIG_ERR] on every single request.
 */
export function isMailerConfigured(): boolean {
  const user = process.env.EMAIL_USER;
  const rawPass = process.env.EMAIL_APP_PASSWORD;
  if (!user || !rawPass) return false;
  return /^[a-zA-Z]{16}$/.test(rawPass.replace(/\s+/g, ""));
}

function getTransporter(): Transporter {
  if (transporter) return transporter;

  const user = process.env.EMAIL_USER;
  const rawPass = process.env.EMAIL_APP_PASSWORD;
  if (!user || !rawPass) {
    // Thrown, not silently defaulted — a misconfigured deployment should
    // fail loudly on the first real request rather than pretend to send.
    throw new Error("[CONFIG_ERR] EMAIL_USER / EMAIL_APP_PASSWORD env vars are not set");
  }

  // Google generates App Passwords as 16 lowercase letters (shown with
  // spaces for readability, e.g. "abcd efgh ijkl mnop" — the spaces are
  // cosmetic, so they're stripped here). A *regular* Gmail account password
  // never matches that shape (mixed case, digits, symbols), so this check
  // catches the single most common misconfiguration — someone pastes their
  // real Google login password here instead of a generated App Password —
  // at startup with a specific, actionable message, instead of only finding
  // out via Gmail's opaque "535 Invalid login" SMTP error at send time.
  const pass = rawPass.replace(/\s+/g, "");
  if (!/^[a-zA-Z]{16}$/.test(pass)) {
    throw new Error(
      "[CONFIG_ERR] EMAIL_APP_PASSWORD doesn't look like a Gmail App Password " +
        "(expected 16 letters, e.g. from https://myaccount.google.com/apppasswords). " +
        "This looks like it might be the account's regular login password instead — " +
        "that will never authenticate over SMTP. Generate a real App Password (requires " +
        "2-Step Verification to be turned on first) and replace EMAIL_APP_PASSWORD with it."
    );
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  return transporter;
}

/**
 * Sends the enquiry to the hotel's own inbox. `replyTo` is set to the guest's
 * address, not the hotel's — so a staffer hitting "Reply" in Gmail lands in
 * the guest's inbox directly instead of replying to dorismbhotel@gmail.com.
 */
export async function sendHotelNotification(details: EnquiryDetails): Promise<void> {
  const hotelInbox = process.env.EMAIL_USER as string;
  await getTransporter().sendMail({
    from: `"Doris Website" <${hotelInbox}>`,
    to: hotelInbox,
    replyTo: details.email,
    subject: `Enquiry from ${details.name}`,
    text: [
      `Name: ${details.name}`,
      `Email: ${details.email}`,
      `Dates: ${details.dates || "—"}`,
      "",
      details.message || "(no message)",
    ].join("\n"),
  });
}

/**
 * Best-effort confirmation copy to the guest. Callers should treat failures
 * here as non-fatal — the hotel notification above is the part that actually
 * matters, this is a nice-to-have receipt.
 */
export async function sendGuestConfirmation(details: EnquiryDetails): Promise<void> {
  const hotelInbox = process.env.EMAIL_USER as string;
  await getTransporter().sendMail({
    from: `"Doris Mountain Boutique Hotel" <${hotelInbox}>`,
    to: details.email,
    subject: "We've received your enquiry — Doris Mountain Boutique Hotel",
    text: [
      `Hi ${details.name},`,
      "",
      "Thanks for reaching out to Doris Mountain Boutique Hotel. We've received your enquiry and will get back to you shortly.",
      "",
      `Dates: ${details.dates || "—"}`,
      details.message ? `Your message: ${details.message}` : "",
      "",
      "— Doris Mountain Boutique Hotel",
      "Vill. Shivnagar, Post Office Garoh, Opp. Rana Himalayan Tyres, Dharamshala, District Kangra – 176217, Himachal Pradesh",
    ]
      .filter(Boolean)
      .join("\n"),
  });
}
