import { SITE } from "@/config/site";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
        <path d="M16 3s9 9.6 9 16.2A9 9 0 0 1 7 19.2C7 12.6 16 3 16 3z" fill="#0369a1" />
        <path d="M11.5 19.5a4.5 4.5 0 0 0 4.5 4.5" stroke="#e0f2fe" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </svg>
      <span className="text-[1.3rem] font-extrabold tracking-[-0.03em] text-brand-deep">{SITE.name}</span>
    </span>
  );
}
