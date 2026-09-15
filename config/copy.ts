// All user-facing text lives here. Edit freely.
// No other file needs to change when you update wording.

export const COPY = {
  landing: {
    eyebrow: "For U.S. Business Owners, Executives & Professionals Over 50 Earning $150K+/Year",
    headline: "Is Your Body Older Than You Are?",
    subheadline:
      "Answer 16 targeted questions to reveal your true body age, your risk tier, and the factors driving your score.",
    bullets: [
      "Takes about 2 minutes",
      "16 targeted questions on your body, training, health markers, and lifestyle",
      "Instant results – see your body age and risk tier right away",
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
    headline: "Unlock Your Personalized Results",
    subheadline:
      "Enter your details below to reveal your true body age, your risk tier, and the factors driving your score.",
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
    bodyAgeSentence: (bodyAge: number) => `Your body age is ${bodyAge}.`,
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
        headline: "Want To Stay Ahead?",
        body: "You're ahead of most men your age. The goal now is to keep it that way. The 12-month C-Suite Rebuild helps you stay lean, strong, and capable without taking over your schedule, so you can carry that edge into your 60s and 70s.",
        preButtonNote:
          "On this call, we'll look at what's working, what could slip, and what it would take to keep building from here.",
      },
      "silent-slide": {
        headline: "Now Is The Time To Turn This Around",
        body: "You're not in crisis, which is exactly why now is the time to act. The patterns showing up in your results tend to get harder to reverse the longer they're left alone. The C-Suite Rebuild helps you get stronger, leaner, and back in control before those problems become much harder to ignore.",
        preButtonNote:
          "On this call, we'll look at what's driving your results and whether the C-Suite Rebuild is the right next step.",
      },
      "red-zone": {
        headline: "This Is Fixable, But The Window Is Closing",
        body: "Your results show this has moved beyond a few small issues, but there's still time to change the direction you're heading. The C-Suite Rebuild is built to help you rebuild your strength, improve your health, and get back in control before the next few years make it harder.",
        preButtonNote:
          "On this call, we'll walk through what's driving your results and what it would take to turn them around.",
      },
      critical: {
        headline: "This Needs Attention Now",
        body: "Your results show several problems stacking up at once. If nothing changes, the likely direction is more medications, worse health markers, more weight, less physical capability, and eventually depending on other people for things you used to do yourself. The C-Suite Rebuild is built to help you reverse that trajectory and stay strong, capable, and independent.",
        preButtonNote:
          "On this call, we'll go through your results, identify the biggest priorities, and see if the C-Suite Rebuild is the right fit.",
      },
    } as Record<string, { headline: string; body: string; preButtonNote: string }>,
    ctaButton: "Book My Transformation Call",
  },
  booking: {
    backButton: "Back to results",
    eyebrow: "For U.S. C-Suite Executives & Business Owners Over 50 Earning $150K+/Year",
    headline: "Book Your 15-Minute Transformation Call",
    subheadline:
      "We'll review your body age result, uncover why years of effort haven't changed your body, and see whether the 12-Month C-Suite Rebuild can help you build a lean, strong, capable body that matches the success you've created everywhere else.",
    loadingLabel: "Loading available times...",
    bookingLabel: "Booking your call...",
    emptyState: "No times are available right now. Please contact us directly to book your call.",
    loadError: "Couldn't load available times. Please try again.",
    slotTakenError: "That time was just taken. Please pick another.",
    bookError: "Couldn't book that call. Please try again.",
    retryButton: "Try again",
    // Where a lead lands immediately after a successful booking, instead of
    // an in-app confirmation screen.
    thankYouUrl: "https://polarity-fitness.com/before-your-call",
  },
} as const;
