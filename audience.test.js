import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { audienceConfig } from './audience-config.js';
import { OPTOUT_KEY, initAudience, trackingCommands, clearGoogleCookies } from './audience.js';
import { renderPage, routes } from './seo.js';
import { notFound } from './server.js';

const config = {siteUrl:'https://verbox.fr',privacy:{editorName:'Test',contactEmail:'contact@example.org'},audience:{enabled:true,cnilConfigurationVerified:true,matomoUrl:'https://stats.example.org/',siteId:'1'}};
const template = await readFile(new URL('./index.html', import.meta.url), 'utf8');
const settings = {...audienceConfig(config),pageUrl:'https://verbox.fr/',pageTitle:'Verbox'};

function browser({value=null,navigator={},data=settings,storageError=false,origin='https://verbox.fr'}={}) {
  const events={}, scripts=[];
  const nodes={};
  for (const name of ['audience-status','audience-optout','audience-resume']) {
    nodes[name]={hidden:true,addEventListener(type, fn){this[type]=fn;}};
  }
  nodes['audience-config']={textContent:JSON.stringify(data)};
  const win={navigator,location:{origin,hostname:'verbox.fr',pathname:'/'},addEventListener(name,fn){events[name]=fn;}};
  win.localStorage={getItem(){if(storageError)throw Error('blocked');return value;},setItem(key,v){assert.equal(key,OPTOUT_KEY);value=v;},removeItem(){value=null;}};
  const doc={cookie:'',getElementById(id){return nodes[id];},head:{appendChild(script){scripts.push(script);}},createElement(){return {};}};
  initAudience(win,doc);
  return {win,doc,events,scripts,nodes,setValue(v){value=v;}};
}

test('Activation requires verified configuration, editor and a real HTTPS endpoint',()=>{
  assert.equal(audienceConfig({}),null);
  for(const patch of [{cnilConfigurationVerified:false},{siteId:'0'},{siteId:'1&x=y'},{matomoUrl:'http://stats.example.org/'},{matomoUrl:'https://user:secret@stats.example.org/'},{matomoUrl:'https://stats.example.org/?token=secret'},{matomoUrl:'https://stats.example/'}]) {
    assert.throws(()=>audienceConfig({...config,audience:{...config.audience,...patch}}));
  }
  assert.throws(()=>audienceConfig({...config,privacy:{}}));
});

test('No external script when inactive, opted out, storage unavailable, DNT/GPC or preview origin',()=>{
  for(const opts of [{data:null},{value:'1'},{storageError:true},{navigator:{doNotTrack:'1'}},{navigator:{globalPrivacyControl:true}},{origin:'http://localhost:5173'},{data:{...settings,pageUrl:null}}]) {
    const state=browser(opts);assert.equal(state.scripts.length,0);assert.equal(state.win._paq,undefined);
  }
});

test('Matomo Cloud uses the supplied CDN while collection stays on the dedicated instance',()=>{
  const cloud = audienceConfig({...config,audience:{...config.audience,matomoUrl:'https://verbox.matomo.cloud/',matomoScriptUrl:'https://cdn.matomo.cloud/verbox.matomo.cloud/matomo.js'}});
  const b = browser({data:{...settings,...cloud}});
  assert.equal(b.scripts[0].src,'https://cdn.matomo.cloud/verbox.matomo.cloud/matomo.js');
  assert.deepEqual(b.win._paq.find(([command])=>command==='setTrackerUrl'),['setTrackerUrl','https://verbox.matomo.cloud/matomo.php']);
  for(const script of ['https://untrusted.example.org/matomo.js','https://cdn.matomo.cloud/other.matomo.cloud/matomo.js','http://cdn.matomo.cloud/verbox.matomo.cloud/matomo.js','https://cdn.matomo.cloud/verbox.matomo.cloud/matomo.js?extra=1']) {
    assert.throws(()=>audienceConfig({...config,audience:{...config.audience,matomoUrl:'https://verbox.matomo.cloud/',matomoScriptUrl:script}}));
  }
});

test('Only a sanitized page view is sent after loading; cookies and advanced tracking disabled first',()=>{
  const {scripts,win}=browser();
  assert.equal(scripts.length,1);
  assert.equal(scripts[0].src,'https://stats.example.org/matomo.js');
  assert.equal(scripts[0].referrerPolicy,'no-referrer');
  assert.ok(!win._paq.some(([command])=>command==='trackPageView'));
  scripts[0].onload();
  assert.deepEqual(win._paq,trackingCommands(settings));
  assert.equal(win._paq.filter(([c])=>c==='trackPageView').length,1);
});

test('Opposition during script loading prevents the queued page view, including another tab',()=>{
  const b=browser(); b.setValue('1'); b.events.storage({key:OPTOUT_KEY}); b.scripts[0].onload();
  assert.ok(!b.win._paq.some(([c])=>c==='trackPageView'));
  assert.ok(b.win._paq.some(([c])=>c==='requireConsent'));
});

test('Privacy controls persist opposition and respect browser privacy signals',()=>{
  const b=browser({data:null});b.nodes['audience-optout'].click();
  assert.match(b.nodes['audience-status'].textContent,/désactivée/);
  assert.equal(b.nodes['audience-resume'].hidden,false);
  b.nodes['audience-resume'].click();assert.match(b.nodes['audience-status'].textContent,/Aucune mesure/);
  assert.equal(browser({navigator:{globalPrivacyControl:true}}).nodes['audience-resume'].hidden,true);
});

test('Legacy Google cookies removed without touching unrelated cookies',()=>{
  const writes=[];
  const doc={get cookie(){return '_ga=one; _ga_NBXV7XE79Y=two; session=keep; preferences=keep';},set cookie(v){writes.push(v);}};
  clearGoogleCookies(doc,{hostname:'www.verbox.fr',pathname:'/fiches/le-present/'});
  assert.ok(writes.some(v=>v.includes('Domain=verbox.fr')));
  assert.ok(writes.every(v=>v.startsWith('_ga')&&v.includes('Max-Age=0')));
});

test('Every generated page has no Google loader; personal and privacy routes are never measured',async()=>{
  for(const route of [...routes,notFound]) {
    const html=renderPage(template,route,config,true);
    assert.doesNotMatch(html,/googletagmanager\.com|google-analytics\.com|fonts\.googleapis\.com|fonts\.gstatic\.com/);
    const data=JSON.parse(html.match(/id="audience-config">(.*?)<\/script>/)[1]);
    assert.equal(data.pageUrl,route.noindex?null:'https://verbox.fr'+route.path);
    assert.ok(html.includes('href="/confidentialite/"'));
  }
  const preview=renderPage(template,routes[0],config,false);
  assert.ok(preview.includes('id="audience-config">null</script>'));
  const disabled=renderPage(template,routes.find(r=>r.page==='confidentialite'),{siteUrl:'https://verbox.fr'},true);
  assert.match(disabled,/Aucune mesure d’audience n’est active/);
  assert.doesNotMatch(await readFile(new URL('./styles.css',import.meta.url),'utf8'),/fonts\.googleapis/);
});
