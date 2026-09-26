import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const tokens=JSON.parse(await readFile(new URL('design-tokens.json',root),'utf8'));
const luminance=hex=>hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=0.04045?x/12.92:((x+0.055)/1.055)**2.4).reduce((sum,x,i)=>sum+x*[0.2126,0.7152,0.0722][i],0);
const pairs=[['ink','canvas'],['muted','canvas'],['muted','surface'],['muted','surface-warm'],['on-brand','brand'],['on-brand-muted','brand'],['gold','brand'],['on-brand','accent'],['on-brand','accent-hover'],['success','success-soft'],['error','error-soft']];
for(const [fg,bg]of pairs){const a=luminance(tokens.color[fg]),b=luminance(tokens.color[bg]);const ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);console.log(`${fg} / ${bg}: ${ratio.toFixed(2)}:1`);assert.ok(ratio>=4.5,`${fg}/${bg} must reach 4.5:1`);}
const boundaryContrast=(luminance(tokens.color.surface)+.05)/(luminance(tokens.color['border-strong'])+.05);
assert.ok(boundaryContrast>=3,'Interactive boundaries must reach 3:1 on the surface');
const canvasBoundaryContrast=(luminance(tokens.color.canvas)+.05)/(luminance(tokens.color['border-strong'])+.05);
assert.ok(canvasBoundaryContrast>=3,'Interactive boundaries must reach 3:1 on canvas');
console.log(`Interactive boundary (surface): ${boundaryContrast.toFixed(2)}:1`);
console.log(`Interactive boundary (canvas): ${canvasBoundaryContrast.toFixed(2)}:1`);
const styles=await readFile(new URL('styles.css',root),'utf8');
assert.ok(Buffer.byteLength(styles, 'utf8') < 80000, 'Layout CSS must stay below 80 KB');
assert.ok(!/^[ \t]{9}/m.test(styles), 'Layout indentation must not exceed eight spaces');
assert.equal((styles.match(/#[\da-f]{3,8}\b/gi)||[]).length,0,'Layout colors must use tokens');
const generated=await readFile(new URL('design-tokens.css',root),'utf8');
for(const [group,values]of Object.entries(tokens)){if(group.startsWith('$')||group==='breakpoint')continue;for(const [key,value]of Object.entries(values))assert.ok(generated.includes(`--${group}-${key}: ${value};`));}
const preview=await readFile(new URL('design-preview.html',root),'utf8');
assert.ok(!preview.includes('/* TOKENS */')&&!preview.includes('/* COMPONENTS */')&&!preview.includes('<!-- SWATCHES -->'));
assert.ok(!/<(?:link|script)[^>]+(?:href|src)=/i.test(preview),'Preview must be self-contained');
const designSystem=await readFile(new URL('design-system.css',root),'utf8');
const themeBlocks=[...designSystem.matchAll(/\[data-theme="([^"]+)"\]\s*\{([^}]+)\}/g)];
const allThemes={nature:tokens.color};
for(const [,name,body]of themeBlocks){
  const themeColors={};
  for(const [,prop,val]of body.matchAll(/--color-([\w-]+):\s*(#[0-9a-fA-F]{3,8})/g)){
    themeColors[prop]=val;
  }
  allThemes[name]=themeColors;
}
const quizContrastPairs=[
  ['ink','surface','Answer button normal'],
  ['ink','surface-soft','Answer button hover'],
  ['muted','surface','Answer button disabled'],
  ['ink','success-soft','Answer correct / feedback text'],
  ['ink','error-soft','Answer wrong / feedback text'],
  ['success','success-soft','Feedback success title'],
  ['error','error-soft','Feedback error title']
];
for(const [themeName,colors]of Object.entries(allThemes)){
  for(const [fg,bg,label]of quizContrastPairs){
    if(!colors[fg]||!colors[bg])continue;
    const a=luminance(colors[fg]),b=luminance(colors[bg]);
    const ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
    assert.ok(ratio>=4.5,`Theme ${themeName} ${label} (${fg}/${bg}) must reach 4.5:1 (was ${ratio.toFixed(2)}:1)`);
  }
}
console.log(`Theme contrast checks passed across all ${Object.keys(allThemes).length} themes.`);
console.log('Design checks passed.');

