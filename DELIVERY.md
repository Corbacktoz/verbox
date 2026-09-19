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

## Avant publication des contenus

- Effectuer la relecture pédagogique de CONTENT-REVIEW.md.
- Valider les mentions selon le statut réel de l’éditeur.
- Terminer le parcours clavier du quiz (blocage de l’outil navigateur par quota d’autorisation).
- Vérifier les checks GitHub du commit final et, après publication, l’indexation avec Search Console.

## Description préparée pour la dernière PR

Le chargeur de progrès gère les sauvegardes corrompues, les clés héritées et les valeurs de types inattendus, sans perdre les sauvegardes valides ni la migration Conjugo. Le dialogue retrouve le bouton de lancement après la reconstruction de la page de résultats. Les contrôles HTML couvrent langue, titres, identifiants, tableaux et scripts ; chaque route est testée avec les préférences de confidentialité.

Validation locale : 30 tests fonctionnels/contenu/audience, 11 tests SEO, build et design verts. Contrôle visuel bureau et tableaux mobiles à 390/320 px. Le parcours clavier complet reste à terminer : le contrôle automatique d’autorisation du navigateur a été bloqué par son quota.
