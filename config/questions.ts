import { Question, QualifyingQuestion } from "@/lib/types";

// Edit prompts/options here to change the quiz itself. If you add or remove
// an option, add a matching entry (or remove it) in config/scoring.ts under
// the same question id, or that answer won't affect the score.
export const QUESTIONS: Question[] = [
  {
    id: "age",
    category: "Basics",
    prompt: "What is your age?",
    type: "number",
    min: 30,
    max: 90,
    placeholder: "e.g. 54",
  },
  {
    id: "midsection",
    category: "Body",
    prompt: "How would you describe your midsection today?",
    type: "single-select",
    options: [
      { value: "flat", label: "Flat / athletic" },
      { value: "slight", label: "Slight overhang" },
      { value: "noticeable", label: "Noticeable belly fat" },
      { value: "significant", label: "Significant belly fat" },
    ],
  },
  {
    id: "weight_trend",
    category: "Body",
    prompt: "How has your weight changed over the last 5 years?",
    type: "single-select",
    options: [
      { value: "stable", label: "Stable or trending down" },
      { value: "up_moderate", label: "Up 10-20 lbs" },
      { value: "up_significant", label: "Up 20+ lbs" },
    ],
  },
  {
    id: "strength_training",
    category: "Training",
    prompt: "How often do you do strength training?",
    type: "single-select",
    options: [
      { value: "frequent", label: "3+ times / week" },
      { value: "occasional", label: "1-2 times / week" },
      { value: "rare", label: "Rarely" },
      { value: "never", label: "Never" },
    ],
  },
  {
    id: "cardio",
    category: "Training",
    prompt: "How often do you get your heart rate up (cardio, sport, brisk activity)?",
    type: "single-select",
    options: [
      { value: "daily", label: "Daily" },
      { value: "few_times_week", label: "A few times a week" },
      { value: "rare", label: "Rarely" },
      { value: "never", label: "Never" },
    ],
  },
  {
    id: "floor_test",
    category: "Training",
    prompt: "Can you get up off the floor without using your hands or knees?",
    type: "single-select",
    options: [
      { value: "easily", label: "Yes, easily" },
      { value: "effort", label: "With some effort" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: "blood_pressure",
    category: "Health markers",
    prompt: "How would you describe your blood pressure?",
    type: "single-select",
    options: [
      { value: "normal", label: "Normal, and I know my numbers" },
      { value: "managed", label: "Elevated, managed with medication" },
      { value: "unknown", label: "Honestly, I don't know" },
    ],
  },
  {
    id: "cholesterol",
    category: "Health markers",
    prompt: "How would you describe your cholesterol / blood sugar?",
    type: "single-select",
    options: [
      { value: "normal", label: "Normal" },
      { value: "managed", label: "Borderline or managed with medication" },
      { value: "unknown", label: "Honestly, I don't know" },
    ],
  },
  {
    id: "medications",
    category: "Health markers",
    prompt:
      "How many daily medications are you on for blood pressure, cholesterol, blood sugar, or hormones?",
    type: "single-select",
    options: [
      { value: "none", label: "0" },
      { value: "one_two", label: "1-2" },
      { value: "three_plus", label: "3 or more" },
    ],
  },
  {
    id: "health_scare",
    category: "Health markers",
    prompt: "Have you had a health scare or new diagnosis in the last 2 years?",
    type: "single-select",
    options: [
      { value: "no", label: "No" },
      { value: "yes", label: "Yes" },
    ],
  },
  {
    id: "sleep_hours",
    category: "Lifestyle",
    prompt: "On average, how much do you sleep per night?",
    type: "single-select",
    options: [
      { value: "seven_plus", label: "7+ hours" },
      { value: "five_six", label: "5-6 hours" },
      { value: "under_five", label: "Under 5 hours" },
    ],
  },
  {
    id: "sleep_quality",
    category: "Lifestyle",
    prompt: "Do you wake up feeling rested most days?",
    type: "single-select",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "reliant", label: "I rely on caffeine or aids to function" },
    ],
  },
  {
    id: "stress",
    category: "Lifestyle",
    prompt: "How would you describe your stress level most days?",
    type: "single-select",
    options: [
      { value: "low", label: "Low / well managed" },
      { value: "moderate", label: "Moderate" },
      { value: "high", label: "High / constant" },
    ],
  },
  {
    id: "alcohol",
    category: "Lifestyle",
    prompt: "How many alcoholic drinks do you typically have per week?",
    type: "single-select",
    options: [
      { value: "low", label: "0-3" },
      { value: "moderate", label: "4-10" },
      { value: "high", label: "10+" },
    ],
  },
  {
    id: "energy_crash",
    category: "Lifestyle",
    prompt: "Do you get an afternoon energy crash?",
    type: "single-select",
    options: [
      { value: "rarely", label: "Rarely" },
      { value: "sometimes", label: "Sometimes" },
      { value: "daily", label: "Every day" },
    ],
  },
  {
    id: "independence_confidence",
    category: "Independence",
    prompt:
      "How confident are you that you'll physically keep up (travel, grandkids, sport) 10 years from now?",
    type: "single-select",
    options: [
      { value: "confident", label: "Very confident" },
      { value: "somewhat_worried", label: "Somewhat worried" },
      { value: "worried", label: "Actively worried" },
    ],
  },
];

// Dropdowns shown on the opt-in step (alongside name/email/phone) to qualify
// the lead. These are not part of the scored quiz above and don't affect
// body age. Edit prompts/options here; each becomes a required <select>.
export const QUALIFYING_QUESTIONS: QualifyingQuestion[] = [
  {
    id: "location",
    label: "Where are you from?",
    options: [
      { value: "us", label: "U.S." },
      { value: "canada", label: "Canada" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "income",
    label: "What's your annual income?",
    options: [
      { value: "under_100k", label: "< $100K" },
      { value: "100k_149k", label: "$100K-$149K" },
      { value: "150k_249k", label: "$150K-$249K" },
      { value: "250k_plus", label: "$250K+" },
    ],
  },
  {
    id: "urgency",
    label: "When do you want to fix your health?",
    options: [
      { value: "right_now", label: "Right now" },
      { value: "next_90_days", label: "Within the next 90 days" },
      { value: "this_year", label: "Sometime this year" },
      { value: "exploring", label: "I'm just exploring my options" },
    ],
  },
];
