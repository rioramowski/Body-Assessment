import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { logLandingPageViewed } from "@/lib/sheets";

// Logs the one funnel moment that has no other server round-trip to piggy
// back on: landing on the page is a pure client-side page load, unlike
// every other event which is logged directly from the API route already
// handling it.
const RequestSchema = z.object({
  utm: z.record(z.string(), z.string()).optional().default({}),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = RequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  await logLandingPageViewed({ utm: parsed.data.utm });

  return NextResponse.json({ ok: true });
}
