import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { routes, renderPage, robots, sitemap, publicOrigin } from './seo.js';

const root=fileURLToPath(new URL('.',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
export const publicFiles=['styles.css','app.js','core.js','learning.js','site-content.js','audience.js','audience-config.js','privacy-content.js','design-tokens.css','design-system.css','assets/favicon.svg','assets/og-verbox.png'];
export const notFound={path:'/404.html',page:'404',noindex:true,title:'Page introuvable | Verbox',description:'Cette page Verbox n’existe pas. Retrouve les exercices et les fiches de conjugaison depuis l’accueil.'};
export async function loadConfig(){const config=JSON.parse(await readFile(path.join(root,'site.config.json'),'utf8'));if(process.env.SITE_URL)config.siteUrl=process.env.SITE_URL;return config;}
export function createServer({config,production=false}={}) {
 if(production)publicOrigin(config?.siteUrl,true);
 return http.createServer(async(req,res)=>{
  try{
   const options=config||await loadConfig();
   const url=new URL(req.url,'http://localhost');
   let pathname;
   try{pathname=decodeURIComponent(url.pathname);}catch{res.writeHead(400);res.end('Adresse incorrecte');return;}
   res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
   if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});res.end();return;}
   const send=(status,type,body,noindex=false)=>{res.setHeader('Content-Type',type);res.setHeader('Cache-Control','no-cache');if(!production||noindex)res.setHeader('X-Robots-Tag','noindex, follow');res.writeHead(status);res.end(req.method==='HEAD'?undefined:body);};
   const normalized=pathname.endsWith('/index.html')?pathname.slice(0,-10):!pathname.endsWith('/')?`${pathname}/`:pathname;
   if(pathname!==normalized&&routes.some(r=>r.path===normalized)){res.writeHead(308,{'Location':normalized+url.search});res.end();return;}
   if(pathname==='/robots.txt'){send(200,'text/plain; charset=utf-8',robots(options,production));return;}
   if(pathname==='/sitemap.xml'&&production){send(200,'application/xml; charset=utf-8',sitemap(options));return;}
   const file=pathname.slice(1);
   if(publicFiles.includes(file)||(!production&&file==='design-preview.html')){
    const data=await readFile(path.join(root,file));send(200,types[path.extname(file)]||'application/octet-stream',data,file==='design-preview.html');return;
   }
   const route=routes.find(r=>r.path===pathname);
   const template=await readFile(path.join(root,'index.html'),'utf8');
   send(route?200:404,'text/html; charset=utf-8',renderPage(template,route||notFound,options,production),!route||route.noindex);
  }catch(error){console.error(error.message);res.writeHead(500,{'Content-Type':'text/plain; charset=utf-8','X-Robots-Tag':'noindex'});res.end('Impossible de charger cette page.');}
 });
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const production=process.env.NODE_ENV==='production';const port=Number(process.env.PORT)||5173;
 const config=await loadConfig();createServer({config,production}).listen(port,'127.0.0.1',()=>console.log(`Verbox disponible sur http://localhost:${port} (${production?'production':'aperçu non indexable'})`));
}
