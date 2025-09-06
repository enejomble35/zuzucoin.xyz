const WalletLite = (()=>{
  const modal = document.getElementById("wlModal");
  const closeBtn = document.getElementById("wlClose");
  closeBtn && (closeBtn.onclick = ()=> modal.style.display="none");

  function setUI(pk){
    const short = pk ? pk.slice(0,4)+"…"+pk.slice(-4) : "Not connected";
    const w = document.getElementById("solWallet"); if(w) w.textContent = short;
    const s = document.getElementById("solStatus"); if(s) s.textContent = pk?"Bağlı":"Hazır (cüzdan bekleniyor)";
    const top = document.getElementById("connectBtn"); if(top) top.textContent = pk?short:"Cüzdan Bağla";
    window.ZUZU_SOL && window.ZUZU_SOL.update(pk||null);
  }

  async function tryPhantomConnect(){
    const p = window.phantom?.solana || window.solana;
    if(p?.isPhantom){ const r = await p.connect(); setUI(r.publicKey.toBase58()); return true; }
    return false;
  }
  async function trySolflareConnect(){
    const s = window.solflare;
    if(s?.isSolflare){ const r = await s.connect(); setUI(r.publicKey.toBase58()); return true; }
    return false;
  }
  async function tryBackpackConnect(){
    const b = window.backpack?.solana;
    if(b){ const r = await b.connect(); setUI(r.publicKey.toBase58()); return true; }
    return false;
  }

  function openPicker(){ modal.style.display="grid"; }
  async function disconnect(){
    try{ await (window.phantom?.solana||window.solana)?.disconnect?.(); }catch{}
    setUI(null);
  }

  modal?.querySelectorAll("[data-w]").forEach(btn=>{
    btn.onclick = async ()=>{
      try{
        const w = btn.dataset.w;
        let ok = false;
        if(w==="phantom") ok = await tryPhantomConnect();
        if(w==="solflare") ok = await trySolflareConnect();
        if(w==="backpack") ok = await tryBackpackConnect();

        if(!ok){
          const back = encodeURIComponent(location.href);
          if(w==="phantom") location.href = `https://phantom.app/ul/v1/connect?redirect_link=${back}&app_url=${back}`;
          if(w==="solflare") location.href = `https://solflare.com/ul/v1/connect?redirect_link=${back}`;
          if(w==="backpack") alert("Backpack mobil deeplink sınırlı; uygulama içi tarayıcıdan açın.");
        }
      }catch(e){ alert(e.message||e); }
      modal.style.display="none";
    };
  });

  // Deeplink dönüşü
  document.addEventListener("visibilitychange", async ()=>{
    if(!document.hidden){
      await tryPhantomConnect().catch(()=>{});
      await trySolflareConnect().catch(()=>{});
    }
  });

  return {openPicker, disconnect, setUI};
})();
