import {allowedVerbs,levelTenses,persons,tenses,shuffle,localDate} from './core.js';

export const formats={choice:'Choisir la réponse',write:'Écrire le verbe',sentence:'Compléter la phrase',correct:'Réparer la phrase'};
const complements={chanter:'une chanson',jouer:'dans le jardin',parler:'avec les voisins',dessiner:'un dragon',aimer:'les histoires',être:'ici',avoir:'une idée',finir:'le puzzle',prendre:'un livre',faire:'un dessin',dire:'bonjour',regarder:'les étoiles',écouter:'une histoire',trouver:'un trésor',chercher:'un indice',donner:'un conseil',porter:'un sac',préparer:'le goûter',raconter:'une aventure',demander:'de l’aide',travailler:'sur un projet',marcher:'dans la forêt',danser:'sur la musique',sauter:'sur place',visiter:'un musée',aider:'un ami',penser:'à la suite',compter:'les étoiles',montrer:'le chemin',garder:'un secret',choisir:'un livre',réussir:'le défi',grandir:'chaque année',remplir:'une boîte',réfléchir:'à une énigme',voir:'un oiseau',vouloir:'apprendre',pouvoir:'continuer',savoir:'nager',lire:'une histoire',manger:'une pomme',commencer:'un livre',nettoyer:'la chambre',envoyer:'un message',mettre:'un manteau',aller:'à l’école',venir:'au parc',partir:'en vacances'};
const DAY=86400000;
export const questionId=(verb,tense,index)=>`${verb}:${tense}:${index}`;
export function questionPool(level,tense='mixed') {
 const times=tense==='mixed'?levelTenses[level]:levelTenses[level]?.includes(tense)?[tense]:[];
 if(!times)throw new Error('Niveau inconnu');
 return times.flatMap(time=>allowedVerbs(level).flatMap(verb=>persons.map((person,index)=>({id:questionId(verb.infinitive,time,index),verb:verb.infinitive,tense:time,person,index,answer:verb[time][index],complement:complements[verb.infinitive],forms:verb[time],alternatives:Object.keys(tenses).map(t=>verb[t][index])}))));
}
const validIds=new Set(questionPool('CM2').map(q=>q.id));
export function sanitizeLearning(value) {
 const clean={};
 if(!value||typeof value!=='object')return clean;
 for(const [id,r]of Object.entries(value)){
  if(!validIds.has(id)||!r||!Number.isFinite(r.seen)||r.seen<1||!Number.isFinite(r.last)||!Number.isFinite(r.due))continue;
  clean[id]={seen:Math.min(100000,Math.floor(r.seen)),streak:Math.max(0,Math.min(20,Math.floor(Number(r.streak)||0))),bestStreak:Math.max(0,Math.min(20,Math.floor(Number(r.bestStreak)||Number(r.streak)||0))),last:r.last,due:r.due,wrong:r.wrong===true};
 }
 return clean;
}
export function normalizeAnswer(value) { return String(value).normalize('NFC').toLocaleLowerCase('fr').trim().replace(/[’‘]/g,"'").replace(/\s+/g,' '); }
export function isCorrect(value,answer) { return normalizeAnswer(value)===normalizeAnswer(answer); }
export function recordAnswer(memory,q,correct,now=Date.now()) {
 const previous=memory[q.id];const streak=correct?(previous?.streak||0)+1:0;
 memory[q.id]={seen:(previous?.seen||0)+1,streak,bestStreak:Math.max(previous?.bestStreak||0,streak),last:now,due:now+(correct?[1,3,7,14,30][Math.min(streak-1,4)]*DAY:0),wrong:!correct};
 return memory[q.id];
}
export function makeSession({level,tense='mixed',format='mixed',memory={},review=false,count=10,random=Math.random,now=Date.now()}) {
 const pool=shuffle(questionPool(level,tense),random);
 const due=pool.filter(q=>memory[q.id]&&memory[q.id].due<=now).sort((a,b)=>Number(memory[b.id].wrong)-Number(memory[a.id].wrong)||memory[a.id].last-memory[b.id].last);
 const fresh=pool.filter(q=>!memory[q.id]);
 const familiar=pool.filter(q=>memory[q.id]&&memory[q.id].due>now).sort((a,b)=>memory[a.id].last-memory[b.id].last);
 // Reserve three slots for reviews while keeping most of a normal session new.
 const ordered=review?[...due,...fresh,...familiar]:[...due.slice(0,3),...fresh,...due.slice(3),...familiar];
 const rotation=Object.keys(formats);
 return ordered.slice(0,count).map((q,i)=>{
  const candidates=[...new Set([...q.forms,...q.alternatives])].filter(x=>x!==q.answer);
  const type=format==='mixed'?rotation[(i+(memory[q.id]?.seen||0))%rotation.length]:format;
  if(!formats[type])throw new Error('Format inconnu');
  return {...q,format:type,choices:shuffle([q.answer,...shuffle(candidates,random).slice(0,3)],random),wrongForm:shuffle(candidates,random)[0],review:!!memory[q.id]&&memory[q.id].due<=now};
 });
}
export function learningStats(level,memory={},now=Date.now()) {
 const pool=questionPool(level);
 return {total:pool.length,seen:pool.filter(q=>memory[q.id]).length,mastered:pool.filter(q=>(memory[q.id]?.streak||0)>=3).length,due:pool.filter(q=>memory[q.id]?.due<=now).length};
}
export function journey(level,sessions=[],memory={}) {
 const played=sessions.filter(s=>s.level===level&&s.answered>0);
 const full=played.filter(s=>s.answered===10);
 const correct=played.reduce((n,s)=>n+s.correct,0);
 const discovered=learningStats(level,memory).seen;
 const types=new Set(played.flatMap(s=>s.formats||['choice']));
 const days=new Set(played.map(s=>s.day||s.date.slice(0,10))).size;
 const definitions=[
  ['La clairière','Termine 2 séries',full.length,2],
  ['Le pont des mots','Réussis 30 réponses',correct,30],
  ['L’atelier','Essaie les 4 types d’exercices',types.size,4],
  ['La bibliothèque','Découvre 100 conjugaisons',discovered,100],
  ['L’observatoire','Réussis 3 fois de suite 20 conjugaisons',questionPool(level).filter(q=>(memory[q.id]?.bestStreak||0)>=3).length,20],
  ['Le grand voyage','Joue pendant 10 jours différents, à ton rythme',days,10]
 ];
 let unlocked=true;
 return definitions.map(([name,description,value,target],index)=>{
  const available=unlocked,done=available&&value>=target;
  unlocked=done;
  return {name,description,value:Math.min(value,target),target,done,available,index};
 });
}
export function dailyMission(level,sessions=[],date=localDate()) {
 const tasks=[{format:'sentence',label:'Complète 5 phrases'},{format:'correct',label:'Répare 5 phrases'},{format:'write',label:'Écris 5 conjugaisons'},{format:'choice',label:'Réponds à 5 questions à choix'}];
 const n=Math.floor(Date.parse(date+'T00:00:00Z')/DAY);
 const task=tasks[n%tasks.length];
 const value=sessions.filter(s=>s.level===level&&(s.day||s.date.slice(0,10))===date).reduce((sum,s)=>sum+(s.formatCounts?.[task.format]||0),0);
 return {...task,value:Math.min(5,value),target:5,done:value>=5};
}
