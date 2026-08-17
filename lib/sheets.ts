import { JWT } from "google-auth-library";
import type { EnquiryDetails } from "@/lib/mailer";

// Read-write to a single spreadsheet is all this needs — never request a
// broader scope than the operation actually performs.
const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

// Every new row is appended starting at column A of this tab. If the sheet
// doesn't have a tab literally named "Enquiries", the Sheets API 404s with a
// clear "Unable to parse range" error — the fix is renaming the tab, not
// touching this code.
const SHEET_RANGE = "Enquiries!A:E";

// Cached per server instance, same reasoning as the mailer's transporter:
// building a JWT client is cheap but pointless to redo per request, and the
// underlying google-auth-library client already caches/refreshes the access
// token internally across calls.
let jwtClient: JWT | null = null;

function getJwtClient(): JWT {
  if (jwtClient) return jwtClient;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !rawKey) {
    throw new Error(
      "[CONFIG_ERR] GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY env vars are not set"
    );
  }

  // The private key is a multi-line PEM block. Env files and dashboard
  // "paste a value" UIs (Vercel included) can't reliably hold real newlines,
  // so the convention is to store it with literal "\n" escape sequences and
  // un-escape here at runtime. Skipping this is the #1 cause of JWT signing
  // failing with an opaque `error:1E08010C:DECODER routines` from Node's
  // crypto module — the key parses as garbage without real line breaks.
  const privateKey = rawKey.replace(/\\n/g, "\n");

  jwtClient = new JWT({
    email,
    key: privateKey,
    scopes: [SHEETS_SCOPE],
  });
  return jwtClient;
}

/**
 * Appends one enquiry as a new row: [timestamp, name, email, dates, message].
 * This is the critical path replacing SMTP as the primary place an enquiry
 * lands — the Sheets API errors loudly (via the thrown exception, caught by
 * the route handler) on bad credentials, a missing/unshared sheet, or a
 * missing "Enquiries" tab, rather than silently dropping the submission.
 *
 * Setup required once, outside this code (Google Cloud Console + the sheet
 * itself) — see .env.example for the full walkthrough:
 * 1. Create a GCP service account, enable the Sheets API for its project.
 * 2. Generate a JSON key for it; copy its `client_email` and `private_key`.
 * 3. Share the destination Google Sheet with that `client_email` as Editor
 *    — service accounts have no access of their own, only what's shared.
 * 4. Make sure the sheet has a tab named exactly "Enquiries".
 */
export async function appendEnquiryRow(details: EnquiryDetails): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    throw new Error("[CONFIG_ERR] GOOGLE_SHEET_ID env var is not set");
  }

  const client = getJwtClient();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
    SHEET_RANGE
  )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const row = [
    new Date().toISOString(),
    details.name,
    details.email,
    details.dates || "",
    details.message || "",
  ];

  // client.request throws (via gaxios) on any non-2xx response, including
  // 403 (sheet not shared with the service account) and 404 (bad sheet ID
  // or missing tab) — the route handler's existing try/catch around this
  // call already turns that into a proper 502 for the client.
  await client.request({
    url,
    method: "POST",
    data: { values: [row] },
  });
}
