"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getStoredAcquisition } from "@/lib/acquisition";
import type { V2LeadErrorResponse, V2LeadRequestBody, V2LeadResponse } from "@/lib/lead-types";
import { normalizeV2PhoneToE164 } from "@/lib/phone";
import { getFunnelSessionId, track } from "@/lib/tracking";
import { FormBackButton } from "./FormBackButton";
import { ProgressBar } from "./ProgressBar";
import { scrollQuoteFormIntoView } from "./scrollQuoteFormIntoView";
import { StepChoice } from "./StepChoice";
import { StepConfirmation } from "./StepConfirmation";
import { StepContact } from "./StepContact";
import { StepEligiblePartners } from "./StepEligiblePartners";
import { StepNeeds } from "./StepNeeds";
import { StepPhoneVerify } from "./StepPhoneVerify";
import { isPostalStepComplete, StepPostal } from "./StepPostal";
import { StepSearching } from "./StepSearching";
import { validateEmailOnServer, validateEmailPhone, EMAIL_INVALID_MESSAGE } from "./emailValidation";
import { IconCle, IconContrat, IconImmeuble, IconMaison, IconPersonnes } from "./icons";
import {
  ELIGIBILITY_MIN_LOADING_MS,
  FLOW_STEPS,
  initialFormData,
  QUESTION_STEPS,
  type EligibilityResponse,
  type EligiblePartner,
  type FieldErrors,
  type HouseholdId,
  type HousingId,
  type OccupancyId,
  type QuoteFormData,
  type StepId,
} from "./types";
import { useLandingFocus } from "./useLandingFocus";

const ADVANCE_DELAY_MS = 320;
const ELIGIBILITY_ERROR = "Impossible de vérifier les disponibilités pour le moment. Merci de réessayer.";

const HOUSING_OPTIONS = [
  { id: "maison" as HousingId, label: "Une maison", icon: <IconMaison /> },
  { id: "appartement" as HousingId, label: "Un appartement", icon: <IconImmeuble /> },
];
const OCCUPANCY_OPTIONS = [
  { id: "proprietaire" as OccupancyId, label: "Propriétaire", icon: <IconCle /> },
  { id: "locataire" as OccupancyId, label: "Locataire", icon: <IconContrat /> },
];
const HOUSEHOLD_OPTIONS = [
  { id: "1" as HouseholdId, label: "1 personne", icon: <IconPersonnes n={1} /> },
  { id: "2" as HouseholdId, label: "2 personnes", icon: <IconPersonnes n={2} /> },
  { id: "3-4" as HouseholdId, label: "3 à 4 personnes", icon: <IconPersonnes n={3} /> },
  { id: "5+" as HouseholdId, label: "5 et plus", icon: <IconPersonnes n={4} /> },
];

/** Front → /api/v2/eligibility. No commercial rule in the browser. */
async function fetchEligiblePartners(payload: Record<string, unknown>) {
  const response = await fetch("/api/v2/eligibility", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(ELIGIBILITY_ERROR);
  const json = (await response.json()) as EligibilityResponse;
  if (typeof json.eligibilityToken !== "string" || !json.eligibilityToken) throw new Error(ELIGIBILITY_ERROR);
  const partners = Array.isArray(json.partners)
    ? json.partners.filter((p): p is EligiblePartner => typeof p?.id === "string" && typeof p?.name === "string")
    : [];
  return { partners, eligibilityToken: json.eligibilityToken };
}

/**
 * OTP — demo adapter: accepts any 6-digit code, sends no SMS.
 * Before go-live: reuse Couverture Mutuelle `/api/verify/start` + `/api/verify/check` (Twilio Verify).
 */
async function verifyOtpDemo(code: string) {
  if (!/^\d{6}$/.test(code)) throw new Error("Saisissez un code à 6 chiffres.");
  await new Promise<void>((resolve) => window.setTimeout(resolve, 600));
}

async function submitLead(input: { data: QuoteFormData; partners: EligiblePartner[]; eligibilityToken: string }) {
  const body: V2LeadRequestBody = {
    form: input.data,
    meta: { ...getStoredAcquisition(), funnelSessionId: getFunnelSessionId() },
    eligibilityToken: input.eligibilityToken,
    displayedPartnerIds: input.partners.map((partner) => partner.id),
    partnerConsentGiven: input.data.consent,
  };
  const response = await fetch("/api/v2/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let payload: V2LeadResponse | V2LeadErrorResponse | null = null;
  try {
    payload = (await response.json()) as V2LeadResponse | V2LeadErrorResponse;
  } catch {
    payload = null;
  }
  if (!response.ok || !payload || payload.success !== true) {
    throw new Error(payload && payload.success === false ? payload.error : "Impossible d’enregistrer votre demande pour le moment.");
  }
  return payload;
}

/**
 * Lead funnel — same mechanics as Couverture Mutuelle `/devis` (QuoteFormV2):
 * questions → e-mail + phone → eligibility API (who buys the lead) → partners +
 * identity + consent → SMS code → confirmation.
 */
export function QuoteForm({ onFocusChange }: { onFocusChange?: (focused: boolean) => void } = {}) {
  const formRootRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<QuoteFormData>(initialFormData);
  const [step, setStep] = useState<StepId>("needs");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [eligibilityError, setEligibilityError] = useState<string | null>(null);
  const [eligiblePartners, setEligiblePartners] = useState<EligiblePartner[]>([]);
  const [eligibilityToken, setEligibilityToken] = useState<string | null>(null);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const questionIndex = QUESTION_STEPS.indexOf(step);
  const showProgress = questionIndex >= 0;
  const flowIndex = FLOW_STEPS.indexOf(step);
  const canGoBack =
    step !== "confirmation" && step !== "phoneVerify" && !(step === "searching" && isCheckingEligibility) && flowIndex > 0;

  // From question 2 on, the rest of the landing is hidden: the visitor stays in the funnel.
  const formFocused = step !== "needs";
  useLandingFocus(formFocused, formRootRef);
  useEffect(() => {
    onFocusChange?.(formFocused);
  }, [formFocused, onFocusChange]);

  useEffect(() => {
    track("step_view", { step_id: step, step_index: flowIndex + 1 });
    if (step === "needs") track("funnel_start");
  }, [step, flowIndex]);

  const patch = useCallback((partial: Partial<QuoteFormData>) => {
    setData((prev) => ({ ...prev, ...partial }));
    setErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(partial) as (keyof QuoteFormData)[]) delete next[key];
      return next;
    });
  }, []);

  const goTo = useCallback((next: StepId) => {
    setStep(next);
    setErrors({});
    setEligibilityError(null);
    setOtpError(null);
    scrollQuoteFormIntoView(formRootRef.current);
  }, []);

  const goBack = useCallback(() => {
    if (isAdvancing || isCheckingEligibility || otpVerifying) return;
    if (step === "eligiblePartners" || step === "searching") {
      goTo("contact");
      return;
    }
    const idx = FLOW_STEPS.indexOf(step);
    if (idx > 0) goTo(FLOW_STEPS[idx - 1]!);
  }, [goTo, isAdvancing, isCheckingEligibility, otpVerifying, step]);

  const advanceAfterDelay = useCallback(
    (next: StepId) => {
      setIsAdvancing(true);
      window.setTimeout(() => {
        setIsAdvancing(false);
        goTo(next);
      }, ADVANCE_DELAY_MS);
    },
    [goTo],
  );

  const nextQuestion = useCallback((current: StepId) => QUESTION_STEPS[QUESTION_STEPS.indexOf(current) + 1]!, []);

  const selectAndAdvance = useCallback(
    (partial: Partial<QuoteFormData>, current: StepId) => {
      if (isAdvancing) return;
      setData((prev) => ({ ...prev, ...partial }));
      setErrors({});
      track("step_answer", { step_id: current, answer: Object.values(partial)[0] });
      advanceAfterDelay(nextQuestion(current));
    },
    [advanceAfterDelay, isAdvancing, nextQuestion],
  );

  const goNextFromNeeds = useCallback(() => {
    if (isAdvancing) return;
    if (data.needs.length === 0) {
      setErrors({ needs: "Choisissez au moins une réponse." });
      return;
    }
    track("step_answer", { step_id: "needs", answer: data.needs.join(",") });
    advanceAfterDelay("housing");
  }, [advanceAfterDelay, data.needs, isAdvancing]);

  const goNextFromPostal = useCallback(() => {
    if (isAdvancing) return;
    if (!isPostalStepComplete(data)) {
      setErrors(/^\d{5}$/.test(data.postalCode) ? { city: "Sélectionnez votre ville." } : { postalCode: "Indiquez un code postal à 5 chiffres." });
      return;
    }
    track("step_answer", { step_id: "postal", answer: data.postalCode.slice(0, 2) });
    advanceAfterDelay("contact");
  }, [advanceAfterDelay, data, isAdvancing]);

  const checkEligibility = useCallback(
    async (options?: { skipFieldValidation?: boolean }) => {
      if (isCheckingEligibility || isAdvancing) return;
      const phoneE164 = normalizeV2PhoneToE164(data.phone);

      if (!options?.skipFieldValidation) {
        const stepErrors = validateEmailPhone(data);
        if (Object.keys(stepErrors).length > 0) {
          setErrors(stepErrors);
          return;
        }
        if (!phoneE164) {
          setErrors({ phone: "Veuillez saisir un numéro de téléphone valide." });
          return;
        }
        const emailCheck = await validateEmailOnServer(data.email);
        if (!emailCheck.ok) {
          setErrors({ email: emailCheck.message || EMAIL_INVALID_MESSAGE });
          return;
        }
      }
      if (phoneE164 && phoneE164 !== data.phone.trim()) patch({ phone: phoneE164 });

      setErrors({});
      setEligibilityError(null);
      setEligiblePartners([]);
      setEligibilityToken(null);
      goTo("searching");
      setIsCheckingEligibility(true);
      track("eligibility_requested", { needs: data.needs.join(","), department: data.postalCode.slice(0, 2) });

      try {
        const payload = {
          needs: data.needs,
          housing: data.housing,
          occupancy: data.occupancy,
          household: data.household,
          postalCode: data.postalCode,
          city: data.city,
          phone: phoneE164 || data.phone,
          email: data.email.trim(),
        };
        const [result] = await Promise.all([
          fetchEligiblePartners(payload),
          new Promise<void>((resolve) => window.setTimeout(resolve, ELIGIBILITY_MIN_LOADING_MS)),
        ]);
        setEligiblePartners(result.partners);
        setEligibilityToken(result.eligibilityToken);
        track("eligibility_result", { partner_ids: result.partners.map((p) => p.id).join(","), partner_count: result.partners.length });
        goTo("eligiblePartners");
      } catch {
        setEligibilityError(ELIGIBILITY_ERROR);
      } finally {
        setIsCheckingEligibility(false);
      }
    },
    [data, goTo, isAdvancing, isCheckingEligibility, patch],
  );

  const submitDossier = useCallback(async () => {
    if (!eligibilityToken) throw new Error("Vérification expirée. Relancez la recherche.");
    const result = await submitLead({ data, partners: eligiblePartners, eligibilityToken });
    track("lead_submitted", {
      lead_id: result.leadId,
      partner_ids: result.consent.partnerIds.join(","),
      needs: data.needs.join(","),
      mode: result.mode,
    });
    goTo("confirmation");
  }, [data, eligibilityToken, eligiblePartners, goTo]);

  const confirmDossier = useCallback(() => {
    const stepErrors: FieldErrors = {};
    if (!data.firstName.trim()) stepErrors.firstName = "Indiquez votre prénom.";
    if (!data.lastName.trim()) stepErrors.lastName = "Indiquez votre nom.";
    if (!data.consent) stepErrors.consent = "Le consentement est nécessaire pour être contacté(e).";
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    track("otp_requested");
    goTo("phoneVerify");
  }, [data, goTo]);

  const confirmOtp = useCallback(
    async (code: string) => {
      if (otpVerifying) return;
      setOtpError(null);
      setOtpVerifying(true);
      try {
        await verifyOtpDemo(code);
        await submitDossier();
      } catch (error) {
        track("lead_error");
        setOtpError(error instanceof Error ? error.message : "Saisissez un code à 6 chiffres.");
      } finally {
        setOtpVerifying(false);
      }
    },
    [otpVerifying, submitDossier],
  );

  const setPostalCode = useCallback((postalCode: string) => patch({ postalCode }), [patch]);
  const setCitiesOptions = useCallback((citiesOptions: string[]) => patch({ citiesOptions }), [patch]);
  const setCity = useCallback((city: string) => patch({ city }), [patch]);

  const partnerNames = useMemo(() => eligiblePartners.map((p) => p.name), [eligiblePartners]);

  return (
    <div ref={formRootRef} className="w-full scroll-mt-24">
      <div
        id="formulaire-devis"
        className="relative overflow-hidden rounded-[28px] border border-brand-muted bg-white shadow-[0_10px_30px_-18px_rgba(3,105,161,0.45)]"
      >
        <div className={`relative grid gap-4 px-4 pb-4 min-[760px]:px-7 min-[760px]:pb-5 ${canGoBack ? "pt-12 min-[760px]:pt-[3.25rem]" : "pt-5"}`}>
          {canGoBack ? (
            <FormBackButton
              onBack={goBack}
              disabled={isAdvancing || isCheckingEligibility || otpVerifying}
              label="Étape précédente"
              className="absolute left-1.5 top-1.5 z-20 sm:left-2.5 sm:top-2"
            />
          ) : null}

          {showProgress ? <ProgressBar current={questionIndex + 1} total={QUESTION_STEPS.length} /> : null}

          <div key={step} className="form-step-enter">
            {step === "needs" ? (
              <StepNeeds
                value={data.needs}
                error={errors.needs}
                disabled={isAdvancing}
                onChange={(needs) => patch({ needs })}
                onNext={goNextFromNeeds}
              />
            ) : null}

            {step === "housing" ? (
              <StepChoice
                question="Vous habitez…"
                options={HOUSING_OPTIONS}
                value={data.housing}
                layout="stack"
                columns={2}
                disabled={isAdvancing}
                onSelectAndAdvance={(housing) => selectAndAdvance({ housing }, "housing")}
              />
            ) : null}

            {step === "occupancy" ? (
              <StepChoice
                question="Vous êtes…"
                options={OCCUPANCY_OPTIONS}
                value={data.occupancy}
                layout="stack"
                columns={2}
                disabled={isAdvancing}
                onSelectAndAdvance={(occupancy) => selectAndAdvance({ occupancy }, "occupancy")}
              />
            ) : null}

            {step === "household" ? (
              <StepChoice
                question="Combien de personnes vivent chez vous ?"
                options={HOUSEHOLD_OPTIONS}
                value={data.household}
                layout="stack"
                columns={2}
                disabled={isAdvancing}
                onSelectAndAdvance={(household) => selectAndAdvance({ household }, "household")}
              />
            ) : null}

            {step === "postal" ? (
              <StepPostal
                data={data}
                errors={errors}
                disabled={isAdvancing}
                onPostalCode={setPostalCode}
                onCitiesLoaded={setCitiesOptions}
                onCity={setCity}
                onNext={goNextFromPostal}
              />
            ) : null}

            {step === "contact" ? (
              <StepContact
                data={data}
                errors={errors}
                disabled={isAdvancing || isCheckingEligibility}
                onPatch={patch}
                onNext={() => void checkEligibility()}
              />
            ) : null}

            {step === "searching" ? (
              <StepSearching errorMessage={eligibilityError} onRetry={() => void checkEligibility({ skipFieldValidation: true })} />
            ) : null}

            {step === "eligiblePartners" ? (
              <StepEligiblePartners partners={eligiblePartners} data={data} errors={errors} onPatch={patch} onConfirm={confirmDossier} />
            ) : null}

            {step === "phoneVerify" ? (
              <StepPhoneVerify
                phone={data.phone}
                verifying={otpVerifying}
                errorMessage={otpError}
                onConfirm={(code) => void confirmOtp(code)}
                onEditPhone={() => goTo("contact")}
              />
            ) : null}

            {step === "confirmation" ? <StepConfirmation partnerNames={partnerNames} /> : null}
          </div>

          <p className="flex items-center justify-center gap-2 text-[0.95rem] text-zinc-600">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 3 5 6v5c0 4.4 3 8.3 7 10 4-1.7 7-5.6 7-10V6z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            Vos données sont sécurisées
          </p>
        </div>
      </div>
    </div>
  );
}
