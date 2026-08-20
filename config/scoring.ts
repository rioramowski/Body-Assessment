// Every number here is in "years added to (or subtracted from) Health Age."
// Increase a value to make the assessment stricter for that answer, decrease
// (or make negative) to make it more forgiving. Question ids and option
// values must match config/questions.ts.

export interface ScoreEntry {
  years: number;
  label: string;
  explanation?: string;
}

export const AGE_MODIFIERS: Record<string, Record<string, ScoreEntry>> = {
  midsection: {
    flat: { years: -2, label: "lean midsection" },
    slight: { years: 1, label: "slight midsection overhang" },
    noticeable: {
      years: 4,
      label: "visible belly fat",
      explanation:
        "You said your midsection has noticeable belly fat. That visceral fat is what's been driving inflammation that blocks fat loss, and it won't move until the underlying pattern changes.",
    },
    significant: {
      years: 7,
      label: "significant belly fat",
      explanation:
        "You said you're carrying significant belly fat. That's the kind of visceral fat tied to insulin resistance and inflammation, and it's a metabolic issue, not a willpower problem.",
    },
  },
  weight_trend: {
    stable: { years: -1, label: "stable weight" },
    up_moderate: {
      years: 2,
      label: "10-20 lb weight gain",
      explanation:
        "You said you've gained 10-20 lbs over the last five years. That steady creep usually means your metabolism has already started slowing, and without a plan built for that, the next 10-20 lbs come faster.",
    },
    up_significant: {
      years: 5,
      label: "20+ lb weight gain",
      explanation:
        "You reported gaining 20+ lbs over the last five years. That's a strong signal your metabolic health has been sliding, and it's the same trajectory that leads to more medications and less mobility if it continues.",
    },
  },
  strength_training: {
    frequent: { years: -3, label: "consistent strength training" },
    occasional: { years: 0, label: "occasional strength training" },
    rare: {
      years: 3,
      label: "little strength training",
      explanation:
        "You said you rarely strength train. That's why you've likely felt yourself getting weaker and softer each year, and without resistance training specifically, that muscle loss keeps accelerating no matter what else you do.",
    },
    never: {
      years: 6,
      label: "no strength training",
      explanation:
        "You reported no regular strength training, which is a big reason you've been losing muscle and strength each year after 50, and that loss won't reverse on its own without resistance training specifically.",
    },
  },
  cardio: {
    daily: { years: -2, label: "daily cardio" },
    few_times_week: { years: -1, label: "regular cardio" },
    rare: {
      years: 2,
      label: "little cardio",
      explanation:
        "You said you rarely get your heart rate up. That's part of why your energy and recovery have likely been sliding, and it's a gap that strength training alone won't cover.",
    },
    never: {
      years: 4,
      label: "no cardio",
      explanation:
        "You reported almost no cardiovascular activity. That's been quietly shrinking your heart and lung capacity, which is exactly the kind of decline that makes everyday things like stairs and travel feel harder each year.",
    },
  },
  floor_test: {
    easily: { years: -2, label: "strong functional mobility" },
    effort: {
      years: 2,
      label: "reduced functional mobility",
      explanation:
        "You said getting up off the floor now takes some effort. That's an early sign of the strength and balance decline that, left alone, turns into real mobility problems over the next decade.",
    },
    no: {
      years: 5,
      label: "inability to rise from the floor unassisted",
      explanation:
        "You reported you can't get up off the floor without help. That's a clinical marker of the strength and balance loss behind most falls and injuries in your 60s and 70s, and it's exactly the kind of independence that's hardest to get back once it's gone.",
    },
  },
  blood_pressure: {
    normal: { years: -1, label: "healthy blood pressure" },
    managed: {
      years: 2,
      label: "managed blood pressure",
      explanation:
        "You said your blood pressure is elevated and managed with medication. That medication is treating the symptom, not the cause, which is why the dose (and the strain on your heart) tends to creep up over time if the underlying habits don't change.",
    },
    unknown: {
      years: 3,
      label: "unknown blood pressure",
      explanation:
        "You said you don't know your blood pressure numbers. That blind spot means a real risk factor could be quietly aging your cardiovascular system right now, and you won't catch it until it's already a problem.",
    },
  },
  cholesterol: {
    normal: { years: -1, label: "healthy cholesterol / blood sugar" },
    managed: {
      years: 2,
      label: "managed cholesterol / blood sugar",
      explanation:
        "You said your cholesterol or blood sugar is borderline or medicated. That's your metabolism already struggling to keep up, and it's the same pattern that tends to add more medications over the next decade, not fewer.",
    },
    unknown: {
      years: 3,
      label: "unknown cholesterol / blood sugar",
      explanation:
        "You said you don't know your cholesterol or blood sugar numbers. That's a common blind spot for high performers who haven't had a real check-up in years, which means a real problem could already be building without you knowing it.",
    },
  },
  medications: {
    none: { years: -1, label: "no daily medications" },
    one_two: {
      years: 2,
      label: "1-2 daily medications",
      explanation:
        "You reported being on 1-2 daily medications for blood pressure, cholesterol, or blood sugar. That's your body already compensating instead of recovering, and it's the early stage of the same pattern that leads to more medications over time.",
    },
    three_plus: {
      years: 4,
      label: "3+ daily medications",
      explanation:
        "You reported being on multiple daily medications for blood pressure, cholesterol, or blood sugar. That's your body compensating instead of recovering, and it usually means more meds and side effects over the next decade, not fewer.",
    },
  },
  health_scare: {
    no: { years: 0, label: "no recent health scare" },
    yes: {
      years: 3,
      label: "a recent health scare or diagnosis",
      explanation:
        "You reported a health scare or new diagnosis in the last two years. That's your body already signaling something's off, and ignoring that signal now is usually what turns a warning into a bigger problem later.",
    },
  },
  sleep_hours: {
    seven_plus: { years: -1, label: "adequate sleep" },
    five_six: {
      years: 2,
      label: "short sleep",
      explanation:
        "You said you sleep 5-6 hours a night. That's not enough for full hormonal and muscle recovery, which quietly caps how much progress any workout or diet effort can produce.",
    },
    under_five: {
      years: 4,
      label: "chronic sleep deprivation",
      explanation:
        "You said you're getting under 5 hours of sleep most nights. That level of chronic sleep deprivation accelerates hormonal decline and wrecks recovery, which is why it's been so hard to lose fat or rebuild strength no matter how hard you try.",
    },
  },
  sleep_quality: {
    yes: { years: -1, label: "restorative sleep" },
    no: {
      years: 2,
      label: "poor sleep quality",
      explanation:
        "You said you don't wake up feeling rested. That's a sign your sleep isn't doing its job, and poor sleep quality quietly undermines fat loss, muscle recovery, and energy no matter what else you fix.",
    },
    reliant: {
      years: 3,
      label: "reliance on caffeine or aids to function",
      explanation:
        "You said you rely on caffeine or aids to get through the day. Needing stimulants to function is usually a sign your body isn't recovering properly overnight, and that catches up with you.",
    },
  },
  stress: {
    low: { years: -1, label: "well-managed stress" },
    moderate: {
      years: 1,
      label: "moderate stress",
      explanation:
        "You rated your stress as moderate. Even at that level, chronic stress keeps cortisol elevated enough to work against fat loss and recovery, which is likely part of why progress has felt slower than it should.",
    },
    high: {
      years: 4,
      label: "high, constant stress",
      explanation:
        "You rated your stress as high and constant. That keeps cortisol elevated, which accelerates aging markers across your whole body and makes it nearly impossible to out-train or out-diet until the stress itself is addressed.",
    },
  },
  alcohol: {
    low: { years: -1, label: "light alcohol use" },
    moderate: {
      years: 1,
      label: "moderate alcohol use",
      explanation:
        "You reported 4-10 drinks a week. That's enough to measurably slow recovery and disrupt sleep, which quietly works against the results you're training for.",
    },
    high: {
      years: 3,
      label: "heavy alcohol use",
      explanation:
        "You reported 10+ drinks a week. That adds a real recovery burden and accelerates several markers of biological aging, and it's often the hidden reason progress stalls even when training and diet are otherwise on track.",
    },
  },
  energy_crash: {
    rarely: { years: -1, label: "stable energy" },
    sometimes: {
      years: 1,
      label: "occasional energy crashes",
      explanation:
        "You said you sometimes get an afternoon energy crash. That's usually an early sign of blood sugar swings or poor sleep, and it tends to get more frequent, not less, if the underlying cause isn't addressed.",
    },
    daily: {
      years: 3,
      label: "daily energy crashes",
      explanation:
        "You said you get an afternoon energy crash every day. That's a strong sign of blood sugar swings or metabolic strain, and it makes steady energy and fat loss much harder no matter how disciplined you are otherwise.",
    },
  },
  independence_confidence: {
    confident: { years: -1, label: "high confidence in staying physically capable" },
    somewhat_worried: {
      years: 2,
      label: "some worry about staying physically capable",
      explanation:
        "You said you're somewhat worried about staying physically capable 10 years from now. That instinct is usually right, and it's exactly the kind of early warning that's easy to ignore until it becomes a real limitation.",
    },
    worried: {
      years: 4,
      label: "active worry about physical independence",
      explanation:
        "You said you're actively worried about keeping up physically 10 years from now. That worry is often an accurate read on where things are headed, and it's exactly the kind of early warning sign worth acting on now while it's still fixable.",
    },
  },
};

// Health Age is clamped to chronological age + these bounds so a handful of
// bad answers can't produce an absurd result.
export const CLAMP_BOUNDS = {
  minDeltaYears: -15,
  maxDeltaYears: 20,
};

export interface TierConfig {
  id: string;
  label: string;
  // Upper bound (inclusive) of Health Age - chronological Age for this tier.
  // The last tier should use Infinity to catch everything above.
  maxDelta: number;
  // Either a fixed string, or an effort-conditional pair resolved against
  // hasTrainingEffort (see lib/scoring.ts) so the description never praises
  // effort someone didn't report.
  description: string | { someEffort: string; noEffort: string };
}

export const TIERS: TierConfig[] = [
  {
    id: "ahead",
    label: "Ahead of the Curve",
    maxDelta: -3,
    description:
      "Your habits are outrunning the calendar. You're operating with more capacity than most men your age.",
  },
  {
    id: "silent-slide",
    label: "Silent Slide",
    maxDelta: 4,
    description:
      "Nothing looks alarming yet, but a few habits are quietly compounding against you.",
  },
  {
    id: "red-zone",
    label: "Red Zone",
    maxDelta: 12,
    description:
      "Multiple systems are aging faster than they should. This is the window where it's still very fixable.",
  },
  {
    id: "critical",
    label: "Critical Risk",
    maxDelta: Infinity,
    description: {
      someEffort:
        "Several compounding factors are accelerating your Body Age well ahead of your calendar age, even though you've been trying to do the right things.",
      noEffort:
        "Several compounding factors are accelerating your Body Age well ahead of your calendar age, and right now, very little is working in your favor.",
    },
  },
];

// How many of the highest-impact negative factors to surface in the results explanation.
export const TOP_FACTORS_COUNT = 5;
