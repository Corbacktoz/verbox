# Politique de Sécurité (Security Policy)

La sécurité et la protection des données de nos jeunes utilisateurs et de leurs familles sont au cœur des priorités de Verbox.

## Versions supportées

Seule la dernière version publiée sur la branche principale (`main`) et déployée sur [verbox.fr](https://verbox.fr) bénéficie de correctifs de sécurité actifs :

| Version | Supportée |
| :--- | :---: |
| `main` / `verbox.fr` | :white_check_mark: |
| Versions antérieures | :x: |

## Signaler une vulnérabilité (Responsible Disclosure)

Si vous découvrez une faille de sécurité ou une faiblesse potentielle dans Verbox, nous vous remercions de **ne pas créer d'issue publique** afin de protéger les utilisateurs.

Veuillez utiliser l'un des canaux confidentiels suivants :

1. **Signalement privé GitHub** : Via l'onglet **Security** → **Advisories** → **Report a vulnerability** de ce dépôt (si activé dans le dépôt : *Settings → Code security and analysis → Private vulnerability reporting*).
2. **Email direct (toujours actif)** : Écrivez à `corback.inc@gmail.com` avec pour objet :
   `[Sécurité Verbox] Signalement de vulnérabilité`

### Informations utiles à inclure dans votre rapport :
* Nature de la vulnérabilité (ex. contournement CSP, faille XSS, injection SSR, problème de stockage local).
* Étapes précises pour reproduire le comportement (PoC, capture ou charge utile).
* Impact potentiel estimé sur les utilisateurs ou le service.

## Délais de traitement indicatifs

En tant que projet indépendant maintenu individuellement, nous nous efforçons, dans la mesure du possible :
* D'**accuser réception** sous 48 à 72 heures ouvrées.
* De fournir une **évaluation et confirmation** sous 5 à 7 jours ouvrés.
* De publier et déployer le **correctif** au plus vite sur [verbox.fr](https://verbox.fr) une fois la solution validée.

## Périmètre (Scope)

### Dans le périmètre :
* Contournement de la politique de sécurité de contenu (Content-Security-Policy définie par balise `<meta>`).
* Injections de code (XSS stockée ou réfléchie) dans l'interface, les dialogues ou le pré-rendu statique.
* Corruption du stockage local (`localStorage`) via des entrées non assainies.
* Fuites de données ou contournement de l'opposition au suivi d'audience Matomo.
* Vulnérabilités dans les scripts de build ou de pré-rendu statique (`scripts/build-site.mjs`, etc.).

### Hors périmètre :
* Absence d'en-têtes HTTP personnalisés (tels que `X-Frame-Options`, `Permissions-Policy` ou `Strict-Transport-Security`) sur l'hébergement public GitHub Pages : GitHub Pages ne gérant pas nativement les fichiers `_headers` personnalisés, ces en-têtes sont configurés pour les déploiements sur serveur Node (`server.js`) ou reverse-proxy dédié, tandis que la sécurité sur GitHub Pages repose sur la balise `<meta http-equiv="Content-Security-Policy">`.
* Attaques par déni de service (DoS/DDoS) ciblant l'infrastructure de GitHub Pages ou de Matomo Cloud.
* Manipulation manuelle de l'état local dans les outils de développement (DevTools) par l'utilisateur sur sa propre machine.
* Signalements sur des versions obsolètes ou des copies non officielles du projet.
