export type UtmParams = Partial<
  Record<"utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term", string>
>;

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

// Reads whatever UTM params a visitor arrived with (e.g. from a RevTrack
// video link) so they can be attached to the lead sent to GHL for
// video/campaign attribution.
export function getUtmParamsFromLocation(): UtmParams {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const utm: UtmParams = {};

  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }

  return utm;
}
