// Activation requires an actual, reviewed Matomo instance, never a placeholder.
export function audienceConfig(config) {
  const settings = config.audience;
  if (!settings?.enabled) return null;
  if (settings.cnilConfigurationVerified !== true) {
    throw new Error('Vérifier la configuration CNIL de Matomo avant d’activer la mesure d’audience.');
  }
  if (!config.privacy?.editorName?.trim() || !config.privacy?.contactEmail?.trim()) {
    throw new Error('Renseigner l’éditeur et le contact avant d’activer Matomo.');
  }
  const url = new URL(settings.matomoUrl);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || !url.hostname.includes('.') || url.hostname.endsWith('.example') || url.hostname.endsWith('.localhost') || /^[\d.]+$/.test(url.hostname) || url.hostname.startsWith('[')) {
    throw new Error('Matomo doit utiliser une adresse HTTPS publique, sans identifiants ni paramètres.');
  }
  if (!/^[1-9]\d*$/.test(String(settings.siteId))) throw new Error('Identifiant de site Matomo invalide.');
  return { url: url.href.replace(/\/?$/, '/'), siteId: String(settings.siteId) };
}
