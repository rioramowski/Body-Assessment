import { QualifyingAnswers } from "@/lib/types";

// Single source of truth for who qualifies to book a call. Deliberately
// separate from lib/scoring.ts: qualification depends only on the
// location/income/urgency answers below, never on body age or risk tier.
// Edit the sets/checks here to change the rule.
const QUALIFYING_LOCATION = "us";
const QUALIFYING_INCOMES = new Set(["150k_249k", "250k_plus"]);
const QUALIFYING_URGENCY = new Set(["right_now", "next_90_days"]);

export function isQualified(qualifying: QualifyingAnswers): boolean {
  return (
    qualifying.location === QUALIFYING_LOCATION &&
    QUALIFYING_INCOMES.has(qualifying.income) &&
    QUALIFYING_URGENCY.has(qualifying.urgency)
  );
}
