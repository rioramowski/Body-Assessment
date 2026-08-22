"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BookingFlow from "@/components/BookingFlow";

// Same-origin fallback booking page. Reads the same first_name/last_name/
// email/phone URL params the /apply page's prefill mechanism already uses,
// so it can be linked to directly if the embedded widget on that
// GHL-hosted page is ever unavailable. Renders the same BookingFlow used
// everywhere else, no separate booking logic.
function BookPageContent() {
  const searchParams = useSearchParams();
  const firstName = searchParams.get("first_name");
  const lastName = searchParams.get("last_name");
  const email = searchParams.get("email");
  const phone = searchParams.get("phone");

  if (!firstName || !lastName || !email || !phone) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 py-16 text-center text-slate-600">
        Missing booking details. Please use the link provided to you.
      </div>
    );
  }

  return <BookingFlow bookingContact={{ firstName, lastName, email, phone }} tierId="apply_page" />;
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-6 py-16 text-center text-slate-600">
          Loading...
        </div>
      }
    >
      <BookPageContent />
    </Suspense>
  );
}
