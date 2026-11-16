/**
 * First-touch acquisition capture (UTM + click ids), stored 90 days.
 * Sent with the lead so the cockpit can attribute source / campaign.
 */

export const ACQUISITION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
  "ttclid",
] as const;

export type AcquisitionKey = (typeof ACQUISITION_KEYS)[number];
export type AcquisitionParams = Partial<Record<AcquisitionKey, string>>;

export type StoredAcquisition = {
  landingPageUrl: string;
  referrer: string;
  capturedAt: string;
  acquisition: AcquisitionParams;
};

const STORAGE_KEY = "mbe-acquisition-first-touch-v1";
const TTL_MS = 90 * 24 * 60 * 60 * 1000;
let memoryStore: StoredAcquisition | null = null;

function read(): StoredAcquisition | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return memoryStore;
    const parsed = JSON.parse(raw) as StoredAcquisition;
    if (Date.now() - Date.parse(parsed.capturedAt) > TTL_MS) return null;
    return parsed;
  } catch {
    return memoryStore;
  }
}

function write(value: StoredAcquisition) {
  memoryStore = value;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Private mode: keep the in-memory copy only.
  }
}

/** Call once on page load. A new visit with UTM params replaces the stored touch. */
export function captureAcquisition() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const acquisition: AcquisitionParams = {};
  for (const key of ACQUISITION_KEYS) {
    const value = params.get(key)?.trim();
    if (value) acquisition[key] = value.slice(0, 200);
  }
  const existing = read();
  if (existing && Object.keys(acquisition).length === 0) return;
  write({
    landingPageUrl: window.location.href,
    referrer: document.referrer,
    capturedAt: new Date().toISOString(),
    acquisition,
  });
}

export function getStoredAcquisition(): StoredAcquisition {
  const stored = typeof window === "undefined" ? null : read();
  return (
    stored ?? {
      landingPageUrl: typeof window === "undefined" ? "" : window.location.href,
      referrer: typeof document === "undefined" ? "" : document.referrer,
      capturedAt: new Date().toISOString(),
      acquisition: {},
    }
  );
}
