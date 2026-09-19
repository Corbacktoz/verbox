# Verbox — référencement et indexation

Audit et préparation réalisés le 18 septembre 2026. Le domaine officiel est `https://verbox.fr`, sans `www`. Il est configuré pour les canoniques, le sitemap, les données structurées et les images de partage. Le site fonctionne localement ; aucune publication ni demande d’indexation n’a été effectuée.

## État de préparation

| Priorité | Point constaté | Traitement |
| --- | --- | --- |
| Haute | Ancien nom Conjugo dans l’interface et les fichiers | Renommage en Verbox, favicon et image de partage. Reprise des anciens progrès locaux conservée. |
| Haute | Contenu principal absent du HTML initial | HTML prérendu pour les pages publiques ; mêmes textes pédagogiques accessibles aux visiteurs et aux robots. |
| Haute | Navigation par boutons, sans URL propre | Liens HTML vers les pages des niveaux, les fiches, l’aide et les progrès. |
| Haute | Pas de sitemap ni de règles robots | Génération de `/sitemap.xml` et `/robots.txt` pour le domaine de production. |
| Haute | Même titre pour tous les écrans | Titres, descriptions et canoniques propres aux URL. |
| Haute | Domaine officiel | `https://verbox.fr` configuré dans `site.config.json` ; fichiers de production générés dans `dist/`. |
| Moyenne | Fiches peu détaillées | Six leçons avec explications, points à retenir et tableaux de verbes. |
| Moyenne | Pas de données structurées | `WebSite`, `WebPage` et fil d’Ariane des leçons, sans notes, avis ou auteur inventés. |
| Moyenne | Pas d’aperçu de partage | Open Graph, Twitter Card, image PNG 1200 × 630 et favicon SVG. |
| Moyenne | Risque de doublons et de fausses pages | Canoniques sans paramètres, redirections des variantes `index.html`, vraies réponses HTTP 404. |
| Moyenne | Espaces de peu d’intérêt pour la recherche | Progrès en `noindex` ; atelier de design exclu du build public. |

## Pages et intentions

| URL | Intention principale |
| --- | --- |
| `/` | Exercices de conjugaison gratuits du CE2 au CM2 et présentation de Verbox |
| `/conjugaison-ce2/` | Présent, imparfait et futur avec les verbes de la sélection CE2 |
| `/conjugaison-cm1/` | Verbes fréquents et passé composé dans la sélection CM1 |
| `/conjugaison-cm2/` | Entraînement aux six temps de la sélection CM2 |
| `/fiches/` | Accès aux leçons et aux tableaux de conjugaison |
| `/fiches/le-present/` | Règles et conjugaisons au présent |
| `/fiches/imparfait/` | Règles et conjugaisons à l’imparfait |
| `/fiches/futur-simple/` | Règles et conjugaisons au futur simple |
| `/fiches/passe-compose/` | Passé composé avec avoir |
| `/fiches/passe-simple/` | Formes du passé simple et récit |
| `/fiches/plus-que-parfait/` | Plus-que-parfait avec avoir |
| `/aide/` | Fonctionnement, points, chronomètre et stockage des résultats |

Ces douze pages publiques sont dans le sitemap. `/progres/` est une treizième page, exclue de l’indexation et du sitemap. Les paramètres `?temps=...` servent à présélectionner un exercice ; leur canonique est la page du niveau, sans paramètres. Les parties aléatoires et les résultats individuels ne créent pas de nouvelles URL.

## Robots et indexation

En production, les robots peuvent explorer le site et ses ressources CSS, JavaScript et images. Le fichier robots signale le sitemap. Les pages de progrès restent explorables afin que les moteurs puissent lire leur instruction `noindex`. Un blocage dans robots.txt ne remplace pas `noindex` et ne protège pas des données privées. [Documentation Google sur robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro), [instruction noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

L’aperçu local envoie `noindex, follow` dans les métadonnées et dans l’en-tête HTTP. Il ne publie pas de sitemap. La version de production rend uniquement les douze pages publiques indexables. Le HTML initial fournit le contenu et des liens HTML utilisables avant l’exécution de JavaScript. [JavaScript et référencement](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [liens explorables](https://developers.google.com/search/docs/crawling-indexing/links-crawlable).

Le sitemap contient des adresses absolues canoniques. Il n’ajoute pas de dates de modification artificielles, de priorités ou de fréquences arbitraires. Le soumettre aide à la découverte mais ne garantit pas l’indexation. [Créer et soumettre un sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

La politique actuelle ne distingue pas les robots de recherche des autres robots : `User-agent: *` autorise l’exploration. Aucune politique particulière concernant l’entraînement des modèles d’IA n’a été décidée. Un fichier `llms.txt`, s’il est envisagé ultérieurement, ne remplace pas le sitemap, les liens et les règles d’indexation. Aucun dispositif de ce type n’est nécessaire au fonctionnement livré.

## Configuration et publication

1. Domaine retenu : `https://verbox.fr`, sans `www`.
2. Cette origine HTTPS est renseignée dans `siteUrl` de `site.config.json`. La conserver identique dans l’hébergement.
3. Ajouter, si cette méthode de vérification est retenue, les valeurs `googleSiteVerification` et `bingSiteVerification` fournies par les services. La vérification DNS se fait chez le gestionnaire du domaine.
4. Lancer `npm run build` et publier uniquement `dist/`, à la racine du domaine.
5. Activer HTTPS et les redirections permanentes de HTTP et des variantes du domaine vers l’origine choisie.
6. Vérifier la gestion des chemins terminés par `/`, des fichiers `index.html` et des pages absentes chez l’hébergeur. Ne pas transformer toutes les URL inconnues en accueil avec un statut 200.
7. Protéger les environnements privés de test par authentification si leur contenu doit être confidentiel ; `noindex` n’est pas une mesure d’accès.

`_headers` et `_redirects` sont fournis pour les hébergeurs compatibles. Leur interprétation reste à vérifier sur l’hébergement effectivement choisi. Sur un autre serveur, configurer les règles équivalentes. La redirection entre domaines et l’activation HTTPS sont des paramètres d’hébergement, pas des balises HTML.

Le favicon se trouve dans `assets/favicon.svg` ; l’image sociale dans `assets/og-verbox.png`. Les URL canoniques, l’image sociale et le JSON-LD utilisent tous la même origine configurée. `WebSite` indique le nom Verbox, sans garantir la présentation choisie par Google. [Nom de site dans Google Search](https://developers.google.com/search/docs/appearance/site-names).

## À effectuer après mise en ligne

- Valider la propriété du domaine `verbox.fr` dans [Google Search Console](https://search.google.com/search-console/), puis soumettre `https://verbox.fr/sitemap.xml`.
- Inspecter l’accueil, une page de niveau et une leçon. Vérifier leur HTML rendu, le statut d’exploration et la canonique retenue ; demander l’indexation des pages importantes si nécessaire. [Démarrer avec Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start).
- Ajouter le domaine à [Bing Webmaster Tools](https://www.bing.com/webmasters/), valider la propriété et soumettre le même sitemap. [Procédure officielle Bing](https://www4.bing.com/webmasters/help/getting-started-checklist-66a806de).
- Contrôler sur le domaine réel : HTTP 200 pour les pages publiques, HTTP 404 pour une URL inexistante, aucune instruction `noindex` sur les douze pages publiques et aucune ressource essentielle bloquée.
- Tester la structure JSON-LD et le fil d’Ariane avec les outils de validation des moteurs. Les schémas décrivent les pages ; ils ne garantissent pas de résultat enrichi.
- Tester l’affichage réel d’un lien partagé et son image.
- Mesurer les performances mobiles sur l’hébergement réel avec PageSpeed Insights et les données de terrain de Search Console lorsqu’elles existent. Objectifs de travail : LCP au plus 2,5 s, INP au plus 200 ms, CLS au plus 0,1. Aucun score Lighthouse ou résultat Core Web Vitals n’a été mesuré ici.
- Surveiller ensuite les pages non indexées, erreurs serveur, clics et requêtes ; corriger les problèmes observés avant de multiplier les pages.

## Contenu et confiance à compléter

- Faire relire les leçons et les conjugaisons par une personne compétente en pédagogie du primaire. Les niveaux constituent actuellement une sélection d’entraînement, sans affirmation de couverture exhaustive des programmes.
- Préparer une page « À propos » avec l’identité réelle du projet, son objectif et les personnes qui rédigent ou relisent les contenus. Ajouter un moyen de signaler une erreur.
- Renseigner les informations de l’éditeur, le contact et les informations de confidentialité adaptées à l’exploitation réelle. Aucun nom d’éditeur, adresse, statut professionnel ou certification n’a été inventé.
- Étoffer les contenus à partir de besoins précis : accords avec être, verbes manquants, exercices en contexte. Créer une page nouvelle uniquement si elle apporte une leçon ou une activité distincte.
- Faire connaître le site auprès d’enseignants, de parents et de ressources éducatives pertinentes ; rechercher des mentions utiles, sans achat de liens ni échange automatisé.

## Vérification technique locale

```sh
npm test
npm run design:check
npm run seo:check
```

Les tests SEO couvrent les titres uniques, les canoniques, les directives d’indexation, les liens internes, le JSON-LD, le sitemap, les en-têtes et codes HTTP, les redirections, les dimensions de l’image sociale et un build statique complet en dossier temporaire. Les URL réservées en `.example` ne sont utilisées que dans les tests et ne sont pas enregistrées dans la configuration du site.

Les contrôles locaux établissent la préparation technique. Le domaine est configuré dans le projet ; son raccordement à l’hébergement, HTTPS, l’indexation effective et le positionnement restent à vérifier après publication. Prévoir des redirections permanentes de `http://verbox.fr` et des variantes `www` vers `https://verbox.fr`.

## Maintenance du 19 septembre 2026

Sur la base `47eaa6d`, la feuille CSS passe de 523 331 à 37 543 octets (fichiers de travail Windows), sans modification autre que l’indentation initiale des lignes. Le formateur compte désormais les accolades fermantes en fin de déclaration et ignore celles des chaînes et commentaires. Une comparaison conservant tous les espaces internes et les retours à la ligne vérifie cette propriété. `dist/` est reconstruit en CI, sans copie suivie dans Git.

Le nombre de tests de l’ancien audit était périmé : avant ces travaux, 21 tests fonctionnels et d’audience et 7 tests SEO passent sur cette base. Les performances réseau et l’indexation ne se déduisent pas de la seule taille du CSS.

Les routes `/a-propos/` (indexable) et `/mentions-legales/` (noindex) sont ajoutées. Les attentes de taille du sitemap sont désormais calculées à partir des routes ; le nombre historique de douze pages ci-dessus décrit l’audit initial.

Les trois pages de niveau ont une introduction et une méthode distinctes. Le contenu est évalué sur ses informations utiles, sans quota de mots. Les listes de verbes proviennent de `allowedVerbs(level)` ; les exemples et corrections sont testés contre les données. Une relecture pédagogique reste nécessaire avant publication.

Le hub et les dix pages de verbes sont indexables dans le build de production, avec canoniques, fil d’Ariane et sitemap dérivés des routes. Le titre promet six temps, pas tous les temps. Les liens depuis les niveaux ne pointent que vers les fiches existantes. L’extension aux trente autres verbes attend le retour d’indexation du propriétaire. Aucun nouveau traceur ni événement n’a été ajouté.

## Contrôles des routes

Toutes les routes restent accessibles en trois clics au plus depuis l’accueil. Le sitemap exclut explicitement progrès, confidentialité, mentions légales et 404. Un champ optionnel `updated` accepte une date réelle au format AAAA-MM-JJ ; aucune route ne reçoit automatiquement la date du build. Deux builds successifs sont comparés octet par octet. Les variantes `index.html` sont listées dans `_redirects`, mais ce fichier ne crée pas de redirection sur GitHub Pages : les canoniques HTML restent essentielles. IndexNow n’est pas activé.

## Performance mesurée le 19 septembre 2026

Lighthouse 12.8.2, profil mobile par défaut et réseau/CPU simulés, Chrome headless local. Même machine et serveur HTTP statique sans compression : artefact initial 47eaa6d sur localhost:5181, artefact a29e085 sur localhost:5182. Une mesure par page et par état ; ces résultats ne sont pas des médianes ni une mesure de production. Matomo ne se charge pas sur localhost. Les valeurs détaillées et paramètres figurent dans PERFORMANCE-MEASUREMENTS.json.

| Page | Score avant → après | LCP avant → après | TBT avant → après | CLS |
| --- | --- | --- | --- | --- |
| Accueil | 73 → 98 | 4,40 s → 2,09 s | 0 → 10,5 ms | 0 → 0 |
| CE2 | 74 → 98 | 4,39 s → 2,08 s | 0 → 15 ms | 0 → 0 |
| Présent | 75 → 98 | 4,38 s → 2,09 s | 0 → 0 ms | 0 → 0 |

Commande : npx --yes lighthouse@12.8.2 URL --only-categories=performance --chrome-flags="--headless=new" --output=json --output-path=RAPPORT.json. Outil ponctuel, aucune dépendance ajoutée au projet.

Les objectifs LCP ≤ 2,5 s et CLS ≤ 0,1 sont atteints dans ces simulations. Lighthouse au chargement ne mesure pas l’INP : il reste à vérifier par des interactions et, si disponibles, les données terrain de Search Console. Le TBT est un indicateur de diagnostic, pas une mesure de l’INP.

Le gain observé accompagne la correction de l’indentation, ainsi que les nouveaux contenus et modules ; il ne constitue pas une expérience isolant chaque modification. Les trois feuilles CSS restent séparées, sans minification artisanale. app.js et audience.js sont des modules, et le contenu public est prérendu. L’image de partage mesure déjà 15 081 octets pour 1200 × 630 : aucune recompression nécessaire. La CSP optionnelle n’est pas ajoutée : les styles dynamiques du quiz demanderaient un traitement dédié et vérifié.

## Livraison et vérification finale

Le build courant contient 27 routes HTML (plus 404.html), dont 24 indexables. Les références historiques à 12 ou 14 pages décrivent l’état initial. Les exercices en contexte existent déjà et ne font pas partie d’une extension future à réimplémenter.

Contrôles locaux : 30 tests fonctionnels, de contenu et d’audience ; 11 tests SEO ; build et design verts. Le chargeur de statistiques est testé pour chaque route et pour opposition, DNT, GPC et stockage bloqué. Les tableaux et la fiche voir ont été contrôlés visuellement à des largeurs de fenêtre de 390 et 320 px, sans débordement horizontal. Le rendu bureau de la fiche être a également été contrôlé.

La validation manuelle du quiz au clavier n’a pas pu être terminée : le contrôle automatique d’autorisation du navigateur a épuisé son quota avant l’ouverture du quiz. Elle reste à effectuer, notamment pour Échap, la confirmation de sortie et le retour du focus après une série. Le code conserve désormais la cible de retour du focus et retrouve le bouton reconstruit après affichage du bilan. Aucune conformité globale d’accessibilité n’est revendiquée.

Les nouvelles fiches restent en PR brouillon pour relecture pédagogique ; les textes légaux restent à valider selon le statut de l’éditeur. Le domaine, Matomo et les données d’identité n’ont pas été modifiés ; seule l’adresse publique de GitHub autorisée par le propriétaire a été ajoutée à la configuration.
