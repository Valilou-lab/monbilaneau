const POINTS = [
  { title: "Rapide", text: "6 questions simples" },
  { title: "Sans engagement", text: "Une demande de devis ne vous oblige à rien" },
  { title: "Vous gardez la main", text: "Vos coordonnées ne sont transmises qu’avec votre accord" },
];

export function TrustPoints() {
  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {POINTS.map((point) => (
        <li key={point.title} className="flex items-start gap-2.5 rounded-2xl bg-white px-4 py-3 ring-1 ring-brand-muted/60">
          <span aria-hidden className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[0.65rem] font-bold text-white">
            ✓
          </span>
          <span>
            <span className="block text-[0.98rem] font-bold text-brand-deep">{point.title}</span>
            <span className="block text-[0.88rem] leading-snug text-zinc-600">{point.text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
