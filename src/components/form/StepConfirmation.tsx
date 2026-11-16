"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

const CONFETTI_COLORS = ["#0369a1", "#0ea5e9", "#7dd3fc", "#22d3ee", "#34d399", "#ffffff"];

function fireConfirmationConfetti() {
  const defaults = { colors: CONFETTI_COLORS, disableForReducedMotion: true, zIndex: 80 };
  confetti({ ...defaults, particleCount: 90, spread: 72, startVelocity: 38, origin: { x: 0.5, y: 0.28 } });
  window.setTimeout(() => {
    confetti({ ...defaults, particleCount: 55, angle: 60, spread: 58, startVelocity: 42, origin: { x: 0.08, y: 0.55 } });
    confetti({ ...defaults, particleCount: 55, angle: 120, spread: 58, startVelocity: 42, origin: { x: 0.92, y: 0.55 } });
  }, 180);
}

type Props = { partnerNames: string[] };

export function StepConfirmation({ partnerNames }: Props) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(fireConfirmationConfetti, 120);
    return () => window.clearTimeout(id);
  }, []);

  const names = partnerNames.length > 1 ? `${partnerNames.slice(0, -1).join(", ")} et ${partnerNames.at(-1)}` : partnerNames[0] ?? "";

  return (
    <div className="relative py-4 text-center sm:py-6">
      <h2 className="text-xl font-extrabold tracking-tight text-brand sm:text-2xl">C&apos;est fait&nbsp;! Votre demande de devis est transmise.&nbsp;✅</h2>
      <div className="mx-auto mt-4 max-w-md rounded-2xl border border-brand-muted bg-brand-soft px-4 py-4 text-center text-brand-deep sm:mt-5 sm:px-5">
        <p className="text-sm font-bold leading-snug sm:text-base">Gardez votre téléphone à proximité</p>
        <p className="mt-1.5 text-sm font-medium leading-snug text-zinc-700">
          Un conseiller {names ? <strong className="font-bold text-brand-deep">{names}</strong> : null} va vous contacter pour étudier votre projet et vous
          proposer un devis.
        </p>
      </div>
      <p className="mx-auto mt-3 max-w-md px-1 text-center text-xs font-medium leading-snug text-zinc-500 sm:text-[0.8125rem]">
        Pensez à décrocher même si le numéro n’est pas enregistré dans vos contacts.
      </p>

      <div className="mx-auto mt-4 max-w-md rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-left sm:mt-5 sm:px-5">
        <p className="text-center text-sm font-bold leading-snug text-emerald-900 sm:text-base">3 questions à poser à votre conseiller&nbsp;💧</p>
        <ul className="mt-2 list-none space-y-1.5 p-0 text-sm font-medium leading-snug text-emerald-900/80">
          <li>
            <strong className="font-bold text-emerald-900">L’installation</strong>&nbsp;: où et comment l’appareil sera-t-il posé&nbsp;?
          </li>
          <li>
            <strong className="font-bold text-emerald-900">L’entretien</strong>&nbsp;: quels consommables, à quelle fréquence, pour quel coût&nbsp;?
          </li>
          <li>
            <strong className="font-bold text-emerald-900">Le devis</strong>&nbsp;: que comprend-il exactement (appareil, pose, garantie)&nbsp;?
          </li>
        </ul>
      </div>
    </div>
  );
}
