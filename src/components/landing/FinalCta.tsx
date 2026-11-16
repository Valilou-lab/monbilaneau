"use client";

import { scrollQuoteFormIntoView } from "@/components/form/scrollQuoteFormIntoView";

export function FinalCta() {
  return (
    <div className="mx-auto w-full max-w-[640px] px-4 pb-8">
      <button
        type="button"
        onClick={() => scrollQuoteFormIntoView(document.getElementById("formulaire-devis"))}
        className="inline-flex min-h-16 w-full items-center justify-center rounded-full bg-cta px-6 text-[1.15rem] font-extrabold text-white shadow-[0_12px_28px_-10px_rgba(3,105,161,0.55)] hover:bg-cta-hover"
      >
        Je demande mon devis
      </button>
    </div>
  );
}
