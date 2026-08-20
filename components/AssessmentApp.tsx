"use client";

import { useEffect, useState } from "react";
import { QUESTIONS } from "@/config/questions";
import { Answers, AssessmentResult, QualifyingAnswers } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";
import { getUtmParamsFromLocation, UtmParams } from "@/lib/utm";
import Landing from "@/components/Landing";
import QuizFlow from "@/components/QuizFlow";
import ContactForm from "@/components/ContactForm";
import Results from "@/components/Results";

type Phase = "landing" | "quiz" | "contact" | "submitting" | "results";

export default function AssessmentApp() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [utm] = useState<UtmParams>(() => getUtmParamsFromLocation());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);

  useEffect(() => {
    if (phase === "quiz") {
      trackEvent("quiz_progress", { question: currentIndex + 1 });
    }
  }, [phase, currentIndex]);

  function handleAnswer(value: string | number) {
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

      trackEvent("quiz_completed", { tier: data.result.tierId });
      setResult(data.result);
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

  if (phase === "results" && result) {
    return <Results result={result} />;
  }

  return null;
}
