import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { computeEndTime, getFreeSlots, GhlApiError, GhlConfigError } from "@/lib/ghl";

const QuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(31).default(7),
  timezone: z.string().trim().min(1).max(100),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    days: searchParams.get("days") ?? undefined,
    timezone: searchParams.get("timezone"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query parameters." }, { status: 400 });
  }

  const { days, timezone } = parsed.data;
  const startMs = Date.now();
  const endMs = startMs + days * 24 * 60 * 60 * 1000;

  try {
    const slotsByDate = await getFreeSlots(startMs, endMs, timezone);
    const result = Object.entries(slotsByDate)
      .map(([date, { slots }]) => ({
        date,
        slots: slots.map((startTime) => ({
          startTime,
          endTime: computeEndTime(startTime),
        })),
      }))
      .filter((day) => day.slots.length > 0)
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({ days: result });
  } catch (err) {
    if (err instanceof GhlConfigError) {
      console.error("GHL booking misconfigured", err);
      return NextResponse.json({ error: "Booking is temporarily unavailable." }, { status: 500 });
    }
    console.error("Failed to fetch GHL free slots", err);
    return NextResponse.json(
      { error: "Couldn't load available times. Please try again." },
      { status: err instanceof GhlApiError ? 502 : 500 }
    );
  }
}
