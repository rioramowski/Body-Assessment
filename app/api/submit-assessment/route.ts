import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { QUESTIONS, QUALIFYING_QUESTIONS } from "@/config/questions";
import { computeHealthAge } from "@/lib/scoring";
import { Answers, QualifyingAnswers } from "@/lib/types";

const RequestSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Valid email is required").max(200),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+()\-.\s]{7,20}$/, "Valid mobile number is required"),
  qualifying: z.record(z.string(), z.string()),
  honeypot: z.string().max(0).optional().default(""),
  answers: z.record(z.string(), z.union([z.string(), z.number()])),
});

function validateAnswers(answers: Answers): string | null {
  for (const question of QUESTIONS) {
    const value = answers[question.id];

    if (value === undefined || value === null || value === "") {
      return `Missing answer for "${question.id}"`;
    }

    if (question.type === "number") {
      const numeric = Number(value);
      if (Number.isNaN(numeric)) return `"${question.id}" must be a number`;
      if (question.min !== undefined && numeric < question.min)
        return `"${question.id}" is out of range`;
      if (question.max !== undefined && numeric > question.max)
        return `"${question.id}" is out of range`;
    }

    if (question.type === "single-select") {
      const validValues = new Set(question.options?.map((o) => o.value));
      if (typeof value !== "string" || !validValues.has(value)) {
        return `Invalid answer for "${question.id}"`;
      }
    }
  }
  return null;
}

function validateQualifying(qualifying: QualifyingAnswers): string | null {
  for (const question of QUALIFYING_QUESTIONS) {
    const value = qualifying[question.id];
    const validValues = new Set(question.options.map((o) => o.value));
    if (typeof value !== "string" || !validValues.has(value)) {
      return `Invalid answer for "${question.id}"`;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = RequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid submission." },
      { status: 400 }
    );
  }

  const { firstName, lastName, email, phone, qualifying, honeypot, answers } = parsed.data;

  // Honeypot field should always be empty for real users; a filled value
  // means a bot filled out every field on the form.
  if (honeypot) {
    return NextResponse.json({ error: "Rejected." }, { status: 400 });
  }

  const validationError = validateAnswers(answers) ?? validateQualifying(qualifying);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const result = computeHealthAge(answers);
  const timestamp = new Date().toISOString();

  const webhookUrl = process.env.GHL_WEBHOOK_URL;

  const flattenedAnswers = Object.fromEntries(
    Object.entries(answers).map(([id, value]) => [`answer_${id}`, value])
  );
  const flattenedQualifying = Object.fromEntries(
    Object.entries(qualifying).map(([id, value]) => [`qualifying_${id}`, value])
  );

  const webhookPayload = {
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim(),
    email,
    phone,
    ...flattenedQualifying,
    chronologicalAge: result.chronologicalAge,
    healthAge: result.healthAge,
    deltaYears: result.deltaYears,
    tier: result.tierLabel,
    topFactors: result.topFactors.map((f) => f.label).join("; "),
    timestamp,
    source: "csuite-health-age-assessment",
    ...flattenedAnswers,
  };

  if (webhookUrl) {
    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webhookPayload),
      });
      if (!webhookResponse.ok) {
        console.error(
          `GHL webhook responded with ${webhookResponse.status}`,
          await webhookResponse.text().catch(() => "")
        );
      }
    } catch (err) {
      console.error("Failed to reach GHL webhook", err);
    }
  } else {
    console.warn(
      "GHL_WEBHOOK_URL is not set, skipping CRM webhook. Submission:",
      webhookPayload
    );
  }

  return NextResponse.json({ result });
}
