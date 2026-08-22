/*
 * Standalone booking widget for embedding on the external GHL-hosted
 * /apply page (a different origin, not part of this Next.js app). Plain
 * vanilla JS, no build step, served as-is from /embed/booking-widget.js.
 *
 * Mirrors components/BookingFlow.tsx: same state machine, same
 * instant-book-on-click behavior, same double-click guard, same explicit
 * loading/empty/error/confirmed states. Calls the same two API routes
 * (app/api/booking/slots, app/api/booking/book) that back the in-app
 * booking flow, so booking logic itself is never duplicated here, only
 * the presentation. Reads first_name/last_name/email/phone from the page
 * URL, the same prefill convention already used on this page.
 *
 * Usage on the GHL page:
 *   <div id="polarity-booking-widget"></div>
 *   <script src="https://quiz.polarity-fitness.com/embed/booking-widget.js" defer></script>
 */
(function () {
  "use strict";

  var API_BASE = "https://quiz.polarity-fitness.com";
  var CONTAINER_ID = "polarity-booking-widget";

  var COPY = {
    loadingLabel: "Loading available times...",
    bookingLabel: "Booking your call...",
    emptyState: "No times are available right now. Please contact us directly to book your call.",
    loadError: "Couldn't load available times. Please try again.",
    slotTakenError: "That time was just taken. Please pick another.",
    bookError: "Couldn't book that call. Please try again.",
    retryButton: "Try again",
    confirmedHeadline: "You're booked!",
    confirmedBody: function (dateLabel, timeLabel) {
      return "Your Rebuild Call is confirmed for " + dateLabel + " at " + timeLabel + ". We'll see you then.";
    },
  };

  var STYLE = [
    "@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');",
    "#" + CONTAINER_ID + "{max-width:36rem;margin:0 auto;padding:2rem;font-family:'Poppins',-apple-system,sans-serif;background:#fff;border-radius:.75rem;border:1px solid #e2e8f0;box-shadow:0 4px 16px rgba(0,0,0,.15);}",
    "#" + CONTAINER_ID + " .pbw-loading,#" + CONTAINER_ID + " .pbw-empty{color:#475569;text-align:center;padding:2rem 0;}",
    "#" + CONTAINER_ID + " .pbw-error{border:1px solid #fecaca;background:#fef2f2;border-radius:.5rem;padding:1rem;margin-bottom:1rem;}",
    "#" + CONTAINER_ID + " .pbw-error p{color:#b91c1c;font-weight:500;font-size:.875rem;margin:0 0 .5rem;}",
    "#" + CONTAINER_ID + " .pbw-error button{color:#b91c1c;font-weight:600;font-size:.875rem;text-decoration:underline;background:none;border:none;padding:0;cursor:pointer;}",
    "#" + CONTAINER_ID + " .pbw-inline-error{color:#d97706;font-weight:500;font-size:.875rem;margin:0 0 1rem;}",
    "#" + CONTAINER_ID + " .pbw-booking-label{color:#475569;font-size:.875rem;margin:0 0 1rem;}",
    "#" + CONTAINER_ID + " .pbw-days{display:flex;gap:.5rem;overflow-x:auto;padding-bottom:.5rem;margin-bottom:1rem;}",
    "#" + CONTAINER_ID + " .pbw-day{flex-shrink:0;border-radius:.5rem;border:1px solid #e2e8f0;background:#fff;color:#0f172a;padding:.5rem 1rem;font-size:.875rem;font-weight:500;cursor:pointer;}",
    "#" + CONTAINER_ID + " .pbw-day.pbw-selected{border-color:#0f172a;background:#0f172a;color:#fff;}",
    "#" + CONTAINER_ID + " .pbw-day:disabled,#" + CONTAINER_ID + " .pbw-slot:disabled{cursor:not-allowed;opacity:.6;}",
    "#" + CONTAINER_ID + " .pbw-slots{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;}",
    "@media(min-width:640px){#" + CONTAINER_ID + " .pbw-slots{grid-template-columns:repeat(4,1fr);}}",
    "#" + CONTAINER_ID + " .pbw-slot{border-radius:.5rem;border:1px solid #e2e8f0;background:#fff;color:#0f172a;padding:.75rem;font-size:.875rem;font-weight:500;cursor:pointer;}",
    "#" + CONTAINER_ID + " .pbw-slot:hover:not(:disabled){border-color:#0f172a;}",
    "#" + CONTAINER_ID + " .pbw-confirmed{border:1px solid #e2e8f0;border-radius:.75rem;background:#fff;padding:2rem;text-align:center;}",
    "#" + CONTAINER_ID + " .pbw-confirmed h2{font-size:1.5rem;font-weight:600;color:#0f172a;margin:0 0 .75rem;}",
    "#" + CONTAINER_ID + " .pbw-confirmed p{color:#475569;margin:0;}",
  ].join("");

  function injectStyle() {
    var style = document.createElement("style");
    style.textContent = STYLE;
    document.head.appendChild(style);
  }

  function getContactFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return {
      firstName: params.get("first_name") || "",
      lastName: params.get("last_name") || "",
      email: params.get("email") || "",
      phone: params.get("phone") || "",
    };
  }

  function formatDateLabel(dateStr) {
    var date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  }

  function formatTimeLabel(iso) {
    return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (key === "class") node.className = attrs[key];
        else if (key === "text") node.textContent = attrs[key];
        else node.setAttribute(key, attrs[key]);
      });
    }
    (children || []).forEach(function (child) {
      node.appendChild(child);
    });
    return node;
  }

  function BookingWidget(container, contact) {
    var state = {
      status: "loading", // loading | ready | empty | booking | confirmed | error
      days: [],
      selectedDate: null,
      errorMessage: null,
      confirmedSlot: null,
    };
    var isBooking = false; // double-click guard, same role as bookingRef in BookingFlow.tsx
    var timezone = Intl && Intl.DateTimeFormat ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC";

    function setState(patch) {
      Object.keys(patch).forEach(function (key) {
        state[key] = patch[key];
      });
      render();
    }

    function fetchSlots() {
      setState({ status: "loading", errorMessage: null });
      fetch(API_BASE + "/api/booking/slots?days=10&timezone=" + encodeURIComponent(timezone))
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          if (!result.ok) {
            setState({ status: "error", errorMessage: (result.data && result.data.error) || COPY.loadError });
            return;
          }
          var days = (result.data && result.data.days) || [];
          setState({
            days: days,
            selectedDate: days.length > 0 ? days[0].date : null,
            status: days.length > 0 ? "ready" : "empty",
          });
        })
        .catch(function () {
          setState({ status: "error", errorMessage: COPY.loadError });
        });
    }

    function handleBookSlot(slot) {
      if (isBooking) return;
      isBooking = true;
      setState({ status: "booking", errorMessage: null });

      fetch(API_BASE + "/api/booking/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          startTime: slot.startTime,
        }),
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, status: res.status, data: data };
          });
        })
        .then(function (result) {
          if (!result.ok) {
            isBooking = false;
            if (result.status === 409) {
              setState({ status: "ready", errorMessage: (result.data && result.data.error) || COPY.slotTakenError });
              fetchSlots();
            } else {
              setState({ status: "error", errorMessage: (result.data && result.data.error) || COPY.bookError });
            }
            return;
          }
          setState({ status: "confirmed", confirmedSlot: slot });
        })
        .catch(function () {
          isBooking = false;
          setState({ status: "error", errorMessage: COPY.bookError });
        });
    }

    function render() {
      container.innerHTML = "";

      if (state.status === "loading") {
        container.appendChild(el("div", { class: "pbw-loading", text: COPY.loadingLabel }));
        return;
      }

      if (state.status === "confirmed" && state.confirmedSlot) {
        var confirmedWrap = el("div", { class: "pbw-confirmed" }, [
          el("h2", { text: COPY.confirmedHeadline }),
          el("p", {
            text: COPY.confirmedBody(
              formatDateLabel(state.selectedDate || ""),
              formatTimeLabel(state.confirmedSlot.startTime)
            ),
          }),
        ]);
        container.appendChild(confirmedWrap);
        return;
      }

      var root = el("div", {});

      if (state.status === "error") {
        var retryBtn = el("button", { text: COPY.retryButton });
        retryBtn.addEventListener("click", fetchSlots);
        root.appendChild(
          el("div", { class: "pbw-error" }, [el("p", { text: state.errorMessage || COPY.bookError }), retryBtn])
        );
        container.appendChild(root);
        return;
      }

      if (state.status === "empty") {
        root.appendChild(el("p", { class: "pbw-empty", text: COPY.emptyState }));
        container.appendChild(root);
        return;
      }

      if (state.days.length > 0) {
        var daysWrap = el("div", { class: "pbw-days" });
        state.days.forEach(function (day) {
          var dayBtn = el("button", {
            class: "pbw-day" + (day.date === state.selectedDate ? " pbw-selected" : ""),
            text: formatDateLabel(day.date),
          });
          if (state.status === "booking") dayBtn.disabled = true;
          dayBtn.addEventListener("click", function () {
            setState({ selectedDate: day.date });
          });
          daysWrap.appendChild(dayBtn);
        });
        root.appendChild(daysWrap);

        if (state.errorMessage) {
          root.appendChild(el("p", { class: "pbw-inline-error", text: state.errorMessage }));
        }
        if (state.status === "booking") {
          root.appendChild(el("p", { class: "pbw-booking-label", text: COPY.bookingLabel }));
        }

        var selectedDay = state.days.filter(function (day) {
          return day.date === state.selectedDate;
        })[0];
        var slotsWrap = el("div", { class: "pbw-slots" });
        (selectedDay ? selectedDay.slots : []).forEach(function (slot) {
          var slotBtn = el("button", { class: "pbw-slot", text: formatTimeLabel(slot.startTime) });
          if (state.status === "booking") slotBtn.disabled = true;
          slotBtn.addEventListener("click", function () {
            handleBookSlot(slot);
          });
          slotsWrap.appendChild(slotBtn);
        });
        root.appendChild(slotsWrap);
      }

      container.appendChild(root);
    }

    fetchSlots();
  }

  function init() {
    var container = document.getElementById(CONTAINER_ID);
    if (!container) {
      console.warn("[polarity-booking-widget] container #" + CONTAINER_ID + " not found, skipping.");
      return;
    }
    injectStyle();
    BookingWidget(container, getContactFromUrl());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
