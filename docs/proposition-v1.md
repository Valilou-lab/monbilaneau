# Proposition V1 : landing page d'orientation sur les solutions pour l'eau

Statut : **à valider avant tout développement**. Aucun code n'est écrit.
Les éléments marqués **[À CONFIRMER]** dépendent d'informations que je n'ai pas (partenaires, entité juridique, cockpit, etc.).
Les éléments marqués **[À VÉRIFIER]** reposent sur une source que je n'ai pas pu lire en entier ; il faut les relire dans le texte officiel avant de s'en servir.

---

## 1. Bonnes pratiques observées et cadre à respecter

### 1.1 Ce que font les sites de devis existants (observation, pas copie)

| Constat | Exemple vérifiable | Ce qu'on en retient |
|---|---|---|
| Parcours court, « en quelques clics », code postal tôt dans le parcours | Bobex (BE) : « Décrivez votre situation en quelques clics », formulaire avec code postal et ville | Le code postal sert à la fois à router le lead et à afficher les données d'eau. On le demande tôt. |
| Modèle « jusqu'à 5 devis » envoyés à plusieurs professionnels | Bobex, Habitatpresto | **On ne reprend pas ce modèle.** Le brief demande un partenaire nommé. Envoyer à 5 professionnels sans les nommer n'est pas compatible avec les recommandations CNIL (cf. 1.3). |
| Fourchettes de prix affichées | Habitatpresto : adoucisseur de 1 500 à 2 800 € posé ; osmoseur de 600 à 1 500 € posé | Les écarts entre sources sont importants. **On n'affiche aucun prix** tant qu'un partenaire ne fournit pas une grille qu'il assume. |
| Promesse de délai (« sous 48 h ») | Bobex | On n'affiche un délai que si le partenaire s'y engage contractuellement **[À CONFIRMER]**. |

Je n'ai pas trouvé de comparateur français spécialisé dans le traitement de l'eau dont le fonctionnement soit documenté publiquement. Je ne présente donc aucun « benchmark » chiffré.

### 1.2 Ergonomie des formulaires

- Réduire le nombre de champs. Selon les études d'utilisabilité de Baymard sur les formulaires de paiement, la plupart des sites pourraient afficher 20 à 60 % de champs en moins par défaut.
- Une seule colonne, sauf pour les paires évidentes comme prénom et nom (Baymard).
- Formulaire en plusieurs étapes ou sur une seule page : les études publiques sont contradictoires et les chiffres qui circulent (+43 %, 81 % d'abandon…) viennent d'éditeurs d'outils et ne sont pas vérifiables. **Je ne les utilise pas.** Le choix d'un parcours en étapes repose ici sur le brief (une action par écran, mobile). Son efficacité sera mesurée par le suivi d'abandon par étape (section 7).

### 1.3 Cadre juridique qui structure le parcours

1. **Démarchage téléphonique** : depuis le 11 août 2026, l'article L223-1 du Code de la consommation, réécrit par la loi n° 2025-594 du 30 juin 2025, interdit d'appeler un consommateur qui n'a pas donné son consentement préalable. Le dispositif Bloctel est supprimé à cette date.
   Conséquences pour nous :
   - le rappel par le partenaire doit reposer sur un consentement explicite, horodaté et conservé comme preuve ;
   - les modalités d'application (jours, horaires, fréquence, durée de validité du consentement) sont à vérifier dans le décret d'application. Les sources divergent sur sa publication **[À VÉRIFIER]**.
2. **Transmission des données au partenaire (CNIL)** :
   - la personne doit connaître l'identité de chaque partenaire ; la mention « nos partenaires » ne suffit pas ;
   - le consentement se recueille par une case **décochée par défaut** ;
   - le consentement ne vaut que pour les partenaires nommés ; le partenaire ne peut pas revendre le lead sans un nouveau consentement ;
   - l'accès au service ne doit pas être conditionné à l'acceptation d'une prospection sans rapport avec la demande.
3. **Comparateur en ligne (art. L111-7 du Code de la consommation)** : si l'on classe ou compare des offres, il faut publier les critères de classement et leur définition, et indiquer l'existence d'une relation contractuelle ou d'une rémunération. Amende administrative possible : jusqu'à 375 000 € pour une personne morale (art. L131-4).
   → **Recommandation : ne pas s'appeler « comparateur »** tant qu'on ne compare pas réellement plusieurs offres. On se présente comme un « service d'orientation et de mise en relation », avec une page « Comment ça marche » qui explique le routage et la rémunération.
4. **Avis clients** : on n'en affiche aucun au lancement. S'il y en a plus tard, il faudra indiquer comment ils sont contrôlés (art. L111-7-2) **[À VÉRIFIER]**.
5. **Pratiques commerciales trompeuses** : interdites par la directive 2005/29/CE, transposée dans le Code de la consommation ; c'est la DGCCRF qui contrôle. Je n'ai pas trouvé de fiche DGCCRF propre aux adoucisseurs et osmoseurs. La fiche la plus proche concerne la rénovation énergétique et recommande la vigilance face au démarchage. Je ne cite donc aucune position DGCCRF propre à l'eau.

---

## 2. Architecture de la page

Une seule URL, un parcours en écrans successifs, une action principale par écran.

```
[0] Accroche ──► [1] Besoin ──► [2] Commune ──► [3] Logement ──► [4] Questions selon le besoin
                                    │                                          │
                                    └── données d'eau publiques (si dispo)    ▼
                                                                         [5] Orientation
                                                                               │
                                               partenaire dispo ? ── non ──► [5b] Pas de partenaire : infos, pas de formulaire
                                                     │ oui
                                                     ▼
                                               [6] Demande de devis (partenaire nommé + consentement)
                                                     ▼
                                               [7] Confirmation
```

Pages secondaires, accessibles depuis le pied de page :
- Comment ça marche : qui nous sommes, comment on oriente, comment on est rémunérés **[À CONFIRMER]**.
- Nos partenaires : liste à jour, avec un lien vers la politique de confidentialité de chacun.
- Mentions légales, politique de confidentialité, gestion des cookies.
- « En savoir plus » sur chaque solution, dans des volets repliables et non sur la page principale.

Barre de progression visible des écrans 1 à 6. Bouton retour sur chaque écran. Réponses conservées si l'on revient en arrière.

### Proposition technique (pour discussion, pas encore figée)
- Front : page statique légère (Vite + TypeScript, sans framework lourd) pour un chargement rapide sur mobile.
- Une petite fonction serveur qui :
  - interroge **geo.api.gouv.fr** (autocomplétion des communes) et **Hub'Eau, API Qualité de l'eau potable** (`resultats_dis`), avec un cache ;
  - reçoit le lead, l'enregistre, l'envoie au partenaire (webhook ou e-mail) et pousse les événements vers le cockpit.
- Je m'aligne sur la pile de Couverture Mutuelle V2 et sur le format du cockpit si vous me les donnez **[À CONFIRMER]**.
- Note : depuis cette session cloud, l'accès réseau à hubeau.eaufrance.fr est bloqué (erreur 403 du proxy). Il faudra l'autoriser pour tester pendant le développement.

---

## 3. Questions exactes et logique conditionnelle

Légende : **Q** = question affichée, réponses en boutons visuels sauf mention contraire. Variable = nom technique pour le suivi.

### Écran 1 — Besoin (`need`)
**Q : Qu'aimeriez-vous améliorer chez vous ?**
- Réduire le calcaire → `calcaire`
- Améliorer mon eau de boisson → `boisson`
- Améliorer le goût ou l'odeur → `gout_odeur`
- Je ne sais pas encore → `indecis`

### Écran 2 — Commune (`commune`)
**Q : Où se trouve votre logement ?**
Champ unique « Code postal ou commune » avec autocomplétion (geo.api.gouv.fr). Le code INSEE est stocké.
- Si des données publiques existent, une carte discrète s'affiche (cf. section 6).
- Si la commune est desservie par plusieurs réseaux (UDI), on l'indique au lieu de choisir un réseau au hasard.

### Écran 3 — Logement
**Q3a : Vous habitez…** Une maison / Un appartement → `logement`
**Q3b : Vous êtes…** Propriétaire / Locataire → `statut`
- Si locataire : message court « Une installation sur l'arrivée d'eau peut nécessiter l'accord de votre propriétaire. » La personne peut continuer.

### Écran 4 — Questions selon le besoin (une à trois questions maximum)

**Si `calcaire`**
- **Q : Où le calcaire vous gêne-t-il le plus ?** (plusieurs choix possibles) Robinetterie et douche / Bouilloire et électroménager / Ballon d'eau chaude / Partout → `symptomes`
- **Q : Combien de personnes vivent chez vous ?** 1-2 / 3-4 / 5 et plus → `foyer` (sert à dimensionner l'adoucisseur)
- **Q : Avez-vous un espace près de l'arrivée d'eau (garage, cellier, buanderie, placard technique) ?** Oui / Non / Je ne sais pas → `espace`

**Si `boisson`**
- **Q : Aujourd'hui, vous buvez surtout…** De l'eau en bouteille / L'eau du robinet / Une carafe filtrante → `conso_actuelle`
- **Q : Qu'est-ce qui compte le plus pour vous ?** Moins de bouteilles plastiques / Le goût / Réduire certaines substances / Le côté pratique → `objectif_boisson`
- **Q : Avez-vous de la place sous l'évier de la cuisine ?** Oui / Non / Je ne sais pas → `espace_evier`

**Si `gout_odeur`**
- **Q : Qu'est-ce qui vous gêne ?** Goût ou odeur de chlore / Un autre goût / Une odeur inhabituelle ou une eau trouble ou colorée → `gene`
  - « Odeur inhabituelle, eau trouble ou colorée » → **pas d'orientation produit**. On affiche : « Un changement soudain de l'aspect ou de l'odeur de l'eau doit d'abord être signalé à votre distributeur d'eau. » avec le nom du distributeur s'il figure dans les données publiques. Fin du parcours commercial.
- **Q : Avez-vous de la place sous l'évier de la cuisine ?** Oui / Non / Je ne sais pas → `espace_evier`

**Si `indecis`**
- **Q : Qu'est-ce qui vous ferait le plus plaisir ?** Moins de traces blanches / Une eau plus agréable à boire / Arrêter d'acheter des bouteilles / Je me renseigne simplement
  - Les trois premières réponses renvoient vers `calcaire`, `gout_odeur` ou `boisson`, puis vers les questions correspondantes.
  - « Je me renseigne simplement » → on affiche les trois solutions en version courte, **sans formulaire de devis forcé**, avec un lien « Je veux être recontacté » facultatif.

### Dernière question de qualification (tous les parcours)
**Q : Où en est votre projet ?** Je veux un devis rapidement / Dans les prochains mois / Je compare simplement → `maturite`
- Ne bloque pas le parcours, mais est transmise au partenaire et au cockpit.

### Écran 6 — Coordonnées
Prénom, Nom, Téléphone, E-mail. La commune est déjà connue. Pas d'adresse postale : le partenaire la demandera s'il en a besoin.
**[À CONFIRMER]** : le partenaire exige-t-il d'autres champs ? Chaque champ ajouté doit être justifié.

---

## 4. Orientation vers une solution et un partenaire

### 4.1 Matrice d'orientation (catégorie à « étudier », jamais un diagnostic)

| Besoin | Conditions | Catégorie proposée | Message d'orientation |
|---|---|---|---|
| calcaire | cas général | **Adoucisseur** | « Un adoucisseur réduit la dureté de l'eau et limite le tartre dans les canalisations et les équipements. Un professionnel vérifie l'installation possible et règle la dureté de sortie. » |
| calcaire | dureté publique **faible** dans le réseau | Adoucisseur, **avec mise en garde** | « Les dernières analyses publiques de votre réseau indiquent une eau peu calcaire. Un adoucisseur n'est peut-être pas nécessaire : un professionnel pourra vous le confirmer. » Le seuil reste à définir à partir d'une source **[À VÉRIFIER]**. |
| calcaire | `espace` = non + appartement | Adoucisseur, mention « installation à vérifier » | Pas de promesse d'installation. |
| boisson | `espace_evier` ≠ non | **Osmoseur ou filtration sous évier** | « Pour l'eau de boisson, deux familles de solutions existent : l'osmoseur, qui retient une large part des substances dissoutes, et la filtration ciblée. Le bon choix dépend de ce que vous souhaitez réduire. » + volet « Points de vigilance » (filtres, entretien, eau rejetée, place). |
| boisson | `espace_evier` = non | **Filtration** (carafe ou robinet) | Solution sans installation. |
| gout_odeur (chlore) | — | **Filtration au charbon actif** | « Certains filtres au charbon actif peuvent réduire le goût et l'odeur de chlore, selon leurs caractéristiques. Tous les filtres ne se valent pas. » |
| gout_odeur (autre goût) | — | Filtration, avec conseil | Orientation prudente, sans promesse de résultat. |
| gout_odeur (odeur inhabituelle, eau trouble) | — | **Aucune** | Renvoi vers le distributeur d'eau. |

Règles transverses :
- L'osmose inverse n'est jamais présentée comme « indispensable » ou « plus saine » sans source.
- Une eau conforme n'est jamais présentée comme dangereuse.
- Le texte précise toujours qu'on propose une catégorie à étudier, et que le professionnel confirme.

### 4.2 Routage vers le partenaire
Une table de configuration, administrable sans toucher au code :

| Champ | Exemple |
|---|---|
| `partner_id`, nom commercial, raison sociale | ex. « Culligan », si un contrat existe **[À CONFIRMER]** |
| univers couverts | adoucisseur / osmoseur / filtration |
| zones | liste de départements ou de codes postaux |
| statut actif, plafond de leads par jour | pour ne pas envoyer de demandes qu'il ne traitera pas |
| URL de sa politique de confidentialité | obligatoire (CNIL) |
| délai de recontact engagé | affiché seulement s'il est renseigné |

Logique :
1. On filtre les partenaires actifs selon l'univers, la zone et le plafond.
2. **Aucun partenaire** → écran 5b : « Nous n'avons pas encore de professionnel partenaire pour ce besoin dans votre secteur. » Pas de formulaire. Option facultative : être prévenu plus tard, avec un consentement distinct.
3. **Un seul partenaire** → il est nommé. Pas de mot « comparer » ni « meilleur ».
4. **Plusieurs partenaires** → l'utilisateur choisit lui-même parmi ceux qui sont affichés, avec les critères d'affichage publiés (zone, univers, disponibilité) et l'ordre expliqué. Ou bien on applique une règle fixe et annoncée. **[À DÉCIDER]**

---

## 5. Textes

### Écran 0 — Accroche
- **Titre (recommandé)** : « Calcaire, goût, eau de boisson : quelle solution pour votre eau ? »
  - Variante test A/B : « Et si vous trouviez la solution adaptée à votre eau ? »
- **Sous-titre** : « Répondez à quelques questions. Nous vous orientons vers un type de solution et, si vous le souhaitez, vers un professionnel qui peut vous proposer un devis. »
- **CTA** : « Découvrir les solutions pour mon eau »
- **Réassurance sous le CTA** (3 points, à garder seulement s'ils sont vrais) :
  - « Moins de 2 minutes » — à mesurer réellement avant de l'afficher
  - « Vous choisissez si vous voulez être recontacté »
  - « Données publiques de l'eau, sources citées »

Le temps de parcours affiché devra correspondre au temps médian mesuré. Je ne le promets pas avant mesure.

### Écrans de questions
- Titres = la question seule. Pas de texte d'introduction.
- Microcopie sous le champ commune : « Pour afficher les données publiques de votre réseau et vérifier qu'un professionnel intervient chez vous. »

### Carte « données de votre eau » (si disponible)
> **Dureté de l'eau dans votre réseau : 28 °f**
> Analyse du contrôle sanitaire du 12/09/2026 — réseau « XXX »
> Source : ministère de la Santé, via Hub'Eau. Ce n'est pas une analyse de votre robinet.

(Les valeurs ci-dessus sont des **exemples de format**, pas des données réelles.)

### Écran 5 — Orientation
- **Titre** : « La solution à étudier : un adoucisseur »
- 2 à 3 phrases tirées de la matrice 4.1
- Volet repliable : « Ce qu'il faut savoir avant de se lancer » (entretien, consommables, installation)
- **CTA** : « Être recontacté par un professionnel »
- Lien secondaire : « Je préfère juste me renseigner »

### Écran 6 — Demande de devis
- **Titre** : « [Partenaire] peut étudier votre projet »
- **Texte** : « Si vous l'acceptez, votre demande et vos réponses seront transmises à [Raison sociale du partenaire]. Un conseiller pourra vous contacter par téléphone ou par e-mail au sujet de votre projet de [catégorie]. »
- « Pourquoi ce professionnel ? » : « Il intervient dans votre secteur pour ce type de solution. » + lien vers « Comment ça marche ».
- **Case obligatoire pour envoyer la demande, décochée par défaut** :
  ☐ « J'accepte que mes coordonnées et mes réponses soient transmises à [Raison sociale] pour qu'il me contacte par téléphone ou par e-mail au sujet de ma demande de devis. »
  - Cette case porte sur l'objet même de la demande. Une case n'est pas « conditionnante » au sens CNIL si elle ne couvre que le service demandé. À faire valider par votre juriste **[À VÉRIFIER]**.
- **Aucune case** « offres de nos partenaires » au lancement. C'est le principal risque CNIL, et on n'en a pas besoin pour convertir.
- **CTA** : « Envoyer ma demande à [Partenaire] »
- **Sous le bouton** : « Vos données ne sont transmises qu'à [Partenaire]. Vous pouvez retirer votre consentement à tout moment. » + lien vers la politique de confidentialité et vers celle du partenaire.

### Écran 7 — Confirmation
- « Votre demande a été transmise à [Partenaire]. »
- « Un conseiller pourra vous contacter [dans un délai de X], si ce délai est engagé. »
- « Ce qui va se passer » : 3 étapes courtes (contact, étude de la faisabilité, devis).
- Rappel : « Un devis ne vous engage à rien. » Seulement si c'est vrai pour le partenaire **[À CONFIRMER]**.

---

## 6. Données publiques sur l'eau

- **Source** : API Hub'Eau Qualité de l'eau potable. Elle diffuse les résultats du contrôle sanitaire, commune par commune, à partir du jeu de données « DIS » publié sur data.gouv.fr. Elle est développée par le BRGM, la Direction générale de la Santé et l'OFB.
- **Paramètre** : titre hydrotimétrique (TH, en °f). Le code Sandre exact sera lu dans l'API pendant le développement : je n'ai pas pu le vérifier ici et je ne l'invente pas.
- **Règles d'affichage** :
  1. Toujours afficher la date du prélèvement, le nom du réseau (UDI) et la source.
  2. Si la commune a plusieurs réseaux, afficher l'information ou une fourchette, sans en choisir un.
  3. Si l'analyse est ancienne (seuil à fixer, par exemple plus de 24 mois) ou absente, ne rien afficher plutôt qu'une donnée trompeuse.
  4. Pas de qualificatif de type « eau très dure » sans grille de référence sourcée. Ces grilles sont usuelles mais pas réglementaires ; si l'on en utilise une, il faut la citer **[À VÉRIFIER]**.
  5. Pour les adoucisseurs : l'arrêté du 11 janvier 2007 contient des valeurs propres aux eaux adoucies (une fiche INRAE mentionne 15 °f pour la dureté et 2,5 °f pour l'alcalinité). Leur statut exact et la version en vigueur, modifiée par l'arrêté du 30 décembre 2022, sont à relire sur Légifrance **[À VÉRIFIER]**. Usage prévu : une phrase du type « un professionnel règle la dureté de sortie », sans chiffre tant que ce n'est pas vérifié.
- **Pas de conformité sanitaire « résumée » sur la page commerciale.** Si on l'affiche, on reprend mot pour mot la conclusion sanitaire officielle.

---

## 7. Mesure et cockpit

Événements envoyés (nom d'événement + propriétés) :

| Événement | Propriétés |
|---|---|
| `session_start` | `session_id`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `gclid`/`fbclid`, `landing_variant`, appareil |
| `step_view` | `step_id`, `step_index` |
| `step_answer` | `step_id`, `answer` (valeurs codées, jamais de donnée personnelle) |
| `water_data_shown` | `has_data`, `nb_udi`, ancienneté de l'analyse |
| `orientation_shown` | `need`, `solution` |
| `no_partner` | `need`, département |
| `lead_submitted` | `lead_id`, `partner_id`, `solution`, `maturite` |
| `lead_delivered` / `lead_rejected` | `lead_id`, code de retour du partenaire |
| `lead_status_update` | `lead_id`, `status` ∈ {accepté, injoignable, RDV, vente, perdu}, envoyé par le partenaire (webhook ou import) |

- L'abandon par étape se calcule à partir de `step_view` sans `step_answer`, ou sans étape suivante.
- Taux clés : visite → besoin choisi → orientation → formulaire → lead envoyé → lead accepté → RDV → vente.
- Consentement cookies : la mesure d'audience peut être exemptée de consentement sous conditions CNIL. Les pixels publicitaires, eux, exigent le consentement **[À VÉRIFIER]** selon les outils choisis.
- Format d'export vers le cockpit **[À CONFIRMER]** : API, base partagée, CSV ?

---

## 8. Risques de confusion ou de promesses trompeuses

| # | Risque | Parade |
|---|---|---|
| 1 | Le site paraît officiel parce qu'il affiche des données du ministère | Mention « Service privé d'orientation » dans l'en-tête ou le pied de page ; données présentées comme une citation sourcée ; pas de logo officiel ni de bleu-blanc-rouge. |
| 2 | Une analyse publique du réseau est prise pour une analyse au robinet du domicile | Mention systématique « Ce n'est pas une analyse de votre robinet ». |
| 3 | Le nom « monbilaneau » évoque un bilan ou diagnostic personnalisé | Ne jamais utiliser « diagnostic » ou « bilan de votre eau ». Préférer « orientation ». À discuter : nom de marque **[À DÉCIDER]**. |
| 4 | Le mot « comparateur » alors qu'un seul partenaire est proposé | Ne pas utiliser « comparateur » ni « meilleur ». Obligations de l'art. L111-7 si l'on classe réellement des offres. |
| 5 | Une eau conforme présentée comme à risque | Aucun message anxiogène ; renvoi vers le distributeur pour les anomalies. |
| 6 | Osmoseur présenté comme « purifiant » ou « plus sain » | Formulations limitées à « réduire certaines substances, selon les performances certifiées de l'appareil ». |
| 7 | Adoucisseur présenté comme traitant tout | Phrase explicite : « Un adoucisseur agit sur le calcaire, pas sur les autres caractéristiques de l'eau. » |
| 8 | Lead revendu ou partagé au-delà du partenaire nommé | Clause contractuelle avec le partenaire ; consentement limité à ce partenaire (CNIL). |
| 9 | Démarchage téléphonique sans consentement valable | Consentement explicite, horodaté et conservé (texte exact de la case, version, date, IP) ; transmis au partenaire avec le lead. |
| 10 | « Gratuit », « sans engagement », « sous 48 h » affichés sans engagement réel | Affichés seulement si le partenaire s'y engage par écrit. |
| 11 | Faux sentiment d'urgence ou de rareté | Aucun compteur, aucune promotion limitée dans le temps. |
| 12 | Locataire orienté vers une installation impossible | Message sur l'accord du propriétaire. |
| 13 | Données d'eau anciennes ou attribuées au mauvais réseau | Règles d'affichage de la section 6 ; rien n'est affiché en cas de doute. |

---

## 9. Ce dont j'ai besoin de votre part

1. **Partenaires réels** : noms, univers, zones, engagements (délai, gratuité du devis), format de réception du lead.
2. **Entité juridique** éditrice du site et mode de rémunération (au lead, à la vente…), pour les pages « Comment ça marche » et les mentions légales.
3. **Pile technique de Couverture Mutuelle V2** et **format du cockpit**, pour réutiliser ce qui existe.
4. **Nom de marque** : garder « monbilaneau » ou non (cf. risque 3).
5. **Plusieurs partenaires** : l'utilisateur choisit, ou une règle fixe ?
6. Validation par votre juriste des textes de consentement de l'écran 6.

---

## Sources

- Hub'Eau, Qualité de l'eau potable (data.gouv.fr) : https://www.data.gouv.fr/dataservices/hubeau-qualite-de-leau-potable
- Documentation de l'API Hub'Eau Qualité de l'eau potable : https://hubeau.eaufrance.fr/page/api-qualite-eau-potable
- Paquet R hubeau (INRAE), liste des endpoints et filtres : https://inrae.github.io/hubeau/reference/get_qualite_eau_potable.html
- CNIL, transmission de données à des partenaires (B to C) : https://www.cnil.fr/fr/la-prospection-b-to-c-quelles-regles-pour-transmettre-des-donnees-des-partenaires
- CNIL, prospection commerciale par téléphone : https://cnil.fr/fr/node/168599
- Démarchage téléphonique depuis le 11 août 2026 (Actu-Juridique) : https://www.actu-juridique.fr/affaires/droit-economique/reforme-du-demarchage-telephonique-mise-en-pratique-depuis-le-11-aout-2026/
- Démarchage téléphonique, consentement préalable (Weblex) : https://www.weblex.fr/weblex-actualite/demarchage-telephone-consentement-prealable-obligatoire
- Code de la consommation, art. L111-7 (Légifrance) : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000035732365
- INC, transparence des sites comparateurs : https://www.inc-conso.fr/node/9108
- Arrêté du 11 janvier 2007 (Légifrance) : https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000465574/
- Fiche INRAE sur les paramètres de l'eau : https://odr.inrae.fr/intranet/carto/cartowiki/images/4/4b/Parametres_eau.pdf
- Arrêté modificatif du 30 décembre 2022 (AIDA, INERIS) : https://aida.ineris.fr/reglementation/arrete-301222-modifiant-larrete-11-janvier-2007-relatif-limites-references-qualite
- DGCCRF, pratiques commerciales trompeuses dans la rénovation énergétique : https://www.economie.gouv.fr/dgccrf/Publications/Vie-pratique/Fiches-pratiques/pratiques-commerciales-trompeuses-dans-secteur-renovation-energetique
- ANSES, matériaux et procédés de traitement des eaux : https://www.anses.fr/fr/content/materiaux-et-objets-au-contact-de-leau-produits-et-procedes-de-traitement-des-eaux-de
- Baymard, conception des formulaires : https://baymard.com/learn/form-design
- Baymard, bonnes pratiques des formulaires de paiement : https://baymard.com/blog/checkout-form-best-practices
- Bobex, devis adoucisseur : https://www.bobex.be/fr-be/adoucisseur-deau/adoucisseur-deau-devis/
- Habitatpresto, devis osmoseur : https://www.habitatpresto.com/devis-travaux/devis-osmoseur
