(function(){
  const CONF = window.ZUZU_CONFIG || {};
  let pubkey = null;

  // UI
  const modal  = document.getElementById("walletModal");
  const closeB = document.getElementById("wmClose");
  const bPh    = document.getElementById("wPhantom");
  const bSf    = document.getElementById("wSolflare");
  const bBp    = document.getElementById("wBackpack");
  const connectBtn = document.getElementById("connectBtn");
  const APP_URL = "https://zuzucoin.xyz";

  function show(){ modal?.classList.add("show"); modal?.setAttribute("aria-hidden","false"); }
  function hide(){ modal?.classList.remove("show"); modal?.setAttribute("aria-hidden","true"); }
  window.openWalletModal = show;
  closeB?.addEventListener("click", hide);
  modal?.addEventListener("click", e=>{ if(e.target===modal) hide(); });

  function setConnected(pk){
    pubkey = pk;
    if(connectBtn && pk){
      connectBtn.textContent = pk.slice(0,4)+"..."+pk.slice(-4);
    }
    hide();
  }

  async function tryTrustedConnect(){
    try{
      if (window.solana?.isPhantom) {
        const res = await window.solana.connect({ onlyIfTrusted:true });
        if(res?.publicKey) return setConnected(res.publicKey.toString());
      }
    }catch{}
    try{
      if (window.solflare?.isConnected || window.solflare?.connect) {
        await window.solflare.connect();
        if(window.solflare?.publicKey) return setConnected(window.solflare.publicKey.toString());
      }
    }catch{}
    try{
      if (window.backpack?.connect) {
        const r = await window.backpack.connect();
        const pk = (r?.publicKey||r)?.toString?.() || r?.[0];
        if(pk) return setConnected(pk);
      }
    }catch{}
  }

  // Derin linkten dönüşte otomatik dene
  window.addEventListener("load", tryTrustedConnect);

  /* --- Connect buttons --- */
  bPh?.addEventListener("click", async ()=>{
    try{
      if (window.solana?.isPhantom) {
        const res = await window.solana.connect({ onlyIfTrusted:false });
        return setConnected(res.publicKey?.toString());
      }
    }catch(e){ console.warn(e); }
    const link = "https://phantom.app/ul/v1/connect"
      + "?app_url=" + encodeURIComponent(APP_URL)
      + "&redirect_link=" + encodeURIComponent(window.location.href.split('#')[0]);
    window.location.href = link;
  });

  bSf?.addEventListener("click", async ()=>{
    try{
      if (window.solflare?.connect) {
        await window.solflare.connect();
        return setConnected(window.solflare.publicKey?.toString());
      }
    }catch(e){ console.warn(e); }
    const link = "https://solflare.com/ul/v1/connect"
      + "?url=" + encodeURIComponent(APP_URL)
      + "&redirect=" + encodeURIComponent(window.location.href.split('#')[0]);
    window.location.href = link;
  });

  bBp?.addEventListener("click", async ()=>{
    try{
      if (window.backpack?.connect) {
        const r = await window.backpack.connect();
        const pk = (r?.publicKey||r)?.toString?.() || r?.[0];
        return setConnected(pk);
      }
    }catch(e){ console.warn(e); }
    window.location.href = "https://www.backpack.app/download";
  });

  /* --- Presale Buy (demo akış) --- */
  window.solanaPresaleBuy = async function({quantity, payment, price}){
    if(!pubkey){ show(); throw new Error("WALLET_NOT_CONNECTED"); }
    const costUSDT = quantity * (price || CONF.presalePrice);
    const payType = (payment === "USDT") ? "USDT (SPL)" : "SOL";
    alert(
      `Wallet: ${pubkey}\n` +
      `Amount: ${quantity} ${CONF.tokenSymbol}\n` +
      `Payment: ${payType}\n` +
      `Est. cost: ${costUSDT.toFixed(2)} USDT\n\n` +
      `Demo: gerçek on-chain transferi eklemek için SPL/Solana SDK ile işlem yazmalısın.`
    );
  };
})();
