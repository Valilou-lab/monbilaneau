/**
 * Funnel events pushed to `window.dataLayer` (GTM / cockpit).
 * Never put personal data (email, phone, name) in event properties.
 */

export type FunnelEvent =
  | "funnel_start"
  | "step_view"
  | "step_answer"
  | "eligibility_requested"
  | "eligibility_result"
  | "otp_requested"
  | "lead_submitted"
  | "lead_error";

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

const SESSION_KEY = "mbe-funnel-session";

export function getFunnelSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return "no-storage";
  }
}

export function track(event: FunnelEvent, props: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event, funnel_session_id: getFunnelSessionId(), ...props });
}
