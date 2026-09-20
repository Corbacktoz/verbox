import test from 'node:test';
import assert from 'node:assert/strict';
import {verbs} from './core.js';
import {questionPool,makeSession,recordAnswer,sanitizeLearning,isCorrect,learningStats,journey,dailyMission,formats} from './learning.js';
const now=1800000000000,day=86400000;
const random=()=>0.37;
test('48 verbes, 558 / 1152 / 1728 conjugaisons et phrases complètes',()=>{
 assert.equal(verbs.length,48);
 for(const [level,count]of [['CE2',558],['CM1',1152],['CM2',1728]]){
  const pool=questionPool(level);assert.equal(pool.length,count);assert.equal(new Set(pool.map(q=>q.id)).size,count);
  assert.ok(pool.every(q=>q.complement&&q.answer));
 }
 const voir=verbs.find(v=>v.infinitive==='voir');assert.equal(voir.imparfait[3],'voyions');
 assert.equal(verbs.find(v=>v.infinitive==='réfléchir').present[3],'réfléchissons');
 assert.equal(verbs.find(v=>v.infinitive==='vouloir').simple[4],'voulûtes');
 assert.equal(verbs.find(v=>v.infinitive==='lire').compose[0],'ai lu');
 assert.equal(verbs.find(v=>v.infinitive==='manger').present[3],'mangeons');
 assert.equal(verbs.find(v=>v.infinitive==='commencer').present[3],'commençons');
 assert.equal(verbs.find(v=>v.infinitive==='nettoyer').present[0],'nettoie');
 assert.equal(verbs.find(v=>v.infinitive==='envoyer').futur[0],'enverrai');
 assert.equal(verbs.find(v=>v.infinitive==='mettre').present[2],'met');
 assert.equal(verbs.find(v=>v.infinitive==='aller').compose[3],'sommes allés');
 assert.equal(verbs.find(v=>v.infinitive==='venir').simple[2],'vint');
 assert.equal(verbs.find(v=>v.infinitive==='partir').compose[0],'suis parti');
});
test('Chaque format conserve une réponse unique et une erreur réellement incorrecte',()=>{
 for(const level of ['CE2','CM1','CM2'])for(const format of ['mixed',...Object.keys(formats)]){
  const questions=makeSession({level,format,random,now});
  assert.equal(questions.length,10);assert.equal(new Set(questions.map(q=>q.id)).size,10);
  for(const q of questions){assert.notEqual(q.wrongForm,q.answer);assert.equal(new Set(q.choices).size,4);assert.ok(q.choices.includes(q.answer));assert.ok(formats[q.format]);}
  if(format==='mixed')assert.equal(new Set(questions.map(q=>q.format)).size,4);
 }
});
test('Une nouvelle séance évite les réponses déjà réussies quand des nouveautés restent',()=>{
 const memory={},first=makeSession({level:'CE2',tense:'present',random,now});
 first.forEach(q=>recordAnswer(memory,q,true,now));
 const next=makeSession({level:'CE2',tense:'present',memory,random,now:now+1000});
 assert.ok(next.every(q=>!first.some(old=>old.id===q.id)));
});
test('Révisions : erreurs prioritaires, trois places en séance normale, sans doublons',()=>{
 const memory={},questions=makeSession({level:'CM1',random,now});
 questions.forEach(q=>recordAnswer(memory,q,false,now));
 const session=makeSession({level:'CM1',memory,random,now:now+1});
 assert.equal(session.filter(q=>q.review).length,3);
 const review=makeSession({level:'CM1',memory,review:true,random,now:now+1});
 assert.ok(review.every(q=>q.review));assert.equal(new Set(review.map(q=>q.id)).size,10);
});
test('Révisions espacées : 1, 3, 7 jours ; erreur à revoir ; pas de perte des étapes acquises',()=>{
 const memory={},q=questionPool('CE2')[0];
 for(const [i,days]of [1,3,7].entries()){recordAnswer(memory,q,true,now+i*day);assert.equal(memory[q.id].due,now+i*day+days*day);}
 assert.equal(learningStats('CE2',memory,now).mastered,1);
 recordAnswer(memory,q,false,now+20*day);assert.equal(memory[q.id].due,now+20*day);assert.equal(memory[q.id].bestStreak,3);
 assert.deepEqual(sanitizeLearning(memory),memory);
});
test('Saisie : casse et espaces tolérés, accents et conjugaisons exigés',()=>{
 assert.ok(isCorrect('  AVONS   chanté  ','avons chanté'));
 assert.ok(isCorrect('chante\u0301','chanté'));
 assert.ok(!isCorrect('chante','chanté'));assert.ok(!isCorrect('je chante','chante'));
 assert.ok(!isCorrect('<img src=x onerror=alert(1)>','chante'));
});
test('Variantes grammaticales : accord du participe passé avec être, politesse et puis',()=>{
 const poolCM2=questionPool('CM2');
 const poolCM1=questionPool('CM1');

 // 1. partir, passé composé, il / elle -> est parti ou est partie
 const qPartir=poolCM1.find(q=>q.verb==='partir'&&q.tense==='compose'&&q.index===2);
 assert.ok(isCorrect('est parti',qPartir.answer,qPartir));
 assert.ok(isCorrect('est partie',qPartir.answer,qPartir));
 assert.ok(isCorrect('  EST PARTIE  ',qPartir.answer,qPartir));
 assert.ok(!isCorrect('est partis',qPartir.answer,qPartir));

 // 2. aller, passé composé, je -> suis allé ou suis allée
 const qAller=poolCM1.find(q=>q.verb==='aller'&&q.tense==='compose'&&q.index===0);
 assert.ok(isCorrect('suis allé',qAller.answer,qAller));
 assert.ok(isCorrect('suis allée',qAller.answer,qAller));
 assert.ok(!isCorrect('suis allés',qAller.answer,qAller));

 // 3. venir, plus-que-parfait, ils / elles -> étaient venus ou étaient venues
 const qVenir=poolCM2.find(q=>q.verb==='venir'&&q.tense==='parfait'&&q.index===5);
 assert.ok(isCorrect('étaient venus',qVenir.answer,qVenir));
 assert.ok(isCorrect('étaient venues',qVenir.answer,qVenir));
 assert.ok(!isCorrect('étaient venu',qVenir.answer,qVenir));

 // 4. pouvoir, présent, je -> peux ou puis
 const qPouvoir=poolCM2.find(q=>q.verb==='pouvoir'&&q.tense==='present'&&q.index===0);
 assert.ok(isCorrect('peux',qPouvoir.answer,qPouvoir));
 assert.ok(isCorrect('puis',qPouvoir.answer,qPouvoir));
 assert.ok(isCorrect('PUIS',qPouvoir.answer,qPouvoir));
 assert.ok(!isCorrect('pui',qPouvoir.answer,qPouvoir));
 const qPouvoirTu=poolCM2.find(q=>q.verb==='pouvoir'&&q.tense==='present'&&q.index===1);
 assert.ok(!isCorrect('puis',qPouvoirTu.answer,qPouvoirTu));

 // 5. vous singulier de politesse et pluriel
 const qAllerVous=poolCM1.find(q=>q.verb==='aller'&&q.tense==='compose'&&q.index===4);
 assert.ok(isCorrect('êtes allés',qAllerVous.answer,qAllerVous));
 assert.ok(isCorrect('êtes allées',qAllerVous.answer,qAllerVous));
 assert.ok(isCorrect('êtes allé',qAllerVous.answer,qAllerVous));
 assert.ok(isCorrect('êtes allée',qAllerVous.answer,qAllerVous));

 // 6. Vérifier que les choix QCM n'incluent aucune variante valide comme mauvais choix
 for(let s=0;s<20;s++){
  const session=makeSession({level:'CM2',random:()=>Math.random()});
  for(const q of session){
   if(q.format==='choice'){
    const validNorms=new Set((q.validAnswers||[q.answer]).map(a=>a.trim().toLowerCase()));
    const nonAnswerChoices=q.choices.filter(c=>c!==q.answer);
    for(const c of nonAnswerChoices){
     assert.ok(!validNorms.has(c.trim().toLowerCase()),`Distracteur invalide trouvé: ${c} pour la question ${q.id}`);
    }
   }
  }
 }
});
test('Migration et mémoire corrompue ne créent pas de faux progrès',()=>{
 assert.deepEqual(sanitizeLearning(undefined),{});
 assert.deepEqual(sanitizeLearning({unknown:{seen:10},[questionPool('CE2')[0].id]:{seen:'bad'}}),{});
 assert.equal(journey('CE2',[],{})[0].available,true);
 assert.ok(journey('CE2',[],{}).slice(1).every(c=>!c.available));
});
test('Les missions se débloquent par niveau et les pauses ne remettent pas les jours à zéro',()=>{
 const sessions=Array.from({length:10},(_,i)=>({level:'CE2',answered:10,correct:10,date:`2026-09-${String(i+1).padStart(2,'0')}T12:00:00Z`,formats:Object.keys(formats)}));
 const memory={};questionPool('CE2').slice(0,100).forEach(q=>{for(let i=0;i<3;i++)recordAnswer(memory,q,true,now+i*day);});
 assert.ok(journey('CE2',sessions,memory).every(c=>c.done));
 recordAnswer(memory,questionPool('CE2')[0],false,now+5*day);
 assert.ok(journey('CE2',sessions,memory).every(c=>c.done));
 assert.ok(journey('CM1',sessions,memory).every(c=>!c.done));
});
test('Mission du jour stable, renouvelée le lendemain et fondée sur les réponses données',()=>{
 const mission=dailyMission('CE2',[],'2026-09-19');
 assert.deepEqual(mission,dailyMission('CE2',[],'2026-09-19'));
 assert.notEqual(mission.format,dailyMission('CE2',[],'2026-09-20').format);
 const sessions=[{level:'CE2',day:'2026-09-19',date:'2026-09-18T23:00:00Z',formatCounts:{[mission.format]:5}}];
 assert.ok(dailyMission('CE2',sessions,'2026-09-19').done);
 assert.ok(!dailyMission('CM1',sessions,'2026-09-19').done);
 assert.ok(!dailyMission('CE2',sessions,'2026-09-20').done);
});
