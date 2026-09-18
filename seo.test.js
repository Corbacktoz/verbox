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
 for(const route of routes){
  const html=renderPage(template,route,config,true);
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,route.path);
  assert.equal((html.match(/<title>/g)||[]).length,1);
  assert.ok(html.includes(`rel="canonical" href="${config.siteUrl}${route.path}"`));
  assert.ok(html.includes(route.noindex?'content="noindex, follow"':'content="index, follow, max-image-preview:large"'));
  assert.ok(html.includes('src="/app.js"'));
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
test('Sitemap : seulement les 12 URL publiques canoniques ; robots autorise les ressources',()=>{
 const xml=sitemap(config);assert.equal((xml.match(/<loc>/g)||[]).length,12);
 assert.ok(!xml.includes('/progres/')&&!xml.includes('design-preview'));
 for(const [,loc]of xml.matchAll(/<loc>(.*?)<\/loc>/g))assert.equal(new URL(loc).search,'');
 const text=robots(config,true);assert.ok(text.includes('User-agent: *\nAllow: /'));assert.ok(text.includes('Sitemap: https://verbox.example/sitemap.xml'));assert.ok(!text.includes('Disallow: /progres'));
});
test('L’aperçu ne devient pas indexable et la production exige un domaine HTTPS',()=>{
 const html=renderPage(template,routes[0],{siteUrl:''},false);
 assert.ok(html.includes('noindex, follow'));assert.ok(!html.includes('rel="canonical"'));
 assert.ok(!robots({siteUrl:''},false).includes('Sitemap:'));
 assert.throws(()=>publicOrigin('',true));
 for(const bad of ['http://verbox.example','https://localhost','https://127.0.0.1','https://verbox.example/sous-dossier','https://user:pass@verbox.example'])assert.throws(()=>publicOrigin(bad,true));
 assert.equal(publicOrigin('https://verbox.example/'),'https://verbox.example');
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
  const result=await buildSite({config,output:pathToFileURL(dir+path.sep)});assert.equal(result.indexable,12);
  const home=await readFile(path.join(dir,'index.html'),'utf8');assert.ok(home.includes('index, follow, max-image-preview:large'));
  const lesson=await readFile(path.join(dir,'fiches','le-present','index.html'),'utf8');assert.ok(lesson.includes('Quand utiliser ce temps ?'));
  assert.ok((await readFile(path.join(dir,'sitemap.xml'),'utf8')).includes('https://verbox.example/'));
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
