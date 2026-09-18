// One-time migration of the original layout stylesheet onto the shared tokens.
// Re-running is safe: existing custom properties are left intact.
import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const tokens = JSON.parse(await readFile(new URL('design-tokens.json', root), 'utf8'));
const file = new URL('styles.css', root);
let css = await readFile(file, 'utf8');
const originalColors = new Set(css.match(/#[\da-f]{3,8}\b/gi) || []);
const rgb = hex => hex.match(/[\da-f]{2}/gi).map(v => parseInt(v,16));
const palette = Object.entries(tokens.color);
const exact = { '#da784e':'accent', '#c86842':'accent-hover', '#d5794e':'focus', '#254f42':'brand', '#c7d1b1':'on-brand-muted', '#d0ddcf':'on-brand-muted', '#e5cb81':'gold', '#f1f0e3':'surface-warm', '#778179':'muted' };
css = css.replace(/#[\da-f]{3,8}\b/gi, hex => {
  let value = hex.slice(1).toLowerCase();
  if(value.length===3)value=value.split('').map(c=>c+c).join('');
  const alpha=value.length===8?parseInt(value.slice(6),16)/255:1;
  const [r,g,b]=rgb(value.slice(0,6));
  const name=exact[hex]||palette.reduce((best,[name,color])=>{
    const [cr,cg,cb]=rgb(color.slice(1));const distance=(r-cr)**2+(g-cg)**2+(b-cb)**2;
    return distance<best.distance?{name,distance}:best;
  },{distance:Infinity}).name;
  const token=`var(--color-${name})`;
  return alpha===1?token:`color-mix(in srgb, ${token} ${Math.round(alpha*100)}%, transparent)`;
});
css=css.replace(/font-family:'DM Sans',sans-serif/g,'font-family:var(--font-body)').replace(/font-family:Manrope,sans-serif/g,'font-family:var(--font-heading)');
css=css.replace(/font-size:\s*(\d+)px/g,(_,value)=>{
 const n=Number(value);const token=n<=12?'caption':n<=14?'small':n<=16?'body':n<=18?'subtitle':n<=22?'section':n<=29?'title':n<=34?'display':'question';
 return `font-size:var(--font-size-${token})`;
});
const spacing=Object.entries(tokens.space).map(([key,value])=>({key,value:parseInt(value)}));
css=css.replace(/((?:margin|padding)(?:-(?:top|bottom|left|right))?|gap):([^;{}]+)/g,(_,prop,value)=>`${prop}:${value.replace(/(-?)(\d+)px/g,(match,sign,number)=>{
 const n=Number(number);if(n>64||n===0)return match;
 const nearest=spacing.reduce((a,b)=>Math.abs(a.value-n)<=Math.abs(b.value-n)?a:b);
 return sign?`calc(-1 * var(--space-${nearest.key}))`:`var(--space-${nearest.key})`;
})}`);
css=css.replace(/border-radius:\s*(8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24)px(?=[;}])/g,(_,n)=>`border-radius:var(--radius-${Number(n)<=8?'xs':Number(n)<=12?'sm':Number(n)<=16?'md':Number(n)<=20?'lg':'xl'})`);
// Keep the font import's semicolons intact, then expand the compact layout rules.
const importEnd=css.indexOf('\n');
const header=css.slice(0,importEnd);
const body=css.slice(importEnd).replace(/\s*([{};])\s*/g,'$1\n').split('\n');
let depth=0;
const formatted=body.map(line=>{const content=line.trim();if(content.startsWith('}'))depth--;const result='  '.repeat(Math.max(depth,0))+content;if(content.endsWith('{'))depth++;return result;}).join('\n');
await writeFile(file,`${header}\n\n${formatted}\n`);
let app=await readFile(new URL('app.js',root),'utf8');
app=app.replace('style="font-size:15px;color:#a9b19c;font-weight:500"','class="goal-denominator"').replace('class="primary-button" data-page="accueil" style="margin-top:20px"','class="primary-button spaced-action" data-page="accueil"').replace('class="secondary-button" style="margin-top:18px"','class="secondary-button spaced-action"');
await writeFile(new URL('app.js',root),app);
console.log(`Migrated ${originalColors.size} literal layout colors to the shared palette.`);
