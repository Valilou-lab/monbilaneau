"use client";

import type { ReactNode } from "react";
import { OptionButton } from "./OptionButton";
import { ERROR, QUESTION_TITLE } from "./formStyles";

export type ChoiceOption<T extends string> = { id: T; label: string; icon?: ReactNode };

type Props<T extends string> = {
  question: string;
  hint?: string;
  options: ChoiceOption<T>[];
  value: T | "";
  error?: string;
  disabled?: boolean;
  layout?: "row" | "stack";
  columns?: 1 | 2;
  onSelectAndAdvance: (value: T) => void;
};

/** Single-choice question: tap an answer → auto-advance (no extra button). */
export function StepChoice<T extends string>({
  question,
  hint,
  options,
  value,
  error,
  disabled = false,
  layout = "row",
  columns = 1,
  onSelectAndAdvance,
}: Props<T>) {
  return (
    <div>
      <h2 className={QUESTION_TITLE}>{question}</h2>
      {hint ? <p className="mt-1.5 text-center text-[0.95rem] text-zinc-500">{hint}</p> : null}
      <div className={`mt-4 grid gap-3 ${columns === 2 ? "grid-cols-2" : ""}`} role="group" aria-label={question}>
        {options.map((option) => (
          <OptionButton
            key={option.id}
            label={option.label}
            icon={option.icon}
            layout={layout}
            selected={value === option.id}
            disabled={disabled}
            onClick={() => onSelectAndAdvance(option.id)}
          />
        ))}
      </div>
      {error ? (
        <p className={ERROR} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
