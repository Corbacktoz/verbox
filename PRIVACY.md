# État de la mesure d’audience

Google Analytics G-NBXV7XE79Y et le conteneur GTM-K3SQSM4P ont été retirés du modèle partagé, y compris l’iframe sans JavaScript. Les anciens cookies Analytics accessibles au site sont supprimés sans toucher aux progrès. Les imports Google Fonts ont été retirés ; les polices de remplacement locales sont utilisées.

**La configuration de la branche principale active Matomo sur les pages publiques éligibles.** L’instance `https://verbox.matomo.cloud/`, l’identifiant de site `1` et le script `https://cdn.matomo.cloud/verbox.matomo.cloud/matomo.js` sont renseignés dans `site.config.json`. Le mode CNIL de cette instance a été enregistré et vérifié ; `cnilConfigurationVerified` et `audience.enabled` sont à `true`. L’utilisateur a fourni le nom public de l’éditeur, Jean-Charles Belin, affiché avec `corback.inc@gmail.com`. La page de confidentialité générée décrit la collecte activée ; la réception effective des vues en production reste à vérifier dans Matomo.

## Vérification du 19 septembre 2026

Après autorisation de l’éditeur et sa réauthentification dans Matomo, le mode CNIL est activé uniquement pour le site 1 « verbox.fr ». Le tableau affiche **21 critères conformes, aucun non conforme et 1 inconnu**. La rétention est passée de 1 860 à 759 jours, l’anonymisation IP porte sur 2 octets, les profils individuels, le journal des visites, les tests A/B, les exports publicitaires et les enregistrements de session sont désactivés ou restreints selon le mode CNIL.

Le critère inconnu concerne l’opposition, que Matomo ne peut pas vérifier dans le code du site. Sur `https://verbox.fr/confidentialite/`, le bouton a été testé : opposition enregistrée, conservée après rechargement puis retirée correctement. Les tests du chargeur couvrent l’absence de chargement en cas d’opposition et son application pendant le chargement du script. La réception effective des vues dans Matomo et l’arrêt réseau restent à contrôler sur le site publié. Les indicateurs Matomo ne constituent pas une certification RGPD globale.

## Raccordement sans serveur personnel

1. L’instance [Verbox Matomo Cloud](https://verbox.matomo.cloud/) est créée. Vérifier que le site `1` correspond bien à `https://verbox.fr`. Le script fourni provient du CDN Matomo Cloud ; les données sont envoyées à l’instance dédiée. Le code standard fourni par Matomo n’est pas inséré tel quel : le suivi des liens est omis et les restrictions de confidentialité précèdent toute mesure.
2. Dans Matomo, suivre le [guide actuel d’exemption CNIL](https://matomo.org/faq/how-to/how-do-i-configure-matomo-without-tracking-consent-for-french-visitors-cnil-exemption/) : Privacy > Compliance, sélectionner Verbox, appliquer le mode CNIL et traiter **tous** les résultats « unknown » ou non conformes. Archiver l’auto-évaluation et sa date. Ce n’est pas une certification de la CNIL.
3. Vérifier notamment l’anonymisation des IP avant stockage, la limitation des rapports à des statistiques agrégées, l’absence de profils individuels, de suivi inter-sites, d’usage publicitaire, de User ID, de réutilisation des données et de rapprochement avec d’autres sources. Restreindre les accès administratifs. Ne pas ajouter de Tag Manager, heatmap, session replay ou analyse des réponses aux exercices.
4. Le mode CNIL a réglé la conservation à **759 jours**, comme constaté dans l’interface et indiqué dans le texte du site. La valeur de 90 jours envisagée initialement n’a pas été appliquée et n’est plus annoncée. Vérifier les logs de l’hébergeur Matomo, le contrat de sous-traitance, les lieux de traitement, les sous-traitants et les garanties de transfert le cas échéant. Matomo Cloud annonce un hébergement à Francfort ; vérifier le contrat en vigueur et compléter l’information publique avec le prestataire retenu.
5. `privacy.editorName` contient Jean-Charles Belin, nom fourni par l’utilisateur, et l’adresse publique est `corback.inc@gmail.com`. Compléter séparément les mentions légales applicables au statut de l’éditeur et documenter l’intérêt légitime, notamment pour le public mineur. La politique proposée est une base technique, pas une attestation de conformité RGPD complète.
6. Renseigner `audience.matomoUrl` avec l’URL HTTPS de l’instance, et `audience.siteId` avec l’identifiant numérique du site. Une fois les vérifications réellement effectuées, passer `cnilConfigurationVerified` et `enabled` à `true`. Le build refuse une activation incomplète. Ces champs sont publics, **ne jamais y mettre de mot de passe ni token d’administration**.
7. Exécuter `npm test`, `npm run seo:check`, `npm run build` et `npm run design:check`. Vérifier ensuite sur le domaine publié une vue reçue dans Matomo, les paramètres réseau, l’absence de cookies de mesure et l’opposition depuis `/confidentialite/`. Contrôler l’absence de requêtes avec DNT/GPC et sur `/progres/`, `/confidentialite/` ou une page inconnue. Le refus doit également arrêter les envois dans les autres onglets.

## Périmètre technique

- Pas de bandeau, de demande d’âge ni de consentement Analytics.
- Le compteur ne charge Matomo que sur les routes publiques connues, sur l’origine de production, après vérification de l’opposition. Les aperçus locaux ne sont pas comptés.
- Une seule vue de page ; pas d’événements d’exercice, de suivi des liens, de campagnes, de temps de session ou de propriétés personnalisées.
- Adresses et titres issus des routes statiques : aucun paramètre de requête, fragment ou référent n’est envoyé. La politique `no-referrer` est déclarée dans le HTML (GitHub Pages n’applique pas `_headers`).
- Cookies, détection des fonctionnalités du navigateur, campagnes et performances désactivés avant la première vue. Nécessite un Matomo récent supportant ces méthodes et son mode CNIL.
- Opposition locale via la page de confidentialité, sans appel préalable à Matomo. DNT et Global Privacy Control sont respectés. En cas de stockage inaccessible, la mesure reste désactivée. L’opposition est propre au navigateur ; son effacement rétablit la mesure, sauf signal navigateur.
- Les résultats d’apprentissage restent en local. Le stockage des progrès existant ne dispose pas de durée d’expiration automatique ; réexaminer sa durée au regard de la finalité pédagogique.

## Références et limites

L’exemption de consentement repose sur **la finalité et la configuration effective**, pas simplement sur l’absence de cookies. Elle ne dispense ni d’information, ni des autres obligations RGPD. Elle est documentée ici pour le cadre français ; revoir les exigences si le service cible d’autres pays.

- [CNIL : choisir une mesure d’audience exemptée](https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience)
- [Documentation technique Matomo](https://developer.matomo.org/api-reference/tracking-javascript)
- [Confidentialité de l’hébergeur GitHub](https://docs.github.com/fr/site-policy/privacy-policies/github-general-privacy-statement)

La désactivation du code Google n’efface pas les données déjà collectées dans GA4. Examiner leur suppression et les durées de conservation depuis le compte Google Analytics. Aucun compte Google n’est supprimé par cette modification.
