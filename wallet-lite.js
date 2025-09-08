/* =========================
   WALLET MODAL (Phantom / Solflare / Backpack)
========================= */
(function(){
  let pubkey = null;
  const APP_URL = "https://zuzucoin.xyz";

  function openWalletModal(){
    const modal = document.createElement("div");
    modal.className = "wallet-modal";
    modal.innerHTML = `
      <div class="wallet-backdrop" onclick="this.parentNode.remove()"></div>
      <div class="wallet-box">
        <h3>Connect Wallet</h3>
        <div class="wallet-grid">

          <div class="wallet-item" id="wPhantom">
            <img src="assets/wallets/phantom.svg" 
                 onerror="this.onerror=null;this.src='assets/wallets/phantom.png'" 
                 alt="Phantom">
            <span>Phantom</span>
          </div>

          <div class="wallet-item" id="wSolflare">
            <img src="assets/wallets/solflare.svg" 
                 onerror="this.onerror=null;this.src='assets/wallets/solflare.png'" 
                 alt="Solflare">
            <span>Solflare</span>
          </div>

          <div class="wallet-item" id="wBackpack">
            <img src="assets/wallets/backpack.svg" 
                 onerror="this.onerror=null;this.src='assets/wallets/backpack.png'" 
                 alt="Backpack">
            <span>Backpack</span>
          </div>

        </div>
        <p class="note">
          If the app opens, approve <b>zuzucoin.xyz</b> to connect.<br>
          You’ll be redirected back automatically.
        </p>
      </div>`;
    document.body.appendChild(modal);

    // event listeners
    document.getElementById("wPhantom").onclick = ()=>connectPhantom();
    document.getElementById("wSolflare").onclick = ()=>connectSolflare();
    document.getElementById("wBackpack").onclick = ()=>connectBackpack();
  }

  function setConnected(pk){
    pubkey = pk;
    const btn = document.getElementById("connectBtn");
    if(btn){
      btn.textContent = pk.slice(0,4) + "..." + pk.slice(-4);
      btn.classList.add("connected");
    }
    document.querySelector(".wallet-modal")?.remove();
  }

  /* ===== CONNECT METHODS ===== */

  async function connectPhantom(){
    try{
      if(window.solana?.isPhantom){
        const res = await window.solana.connect({ onlyIfTrusted:false });
        if(res.publicKey) return setConnected(res.publicKey.toString());
      }
    }catch(e){ console.warn("Phantom ext fail", e); }

    // fallback deeplink
    window.location.href =
      `https://phantom.app/ul/v1/connect?app_url=${encodeURIComponent(APP_URL)}&redirect_link=${encodeURIComponent(APP_URL)}`;
  }

  async function connectSolflare(){
    try{
      if(window.solflare?.connect){
        const res = await window.solflare.connect();
        if(res?.publicKey) return setConnected(res.publicKey.toString());
      }
    }catch(e){ console.warn("Solflare ext fail", e); }

    // fallback deeplink
    window.location.href =
      `https://solflare.com/ul/v1/connect?app_url=${encodeURIComponent(APP_URL)}&redirect_link=${encodeURIComponent(APP_URL)}`;
  }

  async function connectBackpack(){
    try{
      if(window.backpack?.connect){
        const res = await window.backpack.connect();
        const pk = res?.publicKey?.toString() || res?.[0];
        if(pk) return setConnected(pk);
      }
    }catch(e){ console.warn("Backpack ext fail", e); }

    // fallback deeplink
    window.location.href =
      `https://backpack.app/ul/v1/connect?app_url=${encodeURIComponent(APP_URL)}&redirect_link=${encodeURIComponent(APP_URL)}`;
  }

  // global
  window.openWalletModal = openWalletModal;
})();
