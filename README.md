# Mon Bilan Eau — landing page de génération de leads (traitement de l’eau)

Next.js 16 + Tailwind 4, même pile et même mécanique de formulaire que Couverture Mutuelle `/devis` (QuoteFormV2).

## Parcours

1. Besoins (choix multiples) : calcaire, eau de boisson, goût / odeur, je ne sais pas encore
2. Logement : maison / appartement
3. Statut : propriétaire / locataire
4. Taille du foyer
5. Code postal → ville (`/api/communes`, geo.api.gouv.fr avec repli sur api-adresse)
6. E-mail + téléphone → **`/api/v2/eligibility`** : à qui le lead peut être vendu
7. Professionnels éligibles + prénom / nom + consentement nominatif (case décochée)
8. Code SMS
9. Confirmation

Dès la question 2, tout ce qui suit le formulaire (FAQ, pied de page…) est masqué (`data-hide-on-focus`).

## Démo vs production

| Élément | Démo actuelle | À brancher avant la mise en ligne |
|---|---|---|
| Éligibilité | Culligan + Kinetico pour toute demande (`src/lib/partners-registry.ts`) | Appel à l’API acheteurs dans `src/app/api/v2/eligibility/route.ts` |
| Partenaires | `demo: true`, sans URL de politique de confidentialité | URL officielle de chaque partenaire ; logo seulement avec son accord |
| Code SMS | N’importe quel code à 6 chiffres est accepté, aucun SMS envoyé | Twilio Verify (`/api/verify/start` et `/check` de Couverture Mutuelle) |
| Lead | Validé côté serveur, preuve de consentement reconstruite, **rien n’est envoyé** | Enregistrement + envoi à l’acheteur dans `src/app/api/v2/leads/route.ts` |
| Pages légales | Modèles avec champs `[à compléter]` | Raison sociale, hébergeur, durées de conservation (`src/config/site.ts`) |

`NEXT_PUBLIC_DEMO_MODE=false` désactive les partenaires de démo.

## Suivi (cockpit)

Événements poussés dans `window.dataLayer` (`src/lib/tracking.ts`), sans donnée personnelle :
`funnel_start`, `step_view`, `step_answer`, `eligibility_requested`, `eligibility_result`, `otp_requested`, `lead_submitted`, `lead_error`.
Le lead envoyé à l’API contient l’acquisition first-touch (UTM, gclid, fbclid, ttclid) et un `funnelSessionId`.

## Lancer

```bash
npm install
npm run dev
```
