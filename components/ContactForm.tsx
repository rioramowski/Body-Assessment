import { FormEvent, useState } from "react";
import { COPY } from "@/config/copy";
import { QUALIFYING_QUESTIONS } from "@/config/questions";
import { QualifyingAnswers } from "@/lib/types";

export default function ContactForm({
  isSubmitting,
  errorMessage,
  onSubmit,
  onBack,
}: {
  isSubmitting: boolean;
  errorMessage: string | null;
  onSubmit: (contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    qualifying: QualifyingAnswers;
    honeypot: string;
  }) => void;
  onBack: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [qualifying, setQualifying] = useState<QualifyingAnswers>({});
  const [honeypot, setHoneypot] = useState("");
  const { contact } = COPY;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ firstName, lastName, email, phone, qualifying, honeypot });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-semibold text-ink sm:text-3xl">
          {contact.headline}
        </h2>
        <p className="mt-2 text-slate-600">{contact.subheadline}</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {contact.firstNameLabel}
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={contact.firstNamePlaceholder}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-ink focus:border-ink focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {contact.lastNameLabel}
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={contact.lastNamePlaceholder}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-ink focus:border-ink focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {contact.emailLabel}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={contact.emailPlaceholder}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-ink focus:border-ink focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {contact.phoneLabel}
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={contact.phonePlaceholder}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-ink focus:border-ink focus:outline-none"
            />
          </div>

          {QUALIFYING_QUESTIONS.map((question) => (
            <div key={question.id}>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {question.label}
              </label>
              <select
                required
                value={qualifying[question.id] ?? ""}
                onChange={(e) =>
                  setQualifying((prev) => ({ ...prev, [question.id]: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-ink focus:border-ink focus:outline-none"
              >
                <option value="" disabled>
                  {contact.selectPlaceholder}
                </option>
                {question.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Honeypot: hidden from real users, bots tend to fill every field. */}
          <input
            type="text"
            name="company_website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
            aria-hidden="true"
          />

          {errorMessage && (
            <p className="text-sm font-medium text-red-600">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg bg-ink px-8 py-4 text-lg font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? contact.submittingButton : contact.submitButton}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          {contact.privacyNote}
        </p>

        <button
          onClick={onBack}
          className="mt-6 block text-sm font-medium text-slate-500 hover:text-ink"
        >
          ← {COPY.quiz.backButton}
        </button>
      </div>
    </div>
  );
}
