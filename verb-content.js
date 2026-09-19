import {verbs,persons,tenses,allowedVerbs,levelTenses,phrase} from './core.js';

// Editorial examples are deliberately written independently of the conjugation engine.
// Each tuple contains the person index, the expected form and an original sentence.
export const verbNotes = {
  être:{intro:'Être permet de dire comment on est ou où l’on se trouve.',notes:'Être change beaucoup de forme : je suis, nous sommes, ils sont. À l’imparfait, son radical est ét-. Au futur, retiens ser- : je serai. Même être se conjugue avec avoir dans j’ai été.',mistakes:[['present',4,'vous ètes','vous êtes'],['simple',3,'nous fûtes','nous fûmes']],examples:[
    [0,'suis','Je suis dans la bibliothèque.'],[0,'étais','Quand la pluie est arrivée, j’étais à l’abri.'],[0,'serai','Demain, je serai près de la porte.'],[0,'ai été','J’ai été le premier à trouver la réponse.'],[2,'fut','Ce jour-là, il fut le premier à parler.'],[0,'avais été','J’avais été attentif pendant la leçon, alors j’ai su répondre.']]},
  avoir:{intro:'Avoir sert notamment à parler de ce que l’on possède ou de ce que l’on ressent.',notes:'Au présent, distingue tu as et il a. Au futur, avoir utilise aur- : nous aurons. Son participe passé est eu ; il s’écrit avec deux lettres, même si on entend un seul son.',mistakes:[['present',1,'tu a','tu as'],['compose',0,'j’ai eut','j’ai eu']],examples:[
    [0,'ai','J’ai une nouvelle idée.'],[0,'avais','Autrefois, j’avais un petit vélo.'],[0,'aurai','Demain, j’aurai le temps de lire.'],[0,'ai eu','J’ai eu une surprise ce matin.'],[2,'eut','Il eut soudain une idée.'],[0,'avais eu','J’avais eu une idée avant le début du jeu.']]},
  chanter:{intro:'Chanter est un modèle pour apprendre les terminaisons des verbes du premier groupe.',notes:'Retire -er pour retrouver le radical chant-. Au futur, garde l’infinitif entier : chanter + ai donne chanterai. Au passé composé, le participe passé se termine par -é : chanté.',mistakes:[['present',1,'tu chante','tu chantes'],['compose',0,'j’ai chanter','j’ai chanté']],examples:[
    [0,'chante','Je chante une chanson douce.'],[0,'chantais','Chaque soir, je chantais avec ma sœur.'],[0,'chanterai','Demain, je chanterai devant ma famille.'],[0,'ai chanté','J’ai chanté pendant la fête.'],[2,'chanta','Il chanta pour saluer le printemps.'],[0,'avais chanté','J’avais chanté avant que le spectacle commence.']]},
  jouer:{intro:'Jouer se conjugue comme chanter, en conservant les lettres jou- dans le radical.',notes:'Dans nous jouions à l’imparfait, le i vient après le u : ne l’oublie pas. Au futur, jouerai contient le e de l’infinitif jouer. Le participe passé joué se termine par un é.',mistakes:[['imparfait',3,'nous jouons','nous jouions'],['futur',0,'je jourai','je jouerai']],examples:[
    [0,'joue','Je joue avec mon frère.'],[3,'jouions','Chaque mercredi, nous jouions aux cartes.'],[0,'jouerai','Je jouerai dehors après le goûter.'],[0,'ai joué','J’ai joué au ballon ce matin.'],[2,'joua','Il joua une dernière partie avant de rentrer.'],[0,'avais joué','J’avais joué aux cartes avant le repas.']]},
  finir:{intro:'Finir appartient au deuxième groupe : on le reconnaît notamment à nous finissons.',notes:'Les formes du pluriel au présent contiennent -iss- : finissons, finissez, finissent. Ce groupe garde -iss- à l’imparfait : je finissais. Je finis peut être au présent ou au passé simple : le contexte aide à reconnaître le temps.',mistakes:[['present',3,'nous finons','nous finissons'],['simple',4,'vous finites','vous finîtes']],examples:[
    [0,'finis','Je finis mon dessin maintenant.'],[0,'finissais','Je finissais mon puzzle quand tu es arrivé.'],[0,'finirai','Je finirai ce livre demain.'],[0,'ai fini','J’ai fini mon goûter.'],[2,'finit','Il finit son dessin, puis rangea ses crayons.'],[0,'avais fini','J’avais fini le puzzle avant ton arrivée.']]},
  prendre:{intro:'Prendre est un verbe du troisième groupe dont le radical change selon les personnes.',notes:'Au présent, écris nous prenons avec un n et ils prennent avec deux n. Au futur, le radical est prendr-. Ne confonds pas le participe passé pris et la forme il prit du passé simple.',mistakes:[['present',5,'ils prenent','ils prennent'],['compose',0,'j’ai prit','j’ai pris']],examples:[
    [0,'prends','Je prends un crayon bleu.'],[0,'prenais','Chaque matin, je prenais le même chemin.'],[0,'prendrai','Demain, je prendrai mon parapluie.'],[0,'ai pris','J’ai pris un livre dans mon sac.'],[2,'prit','Il prit la carte et chercha le chemin.'],[0,'avais pris','J’avais pris mon manteau avant de sortir.']]},
  faire:{intro:'Faire sert à parler de nombreuses actions : faire un dessin, un gâteau ou un jeu.',notes:'Au présent, les formes vous faites et ils font sont à mémoriser. À l’imparfait, on écrit fais- dans je faisais. Au futur, le radical devient fer- : je ferai. Son participe passé est fait.',mistakes:[['present',4,'vous faisez','vous faites'],['futur',0,'je fairai','je ferai']],examples:[
    [0,'fais','Je fais un dessin pour ma sœur.'],[0,'faisais','Le dimanche, je faisais un gâteau avec mon père.'],[0,'ferai','Je ferai un château de sable demain.'],[0,'ai fait','J’ai fait un dessin ce matin.'],[2,'fit','Il fit un signe à son ami.'],[0,'avais fait','J’avais fait un plan avant de construire la cabane.']]},
  dire:{intro:'Dire permet de rapporter des paroles ou d’exprimer une idée.',notes:'Au présent, retiens vous dites, sans la terminaison -isez. Je dis, tu dis et il dit ont la même forme au présent et au passé simple ; le récit permet de choisir le temps. Le participe passé dit se termine par t.',mistakes:[['present',4,'vous disez','vous dites'],['compose',0,'j’ai dis','j’ai dit']],examples:[
    [0,'dis','Je dis bonjour à mes voisins.'],[0,'disais','Chaque soir, je disais bonne nuit à ma famille.'],[0,'dirai','Je dirai la réponse quand ce sera mon tour.'],[0,'ai dit','J’ai dit merci pour ce cadeau.'],[2,'dit','Il dit quelques mots, puis ouvrit le livre.'],[0,'avais dit','J’avais dit bonjour avant de m’asseoir.']]},
  voir:{intro:'Voir permet de raconter ce que l’on observe avec ses yeux.',notes:'Le y apparaît dans nous voyons et vous voyez. À l’imparfait, ajoute le i de la terminaison : nous voyions, vous voyiez. Au futur, voir prend deux r : je verrai. Son participe passé est vu.',mistakes:[['imparfait',3,'nous voyons','nous voyions'],['futur',0,'je verai','je verrai']],examples:[
    [0,'vois','Je vois un oiseau dans l’arbre.'],[3,'voyions','Depuis la fenêtre, nous voyions la mer.'],[0,'verrai','Demain, je verrai mes cousins.'],[0,'ai vu','J’ai vu un écureuil dans le parc.'],[2,'vit','Il vit une lumière au loin.'],[0,'avais vu','J’avais vu les nuages avant le début de l’averse.']]},
  pouvoir:{intro:'Pouvoir indique que quelque chose est possible ou autorisé.',notes:'Au présent, je peux et tu peux se terminent par x, mais il peut par t. On peut aussi écrire je puis, dans un registre plus soutenu. Le tableau présente la forme courante je peux. Au futur, retiens les deux r de pourrai. Son participe passé est pu, sans accent circonflexe.',mistakes:[['present',2,'il peux','il peut'],['compose',0,'j’ai pû','j’ai pu']],examples:[
    [0,'peux','Je peux ouvrir cette boîte.'],[0,'pouvais','Avec cette lampe, je pouvais lire le soir.'],[0,'pourrai','Demain, je pourrai jouer après mes devoirs.'],[0,'ai pu','J’ai pu terminer mon dessin.'],[2,'put','Il put enfin ouvrir la porte.'],[0,'avais pu','J’avais pu ranger mes affaires avant le départ.']]}
};

export const verbSlug = infinitive => infinitive.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s/g,'');
export const verbPath = infinitive => `/conjugaison/${verbSlug(infinitive)}/`;
export const publishedVerbs = verbs.filter(v=>Object.hasOwn(verbNotes,v.infinitive)).sort((a,b)=>a.infinitive.localeCompare(b.infinitive,'fr'));
export const firstLevel = verb => Object.keys(levelTenses).find(level=>allowedVerbs(level).includes(verb));
export const trainingLevel = (verb,tense) => Object.keys(levelTenses).find(level=>allowedVerbs(level).includes(verb)&&levelTenses[level].includes(tense));
export const verbLink = verb => Object.hasOwn(verbNotes,verb.infinitive)?`<a href="${verbPath(verb.infinitive)}">${verb.infinitive}</a>`:verb.infinitive;

export function renderVerb(verb,{lessonPath,levelPath}) {
  const info=verbNotes[verb.infinitive];
  const index=publishedVerbs.indexOf(verb);
  const group=['','premier','deuxième','troisième'][verb.group];
  return `<nav class="content-breadcrumb" aria-label="Fil d’Ariane"><a href="/">Accueil</a> / <a href="/conjugaison/">Conjugaison</a> / <span>${verb.infinitive}</span></nav>
    <div class="greeting"><div><h1>Conjuguer le verbe ${verb.infinitive}</h1><p>${info.intro}</p></div></div>
    <section class="content-panel seo-guide"><h2>Le verbe ${verb.infinitive} en quelques mots</h2>
      <p>Ce verbe du ${group} groupe est proposé dans Verbox à partir du <a href="${levelPath(firstLevel(verb))}">${firstLevel(verb)}</a>. Dans les constructions présentées ici, son auxiliaire est avoir et son participe passé est <strong>${verb.participle}</strong>.</p>
      <p>Cette fiche rassemble six temps de l’indicatif. Les exercices de chaque classe proposent seulement les temps de sa sélection. Les accords du participe passé ne sont pas travaillés ici.</p>
      <h2>À retenir pour ${verb.infinitive}</h2><p>${info.notes}</p>
      <h2>Deux erreurs à repérer</h2><ul class="help-list">${info.mistakes.map(([tense,,wrong,correct])=>`<li>${tenses[tense].name} : <span>à éviter au temps demandé, <s>${wrong}</s></span> ; <strong>on écrit ${correct}</strong>.</li>`).join('')}</ul>
    </section>
    <div class="memo-grid">${Object.keys(tenses).map((tense,i)=>`<section class="content-panel"><h2>${tenses[tense].name}</h2>
      <table class="memo-table"><caption>${verb.infinitive} — ${tenses[tense].name.toLowerCase()}</caption><thead><tr><th scope="col">Sujet</th><th scope="col">Forme conjuguée</th></tr></thead><tbody>${persons.map((person,j)=>`<tr><th scope="row">${person}</th><td>${phrase(person,verb[tense][j])}</td></tr>`).join('')}</tbody></table>
      <p class="memo-example">${info.examples[i][2]}</p>
      <p><a href="${lessonPath(tense)}">Comprendre ${tenses[tense].name.toLowerCase()}</a></p>
      <a class="secondary-button spaced-action" href="${levelPath(trainingLevel(verb,tense))}?temps=${tense}">Exercices ${trainingLevel(verb,tense)} : ${tenses[tense].name.toLowerCase()}</a>
    </section>`).join('')}</div>
    <section class="content-panel seo-guide"><h2>Continuer ta découverte</h2><p>Les exercices mélangent plusieurs verbes du niveau choisi. Tu peux consulter cette fiche avant une séance pour revoir ${verb.infinitive}.</p>
      <nav class="public-links" aria-label="Autres verbes">${index>0?`<a href="${verbPath(publishedVerbs[index-1].infinitive)}">Verbe précédent : ${publishedVerbs[index-1].infinitive}</a>`:''}<a href="/conjugaison/">Toutes les fiches de verbes</a>${index<publishedVerbs.length-1?`<a href="${verbPath(publishedVerbs[index+1].infinitive)}">Verbe suivant : ${publishedVerbs[index+1].infinitive}</a>`:''}</nav>
    </section>`;
}

export function renderVerbHub({levelPath,categories}) {
  return `<nav class="content-breadcrumb" aria-label="Fil d’Ariane"><a href="/">Accueil</a> / <span>Conjugaison</span></nav><div class="greeting"><div><h1>Les verbes à conjuguer avec Verbox</h1><p>Dix fiches pour retrouver les formes, comprendre les difficultés et choisir un entraînement.</p></div></div>
    <section class="content-panel seo-guide"><h2>Choisir un verbe</h2><p>Chaque fiche présente six temps de l’indicatif, des exemples et deux erreurs à repérer. Seuls les temps proposés dans ton niveau sont disponibles dans ses exercices. Les autres verbes de la banque restent accessibles dans les activités.</p>
      ${categories.map(c=>{const items=publishedVerbs.filter(c.includes);return items.length?`<h3>${c.label}</h3><ul class="verb-list">${items.map(v=>`<li>${verbLink(v)} — dès le ${firstLevel(v)}</li>`).join('')}</ul>`:'';}).join('')}
      <h2>Retrouver les verbes de ton niveau</h2>${Object.keys(levelTenses).map(level=>`<h3><a href="${levelPath(level)}">Sélection ${level}</a></h3><p>${publishedVerbs.filter(v=>allowedVerbs(level).includes(v)).map(verbLink).join(' · ')}</p>`).join('')}
      <p>Les temps composés présentés utilisent avoir. Consulte les <a href="/fiches/">fiches de temps</a> pour comprendre quand et comment les employer.</p>
    </section>`;
}
