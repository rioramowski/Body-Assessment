import { COPY } from "@/config/copy";

export default function Landing({ onStart }: { onStart: () => void }) {
  const { landing } = COPY;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">
          {landing.eyebrow}
        </p>
        <h1 className="text-3xl font-bold leading-tight text-ink sm:text-4xl md:text-5xl">
          {landing.headline}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600">
          {landing.subheadline}
        </p>

        <ul className="mx-auto mt-8 flex max-w-md flex-col gap-2 text-left text-slate-600">
          {landing.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2">
              <span className="mt-1 text-accent">✓</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={onStart}
          className="mt-10 w-full rounded-lg bg-ink px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-slate-800 sm:w-auto"
        >
          {landing.startButton}
        </button>

        <p className="mx-auto mt-8 max-w-md text-xs text-slate-400">
          {landing.disclaimer}
        </p>
      </div>
    </div>
  );
}
