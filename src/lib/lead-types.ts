import type { QuoteFormData } from "@/components/form/types";
import type { StoredAcquisition } from "./acquisition";
import type { V2ConsentRecord } from "./consent";

/** Client → `POST /api/v2/leads`. */
export type V2LeadRequestBody = {
  form: Partial<QuoteFormData>;
  meta: StoredAcquisition & { funnelSessionId: string };
  /** Opaque proof from `/api/v2/eligibility`. */
  eligibilityToken: string;
  /** Partner ids the UI showed; server re-resolves from token + allowlist. */
  displayedPartnerIds: string[];
  /** Checkbox must be true; text is rebuilt server-side. */
  partnerConsentGiven: boolean;
};

export type V2LeadResponse = {
  success: true;
  mode: "demo" | "live";
  leadId: string;
  consent: V2ConsentRecord;
};

export type V2LeadErrorResponse = {
  success: false;
  error: string;
  code?:
    | "INVALID_BODY"
    | "CONSENT_REQUIRED"
    | "ELIGIBILITY_TOKEN_INVALID"
    | "ELIGIBILITY_TOKEN_EXPIRED"
    | "PARTNERS_MISMATCH";
};
