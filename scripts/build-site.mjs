import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {routes,renderPage,robots,sitemap,publicOrigin} from '../seo.js';
import {loadConfig,publicFiles,notFound} from '../server.js';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=new URL('../',import.meta.url);
export function versionImports(code, version) {
 return code
  .replace(/\b(from|import)(\s+)(['"])(\.\/[^'"]+?\.js)(?:\?[^'"]*)?\3/g, `$1$2$3$4?v=${version}$3`)
  .replace(/\bimport\(\s*(['"])(\.\/[^'"]+?\.js)(?:\?[^'"]*)?\1\s*\)/g, `import($1$2?v=${version}$1)`);
}
export async function buildSite({config,output=new URL('dist/',root)}) {
publicOrigin(config.siteUrl,true);
const pkg=JSON.parse(await readFile(new URL('package.json',root),'utf8'));
const version=pkg.version;
const rawTemplate=await readFile(new URL('index.html',root),'utf8');
const template=rawTemplate.replace(/(href|src)="(\/[^"?#]+\.(?:css|js))(?:\?[^"]*)?"/g,`$1="$2?v=${version}"`);
await mkdir(output,{recursive:true});
for(const route of routes){const dir=new URL(`.${route.path}`,output);await mkdir(dir,{recursive:true});await writeFile(new URL('index.html',dir),renderPage(template,route,config,true));}
for(const file of publicFiles){
 const target=new URL(file,output);
 await mkdir(new URL('.',target),{recursive:true});
 if(file.endsWith('.js')){
  const content=await readFile(new URL(file,root),'utf8');
  await writeFile(target,versionImports(content,version));
 }else{
  await copyFile(new URL(file,root),target);
 }
}
await writeFile(new URL('404.html',output),renderPage(template,notFound,config,true));
await writeFile(new URL('robots.txt',output),robots(config,true));
await writeFile(new URL('sitemap.xml',output),sitemap(config));
await writeFile(new URL('.nojekyll',output),'');
await writeFile(new URL('CNAME',output),new URL(config.siteUrl).hostname+'\n');
await writeFile(new URL('_headers',output),'/*\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()\n  Content-Security-Policy: upgrade-insecure-requests; default-src \'self\'; script-src \'self\' https://cdn.matomo.cloud; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data: https://verbox.matomo.cloud; connect-src \'self\' https://verbox.matomo.cloud; font-src \'self\'; object-src \'none\'; base-uri \'self\'; form-action \'self\'; frame-ancestors \'none\';\n/progres/*\n  X-Robots-Tag: noindex, follow\n/404.html\n  X-Robots-Tag: noindex, follow\n');
await writeFile(new URL('_redirects',output),routes.map(r=>`${r.path}index.html ${r.path} 301`).join('\n')+'\n/* /404.html 404\n');
return {pages:routes.length,indexable:routes.filter(r=>!r.noindex).length};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const result=await buildSite({config:await loadConfig()});console.log(`Verbox : ${result.pages} pages générées dans dist/, dont ${result.indexable} dans le sitemap.`);
}
