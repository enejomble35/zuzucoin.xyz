/* Phantom / Solflare / Backpack — tek modal, mobil deeplink + injected fallback */
(function(){
  const APP_URL="https://zuzucoin.xyz";
  const modal=$("walletModal"), openBtn=$("connectBtn"), closeBtn=$("wmClose");
  const bPh=$("wPhantom"), bSf=$("wSolflare"), bBp=$("wBackpack");
  let pk=null; window.__zuzu_pk=()=>pk;

  function $(id){return document.getElementById(id)}
  const show=()=>modal?.classList.add("show"); const hide=()=>modal?.classList.remove("show");
  function setConnected(x){
    pk=x; try{localStorage.setItem("zuzu_pk",x);}catch{}
    if(openBtn) openBtn.textContent=x.slice(0,4)+"..."+x.slice(-4);
    document.dispatchEvent(new CustomEvent("zuzu:walletConnected",{detail:{publicKey:x}}));
    hide();
  }

  openBtn?.addEventListener("click",()=>{ if(!modal){alert("Wallet module not loaded.");return;} show(); });
  closeBtn?.addEventListener("click",hide);
  modal?.addEventListener("click",e=>{ if(e.target.classList.contains("wallet-backdrop")) hide(); });

  // Desktop injected (onlyIfTrusted)
  window.addEventListener("load",async ()=>{
    try{ if(window.solana?.isPhantom){const r=await window.solana.connect({onlyIfTrusted:true}); if(r?.publicKey) return setConnected(r.publicKey.toString());} }catch{}
    try{ if(window.solflare?.connect){ await window.solflare.connect(); const k=window.solflare?.publicKey?.toString?.(); if(k) return setConnected(k);} }catch{}
    try{ if(window.backpack?.connect){ const r=await window.backpack.connect(); const k=(r?.publicKey||r)?.toString?.()||r?.[0]; if(k) return setConnected(k);} }catch{}
    try{const k=localStorage.getItem("zuzu_pk"); if(k) setConnected(k);}catch{}
  });

  // Mobile deeplink (open in wallet, then connect)
  function deepflow(base, tag){
    const browse=`${base}/browse/${location.host}`;
    const connect=`${base}/v1/connect?app_url=${encodeURIComponent(APP_URL)}&redirect_link=${encodeURIComponent(APP_URL+'?connected='+tag)}`;
    location.href=browse;
    setTimeout(()=>{ if(document.visibilityState==="visible") location.href=connect; },700);
  }
  bPh?.addEventListener("click",()=>deepflow("https://phantom.app/ul","phantom"));
  bSf?.addEventListener("click",()=>deepflow("https://solflare.com/ul","solflare"));
  bBp?.addEventListener("click",()=>deepflow("https://backpack.app/ul","backpack"));

  // Capture return (wallet -> site)
  (function capture(){
    const q=new URLSearchParams(location.search);
    const pub=q.get("public_key")||q.get("phantom_public_key")||q.get("phantom_encryption_public_key");
    if(pub) setConnected(pub);
  })();
})();
