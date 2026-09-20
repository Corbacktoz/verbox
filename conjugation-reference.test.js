import test from 'node:test';
import assert from 'node:assert/strict';
import {verbs,tenses,levelTenses,allowedVerbs,phrase} from './core.js';
import {publishedVerbs,verbNotes,verbSlug,trainingLevel} from './verb-content.js';

// Fixed expectations: never regenerate this fixture from core.js.
// Order: present, imparfait, futur, passe simple, participe passe.
// See CONTENT-REVIEW.md for verification sources and the human review still needed.
const reference={
 être:['suis|es|est|sommes|êtes|sont','étais|étais|était|étions|étiez|étaient','serai|seras|sera|serons|serez|seront','fus|fus|fut|fûmes|fûtes|furent','été'],
 avoir:['ai|as|a|avons|avez|ont','avais|avais|avait|avions|aviez|avaient','aurai|auras|aura|aurons|aurez|auront','eus|eus|eut|eûmes|eûtes|eurent','eu'],
 finir:['finis|finis|finit|finissons|finissez|finissent','finissais|finissais|finissait|finissions|finissiez|finissaient','finirai|finiras|finira|finirons|finirez|finiront','finis|finis|finit|finîmes|finîtes|finirent','fini'],
 prendre:['prends|prends|prend|prenons|prenez|prennent','prenais|prenais|prenait|prenions|preniez|prenaient','prendrai|prendras|prendra|prendrons|prendrez|prendront','pris|pris|prit|prîmes|prîtes|prirent','pris'],
 faire:['fais|fais|fait|faisons|faites|font','faisais|faisais|faisait|faisions|faisiez|faisaient','ferai|feras|fera|ferons|ferez|feront','fis|fis|fit|fîmes|fîtes|firent','fait'],
 dire:['dis|dis|dit|disons|dites|disent','disais|disais|disait|disions|disiez|disaient','dirai|diras|dira|dirons|direz|diront','dis|dis|dit|dîmes|dîtes|dirent','dit'],
 voir:['vois|vois|voit|voyons|voyez|voient','voyais|voyais|voyait|voyions|voyiez|voyaient','verrai|verras|verra|verrons|verrez|verront','vis|vis|vit|vîmes|vîtes|virent','vu'],
 vouloir:['veux|veux|veut|voulons|voulez|veulent','voulais|voulais|voulait|voulions|vouliez|voulaient','voudrai|voudras|voudra|voudrons|voudrez|voudront','voulus|voulus|voulut|voulûmes|voulûtes|voulurent','voulu'],
 pouvoir:['peux|peux|peut|pouvons|pouvez|peuvent','pouvais|pouvais|pouvait|pouvions|pouviez|pouvaient','pourrai|pourras|pourra|pourrons|pourrez|pourront','pus|pus|put|pûmes|pûtes|purent','pu'],
 savoir:['sais|sais|sait|savons|savez|savent','savais|savais|savait|savions|saviez|savaient','saurai|sauras|saura|saurons|saurez|sauront','sus|sus|sut|sûmes|sûtes|surent','su'],
 lire:['lis|lis|lit|lisons|lisez|lisent','lisais|lisais|lisait|lisions|lisiez|lisaient','lirai|liras|lira|lirons|lirez|liront','lus|lus|lut|lûmes|lûtes|lurent','lu']
};

test('Les 48 verbes ont 6 temps et 6 personnes ; les slugs sont uniques',()=>{
 assert.equal(verbs.length,48);
 assert.equal(Object.keys(tenses).length,6);
 assert.equal(new Set(verbs.map(v=>verbSlug(v.infinitive))).size,verbs.length);
 assert.equal(verbSlug('être'),'etre');assert.equal(verbSlug('réfléchir'),'reflechir');
 for(const v of verbs)for(const tense of Object.keys(tenses)){
  assert.equal(v[tense].length,6);
  assert.ok(v[tense].every(form=>typeof form==='string'&&form.trim().length>0));
 }
});

test('Référence figée des onze verbes sensibles, y compris les temps composés',()=>{
 for(const [inf,forms]of Object.entries(reference)){
  const verb=verbs.find(v=>v.infinitive===inf);
  ['present','imparfait','futur','simple'].forEach((tense,i)=>assert.deepEqual(verb[tense],forms[i].split('|'),`${inf} ${tense}`));
  assert.equal(verb.participle,forms[4]);
  assert.deepEqual(verb.compose,['ai','as','a','avons','avez','ont'].map(a=>`${a} ${forms[4]}`));
  assert.deepEqual(verb.parfait,['avais','avais','avait','avions','aviez','avaient'].map(a=>`${a} ${forms[4]}`));
 }
});

test('Dix fiches : exemples indépendants, corrections et entraînements compatibles',()=>{
 assert.equal(publishedVerbs.length,10);
 const sentences=[];
 for(const verb of publishedVerbs){
  const info=verbNotes[verb.infinitive];
  assert.ok(info.notes&&info.intro);assert.equal(info.examples.length,6);assert.equal(info.mistakes.length,2);
  Object.keys(tenses).forEach((tense,i)=>{
   const [person,expected,sentence]=info.examples[i];
   assert.equal(verb[tense][person],expected,`${verb.infinitive} ${tense}`);
   const pronoun=['je','tu','il','nous','vous','ils'][person];
   assert.ok(sentence.toLowerCase().includes(phrase(pronoun,expected)),sentence);
   sentences.push(sentence);
   const level=trainingLevel(verb,tense);
   assert.ok(levelTenses[level].includes(tense)&&allowedVerbs(level).includes(verb));
  });
  for(const [tense,index,wrong,correct]of info.mistakes){
   assert.equal(phrase(['je','tu','il','nous','vous','ils'][index],verb[tense][index]),correct);
   assert.notEqual(wrong,correct);
  }
 }
 assert.equal(new Set(sentences).size,sentences.length);
});
