window.__solflareBrowseURL = function(APP_ORIGIN){
  const base = APP_ORIGIN || location.origin;
  return `https://solflare.com/ul/v1/browse/${encodeURIComponent(base+'/#connect=solflare')}`;
};
