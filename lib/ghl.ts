// Server-only client for GoHighLevel's Calendars/Contacts API. Single source
// of truth for every GHL call related to booking; the booking API routes
// only ever call bookSlot() or getFreeSlots() below, never raw fetches.
// Separate from the lead webhook in submit-assessment/route.ts, which stays
// independent so booking a call is never a precondition for the initial
// lead notification.

const GHL_BASE_URL = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-04-15";

export class GhlConfigError extends Error {}

export class GhlSlotUnavailableError extends Error {}

export class GhlApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

interface GhlConfig {
  apiToken: string;
  locationId: string;
  calendarId: string;
  durationMinutes: number;
}

// Read at call time, not import time, so a missing env var surfaces as a
// clear error on the specific request that needed it instead of breaking
// the build or every route in the file.
function getGhlConfig(): GhlConfig {
  const apiToken = process.env.GHL_API_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  const calendarId = process.env.GHL_CALENDAR_ID;
  const durationMinutes = Number(process.env.GHL_APPOINTMENT_DURATION_MINUTES ?? "15");

  if (!apiToken || !locationId || !calendarId) {
    throw new GhlConfigError("Missing GHL_API_TOKEN, GHL_LOCATION_ID, or GHL_CALENDAR_ID");
  }
  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    throw new GhlConfigError("GHL_APPOINTMENT_DURATION_MINUTES must be a positive number");
  }

  return { apiToken, locationId, calendarId, durationMinutes };
}

function ghlFetch(path: string, init: RequestInit, apiToken: string): Promise<Response> {
  return fetch(`${GHL_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiToken}`,
      Version: GHL_API_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...init.headers,
    },
  });
}

// Shared by the slots API route (to label each slot with its end time) and
// bookSlot (to know what to actually book), so the duration is only ever
// read from env in one place.
export function computeEndTime(startTimeIso: string): string {
  const { durationMinutes } = getGhlConfig();
  return new Date(new Date(startTimeIso).getTime() + durationMinutes * 60_000).toISOString();
}

export interface FreeSlotsByDate {
  [date: string]: { slots: string[] };
}

// Read-only and safe to call anytime, including directly against production
// for verification, since it creates nothing.
export async function getFreeSlots(
  startMs: number,
  endMs: number,
  timezone: string
): Promise<FreeSlotsByDate> {
  const { apiToken, calendarId } = getGhlConfig();
  const params = new URLSearchParams({
    startDate: String(startMs),
    endDate: String(endMs),
    timezone,
  });

  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await ghlFetch(
        `/calendars/${calendarId}/free-slots?${params.toString()}`,
        { method: "GET" },
        apiToken
      );
      if (res.ok) {
        const raw = (await res.json()) as Record<string, unknown>;
        // The response includes a trailing "traceId" string alongside the
        // per-date entries; keep only entries that actually look like
        // { slots: string[] } so callers never have to know about it.
        const slotsByDate: FreeSlotsByDate = {};
        for (const [date, value] of Object.entries(raw)) {
          if (value && typeof value === "object" && Array.isArray((value as { slots?: unknown }).slots)) {
            slotsByDate[date] = value as { slots: string[] };
          }
        }
        return slotsByDate;
      }
      lastError = new GhlApiError(`GHL free-slots responded with ${res.status}`, res.status);
    } catch (err) {
      lastError = err;
    }
    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 400));
    }
  }
  throw lastError instanceof Error ? lastError : new GhlApiError("Failed to fetch free slots");
}

interface ContactInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

async function upsertContact(contact: ContactInput): Promise<{ id: string }> {
  const { apiToken, locationId } = getGhlConfig();
  const res = await ghlFetch(
    "/contacts/upsert",
    {
      method: "POST",
      body: JSON.stringify({
        locationId,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
      }),
    },
    apiToken
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new GhlApiError(`GHL contact upsert responded with ${res.status}: ${text}`, res.status);
  }

  const data = await res.json();
  return { id: data.contact.id };
}

async function createAppointment(params: {
  contactId: string;
  startTime: string;
  endTime: string;
  title: string;
}): Promise<{ id: string }> {
  const { apiToken, calendarId, locationId } = getGhlConfig();
  const res = await ghlFetch(
    "/calendars/events/appointments",
    {
      method: "POST",
      body: JSON.stringify({
        calendarId,
        locationId,
        contactId: params.contactId,
        startTime: params.startTime,
        endTime: params.endTime,
        title: params.title,
        appointmentStatus: "confirmed",
      }),
    },
    apiToken
  );

  // GHL's exact status code for "someone else just took this slot" isn't
  // confirmed yet (see verification plan); treat both 409 and 422 as
  // slot-unavailable so the caller shows a "pick another time" message
  // instead of a generic failure.
  if (res.status === 409 || res.status === 422) {
    const text = await res.text().catch(() => "");
    throw new GhlSlotUnavailableError(`Slot no longer available: ${text}`);
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new GhlApiError(
      `GHL create-appointment responded with ${res.status}: ${text}`,
      res.status
    );
  }

  const data = await res.json();
  return { id: data.id };
}

export interface BookSlotResult {
  appointmentId: string;
  contactId: string;
}

// The one function the booking API route calls. Does upsert-then-create as
// a single unit so a caller can never accidentally create a contact without
// booking, or vice versa. No retry here: retrying a POST that creates a
// resource risks a double-booked appointment if the first attempt actually
// succeeded but the response was lost, unlike the read-only getFreeSlots
// above or the webhook retry in submit-assessment/route.ts.
export async function bookSlot(
  contact: ContactInput,
  startTimeIso: string
): Promise<BookSlotResult> {
  if (process.env.GHL_BOOKING_DRY_RUN === "true") {
    return { appointmentId: "dry-run-appointment", contactId: "dry-run-contact" };
  }

  const endTimeIso = computeEndTime(startTimeIso);
  const { id: contactId } = await upsertContact(contact);
  const { id: appointmentId } = await createAppointment({
    contactId,
    startTime: startTimeIso,
    endTime: endTimeIso,
    title: "Rebuild Call",
  });

  return { appointmentId, contactId };
}
