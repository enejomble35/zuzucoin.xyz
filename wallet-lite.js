/* ZUZU — Lightweight wallet modal: Phantom, Solflare, Backpack (mobile deeplink + injected fallback) */
(function(){
  const APP_URL="https://zuzucoin.xyz";
  const modal=$("walletModal"), btnOpen=$("connectBtn"), btnClose=$("wmClose");
  const bPh=$("wPhantom"), bSf=$("wSolflare"), bBp=$("wBackpack");
  let pubkey=null; window.__zuzu_pk=()=>pubkey;

  function $(id){return document.getElementById(id)}
  const show=()=>modal?.classList.add("show");
  const hide=()=>modal?.classList.remove("show");
  const setConnected=pk=>{
    if(!pk) return;
    pubkey=pk;
    try{localStorage.setItem("zuzu_pk",pk);}catch{}
    if(btnOpen){btnOpen.textContent=pk.slice(0,4)+"..."+pk.slice(-4);}
    document.dispatchEvent(new CustomEvent("zuzu:walletConnected",{detail:{publicKey:pk}}));
    hide();
  };

  // Open modal
  btnOpen?.addEventListener("click",()=>{ if(!modal){alert("Wallet module not loaded.");return;} show(); });
  btnClose?.addEventListener("click",hide);
  modal?.addEventListener("click",e=>{ if(e.target.classList.contains("wallet-backdrop")) hide(); });

  // --- Injected (desktop) quick-connect ---
  async function tryInjected(){
    try{ if(window.solana?.isPhantom){ const r=await window.solana.connect({onlyIfTrusted:true}); if(r?.publicKey) return setConnected(r.publicKey.toString()); } }catch{}
    try{ if(window.solflare?.connect){ await window.solflare.connect(); const k=window.solflare?.publicKey?.toString?.(); if(k) return setConnected(k);} }catch{}
    try{ if(window.backpack?.connect){ const r=await window.backpack.connect(); const k=(r?.publicKey||r)?.toString?.()||r?.[0]; if(k) return setConnected(k);} }catch{}
    try{const k=localStorage.getItem("zuzu_pk"); if(k) setConnected(k);}catch{}
  }
  window.addEventListener("load",tryInjected);

  // --- Deep link (mobile) ---
  function dRedirect(connectUrl){
    // 1) app'ın in-app browser'ına gir
    // 2) kısa gecikme sonra connect deeplink
    location.href=connectUrl.browse;
    setTimeout(()=>{ if(document.visibilityState==="visible") location.href=connectUrl.connect; },700);
  }
  const makeUrls=(base,tag)=>({
    browse:`${base}/browse/${location.host}`,
    connect:`${base}/v1/connect?app_url=${encodeURIComponent(APP_URL)}&redirect_link=${encodeURIComponent(APP_URL+'?connected='+tag)}`
  });
  bPh?.addEventListener("click",()=>dRedirect(makeUrls("https://phantom.app/ul","phantom")));
  bSf?.addEventListener("click",()=>dRedirect(makeUrls("https://solflare.com/ul","solflare")));
  bBp?.addEventListener("click",()=>dRedirect(makeUrls("https://backpack.app/ul","backpack")));

  // --- Return capture (wallet -> site) ---
  (function capture(){
    const q=new URLSearchParams(location.search);
    const pk=q.get("public_key")||q.get("phantom_public_key")||q.get("phantom_encryption_public_key");
    if(pk) setConnected(pk);
  })();
})();
