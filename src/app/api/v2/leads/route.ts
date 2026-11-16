import { NextResponse } from "next/server";
import { buildV2ConsentRecord } from "@/lib/consent";
import { verifyV2EligibilityToken } from "@/lib/eligibility-token";
import type { V2LeadErrorResponse, V2LeadRequestBody, V2LeadResponse } from "@/lib/lead-types";
import { isDemoMode, resolveV2PartnersFromIds } from "@/lib/partners-registry";

export const runtime = "nodejs";

function fail(error: string, code: V2LeadErrorResponse["code"], status = 400) {
  return NextResponse.json({ success: false, error, code } satisfies V2LeadErrorResponse, { status });
}

/**
 * Lead endpoint.
 * Validates the eligibility token + partner allowlist and rebuilds the consent
 * text server-side (proof: text, version, partners, timestamp).
 *
 * DEMO: nothing is sent to any partner.
 * LIVE (to wire): store the lead + consent proof, POST it to the buyer API,
 * then push `lead_delivered` / `lead_rejected` to the performance cockpit.
 */
export async function POST(request: Request) {
  let body: V2LeadRequestBody;
  try {
    body = (await request.json()) as V2LeadRequestBody;
  } catch {
    return fail("Corps de requête invalide.", "INVALID_BODY");
  }

  if (!body?.form || !body.meta || !body.eligibilityToken) {
    return fail("Champs obligatoires manquants.", "INVALID_BODY");
  }
  if (!body.partnerConsentGiven) {
    return fail("Le consentement est requis pour transmettre votre demande.", "CONSENT_REQUIRED");
  }

  const tokenResult = verifyV2EligibilityToken(body.eligibilityToken);
  if (!tokenResult.ok) {
    return tokenResult.reason === "expired"
      ? fail("La vérification a expiré. Relancez la recherche.", "ELIGIBILITY_TOKEN_EXPIRED")
      : fail("Preuve d’éligibilité invalide.", "ELIGIBILITY_TOKEN_INVALID");
  }

  const partners = resolveV2PartnersFromIds(tokenResult.payload.partnerIds);
  if (partners.length === 0) {
    return fail("Aucun professionnel autorisé pour cette demande.", "PARTNERS_MISMATCH");
  }

  const tokenIds = new Set<string>(tokenResult.payload.partnerIds);
  const displayed = Array.isArray(body.displayedPartnerIds)
    ? body.displayedPartnerIds.filter((id): id is string => typeof id === "string")
    : [];
  if (displayed.some((id) => !tokenIds.has(id))) {
    return fail("La liste des professionnels ne correspond pas à la vérification.", "PARTNERS_MISMATCH");
  }

  const consent = buildV2ConsentRecord(partners, new Date().toISOString());
  const leadId = crypto.randomUUID();

  // LIVE: persist { leadId, form, meta (UTM / session), consent, ip, userAgent } and deliver to buyers.

  return NextResponse.json({
    success: true,
    mode: isDemoMode() ? "demo" : "live",
    leadId,
    consent,
  } satisfies V2LeadResponse);
}
