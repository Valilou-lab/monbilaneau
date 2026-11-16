import type { Metadata } from "next";
import { LegalPage } from "@/components/landing/LegalPage";
import { SITE } from "@/config/site";
import { isV2PartnerDistributable, V2_PARTNERS_REGISTRY } from "@/lib/partners-registry";

export const metadata: Metadata = { title: `Partenaires — ${SITE.name}` };

/** Generated from the server allowlist: the list can never drift from what the form shows. */
export default function PartenairesPage() {
  const partners = Object.values(V2_PARTNERS_REGISTRY).filter(isV2PartnerDistributable);
  return (
    <LegalPage title="Nos partenaires">
      <p>
        Selon votre besoin et votre code postal, votre demande peut être proposée à l’un ou plusieurs des professionnels
        ci-dessous. Leur nom vous est toujours affiché avant l’envoi, et rien n’est transmis sans votre accord.
      </p>
      <ul>
        {partners.map((partner) => (
          <li key={partner.id}>
            <strong>{partner.legalName ?? partner.name}</strong>
            {partner.privacyPolicyUrl ? (
              <>
                {" — "}
                <a href={partner.privacyPolicyUrl} target="_blank" rel="noopener noreferrer" className="text-brand underline">
                  politique de protection des données
                </a>
              </>
            ) : (
              " — politique de protection des données : à compléter"
            )}
            {partner.demo ? " (démonstration)" : null}
          </li>
        ))}
      </ul>
    </LegalPage>
  );
}
