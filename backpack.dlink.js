/* Backpack helper – open app + try injected on return */
(function(){
  function setConnected(addr){
    const b=document.getElementById("connectBtn");
    if(b){ b.textContent = addr.slice(0,4)+"..."+addr.slice(-4); b.classList.add("connected"); b.dataset.address=addr; }
    document.querySelector(".wallet-modal")?.remove();
  }
  async function tryInjectedConnect(){
    try{
      if (window.backpack?.connect){
        const r = await window.backpack.connect();
        const pk = (r?.publicKey?.toString?.()) || r?.[0] || window.backpack?.publicKey?.toString?.();
        if (pk) setConnected(pk);
      } else if (window.xnft?.solana?.connect){
        await window.xnft.solana.connect();
        const pk = window.xnft.solana?.publicKey?.toString?.();
        if (pk) setConnected(pk);
      }
    }catch(e){}
  }
  function openApp(){
    const url = "https://backpack.app/ul/browse/" + encodeURIComponent("https://zuzucoin.xyz");
    const a=document.createElement("a"); a.href=url; a.rel="noopener"; document.body.appendChild(a); a.click(); a.remove();
  }
  window.ZUZU_BACKPACK = { openApp, tryInjectedConnect };
  document.addEventListener("visibilitychange", ()=>{ if(document.visibilityState==="visible") tryInjectedConnect(); });
})();
