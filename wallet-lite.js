/* Basit cüzdan bağlayıcı (modalsız çağıracağız) */
const WalletLite = (()=>{

  const modal = document.getElementById("wlModal");
  const closeBtn = document.getElementById("wlClose");
  if(closeBtn) closeBtn.onclick = ()=>modal.style.display="none";

  // UI güncelle
  function updateUI(pubkey){
    const short = pubkey ? pubkey.slice(0,4)+"…"+pubkey.slice(-4) : "Not connected";
    const wEl = document.getElementById("solWallet");
    if(wEl) wEl.textContent = short;
    const topBtn = document.getElementById("connectBtn");
    if(topBtn) topBtn.textContent = pubkey ? short : (document.querySelector("#connectBtn[data-i18n]")?document.querySelector("#connectBtn[data-i18n]").innerText:"Cüzdan Bağla");
    const stEl = document.getElementById("solStatus");
    if(stEl) stEl.textContent = pubkey ? "Bağlı" : "Hazır (cüzdan bekleniyor)";
    // global
    window.ZUZU_SOL && window.ZUZU_SOL.update(pubkey||null);
  }

  async function connectPhantom(){
    const prov = window.phantom?.solana || window.solana;
    if(prov && prov.isPhantom){
      const r = await prov.connect();
      updateUI(r.publicKey.toBase58());
      return;
    }
    // yoksa yönlendir (mobile deeplink)
    const back = encodeURIComponent(location.href);
    location.href = `https://phantom.app/ul/v1/connect?app_url=${back}&redirect_link=${back}`;
  }

  async function connectSolflare(){
    const sf = window.solflare;
    if(sf && sf.isSolflare){
      const r = await sf.connect();
      updateUI(r.publicKey.toBase58());
      return;
    }
    const back = encodeURIComponent(location.href);
    location.href = `https://solflare.com/ul/v1/connect?redirect_link=${back}`;
  }

  async function connectBackpack(){
    const bp = window.backpack?.solana;
    if(bp){
      const r = await bp.connect();
      updateUI(r.publicKey.toBase58());
      return;
    }
    alert("Backpack eklentisini kurun.");
  }

  async function disconnect(){
    try{
      const prov = window.phantom?.solana || window.solana;
      if(prov?.disconnect) await prov.disconnect();
    }catch{}
    updateUI(null);
  }

  // modal aç
  function openPicker(){
    modal.style.display="grid";
  }
  // seçeneklere tık
  modal?.querySelectorAll("[data-w]").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      try{
        if(btn.dataset.w==="phantom") await connectPhantom();
        if(btn.dataset.w==="solflare") await connectSolflare();
        if(btn.dataset.w==="backpack") await connectBackpack();
      }catch(e){ alert(e.message||e); }
      modal.style.display="none";
    });
  });

  // public API
  return {openPicker, disconnect, updateUI};
})();
