"use client";

import type { ReactNode } from "react";

type Props = {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  /** Multi-select steps show a check box instead of the chevron. */
  multi?: boolean;
  layout?: "row" | "stack";
};

const BTN =
  "border-[2.5px] border-brand bg-white text-brand-deep hover:bg-brand-soft/60 active:bg-brand active:text-white";
const BTN_SELECTED = "border-[2.5px] border-brand bg-brand text-white shadow-md";

function Chevron({ selected }: { selected: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-6 w-6 shrink-0 ${selected ? "text-white" : "text-brand"}`} fill="none" aria-hidden>
      <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Check({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden
      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
        selected ? "border-white bg-white text-brand" : "border-brand bg-white text-transparent"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/** Visual answer button — same proportions as the mutuelle V2 redesign buttons. */
export function OptionButton({ label, selected, onClick, disabled = false, icon, multi = false, layout = "row" }: Props) {
  const tone = selected ? BTN_SELECTED : BTN;

  if (layout === "stack") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-pressed={selected}
        className={`flex min-h-[6rem] w-full flex-col items-center justify-center gap-1.5 rounded-[18px] px-2 py-3 text-center text-[1rem] font-semibold leading-snug transition-[background-color,border-color,box-shadow,color,transform] duration-150 active:scale-[0.99] disabled:cursor-not-allowed sm:text-[1.05rem] ${tone}`}
      >
        {icon ? (
          <span className={`inline-flex h-8 w-8 items-center justify-center ${selected ? "text-white" : "text-brand"}`} aria-hidden>
            {icon}
          </span>
        ) : null}
        <span className="text-pretty">{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`flex min-h-[72px] w-full items-center justify-between gap-3 rounded-[18px] px-5 py-3.5 text-left text-[1.1rem] font-semibold leading-snug transition-[background-color,border-color,box-shadow,color,transform] duration-150 active:scale-[0.99] disabled:cursor-not-allowed ${tone}`}
    >
      <span className="flex min-w-0 items-center gap-3">
        {icon ? (
          <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center ${selected ? "text-white" : "text-brand"}`} aria-hidden>
            {icon}
          </span>
        ) : null}
        <span className="text-pretty">{label}</span>
      </span>
      {multi ? <Check selected={selected} /> : <Chevron selected={selected} />}
    </button>
  );
}
