import test from 'node:test';
import assert from 'node:assert/strict';
import {loadProgress,PROGRESS_KEY} from './progress-storage.js';

const storage=value=>({getItem:()=>value});
test('Un JSON corrompu ou un stockage inaccessible laisse le jeu utilisable',()=>{
 for(const source of [storage('{bad'),storage('null'),storage('[]'),storage('42'),storage('{"points":10,"sessions":[],"daily":null}'),{getItem(){throw Error('blocked');}}]){
  const {state}=loadProgress(source);
  assert.equal(state.level,'CE2');assert.equal(state.points,0);assert.deepEqual(state.sessions,[]);
 }
 assert.equal(loadProgress({getItem(){throw Error('blocked');}}).storageAvailable,false);
});
test('Les clés héritées et les séances invalides ne deviennent pas des niveaux ou formats',()=>{
 const valid={level:'CM1',tense:'compose',correct:4,answered:10,points:40,date:'2026-09-19T10:00:00Z',formats:['write','constructor'],formatCounts:{write:200}};
 const raw={points:40,level:'constructor',daily:{'2026-09-19':40,bad:'text'},learning:{bad:{}},sessions:[valid,{...valid,level:'__proto__'},{...valid,tense:'constructor'},{...valid,answered:-1},{...valid,date:'invalid'},null]};
 const {state}=loadProgress(storage(JSON.stringify(raw)));
 assert.equal(state.level,'CE2');assert.equal(state.sessions.length,1);
 assert.deepEqual(state.sessions[0].formats,['write']);assert.equal(state.sessions[0].formatCounts.write,10);
 assert.deepEqual(state.daily,{'2026-09-19':40});assert.deepEqual(state.learning,{});
 const malformed={toString:{},valueOf:{}};
 raw.level=malformed;raw.sessions=[{...valid,level:malformed},{...valid,formats:[malformed,'choice']}];
 const recovered=loadProgress(storage(JSON.stringify(raw))).state;
 assert.equal(recovered.level,'CE2');assert.equal(recovered.sessions.length,1);assert.deepEqual(recovered.sessions[0].formats,['choice']);
});
test('Les progrès valides et la migration depuis Conjugo sont conservés',()=>{
 const raw={points:25,level:'CM2',daily:{'2026-09-19':25},sessions:[]};
 const visited=[];
 const {state,storageAvailable}=loadProgress({getItem(key){visited.push(key);return key===PROGRESS_KEY?null:JSON.stringify(raw);}});
 assert.deepEqual(visited,[PROGRESS_KEY,'conjugo-progress-v1']);
 assert.equal(storageAvailable,true);assert.equal(state.points,25);assert.equal(state.level,'CM2');
});
