import { SITE } from "@/config/site";

const FAQ = [
  {
    question: `Qui êtes-vous ?`,
    answer: `${SITE.name} est un service privé de mise en relation. Nous ne fabriquons ni ne vendons d’appareils, et nous ne sommes ni un organisme public ni un laboratoire.`,
  },
  {
    question: "Qui va me contacter ?",
    answer:
      "Uniquement les professionnels dont le nom s’affiche à la fin du formulaire, et seulement si vous cochez la case de consentement. Sans votre accord, vos coordonnées ne sont transmises à personne.",
  },
  {
    question: "Ma demande m’engage-t-elle ?",
    answer: "Non. Le professionnel étudie votre projet et vous propose un devis : vous êtes libre de l’accepter ou non.",
  },
  {
    question: "Adoucisseur, osmoseur ou filtre : comment choisir ?",
    answer:
      "Cela dépend de ce que vous voulez améliorer (calcaire, eau de boisson, goût) et de votre logement. Le conseiller vous aide à choisir la solution adaptée et vous explique l’installation et l’entretien.",
  },
  {
    question: "Comment sont utilisées mes données ?",
    answer:
      "Uniquement pour traiter votre demande de devis. Votre consentement est valable 12 mois et vous pouvez le retirer à tout moment.",
  },
] as const;

export function Faq() {
  return (
    <section aria-labelledby="faq-titre" className="mx-auto w-full max-w-[640px] px-4 pb-10 min-[700px]:max-w-[820px]">
      <h2 id="faq-titre" className="text-center text-[1.6rem] font-extrabold tracking-[-0.02em] text-brand-deep">
        Questions fréquentes
      </h2>
      <div className="mt-5 grid gap-3">
        {FAQ.map((item) => (
          <details key={item.question} className="group rounded-[18px] border border-brand-muted/70 bg-white px-5 py-4 open:bg-brand-soft/40">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[1.05rem] font-semibold text-brand-deep">
              {item.question}
              <span aria-hidden className="text-xl text-brand transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-2 text-[0.98rem] leading-relaxed text-zinc-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
