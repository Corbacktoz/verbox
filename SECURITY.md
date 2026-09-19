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

1. **Signalement privé GitHub** : Via l'onglet **Security** → **Advisories** → **Report a vulnerability** de ce dépôt.
2. **Email direct** : Écrivez à `corback.inc@gmail.com` avec pour objet :
   `[Sécurité Verbox] Signalement de vulnérabilité`

### Informations utiles à inclure dans votre rapport :
* Nature de la vulnérabilité (ex. contournement CSP, faille XSS, injection SSR, problème de stockage local).
* Étapes précises pour reproduire le comportement (PoC, capture ou charge utile).
* Impact potentiel estimé sur les utilisateurs ou le service.

## Notre engagement de réponse

* **Accusé de réception** : Sous 48 heures ouvrées.
* **Évaluation et confirmation** : Sous 5 jours ouvrés.
* **Publication du correctif** : Dès validation, le correctif est déployé immédiatement sur [verbox.fr](https://verbox.fr) et tracé dans le dépôt avec vos remerciements (si vous le souhaitez).

## Périmètre (Scope)

### Dans le périmètre :
* Contournement des en-têtes de sécurité (Content-Security-Policy, Permissions-Policy, HSTS, X-Frame-Options).
* Injections de code (XSS stockée ou réfléchie) dans l'interface ou les dialogues.
* Corruption du stockage local (`localStorage`) via des entrées non assainies.
* Fuites de données ou contournement de l'opposition au suivi d'audience Matomo.

### Hors périmètre :
* Attaques par déni de service (DoS/DDoS) ciblant l'infrastructure de GitHub Pages ou de Matomo Cloud.
* Manipulation manuelle de l'état local dans les outils de développement (DevTools) par l'utilisateur sur sa propre machine.
* Signalements sur des versions obsolètes ou des copies non officielles du projet.
