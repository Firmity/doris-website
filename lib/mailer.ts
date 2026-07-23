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

function getTransporter(): Transporter {
  if (transporter) return transporter;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD;
  if (!user || !pass) {
    // Thrown, not silently defaulted — a misconfigured deployment should
    // fail loudly on the first real request rather than pretend to send.
    throw new Error("[CONFIG_ERR] EMAIL_USER / EMAIL_APP_PASSWORD env vars are not set");
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
