"use client";

import { buildV2PartnerConsentText } from "@/lib/consent";
import { getV2PartnerById, getV2PartnerPrivacyPolicyUrl, resolveV2PartnersFromIds } from "@/lib/partners-registry";
import { FormNavigation } from "./FormNavigation";
import { ERROR, INPUT, LABEL } from "./formStyles";
import type { EligiblePartner, FieldErrors, QuoteFormData } from "./types";

type Props = {
  partners: EligiblePartner[];
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  onPatch: (patch: Partial<QuoteFormData>) => void;
  onConfirm: () => void;
};

function PartnerOfferBadge() {
  return (
    <p className="mt-2 flex items-start justify-center gap-1 text-center text-[0.72rem] font-semibold leading-snug text-emerald-700 sm:text-[0.8rem]">
      <span aria-hidden className="mt-[1px] inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[0.6rem] font-bold text-white">
        ✓
      </span>
      <span>Peut vous proposer un devis</span>
    </p>
  );
}

/**
 * Post-eligibility: partners returned by the API + identity + dynamic consent.
 * Same layout as the Couverture Mutuelle V2 « Ces organismes peuvent vous proposer des devis ».
 */
export function StepEligiblePartners({ partners, data, errors, disabled = false, onPatch, onConfirm }: Props) {
  const safePartners = resolveV2PartnersFromIds(partners.map((p) => p.id));
  // Display preview only — the authoritative text is rebuilt in /api/v2/leads.
  const consentText = buildV2PartnerConsentText(safePartners);
  const privacyPartners = safePartners.filter((partner) => partner.privacyPolicyUrl);
  const dossierReady = Boolean(data.firstName.trim()) && Boolean(data.lastName.trim()) && data.consent;
  const gridCols =
    safePartners.length <= 1 ? "grid-cols-1 max-w-[12rem] mx-auto" : safePartners.length === 2 ? "grid-cols-2" : "grid-cols-3";

  if (safePartners.length === 0) {
    return (
      <div className="py-2 text-center">
        <h2 className="text-balance text-[1.3rem] font-extrabold leading-tight tracking-[-0.02em] text-brand-deep sm:text-[1.5rem]">
          Aucun professionnel disponible pour le moment
        </h2>
        <p className="mt-4 rounded-[18px] border border-brand-muted bg-brand-soft px-4 py-4 text-[0.98rem] text-brand-deep">
          Nous n’avons pas encore de professionnel partenaire pour votre projet dans votre secteur. Vos coordonnées n’ont été
          transmises à personne.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-balance text-center text-[1.3rem] font-extrabold leading-tight tracking-[-0.02em] text-brand-deep sm:text-[1.5rem]">
        {safePartners.length > 1 ? "Ces professionnels peuvent vous proposer un devis" : "Ce professionnel peut vous proposer un devis"}
      </h2>

      <ul className={`mt-5 grid gap-2 sm:gap-3 ${gridCols}`}>
        {safePartners.map((partner) => {
          const logo = getV2PartnerById(partner.id)?.logo;
          const privacyUrl = getV2PartnerPrivacyPolicyUrl(partner.id);
          return (
            <li
              key={partner.id}
              className="flex flex-col rounded-[18px] border border-brand-muted bg-white px-2 py-3 shadow-[0_6px_18px_-14px_rgba(3,105,161,0.3)] sm:px-3"
            >
              <div className="flex h-12 items-center justify-center sm:h-14">
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- partner logos
                  <img src={logo} alt={partner.name} className="h-full w-full object-contain" draggable={false} />
                ) : (
                  <span className="text-center text-[1.15rem] font-extrabold tracking-[-0.01em] text-brand-deep sm:text-[1.3rem]">
                    {partner.name}
                  </span>
                )}
              </div>
              {logo ? <p className="mt-1.5 text-center text-[0.8rem] font-semibold leading-tight text-brand-deep">{partner.name}</p> : null}
              <PartnerOfferBadge />
              {privacyUrl ? (
                <a
                  href={privacyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-center text-[0.7rem] font-medium text-zinc-500 underline-offset-2 hover:text-brand hover:underline"
                >
                  Protection de vos données&nbsp;↗
                </a>
              ) : null}
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex gap-3 rounded-[18px] border border-brand-muted bg-brand-soft px-3.5 py-3.5 text-left sm:px-4">
        <span aria-hidden className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="text-[0.98rem] font-bold text-brand-deep">Vous gardez le contrôle</p>
          <p className="mt-1 text-[0.85rem] leading-snug text-zinc-600 sm:text-[0.9rem]">
            Vos coordonnées seront transmises uniquement {safePartners.length > 1 ? "aux professionnels affichés" : "au professionnel affiché"}{" "}
            ci-dessus, et seulement si vous cochez la case ci-dessous, pour votre projet de traitement de l’eau.
          </p>
        </div>
      </div>

      <h3 className="mt-5 text-center text-[1.2rem] font-extrabold tracking-[-0.02em] text-brand-deep sm:text-[1.3rem]">On finalise&nbsp;!</h3>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className={LABEL}>
            Prénom
          </label>
          <input
            id="firstName"
            autoComplete="given-name"
            value={data.firstName}
            disabled={disabled}
            onChange={(event) => onPatch({ firstName: event.target.value })}
            className={INPUT}
          />
          {errors.firstName ? (
            <p className={ERROR} role="alert">
              {errors.firstName}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="lastName" className={LABEL}>
            Nom
          </label>
          <input
            id="lastName"
            autoComplete="family-name"
            value={data.lastName}
            disabled={disabled}
            onChange={(event) => onPatch({ lastName: event.target.value })}
            className={INPUT}
          />
          {errors.lastName ? (
            <p className={ERROR} role="alert">
              {errors.lastName}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 rounded-[18px] border-2 border-brand-muted bg-brand-soft p-4 text-[0.98rem] leading-relaxed text-foreground">
        <div className="flex items-start gap-3">
          <input
            id="consent-opt-in"
            type="checkbox"
            checked={data.consent}
            disabled={disabled}
            onChange={(event) => onPatch({ consent: event.target.checked })}
            className="mt-[3px] h-6 w-6 shrink-0 accent-brand"
          />
          <div className="min-w-0">
            <label htmlFor="consent-opt-in" className="cursor-pointer">
              {consentText}
            </label>
            {privacyPartners.length > 0 ? (
              <p className="mt-2 text-[0.8125rem] leading-snug text-zinc-500">
                Politiques de protection des données&nbsp;:{" "}
                {privacyPartners.map((partner, index) => (
                  <span key={partner.id}>
                    {index > 0 ? " · " : null}
                    <a
                      href={partner.privacyPolicyUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-zinc-600 underline underline-offset-2 hover:text-brand"
                    >
                      {partner.name}
                    </a>
                  </span>
                ))}
              </p>
            ) : null}
            <p className="mt-2 text-[0.8125rem] leading-snug text-zinc-500">
              Consentement valable 12 mois, retirable à tout moment.{" "}
              <a href="/politique-de-confidentialite" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-brand">
                Politique de confidentialité
              </a>
              .
            </p>
          </div>
        </div>
      </div>
      {errors.consent ? (
        <p className={ERROR} role="alert">
          {errors.consent}
        </p>
      ) : null}

      <FormNavigation onNext={onConfirm} nextLabel="Envoyer ma demande" disabled={disabled || !dossierReady} canContinue={dossierReady} />
      {!dossierReady ? (
        <p className="mt-2 text-center text-[0.8125rem] leading-snug text-zinc-500">
          Indiquez votre prénom, votre nom, puis acceptez le consentement pour activer le bouton.
        </p>
      ) : null}
    </div>
  );
}
