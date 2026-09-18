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
