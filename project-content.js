const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function renderProject(page, config = {}) {
  const privacy = config.privacy || {};
  const contact = privacy.contactEmail;
  const contactLink = contact ? `<a href="mailto:${escape(contact)}">${escape(contact)}</a>` : 'Contact non renseigné';
  const legal = page === 'mentions';
  const title = legal ? 'Mentions légales' : 'À propos de Verbox';
  return `<nav class="content-breadcrumb" aria-label="Fil d’Ariane"><a href="/">Accueil</a> / <span>${title}</span></nav>
    <div class="greeting"><div><h1>${title}</h1><p>${legal ? 'Les informations sur l’éditeur et l’hébergement du site.' : 'Un espace pour pratiquer la conjugaison, à ton rythme.'}</p></div></div>
    <article class="content-panel privacy-content">${legal ? `
      <h2>Éditeur et contact</h2>
      <p>Verbox est édité par ${escape(privacy.editorName || 'Éditeur non renseigné')}. Pour contacter l’éditeur : ${contactLink}.</p>
      <h2>Hébergement</h2>
      <p>Le site est hébergé par GitHub, Inc., avec le service GitHub Pages.</p>
      ${privacy.hostAddress ? `<p>Adresse : ${escape(privacy.hostAddress)}.</p>` : '<p>L’adresse de l’hébergeur reste à renseigner par l’éditeur.</p>'}
      <p>L’adresse de GitHub figure dans sa <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" rel="noreferrer">déclaration officielle de confidentialité, rubrique « Contact Us »</a>.</p>
      <h2>Données et statistiques</h2>
      <p>La <a href="/confidentialite/">page de confidentialité et de statistiques</a> explique le stockage local des progrès et permet de s’opposer à la mesure d’audience.</p>
      <h2>Propriété intellectuelle et licence</h2>
      <p>L’ensemble du code source, des fiches et des contenus de Verbox est protégé par le droit d’auteur (Copyright © 2026 ${escape(privacy.editorName || 'Jean-Charles Belin')}. Tous droits réservés).</p>
      <p>La consultation du code et l’usage pédagogique des fiches en classe ou en famille sont autorisés à titre gracieux. Toute réutilisation, reproduction ou exploitation commerciale du code sans accord préalable écrit de l’éditeur est strictement interdite.</p>
      <h2>Signaler un problème ou une vulnérabilité</h2>
      <p>Pour signaler une erreur dans une fiche, un problème technique ou une vulnérabilité de sécurité, écrivez à ${contactLink} en précisant l’objet de votre message.</p>` : `
      <h2>Pourquoi Verbox ?</h2>
      <p>Verbox propose de courtes séances de conjugaison pour les élèves de CE2, CM1 et CM2. Tu peux choisir une réponse, écrire un verbe, compléter une phrase ou corriger une erreur. Après chaque réponse, une correction t’aide à comprendre.</p>
      <h2>Pour les enfants, les parents et les enseignants</h2>
      <p>Choisis ton niveau et le temps que tu veux travailler. Le mode entraînement te laisse réfléchir sans limite de temps. Les fiches permettent de retrouver une règle et des exemples, même sans activer JavaScript.</p>
      <p>Les parents et les enseignants peuvent utiliser ces activités en complément d’une leçon. Les niveaux correspondent à des sélections d’entraînement ; ils ne constituent pas une couverture exhaustive des programmes scolaires.</p>
      <h2>Ce que tu peux travailler</h2>
      <p>La sélection comprend des verbes courants au présent, à l’imparfait et au futur. Le passé composé s’ajoute en CM1 ; le passé simple et le plus-que-parfait en CM2. Les temps composés proposés utilisent avoir. Les constructions avec être et les règles complètes d’accord du participe passé ne sont pas travaillées ici.</p>
      <h2>Sans compte ni publicité</h2>
      <p>Tu peux jouer sans donner ton nom ni ton âge. Tes progrès sont enregistrés dans le navigateur de cet appareil et ne sont pas synchronisés avec un autre appareil. La <a href="/confidentialite/">page de confidentialité</a> explique séparément le fonctionnement des statistiques du site.</p>
      <h2>Nous aider à corriger une erreur</h2>
      <p>Une conjugaison ou une explication te semble incorrecte ? Demande à un adulte de nous écrire à ${contactLink}, avec l’adresse de la page et le passage concerné. Il n’est pas nécessaire d’envoyer le nom d’un enfant ou ses résultats.</p>
      <p><a href="/mentions-legales/">Informations sur l’éditeur et l’hébergement</a> · <a href="/aide/">Comprendre le fonctionnement des exercices</a></p>`}
    </article>`;
}
