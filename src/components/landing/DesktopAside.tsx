import { TrustPoints } from "./TrustPoints";

/** Desktop right column — replaces the photo of the mutuelle LP (no photo asset yet). */
export function DesktopAside() {
  return (
    <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#0c4a6e] via-[#0369a1] to-[#0ea5e9] lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:px-12 xl:px-16">
      <svg viewBox="0 0 600 600" className="pointer-events-none absolute -right-24 -top-24 h-[34rem] w-[34rem] opacity-15" aria-hidden>
        <path d="M300 40s200 214 200 360a200 200 0 0 1-400 0C100 254 300 40 300 40z" fill="#fff" />
      </svg>
      <div className="relative max-w-md">
        <p className="text-[2.1rem] font-extrabold leading-[1.15] tracking-[-0.03em] text-white">
          Votre eau, vos besoins, le bon professionnel.
        </p>
        <p className="mt-4 text-[1.1rem] leading-snug text-sky-100">
          Adoucisseur, osmoseur ou filtration : un conseiller étudie votre projet et vous propose un devis adapté à votre logement.
        </p>
        <div className="mt-8 [&_ul]:sm:grid-cols-1">
          <TrustPoints />
        </div>
      </div>
    </aside>
  );
}
