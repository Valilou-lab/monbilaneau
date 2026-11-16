import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/landing/LegalPage";
import { SITE } from "@/config/site";

export const metadata: Metadata = { title: `Politique de confidentialité — ${SITE.name}` };

/** Draft structure — to be validated by your DPO / lawyer before go-live. */
export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPage title="Politique de confidentialité">
      <p className="rounded-xl bg-amber-50 px-4 py-3 text-amber-900">
        Document provisoire : à compléter et faire valider avant la mise en ligne.
      </p>
      <h2>Responsable du traitement</h2>
      <p>
        {SITE.publisher}, {SITE.contactEmail}.
      </p>
      <h2>Données collectées</h2>
      <ul>
        <li>Vos réponses au questionnaire : besoins, type de logement, statut d’occupation, taille du foyer, code postal et ville.</li>
        <li>Vos coordonnées : e-mail, téléphone, prénom et nom.</li>
        <li>La preuve de votre consentement : texte accepté, version, professionnels concernés, date et heure.</li>
        <li>La source de votre visite (paramètres de campagne publicitaire), sans donnée nominative.</li>
      </ul>
      <h2>Finalités</h2>
      <ul>
        <li>Vérifier quels professionnels peuvent traiter votre demande dans votre secteur.</li>
        <li>
          Transmettre votre demande aux seuls professionnels affichés, si vous l’acceptez, pour qu’ils vous contactent par
          téléphone et par e-mail au sujet de votre projet.
        </li>
        <li>Mesurer la performance du service (statistiques).</li>
      </ul>
      <h2>Destinataires</h2>
      <p>
        Les professionnels dont le nom vous est affiché avant l’envoi, et uniquement eux. La liste à jour est disponible sur la
        page <Link href="/partenaires" className="text-brand underline">Partenaires</Link>. Vos données ne sont pas revendues à
        d’autres organismes.
      </p>
      <h2>Durée de conservation</h2>
      <p>[À définir]. Le consentement au contact est valable 12 mois.</p>
      <h2>Vos droits</h2>
      <p>
        Accès, rectification, effacement, opposition, limitation, portabilité et retrait du consentement à tout moment, en
        écrivant à {SITE.contactEmail}. Vous pouvez introduire une réclamation auprès de la CNIL (cnil.fr).
      </p>
    </LegalPage>
  );
}
