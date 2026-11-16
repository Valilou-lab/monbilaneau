"use client";

import { useEffect, useState } from "react";
import { FormNavigation } from "./FormNavigation";
import { ERROR as SENIOR_ERROR } from "./formStyles";

const STATUS_LINES = [
  "Analyse de vos besoins",
  "Recherche des professionnels de votre secteur",
  "Vérification des disponibilités",
] as const;

type Props = {
  errorMessage?: string | null;
  onRetry?: () => void;
};

/** Loading screen while `/api/v2/eligibility` is in flight. */
export function StepSearching({
  errorMessage = null,
  onRetry,
}: Props) {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    if (errorMessage) return;
    const id = window.setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_LINES.length);
    }, 700);
    return () => window.clearInterval(id);
  }, [errorMessage]);

  if (errorMessage) {
    return (
      <div className="py-4 text-center sm:py-6">
        <h2 className="text-[1.35rem] font-extrabold tracking-[-0.02em] text-brand-deep">
          Recherche interrompue
        </h2>
        <p className={`${SENIOR_ERROR} mt-3 text-center`} role="alert">
          {errorMessage}
        </p>
        {onRetry ? (
          <FormNavigation onNext={onRetry} nextLabel="Réessayer" />
        ) : null}
      </div>
    );
  }

  return (
    <div className="py-6 text-center sm:py-8" aria-live="polite" aria-busy="true">
      <h2 className="text-[1.35rem] font-extrabold tracking-[-0.02em] text-brand sm:text-[1.5rem]">
        Nous recherchons les professionnels disponibles…
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-[0.95rem] leading-snug text-zinc-600">
        Nous vérifions quels professionnels interviennent dans votre secteur pour votre projet.
      </p>

      <p
        key={STATUS_LINES[statusIndex]}
        className="mt-5 text-[1rem] font-semibold text-brand-deep"
      >
        {STATUS_LINES[statusIndex]}
      </p>

      <div className="mt-5 flex justify-center">
        <span
          className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand/25 border-t-brand"
          aria-hidden="true"
        />
        <span className="sr-only">Chargement</span>
      </div>
    </div>
  );
}
