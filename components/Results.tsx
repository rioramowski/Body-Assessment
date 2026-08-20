import { COPY } from "@/config/copy";
import { AssessmentResult } from "@/lib/types";

const TIER_STYLES: Record<string, string> = {
  ahead: "bg-emerald-100 text-emerald-800 border-emerald-300",
  "silent-slide": "bg-amber-100 text-amber-800 border-amber-300",
  "red-zone": "bg-orange-100 text-orange-800 border-orange-300",
  critical: "bg-red-100 text-red-800 border-red-300",
};

export default function Results({ result }: { result: AssessmentResult }) {
  const { results: copy } = COPY;
  const tierStyle = TIER_STYLES[result.tierId] ?? "bg-slate-100 text-slate-800 border-slate-300";
  const diffYears = result.healthAge - result.chronologicalAge;
  const cta = copy.ctaByTier[result.tierId] ?? copy.ctaByTier["silent-slide"];
  const closingBullet = result.hasTrainingEffort
    ? copy.explanationClosingBullet.someEffort
    : copy.explanationClosingBullet.noEffort;

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-16">
      <div className="w-full max-w-xl">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-lg text-slate-600">
            {copy.realAgeSentence(result.chronologicalAge)}
          </p>
          <p className="mt-3 text-4xl font-bold text-accent sm:text-5xl">
            {copy.bodyAgeSentence(result.healthAge)}
          </p>
          <p className="mt-3 text-base text-slate-500">
            {copy.differenceSentence(diffYears)}
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <span
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${tierStyle}`}
          >
            {result.tierLabel}
          </span>
        </div>

        <p className="mt-4 text-center text-slate-600">{result.tierDescription}</p>

        {result.tierId !== "ahead" && (
          <p className="mt-4 text-center text-slate-600">{copy.worseningLine}</p>
        )}

        {result.topFactors.length > 0 && (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-ink">{copy.explanationHeadline}</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {result.topFactors.map((factor) => (
                <li key={factor.questionId} className="flex items-start gap-3">
                  <span className="mt-1 text-accent">•</span>
                  <span className="text-slate-600">{factor.explanation}</span>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <span className="mt-1 text-accent">•</span>
                <span className="text-slate-600">{closingBullet}</span>
              </li>
            </ul>
          </div>
        )}

        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 text-center">
          <h3 className="text-lg font-semibold text-ink">{cta.headline}</h3>
          <p className="mt-3 text-slate-600">{cta.body}</p>
          <p className="mt-4 text-sm font-medium text-slate-500">{cta.preButtonNote}</p>
          <a
            href={copy.ctaButtonHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block w-full rounded-lg bg-ink px-8 py-4 text-lg font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
          >
            {copy.ctaButton}
          </a>
        </div>
      </div>
    </div>
  );
}
