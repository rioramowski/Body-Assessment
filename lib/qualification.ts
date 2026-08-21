import { QualifyingAnswers } from "@/lib/types";

// Single source of truth for lead tier and booking eligibility. Deliberately
// separate from lib/scoring.ts: this depends only on the location/income/
// urgency answers below, never on body age or risk tier. Edit the checks
// here to change the rules; both isQualified and the CRM payload derive from
// getLeadTier so they can never drift out of sync with each other.
export type LeadTier = "green" | "yellow" | "red";

const TOP_URGENCY = new Set(["right_now", "next_90_days"]);
const HIGH_INCOME = new Set(["150k_249k", "250k_plus"]);

// Green (A-lead): U.S., $150K+, and urgency is one of the top two options.
function isGreen(qualifying: QualifyingAnswers): boolean {
  return (
    qualifying.location === "us" &&
    HIGH_INCOME.has(qualifying.income) &&
    TOP_URGENCY.has(qualifying.urgency)
  );
}

// Yellow (B-lead): U.S. at $150K+ but with weaker urgency, or U.S. at
// $100K-$149K with top-two urgency, or Canada at $150K+ with top-two urgency.
function isYellow(qualifying: QualifyingAnswers): boolean {
  const topUrgency = TOP_URGENCY.has(qualifying.urgency);
  const usHighIncomeLowUrgency =
    qualifying.location === "us" && HIGH_INCOME.has(qualifying.income) && !topUrgency;
  const usMidIncomeTopUrgency =
    qualifying.location === "us" && qualifying.income === "100k_149k" && topUrgency;
  const canadaHighIncomeTopUrgency =
    qualifying.location === "canada" && HIGH_INCOME.has(qualifying.income) && topUrgency;
  return usHighIncomeLowUrgency || usMidIncomeTopUrgency || canadaHighIncomeTopUrgency;
}

export function getLeadTier(qualifying: QualifyingAnswers): LeadTier {
  if (isGreen(qualifying)) return "green";
  if (isYellow(qualifying)) return "yellow";
  return "red";
}

// Green and Yellow leads get the booking CTA on the results page; Red does not.
export function isQualified(qualifying: QualifyingAnswers): boolean {
  return getLeadTier(qualifying) !== "red";
}
