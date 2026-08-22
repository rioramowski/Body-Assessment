import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { bookSlot, GhlApiError, GhlConfigError, GhlSlotUnavailableError } from "@/lib/ghl";

const RequestSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Valid email is required").max(200),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+()\-.\s]{7,20}$/, "Valid mobile number is required"),
  startTime: z.string().trim().min(1, "startTime is required"),
});

// Handles the CORS preflight the browser sends before the POST below,
// since it carries a Content-Type header. next.config.mjs attaches the
// actual Access-Control-Allow-Origin header to this response.
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = RequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid booking request." }, { status: 400 });
  }

  const { firstName, lastName, email, phone, startTime } = parsed.data;

  try {
    const result = await bookSlot({ firstName, lastName, email, phone }, startTime);
    return NextResponse.json({ appointmentId: result.appointmentId, startTime });
  } catch (err) {
    if (err instanceof GhlSlotUnavailableError) {
      return NextResponse.json(
        { error: "That time was just taken. Please pick another." },
        { status: 409 }
      );
    }
    if (err instanceof GhlConfigError) {
      console.error("GHL booking misconfigured", err);
      return NextResponse.json({ error: "Booking is temporarily unavailable." }, { status: 500 });
    }
    console.error("Failed to book GHL appointment", {
      firstName,
      lastName,
      email,
      phone,
      startTime,
      err,
    });
    const status = err instanceof GhlApiError ? 502 : 500;
    return NextResponse.json({ error: "Couldn't book that call. Please try again." }, { status });
  }
}
