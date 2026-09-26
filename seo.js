import { routes, renderContent, lessonPath } from './site-content.js';
import { audienceConfig } from './audience-config.js';
export { routes };
export const escapeHtml = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function publicOrigin(value, required=false) {
 if(!value){if(required)throw new Error('Renseigner siteUrl dans site.config.json ou SITE_URL avant le build de production.');return '';}
 const url=new URL(value);
 if(url.protocol!=='https:'||url.username||url.password||url.pathname!=='/'||url.search||url.hash||!url.hostname.includes('.')||url.hostname.endsWith('.localhost')||url.hostname==='localhost'||/^[\d.]+$/.test(url.hostname)||url.hostname.startsWith('['))throw new Error('SITE_URL doit être une origine HTTPS publique, sans chemin, paramètres ou identifiants.');
 return url.origin;
}
export function metadata(route, config, production=false) {
 const origin=publicOrigin(config.siteUrl,production);
 const indexable=production&&!route.noindex;
 const canonical=origin?`${origin}${route.path}`:'';
 const graph=origin?[{'@type':'WebSite','@id':`${origin}/#website`,url:`${origin}/`,name:'Verbox',inLanguage:'fr-FR'}, {'@type':'WebPage','@id':`${canonical}#webpage`,url:canonical,name:route.title,description:route.description,inLanguage:'fr-FR',isPartOf:{'@id':`${origin}/#website`}}]:[];
 if(origin&&route.page==='lecon')graph.push({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Accueil',item:`${origin}/`},{'@type':'ListItem',position:2,name:'Fiches de conjugaison',item:`${origin}/fiches/`},{'@type':'ListItem',position:3,name:route.title.split(' | ')[0],item:`${origin}${lessonPath(route.tense)}`} ]});
 if(origin&&['conjugaison','verbe'].includes(route.page))graph.push({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Accueil',item:`${origin}/`},{'@type':'ListItem',position:2,name:'Conjugaison',item:`${origin}/conjugaison/`},...(route.verb?[{'@type':'ListItem',position:3,name:route.verb,item:canonical}]:[])]});
 if(origin&&(route.level||['aide','apropos','mentions'].includes(route.page)))graph.push({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Accueil',item:`${origin}/`},{'@type':'ListItem',position:2,name:route.title.split(' | ')[0],item:canonical}]});
 return `<title>${escapeHtml(route.title)}</title>
  <meta name="description" content="${escapeHtml(route.description)}">
  <meta name="robots" content="${indexable?'index, follow, max-image-preview:large':'noindex, follow'}">
  ${canonical?`<link rel="canonical" href="${escapeHtml(canonical)}">`:''}
  <meta property="og:site_name" content="Verbox">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(route.title)}">
  <meta property="og:description" content="${escapeHtml(route.description)}">
  ${canonical?`<meta property="og:url" content="${escapeHtml(canonical)}"><meta property="og:image" content="${origin}/assets/og-verbox.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Verbox, conjugaison CE2, CM1, CM2 — exercices, points et défis chrono">`:''}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(route.title)}">
  <meta name="twitter:description" content="${escapeHtml(route.description)}">
  ${origin?`<meta name="twitter:image" content="${origin}/assets/og-verbox.png">`:''}
  ${route.path==='/'&&config.googleSiteVerification?`<meta name="google-site-verification" content="${escapeHtml(config.googleSiteVerification)}">`:''}
  ${route.path==='/'&&config.bingSiteVerification?`<meta name="msvalidate.01" content="${escapeHtml(config.bingSiteVerification)}">`:''}
  ${graph.length?`<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c')}</script>`:''}`;
}
export function renderPage(template,route,config,production=false) {
 const audience=audienceConfig(config);
 const clientConfig=production&&audience ? {...audience,pageUrl:route.noindex?null:publicOrigin(config.siteUrl,true)+route.path,pageTitle:route.title} : null;
 template=template.replace('<!-- AUDIENCE_CONFIG -->',`<script type="application/json" id="audience-config">${JSON.stringify(clientConfig).replace(/</g,'\\u003c')}</script>`);
 if(['404','confidentialite','apropos','mentions','conjugaison','verbe'].includes(route.page)) {
  template=template.replace(/<script type="module" src="\/app\.js(?:\?[^"]*)?"><\/script>/,'')
   .replace(/<div class="topbar-right">[\s\S]*?<\/div>/,'<div class="topbar-right"></div>')
   .replace(/<dialog id="quiz-dialog"[\s\S]*?<\/dialog>/,'')
   .replace(/<dialog id="wardrobe-dialog"[\s\S]*?<\/dialog>/,'')
   .replace(/<div id="toast"[\s\S]*?<\/div>/,'')
   .replace('class="nav-item active"','class="nav-item"');
 }
 const navPage=route.page==='accueil'?'accueil':route.page==='progres'?'progres':(route.page==='fiches'||route.page==='lecon')?'fiches':null;
 if(navPage)template=template.replace(`class="nav-item" data-page="${navPage}"`,`class="nav-item active" aria-current="page" data-page="${navPage}"`);
 const pageLabels={accueil:'Mon entraînement',progres:'Mes progrès',fiches:'Mes fiches mémo',aide:'Comment ça marche ?',lecon:'Fiches de conjugaison',apropos:'À propos',mentions:'Mentions légales',confidentialite:'Confidentialité',conjugaison:'Conjugaison',verbe:'Conjugaison'};
 if(pageLabels[route.page])template=template.replace('id="page-label">Mon entraînement',`id="page-label">${pageLabels[route.page]}`);
 return template.replace(/<!-- SEO_START -->[\s\S]*?<!-- SEO_END -->/,`<!-- SEO_START -->${metadata(route,config,production)}<!-- SEO_END -->`)
 .replace('<body>',`<body data-page="${route.page}" data-level="${route.level||''}" data-tense="${route.tense||''}">`)
 .replace(/<main id="main" tabindex="-1">[\s\S]*?<\/main>/,`<main id="main" tabindex="-1">${renderContent(route,config)}</main>`)
 .replace(/[ \t]+$/gm,'');
}
export function robots(config,production=false) {
 const origin=publicOrigin(config.siteUrl,production);
 // noindex pages remain crawlable so crawlers can read their directive.
 return `User-agent: *\nAllow: /\n${production?`\nSitemap: ${origin}/sitemap.xml\n`:'# Aperçu local : pages noindex, aucun sitemap public.\n'}`;
}
export function sitemap(config, pageRoutes=routes) {
 const origin=publicOrigin(config.siteUrl,true);
 return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pageRoutes.filter(r=>!r.noindex).map(r=>{
  if(r.updated&&(!/^\d{4}-\d{2}-\d{2}$/.test(r.updated)||!Number.isFinite(Date.parse(r.updated))||new Date(r.updated).toISOString().slice(0,10)!==r.updated))throw new Error('Date de mise à jour de route invalide.');
  return `  <url><loc>${escapeHtml(origin+r.path)}</loc>${r.updated?`<lastmod>${r.updated}</lastmod>`:''}</url>`;
 }).join('\n')}\n</urlset>\n`;
}
