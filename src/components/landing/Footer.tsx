import Link from "next/link";
import { SITE } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-brand-muted/50 bg-white px-4 py-8 text-center text-[0.9rem] text-zinc-500">
      <nav aria-label="Informations légales" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <Link href="/mentions-legales" className="underline-offset-2 hover:text-brand hover:underline">
          Mentions légales
        </Link>
        <Link href="/politique-de-confidentialite" className="underline-offset-2 hover:text-brand hover:underline">
          Politique de confidentialité
        </Link>
        <Link href="/partenaires" className="underline-offset-2 hover:text-brand hover:underline">
          Partenaires
        </Link>
      </nav>
      <p className="mx-auto mt-4 max-w-xl leading-snug">
        {SITE.name} est un service privé de mise en relation avec des professionnels du traitement de l’eau. Ce n’est ni un
        organisme public, ni un laboratoire d’analyse.
      </p>
    </footer>
  );
}
