import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,rm,realpath,readdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {buildSite} from './scripts/build-site.mjs';
import {routes,renderPage,metadata,robots,sitemap,publicOrigin} from './seo.js';
import {createServer,notFound,publicFiles} from './server.js';
const template=await readFile(new URL('./index.html',import.meta.url),'utf8');
const config={siteUrl:'https://verbox.example',name:'Verbox'};

test('Pages publiques : HTML lisible, titre unique, canonique et données structurées cohérentes',()=>{
 assert.equal(new Set(routes.map(r=>r.title)).size,routes.length);
 assert.equal(new Set(routes.map(r=>r.description)).size,routes.length);
 for(const route of routes){
  const html=renderPage(template,route,config,true);
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,route.path);
  assert.equal((html.match(/<title>/g)||[]).length,1);
  assert.ok(html.includes(`rel="canonical" href="${config.siteUrl}${route.path}"`));
  assert.ok(html.includes(route.noindex?'content="noindex, follow"':'content="index, follow, max-image-preview:large"'));
  assert.equal(html.includes('src="/app.js"'),!['confidentialite','apropos','mentions','conjugaison','verbe'].includes(route.page));
  assert.ok(!html.includes('Conjugo'));
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(graph['@graph'][0].name,'Verbox');
  if(route.page==='lecon')assert.ok(graph['@graph'].some(x=>x['@type']==='BreadcrumbList'));
  for(const [,href]of html.matchAll(/href="(\/[^"#]*)"/g)){
   const path=new URL(href,'https://verbox.example').pathname;
   assert.ok(routes.some(r=>r.path===path)||publicFiles.includes(path.slice(1)),`Lien interne inconnu : ${path}`);
  }
 }
});
test('Sitemap : seulement les routes publiques canoniques ; robots autorise les ressources',()=>{
 const xml=sitemap(config);assert.equal((xml.match(/<loc>/g)||[]).length,routes.filter(r=>!r.noindex).length);
 assert.ok(!xml.includes('/progres/')&&!xml.includes('design-preview'));
 for(const [,loc]of xml.matchAll(/<loc>(.*?)<\/loc>/g))assert.equal(new URL(loc).search,'');
 const text=robots(config,true);assert.ok(text.includes('User-agent: *\nAllow: /'));assert.ok(text.includes('Sitemap: https://verbox.example/sitemap.xml'));assert.ok(!text.includes('Disallow: /progres'));
});

test('Les fiches verbe comportent six tableaux accessibles et des introductions distinctes',()=>{
 const intros=[];
 for(const route of routes.filter(r=>!r.noindex)){
  const html=renderPage(template,route,config,true);
  const main=html.match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
  intros.push(main.match(/<p>([\s\S]*?)<\/p>/)[1]);
  if(route.page==='verbe'){
   assert.equal((main.match(/<table /g)||[]).length,6);
   assert.equal((main.match(/<caption>/g)||[]).length,6);
   assert.equal((main.match(/scope="row"/g)||[]).length,36);
   assert.ok(html.includes('BreadcrumbList'));
   assert.ok(route.title.length<=60);
   assert.ok(route.description.length>=120&&route.description.length<=155);
  }
 }
 assert.equal(new Set(intros).size,intros.length,'Premiers paragraphes indexables distincts');
});

test('HTML accessible : langue, identifiants uniques, titres, tableaux et scripts modules',()=>{
 for(const route of [...routes,notFound]){
  const html=renderPage(template,route,config,true);
  assert.ok(html.includes('lang="fr"'));
  const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,`Identifiants dupliqués : ${route.path}`);
  for(const [img]of html.matchAll(/<img\b[^>]*>/g))assert.match(img,/\balt="[^"]*"/);
  let previous=0;
  for(const [,level]of html.matchAll(/<h([1-6])\b/g)){
   assert.ok(Number(level)<=previous+1,`Saut de titre : ${route.path}`);previous=Number(level);
  }
  for(const [table]of html.matchAll(/<table\b[\s\S]*?<\/table>/g)){
   assert.match(table,/<caption>[^<]+<\/caption>/);assert.match(table,/scope="col"/);assert.match(table,/scope="row"/);
  }
  for(const [script]of html.matchAll(/<script\b[^>]*\bsrc="[^"]+"[^>]*>/g))assert.match(script,/type="module"/);
 }
});

test('Pages statiques sans application : boutons inactifs, compteur 0 et boîtes de dialogue absents',()=>{
 const staticPages=['404','confidentialite','apropos','mentions','conjugaison','verbe'];
 for(const route of [...routes.filter(r=>staticPages.includes(r.page)),notFound]){
  const html=renderPage(template,route,config,true);
  assert.ok(!html.includes('id="sound-toggle"'),`Bouton son présent sur page statique : ${route.path}`);
  assert.ok(!html.includes('id="open-wardrobe"'),`Bouton vestiaire présent sur page statique : ${route.path}`);
  assert.ok(!html.includes('id="total-points"'),`Compteur points présent sur page statique : ${route.path}`);
  assert.ok(!html.includes('id="quiz-dialog"'),`Dialogue quiz présent sur page statique : ${route.path}`);
  assert.ok(!html.includes('id="wardrobe-dialog"'),`Dialogue vestiaire présent sur page statique : ${route.path}`);
 }
});

test('Informations du projet : contact configuré, adresse échappée et mentions hors sitemap',()=>{
 const configured={...config,privacy:{editorName:'Éditeur <test>',contactEmail:'contact@example.test',hostAddress:'Adresse & suite'}};
 for(const page of ['apropos','mentions']){
  const route=routes.find(r=>r.page===page);
  const html=renderPage(template,route,configured,true);
  assert.ok(html.includes('mailto:contact@example.test'));
  assert.ok(html.includes('BreadcrumbList'));
  assert.ok(html.includes('href="/a-propos/"')&&html.includes('href="/mentions-legales/"'));
  if(page==='mentions'){
   assert.ok(html.includes('Éditeur &lt;test&gt;')&&html.includes('Adresse &amp; suite'));
   assert.ok(!sitemap(config).includes(route.path));
  }else assert.ok(sitemap(config).includes(route.path));
 }
});
test('L’aperçu ne devient pas indexable et la production exige un domaine HTTPS',()=>{
 const html=renderPage(template,routes[0],{siteUrl:''},false);
 assert.ok(html.includes('noindex, follow'));assert.ok(!html.includes('rel="canonical"'));
 assert.ok(!robots({siteUrl:''},false).includes('Sitemap:'));
 assert.throws(()=>publicOrigin('',true));
 for(const bad of ['http://verbox.example','https://localhost','https://127.0.0.1','https://verbox.example/sous-dossier','https://user:pass@verbox.example'])assert.throws(()=>publicOrigin(bad,true));
 assert.equal(publicOrigin('https://verbox.example/'),'https://verbox.example');
});

test('Indexation et maillage : exclusions explicites et pages à trois clics au maximum',()=>{
 const excluded=['/progres/','/confidentialite/','/mentions-legales/'];
 const xml=sitemap(config);
 assert.deepEqual(routes.filter(r=>r.noindex).map(r=>r.path).sort(),excluded.sort());
 const links=new Map();
 for(const route of [...routes,notFound]){
  const html=renderPage(template,route,config,true);
  assert.equal(/name="robots" content="noindex/.test(html),!!route.noindex,route.path);
  assert.equal(xml.includes(`<loc>${config.siteUrl}${route.path}</loc>`),!route.noindex,route.path);
  links.set(route.path,[...html.matchAll(/href="(\/[^"#]*)"/g)].map(m=>new URL(m[1],config.siteUrl).pathname));
 }
 const distance=new Map([['/',0]]),queue=['/'];
 while(queue.length){const page=queue.shift();for(const target of links.get(page)||[]){if(links.has(target)&&!distance.has(target)){distance.set(target,distance.get(page)+1);queue.push(target);}}}
 for(const route of routes)assert.ok(distance.get(route.path)<=3,route.path);
 assert.ok(!xml.includes('<lastmod>'),'Aucune date de build artificielle');
 assert.ok(sitemap(config,[{...routes[0],updated:'2026-09-19'}]).includes('<lastmod>2026-09-19</lastmod>'));
 for(const updated of ['2026-02-30','demain','2026-99-01'])assert.throws(()=>sitemap(config,[{...routes[0],updated}]));
});
test('Métadonnées échappées et page 404 sans application interactive',()=>{
 const html=metadata({...routes[0],title:'Un "titre" <script>'},config,true);
 assert.ok(html.includes('&quot;titre&quot; &lt;script&gt;'));
 const missing=renderPage(template,notFound,config,true);assert.ok(missing.includes('noindex'));assert.ok(!missing.includes('src="/app.js"'));
});
test('Aperçu de partage au format PNG 1200 × 630',async()=>{
 const png=await readFile(new URL('./assets/og-verbox.png',import.meta.url));
 assert.equal(png.subarray(1,4).toString(),'PNG');assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
});
test('Build statique : vraies pages, ressources et fichiers robots dans une sortie isolée',async()=>{
 const parent=await realpath(tmpdir());const dir=await mkdtemp(path.join(parent,'verbox-seo-test-'));
 try{
  const result=await buildSite({config,output:pathToFileURL(dir+path.sep)});assert.equal(result.indexable,routes.filter(r=>!r.noindex).length);
  const files=await readdir(dir,{recursive:true,withFileTypes:true});
  const snapshot=new Map();
  for(const file of files.filter(f=>f.isFile())){
   const name=path.join(file.parentPath||file.path,file.name);
   snapshot.set(name,await readFile(name));
  }
  await buildSite({config,output:pathToFileURL(dir+path.sep)});
  for(const [name,bytes]of snapshot)assert.deepEqual(await readFile(name),bytes,`Build non déterministe : ${name}`);
  const home=await readFile(path.join(dir,'index.html'),'utf8');assert.ok(home.includes('index, follow, max-image-preview:large'));
  // Validate the actual static artifact: GitHub Pages cannot run server.js.
  for(const route of routes){
   const html=await readFile(path.join(dir,route.path.slice(1),'index.html'),'utf8');
   assert.ok(html.includes('<h1'),route.path);
   for(const [,href]of html.matchAll(/(?:href|src)="(\/[^"#]*)"/g)){
    const pathname=new URL(href,config.siteUrl).pathname;
    const file=pathname.endsWith('/')?pathname+'index.html':pathname;
    assert.ok((await readFile(path.join(dir,file.slice(1)))).length,`Ressource manquante : ${href}`);
   }
  }
  assert.equal(await readFile(path.join(dir,'CNAME'),'utf8'),'verbox.example\n');
  assert.equal(await readFile(path.join(dir,'.nojekyll'),'utf8'),'');
  assert.ok((await readFile(path.join(dir,'404.html'),'utf8')).includes('noindex'));
  const lesson=await readFile(path.join(dir,'fiches','le-present','index.html'),'utf8');assert.ok(lesson.includes('Quand utiliser ce temps ?'));
  assert.ok((await readFile(path.join(dir,'sitemap.xml'),'utf8')).includes('https://verbox.example/'));
  const redirects=await readFile(path.join(dir,'_redirects'),'utf8');
  for(const route of routes)assert.ok(redirects.includes(`${route.path}index.html ${route.path} 301`));
  assert.ok(!(await readdir(dir)).includes('site.config.json'));assert.ok(!(await readdir(dir)).includes('design-preview.html'));
 }finally{
  const resolved=await realpath(dir);
  assert.equal(path.dirname(resolved),parent);assert.ok(path.basename(resolved).startsWith('verbox-seo-test-'));
  await rm(resolved,{recursive:true});
 }
});
test('HTTP : routes directes, redirections, vrais 404, robots et HEAD',async()=>{
 const server=createServer({config,production:true});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin=`http://127.0.0.1:${server.address().port}`;
 try{
  for(const route of routes){const response=await fetch(origin+route.path);assert.equal(response.status,200);const html=await response.text();assert.ok(html.includes('<h1'));assert.equal(response.headers.get('x-robots-tag'),route.noindex?'noindex, follow':null);}
  for(const url of ['/index.html','/fiches','/conjugaison-cm1/index.html']){const response=await fetch(origin+url,{redirect:'manual'});assert.equal(response.status,308);assert.ok(routes.some(r=>r.path===response.headers.get('location')));}
  const missing=await fetch(origin+'/page-absente/');assert.equal(missing.status,404);assert.equal(missing.headers.get('x-robots-tag'),'noindex, follow');
  assert.equal((await fetch(origin+'/design-preview.html')).status,404);
  const map=await fetch(origin+'/sitemap.xml');assert.equal(map.status,200);assert.match(map.headers.get('content-type'),/application\/xml/);
  const crawler=await fetch(origin+'/robots.txt');assert.equal(crawler.status,200);assert.ok((await crawler.text()).includes('Sitemap:'));
  const head=await fetch(origin+'/fiches/le-present/',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
  const privateFile=await fetch(origin+'/site.config.json');assert.equal(privateFile.status,404);
 }finally{await new Promise(resolve=>server.close(resolve));}
});
