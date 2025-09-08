/* Solana Wallet Modal: Phantom / Solflare / Backpack
   - Deeplink + dönüşte onlyIfTrusted ile sessiz bağlanma
   - Bağlanınca Connect Wallet üzerine kısa adres yazılır
*/
(function(){
  const APP_URL = "https://zuzucoin.xyz";
  let pubkey = null;
  const connectBtn = document.getElementById("connectBtn");

  function setConnected(pk){
    pubkey = pk;
    if (connectBtn && pk) connectBtn.textContent = pk.slice(0,4)+"..."+pk.slice(-4);
  }
  window.__zuzu_pk = ()=>pubkey;

  function show(){
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

    // Phantom
    wrap.querySelector("#wPhantom").addEventListener("click", async (e)=>{
      e.preventDefault();
      try{
        if (window.solana?.isPhantom){
          const r = await window.solana.connect({ onlyIfTrusted:false });
          if (r?.publicKey){ setConnected(r.publicKey.toString()); return close(); }
        }
      }catch(_){}
      const link = "https://phantom.app/ul/v1/connect"
        + "?app_url=" + encodeURIComponent(APP_URL)
        + "&redirect_link=" + encodeURIComponent(location.href.split('#')[0])
        + "&cluster=mainnet-beta";
      location.href = link;
    });

    // Solflare
    wrap.querySelector("#wSolflare").addEventListener("click", async (e)=>{
      e.preventDefault();
      try{
        if (window.solflare?.connect){
          await window.solflare.connect();
          const pk = window.solflare.publicKey?.toString?.();
          if (pk){ setConnected(pk); return close(); }
        }
      }catch(_){}
      const link = "https://solflare.com/ul/v1/connect"
        + "?app_url=" + encodeURIComponent(APP_URL)
        + "&redirect_link=" + encodeURIComponent(location.href.split('#')[0]);
      location.href = link;
    });

    // Backpack
    wrap.querySelector("#wBackpack").addEventListener("click", async (e)=>{
      e.preventDefault();
      try{
        if (window.backpack?.connect){
          const r = await window.backpack.connect();
          const pk = (r?.publicKey||r)?.toString?.();
          if (pk){ setConnected(pk); return close(); }
        }
      }catch(_){}
      const link = "https://backpack.app/ul/v1/connect"
        + "?app_url=" + encodeURIComponent(APP_URL)
        + "&redirect_link=" + encodeURIComponent(location.href.split('#')[0]);
      location.href = link;
    });
  }

  connectBtn?.addEventListener("click",(e)=>{ e.preventDefault(); show(); });

  // Geri dönüşte sessiz bağlanma
  async function tryTrusted(){
    try{
      if (window.solana?.isPhantom){
        const r = await window.solana.connect({ onlyIfTrusted:true });
        if (r?.publicKey) return setConnected(r.publicKey.toString());
      }
    }catch(_){}
    try{
      if (window.solflare?.connect){
        await window.solflare.connect();
        const pk = window.solflare.publicKey?.toString?.();
        if (pk) return setConnected(pk);
      }
    }catch(_){}
    try{
      if (window.backpack?.connect){
        const r = await window.backpack.connect();
        const pk = (r?.publicKey||r)?.toString?.();
        if (pk) return setConnected(pk);
      }
    }catch(_){}
  }
  window.addEventListener("pageshow", tryTrusted);
  document.addEventListener("visibilitychange", ()=>{ if(!document.hidden) tryTrusted(); });

  if (location.search.includes("errorCode") || location.search.includes("connected")){
    history.replaceState({}, "", location.pathname);
  }
})();
