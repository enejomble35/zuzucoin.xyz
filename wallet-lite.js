/* ------------------------------------------------------
   ZUZU — Solana Wallet Connect (Phantom / Solflare / Backpack)
   - Desktop: injected provider ile bağlanır
   - Mobile: in-app browser (browse deep link) → auto connect
   - Bağlanınca butonda kısaltılmış adres gösterilir
------------------------------------------------------ */
(function () {
  const APP_HOST = location.host;                // "zuzucoin.xyz"
  const APP_URL  = location.origin;              // "https://zuzucoin.xyz"
  const EXPECT   = "__zuzu_expect_wallet";
  const STORE_PK = "__zuzu_pubkey";

  // --- ikonlar mutlak path; preload
  ["/assets/wallets/phantom.svg","/assets/wallets/solflare.svg","/assets/wallets/backpack.svg"]
    .forEach(src=>{ const i=new Image(); i.src=src; });

  const qs = (s)=>document.querySelector(s);
  const connectBtn = qs("#connectBtn");

  // Modal HTML
  const modal = document.createElement("div");
  modal.id = "walletModal";
  modal.className = "wallet-modal";
  modal.innerHTML = `
    <div class="wallet-backdrop" id="wmBackdrop"></div>
    <div class="wallet-box">
      <div class="wallet-head">
        <h3 data-i="connect">Connect Wallet</h3>
        <button id="wmClose" class="wm-x" aria-label="Close">×</button>
      </div>
      <div class="wallet-grid">
        <button id="wPhantom"  class="wallet-item">
          <img src="/assets/wallets/phantom.svg" alt="Phantom"><span>Phantom</span>
        </button>
        <button id="wSolflare" class="wallet-item">
          <img src="/assets/wallets/solflare.svg" alt="Solflare"><span>Solflare</span>
        </button>
        <button id="wBackpack" class="wallet-item">
          <img src="/assets/wallets/backpack.svg" alt="Backpack"><span>Backpack</span>
        </button>
      </div>
      <p class="note">On mobile, the site opens <b>inside the wallet</b>. Approve connection there. If you return to the external browser, the wallet is not available by design.</p>
    </div>
  `;
  document.body.appendChild(modal);

  const close  = ()=>modal.classList.remove("show");
  const open   = ()=>modal.classList.add("show");
  qs("#wmClose")?.addEventListener("click", close);
  qs("#wmBackdrop")?.addEventListener("click", close);
  connectBtn?.addEventListener("click", open);

  function setConnected(pk){
    if(!pk) return;
    localStorage.setItem(STORE_PK, pk);
    if(connectBtn){
      connectBtn.textContent = pk.slice(0,4)+"..."+pk.slice(-4);
      connectBtn.classList.add("connected");
    }
    close();
  }
  // restore kısa etiket
  (function restore(){
    const pk=localStorage.getItem(STORE_PK);
    if(pk && connectBtn){
      connectBtn.textContent=pk.slice(0,4)+"..."+pk.slice(-4);
      connectBtn.classList.add("connected");
    }
  })();

  // ---- ortak provider bul
  function provider(){
    return (
      window.solana ||
      window.phantom?.solana ||
      window.backpack?.solana ||
      window.solflare || null
    );
  }

  // ---- masaüstü injected dene
  async function connectInjected(){
    const p = provider();
    if(!p) return null;
    try{
      const res = await p.connect({ onlyIfTrusted:false });
      const pk  = (res?.publicKey?.toString?.()||p.publicKey?.toString?.()||res?.publicKey||"");
      if(pk) setConnected(pk);
      return pk;
    }catch(e){ console.warn("Injected rejected", e); return null; }
  }

  // ---- mobil browse deeplink (in-app browser açar)
  function openInWallet(app){
    localStorage.setItem(EXPECT, "1");
    let url = "";
    if(app==="phantom")  url = `https://phantom.app/ul/browse/${APP_HOST}`;
    if(app==="solflare") url = `https://solflare.com/ul/v1/browse/${APP_HOST}`;
    if(app==="backpack") url = `https://backpack.app/ul/browse/${APP_HOST}`;
    location.href = url;
  }

  qs("#wPhantom") ?.addEventListener("click", async ()=>{ const ok=await connectInjected(); if(!ok) openInWallet("phantom"); });
  qs("#wSolflare")?.addEventListener("click", async ()=>{ const ok=await connectInjected(); if(!ok) openInWallet("solflare"); });
  qs("#wBackpack")?.addEventListener("click", async ()=>{ const ok=await connectInjected(); if(!ok) openInWallet("backpack"); });

  // ---- wallet in-app içinde otomatik bağlan
  async function autoConnect(){
    if(!localStorage.getItem(EXPECT)) return;
    const p = provider();
    if(!p) return;
    try{
      const res = await p.connect({ onlyIfTrusted:false });
      const pk  = (res?.publicKey?.toString?.()||p.publicKey?.toString?.()||res?.publicKey||"");
      if(pk){
        setConnected(pk);
        localStorage.removeItem(EXPECT);
      }
    }catch(e){ console.warn("autoConnect fail", e); }
  }
  // provider geç gelebilir → bir süre dene + görünürlük değişiminde de dene
  let tries=0;
  const iv=setInterval(()=>{ tries++; autoConnect(); if(tries>60) clearInterval(iv); }, 800);
  document.addEventListener("visibilitychange", ()=>{ if(!document.hidden) autoConnect(); });

  // dışarıya kısa util
  window.__zuzu_pk = ()=> localStorage.getItem(STORE_PK)||"";
})();
