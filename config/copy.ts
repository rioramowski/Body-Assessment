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
    subheadline: "Your Body Age and full breakdown will appear right after this.",
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
      "If nothing changes, the next 5-10 years mean more medications, worse health markers, less energy and confidence, and more things your body simply can't do. Life starts looking more like managing your health, sitting things out, and depending on other people to do things you used to do yourself.",
    explanationHeadline: "Why you scored this way",
    // Closing bullet appended after the answer-driven factors below, shown
    // whenever at least one factor is listed. Picked based on
    // result.hasTrainingEffort so it never falsely assumes effort someone
    // didn't report (or ignores real effort someone already reported).
    explanationClosingBullet: {
      someEffort:
        "You've already been putting in real effort at the gym, so this isn't a motivation problem. What's dragging your score down is everything the bullets above are already pointing to, not a lack of effort, and that's exactly the gap a plan built for your age and schedule closes.",
      noEffort:
        "You haven't had a real strength training plan running yet, and that's a plan problem, not a willpower problem. Random effort without something built for your age, schedule, and recovery was never going to move the needle, and that's exactly what changes with the right one.",
    },
    // The pitch below each tier's score. Keyed by the tier ids defined in
    // config/scoring.ts (TIERS[].id). Button text/link stays the same across
    // tiers. Only the headline, body, and pre-button note vary.
    ctaByTier: {
      ahead: {
        headline: "Want To Extend Your Edge?",
        body: "You're ahead of most men your age, and that's exactly why it's worth locking in now, not later. If you're a U.S. C-suite executive or business owner over 50 earning $150K+/year, my 12-month C-Suite Rebuild program helps you protect this edge without blowing up your career or schedule, so you're still leading from the front in your 60s and 70s.",
        preButtonNote:
          "On this call, we'll look at what it takes to keep your results compounding. No pressure, just a conversation.",
      },
      "silent-slide": {
        headline: "Where To Go From Here",
        body: "You're not in crisis yet, but the next 5-10 years decide whether you stay active and independent or end up on the treadmill of meds and recurring injuries. If you're a U.S. C-suite executive or business owner over 50 earning $150K+/year, my 12-month C-Suite Rebuild program fixes these patterns now, before they get expensive, so you stay strong and independent through your 60s.",
        preButtonNote: "On this call, we'll see if the C-Suite Rebuild program is a fit for you.",
      },
      "red-zone": {
        headline: "This Is Fixable, But The Window Is Closing",
        body: "If this number hits you in the gut, that's good. It means you're still in time to change it, before it becomes more meds, more weight, and needing help with simple physical tasks. If you're a U.S. C-suite executive or business owner over 50 earning $150K+/year, my 12-month C-Suite Rebuild program is built to turn this around, so the next decade looks like fewer meds and still being the one who carries the bags and keeps up.",
        preButtonNote:
          "On this call, we'll map out exactly what's driving your number and whether the C-Suite Rebuild program is the right fit to turn it around.",
      },
      critical: {
        headline: "This Needs Attention Now",
        body: "Your number puts you in the highest-risk group we see, and left unaddressed, this is a trajectory: more medications, slower recovery, and a real chance you end up depending on others for things you used to do without thinking. If you're a U.S. C-suite executive or business owner over 50 earning $150K+/year, my 12-month C-Suite Rebuild program is built specifically to turn this around, so the next decade looks like fewer meds and being the one who keeps up, not the one who gets left behind.",
        preButtonNote:
          "On this call, we'll go through your results in detail and see if the C-Suite Rebuild program is the right fit to get ahead of this.",
      },
    } as Record<string, { headline: string; body: string; preButtonNote: string }>,
    ctaButton: "Apply for a Rebuild Call",
    ctaButtonHref: "https://polarity-fitness.com/apply",
  },
} as const;
