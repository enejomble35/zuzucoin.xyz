/* ZUZU — single wallet module (Phantom / Solflare / Backpack)
   Mobil: universal link → cüzdan içi Dapp WebView → approve → redirect_link ile geri dönüş.
   Desktop: injected provider varsa connect.
*/
(function(){
  const APP_URL = "https://zuzucoin.xyz";

  const modal    = document.getElementById("walletModal");
  const bClose   = document.getElementById("wmClose");
  const btnMain  = document.getElementById("connectBtn");
  const bPh      = document.getElementById("wPhantom");
  const bSf      = document.getElementById("wSolflare");
  const bBp      = document.getElementById("wBackpack");

  let pubkey = null;
  function hide(){ modal?.classList.remove("show"); }
  function show(){ modal?.classList.add("show"); }
  function setConnected(pk){
    pubkey = pk;
    if(btnMain){
      btnMain.textContent = pk.slice(0,4)+"..."+pk.slice(-4);
      btnMain.classList.add("z-btn-primary");
    }
    hide();
  }

  // Modal UX
  bClose?.addEventListener("click", hide);
  modal?.addEventListener("click", e=>{ if(e.target===modal) hide(); });
  btnMain?.addEventListener("click", ()=>{
    if(!modal){ alert("Wallet module not loaded."); return; }
    show();
  });

  // Helper
  const qp = new URLSearchParams(location.search);
  const back = (p) => encodeURIComponent(`${APP_URL}?connected=${p}`);

  // Deeplink (Mobil)
  bPh?.addEventListener("click", ()=>{
    const link = "https://phantom.app/ul/v1/connect"
      + "?app_url=" + encodeURIComponent(APP_URL)
      + "&redirect_link=" + back("phantom");
    location.href = link;
  });

  bSf?.addEventListener("click", ()=>{
    const link = "https://solflare.com/ul/v1/connect"
      + "?app_url=" + encodeURIComponent(APP_URL)
      + "&redirect_link=" + back("solflare");
    location.href = link;
  });

  bBp?.addEventListener("click", ()=>{
    const link = "https://backpack.app/ul/v1/connect"
      + "?app_url=" + encodeURIComponent(APP_URL)
      + "&redirect_link=" + back("backpack");
    location.href = link;
  });

  // Geri dönüş / Desktop injected
  async function tryAutoConnect(){
    // Phantom redirect parametreleri (bazı sürümler farklı isim kullanır)
    const p1 = qp.get("phantom_public_key") || qp.get("public_key") || qp.get("phantom_encryption_public_key");
    if(p1){ return setConnected(p1); }

    // Desktop providers
    try{
      if(window.solana?.isPhantom){
        const r = await window.solana.connect({ onlyIfTrusted:true });
        if(r?.publicKey) return setConnected(r.publicKey.toString());
      }
    }catch{}

    try{
      if(window.solflare?.connect){
        await window.solflare.connect();
        const pk = window.solflare?.publicKey?.toString?.();
        if(pk) return setConnected(pk);
      }
    }catch{}

    try{
      if(window.backpack?.connect){
        const r = await window.backpack.connect();
        const pk = (r?.publicKey||r)?.toString?.() || r?.[0];
        if(pk) return setConnected(pk);
      }
    }catch{}
  }
  window.addEventListener("load", tryAutoConnect);
})();
