/* =========================================================
   Lightweight Solana wallet modal + deeplink connector
   Wallets: Phantom, Solflare, Backpack
   - Desktop: injected provider ile direct connect
   - Mobile: universal link ile uygulamaya aç, dönüşte auto-connect
========================================================= */
(function(){
  const APP_URL = "https://zuzucoin.xyz";
  const $  = (s,root=document)=>root.querySelector(s);

  let pubkey = null;

  // -------- Modal UI --------
  function ensureModal(){
    let m = $("#walletModal");
    if (m) return m;
    m = document.createElement("div");
    m.id = "walletModal";
    m.className = "wallet-modal";
    m.setAttribute("aria-hidden","true");
    m.innerHTML = `
      <div class="wm-backdrop"></div>
      <div class="wm-box">
        <div class="wm-head">
          <h3>Connect Wallet</h3>
          <button id="wmClose" aria-label="Close">✕</button>
        </div>
        <div class="wm-list">
          <button class="wm-item" id="wPhantom">
            <img src="assets/wallets/phantom.svg" alt="Phantom" loading="lazy"><span>Phantom</span>
          </button>
          <button class="wm-item" id="wSolflare">
            <img src="assets/wallets/solflare.svg" alt="Solflare" loading="lazy"><span>Solflare</span>
          </button>
          <button class="wm-item" id="wBackpack">
            <img src="assets/wallets/backpack.svg" alt="Backpack" loading="lazy"><span>Backpack</span>
          </button>
        </div>
        <p class="wm-note">If the app opens, approve <b>zuzucoin.xyz</b> to connect. You’ll be redirected back automatically.</p>
      </div>`;
    document.body.appendChild(m);
    m.querySelector("#wmClose").addEventListener("click", hide);
    m.querySelector(".wm-backdrop").addEventListener("click", hide);
    return m;
  }
  function show(){ const m=ensureModal(); m.classList.add("show"); m.setAttribute("aria-hidden","false"); }
  function hide(){ const m=$("#walletModal"); if(m){ m.classList.remove("show"); m.setAttribute("aria-hidden","true"); } }
  window.openWalletModal = show; // dışarı da sun

  function setConnected(pk){
    pubkey = pk || null;
    try { localStorage.setItem("zuzu_pubkey", pubkey || ""); } catch {}
    const btn = $("#connectBtn");
    if(btn){
      if (pubkey) {
        btn.textContent = pubkey.slice(0,4)+"..."+pubkey.slice(-4);
        btn.classList.add("connected");
      } else {
        btn.textContent = btn.dataset.iLabel || "Connect Wallet";
        btn.classList.remove("connected");
      }
    }
    if (pubkey) hide();
  }
  window.__zuzu_pubkey = () => pubkey || localStorage.getItem("zuzu_pubkey") || null;

  // -------- Provider try helpers (desktop ve dönüş sonrası) --------
  async function tryTrustedConnect(){
    // Phantom
    try{
      if (window.solana?.isPhantom) {
        const res = await window.solana.connect({ onlyIfTrusted:true });
        if (res?.publicKey) return setConnected(res.publicKey.toString());
      }
    }catch{}
    // Solflare
    try{
      if (window.solflare?.connect) {
        await window.solflare.connect({ onlyIfTrusted:true });
        if (window.solflare?.publicKey) return setConnected(window.solflare.publicKey.toString());
      }
    }catch{}
    // Backpack
    try{
      if (window.backpack?.connect) {
        const r = await window.backpack.connect({ onlyIfTrusted:true });
        const pk = (r?.publicKey || r)?.toString?.();
        if (pk) return setConnected(pk);
      }
    }catch{}
    return null;
  }

  // Sayfa geldiğinde ve geri görünür olduğunda otomatik dene
  ["load","pageshow","visibilitychange","focus"].forEach(evt=>{
    window.addEventListener(evt, ()=>{ if(evt!=="visibilitychange" || !document.hidden) tryTrustedConnect(); }, {passive:true});
  });

  // -------- Universal links (mobile) --------
  function deepLink(kind){
    const redirect = encodeURIComponent(APP_URL);
    const query    = `?app_url=${encodeURIComponent(APP_URL)}&redirect_link=${redirect}&dapp_enforce=true&cluster=mainnet-beta`;
    if (kind==="phantom")   return `https://phantom.app/ul/v1/connect${query}`;
    if (kind==="solflare")  return `https://solflare.com/ul/v1/connect${query}`;
    if (kind==="backpack")  return `https://backpack.app/ul/v1/connect${query}`;
    return "#";
  }

  // -------- Click handlers --------
  function wireButtons(){
    const bOpen = $("#connectBtn");
    bOpen?.addEventListener("click", (e)=>{
      e.preventDefault();
      show();
    });

    const bPh = $("#wPhantom");
    const bSf = $("#wSolflare");
    const bBp = $("#wBackpack");

    bPh?.addEventListener("click", async ()=>{
      try{
        if (window.solana?.isPhantom) {
          const res = await window.solana.connect();
          return setConnected(res?.publicKey?.toString());
        }
      }catch{}
      window.location.href = deepLink("phantom");
    });

    bSf?.addEventListener("click", async ()=>{
      try{
        if (window.solflare?.connect) {
          await window.solflare.connect();
          return setConnected(window.solflare?.publicKey?.toString());
        }
      }catch{}
      window.location.href = deepLink("solflare");
    });

    bBp?.addEventListener("click", async ()=>{
      try{
        if (window.backpack?.connect) {
          const r = await window.backpack.connect();
          const pk = (r?.publicKey || r)?.toString?.();
          if (pk) return setConnected(pk);
        }
      }catch{}
      window.location.href = deepLink("backpack");
    });
  }

  window.addEventListener("DOMContentLoaded", wireButtons);
})();
