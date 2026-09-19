import { allowedVerbs, levelTenses, tenses } from './core.js';

export const verbCategories = [
  {label:'Premier groupe : les verbes en -er', includes:v=>v.group===1},
  {label:'Deuxième groupe : -ir et -issons', includes:v=>v.group===2},
  {label:'Être et avoir, deux verbes qui servent aussi d’auxiliaires', includes:v=>['être','avoir'].includes(v.infinitive)},
  {label:'Autres verbes du troisième groupe', includes:v=>v.group===3&&!['être','avoir'].includes(v.infinitive)}
];
export const levelGuides = {
  CE2:{
    method:'Commence par repérer le sujet : qui fait l’action ? Remplace un prénom par il ou elle, puis plusieurs prénoms par ils ou elles. Choisis ensuite le temps. Le sujet et le temps te donnent deux indices pour écrire la bonne terminaison. Lis la correction avant de passer à la question suivante.',
    goal:'Distinguer maintenant, autrefois et demain',
    practice:'Travaille d’abord un seul temps. Quand tu te sens à l’aise, compare le présent et le futur du même verbe : nous chantons, nous chanterons. Le futur contient un r qui ne s’entend pas toujours bien. Pour être et avoir, apprends les formes avec leur sujet : nous sommes, vous avez.',
    mistakes:[
      {verb:'chanter',tense:'present',index:1,wrong:'tu chante',correct:'tu chantes',why:'Avec tu, la terminaison de chanter au présent est -es.'},
      {verb:'jouer',tense:'imparfait',index:5,wrong:'ils jouait',correct:'ils jouaient',why:'Avec ils, le verbe à l’imparfait se termine par -aient.'},
      {verb:'avoir',tense:'futur',index:0,wrong:'j’aurais',correct:'j’aurai',why:'Pour dire ce qui arrivera demain au futur simple, écris j’aurai, sans s.'}
    ]
  },
  CM1:{
    method:'Tu retrouves les trois temps simples de la sélection CE2 et tu ajoutes le passé composé. Observe les verbes qui changent de forme : nous prenons mais ils prennent ; nous faisons mais vous faites. Lis ces formes à voix haute, puis cache-les pour essayer de les écrire.',
    goal:'Passer d’un temps simple à un temps composé',
    practice:'Au passé composé, cherche les deux morceaux du verbe. Dans nous avons fini, avons est l’auxiliaire avoir au présent et fini est le participe passé. Change le sujet : j’ai fini, vous avez fini. Dans ces exemples, l’auxiliaire change ; le participe passé reste identique. Verbox ne travaille pas encore toutes les règles d’accord.',
    mistakes:[
      {verb:'finir',tense:'present',index:3,wrong:'nous finons',correct:'nous finissons',why:'Finir appartient au deuxième groupe : nous finissons contient -iss-.'},
      {verb:'prendre',tense:'present',index:5,wrong:'ils prenent',correct:'ils prennent',why:'La forme prennent s’écrit avec deux n.'},
      {verb:'chanter',tense:'compose',index:0,wrong:'j’ai chanter',correct:'j’ai chanté',why:'Après l’auxiliaire avoir, utilise ici le participe passé chanté.'}
    ]
  },
  CM2:{
    method:'Tu peux travailler six temps et comparer leur rôle dans une histoire. L’imparfait décrit le décor ou une habitude ; le passé simple présente une action délimitée. Le plus-que-parfait permet de revenir à ce qui s’était passé auparavant. Cherche d’abord l’ordre des événements, puis observe la forme du verbe.',
    goal:'Comprendre les temps du récit',
    practice:'Lis : il jouait quand son ami arriva. Jouait installe la situation ; arriva fait avancer le récit. Dans il avait fini avant la sonnerie, avait fini indique une action déjà accomplie au moment de la sonnerie. Tu peux réviser un temps isolé avant d’activer le mélange des temps dans les exercices.',
    mistakes:[
      {verb:'chanter',tense:'simple',index:3,wrong:'nous chantames',correct:'nous chantâmes',why:'Au passé simple, la forme avec nous prend un accent circonflexe.'},
      {verb:'voir',tense:'imparfait',index:3,wrong:'nous voyons',correct:'nous voyions',why:'Au temps demandé, l’imparfait, garde le y du radical et le i de -ions.'},
      {verb:'prendre',tense:'parfait',index:4,wrong:'vous aviez prit',correct:'vous aviez pris',why:'Le participe passé de prendre est pris. Prit est une forme du passé simple.'}
    ]
  }
};
export const tenseExamples = {
  present:{verb:'jouer',index:0,form:'joue',sentence:'Je joue dans le jardin.'},
  imparfait:{verb:'jouer',index:0,form:'jouais',sentence:'Chaque mercredi, je jouais dans le jardin.'},
  futur:{verb:'jouer',index:0,form:'jouerai',sentence:'Demain, je jouerai dans le jardin.'},
  compose:{verb:'jouer',index:0,form:'ai joué',sentence:'Hier, j’ai joué dans le jardin.'},
  simple:{verb:'jouer',index:2,form:'joua',sentence:'Ce jour-là, il joua dans le jardin.'},
  parfait:{verb:'jouer',index:0,form:'avais joué',sentence:'J’avais joué dans le jardin avant de rentrer.'}
};

export function renderLevelGuide(level, {description, lessonPath, verbLink = v=>v.infinitive}) {
  const guide=levelGuides[level];
  const selection=allowedVerbs(level);
  return `<section class="seo-guide content-panel"><h2>Que réviser en conjugaison en ${level} ?</h2>
    <p>${description}</p><h3>${guide.goal}</h3><p>${guide.method}</p><p>${guide.practice}</p>
    <h3>Les ${selection.length} verbes de la sélection ${level}</h3>
    <p>Voici les verbes que tu peux rencontrer dans les exercices de ce niveau. Les groupes aident à reconnaître des façons de conjuguer ; être et avoir sont présentés à part.</p>
    <div class="verb-selection">${verbCategories.map(category=>{
      const selected=selection.filter(category.includes);
      return selected.length?`<p><strong>${category.label}</strong></p><ul class="verb-list">${selected.map(v=>`<li data-verb="${v.infinitive}">${verbLink(v)}</li>`).join('')}</ul>`:'';
    }).join('')}</div>
    <h3>Les temps à travailler</h3><ul class="lesson-links">${levelTenses[level].map(tense=>`<li><a href="${lessonPath(tense)}">${tenses[tense].name}</a><p>${tenses[tense].tip}</p><p class="memo-example">${tenseExamples[tense].sentence}</p></li>`).join('')}</ul>
    <h3>Trois erreurs à comprendre</h3><ul class="help-list">${guide.mistakes.map(m=>`<li><span>À éviter au temps demandé : <s>${m.wrong}</s>.</span> <strong>On écrit : ${m.correct}.</strong> ${m.why}</li>`).join('')}</ul>
    <h3>Une petite séance pour essayer</h3><p>Choisis un temps en haut de la page, puis lance une série. Tu peux prendre tout le temps nécessaire en mode entraînement. Lis chaque correction : une erreur t’indique ce que tu peux retravailler.</p>
    <p>Ces activités complètent les leçons de classe. Elles ne couvrent pas tout le programme scolaire. Les exercices de temps composés utilisent avoir, sans travailler les règles complètes d’accord du participe passé.</p>
  </section>`;
}
