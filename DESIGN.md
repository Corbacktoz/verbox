# Verbox — système de design

Version 1.0 · 18 septembre 2026

## Exercices variés et parcours

Les cartes de voyage et de mission reprennent les surfaces, contours et espacements existants. Une étape indique textuellement « En cours », « À débloquer » ou « Étape accomplie » ; sa couleur seule ne porte pas l’état. Le voyage conserve toutes les activités accessibles et ne pénalise pas les pauses.

Les exercices écrits utilisent un champ étiqueté, une consigne avec le temps demandé, la validation par Entrée, un indice facultatif et des touches accentuées d’au moins 44 px. Les corrections sont annoncées dans la zone de retour existante. Sur mobile, les étapes passent à deux colonnes et les touches se répartissent sur plusieurs lignes. Le bilan propose de faire une pause avant de relancer une série.

## Intention

Verbox est un carnet d’entraînement à la conjugaison pour les élèves de CE2, CM1 et CM2. La première page permet de choisir sa classe, un temps et un mode de jeu. L’interface reste calme et encourageante : les points valorisent l’effort, et les corrections indiquent toujours comment progresser.

La direction retenue associe un fond papier, un vert forêt, une action principale en terre cuite et des repères pastel par temps. Le livre et le crayon illustrent l’activité. Ils sont décoratifs et masqués aux technologies d’assistance.

## Références étudiées

Les pages suivantes ont été consultées dans le navigateur. Les observations portent sur l’organisation des interfaces, sans reprendre leurs textes ni leurs ressources graphiques.

| Référence | Observation | Application à Verbox |
| --- | --- | --- |
| [Lumni — primaire](https://www.lumni.fr/primaire) | Sépare jeux, quiz et ressources de cours ; affiche les récompenses dans la navigation. | Garder les exercices, les fiches et les progrès dans trois entrées distinctes ; rendre les points visibles. |
| [Ortholud — Je conjugue](https://www.ortholud.com/je_conjugue.html) | Organise les exercices autour des temps, des groupes et des verbes. | Nommer chaque temps explicitement et donner un court indice temporel. |
| [Logiciel Éducatif — conjugaison](https://www.logicieleducatif.fr/jeux/domaine/conjugaison/college) | Propose un filtre de niveau et des activités nommées par compétence. | Garder le choix CE2 / CM1 / CM2 près des activités et les intitulés des temps visibles. |

Ces choix sont des décisions de conception, pas une mesure comparative de l’efficacité pédagogique de ces sites.

## Source des styles

| Fichier | Rôle |
| --- | --- |
| `design-tokens.json` | Source des couleurs, polices, tailles, espacements, rayons, ombres, transitions et points de rupture. |
| `design-tokens.css` | Variables CSS générées depuis le JSON. |
| `styles.css` | Structure, disposition et adaptations selon la largeur. Les 136 couleurs littérales initiales ont été remplacées par la palette commune. |
| `design-system.css` | Contrats partagés des boutons, cartes, corrections, sélections, cibles tactiles et focus. |
| `design-preview.html` | Atelier interactif autonome, sans dépendance et sans requête réseau. |
| `scripts/design-preview.template.html` | Source de la page de démonstration. |

Le site charge la disposition, puis les tokens, puis les composants. La page de démonstration embarque les mêmes tokens et les mêmes contrats de composants. Les couleurs de l’illustration SVG restent propres au dessin : elles ne portent aucune information fonctionnelle.

## Palette et sens

- `canvas`, `surface`, `surface-soft`, `surface-warm` : distinguent la page, les surfaces, la sélection et les fiches de rappel.
- `ink` et `muted` : textes principaux et secondaires. Le texte secondaire demeure lisible sur blanc et sur le papier chaud.
- `brand` : identité, liens, navigation active et focus.
- `accent` : action principale de lancement ou de poursuite. Sa teinte a été assombrie pour rendre le texte blanc lisible.
- `success` / `success-soft` : bonne réponse, toujours accompagnée d’un message explicite.
- `error` / `error-soft` : réponse à revoir. Aucune pénalité de points et aucun message dévalorisant.
- `sage`, `lavender`, `blue`, `pink`, `gold` et leurs fonds : repères décoratifs des temps et des trophées. Les libellés identifient toujours le contenu.
- `border-strong` : limite visible des réponses et des cartes interactives. Les séparateurs décoratifs utilisent `border`.

Les couleurs sont nommées par rôle. Pour un nouveau composant, utiliser un rôle existant avant d’ajouter une nuance.

## Typographie

| Usage | Token | Taille |
| --- | --- | --- |
| Métadonnée et information secondaire | `font-size-caption` | 12 px |
| Contrôle et texte compact | `font-size-small` | 14 px |
| Texte courant et titre de carte | `font-size-body` | 16 px |
| Petit titre | `font-size-subtitle` | 18 px |
| Titre de section | `font-size-section` | 20 px |
| Titre de page compact | `font-size-title` | 28 px |
| Grand titre | `font-size-display` | 32 px |
| Verbe de l’exercice | `font-size-question` | 36 px |

Manrope donne des titres arrondis ; DM Sans sert les textes et les contrôles. Segoe UI et les polices système assurent le repli. Les familles nommées utilisent les polices disponibles localement, puis les polices système ; aucune police externe n’est téléchargée. Les informations essentielles ne descendent pas sous 12 px. Les libellés peuvent revenir à la ligne.

## Espacement, formes et mouvement

Échelle de rythme : 4, 8, 12, 16, 20, 24, 32, 40, 48 et 64 px. Les espacements entre éléments et les marges intérieures utilisent les tokens `space-*`.

Les rayons 8 / 12 / 16 / 20 / 24 px distinguent détails, contrôles, cartes et dialogues. Les cercles sont réservés à l’avatar, aux indicateurs de sélection et à l’objectif quotidien. Les ajustements de 1 px sur les cartes sélectionnées compensent la bordure et évitent de déplacer leur contenu.

Les ombres sont discrètes. Une ombre courte donne du relief à l’action principale. Les transitions de 150–200 ms signalent un changement d’état. `prefers-reduced-motion` désactive les transitions et les animations.

## Contrats des composants

| Composant | États et règles |
| --- | --- |
| Action principale | Fond terre cuite, texte blanc, survol plus sombre, focus visible, état désactivé sans ombre. |
| Action secondaire | Fond blanc, bordure contrastée, texte vert. Même hauteur minimale que l’action principale. |
| Carte de temps | Titre, indice, icône et progression. Sélection avec bordure plus épaisse, coche et `aria-pressed`. |
| Choix du niveau | Trois boutons exclusifs avec `aria-pressed`. Le niveau conserve son nom dans toutes les pages. |
| Choix du mode | Libellé, durée ou absence de limite, coche sur le mode actif. |
| Réponse | Quatre choix, verrouillés après validation ; correction textuelle immédiate. |
| Feedback | Zone annoncée poliment ; bonne réponse ou correction et rappel de la règle. |
| Chronomètre | Chiffres tabulaires. Affichage plus visible sur les 15 dernières secondes. Le temps continue si l’onglet est masqué. |
| Dialogue | Dialogue HTML natif ; fermeture à confirmer pendant une série ; focus dirigé sur les réponses et la suite. |
| Progrès vide | Invitation à commencer ; aucun historique ou trophée obtenu inventé. |
| Sauvegarde indisponible | Message expliquant que les progrès ne seront pas conservés. Le jeu reste utilisable. |

La cible tactile minimale des boutons est de 44 px. Les réponses et cartes occupent une surface plus grande. Le focus clavier utilise un contour de 3 px, écarté de 4 px.

## Comportement responsive

- Jusqu’à 380 px : icônes de navigation masquées pour laisser de la place aux noms ; objectifs sur une colonne ; actions de dialogue autorisées à passer à la ligne.
- Jusqu’à 700 px : navigation en haut, deux colonnes de cartes, bouton principal pleine largeur, fiches sur une colonne.
- Jusqu’à 1020 px : objectifs sous l’entraînement ; navigation latérale sur tablette.
- Au-delà : entraînement et objectifs côte à côte ; largeur de lecture limitée à 1320 px.
- À partir de 1500 px : marges et illustration adaptées aux écrans larges.

Les valeurs des media queries restent littérales, car les variables CSS ne se substituent pas directement dans les conditions des media queries. Leur référence se trouve dans `breakpoint` du JSON.

Le thème clair est le seul thème livré. Un thème sombre n’a pas été demandé et n’est pas simulé par une inversion des couleurs.

## Contrôles réalisés

`npm run design:check` vérifie la synchronisation des tokens générés, l’absence de couleurs littérales dans la feuille de disposition et l’autonomie de la page de démonstration. Les couples fonctionnels de texte atteignent au minimum 4,5:1 :

| Couple | Contraste |
| --- | --- |
| Texte principal / fond papier | 10,88:1 |
| Texte secondaire / blanc | 5,27:1 |
| Texte secondaire / papier chaud | 4,91:1 |
| Blanc / vert | 8,51:1 |
| Texte doux / vert | 6,05:1 |
| Blanc / bouton principal | 4,77:1 |
| Blanc / bouton au survol | 6,49:1 |
| Réussite / fond réussite | 5,25:1 |
| Correction / fond correction | 5,33:1 |
| Bordure interactive / blanc | 3,15:1 |

Les mesures de ces couples ne constituent pas un audit complet de conformité de toutes les pages.

Les vérifications navigateur couvrent une série entière avec bonus et erreur, la persistance après rechargement, la fin automatique du chronomètre à 90 secondes, l’abandon et la reprise d’une série, les fiches CM2 et les interactions de l’atelier. Les petites largeurs de 320 et 390 px ont été contrôlées pour les débordements et le retour à la ligne.

## Faire évoluer le système

1. Modifier `design-tokens.json` pour une valeur globale, ou `design-system.css` pour un comportement partagé.
2. Lancer `npm run design:build` pour régénérer les variables et l’atelier.
3. Lancer `npm run design:check` et `npm test`.
4. Ouvrir le site et l’atelier à une largeur mobile et une largeur de bureau.

`scripts/normalize-design.mjs` conserve la migration initiale des styles ; il n’est pas nécessaire pour construire ou utiliser le site.
