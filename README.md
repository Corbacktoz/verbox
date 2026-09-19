# Verbox

Site éducatif de conjugaison en français, adapté aux ordinateurs et aux mobiles. Sans dépendance à installer, sans compte et sans publicité.

## Lancer le site

Avec Node.js 22 ou supérieur installé (Node 24 en CI) :

```sh
npm run dev
```

Ouvrir http://localhost:5173. Le serveur local n’écoute que sur cet ordinateur. Le port peut être changé avec la variable `PORT`.

## Fonctionnalités

- CE2 : présent, imparfait, futur ; verbes en -er, être et avoir.
- CM1 : ajout de verbes fréquents et du passé composé avec avoir.
- CM2 : ajout du passé simple et du plus-que-parfait avec avoir.
- 40 verbes et 1 440 combinaisons verbe / temps / personne au total : 468 accessibles en CE2, 960 en CM1, 1 440 en CM2 (les niveaux partagent leur contenu).
- Séries de dix questions : QCM, conjugaison écrite, phrase à compléter et erreur à corriger, au choix ou mélangés.
- Nouveautés prioritaires et jusqu’à trois révisions par série tant que de nouvelles conjugaisons restent ; mode dédié aux révisions et mélange des temps.
- Révisions prévues après 1, 3, 7, 14 et 30 jours de réussite successive ; les erreurs reviennent dès une prochaine séance. Une fois les nouveautés épuisées, les questions les moins récemment vues complètent les séries.
- Carnet de découvertes, mission quotidienne et six étapes de voyage par niveau, sans obligation de jouer plusieurs jours consécutifs.
- Saisie avec touches accentuées et indice facultatif ; casse et espaces tolérés, accents exigés.
- Entraînement sans limite de temps ou défi de 90 secondes.
- Dix points par réponse juste, quinze à partir de la troisième bonne réponse consécutive.
- Objectif quotidien de 100 points, historique et trois trophées.
- Sauvegarde locale dans le navigateur ; les appareils et profils ne sont pas synchronisés.
- Navigation clavier, dialogues accessibles, adaptation aux petits écrans et aux préférences de réduction des animations.

Les activités constituent un entraînement ciblé, pas une couverture exhaustive des programmes scolaires. Les temps composés de cette version utilisent exclusivement l’auxiliaire avoir et n’incluent pas d’exercice d’accord du participe passé.

Les anciens points et résultats sont conservés. Le suivi question par question commence avec les nouvelles séances, dans la même sauvegarde locale. Il est enregistré à la fin d’une série (y compris à la fin du chrono), jamais pour une série abandonnée. « Consolidée » signifie trois réponses justes de suite à une conjugaison ; ce repère n’est pas une évaluation scolaire. Les étapes déjà acquises restent validées après une erreur ultérieure.

La variété et le parcours visent à renouveler l’entraînement. Aucune durée de motivation n’est garantie ; elle dépend de l’enfant et des usages.

## Vérifier

```sh
npm test
npm run seo:check
npm run design:check
```

## Publication

### GitHub Pages — verbox.fr

Le workflow `.github/workflows/pages.yml` teste le site, lance `npm run build` et publie **le contenu de `dist/`** à chaque modification de `main`. Les pull requests exécutent les contrôles sans publier.

Configuration initiale dans le dépôt GitHub :

1. Dans **Settings → Pages → Build and deployment → Source**, sélectionner **GitHub Actions**.
2. Conserver **verbox.fr** dans **Custom domain** et activer **Enforce HTTPS** lorsque GitHub le permet.
3. Fusionner le correctif de déploiement dans `main`. Si le workflow avait déjà démarré avant le changement de source, le relancer depuis **Actions → Deploy Verbox to GitHub Pages → Run workflow**.
4. Vérifier `/fiches/`, `/fiches/le-present/`, `/conjugaison-ce2/`, `/conjugaison-cm1/`, `/conjugaison-cm2/`, `/aide/`, `/progres/`, `/robots.txt` et `/sitemap.xml` sur le domaine public. Une URL inexistante doit conserver un statut 404.

Publier `main / (root)` directement expose le modèle de développement : `/fiches/` n'existe pas à cet emplacement, ce qui provoque les erreurs 404. GitHub Pages n'exécute pas `server.js` et n'interprète pas `_redirects` ni `_headers`. Les vrais fichiers `fiches/index.html`, etc., doivent être à la racine de l'artefact publié. Le build fournit aussi `404.html`, `.nojekyll` et `CNAME`.

Documentation : [publication par GitHub Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

### Autres hébergements

L’origine officielle `https://verbox.fr` est configurée dans `site.config.json`. Lancer `npm run build`, puis publier **uniquement le contenu de `dist/`** à la racine de ce domaine : il contient les pages HTML prérendues, les ressources, `robots.txt`, `sitemap.xml` et une page 404. Ne pas publier directement les sources : le modèle `index.html` est volontairement non indexable.

Sans nom de domaine configuré, le build de production refuse de générer des URL fictives. La variable d’environnement `SITE_URL` peut remplacer la valeur du fichier de configuration dans l’hébergement.

L’aperçu `npm run dev` reste en `noindex`, même si un domaine est configuré. Une exploitation avec le serveur Node exige `NODE_ENV=production` et un reverse proxy HTTPS ; le serveur écoute sur 127.0.0.1. Pour un hébergement statique, utiliser le dossier `dist/` et vérifier la gestion des redirections et des réponses 404 de l’hébergeur. Les fichiers `_headers` et `_redirects` sont fournis pour les plateformes qui les interprètent ; les adapter ailleurs.

Voir `SEO.md` pour l’audit, les URL prévues et les étapes Search Console / Bing. Les polices système sont utilisées sans requête vers Google Fonts.

## Système de design

Voir `DESIGN.md` pour la direction visuelle et les conventions. `design-tokens.json` centralise les couleurs, les tailles, les espacements et les états. `design-system.css` définit les composants partagés. `design-preview.html` est un atelier interactif autonome, également accessible sur http://localhost:5173/design-preview.html.

Après une modification des tokens ou des composants :

```sh
npm run design:build
npm run design:check
```

## Hygiène du build — 19 septembre 2026

`dist/` est généré et ignoré par Git. Une copie propre des sources suffit : `npm run build` crée le dossier publié par GitHub Actions. Le formatage CSS ne change que les espaces en début de ligne ; les sélecteurs et les valeurs restent identiques. Le contrôle de design limite la feuille à 80 Ko et l’indentation à huit espaces.

Les pages `/a-propos/` et `/mentions-legales/` présentent le projet, le contact et l’hébergement. Elles restent lisibles sans JavaScript. L’adresse de GitHub est configurable dans `privacy.hostAddress`.

Les pages CE2, CM1 et CM2 présentent leur sélection réelle de verbes par groupe, leurs temps, des exemples et trois erreurs expliquées. Ces guides restent accessibles avant JavaScript et accompagnent les exercices.
