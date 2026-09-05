import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { logCalendarViewed } from "@/lib/sheets";

// Logs the one funnel moment that has no other server round-trip to piggy
// back on: clicking the CTA to view the calendar is a pure client-side
// phase transition. Every other event (opt-in completed, calendar booked)
// is logged directly from the API route that's already handling it.
const RequestSchema = z.object({
  email: z.string().trim().email().max(200),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = RequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  await logCalendarViewed({ email: parsed.data.email });

  return NextResponse.json({ ok: true });
}
