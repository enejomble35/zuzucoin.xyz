/* ZUZU — Wallet modal (Phantom, Solflare, Backpack) */
(function(){
  const APP_URL="https://zuzucoin.xyz";
  const modal=$("walletModal"), bClose=$("wmClose"), btnConnect=$("connectBtn");
  const bPh=$("wPhantom"), bSf=$("wSolflare"), bBp=$("wBackpack");
  let pubkey=null; window.__zuzu_pk=()=>pubkey;

  function $(id){return document.getElementById(id)}
  function show(){modal?.classList.add("show")}
  function hide(){modal?.classList.remove("show")}
  function setConnected(pk){
    if(!pk) return; pubkey=pk;
    if(btnConnect){btnConnect.textContent=pk.slice(0,4)+"..."+pk.slice(-4);btnConnect.classList.add("btn-primary");}
    document.dispatchEvent(new CustomEvent("zuzu:walletConnected",{detail:{publicKey:pk}}));
    try{localStorage.setItem("zuzu_pk",pk);}catch{} hide();
  }

  btnConnect?.addEventListener("click",()=>{ if(!modal){alert("Wallet module not loaded.");return;} show(); });
  bClose?.addEventListener("click",hide);
  modal?.addEventListener("click",e=>{ if(e.target.classList.contains("wallet-backdrop")) hide(); });

  const qp=new URLSearchParams(location.search);
  function back(tag){return encodeURIComponent(`${APP_URL}?connected=${tag}`)}
  function openPhantom(){
    const browse=`https://phantom.app/ul/browse/${location.host}`;
    const connect=`https://phantom.app/ul/v1/connect?app_url=${encodeURIComponent(APP_URL)}&redirect_link=${back("phantom")}`;
    location.href=browse; setTimeout(()=>{ if(document.visibilityState==="visible") location.href=connect; },700);
  }
  function openSolflare(){
    const browse=`https://solflare.com/ul/browse/${location.host}`;
    const connect=`https://solflare.com/ul/v1/connect?app_url=${encodeURIComponent(APP_URL)}&redirect_link=${back("solflare")}`;
    location.href=browse; setTimeout(()=>{ if(document.visibilityState==="visible") location.href=connect; },700);
  }
  function openBackpack(){
    const browse=`https://backpack.app/ul/browse/${location.host}`;
    const connect=`https://backpack.app/ul/v1/connect?app_url=${encodeURIComponent(APP_URL)}&redirect_link=${back("backpack")}`;
    location.href=browse; setTimeout(()=>{ if(document.visibilityState==="visible") location.href=connect; },700);
  }
  bPh?.addEventListener("click",openPhantom);
  bSf?.addEventListener("click",openSolflare);
  bBp?.addEventListener("click",openBackpack);

  function captureReturn(){
    const pk=qp.get("public_key")||qp.get("phantom_public_key")||qp.get("phantom_encryption_public_key");
    if(pk) setConnected(pk);
  }
  async function tryInjected(){
    try{ if(window.solana?.isPhantom){const r=await window.solana.connect({onlyIfTrusted:true}); if(r?.publicKey) return setConnected(r.publicKey.toString());} }catch{}
    try{ if(window.solflare?.connect){ await window.solflare.connect(); const k=window.solflare?.publicKey?.toString?.(); if(k) return setConnected(k);} }catch{}
    try{ if(window.backpack?.connect){ const r=await window.backpack.connect(); const k=(r?.publicKey||r)?.toString?.()||r?.[0]; if(k) return setConnected(k);} }catch{}
    try{const k=localStorage.getItem("zuzu_pk"); if(k) setConnected(k);}catch{}
  }
  window.addEventListener("load",()=>{captureReturn();tryInjected();});
})();
