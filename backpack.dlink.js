window.__backpackBrowseURL = function(APP_ORIGIN){
  const base = APP_ORIGIN || location.origin;
  return `https://www.backpack.app/ul/browse/${encodeURIComponent(base+'/#connect=backpack')}`;
};
