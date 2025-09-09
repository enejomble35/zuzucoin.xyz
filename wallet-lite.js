/* ==========================================================
   ZUZU Wallet (v4) – Phantom deep link handshake (MOBILE OK)
   • Phantom: Resmi ul/v1/connect akışı (şifreli)
     - Deeplink'e gider, onaydan sonra siteye geri döner
     - Geri dönüş query paramlarını çözer (NaCl + bs58)
     - Bağlandıysa Connect butonunda kısaltılmış adres yazar
   • Solflare / Backpack: önce injected, yoksa browse deeplink
   • Dış bağımlılıklar otomatik yüklenir (tweetnacl, bs58)
========================================================== */
(function () {
  const APP_URL = "https://zuzucoin.xyz";            // mağaza sayfaları için domainin
  const CLUSTER = "mainnet-beta";
  const PH_RET_MARK = "provider=phantom";
  const LS_KP  = "zuzu_phantom_dapp_keypair";        // dapp keypair (base58)
  const LS_SES = "zuzu_phantom_session";             // phantom session (base58)
  const LS_WAL = "zuzu_last_wallet";                 // phantom/solflare/backpack
  const BTN_ID = "connectBtn";

  // Public API
  window.ZUZU_WALLET = { open, isReady: () => true };

  /* -------------- utils -------------- */
  function byId(id){ return document.getElementById(id); }
  function short(pk){ return pk.slice(0,4)+"..."+pk.slice(-4); }
  function setConnected(pk){
    const b = byId(BTN_ID);
    if(b){ b.textContent = short(pk); b.classList.add("connected"); b.dataset.address = pk; }
    document.querySelector(".wallet-modal")?.remove();
    localStorage.removeItem(LS_WAL);
  }
  function loadScript(src){ return new Promise((res,rej)=>{ const s=document.createElement("script"); s.src=src; s.async=true; s.onload=res; s.onerror=rej; document.head.appendChild(s); }); }
  async function ensureCryptoLibs(){
    if(!window.nacl) await loadScript("https://unpkg.com/tweetnacl@1.0.3/nacl-fast.min.js");
    if(!window.bs58) await loadScript("https://unpkg.com/bs58@5.0.0/dist/bs58.min.js");
    if(window.nacl?.util) return;
    await loadScript("https://unpkg.com/tweetnacl-util@0.15.1/nacl-util.min.js"); // TextEncoder/Decoder helpers
  }

  /* -------------- Phantom deep link -------------- */
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
    // aynı sayfaya, provider işaretleyip dön
    const url = new URL(window.location.href);
    url.searchParams.set(PH_RET_MARK.split("=")[0], "1");
    return url.toString();
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
    // Phantom geri geldiğinde ?provider=phantom & data & phantom_encryption_public_key & nonce olur
    const sp = new URLSearchParams(window.location.search);
    if(!sp.has("provider") && !sp.has("phantom_encryption_public_key")) return false;

    if(sp.get("provider")==="phantom" || sp.has("phantom_encryption_public_key")){
      try{
        await ensureCryptoLibs();
        const dappKP  = getDappKeypair();
        const encPK   = bs58.decode(sp.get("phantom_encryption_public_key"));
        const nonce   = bs58.decode(sp.get("nonce"));
        const data    = bs58.decode(sp.get("data"));
        const shared  = nacl.scalarMult(dappKP.secretKey, encPK); // x25519
        const opened  = nacl.box.open.after(data, nonce, shared);
        if(!opened) throw new Error("decrypt failed");
        const json    = JSON.parse(nacl.util.encodeUTF8(opened));
        // json: { public_key, session } (ikisi de base58)
        if(json?.public_key){
          localStorage.setItem(LS_SES, json.session || "");
          setConnected(json.public_key);
          // URL’i temizle
          const clean = new URL(window.location.href);
          clean.search = ""; window.history.replaceState({}, "", clean.toString());
          return true;
        }
      }catch(e){
        console.warn("phantom return parse error", e);
      }
    }
    return false;
  }

  /* -------------- Solflare / Backpack (injected → browse) -------------- */
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

  /* -------------- Modal UI -------------- */
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
        <p class="note">On mobile, the wallet app will open. Approve <b>zuzucoin.xyz</b> and you'll be redirected back automatically.</p>
        <button class="wm-close" id="wmClose">✕</button>
      </div>`;
    document.body.appendChild(el);
    document.getElementById("wmClose").onclick = ()=>el.remove();

    // Phantom = doğrudan resmi connect akışı (garanti)
    document.getElementById("wPhantom").onclick = async ()=>{
      localStorage.setItem(LS_WAL, "phantom");
      // Masaüstünde extension varsa önce onu dene
      const inj = await tryInjected(); if(inj) return setConnected(inj);
      // Mobil/extension yok: resmi deeplink
      await deepLinkPhantom();
    };

    // Solflare / Backpack: injected → yoksa browse deeplink (eski davranış)
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

  /* -------------- otomatik yakalama: geri dönüş -------------- */
  (async function boot(){
    const captured = await handlePhantomReturn();
    if(captured) return; // bağlandı

    // wallet webview’inde açılırsa injected ile otomatik bağlanmayı dener
    const last = localStorage.getItem(LS_WAL);
    if(last){
      const t0 = Date.now();
      const tick = async ()=>{
        const inj = await tryInjected();
        if(inj) return setConnected(inj);
        if(Date.now()-t0 < 10000) setTimeout(tick, 600);
      };
      tick();
    }
  })();

})();
