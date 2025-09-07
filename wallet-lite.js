/* =========================================================
   Solana Wallet Modal (Phantom, Solflare, Backpack)
   - Desktop: injected provider connect()
   - Mobile: universal deep links; dönüşte onlyIfTrusted:true auto-connect
   - Public helpers: __zuzu_pubkey(), __zuzu_invite()
========================================================= */
(function(){
  const APP_URL = "https://zuzucoin.xyz";
  let pubkey = localStorage.getItem("zuzu_pubkey") || null;
  const $ = (s,r=document)=>r.querySelector(s);

  function showModal(){
    let m = $("#walletModal");
    if(!m){
      m = document.createElement("div");
      m.id="walletModal";
      m.className="wallet-modal show";
      m.innerHTML = `
        <div class="wm-backdrop"></div>
        <div class="wm-box">
          <div class="wm-head"><h3>Connect Wallet</h3><button id="wmClose">✕</button></div>
          <div class="wm-list">
            <button class="wm-item" id="wPhantom"><img src="assets/wallets/phantom.svg" alt="Phantom"><span>Phantom</span></button>
            <button class="wm-item" id="wSolflare"><img src="assets/wallets/solflare.svg" alt="Solflare"><span>Solflare</span></button>
            <button class="wm-item" id="wBackpack"><img src="assets/wallets/backpack.svg" alt="Backpack"><span>Backpack</span></button>
          </div>
          <p class="wm-note">If the app opens, approve <b>zuzucoin.xyz</b> to connect. You’ll be redirected back automatically.</p>
        </div>`;
      document.body.appendChild(m);
      $("#wmClose").onclick = hide;
      $(".wm-backdrop").onclick = hide;

      $("#wPhantom").onclick = async ()=>{
        try{
          if(window.solana?.isPhantom){ const r=await window.solana.connect(); return setConnected(r?.publicKey?.toString()); }
        }catch{}
        location.href = `https://phantom.app/ul/v1/connect?app_url=${encodeURIComponent(APP_URL)}&redirect_link=${encodeURIComponent(APP_URL)}&redirect_url=${encodeURIComponent(APP_URL)}&dapp_enforce=1&with_redirect=1&open_in_wallet=1&cluster=mainnet-beta`;
      };
      $("#wSolflare").onclick = async ()=>{
        try{
          if(window.solflare?.connect){ await window.solflare.connect(); return setConnected(window.solflare?.publicKey?.toString()); }
        }catch{}
        location.href = `https://solflare.com/ul/v1/connect?app_url=${encodeURIComponent(APP_URL)}&redirect_link=${encodeURIComponent(APP_URL)}&redirect_url=${encodeURIComponent(APP_URL)}&dapp_enforce=1&with_redirect=1&open_in_wallet=1&cluster=mainnet-beta`;
      };
      $("#wBackpack").onclick = async ()=>{
        try{
          if(window.backpack?.connect){ const r=await window.backpack.connect(); const pk=(r?.publicKey||r)?.toString?.(); if(pk) return setConnected(pk); }
        }catch{}
        location.href = `https://backpack.app/ul/v1/connect?app_url=${encodeURIComponent(APP_URL)}&redirect_link=${encodeURIComponent(APP_URL)}&redirect_url=${encodeURIComponent(APP_URL)}&dapp_enforce=1&with_redirect=1&open_in_wallet=1&cluster=mainnet-beta`;
      };
    } else {
      m.classList.add("show");
    }
  }
  function hide(){ $("#walletModal")?.classList.remove("show"); }
  function setConnected(pk){
    pubkey = pk || null;
    try{ localStorage.setItem("zuzu_pubkey", pubkey||""); }catch{}
    const b=$("#connectBtn"); if(b){ b.classList.add("connected"); b.textContent = pubkey.slice(0,4)+"..."+pubkey.slice(-4); }
    hide();
  }

  window.__zuzu_pubkey = ()=> pubkey;
  window.__zuzu_invite = ()=> pubkey ? `${APP_URL}/?ref=${encodeURIComponent(pubkey)}` : "";

  /* auto connect (trusted) on return / desktop */
  async function tryTrusted(){
    try{ if(window.solana?.isPhantom){ const r=await window.solana.connect({onlyIfTrusted:true}); if(r?.publicKey) return setConnected(r.publicKey.toString()); } }catch{}
    try{ if(window.solflare?.connect){ await window.solflare.connect({onlyIfTrusted:true}); if(window.solflare?.publicKey) return setConnected(window.solflare.publicKey.toString()); } }catch{}
    try{ if(window.backpack?.connect){ const r=await window.backpack.connect({onlyIfTrusted:true}); const pk=(r?.publicKey||r)?.toString?.(); if(pk) return setConnected(pk); } }catch{}
  }
  ["load","pageshow","focus","visibilitychange"].forEach(ev=>{
    window.addEventListener(ev,()=>{ if(ev==="visibilitychange" && document.hidden) return; tryTrusted(); },{passive:true});
  });

  document.getElementById("connectBtn")?.addEventListener("click",(e)=>{ e.preventDefault(); showModal(); });
})();
