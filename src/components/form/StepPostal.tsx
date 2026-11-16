"use client";

import { FormNavigation } from "./FormNavigation";
import { ERROR, INPUT, LABEL, QUESTION_TITLE } from "./formStyles";
import type { FieldErrors, QuoteFormData } from "./types";
import { useCommuneLookup } from "./useCommuneLookup";

type Props = {
  data: QuoteFormData;
  errors: FieldErrors;
  disabled?: boolean;
  onPostalCode: (value: string) => void;
  onCitiesLoaded: (cities: string[]) => void;
  onCity: (value: string) => void;
  onNext: () => void;
};

export function isPostalStepComplete(data: QuoteFormData): boolean {
  return /^\d{5}$/.test(data.postalCode) && Boolean(data.city);
}

/** Postal code → city (same-origin /api/communes), like the mutuelle V2 form. */
export function StepPostal({ data, errors, disabled = false, onPostalCode, onCitiesLoaded, onCity, onNext }: Props) {
  const lookup = useCommuneLookup(data.postalCode, onCitiesLoaded, onCity);

  function handlePostalCodeChange(value: string) {
    onPostalCode(value.replace(/\D/g, "").slice(0, 5));
    onCitiesLoaded([]);
    onCity("");
  }

  return (
    <div>
      <h2 className={QUESTION_TITLE}>Où se trouve votre logement&nbsp;?</h2>
      <p className="mt-1.5 text-center text-[0.95rem] text-zinc-500">
        Pour vérifier quels professionnels interviennent chez vous.
      </p>

      <div className="mt-4">
        <label htmlFor="postalCode" className={LABEL}>
          Votre code postal
        </label>
        <input
          id="postalCode"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={5}
          placeholder="Ex. 69003"
          value={data.postalCode}
          disabled={disabled}
          onChange={(event) => handlePostalCodeChange(event.target.value)}
          className={INPUT}
        />
        {errors.postalCode ? (
          <p className={ERROR} role="alert">
            {errors.postalCode}
          </p>
        ) : null}

        {lookup.status === "loading" ? <p className="mt-3 text-base text-zinc-500">Recherche de la ville…</p> : null}
        {lookup.status === "error" ? (
          <p className={`${ERROR} mt-3`} role="alert">
            {lookup.message}
          </p>
        ) : null}

        {data.citiesOptions.length > 1 ? (
          <div className="mt-3">
            <label htmlFor="city" className={LABEL}>
              Ville
            </label>
            <select id="city" value={data.city} disabled={disabled} onChange={(event) => onCity(event.target.value)} className={INPUT}>
              <option value="">Sélectionnez votre ville</option>
              {data.citiesOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {data.citiesOptions.length === 1 && data.city ? (
          <div className="mt-3 rounded-[14px] border border-emerald-200/90 bg-[#ecfdf5] px-3.5 py-3 text-left" aria-live="polite">
            <p className="flex items-center gap-2 text-[1.05rem] font-extrabold leading-snug text-[#064e3b]">
              <span aria-hidden className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[0.75rem] font-bold text-white">
                ✓
              </span>
              <span>{data.city}</span>
            </p>
            <p className="mt-1 pl-8 text-[0.82rem] leading-snug text-emerald-800/80">Ville associée à votre code postal</p>
          </div>
        ) : null}
      </div>

      <FormNavigation onNext={onNext} disabled={disabled} canContinue={isPostalStepComplete(data)} />
    </div>
  );
}
