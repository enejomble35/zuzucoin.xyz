/* ==========================================================
   ZUZU Wallet (v4.1)
   • Phantom (MOBİL): Resmi deep link connect akışı (şifreli)
     FIX: shared key = nacl.box.before(peerPublicKey, mySecretKey)
   • Solflare / Backpack: injected → yoksa browse deeplink
   • Dış bağımlılıklar otomatik yüklenir (tweetnacl, bs58, util)
========================================================== */
(function () {
  const APP_URL = "https://zuzucoin.xyz";
  const CLUSTER = "mainnet-beta";
  const LS_KP  = "zuzu_phantom_dapp_keypair";
  const LS_SES = "zuzu_phantom_session";
  const LS_WAL = "zuzu_last_wallet";
  const BTN_ID = "connectBtn";

  window.ZUZU_WALLET = { open, isReady: () => true };

  /* ---------- helpers ---------- */
  function byId(id){ return document.getElementById(id); }
  function short(pk){ return pk.slice(0,4)+"..."+pk.slice(-4); }
  function setConnected(pk){
    const b = byId(BTN_ID);
    if(b){ b.textContent = short(pk); b.classList.add("connected"); b.dataset.address = pk; }
    document.querySelector(".wallet-modal")?.remove();
    localStorage.removeItem(LS_WAL);
  }
  function loadScript(src){ return new Promise((ok,err)=>{ const s=document.createElement("script"); s.src=src; s.async=true; s.onload=ok; s.onerror=err; document.head.appendChild(s); }); }
  async function ensureCryptoLibs(){
    if(!window.nacl)  await loadScript("https://unpkg.com/tweetnacl@1.0.3/nacl-fast.min.js");
    if(!window.bs58)  await loadScript("https://unpkg.com/bs58@5.0.0/dist/bs58.min.js");
    if(!nacl.util)    await loadScript("https://unpkg.com/tweetnacl-util@0.15.1/nacl-util.min.js");
  }

  /* ---------- Phantom deep link ---------- */
  function getDappKeypair(){
    const saved = localStorage.getItem(LS_KP);
    if(saved){
      try{
        const obj = JSON.parse(saved);
        return { publicKey: bs58.decode(obj.pub), secretKey: bs58.decode(obj.sec) };
      }catch{}
    }
    const kp = nacl.box.keyPair();
    localStorage.setItem(LS_KP, JSON.stringify({
      pub: bs58.encode(kp.publicKey),
      sec: bs58.encode(kp.secretKey),
    }));
    return kp;
  }
  function currentReturnUrl(){
    const u = new URL(window.location.href);
    // Phantom dönüş paramları çok uzun olabilir; query’i boş bırakıp sadece provider işareti eklemiyoruz,
    // çünkü tespit için phantom_encryption_public_key yeterli.
    return u.toString();
  }
  async function deepLinkPhantom(){
    await ensureCryptoLibs();
    const kp = getDappKeypair();
    const params = new URLSearchParams({
      app_url: APP_URL,
      dapp_encryption_public_key: bs58.encode(kp.publicKey),
      cluster: CLUSTER,
      redirect_link: currentReturnUrl(),
    });
    localStorage.setItem(LS_WAL, "phantom");
    window.location.href = `https://phantom.app/ul/v1/connect?${params.toString()}`;
  }

  async function handlePhantomReturn(){
    const sp = new URLSearchParams(window.location.search);
    if(!sp.has("phantom_encryption_public_key")) return false;
    try{
      await ensureCryptoLibs();
      const dappKP  = getDappKeypair();
      const peerPK  = bs58.decode(sp.get("phantom_encryption_public_key"));
      const nonce   = bs58.decode(sp.get("nonce"));
      const data    = bs58.decode(sp.get("data"));
      // *** FIX: doğru shared secret hesaplama
      const shared  = nacl.box.before(peerPK, dappKP.secretKey);
      const opened  = nacl.box.open.after(data, nonce, shared);
      if(!opened) throw new Error("decrypt failed");
      const payload = JSON.parse(nacl.util.encodeUTF8(opened));
      // payload -> { public_key, session }
      if(payload?.public_key){
        if(payload.session) localStorage.setItem(LS_SES, payload.session);
        setConnected(payload.public_key);
        // URL’i temizle (paramları kaldır)
        const clean = new URL(window.location.href);
        clean.search = ""; window.history.replaceState({}, "", clean.toString());
        return true;
      }
    }catch(e){
      console.warn("phantom return parse error", e);
      alert("Wallet module not loaded.\n(Phantom return parse error)");
    }
    return false;
  }

  /* ---------- Solflare / Backpack (injected → browse) ---------- */
  async function tryInjected(){
    try{
      const p = window.solana || window?.phantom?.solana;
      if(p?.isPhantom){ const r = await p.connect({ onlyIfTrusted:false }); if(r?.publicKey) return r.publicKey.toString(); }
    }catch{}
    try{
      const s = window.solflare; if(s?.connect){ await s.connect(); const pk=s?.publicKey?.toString?.(); if(pk) return pk; }
    }catch{}
    try{
      const b = window.backpack; if(b?.connect){ const r=await b.connect(); const pk=r?.publicKey?.toString?.()||r?.[0]; if(pk) return pk; }
    }catch{}
    return null;
  }
  function browseLink(wallet){
    if(wallet==="phantom")  return `https://phantom.app/ul/browse/${encodeURIComponent(APP_URL)}`;
    if(wallet==="solflare") return `https://solflare.com/ul/v1/browse/${encodeURIComponent(APP_URL)}`;
    if(wallet==="backpack") return `https://backpack.app/ul/browse/${encodeURIComponent(APP_URL)}`;
    return APP_URL;
  }

  /* ---------- Modal UI ---------- */
  function open(){
    const el = document.createElement("div");
    el.className = "wallet-modal";
    el.innerHTML = `
      <div class="wallet-backdrop" onclick="this.parentNode.remove()"></div>
      <div class="wallet-box">
        <h3>Connect Wallet</h3>
        <div class="wallet-grid">
          <button class="wallet-item" id="wPhantom">
            <img src="assets/wallets/phantom.svg" onerror="this.onerror=null;this.src='assets/wallets/phantom.png'"><span>Phantom</span>
          </button>
          <button class="wallet-item" id="wSolflare">
            <img src="assets/wallets/solflare.svg" onerror="this.onerror=null;this.src='assets/wallets/solflare.png'"><span>Solflare</span>
          </button>
          <button class="wallet-item" id="wBackpack">
            <img src="assets/wallets/backpack.svg" onerror="this.onerror=null;this.src='assets/wallets/backpack.png'"><span>Backpack</span>
          </button>
        </div>
        <p class="note">On mobile, the wallet app will open. Approve <b>zuzucoin.xyz</b> and you'll be connected automatically.</p>
        <button class="wm-close" id="wmClose">✕</button>
      </div>`;
    document.body.appendChild(el);
    document.getElementById("wmClose").onclick = ()=>el.remove();

    document.getElementById("wPhantom").onclick = async ()=>{
      localStorage.setItem(LS_WAL, "phantom");
      const inj = await tryInjected(); if(inj) return setConnected(inj);
      await deepLinkPhantom();
    };
    document.getElementById("wSolflare").onclick = async ()=>{
      localStorage.setItem(LS_WAL, "solflare");
      const inj = await tryInjected(); if(inj) return setConnected(inj);
      window.location.href = browseLink("solflare");
    };
    document.getElementById("wBackpack").onclick = async ()=>{
      localStorage.setItem(LS_WAL, "backpack");
      const inj = await tryInjected(); if(inj) return setConnected(inj);
      window.location.href = browseLink("backpack");
    };
  }

  /* ---------- boot: geri dönüşü yakala ---------- */
  (async function boot(){
    const captured = await handlePhantomReturn();
    if(captured) return; // bağlandı

    // Wallet webview içinde isek injected ile otomatik bağlanmayı dene
    const last = localStorage.getItem(LS_WAL);
    if(last){
      const t0 = Date.now();
      const tick = async ()=>{
        const inj = await tryInjected();
        if(inj) return setConnected(inj);
        if(Date.now()-t0 < 12000) setTimeout(tick, 700);
      };
      tick();
    }
  })();
})();
