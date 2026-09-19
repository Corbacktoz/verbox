import test from 'node:test';
import assert from 'node:assert/strict';
import {verbs,allowedVerbs,levelTenses,phrase} from './core.js';
import {levelGuides,tenseExamples,verbCategories} from './level-content.js';
import {homeGuide} from './site-content.js';

test('Les guides présentent exactement les verbes et temps autorisés de chaque niveau',()=>{
 for(const level of Object.keys(levelTenses)){
  const html=homeGuide(level);
  assert.deepEqual([...html.matchAll(/data-verb="([^"]+)"/g)].map(m=>m[1]).sort(),allowedVerbs(level).map(v=>v.infinitive).sort());
  assert.equal(verbCategories.flatMap(c=>allowedVerbs(level).filter(c.includes)).length,allowedVerbs(level).length);
  for(const m of levelGuides[level].mistakes){
   const verb=verbs.find(v=>v.infinitive===m.verb);
   assert.ok(levelTenses[level].includes(m.tense));
   const person=['je','tu','il','nous','vous','ils'][m.index];
   assert.equal(phrase(person,verb[m.tense][m.index]),m.correct);
   assert.notEqual(m.wrong,m.correct);
  }
 }
 for(const [tense,example] of Object.entries(tenseExamples)){
  assert.equal(verbs.find(v=>v.infinitive===example.verb)[tense][example.index],example.form);
  assert.ok(example.sentence.toLowerCase().includes(example.form));
 }
 assert.equal(verbs.find(v=>v.infinitive==='finir').group,2);
 assert.equal(verbs.find(v=>v.infinitive==='pouvoir').group,3);
 assert.equal(verbs.find(v=>v.infinitive==='chanter').group,1);
});
