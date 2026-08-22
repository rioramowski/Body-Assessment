"use client";

import { useEffect, useRef, useState } from "react";
import { QUESTIONS } from "@/config/questions";
import { Answers, AssessmentResult, QualifyingAnswers } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";
import { getUtmParamsFromLocation, UtmParams } from "@/lib/utm";
import Landing from "@/components/Landing";
import QuizFlow from "@/components/QuizFlow";
import ContactForm from "@/components/ContactForm";
import Results from "@/components/Results";
import BookingFlow from "@/components/BookingFlow";

type Phase = "landing" | "quiz" | "contact" | "submitting" | "results" | "booking";

export default function AssessmentApp() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isQualified, setIsQualified] = useState(false);
  const [bookingContact, setBookingContact] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  } | null>(null);
  const [utm] = useState<UtmParams>(() => getUtmParamsFromLocation());
  // Guards against a double-click/double-tap on a single-select option
  // firing handleAnswer twice before the 200ms transition completes, which
  // would advance currentIndex by 2 off the same stale closure and could
  // skip past the last question without ever hitting the "contact" phase.
  const advancingRef = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);

  useEffect(() => {
    if (phase === "quiz") {
      trackEvent("quiz_progress", { question: currentIndex + 1 });
    }
  }, [phase, currentIndex]);

  useEffect(() => {
    advancingRef.current = false;
  }, [currentIndex, phase]);

  function handleAnswer(value: string | number) {
    if (advancingRef.current) return;

    const question = QUESTIONS[currentIndex];
    const updatedAnswers = { ...answers, [question.id]: value };
    setAnswers(updatedAnswers);

    const advance = () => {
      if (currentIndex + 1 < QUESTIONS.length) {
        setCurrentIndex((i) => i + 1);
      } else {
        trackEvent("contact_form_reached");
        setPhase("contact");
      }
    };

    if (question.type === "single-select") {
      advancingRef.current = true;
      setTimeout(advance, 200);
    } else {
      advance();
    }
  }

  function handleQuizBack() {
    if (currentIndex === 0) {
      setPhase("landing");
    } else {
      setCurrentIndex((i) => i - 1);
    }
  }

  async function handleContactSubmit(contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    qualifying: QualifyingAnswers;
    honeypot: string;
  }) {
    setErrorMessage(null);
    setPhase("submitting");

    try {
      const res = await fetch("/api/submit-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          qualifying: contact.qualifying,
          honeypot: contact.honeypot,
          answers,
          utm,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        setPhase("contact");
        return;
      }

      trackEvent("quiz_completed", { tier: data.result.tierId, qualified: data.isQualified });
      setResult(data.result);
      setIsQualified(data.isQualified);
      setBookingContact({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
      });
      setPhase("results");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setPhase("contact");
    }
  }

  if (phase === "landing") {
    return (
      <Landing
        onStart={() => {
          trackEvent("quiz_started");
          setPhase("quiz");
        }}
      />
    );
  }

  if (phase === "quiz") {
    const question = QUESTIONS[currentIndex];
    return (
      <QuizFlow
        questions={QUESTIONS}
        currentIndex={currentIndex}
        currentValue={answers[question.id]}
        onAnswer={handleAnswer}
        onBack={handleQuizBack}
      />
    );
  }

  if (phase === "contact" || phase === "submitting") {
    return (
      <ContactForm
        isSubmitting={phase === "submitting"}
        errorMessage={errorMessage}
        onSubmit={handleContactSubmit}
        onBack={() => {
          setCurrentIndex(QUESTIONS.length - 1);
          setPhase("quiz");
        }}
      />
    );
  }

  if (phase === "results" && result && bookingContact) {
    return (
      <Results
        result={result}
        isQualified={isQualified}
        onBookClick={() => setPhase("booking")}
      />
    );
  }

  if (phase === "booking" && result && bookingContact) {
    return (
      <BookingFlow
        bookingContact={bookingContact}
        tierId={result.tierId}
        onBack={() => setPhase("results")}
      />
    );
  }

  return null;
}
