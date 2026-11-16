"use client";

import type { ReactNode } from "react";
import { FormNavigation } from "./FormNavigation";
import { OptionButton } from "./OptionButton";
import { ERROR, QUESTION_TITLE } from "./formStyles";
import { IconCalcaire, IconGout, IconQuestion, IconVerre } from "./icons";
import type { NeedId } from "./types";

export const NEED_OPTIONS: { id: NeedId; label: string; icon: ReactNode }[] = [
  { id: "calcaire", label: "Réduire le calcaire", icon: <IconCalcaire /> },
  { id: "boisson", label: "Améliorer mon eau de boisson", icon: <IconVerre /> },
  { id: "gout_odeur", label: "Améliorer son goût ou son odeur", icon: <IconGout /> },
  { id: "indecis", label: "Je ne sais pas encore", icon: <IconQuestion /> },
];

const QUESTION = "Qu’aimeriez-vous améliorer chez vous ?";

type Props = {
  value: NeedId[];
  error?: string;
  disabled?: boolean;
  onChange: (needs: NeedId[]) => void;
  onNext: () => void;
};

/** Q1 — multi-select. « Je ne sais pas encore » is exclusive with the others. */
export function StepNeeds({ value, error, disabled = false, onChange, onNext }: Props) {
  function toggle(id: NeedId) {
    if (id === "indecis") {
      onChange(value.includes("indecis") ? [] : ["indecis"]);
      return;
    }
    const withoutUnsure = value.filter((need) => need !== "indecis");
    onChange(withoutUnsure.includes(id) ? withoutUnsure.filter((need) => need !== id) : [...withoutUnsure, id]);
  }

  return (
    <div>
      <h2 className={QUESTION_TITLE}>{QUESTION}</h2>
      <p className="mt-1.5 text-center text-[0.95rem] text-zinc-500">Plusieurs réponses possibles</p>
      <div className="mt-4 grid gap-3" role="group" aria-label={QUESTION}>
        {NEED_OPTIONS.map((option) => (
          <OptionButton
            key={option.id}
            label={option.label}
            icon={option.icon}
            multi
            selected={value.includes(option.id)}
            disabled={disabled}
            onClick={() => toggle(option.id)}
          />
        ))}
      </div>
      {error ? (
        <p className={ERROR} role="alert">
          {error}
        </p>
      ) : null}
      <FormNavigation onNext={onNext} disabled={disabled} canContinue={value.length > 0} />
    </div>
  );
}
