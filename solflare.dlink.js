/* Solflare helper – open app + try injected on return */
(function(){
  function setConnected(addr){
    const b=document.getElementById("connectBtn");
    if(b){ b.textContent = addr.slice(0,4)+"..."+addr.slice(-4); b.classList.add("connected"); b.dataset.address=addr; }
    document.querySelector(".wallet-modal")?.remove();
  }
  async function tryInjectedConnect(){
    try{
      if (window.solflare?.connect){
        await window.solflare.connect();
        const pk = window.solflare?.publicKey?.toString?.();
        if (pk) setConnected(pk);
      }
    }catch(e){}
  }
  function openApp(){
    const url = "https://solflare.com/ul/v1/browse/" + encodeURIComponent("https://zuzucoin.xyz");
    const a=document.createElement("a"); a.href=url; a.rel="noopener"; document.body.appendChild(a); a.click(); a.remove();
  }
  window.ZUZU_SOLFLARE = { openApp, tryInjectedConnect };
  document.addEventListener("visibilitychange", ()=>{ if(document.visibilityState==="visible") tryInjectedConnect(); });
})();
