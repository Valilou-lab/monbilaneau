import type { Metadata } from "next";
import { LegalPage } from "@/components/landing/LegalPage";
import { SITE } from "@/config/site";

export const metadata: Metadata = { title: `Mentions légales — ${SITE.name}` };

/** TODO before go-live: fill every bracketed field (LCEN art. 6). */
export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        {SITE.publisher} — [forme juridique, capital, adresse du siège, RCS, SIRET, numéro de TVA]. Directeur de la publication :
        [nom]. Contact : {SITE.contactEmail}.
      </p>
      <h2>Hébergeur</h2>
      <p>[Nom, adresse et téléphone de l’hébergeur].</p>
      <h2>Activité</h2>
      <p>
        {SITE.name} est un service privé de mise en relation entre des particuliers et des professionnels du traitement de
        l’eau. {SITE.name} ne fabrique ni ne vend d’appareils. [Indiquer le mode de rémunération par les partenaires.]
      </p>
    </LegalPage>
  );
}
