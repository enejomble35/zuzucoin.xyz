/* Backpack mobile helper:
 * - Opens zuzucoin.xyz inside Backpack app
 * - On return to browser, tries injected window.backpack.connect()
 */
(function(){
  function setConnected(addr){
    const btn = document.getElementById("connectBtn");
    if (btn){ btn.textContent = addr.slice(0,4)+"..."+addr.slice(-4); btn.classList.add("connected"); btn.dataset.address = addr; }
    document.querySelector(".wallet-modal")?.remove();
  }

  async function tryInjectedConnect(){
    try{
      if (window.backpack?.connect){
        const r = await window.backpack.connect();
        const pk = (r?.publicKey?.toString?.()) || r?.[0] || window.backpack?.publicKey?.toString?.();
        if (pk) setConnected(pk);
      }else if (window.xnft?.solana?.connect){
        const r = await window.xnft.solana.connect();
        const pk = window.xnft.solana?.publicKey?.toString?.();
        if (pk) setConnected(pk);
      }
    }catch(e){ /* no-op */ }
  }

  function openApp(){
    const app = "https://zuzucoin.xyz";
    const url = "https://backpack.app/ul/browse/" + encodeURIComponent(app);
    const a = document.createElement("a"); a.href = url; a.rel="noopener"; document.body.appendChild(a); a.click(); a.remove();
  }

  window.ZUZU_BACKPACK = { openApp, tryInjectedConnect };
  document.addEventListener("visibilitychange", ()=>{ if (document.visibilityState==="visible") tryInjectedConnect(); });
})();
