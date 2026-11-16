export function HeroTitles({ className = "" }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <h1 className="mx-auto text-balance text-[clamp(1.6rem,6.6vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.03em]">
        <span className="block text-zinc-900">Calcaire, goût, eau de boisson</span>
        <span className="block text-brand">trouvez la solution pour votre eau</span>
      </h1>
      <p className="mx-auto mt-3 hidden max-w-[30rem] text-[1.05rem] leading-snug text-zinc-600 sm:block">
        Quelques questions, et des professionnels du traitement de l’eau de votre secteur vous proposent un devis.
      </p>
    </div>
  );
}
