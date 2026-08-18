// All user-facing text and the external CTA link live here. Edit freely.
// No other file needs to change when you update wording or the link.

export const COPY = {
  landing: {
    eyebrow: "For C-Suite Executives & Business Owners Over 50 Earning $150K+/Year",
    headline: "Is Your Body Older Than You Are?",
    subheadline:
      "Answer 16 targeted questions to reveal your true Body Age, your risk tier, and what to fix first.",
    bullets: [
      "Takes about 3 minutes",
      "16 targeted questions on your body, training, health markers, and lifestyle",
      "Instant results – see your Body Age and risk tier right away",
    ],
    startButton: "Start My Assessment",
    disclaimer:
      "This assessment is for educational purposes and is not a substitute for medical advice, diagnosis, or treatment.",
  },
  quiz: {
    nextButton: "Next",
    backButton: "Back",
    progressLabel: (current: number, total: number) => `Question ${current} of ${total}`,
  },
  contact: {
    headline: "Almost done. Where should we send your results?",
    subheadline:
      "Your Body Age and full breakdown will appear right after this. We'll also send a copy to your email (and text you if anything looks especially concerning).",
    firstNameLabel: "First name",
    firstNamePlaceholder: "John",
    lastNameLabel: "Last name",
    lastNamePlaceholder: "Smith",
    emailLabel: "Email",
    emailPlaceholder: "john@company.com",
    phoneLabel: "Mobile number",
    phonePlaceholder: "(555) 123-4567",
    selectPlaceholder: "Select one",
    submitButton: "Reveal My Body Age",
    submittingButton: "Calculating...",
    privacyNote: "We respect your privacy. No spam, ever.",
  },
  results: {
    realAgeSentence: (age: number) => `You are ${age} years old.`,
    bodyAgeSentence: (bodyAge: number) => `Your Body Age is ${bodyAge}.`,
    differenceSentence: (diffYears: number) => {
      if (diffYears === 0) return "Difference: right in line with your current age.";
      const direction = diffYears > 0 ? "older" : "younger";
      return `Difference: ${Math.abs(diffYears)} years ${direction} than your current age.`;
    },
    worseningLine:
      "If nothing changes, this gap usually shows up over the next 5-10 years as more medications, slower recoveries from every injury or surgery, and your world shrinking: needing help with basic things like stairs and luggage and sitting on the sidelines while other people hike, travel, and play with your kids or grandkids.",
    explanationHeadline: "Why you scored this way",
    // Static closing bullet appended after the answer-driven factors below,
    // shown whenever at least one factor is listed. Ties the score back to
    // why past training/diet effort hasn't worked, not just what's wrong.
    explanationClosingBullet:
      "You've been throwing effort at this with plans that were never built for a man your age, schedule, and recovery. This is why even 4-5 workouts a week and strict diets haven't delivered the body or confidence you expected.",
    // The pitch below each tier's score. Keyed by the tier ids defined in
    // config/scoring.ts (TIERS[].id). Button text/link stays the same across
    // tiers. Only the headline, body, and pre-button note vary.
    ctaByTier: {
      ahead: {
        headline: "Want To Extend Your Edge?",
        body: "You're ahead of most men your age, which is exactly why you're the type of person who invests early to stay that way. If you're a U.S. C-suite executive or business owner over 50 earning $150K+/year and you want to lock this advantage in for the next decade, my 12-month C-Suite Rebuild program is built to help you do it without blowing up your career or schedule. Dialing in the few weak spots behind this score is what keeps you hiking, traveling, and leading from the front in your 60s and 70s instead of wondering when your body will start holding you back.",
        preButtonNote:
          "On this call, we'll look at what it takes to keep your results compounding. No pressure, just a conversation.",
      },
      "silent-slide": {
        headline: "Where To Go From Here",
        body: "You're not in crisis yet, but your body is aging faster than you are. For most men in this tier, the next 5-10 years determine whether they stay active and independent or end up on the treadmill of meds and recurring injuries. If you're a U.S. C-suite executive or business owner over 50 earning $150K+/year and you want to fix this before it gets expensive, my 12-month C-Suite Rebuild program is built specifically for you. Fixing the patterns behind this score now is what keeps you off that treadmill and lets you stay strong and independent through your 60s.",
        preButtonNote: "On this call, we'll see if the C-Suite Rebuild program is a fit for you.",
      },
      "red-zone": {
        headline: "This Is Fixable, But The Window Is Closing",
        body: "If this number hits you in the gut, that's good. It means you're still in time to change it. Men in this tier usually see things get noticeably worse over the next 5-10 years: more meds, more weight around the middle, slower recoveries, and needing help with simple physical tasks. If you're a U.S. C-suite executive or business owner over 50 earning $150K+/year and you don't want that to be your story, my 12-month C-Suite Rebuild program is built specifically for you. With the right plan, the next decade can instead look like fewer meds, less weight around your midsection, and still being the one who carries the bags, climbs the stairs, and keeps up on trips.",
        preButtonNote:
          "On this call, we'll map out exactly what's driving your number and whether the C-Suite Rebuild program is the right fit to turn it around.",
      },
      critical: {
        headline: "This Needs Attention Now",
        body: "If this number hits you in the gut, that's good. It means you're still in time to change it. Men in this tier usually see things get noticeably worse over the next 5-10 years: more meds, more weight around the middle, slower recoveries, and needing help with simple physical tasks. If you're a U.S. C-suite executive or business owner over 50 earning $150K+/year and you don't want that to be your story, my 12-month C-Suite Rebuild program is built specifically for you. With the right plan, the next decade can instead look like fewer meds, less weight around your midsection, and still being the one who carries the bags, climbs the stairs, and keeps up on trips.",
        preButtonNote:
          "On this call, we'll go through your results in detail and see if the C-Suite Rebuild program is the right fit to get ahead of this.",
      },
    } as Record<string, { headline: string; body: string; preButtonNote: string }>,
    ctaButton: "Apply for a Rebuild Call",
    ctaButtonHref: "https://polarity-fitness.com/apply",
  },
} as const;
