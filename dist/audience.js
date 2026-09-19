export const OPTOUT_KEY = 'verbox-audience-optout-v1';

export function isOptedOut(storage, navigator) {
  if (navigator.globalPrivacyControl === true || navigator.doNotTrack === '1') return true;
  try { return storage.getItem(OPTOUT_KEY) === '1'; } catch { return true; }
}

export function trackingCommands(settings) {
  return [
    ['disableCookies'],
    ['disableBrowserFeatureDetection'],
    ['disableCampaignParameters'],
    ['disablePerformanceTracking'],
    ['setDoNotTrack', true],
    ['setTrackerUrl', settings.url + 'matomo.php'],
    ['setSiteId', settings.siteId],
    ['setRequestMethod', 'POST'],
    ['setCustomUrl', settings.pageUrl],
    ['setReferrerUrl', ''],
    ['setDocumentTitle', settings.pageTitle],
    ['trackPageView']
  ];
}

// Remove only legacy first-party Google Analytics cookies; leave learning data intact.
export function clearGoogleCookies(doc, location) {
  const names = doc.cookie.split(';').map(cookie => cookie.trim().split('=')[0])
    .filter(name => /^(_ga(?:_.+)?|_gid|_gat(?:_.+)?|_gac_.+|_gcl_.+)$/.test(name));
  const parts = location.hostname.split('.');
  const domains = ['', ...parts.map((_, i) => parts.slice(i).join('.'))];
  const paths = new Set(['/']);
  let path = '';
  for (const part of location.pathname.split('/').filter(Boolean)) {
    path += '/' + part;
    paths.add(path); paths.add(path + '/');
  }
  for (const name of names) for (const domain of domains) for (const path of paths) {
    doc.cookie = `${name}=; Max-Age=0; Path=${path}; SameSite=Lax${domain ? '; Domain=' + domain : ''}`;
  }
}

export function initAudience(win, doc) {
  clearGoogleCookies(doc, win.location);
  let storage;
  try { storage = win.localStorage; } catch { /* Block analytics if storage is inaccessible. */ }
  const configElement = doc.getElementById('audience-config');
  const settings = configElement ? JSON.parse(configElement.textContent) : null;
  const status = doc.getElementById('audience-status');
  const optout = doc.getElementById('audience-optout');
  const resume = doc.getElementById('audience-resume');
  const browserOptout = () => win.navigator.globalPrivacyControl === true || win.navigator.doNotTrack === '1';
  const update = () => {
    if (!status) return;
    status.textContent = browserOptout() ? 'Votre navigateur demande de ne pas être suivi. Cette préférence est respectée.'
      : isOptedOut(storage, win.navigator) ? 'La mesure d’audience est désactivée dans ce navigateur.'
      : settings ? 'Vous pouvez vous opposer à la mesure d’audience à tout moment.'
      : 'Aucune mesure d’audience n’est active actuellement. Vous pouvez déjà enregistrer votre opposition.';
    optout.hidden = isOptedOut(storage, win.navigator);
    resume.hidden = !isOptedOut(storage, win.navigator) || browserOptout();
  };
  const choose = disabled => {
    try {
      if (disabled) storage.setItem(OPTOUT_KEY, '1'); else storage.removeItem(OPTOUT_KEY);
      // The privacy page never loads Matomo. Other open tabs also stop on this change.
      update();
    } catch {
      status.textContent = 'Votre navigateur bloque l’enregistrement du choix. La mesure reste désactivée sur cette page. Activez « Ne pas me pister » pour appliquer ce choix aux prochaines visites.';
    }
  };
  optout?.addEventListener('click', () => choose(true));
  resume?.addEventListener('click', () => choose(false));
  if (optout) optout.hidden = false;
  update();
  let started = false;
  const stop = () => {
    if (started) {
      win._paq.push(['requireConsent']);
      win._paq.push(['disableHeartBeatTimer']);
    }
    update();
  };
  win.addEventListener('storage', event => {
    if (event.key === OPTOUT_KEY || event.key === null) {
      if (isOptedOut(storage, win.navigator)) stop(); else update();
    }
  });
  win.addEventListener('pageshow', () => { if (isOptedOut(storage, win.navigator)) stop(); });
  if (!settings?.pageUrl || win.location.origin !== new URL(settings.pageUrl).origin || isOptedOut(storage, win.navigator)) return;
  win._paq = trackingCommands(settings);
  const script = doc.createElement('script');
  script.async = true;
  script.src = settings.scriptUrl;
  script.referrerPolicy = 'no-referrer';
  // Defer the page view until the library is ready, and recheck opposition after loading.
  win._paq.pop();
  script.onload = () => {
    if (!isOptedOut(storage, win.navigator)) win._paq.push(['trackPageView']);
  };
  started = true;
  doc.head.appendChild(script);
}

if (typeof window !== 'undefined') initAudience(window, document);
