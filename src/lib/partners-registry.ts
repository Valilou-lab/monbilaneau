/**
 * Server allowlist of lead buyers (partners).
 * The browser may only display partners returned by `/api/v2/eligibility`
 * (resolved from this registry). It cannot invent ids, names or privacy URLs.
 *
 * Production rule: a partner without an official `privacyPolicyUrl` is never
 * distributable. Demo partners are only distributable while DEMO mode is on
 * (`NEXT_PUBLIC_DEMO_MODE` !== "false") and no lead is ever sent to them.
 */

export type V2PartnerContactChannel = "phone" | "email" | "sms";

export type V2PartnerId = "culligan" | "kinetico";

export type V2PartnerUniverse = "adoucisseur" | "osmoseur" | "filtration";

export type V2RegisteredPartner = {
  id: V2PartnerId;
  name: string;
  legalName?: string;
  /** Logo file in /public — add only with the partner's written approval. */
  logo?: string;
  websiteUrl: string;
  /** Official privacy policy URL — TO FILL from the partner contract. */
  privacyPolicyUrl: string | null;
  contactChannels: V2PartnerContactChannel[];
  universes: V2PartnerUniverse[];
  active: boolean;
  /** Demo-only entry: shown on the demo, never receives a real lead. */
  demo: boolean;
};

export const V2_PARTNERS_REGISTRY: Record<V2PartnerId, V2RegisteredPartner> = {
  culligan: {
    id: "culligan",
    name: "Culligan",
    websiteUrl: "https://www.culligan.fr/",
    // TODO: official URL to get from the partner (not verified).
    privacyPolicyUrl: null,
    contactChannels: ["phone", "email"],
    universes: ["adoucisseur", "osmoseur", "filtration"],
    active: true,
    demo: true,
  },
  kinetico: {
    id: "kinetico",
    name: "Kinetico",
    websiteUrl: "https://www.kinetico.fr/",
    // TODO: official URL to get from the partner (not verified).
    privacyPolicyUrl: null,
    contactChannels: ["phone", "email"],
    universes: ["adoucisseur", "osmoseur", "filtration"],
    active: true,
    demo: true,
  },
};

export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
}

export function isV2PartnerId(value: string): value is V2PartnerId {
  return Object.prototype.hasOwnProperty.call(V2_PARTNERS_REGISTRY, value);
}

/** Distributable = active + (official privacy policy, or demo entry in demo mode). */
export function isV2PartnerDistributable(partner: V2RegisteredPartner): boolean {
  if (!partner.active) return false;
  if (partner.demo) return isDemoMode();
  return typeof partner.privacyPolicyUrl === "string" && partner.privacyPolicyUrl.length > 0;
}

export function getV2PartnerById(id: string): V2RegisteredPartner | null {
  if (!isV2PartnerId(id)) return null;
  return V2_PARTNERS_REGISTRY[id];
}

export function getV2PartnerPrivacyPolicyUrl(id: string): string | null {
  const partner = getV2PartnerById(id);
  if (!partner || !isV2PartnerDistributable(partner)) return null;
  return partner.privacyPolicyUrl;
}

/** Resolve allowlisted distributable partners; unknown / inactive ids are dropped. */
export function resolveV2PartnersFromIds(ids: readonly string[]): V2RegisteredPartner[] {
  const seen = new Set<V2PartnerId>();
  const partners: V2RegisteredPartner[] = [];
  for (const raw of ids) {
    if (!isV2PartnerId(raw) || seen.has(raw)) continue;
    const partner = V2_PARTNERS_REGISTRY[raw];
    if (!isV2PartnerDistributable(partner)) continue;
    seen.add(raw);
    partners.push(partner);
  }
  return partners;
}

/** Demo subset until the real buyer API is wired. */
const MOCK_ELIGIBLE_PARTNER_IDS = ["culligan", "kinetico"] as const satisfies readonly V2PartnerId[];

export function getMockEligiblePartners(): V2RegisteredPartner[] {
  return resolveV2PartnersFromIds(MOCK_ELIGIBLE_PARTNER_IDS);
}
