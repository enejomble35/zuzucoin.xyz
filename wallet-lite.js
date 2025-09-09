/* ZUZU — Wallet layer (Phantom / Solflare / Backpack)
   - Desktop: provider varsa doğrudan connect()
   - Mobile: wallet'a deeplink (browse) -> wallet içi browser'da otomatik connect (#w=..)
   - Başarılı bağlanınca buton etiketi kısalır ve localStorage 'zuzu_pk' tutulur
*/
(function(){
  const ORIGIN = location.origin; // zuzucoin.xyz ise otomatik o
  const connectBtn = document.getElementById("connectBtn");

  // Eski modal/ekran altı kopyalar varsa temizle
  document.querySelectorAll(".wallet-modal-clone").forEach(n=>n.remove());

  function short(pk){ return pk.slice(0,4)+"…"+pk.slice(-4); }
  function setConnected(pk){
    localStorage.setItem("zuzu_pk", pk);
    if (connectBtn) { connectBtn.textContent = short(pk); connectBtn.classList.add("z-btn-ghost"); connectBtn.classList.remove("z-btn-primary"); }
    // modal kapat
    document.getElementById("walletModal")?.classList.remove("show");
    document.getElementById("walletModal")?.setAttribute("aria-hidden","true");
  }
  function cached(){ return localStorage.getItem("zuzu_pk"); }

  /* ---- Desktop/providers ---- */
  async function tryPhantom(force=false){
    if (window.phantom?.solana?.isPhantom) {
      try{
        const r = await window.phantom.solana.connect({ onlyIfTrusted: !force });
        if (r?.publicKey) return setConnected(r.publicKey.toString());
      }catch(_){}
      try{
        const r = await window.phantom.solana.connect();
        if (r?.publicKey) return setConnected(r.publicKey.toString());
      }catch(_){}
    } else {
      deeplink("phantom");
    }
  }
  async function trySolflare(){
    if (window.solflare?.connect) {
      try{
        await window.solflare.connect();
        const pk = window.solflare.publicKey?.toString?.();
        if (pk) return setConnected(pk);
      }catch(_){}
    } else {
      deeplink("solflare");
    }
  }
  async function tryBackpack(){
    if (window.backpack?.connect) {
      try{
        const r = await window.backpack.connect();
        const pk = r?.publicKey?.toString?.() || r?.[0];
        if (pk) return setConnected(pk);
      }catch(_){}
    } else {
      deeplink("backpack");
    }
  }

  /* ---- Mobile deeplink ---- */
  function deeplink(which){
    const target = `${ORIGIN}/#w=${which}`;
    const enc = encodeURIComponent(target);
    let url = "";
    if (which === "phantom")  url = `https://phantom.app/ul/browse/${enc}`;
    if (which === "solflare") url = `https://solflare.com/ul/v1/browse/${enc}`;
    if (which === "backpack") url = `https://www.backpack.app/ul/browse/${enc}`;
    if (!url) return;
    location.href = url;
  }

  // Modal içindeki butonlar
  document.getElementById("wPhantom") ?.addEventListener("click", ()=>tryPhantom(true));
  document.getElementById("wSolflare")?.addEventListener("click", trySolflare);
  document.getElementById("wBackpack")?.addEventListener("click", tryBackpack);

  // Sayfa wallet içi browser’da #w=... ile açıldıysa otomatik bağlan
  const hash = new URLSearchParams(location.hash.slice(1));
  const w = hash.get("w");
  if (w === "phantom")  tryPhantom(true);
  if (w === "solflare") trySolflare();
  if (w === "backpack") tryBackpack();

  // Güvenilir bağlantı varsa etiketle
  window.addEventListener("load", async ()=>{
    try{
      if (window.phantom?.solana?.isPhantom) {
        const r = await window.phantom.solana.connect({ onlyIfTrusted:true });
        if (r?.publicKey) return setConnected(r.publicKey.toString());
      }
    }catch(_){}
    try{
      if (window.solflare?.isSolflare) {
        await window.solflare.connect();
        if (window.solflare.publicKey) return setConnected(window.solflare.publicKey.toString());
      }
    }catch(_){}
    try{
      if (window.backpack?.isBackpack) {
        const r = await window.backpack.connect();
        const pk = r?.publicKey?.toString?.();
        if (pk) return setConnected(pk);
      }
    }catch(_){}
    const pk = cached(); if (pk) setConnected(pk);
  });

  // basit dış API (gerekirse)
  window.ZUZU_WALLET = {
    connect: { phantom: ()=>tryPhantom(true), solflare: trySolflare, backpack: tryBackpack },
    disconnect: ()=>{ localStorage.removeItem("zuzu_pk"); if(connectBtn){ connectBtn.textContent="Connect Wallet"; connectBtn.classList.add("z-btn-primary"); } }
  };
})();
