import {levelTenses,tenses} from './core.js';
import {formats,sanitizeLearning} from './learning.js';

export const PROGRESS_KEY='verbox-progress-v1';
const known=(map,value)=>typeof value==='string'&&Object.hasOwn(map,value);
export function loadProgress(storage) {
  let saved;
  let storageAvailable=true;
  try { saved=JSON.parse(storage.getItem(PROGRESS_KEY)||storage.getItem('conjugo-progress-v1')||'null'); }
  catch { storageAvailable=false; }
  const initial={points:0,sessions:[],daily:{},level:'CE2',learning:{}};
  if(!saved||typeof saved!=='object'||!Number.isFinite(saved.points)||saved.points<0||!Array.isArray(saved.sessions)||!saved.daily||typeof saved.daily!=='object'||Array.isArray(saved.daily))return {state:initial,storageAvailable};
  const sessions=saved.sessions.filter(s=>s&&known(levelTenses,s.level)&&(known(tenses,s.tense)||s.tense==='mixed')&&Number.isFinite(s.correct)&&Number.isFinite(s.points)&&Number.isFinite(s.answered)&&s.answered>=0&&s.answered<=10&&s.correct>=0&&s.correct<=s.answered&&s.points>=0&&typeof s.date==='string'&&Number.isFinite(Date.parse(s.date)));
  const state={
    points:saved.points,
    level:known(levelTenses,saved.level)?saved.level:'CE2',
    daily:Object.fromEntries(Object.entries(saved.daily).filter(([day,value])=>/^\d{4}-\d{2}-\d{2}$/.test(day)&&Number.isFinite(value)&&value>=0)),
    sessions:sessions.map(s=>({...s,formats:Array.isArray(s.formats)?s.formats.filter(f=>known(formats,f)):['choice'],formatCounts:Object.fromEntries(Object.keys(formats).map(f=>[f,Number.isFinite(s.formatCounts?.[f])?Math.max(0,Math.min(10,s.formatCounts[f])):0]))})),
    learning:sanitizeLearning(saved.learning)
  };
  return {state,storageAvailable};
}
