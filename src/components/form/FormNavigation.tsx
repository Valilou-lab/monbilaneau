"use client";

type Props = {
  onNext?: () => void;
  nextLabel?: string;
  /** Hard block (submit / advance in progress). */
  disabled?: boolean;
  /** When false, the CTA stays greyed out until required fields are filled. */
  canContinue?: boolean;
};

export function FormNavigation({
  onNext,
  nextLabel = "Continuer",
  disabled = false,
  canContinue = true,
}: Props) {
  const incomplete = !canContinue;
  const blocked = disabled || incomplete;
  const tone = incomplete
    ? "bg-zinc-300 text-zinc-500 shadow-none"
    : "bg-cta text-white shadow-[0_12px_28px_-10px_rgba(3,105,161,0.55)] ring-2 ring-cta/35 hover:bg-cta-hover";

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={onNext}
        disabled={blocked}
        aria-disabled={blocked}
        className={`inline-flex min-h-16 w-full items-center justify-center rounded-full px-6 py-3.5 text-[1.2rem] font-extrabold transition-[background-color,box-shadow,opacity] duration-200 disabled:cursor-not-allowed ${tone} ${
          disabled && !incomplete ? "opacity-60" : ""
        }`}
      >
        {nextLabel}
      </button>
    </div>
  );
}
