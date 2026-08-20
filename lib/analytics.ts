import { track } from "@vercel/analytics";

// Thin wrapper around Vercel Analytics custom events. If GTM gets added
// later, push to window.dataLayer here too so every call site picks it up
// automatically without further changes.
export function trackEvent(
  name: string,
  properties?: Record<string, string | number | boolean>
) {
  track(name, properties);
}
