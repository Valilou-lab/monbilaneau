const STEPS = [
  { title: "Vous décrivez votre projet", text: "Calcaire, eau de boisson, goût : vous répondez à quelques questions sur votre besoin et votre logement." },
  { title: "Nous identifions les professionnels", text: "Nous vérifions quels professionnels du traitement de l’eau interviennent dans votre secteur." },
  { title: "Vous choisissez d’être recontacté", text: "Vous voyez leurs noms avant d’envoyer quoi que ce soit. Un conseiller vous rappelle pour vous proposer un devis." },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="comment-ca-marche" className="mx-auto w-full max-w-[640px] px-4 py-10 min-[700px]:max-w-[1000px]">
      <h2 id="comment-ca-marche" className="text-center text-[1.6rem] font-extrabold tracking-[-0.02em] text-brand-deep">
        Comment ça marche&nbsp;?
      </h2>
      <ol className="mt-6 grid gap-4 sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.title} className="rounded-[22px] border border-brand-muted/70 bg-white p-5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-[1.05rem] font-extrabold text-brand">
              {index + 1}
            </span>
            <h3 className="mt-3 text-[1.1rem] font-bold text-brand-deep">{step.title}</h3>
            <p className="mt-1.5 text-[0.98rem] leading-snug text-zinc-600">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
