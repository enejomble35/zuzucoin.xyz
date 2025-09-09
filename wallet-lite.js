/* ZUZU — wallet modal (Phantom / Solflare / Backpack)
   Mobil: önce /ul/browse ile dapp'i cüzdan içinde aç, sonra connect fallback.
   Desktop: injected provider varsa onlyIfTrusted -> connect.
*/
(function(){
  const APP_URL = "https://zuzucoin.xyz";

  const modal   = document.getElementById("walletModal");
  const bClose  = document.getElementById("wmClose");
  const btnMain = document.getElementById("connectBtn");
  const bPh     = document.getElementById("wPhantom");
  const bSf     = document.getElementById("wSolflare");
  const bBp     = document.getElementById("wBackpack");

  function show(){ modal?.classList.add("show"); }
  function hide(){ modal?.classList.remove("show"); }

  let pubkey = null;
  function setConnected(pk){
    pubkey = pk;
    if(btnMain){
      btnMain.textContent = pk.slice(0,4)+"..."+pk.slice(-4);
      btnMain.classList.add("btn-primary");
    }
    hide();
  }
  window.__zuzu_pk = ()=>pubkey;

  // UI
  bClose?.addEventListener("click", hide);
  modal?.addEventListener("click", e=>{ if(e.target.classList.contains("wallet-backdrop")) hide(); });
  btnMain?.addEventListener("click", ()=>{
    if(!modal){ alert("Wallet module not loaded."); return; }
    show();
  });

  // Helpers
  const qp = new URLSearchParams(location.search);
  const back = tag => encodeURIComponent(`${APP_URL}?connected=${tag}`);

  function openPhantom(){
    const browse = `https://phantom.app/ul/browse/${location.host}`;
    const connect = "https://phantom.app/ul/v1/connect?app_url="+encodeURIComponent(APP_URL)+"&redirect_link="+back("phantom");
    location.href = browse;
    setTimeout(()=>{ if(document.visibilityState==="visible") location.href = connect; }, 700);
  }
  function openSolflare(){
    const browse = `https://solflare.com/ul/browse/${location.host}`;
    const connect = "https://solflare.com/ul/v1/connect?app_url="+encodeURIComponent(APP_URL)+"&redirect_link="+back("solflare");
    location.href = browse;
    setTimeout(()=>{ if(document.visibilityState==="visible") location.href = connect; }, 700);
  }
  function openBackpack(){
    const browse = `https://backpack.app/ul/browse/${location.host}`;
    const connect = "https://backpack.app/ul/v1/connect?app_url="+encodeURIComponent(APP_URL)+"&redirect_link="+back("backpack");
    location.href = browse;
    setTimeout(()=>{ if(document.visibilityState==="visible") location.href = connect; }, 700);
  }
  bPh?.addEventListener("click", openPhantom);
  bSf?.addEventListener("click", openSolflare);
  bBp?.addEventListener("click", openBackpack);

  // Dönüş veya Desktop otomatik bağlanma
  async function tryAuto(){
    const pk = qp.get("phantom_public_key") || qp.get("public_key") || qp.get("phantom_encryption_public_key");
    if(pk) return setConnected(pk);

    try{
      if(window.solana?.isPhantom){
        const r = await window.solana.connect({ onlyIfTrusted:true });
        if(r?.publicKey) return setConnected(r.publicKey.toString());
      }
    }catch{}

    try{
      if(window.solflare?.connect){
        await window.solflare.connect();
        const k = window.solflare?.publicKey?.toString?.();
        if(k) return setConnected(k);
      }
    }catch{}

    try{
      if(window.backpack?.connect){
        const r = await window.backpack.connect();
        const k = (r?.publicKey||r)?.toString?.() || r?.[0];
        if(k) return setConnected(k);
      }
    }catch{}
  }
  window.addEventListener("load", tryAuto);
})();
