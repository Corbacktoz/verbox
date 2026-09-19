import { homeGuide, renderContent, levelPath } from './site-content.js';
import { tenses, verbs, persons, levelTenses, scoreAnswer, localDate, phrase } from './core.js';
import {formats,sanitizeLearning,makeSession,recordAnswer,isCorrect,learningStats,journey,dailyMission} from './learning.js';
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const paths = {
 grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
 chart:'<path d="M4 4v16h17M8 15v-4m5 4V7m5 8v-5"/>',
 book:'<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Zm0 0v15"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 2-2.5 2-2.5 4m0 3h.01"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
 rewind:'<path d="m11 6-7 6 7 6V6Zm9 0-7 6 7 6V6Z"/>',
 arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
 check:'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
 history:'<path d="M3 11a9 9 0 1 1 2 7M3 4v7h7m2-5v6l4 2"/>',
 clock:'<circle cx="12" cy="13" r="8"/><path d="M12 9v5l3 2M9 2h6m-3 0v3m7 1 2 2"/>',
 leaf:'<path d="M5 19C1 9 8 4 21 3c-1 13-6 19-14 15m-3 3L16 9"/>',
 cap:'<path d="m2 9 10-5 10 5-10 5L2 9Zm4 3v5c4 3 8 3 12 0v-5m4-3v8"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 bulb:'<path d="M9 18c0-4-4-4-4-9a7 7 0 0 1 14 0c0 5-4 5-4 9H9Zm0 3h6m-5-3v-7m4 7v-7m-4 0 2 2 2-2"/>',
 trophy:'<path d="M7 3h10v7a5 5 0 0 1-10 0V3Zm0 2H3v3c0 3 2 4 4 4m10-7h4v3c0 3-2 4-4 4m-5 3v5m-4 1h8"/>',
  zap:'<path d="m13 2-9 12h7l-1 8 10-13h-8l1-7Z"/>',
  star:'<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z"/>',
  speaker:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  volumeMute:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>'
};
function icon(name) { return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.star}</svg>`; }
document.querySelectorAll('[data-icon]').forEach(el => el.innerHTML=icon(el.dataset.icon));

let audioCtx = null, soundEnabled = true;
try { const s = localStorage.getItem('verbox-sound'); if (s !== null) soundEnabled = s === 'true'; } catch {}
function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  if (audioCtx?.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function playTone(freq, type, startTime, duration, startVol, endVol) {
  if (!soundEnabled) return;
  const ctx = getAudioContext(); if (!ctx) return;
  const osc = ctx.createOscillator(), gain = ctx.createGain();
  osc.type = type; osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(startVol, startTime);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, endVol), startTime + duration);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(startTime); osc.stop(startTime + duration);
}
function playSound(type) {
  if (!soundEnabled) return;
  const ctx = getAudioContext(); if (!ctx) return;
  const t = ctx.currentTime;
  if (type === 'correct') { playTone(659.25, 'sine', t, 0.12, 0.15, 0.01); playTone(880, 'sine', t + 0.1, 0.25, 0.15, 0.001); }
  else if (type === 'streak') { playTone(659.25, 'sine', t, 0.09, 0.15, 0.01); playTone(880, 'sine', t + 0.08, 0.09, 0.15, 0.01); playTone(1108.73, 'sine', t + 0.16, 0.28, 0.18, 0.001); }
  else if (type === 'wrong') { playTone(261.63, 'triangle', t, 0.15, 0.12, 0.01); playTone(220, 'triangle', t + 0.12, 0.22, 0.1, 0.001); }
  else if (type === 'finish') { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => playTone(f, 'sine', t + i * 0.08, 0.3, 0.15, 0.001)); }
}
function speak(text) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR'; u.rate = 0.9;
    window.speechSynthesis.speak(u);
  } catch {}
}
function withViewTransition(fn) {
  if (typeof document !== 'undefined' && document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return document.startViewTransition(fn);
  }
  return fn();
}
function updateSoundToggle() {
  const btn = document.querySelector('#sound-toggle');
  if (!btn) return;
  btn.setAttribute('aria-pressed', soundEnabled ? 'true' : 'false');
  btn.setAttribute('aria-label', soundEnabled ? 'Couper les sons' : 'Activer les sons');
  btn.setAttribute('title', soundEnabled ? 'Couper les sons' : 'Activer les sons');
  btn.innerHTML = icon(soundEnabled ? 'speaker' : 'volumeMute');
}
document.querySelector('#sound-toggle')?.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  try { localStorage.setItem('verbox-sound', String(soundEnabled)); } catch {}
  updateSoundToggle();
  if (soundEnabled) playSound('correct');
});
const main = document.querySelector('#main');
const dialog = document.querySelector('#quiz-dialog');
const KEY = 'verbox-progress-v1';
let storageAvailable = true;
let saved;
try { saved = JSON.parse(localStorage.getItem(KEY) || localStorage.getItem('conjugo-progress-v1') || 'null'); } catch { storageAvailable = false; }
const initial = { points:0, sessions:[], daily:{}, level:'CE2' };
let state = saved && typeof saved === 'object' && Number.isFinite(saved.points) && saved.points >= 0 && Array.isArray(saved.sessions) && saved.daily && typeof saved.daily === 'object' ? saved : initial;
state.sessions = state.sessions.filter(s => s && levelTenses[s.level] && (tenses[s.tense] || s.tense==='mixed') && Number.isFinite(s.correct) && Number.isFinite(s.points) && Number.isFinite(s.answered) && typeof s.date === 'string' && Number.isFinite(Date.parse(s.date)));
state.sessions=state.sessions.map(s=>({...s,formats:Array.isArray(s.formats)?s.formats.filter(f=>formats[f]):['choice'],formatCounts:Object.fromEntries(Object.keys(formats).map(f=>[f,Number.isFinite(s.formatCounts?.[f])?Math.max(0,Math.min(10,s.formatCounts[f])):0]))}));
state.learning=sanitizeLearning(saved?.learning);
let level = levelTenses[document.body.dataset.level] ? document.body.dataset.level : levelTenses[state.level] ? state.level : 'CE2';
const requestedTense = new URLSearchParams(location.search).get('temps');
let selected = levelTenses[level].includes(requestedTense) ? requestedTense : 'present';
let mode = 'practice';
let exerciseFormat='mixed';
let mixTenses=false;
let page = document.body.dataset.page || 'accueil';
let quiz = null;
let timer = null;
let returnFocus = null;
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { storageAvailable=false; } }
function totalAnswers() { return state.sessions.reduce((n,s) => n+s.answered,0); }
function totalCorrect() { return state.sessions.reduce((n,s) => n+s.correct,0); }
function todayPoints() { const value=state.daily[localDate()]; return Number.isFinite(value) ? value : 0; }
function badgeUnlocked(id) { return id===0 ? state.sessions.length>0 : id===1 ? state.sessions.some(s => s.correct===10) : state.points>=500; }
function badge(id, detailed=false) {
 const names=['Premier pas','Sans-faute','Super conjugueur'];
 const desc=['Terminer une série','Réussir 10 réponses sur 10','Gagner 500 points'];
 return `<div class="badge-item"><div class="badge-medal ${badgeUnlocked(id)?'':'locked'}" aria-label="${badgeUnlocked(id)?'Badge obtenu':'Badge à débloquer'}">${icon(['star','zap','trophy'][id])}</div><span>${names[id]}</span>${detailed?`<p>${desc[id]}</p>`:''}</div>`;
}
const art = `<svg class="hero-art" viewBox="0 0 270 245" aria-hidden="true">
 <circle cx="155" cy="132" r="102" fill="#325c4b"/><circle cx="155" cy="132" r="81" fill="none" stroke="#51715a" stroke-dasharray="3 7" opacity=".65"/>
 <path d="M55 219c55-8 100-7 164 0" stroke="#183e35" stroke-width="10" stroke-linecap="round" opacity=".5"/>
 <g transform="rotate(-10 144 151)"><rect x="78" y="145" width="137" height="51" rx="6" fill="#dc9c5f"/><path d="M91 154h119v32H91c-8-6-8-26 0-32" fill="#f0e4bd"/><path d="M97 166h108m-108 7h108m-108 7h108" stroke="#d5c49b" stroke-width="1.5"/><path d="M83 146v48" stroke="#b47842" stroke-width="3"/></g>
 <g transform="rotate(9 139 153)"><path d="M61 125q40-12 78 8 30-26 71-25v66q-41-1-71 20-36-18-78-9Z" fill="#c3cda2"/><path d="M64 115q37-8 74 12 33-25 69-25v63q-35-1-69 23-35-20-74-12Z" fill="#fff7dc"/><path d="M138 127v61" stroke="#d9cca6" stroke-width="2"/><path d="m77 133 45 8m-45 2 45 8m-45 2 34 6m40-21 42-16m-42 26 42-16m-42 26 31-11" stroke="#c6c4a5" stroke-width="2"/><path d="M164 115v30l7-9 7 3v-29" fill="#dc8559"/></g>
 <g transform="rotate(25 202 78)"><rect x="195" y="38" width="13" height="69" rx="1" fill="#eac574"/><path d="M195 107h13l-6.5 19Z" fill="#f1d9ae"/><path d="m199.5 119 2 7 2.5-7" fill="#28463d"/><path d="M195 38v-8q6-6 13 0v8" fill="#d98262"/><path d="M195 38h13v8h-13" fill="#f5e7be"/><path d="M199 47v59" stroke="#f4d992" stroke-width="3"/></g>
 <path d="M61 56v17m-8-8h16M226 146v13m-6-6h12" stroke="#dec480" stroke-width="2"/><circle cx="98" cy="85" r="4" fill="#d18558"/><circle cx="228" cy="100" r="3" fill="#a5b78b"/>
 <path d="m106 40 8 4-8 4-4 8-4-8-8-4 8-4 4-8Z" fill="#d1bd7c"/><path d="m32 147 10-6m-4 20 12-2" stroke="#98ab7d" stroke-width="2"/>
 </svg>`;
function renderHome() {
 const daily=todayPoints();
 const stats=learningStats(level,state.learning),mission=dailyMission(level,state.sessions);
 main.innerHTML=`${!storageAvailable?'<p class="storage-warning">La sauvegarde est indisponible dans ce navigateur. Tu peux jouer, mais tes progrès ne seront pas conservés après fermeture.</p>':''}
 <div class="greeting"><div><h1>${document.body.dataset.level ? `Conjugaison ${level}` : 'À toi de conjuguer !'} <span class="wave">👋</span></h1><p>Des exercices de conjugaison du CE2 au CM2.</p></div><span class="date-label">${icon('calendar')}${new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'long'}).format(new Date())}</span></div>
 <div class="dashboard"><section class="training-column" aria-label="Choisir un entraînement">
 <div class="hero"><div class="hero-copy"><div class="eyebrow"><span aria-hidden="true">✦</span> L’AVENTURE DES MOTS</div><h2>Les verbes n’ont qu’à<br><span>bien se tenir.</span></h2><p>Choisis ton niveau, relève le défi et fais grandir ton talent de conjugueur !</p></div>${art}</div>
 <div class="level-section"><span class="section-label">${icon('cap')}Je suis en</span><div class="levels" role="group" aria-label="Ton niveau scolaire">${Object.keys(levelTenses).map(l=>`<button class="level-button ${level===l?'active':''}" data-level="${l}" aria-pressed="${level===l}">${l}</button>`).join('')}</div></div>
 ${renderJourney(false)}
 <div class="section-title"><h2>On travaille quel temps ?</h2><span class="step">01 · Je choisis</span></div>
 <label class="mix-toggle"><input type="checkbox" id="mix-tenses" ${mixTenses?'checked':''}> Mélanger les temps de mon niveau</label>
 <div class="lesson-grid">${levelTenses[level].map(key=>{
 const t=tenses[key]; const sessions=state.sessions.filter(s=>s.tense===key&&s.level===level);const best=sessions.length?Math.max(...sessions.map(s=>s.correct)):0;
 return `<button class="lesson ${selected===key&&!mixTenses?'selected':''}" data-tense="${key}" aria-pressed="${selected===key&&!mixTenses}"><div class="lesson-top"><span class="icon-tile ${t.color}">${icon(t.icon)}</span><span class="select-dot" aria-hidden="true">${selected===key?'✓':''}</span></div><h3>${t.name}</h3><p>${t.subtitle}</p><div class="lesson-bottom"><span>${sessions.length?`Record : ${best}/10`:'Prêt à explorer'}</span><span class="line" aria-hidden="true"><span style="width:${best*10}%"></span></span></div></button>`;
 }).join('')}</div>
 <div class="exercise-picker"><label for="exercise-format">Comment veux-tu jouer ?</label><select id="exercise-format"><option value="mixed">Surprise ! Les 4 exercices se mélangent</option>${Object.entries(formats).map(([key,label])=>`<option value="${key}" ${exerciseFormat===key?'selected':''}>${label}</option>`).join('')}</select><p>De nouvelles questions, des phrases et un peu de révision à chaque séance.</p></div>
 <div class="mode-section"><div class="section-title"><h2>À chacun son rythme</h2><span class="step">02 · Je me lance</span></div><div class="mode-options" role="group" aria-label="Mode de jeu"><button class="mode ${mode==='practice'?'active':''}" data-mode="practice" aria-pressed="${mode==='practice'}">${icon('leaf')}<span class="mode-text"><strong>Entraînement</strong><small>Je prends mon temps</small></span><span class="select-dot" aria-hidden="true"></span></button><button class="mode ${mode==='timed'?'active':''}" data-mode="timed" aria-pressed="${mode==='timed'}">${icon('clock')}<span class="mode-text"><strong>Défi chrono</strong><small>90 secondes pour jouer</small></span><span class="select-dot" aria-hidden="true"></span></button></div></div>
 <div class="start-row"><span class="session-meta">${icon('book')}10 questions <span>·</span> ${mode==='timed'?'90 secondes':'Sans limite de temps'}</span><button class="primary-button" id="start-quiz">C’est parti ! ${icon('arrow')}</button></div>
 </section><aside class="right-column" aria-label="Tes objectifs"><section class="discovery-card"><h2>La mission du jour</h2><p>${mission.label}</p><strong>${mission.value} / ${mission.target}${mission.done?' · Mission accomplie !':''}</strong><button class="secondary-button" id="daily-mission">${mission.done?'Rejouer pour le plaisir':'Jouer la mission'}</button><p>Une idée différente chaque jour. Rien à rattraper si tu fais une pause.</p></section><section class="discovery-card"><h2>Mon carnet ${level}</h2><p><strong>${stats.seen} / ${stats.total}</strong> conjugaisons découvertes</p><p>${stats.mastered} consolidées · ${stats.due} à revoir</p><button class="secondary-button" id="review-quiz" ${stats.due?'':'disabled'}>Réviser à mon rythme</button><p>Les erreurs reviennent en priorité ; les réussites sont revues plus tard.</p></section><section class="daily-card"><h2 class="aside-title">${icon('target')}Mon objectif du jour</h2><p>Un petit défi pour garder le rythme.</p><div class="goal-ring" style="--progress:${Math.min(daily,100)}%"><div class="goal-ring-inner"><strong>${daily}<span class="goal-denominator"> / 100</span></strong><small>points aujourd’hui</small></div></div><div class="goal-message">${daily>=100?'Objectif atteint, <strong>bravo à toi !</strong>':daily>0?`Encore <strong>${100-daily} points</strong>, tu y es presque !`:'Une nouvelle journée,<br><strong>une nouvelle chance de progresser !</strong>'}</div><div class="daily-bottom">${icon('sun')}Un peu de pratique, beaucoup de progrès</div></section>
 <section class="tip-card"><div class="eyebrow">${icon('bulb')}LE PETIT MÉMO</div><h3>Hier, aujourd’hui<br>ou demain ?</h3><p>Repère les mots qui donnent un indice sur le temps : hier, maintenant, demain…</p><button data-page="fiches">Découvrir les fiches ${icon('arrow')}</button></section>
 <section class="badges-card"><div class="badges-heading"><h2 class="aside-title">Mes petits trophées</h2><button class="text-link" data-page="progres">Tout voir</button></div><div class="badge-list">${[0,1,2].map(i=>badge(i)).join('')}</div></section></aside></div>${homeGuide(document.body.dataset.level || undefined)}`;
 main.querySelectorAll('[data-level]').forEach(btn=>btn.addEventListener('click',()=>{state.level=btn.dataset.level;save();location.assign(levelPath(btn.dataset.level));}));
 main.querySelectorAll('[data-tense]').forEach(btn=>btn.addEventListener('click',()=>{selected=btn.dataset.tense;mixTenses=false;withViewTransition(()=>{render();main.querySelector(`[data-tense="${selected}"]`)?.focus();});}));
 main.querySelectorAll('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>{mode=btn.dataset.mode;withViewTransition(()=>{render();main.querySelector(`[data-mode="${mode}"]`)?.focus();});}));
 main.querySelector('#mix-tenses').addEventListener('change',event=>{mixTenses=event.target.checked;withViewTransition(()=>{render();main.querySelector('#mix-tenses')?.focus();});});
 main.querySelector('#exercise-format').addEventListener('change',event=>{exerciseFormat=event.target.value;});
 main.querySelector('#start-quiz').addEventListener('click',()=>startQuiz());
 main.querySelector('#daily-mission').addEventListener('click',()=>startQuiz({format:mission.format,tense:'mixed',mode:'practice',mission:true}));
 main.querySelector('#review-quiz').addEventListener('click',()=>startQuiz({review:true,tense:'mixed',mode:'practice'}));
 main.querySelector('#journey-quiz')?.addEventListener('click',()=>startQuiz(journeyOptions()));
}
function journeyOptions() {
 const next=journey(level,state.sessions,state.learning).find(x=>!x.done);
 return {tense:next?.index>0?'mixed':selected,format:next?.index===2?'mixed':exerciseFormat,review:next?.index===4,mode:'practice'};
}
function renderJourney(detailed) {
 const chapters=journey(level,state.sessions,state.learning),next=chapters.find(x=>!x.done);
 return `<section class="journey-card"><div class="section-title"><h2>Mon voyage ${level}</h2><span>${chapters.filter(x=>x.done).length} / 6 étapes</span></div><ol class="journey-stops">${chapters.map(c=>`<li class="${c.done?'done':c.available?'current':'waiting'}"><span aria-hidden="true">${c.done?'✓':c.index+1}</span><strong>${c.name}</strong><small>${c.done?'Étape accomplie':c.available?'En cours':'À débloquer'}</small>${detailed?`<p>${c.description}</p><small>${c.value} / ${c.target}</small>`:''}</li>`).join('')}</ol>${next?`<p><b>${next.description}</b> · ${next.value} / ${next.target}</p>${detailed?'':'<button class="secondary-button" id="journey-quiz">Continuer mon voyage</button>'}`:'<p>Voyage accompli ! Continue à explorer les verbes et à consolider tes découvertes.</p>'}<p class="journey-note">Toutes les activités restent accessibles. Tes étapes ne disparaissent jamais.</p></section>`;
}
function renderProgress() {
 const total=totalAnswers();
 main.innerHTML=`<div class="greeting"><div><h1>Regarde tes progrès <span class="wave" aria-hidden="true">✦</span></h1><p>Chaque entraînement compte. Continue comme ça !</p></div></div><div class="stats-grid"><div class="stat-card"><strong>${state.points}</strong><span>points gagnés</span></div><div class="stat-card"><strong>${state.sessions.length}</strong><span>séries terminées</span></div><div class="stat-card"><strong>${total?Math.round(totalCorrect()/total*100):0}%</strong><span>de bonnes réponses</span></div></div>${renderJourney(true)}<section class="content-panel"><h2>Mes petits trophées</h2><div class="badge-gallery">${[0,1,2].map(i=>badge(i,true)).join('')}</div></section><section class="content-panel"><h2>Mes derniers entraînements</h2>${state.sessions.length?state.sessions.slice(-10).reverse().map(s=>`<div class="history-row"><div><b>${s.tense==='mixed'?'Temps mélangés':tenses[s.tense].name}</b><br><small>${s.level} · ${s.mode==='timed'?'Défi chrono':'Entraînement'}</small></div><div>${s.correct}/${s.answered} réussies<br><small>${new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'short'}).format(new Date(s.date))}</small></div><strong>+${s.points} pts</strong></div>`).join(''):'<p>Ton aventure commence ici ! Termine une première série pour découvrir tes progrès.</p><button class="primary-button spaced-action" data-page="accueil">Je m’entraîne '+icon('arrow')+'</button>'}<p class="privacy-note">Tes progrès sont enregistrés uniquement dans ce navigateur, sur cet appareil.</p></section>`;
}
function renderMemos() { main.innerHTML=renderContent({page:'fiches'}); }
function renderLessonPage() { main.innerHTML=renderContent({page:'lecon',tense:document.body.dataset.tense}); }
function renderHelp() { main.innerHTML=renderContent({page:'aide'}); }
function render() {
 document.querySelector('#total-points').textContent=state.points;
 document.querySelector('#page-label').textContent={accueil:'Mon entraînement',progres:'Mes progrès',fiches:'Mes fiches mémo',aide:'Comment ça marche ?',lecon:'Fiches de conjugaison'}[page];
 const activeNav=(page==='fiches'||page==='lecon')?'fiches':page;
 document.querySelectorAll('.nav-item').forEach(btn=>{const isCurrent=btn.dataset.page===activeNav;btn.classList.toggle('active',isCurrent);if(isCurrent)btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current');});
 updateSoundToggle();
 ({accueil:renderHome,progres:renderProgress,fiches:renderMemos,aide:renderHelp,lecon:renderLessonPage}[page])();
 main.querySelectorAll('[data-page]').forEach(btn=>btn.addEventListener('click',()=>navigate(btn.dataset.page)));
}
function navigate(next) { location.assign({accueil:'/',progres:'/progres/',fiches:'/fiches/',aide:'/aide/'}[next] || '/'); }
// Public navigation uses native links so URLs work without JavaScript.

function startQuiz(options={}) {
 returnFocus=document.activeElement;
 const settings={level,tense:mixTenses?'mixed':selected,format:exerciseFormat,mode,review:false,...options};
 quiz={...settings,questions:makeSession({...settings,memory:state.learning}),memory:structuredClone(state.learning),index:0,points:0,correct:0,streak:0,answered:0,locked:false,finished:false,started:Date.now(),deadline:Date.now()+90000,remaining:90,mistakes:[],formatCounts:{},confirming:false,chaptersBefore:journey(level,state.sessions,state.learning).filter(c=>c.done).length};
 renderQuestion();dialog.showModal();focusAnswer();
 timer=setInterval(tick,200);
}
function focusAnswer() { (dialog.querySelector('#written-answer')||dialog.querySelector('.answer'))?.focus(); }
function formatTime(seconds) { return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`; }
function tick() {
 if(!quiz||quiz.finished)return;
 const seconds=quiz.mode==='timed'?Math.max(0,Math.ceil((quiz.deadline-Date.now())/1000)):Math.floor((Date.now()-quiz.started)/1000);
 quiz.remaining=seconds;
 const el=dialog.querySelector('#timer-value');if(el)el.textContent=formatTime(seconds);
 const box=dialog.querySelector('.quiz-timer');if(box)box.classList.toggle('urgent',quiz.mode==='timed'&&seconds<=15);
 if(quiz.mode==='timed'&&seconds===0)finishQuiz(true);
}
function renderQuestion() {
  const q=quiz.questions[quiz.index];
  const pronoun=q.person==='je'&&/^[aàâeéèêëiîïoôuùûh]/i.test(q.answer)?'j’':q.person+' ';
  const instructions={choice:'Choisis la bonne conjugaison.',write:'Écris seulement la forme conjuguée, sans le sujet.',sentence:'Complète la phrase avec la forme conjuguée.',correct:'Cette phrase contient une erreur de conjugaison. Écris la forme correcte.'};
  let exercise=q.format==='choice'?'<div class="answers" role="group" aria-label="Choisis la bonne réponse" aria-describedby="question-verb context-prompt">'+q.choices.map((choice,i)=>'<button class="answer" data-choice="'+i+'">'+choice+'</button>').join('')+'</div>':'<form id="written-form"><label for="written-answer">Ta conjugaison (sans le sujet)</label><input id="written-answer" name="answer" autocomplete="off" autocapitalize="none" spellcheck="false" maxlength="80" required aria-describedby="writing-help"><p id="writing-help">Les accents comptent. Pour un temps composé, écris les deux mots.</p><div class="accent-keys" role="group" aria-label="Ajouter un accent">'+['é','è','ê','î','û','â','ç'].map(c=>'<button type="button" data-accent="'+c+'" aria-label="Insérer '+c+'">'+c+'</button>').join('')+'</div><div class="writing-actions"><button class="primary-button" type="submit">Valider</button><button class="text-link" type="button" id="show-hint">Un indice ?</button></div><p id="answer-hint" aria-live="polite"></p></form>';
  const prompt=q.format==='sentence'?'<p class="context-sentence" id="context-prompt">'+pronoun+'<span role="img" aria-label="verbe à compléter">…</span> '+q.complement+'. <button type="button" class="speech-btn small" id="speak-prompt" aria-label="Écouter la phrase" title="Écouter la phrase">'+icon('speaker')+'</button></p>':q.format==='correct'?'<p class="context-sentence" id="context-prompt">'+phrase(q.person,q.wrongForm)+' '+q.complement+'. <button type="button" class="speech-btn small" id="speak-prompt" aria-label="Écouter la phrase" title="Écouter la phrase">'+icon('speaker')+'</button></p>':'<div class="question-person" id="context-prompt">'+q.person+' <span role="img" aria-label="verbe à compléter">…</span></div>';
  dialog.innerHTML='<header class="quiz-header"><div><h2 id="quiz-title">'+tenses[q.tense].name+'</h2><small>'+quiz.level+' · '+formats[q.format]+(q.review?' · Révision':'')+'</small></div><button class="close-button" aria-label="Quitter l’exercice" id="quit-quiz">'+icon('close')+'</button></header><div class="quiz-body"><div class="quiz-status"><span>Question <strong>'+(quiz.index+1)+'</strong> sur 10</span><span id="quiz-points"><span aria-hidden="true">✦</span> '+quiz.points+' pts</span><span class="quiz-timer" role="timer" aria-label="'+(quiz.mode==='timed'?'Temps restant':'Temps écoulé')+'">'+icon('clock')+'<span id="timer-value">'+formatTime(quiz.mode==='timed'?quiz.remaining:Math.floor((Date.now()-quiz.started)/1000))+'</span></span></div><div class="progress-track" role="progressbar" aria-label="Questions terminées" aria-valuemin="0" aria-valuemax="10" aria-valuenow="'+quiz.answered+'"><span style="width:'+quiz.answered*10+'%"></span></div><p class="question-instruction">'+instructions[q.format]+' <strong>Temps demandé : '+tenses[q.tense].name.toLowerCase()+'.</strong></p><h3 class="question-verb" id="question-verb">'+q.verb+' <button type="button" class="speech-btn small" id="speak-verb" aria-label="Écouter la prononciation du verbe '+q.verb+'" title="Écouter le verbe">'+icon('speaker')+'</button></h3>'+prompt+exercise+'<div id="feedback" aria-live="polite" tabindex="-1"></div><div class="quiz-actions"><small>Les erreurs font partie du voyage.</small><button class="primary-button" id="next-question" hidden>Suivant '+icon('arrow')+'</button></div></div>';
  dialog.querySelectorAll('[data-choice]').forEach(btn=>btn.addEventListener('click',()=>answerQuestion(q.choices[Number(btn.dataset.choice)])));
  dialog.querySelector('#written-form')?.addEventListener('submit',event=>{event.preventDefault();answerQuestion(dialog.querySelector('#written-answer').value);});
  dialog.querySelectorAll('[data-accent]').forEach(btn=>btn.addEventListener('click',()=>{const input=dialog.querySelector('#written-answer');input.setRangeText(btn.dataset.accent,input.selectionStart,input.selectionEnd,'end');input.focus();}));
  dialog.querySelector('#show-hint')?.addEventListener('click',()=>{dialog.querySelector('#answer-hint').textContent='La réponse commence par « '+q.answer[0]+' » et contient '+q.answer.split(' ').length+' mot(s).';});
  dialog.querySelector('#quit-quiz').addEventListener('click',confirmQuit);
  dialog.querySelector('#next-question').addEventListener('click',nextQuestion);
  dialog.querySelector('#speak-verb')?.addEventListener('click',()=>speak(q.verb));
  dialog.querySelector('#speak-prompt')?.addEventListener('click',()=>{
    const text=q.format==='sentence'?pronoun+' '+q.complement:phrase(q.person,q.wrongForm)+' '+q.complement;
    speak(text);
  });
  if(dialog.open)focusAnswer();
}
function answerQuestion(chosen) {
  if(!quiz||quiz.locked||quiz.finished||!chosen.trim())return;
  if(quiz.mode==='timed'&&Date.now()>=quiz.deadline){finishQuiz(true);return;}
  const q=quiz.questions[quiz.index],correct=isCorrect(chosen,q.answer);
  quiz.locked=true;quiz.answered++;quiz.streak=correct?quiz.streak+1:0;
  quiz.formatCounts[q.format]=(quiz.formatCounts[q.format]||0)+1;
  recordAnswer(quiz.memory,q,correct);
  const points=scoreAnswer(correct,quiz.streak);quiz.points+=points;
  if(correct)quiz.correct++;else quiz.mistakes.push({verb:q.verb,person:q.person,answer:q.answer,chosen});
  if(correct){
    if(quiz.streak>=3)playSound('streak');
    else playSound('correct');
  }else{
    playSound('wrong');
  }
  dialog.querySelectorAll('.answer').forEach(btn=>{btn.disabled=true;const value=q.choices[Number(btn.dataset.choice)];if(value===q.answer)btn.classList.add('correct');else if(value===chosen)btn.classList.add('wrong');});
  dialog.querySelectorAll('#written-form input, #written-form button').forEach(el=>el.disabled=true);
  dialog.querySelector('#quiz-points').innerHTML='<span aria-hidden="true">✦</span> '+quiz.points+' pts';
  const verb=verbs.find(v=>v.infinitive===q.verb);
  const reminder=q.tense==='present'&&!q.verb.endsWith('er')?'À retenir : '+verb.present.map((form,i)=>phrase(['je','tu','il','nous','vous','ils'][i],form)).join(', ')+'.':tenses[q.tense].tip;
  dialog.querySelector('#feedback').innerHTML='<div class="feedback '+(correct?'':'incorrect')+'"><strong>'+(correct?'Bien joué ! +'+points+' points'+(quiz.streak>=3?' · Quelle série !':''):'On apprend ensemble !')+'</strong><div>'+(correct?'Tu as bien trouvé : <b>'+phrase(q.person,q.answer)+'</b> <button type="button" class="speech-btn small" id="speak-answer" aria-label="Écouter la conjugaison" title="Écouter">'+icon('speaker')+'</button>.':'La bonne réponse : <b>'+phrase(q.person,q.answer)+'</b> <button type="button" class="speech-btn small" id="speak-answer" aria-label="Écouter la bonne réponse" title="Écouter">'+icon('speaker')+'</button>.')+'</div>'+(correct?'':'<div>Cette conjugaison reviendra pour t’aider à la retenir.</div>')+'<small>'+reminder+'</small></div>';
  dialog.querySelector('#speak-answer')?.addEventListener('click',()=>speak(phrase(q.person,q.answer)));
  const next=dialog.querySelector('#next-question');next.hidden=false;next.innerHTML=(quiz.index===9?'Voir mon résultat':'Suivant')+' '+icon('arrow');next.focus();
}
function nextQuestion() { if(!quiz?.locked||quiz.finished)return;if(quiz.index===9){finishQuiz(false);return;}quiz.index++;quiz.locked=false;withViewTransition(()=>renderQuestion()); }
function finishQuiz(timedOut) {
  if(!quiz||quiz.finished)return;
  quiz.finished=true;clearInterval(timer);timer=null;
  const elapsed=quiz.mode==='timed'?Math.min(90,Math.round((Date.now()-quiz.started)/1000)):Math.round((Date.now()-quiz.started)/1000);
  const completed={date:new Date().toISOString(),day:localDate(),level:quiz.level,tense:quiz.tense,mode:quiz.mode,points:quiz.points,correct:quiz.correct,answered:quiz.answered,elapsed,formats:Object.keys(quiz.formatCounts),formatCounts:quiz.formatCounts};
  state.points+=quiz.points;state.sessions.push(completed);state.learning=quiz.memory;state.daily[localDate()]=todayPoints()+quiz.points;save();render();
  playSound('finish');
  const unlocked=journey(quiz.level,state.sessions,state.learning).filter(c=>c.done).length>quiz.chaptersBefore;
  withViewTransition(()=>{
    dialog.innerHTML='<div class="results"><div class="result-medal" aria-hidden="true">'+(quiz.correct===10?'🏆':quiz.correct>=7?'✦':'🌱')+'</div><h2 id="quiz-title">'+(quiz.correct===10?'Un sans-faute, bravo !':quiz.correct>=7?'Tu peux être fier de toi !':'Un pas de plus, bien joué !')+'</h2><p>'+(timedOut?'Le temps est écoulé. Chaque réponse compte !':'Tu viens de terminer ton entraînement.')+'</p>'+(unlocked?'<p class="milestone-message">Une nouvelle étape de ton voyage est accomplie !</p>':'')+'<div class="result-stats"><div><strong>+'+quiz.points+'</strong><span>points gagnés</span></div><div><strong>'+quiz.correct+'/'+quiz.answered+'</strong><span>réponses réussies</span></div><div><strong>'+formatTime(elapsed)+'</strong><span>temps de jeu</span></div></div>'+(timedOut&&quiz.answered<10?'<p>'+quiz.answered+' question(s) répondue(s) sur 10.</p>':'')+(quiz.mistakes.length?'<details class="review-list"><summary>Revoir mes '+quiz.mistakes.length+' correction(s)</summary>'+quiz.mistakes.map(m=>'<div class="review-item"><b>'+m.verb+' → '+phrase(m.person,m.answer)+'</b><small>Ta réponse : '+escapeHTML(m.chosen)+'</small></div>').join('')+'</details>':'')+(!storageAvailable?'<p class="storage-warning">Ces progrès ne pourront pas être conservés après fermeture du navigateur.</p>':'')+'<p>Une petite séance suffit. Tu peux revenir quand tu veux.</p><div class="quiz-actions"><button class="secondary-button" id="back-home">Faire une pause</button><button class="primary-button" id="play-again">Une nouvelle série '+icon('arrow')+'</button></div></div>';
    dialog.querySelector('#back-home').addEventListener('click',closeQuiz);
    dialog.querySelector('#play-again').addEventListener('click',()=>{const options={tense:quiz.tense,format:quiz.format,mode:quiz.mode,review:quiz.review};dialog.close();startQuiz(options);});
    dialog.querySelector('#back-home').focus();
  });
}
function confirmQuit() {
 if(!quiz||quiz.finished){closeQuiz();return;}
 if(quiz.confirming)return;
 quiz.confirming=true;
 const previous=document.createElement('div');while(dialog.firstChild)previous.appendChild(dialog.firstChild);
 dialog.innerHTML=`<div class="confirm-exit"><h2 id="quiz-title">Faire une pause ?</h2><p>Cette série ne sera pas enregistrée si tu la quittes.${quiz.mode==='timed'?'<br>Le chronomètre continue pendant ce message.':''}</p><div class="quiz-actions"><button class="secondary-button" id="leave-now">Quitter la série</button><button class="primary-button" id="keep-playing">Continuer</button></div></div>`;
 dialog.querySelector('#leave-now').addEventListener('click',closeQuiz);
 dialog.querySelector('#keep-playing').addEventListener('click',()=>{quiz.confirming=false;dialog.replaceChildren(...previous.childNodes);(dialog.querySelector('#next-question:not([hidden])')||dialog.querySelector('#written-answer')||dialog.querySelector('.answer')).focus();tick();});
 dialog.querySelector('#keep-playing').focus();
}
function closeQuiz() { clearInterval(timer);timer=null;quiz=null;dialog.close();if(returnFocus?.isConnected)returnFocus.focus();else main.focus(); }
dialog.addEventListener('cancel',event=>{event.preventDefault();confirmQuit();});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')tick();});
render();
