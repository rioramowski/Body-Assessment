"use client";

import { useEffect, useRef, useState } from "react";
import { COPY } from "@/config/copy";
import { trackEvent } from "@/lib/analytics";

interface Slot {
  startTime: string;
  endTime: string;
}

interface DaySlots {
  date: string;
  slots: Slot[];
}

type Status = "loading" | "ready" | "empty" | "booking" | "confirmed" | "error";

function formatDateLabel(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTimeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export default function BookingFlow({
  bookingContact,
  tierId,
  onBack,
}: {
  bookingContact: { firstName: string; lastName: string; email: string; phone: string };
  tierId: string;
  onBack?: () => void;
}) {
  const { booking: copy } = COPY;
  const [status, setStatus] = useState<Status>("loading");
  const [days, setDays] = useState<DaySlots[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedSlot, setConfirmedSlot] = useState<Slot | null>(null);
  // Guards against a rapid double-click booking two slots before the first
  // request resolves, the same pattern used for the quiz's double-click fix.
  const bookingRef = useRef(false);
  const timezone = useRef(
    typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC"
  ).current;

  useEffect(() => {
    fetchSlots();
  }, []);

  async function fetchSlots() {
    setStatus("loading");
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/booking/slots?days=10&timezone=${encodeURIComponent(timezone)}`);
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error ?? copy.loadError);
        setStatus("error");
        return;
      }

      const fetchedDays: DaySlots[] = data.days ?? [];
      setDays(fetchedDays);
      setSelectedDate(fetchedDays[0]?.date ?? null);
      setStatus(fetchedDays.length > 0 ? "ready" : "empty");
    } catch {
      setErrorMessage(copy.loadError);
      setStatus("error");
    }
  }

  async function handleBookSlot(slot: Slot) {
    if (bookingRef.current) return;
    bookingRef.current = true;
    setStatus("booking");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/booking/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...bookingContact, startTime: slot.startTime }),
      });
      const data = await res.json();

      if (!res.ok) {
        bookingRef.current = false;
        if (res.status === 409) {
          setErrorMessage(data.error ?? copy.slotTakenError);
          setStatus("ready");
          await fetchSlots();
        } else {
          setErrorMessage(data.error ?? copy.bookError);
          setStatus("error");
        }
        return;
      }

      trackEvent("call_booked", { tier: tierId });
      setConfirmedSlot(slot);
      setStatus("confirmed");
    } catch {
      bookingRef.current = false;
      setErrorMessage(copy.bookError);
      setStatus("error");
    }
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 py-16 text-center text-slate-600">
        {copy.loadingLabel}
      </div>
    );
  }

  if (status === "confirmed" && confirmedSlot) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8">
          <h2 className="text-2xl font-semibold text-ink">{copy.confirmedHeadline}</h2>
          <p className="mt-3 text-slate-600">
            {copy.confirmedBody(
              formatDateLabel(selectedDate ?? ""),
              formatTimeLabel(confirmedSlot.startTime)
            )}
          </p>
        </div>
      </div>
    );
  }

  const selectedDay = days.find((day) => day.date === selectedDate);

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-16">
      <div className="w-full max-w-xl">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-6 text-sm font-medium text-slate-500 hover:text-ink"
          >
            ← {copy.backButton}
          </button>
        )}

        <h2 className="text-2xl font-semibold text-ink sm:text-3xl">{copy.headline}</h2>
        <p className="mt-2 text-slate-600">{copy.subheadline}</p>

        {status === "error" && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">{errorMessage ?? copy.bookError}</p>
            <button
              onClick={fetchSlots}
              className="mt-3 text-sm font-semibold text-red-700 underline"
            >
              {copy.retryButton}
            </button>
          </div>
        )}

        {status === "empty" && <p className="mt-8 text-slate-600">{copy.emptyState}</p>}

        {(status === "ready" || status === "booking") && days.length > 0 && (
          <>
            <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
              {days.map((day) => (
                <button
                  key={day.date}
                  onClick={() => setSelectedDate(day.date)}
                  disabled={status === "booking"}
                  className={`shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    selectedDate === day.date
                      ? "border-ink bg-ink text-white"
                      : "border-slate-200 bg-white text-ink hover:border-slate-400"
                  }`}
                >
                  {formatDateLabel(day.date)}
                </button>
              ))}
            </div>

            {errorMessage && (
              <p className="mt-4 text-sm font-medium text-amber-600">{errorMessage}</p>
            )}

            {status === "booking" && (
              <p className="mt-4 text-sm text-slate-500">{copy.bookingLabel}</p>
            )}

            <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {selectedDay?.slots.map((slot) => (
                <button
                  key={slot.startTime}
                  onClick={() => handleBookSlot(slot)}
                  disabled={status === "booking"}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-ink transition hover:border-ink disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {formatTimeLabel(slot.startTime)}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
