import { useState } from "react";
import { COPY } from "@/config/copy";
import { Question } from "@/lib/types";

export default function QuizFlow({
  questions,
  currentIndex,
  currentValue,
  onAnswer,
  onBack,
}: {
  questions: Question[];
  currentIndex: number;
  currentValue: string | number | undefined;
  onAnswer: (value: string | number) => void;
  onBack: () => void;
}) {
  const question = questions[currentIndex];
  const [numberDraft, setNumberDraft] = useState(
    currentValue !== undefined ? String(currentValue) : ""
  );

  const progressPercent = Math.round(
    ((currentIndex + 1) / questions.length) * 100
  );

  return (
    <div className="flex min-h-screen flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
          <span>{COPY.quiz.progressLabel(currentIndex + 1, questions.length)}</span>
          <span>{question.category}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <h2 className="mt-8 text-2xl font-semibold text-ink sm:text-3xl">
          {question.prompt}
        </h2>

        <div className="mt-8">
          {question.type === "single-select" && (
            <div className="flex flex-col gap-3">
              {question.options?.map((option) => {
                const selected = currentValue === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => onAnswer(option.value)}
                    className={`w-full rounded-lg border px-5 py-4 text-left text-base font-medium transition ${
                      selected
                        ? "border-ink bg-ink text-white"
                        : "border-slate-200 bg-white text-ink hover:border-slate-400"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}

          {question.type === "number" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const numeric = Number(numberDraft);
                if (!Number.isNaN(numeric) && numberDraft.trim() !== "") {
                  onAnswer(numeric);
                }
              }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <input
                type="number"
                inputMode="numeric"
                autoFocus
                min={question.min}
                max={question.max}
                placeholder={question.placeholder}
                value={numberDraft}
                onChange={(e) => setNumberDraft(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-5 py-4 text-lg text-ink focus:border-ink focus:outline-none"
              />
              <button
                type="submit"
                disabled={numberDraft.trim() === ""}
                className="rounded-lg bg-ink px-8 py-4 text-lg font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {COPY.quiz.nextButton}
              </button>
            </form>
          )}
        </div>

        {currentIndex > 0 && (
          <button
            onClick={onBack}
            className="mt-8 text-sm font-medium text-slate-500 hover:text-ink"
          >
            ← {COPY.quiz.backButton}
          </button>
        )}
      </div>
    </div>
  );
}
