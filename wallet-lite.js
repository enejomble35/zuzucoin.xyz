/* wallet-lite.js — Mobile solid flow (browse→connect) + desktop extension */
(function () {
  const connectBtn = document.getElementById("connectBtn");
  let pubkey = null;

  function short(pk){ return pk ? pk.slice(0,4)+"..."+pk.slice(-4) : "Connect Wallet"; }
  function setConnected(pk){
    pubkey = pk;
    if (connectBtn) connectBtn.textContent = short(pk);
    // callback isteyen bölümler için
    window.dispatchEvent(new CustomEvent("zuzu:wallet-connected",{detail:{pubkey:pk}}));
  }
  window.__zuzu_pk = () => pubkey;

  // --- Helpers -------------------------------------------------------------
  const HERE = location.href.split("#")[0];
  const BROWSE = {
    phantom:  "https://phantom.app/ul/browse/" + encodeURIComponent(HERE),
    solflare: "https://solflare.com/ul/v1/browse/" + encodeURIComponent(HERE),
    backpack: "https://www.backpack.app/ul/browse/" + encodeURIComponent(HERE)
  };

  async function tryConnectAll(ask=false){
    // Phantom
    try{
      if (window.solana?.isPhantom){
        const r = await window.solana.connect({ onlyIfTrusted: !ask ? true : false });
        if (r?.publicKey) return setConnected(r.publicKey.toString());
      }
    }catch{}
    // Solflare (wallet-standard)
    try{
      if (window.solflare?.connect){
        await window.solflare.connect();
        const pk = window.solflare.publicKey?.toString?.();
        if (pk) return setConnected(pk);
      }
    }catch{}
    // Backpack (wallet-standard)
    try{
      if (window.backpack?.connect){
        const r = await window.backpack.connect();
        const pk = (r?.publicKey||r)?.toString?.();
        if (pk) return setConnected(pk);
      }
    }catch{}
  }

  function openModal(){
    const wrap = document.createElement("div");
    wrap.className = "wallet-modal";
    wrap.innerHTML = `
      <div class="wallet-backdrop"></div>
      <div class="wallet-box">
        <button class="wallet-close" id="wmClose">×</button>
        <h3>Connect Wallet</h3>
        <div class="wallet-grid">
          <a id="wPhantom" class="wallet-item" href="#">
            <img src="assets/wallets/phantom.svg" alt="Phantom"><span>Phantom</span>
          </a>
          <a id="wSolflare" class="wallet-item" href="#">
            <img src="assets/wallets/solflare.svg" alt="Solflare"><span>Solflare</span>
          </a>
          <a id="wBackpack" class="wallet-item" href="#">
            <img src="assets/wallets/backpack.svg" alt="Backpack"><span>Backpack</span>
          </a>
        </div>
        <p class="wallet-note">If the app opens, approve <b>zuzucoin.xyz</b> to connect. You’ll be redirected back automatically.</p>
      </div>`;
    document.body.appendChild(wrap);
    const close = ()=>wrap.remove();
    wrap.querySelector(".wallet-backdrop").addEventListener("click", close);
    wrap.querySelector("#wmClose").addEventListener("click", close);

    // Desktop extensions: connect direkt
    wrap.querySelector("#wPhantom").addEventListener("click", async (e)=>{
      e.preventDefault();
      if (window.solana?.isPhantom){
        try{
          const r = await window.solana.connect({ onlyIfTrusted:false });
          if (r?.publicKey){ setConnected(r.publicKey.toString()); return close(); }
        }catch{}
      }
      // Mobile: siteyi Phantom içinde aç
      location.href = BROWSE.phantom;
    });

    wrap.querySelector("#wSolflare").addEventListener("click", async (e)=>{
      e.preventDefault();
      if (window.solflare?.connect){
        try{
          await window.solflare.connect();
          const pk = window.solflare.publicKey?.toString?.();
          if (pk){ setConnected(pk); return close(); }
        }catch{}
      }
      location.href = BROWSE.solflare;
    });

    wrap.querySelector("#wBackpack").addEventListener("click", async (e)=>{
      e.preventDefault();
      if (window.backpack?.connect){
        try{
          const r = await window.backpack.connect();
          const pk = (r?.publicKey||r)?.toString?.();
          if (pk){ setConnected(pk); return close(); }
        }catch{}
      }
      location.href = BROWSE.backpack;
    });
  }

  // --- UI events -----------------------------------------------------------
  connectBtn?.addEventListener("click",(e)=>{ e.preventDefault(); openModal(); });

  // Sayfa cüzdan içinde açıldıysa otomatik bağlanmayı dene
  window.addEventListener("pageshow", ()=>tryConnectAll(false));
  document.addEventListener("visibilitychange", ()=>{ if(!document.hidden) tryConnectAll(false); });

  // İlk yükte buton etiketi
  if (connectBtn) connectBtn.textContent = short(null);
})();
