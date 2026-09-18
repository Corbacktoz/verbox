export const persons = ['je', 'tu', 'il / elle', 'nous', 'vous', 'ils / elles'];
export const tenses = {
  present: { name: 'Le présent', subtitle: 'Ce qui se passe maintenant', color: 'sage', icon: 'sun', example: 'Je joue dans le jardin.', tip: 'Au présent, les verbes en -er prennent : -e, -es, -e, -ons, -ez, -ent.' },
  imparfait: { name: 'L’imparfait', subtitle: 'Les habitudes d’autrefois', color: 'peach', icon: 'rewind', example: 'Je jouais dans le jardin.', tip: 'À l’imparfait, les terminaisons sont : -ais, -ais, -ait, -ions, -iez, -aient.' },
  futur: { name: 'Le futur', subtitle: 'Ce qui se passera demain', color: 'lavender', icon: 'arrow', example: 'Je jouerai dans le jardin.', tip: 'Au futur, les terminaisons sont : -ai, -as, -a, -ons, -ez, -ont. Pour les verbes en -er, on les ajoute à l’infinitif.' },
  compose: { name: 'Le passé composé', subtitle: 'Les actions déjà terminées', color: 'yellow', icon: 'check', example: 'J’ai joué dans le jardin.', tip: 'Le passé composé se construit avec avoir ou être au présent, suivi du participe passé. Ici, on s’entraîne avec avoir.' },
  simple: { name: 'Le passé simple', subtitle: 'Le temps des récits', color: 'blue', icon: 'book', example: 'Il joua dans le jardin.', tip: 'Dans les récits, on rencontre souvent le passé simple à la 3e personne : il joua, ils jouèrent ; il finit, ils finirent.' },
  parfait: { name: 'Le plus-que-parfait', subtitle: 'Avant une autre action passée', color: 'pink', icon: 'history', example: 'J’avais joué avant de dîner.', tip: 'Le plus-que-parfait se construit avec avoir ou être à l’imparfait, suivi du participe passé. Ici, on s’entraîne avec avoir.' }
};
const forms = s => s.split('|');
function regular(infinitive, participle) {
  const base = infinitive.slice(0, -2);
  return { infinitive, participle, present: ['e','es','e','ons','ez','ent'].map(x => base+x), imparfait: ['ais','ais','ait','ions','iez','aient'].map(x => base+x), futur: ['ai','as','a','ons','ez','ont'].map(x => infinitive+x), simple: ['ai','as','a','âmes','âtes','èrent'].map(x => base+x) };
}
export const verbs = [
  regular('chanter', 'chanté'), regular('jouer', 'joué'), regular('parler', 'parlé'), regular('dessiner', 'dessiné'), regular('aimer', 'aimé'),
  { infinitive:'être', participle:'été', present:forms('suis|es|est|sommes|êtes|sont'), imparfait:forms('étais|étais|était|étions|étiez|étaient'), futur:forms('serai|seras|sera|serons|serez|seront'), simple:forms('fus|fus|fut|fûmes|fûtes|furent') },
  { infinitive:'avoir', participle:'eu', present:forms('ai|as|a|avons|avez|ont'), imparfait:forms('avais|avais|avait|avions|aviez|avaient'), futur:forms('aurai|auras|aura|aurons|aurez|auront'), simple:forms('eus|eus|eut|eûmes|eûtes|eurent') },
  { infinitive:'finir', participle:'fini', present:forms('finis|finis|finit|finissons|finissez|finissent'), imparfait:forms('finissais|finissais|finissait|finissions|finissiez|finissaient'), futur:forms('finirai|finiras|finira|finirons|finirez|finiront'), simple:forms('finis|finis|finit|finîmes|finîtes|finirent') },
  { infinitive:'prendre', participle:'pris', present:forms('prends|prends|prend|prenons|prenez|prennent'), imparfait:forms('prenais|prenais|prenait|prenions|preniez|prenaient'), futur:forms('prendrai|prendras|prendra|prendrons|prendrez|prendront'), simple:forms('pris|pris|prit|prîmes|prîtes|prirent') },
  { infinitive:'faire', participle:'fait', present:forms('fais|fais|fait|faisons|faites|font'), imparfait:forms('faisais|faisais|faisait|faisions|faisiez|faisaient'), futur:forms('ferai|feras|fera|ferons|ferez|feront'), simple:forms('fis|fis|fit|fîmes|fîtes|firent') },
  { infinitive:'dire', participle:'dit', present:forms('dis|dis|dit|disons|dites|disent'), imparfait:forms('disais|disais|disait|disions|disiez|disaient'), futur:forms('dirai|diras|dira|dirons|direz|diront'), simple:forms('dis|dis|dit|dîmes|dîtes|dirent') }
];
for (const verb of verbs) {
  verb.compose = forms('ai|as|a|avons|avez|ont').map(a => `${a} ${verb.participle}`);
  verb.parfait = forms('avais|avais|avait|avions|aviez|avaient').map(a => `${a} ${verb.participle}`);
}
export const levelTenses = { CE2:['present','imparfait','futur'], CM1:['present','imparfait','futur','compose'], CM2:Object.keys(tenses) };
export function shuffle(items, random = Math.random) {
  const copy = [...items];
  for (let i=copy.length-1; i>0; i--) { const j=Math.floor(random()*(i+1)); [copy[i],copy[j]]=[copy[j],copy[i]]; }
  return copy;
}
export function makeQuestions(level, tense, count=10) {
  const allowed = level === 'CE2' ? verbs.slice(0,7) : verbs;
  const pool = allowed.flatMap(verb => persons.map((person,index) => ({ verb, person, index })));
  return shuffle(pool).slice(0,count).map(({verb,person,index}) => {
    const answer = verb[tense][index];
    const candidates = [...new Set([...verb[tense], ...Object.keys(tenses).map(t => verb[t][index])])].filter(x => x !== answer);
    return { verb:verb.infinitive, person, answer, choices:shuffle([answer,...shuffle(candidates).slice(0,3)]) };
  });
}
export function scoreAnswer(correct, streak) { return correct ? 10 + (streak >= 3 ? 5 : 0) : 0; }
export function localDate(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
export function phrase(person, answer) { return person === 'je' && /^[aàâeéèêëiîïoôuùûh]/i.test(answer) ? `j’${answer}` : `${person} ${answer}`; }
