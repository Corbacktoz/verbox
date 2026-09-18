import test from 'node:test';
import assert from 'node:assert/strict';
import { verbs, tenses, levelTenses, makeQuestions, scoreAnswer, phrase, localDate } from './core.js';

test('Toutes les conjugaisons contiennent six personnes pour chaque temps', () => {
 for(const verb of verbs) for(const tense of Object.keys(tenses)) {
  assert.equal(verb[tense].length,6);
  assert.ok(verb[tense].every(form=>typeof form==='string' && form.length>0));
 }
 assert.equal(verbs.find(v=>v.infinitive==='faire').present[4],'faites');
 assert.equal(verbs.find(v=>v.infinitive==='être').futur[0],'serai');
 assert.equal(verbs.find(v=>v.infinitive==='prendre').compose[3],'avons pris');
 assert.equal(verbs.find(v=>v.infinitive==='dire').parfait[5],'avaient dit');
});
test('Chaque série propose dix questions distinctes et quatre choix dont une seule bonne réponse',()=>{
 for(const [level,allowed] of Object.entries(levelTenses)) for(const tense of allowed) for(let n=0;n<20;n++) {
  const questions=makeQuestions(level,tense);
  assert.equal(questions.length,10);
  assert.equal(new Set(questions.map(q=>q.verb+q.person)).size,10);
  for(const q of questions) {
   assert.equal(q.choices.length,4);
   assert.equal(new Set(q.choices).size,4);
   assert.equal(q.choices.filter(x=>x===q.answer).length,1);
   if(level==='CE2')assert.ok(verbs.slice(0,7).some(v=>v.infinitive===q.verb));
  }
 }
});
test('Les points récompensent les bonnes réponses et les séries sans pénalité',()=>{
 assert.equal(scoreAnswer(false,0),0);
 assert.equal(scoreAnswer(true,1),10);
 assert.equal(scoreAnswer(true,2),10);
 assert.equal(scoreAnswer(true,3),15);
 assert.equal(scoreAnswer(true,10),15);
});
test('Les corrections respectent les élisions et la date locale',()=>{
 assert.equal(phrase('je','ai joué'),'j’ai joué');
 assert.equal(phrase('je','étais'),'j’étais');
 assert.equal(phrase('je','chante'),'je chante');
 assert.equal(localDate(new Date(2026,8,18,1,30)),'2026-09-18');
});
