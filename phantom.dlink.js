// Phantom deeplink: wallet içi browser'da siteyi #connect=phantom ile aç
window.__phantomBrowseURL = function(_, APP_ORIGIN){
  const base = (APP_ORIGIN || (location.origin));
  return `https://phantom.app/ul/browse/${encodeURIComponent(base+'/#connect=phantom')}`;
};
