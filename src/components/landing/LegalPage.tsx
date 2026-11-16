import Link from "next/link";
import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Logo } from "./Logo";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex justify-center px-4 pb-2 pt-5">
        <Link href="/" aria-label="Retour à l’accueil">
          <Logo />
        </Link>
      </header>
      <main className="mx-auto w-full max-w-[760px] px-4 py-8 text-[1rem] leading-relaxed text-zinc-700 [&_h2]:mt-8 [&_h2]:text-[1.25rem] [&_h2]:font-bold [&_h2]:text-brand-deep [&_li]:mt-1 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
        <h1 className="text-[1.9rem] font-extrabold tracking-[-0.02em] text-brand-deep">{title}</h1>
        {children}
      </main>
      <Footer />
    </div>
  );
}
