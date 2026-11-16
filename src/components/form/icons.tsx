/** Simple stroke icons (24×24, currentColor). */
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className: "h-7 w-7" };

export const IconCalcaire = () => (
  <svg {...base}><path d="M5 20h14" /><path d="M7 20v-7a5 5 0 0 1 10 0v7" /><path d="M10 10.5h.01M14 12.5h.01M11.5 15h.01" /><path d="M12 3v2" /></svg>
);
export const IconVerre = () => (
  <svg {...base}><path d="M6 3h12l-1.6 16.2A2 2 0 0 1 14.4 21H9.6a2 2 0 0 1-2-1.8z" /><path d="M6.6 9h10.8" /></svg>
);
export const IconGout = () => (
  <svg {...base}><path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z" /><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" /></svg>
);
export const IconQuestion = () => (
  <svg {...base}><circle cx="12" cy="12" r="9" /><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8 1c0 1.7-2.4 2.2-2.4 3.7" /><path d="M12 17h.01" /></svg>
);
export const IconMaison = () => (
  <svg {...base}><path d="M3.5 11 12 4l8.5 7" /><path d="M5.5 9.5V20h13V9.5" /><path d="M10 20v-5h4v5" /></svg>
);
export const IconImmeuble = () => (
  <svg {...base}><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1" /><path d="M11 21v-3h2v3" /></svg>
);
export const IconCle = () => (
  <svg {...base}><circle cx="8" cy="15" r="4" /><path d="m11 12 8-8" /><path d="m16 7 2 2M18.5 4.5l1.5 1.5" /></svg>
);
export const IconContrat = () => (
  <svg {...base}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /><path d="M10 12h5M10 16h5" /></svg>
);
export const IconPersonnes = ({ n }: { n: number }) => (
  <span className="flex items-end justify-center gap-0.5" aria-hidden>
    {Array.from({ length: Math.min(n, 3) }).map((_, i) => (
      <svg key={i} viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" />
      </svg>
    ))}
    {n > 3 ? <span className="text-base font-bold leading-6">+</span> : null}
  </span>
);
