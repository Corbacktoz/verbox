import { audienceConfig } from './audience-config.js';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function renderPrivacy(config = {}) {
  const audience = audienceConfig(config);
  const contact = config.privacy?.contactEmail || 'corback.inc@gmail.com';
  const editor = config.privacy?.editorName;
  return `<div class="greeting"><div><h1>Confidentialité et statistiques</h1><p>Apprendre sans compte, avec des explications claires sur les données.</p></div></div>
  <article class="content-panel privacy-content">
    <h2>Pour les enfants et les parents</h2>
    <p>Tu peux faire les exercices sans donner ton nom, ton âge ou ton adresse e-mail. Tes points et tes progrès restent dans le navigateur de cet appareil. Google Analytics et Google Tag Manager ne sont pas utilisés.</p>
    <h2>Contact</h2>
    ${editor ? `<p>Éditeur et responsable du traitement : ${escape(editor)}.</p>` : ''}
    <p>Pour toute question sur vos données ou pour exercer vos droits : <a href="mailto:${escape(contact)}">${escape(contact)}</a>.</p>
    <h2>Les progrès enregistrés sur votre appareil</h2>
    <p>Le niveau choisi, les points, les séances et les informations de révision sont enregistrés localement pour fournir les fonctions de progression. Ils ne sont pas envoyés à un serveur par l’application, ni synchronisés entre appareils. La base retenue est l’intérêt légitime à fournir et maintenir ces fonctionnalités ; ces informations ne servent pas à la publicité.</p>
    <p>Ces données restent jusqu’à leur suppression dans les réglages du navigateur. Pour les effacer, supprimez les données du site verbox.fr. Cela remet à zéro les progrès sur cet appareil.</p>
    <h2>La mesure d’audience</h2>
    ${audience ? `<p>Verbox utilise Matomo pour produire des statistiques de fréquentation des pages, exclusivement pour améliorer le site. La base légale retenue est l’intérêt légitime à comprendre son utilisation. La configuration vise l’exemption de consentement de la CNIL pour la mesure d’audience, sans cookie de suivi ni utilisation publicitaire.</p>
    <p>Seules les pages publiques sont comptées. Les résultats des exercices, réponses saisies, points et historiques personnels ne sont pas transmis. Les paramètres d’adresse, ancres et adresses des pages de provenance sont exclus. Aucun identifiant de compte n’est utilisé et aucun suivi entre sites n’est activé. Le serveur reçoit nécessairement l’adresse IP lors de la connexion ; elle est tronquée avant stockage dans Matomo. La durée maximale de conservation configurée dans Matomo est de 759 jours, soit environ 25 mois. Les profils individuels et les enregistrements de session sont désactivés.</p>
    <p>Le service de mesure est accessible à l’adresse <a href="${escape(audience.url)}" rel="noreferrer">${escape(new URL(audience.url).hostname)}</a>. L’accès aux statistiques est réservé à l’éditeur et aux prestataires techniques autorisés.</p>`
    : '<p>Aucune mesure d’audience n’est active actuellement. Google Analytics a été retiré. Aucune donnée n’est envoyée à Matomo.</p>'}
    <p>Vous pouvez vous opposer à une mesure d’audience depuis cette page. Le choix est conservé dans ce navigateur jusqu’à sa suppression. Il faut le renouveler sur chaque appareil ou après effacement des données du navigateur. Les signaux « Ne pas me pister » et Global Privacy Control sont également respectés.</p>
    <p id="audience-status" role="status">Activez JavaScript pour gérer votre opposition. Sans JavaScript, aucune mesure d’audience n’est chargée.</p>
    <div class="public-links"><button type="button" class="secondary-button" id="audience-optout" hidden>M’opposer à la mesure d’audience</button><button type="button" class="secondary-button" id="audience-resume" hidden>Retirer mon opposition</button></div>
    <h2>Hébergement et accès au site</h2>
    <p>Verbox est hébergé par GitHub Pages. Lors de l’accès au site, l’hébergeur traite des données techniques de connexion, notamment l’adresse IP, pour fournir et sécuriser le service. Ces traitements sont distincts des statistiques d’audience. Les ressources visuelles et les polices ne sont pas chargées depuis Google.</p>
    <p>Consultez les informations de GitHub sur les destinataires, les durées, les transferts internationaux et leurs garanties dans sa <a href="https://docs.github.com/fr/site-policy/privacy-policies/github-general-privacy-statement" rel="noreferrer">déclaration de confidentialité</a>.</p>
    <h2>Vos droits</h2>
    <p>Selon le traitement concerné, vous disposez de droits d’accès, de rectification, d’effacement, de limitation et d’opposition. Vous pouvez nous contacter à l’adresse ci-dessus ; les données de progression restant sur votre appareil, nous ne pouvons pas les consulter ou les supprimer à distance. Nous répondons en principe sous un mois. Vous pouvez aussi adresser une réclamation à la <a href="https://www.cnil.fr/fr/plaintes" rel="noreferrer">CNIL</a>.</p>
  </article>`;
}
