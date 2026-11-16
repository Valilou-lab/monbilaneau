import { NextResponse } from "next/server";
import { createV2EligibilityToken } from "@/lib/eligibility-token";
import { getMockEligiblePartners } from "@/lib/partners-registry";

export const runtime = "nodejs";

/**
 * Eligibility = « to whom can this lead be sold? ».
 * Called after e-mail + phone, before any consent.
 *
 * DEMO: returns Culligan + Kinetico for every request.
 *
 * LIVE (to wire): call the buyer / lead-distribution API here (ping), then map
 * the buyer ids to `V2_PARTNERS_REGISTRY`. Recommendation: send the buyers only
 * non-identifying criteria at this stage (needs, housing, occupancy, household,
 * postal code). E-mail and phone stay on our server until the consent box is
 * ticked — use a hash if the buyer needs it for deduplication.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    const parsed = (await request.json()) as unknown;
    if (parsed && typeof parsed === "object") body = parsed as Record<string, unknown>;
  } catch {
    // Empty body accepted in demo mode.
  }

  const criteria = {
    needs: Array.isArray(body.needs) ? body.needs.join(",") : "",
    housing: body.housing,
    occupancy: body.occupancy,
    household: body.household,
    postalCode: body.postalCode,
  };

  const partners = getMockEligiblePartners();
  const eligibilityToken = createV2EligibilityToken({
    partnerIds: partners.map((partner) => partner.id),
    criteria,
  });

  return NextResponse.json({
    eligible: partners.length > 0,
    partners: partners.map((partner) => ({ id: partner.id, name: partner.name })),
    eligibilityToken,
  });
}
