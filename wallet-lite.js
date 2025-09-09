/* Lightweight Solana wallet layer (Phantom / Solflare / Backpack)
   - Desktop: provider varsa direkt connect()
   - Mobile: deeplink ile wallet in-app browser -> #connect=... paramı ile otomatik connect
   - Başarı: localStorage 'zuzu_pk', butonda kısaltılmış adres
*/
(function(){
  const APP_ORIGIN =
    location.hostname.endsWith("zuzucoin.xyz") ? "https://zuzucoin.xyz" : (location.origin);
  const qs = new URLSearchParams(location.search);
  const hash = new URLSearchParams(location.hash.replace(/^#/, ""));
  const connectBtn = document.getElementById("connectBtn");

  function short(pk){ return pk.slice(0,4)+"…"+pk.slice(-4); }

  function setConnected(pk){
    localStorage.setItem("zuzu_pk", pk);
    if(connectBtn){ connectBtn.textContent = short(pk); connectBtn.classList.remove("z-btn-primary"); connectBtn.classList.add("z-btn-ghost"); }
  }
  function clearConnected(){
    localStorage.removeItem("zuzu_pk");
    if(connectBtn){ connectBtn.textContent = "Connect Wallet"; connectBtn.classList.add("z-btn-primary"); }
  }

  async function connectPhantom(force=false){
    if(window.phantom?.solana){
      try{
        const res = await window.phantom.solana.connect({ onlyIfTrusted: !force ? true : false });
        if(res?.publicKey) return setConnected(res.publicKey.toString());
      }catch(e){}
      try{
        const res = await window.phantom.solana.connect();
        if(res?.publicKey) return setConnected(res.publicKey.toString());
      }catch(e){}
    }else{
      // mobile dış tarayıcı → deeplink ile phantom içi browser
      const url = window.__phantomBrowseURL?.("phantom", APP_ORIGIN) ||
                  `https://phantom.app/ul/browse/${encodeURIComponent(APP_ORIGIN+'/#connect=phantom')}`;
      location.href = url;
    }
  }
  async function connectSolflare(){
    if(window.solflare?.connect){
      try{
        await window.solflare.connect(); // mobil/desktop
        if(window.solflare?.publicKey) return setConnected(window.solflare.publicKey.toString());
      }catch(e){}
    }else{
      const url = window.__solflareBrowseURL?.(APP_ORIGIN) ||
                  `https://solflare.com/ul/v1/browse/${encodeURIComponent(APP_ORIGIN+'/#connect=solflare')}`;
      location.href = url;
    }
  }
  async function connectBackpack(){
    if(window.backpack?.connect){
      try{
        const r = await window.backpack.connect();
        const pk = (r?.publicKey?.toString?.()) || r?.[0];
        if(pk) return setConnected(pk);
      }catch(e){}
    }else{
      const url = window.__backpackBrowseURL?.(APP_ORIGIN) ||
                  `https://www.backpack.app/ul/browse/${encodeURIComponent(APP_ORIGIN+'/#connect=backpack')}`;
      location.href = url;
    }
  }

  // Modaldaki butonlar
  document.getElementById("wPhantom") ?.addEventListener("click", ()=>connectPhantom(true));
  document.getElementById("wSolflare")?.addEventListener("click", connectSolflare);
  document.getElementById("wBackpack")?.addEventListener("click", connectBackpack);

  // Sayfa wallet içinde #connect=.. ile açıldıysa otomatik bağlan
  if(hash.get("connect")==="phantom")  connectPhantom(true);
  if(hash.get("connect")==="solflare") connectSolflare();
  if(hash.get("connect")==="backpack") connectBackpack();

  // Desktop/Wallet içi: güvenilir bağlantı varsa otomatik label
  async function tryTrusted(){
    try{
      if(window.phantom?.solana?.isPhantom){
        const r = await window.phantom.solana.connect({ onlyIfTrusted:true });
        if(r?.publicKey) return setConnected(r.publicKey.toString());
      }
    }catch(e){}
    try{
      if(window.solflare?.isSolflare){ await window.solflare.connect(); if(window.solflare.publicKey) return setConnected(window.solflare.publicKey.toString()); }
    }catch(e){}
    try{
      if(window.backpack?.isBackpack){ const r = await window.backpack.connect(); const pk = r?.publicKey?.toString?.(); if(pk) return setConnected(pk); }
    }catch(e){}
    const cached = localStorage.getItem("zuzu_pk"); if(cached) setConnected(cached);
  }
  window.addEventListener("load", tryTrusted);

  // dışarıya basit API
  window.__wallet = {
    disconnect: clearConnected,
    connect: {
      phantom:  ()=>connectPhantom(true),
      solflare: ()=>connectSolflare(),
      backpack: ()=>connectBackpack()
    }
  };
})();
