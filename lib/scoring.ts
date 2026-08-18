import { AGE_MODIFIERS, CLAMP_BOUNDS, TIERS, TOP_FACTORS_COUNT } from "@/config/scoring";
import { Answers, AssessmentResult, ScoreFactor } from "@/lib/types";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function computeHealthAge(answers: Answers): AssessmentResult {
  const chronologicalAge = Number(answers.age);

  const factors: ScoreFactor[] = [];
  let rawDelta = 0;

  for (const [questionId, optionsForQuestion] of Object.entries(AGE_MODIFIERS)) {
    const selected = answers[questionId];
    if (typeof selected !== "string") continue;

    const entry = optionsForQuestion[selected];
    if (!entry) continue;

    rawDelta += entry.years;

    if (entry.explanation && entry.years > 0) {
      factors.push({
        questionId,
        label: entry.label,
        years: entry.years,
        explanation: entry.explanation,
      });
    }
  }

  const clampedDelta = clamp(
    rawDelta,
    CLAMP_BOUNDS.minDeltaYears,
    CLAMP_BOUNDS.maxDeltaYears
  );

  const healthAge = Math.round(chronologicalAge + clampedDelta);

  const tier =
    TIERS.find((t) => clampedDelta <= t.maxDelta) ?? TIERS[TIERS.length - 1];

  const topFactors = factors
    .sort((a, b) => b.years - a.years)
    .slice(0, TOP_FACTORS_COUNT);

  return {
    chronologicalAge,
    healthAge,
    deltaYears: clampedDelta,
    tierId: tier.id,
    tierLabel: tier.label,
    tierDescription: tier.description,
    topFactors,
  };
}
