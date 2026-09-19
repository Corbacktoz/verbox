# Livraison Verbox — 19 septembre 2026

Dossier de travail : verbox-development. Les copies verbox-repo, verbox-rgpd et les fichiers à la racine du workspace restent préservés.

## Ordre des branches

1. fix/site-hygiene — PR #5, base main.
2. feat/project-information — PR #6, base fix/site-hygiene.
3. feat/level-guides — PR #7, base feat/project-information.
4. feat/verb-reference-pages — PR #8, base feat/level-guides.
5. fix/seo-route-coverage — PR #9, base feat/verb-reference-pages.
6. perf/measure-static-pages — mesures avant/après, base fix/seo-route-coverage.
7. test/accessibility-and-resilience — contrôles HTML/audience, stockage robuste et retour du focus, base perf/measure-static-pages.

Ces branches sont empilées. Ne pas fusionner les branches intermédiaires en sens inverse : fusionner dans cet ordre, puis recibler chaque PR suivante sur main après sa dépendance. Le site public n’a pas été déployé par cette tâche.

## Contrôles de livraison

- Relecture assistée effectuée : voir CONTENT-REVIEW.md, avec sources, corrections et limites.
- Statut confirmé par l’éditeur : particulier, activité non professionnelle. Mentions adaptées, directeur de publication et hébergeur renseignés.
- Validation juridique complète encore ouverte : l’éditeur confirme ne pas avoir communiqué les éléments d’identification personnelle à GitHub. L’article 1-1 II de la LCEN conditionne la limitation des mentions publiques à cette transmission. Aucune adresse privée ou donnée manquante n’a été inventée. Avant publication, régler ce point avec l’hébergeur ou choisir les mentions publiques complètes applicables.
- Source légale consultée le 19 septembre 2026 : https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164 (article 1-1 I et II).
- Parcours clavier réalisé dans le navigateur sur la version statique locale : dix réponses, succès et erreurs, passage par Entrée, résultat, relance, Échap, continuer/quitter et retour au bouton de départ après reconstruction du DOM. Tab et Maj+Tab bouclent dans le dialogue après correction d’une sortie vers le navigateur. Aucune erreur console observée. Ceci ne constitue pas un audit complet avec lecteur d’écran.
- Validation locale : 31 tests fonctionnels/contenu/audience, 11 tests SEO, build et design verts.
- Contrôles GitHub du dernier commit à consulter sur la dernière PR avant fusion ; aucune publication effectuée.
- Search Console accessible pour la propriété verbox.fr ; le 19 septembre 2026, les rapports d’indexation et performances indiquent « Traitement des données en cours ». Les nouvelles pages ne peuvent pas être vérifiées en production avant leur déploiement.

## Après publication

Vérifier le succès du déploiement GitHub Pages et les URL canoniques publiques. Contrôler le sitemap https://verbox.fr/sitemap.xml (24 URL prévues), puis inspecter l’accueil, une page de niveau et les nouvelles fiches dans Search Console. Distinguer accessibilité au test en direct et indexation effective ; aucune indexation n’est garantie ni déclarée acquise.
