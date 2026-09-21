import { google } from "googleapis";

// Server-only client for logging funnel events to a Google Sheet. Separate
// from lib/ghl.ts: this is pure metrics logging, never a source of truth for
// booking or lead data, so every call here swallows its own errors and only
// console.errors. A Sheets outage must never block a submission or a
// booking the way a lost lead or a failed appointment would.
//
// Auth is a Google Cloud Service Account (not interactive OAuth), the
// backend-only equivalent of the GHL Private Integration Token used
// elsewhere in this app. Appends one row per event to the "Events" tab,
// joined by email; the "Leads" tab is a spreadsheet formula on top of that,
// not something this file needs to know about.

const SHEET_RANGE = "Events!A1";

interface SheetsConfig {
  clientEmail: string;
  privateKey: string;
  spreadsheetId: string;
}

function getSheetsConfig(): SheetsConfig | null {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    return null;
  }

  // Vercel (and most .env tooling) can't store a literal newline in an env
  // var value, so the private key is stored with escaped "\n" sequences
  // that need to become real newlines before the JWT signer can use it.
  return { clientEmail, privateKey: privateKey.replace(/\\n/g, "\n"), spreadsheetId };
}

async function appendRow(values: (string | number)[]): Promise<void> {
  const config = getSheetsConfig();
  if (!config) {
    console.warn("Google Sheets env vars are not set, skipping metrics log.");
    return;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: config.clientEmail, private_key: config.privateKey },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: config.spreadsheetId,
      range: SHEET_RANGE,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [values] },
    });
  } catch (err) {
    console.error("Failed to log event to Google Sheets", err);
  }
}

interface OptInCompletedEvent {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  utm: Record<string, string>;
  qualified: boolean;
  leadTier: string;
  chronologicalAge: number;
  healthAge: number;
  tierLabel: string;
}

export async function logOptInCompleted(event: OptInCompletedEvent): Promise<void> {
  await appendRow([
    new Date().toISOString(),
    "opt_in_completed",
    event.email,
    event.firstName,
    event.lastName,
    event.phone,
    event.utm.utm_source ?? "",
    event.utm.utm_medium ?? "",
    event.utm.utm_campaign ?? "",
    // Video slugs (e.g. "sep-11-2026") look exactly like a date to Sheets'
    // USER_ENTERED parser, which silently converts them to a date serial
    // instead of storing the literal text. A leading apostrophe forces it
    // to stay text, same as typing one manually in the UI.
    event.utm.utm_content ? `'${event.utm.utm_content}` : "",
    event.qualified ? "Y" : "N",
    event.leadTier,
    event.chronologicalAge,
    event.healthAge,
    event.tierLabel,
    "",
  ]);
}

export async function logLandingPageViewed(event: { utm: Record<string, string> }): Promise<void> {
  await appendRow([
    new Date().toISOString(),
    "landing_page_viewed",
    "",
    "",
    "",
    "",
    event.utm.utm_source ?? "",
    event.utm.utm_medium ?? "",
    event.utm.utm_campaign ?? "",
    // Same date-lookalike risk as opt_in_completed's utm_content below.
    event.utm.utm_content ? `'${event.utm.utm_content}` : "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
}

export async function logCalendarViewed(event: { email: string }): Promise<void> {
  await appendRow([
    new Date().toISOString(),
    "calendar_viewed",
    event.email,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
}

export async function logCalendarBooked(event: { email: string; startTime: string }): Promise<void> {
  await appendRow([
    new Date().toISOString(),
    "calendar_booked",
    event.email,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    event.startTime,
  ]);
}
