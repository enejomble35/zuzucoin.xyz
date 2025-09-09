<script>
/* ZUZU – Solana wallet helper (Phantom / Solflare / Backpack)
   - Modal aç/kapat
   - Sağ üstte adres gösterimi
   - Mobilde deep-link fallback
*/

(function(){
  const modal   = document.getElementById("walletModal");
  const btnOpen = document.getElementById("openWallet");
  const btnClose= document.getElementById("walletClose");
  const bPhantom= document.getElementById("wPhantom");
  const bSolflr = document.getElementById("wSolflare");
  const bBackpk = document.getElementById("wBackpack");

  let currentProvider = null;
  let addressCb = (pk)=>{};
  let connectedPubkey = null;

  function detect(){
    const prov = {};
    prov.phantom  = window.solana && window.solana.isPhantom ? window.solana : null;
    prov.solflare = window.solflare && window.solflare.isSolflare ? window.solflare : null;
    prov.backpack = window.backpack && window.backpack.solana && window.backpack.solana.isBackpack ? window.backpack.solana : null;
    return prov;
  }

  function open(){ modal?.classList.remove("hidden"); modal?.setAttribute("aria-hidden","false"); }
  function close(){ modal?.classList.add("hidden"); modal?.setAttribute("aria-hidden","true"); }

  async function connect(which){
    const P = detect();
    let provider = null;
    if(which==="phantom") provider = P.phantom;
    if(which==="solflare")provider = P.solflare;
    if(which==="backpack")provider = P.backpack;

    // Mobil ve provider yoksa: uygulama içinde açma (deep-link benzeri)
    if(!provider){
      const host = location.origin.replace(/^https?:\/\//,'');
      if(which==="phantom"){
        location.href = `https://phantom.app/ul/browse/${host}`;
      }else if(which==="solflare"){
        location.href = `https://solflare.com/ul/v1/browse/${host}`;
      }else if(which==="backpack"){
        location.href = `https://backpack.app/ul/browse/${host}`;
      }else{
        alert("No wallet provider found.");
      }
      return false;
    }

    try{
      const resp = await provider.connect({ onlyIfTrusted:false });
      const pk = (resp?.publicKey || provider.publicKey)?.toString();
      if(!pk) throw new Error("No publicKey");
      connectedPubkey = pk;
      localStorage.setItem("zuzu_pubkey", pk);
      addressCb(pk);
      close();
      return true;
    }catch(err){
      console.warn("connect error:", err);
      alert("Connection was cancelled or failed.");
      return false;
    }
  }

  async function ensureConnected(){
    if(connectedPubkey) return true;
    // sessiz bağlan (daha önce onaylıysa)
    const P = detect();
    for(const prov of [P.phantom,P.solflare,P.backpack]){
      try{
        if(!prov) continue;
        const r = await prov.connect({ onlyIfTrusted:true });
        const pk = (r?.publicKey || prov.publicKey)?.toString();
        if(pk){ connectedPubkey = pk; addressCb(pk); return true; }
      }catch(e){}
    }
    // değilse modal aç
    open();
    return false;
  }

  function onAddress(cb){ addressCb = cb; if(connectedPubkey) cb(connectedPubkey); }

  // Buttons
  btnClose?.addEventListener("click", close);
  modal?.addEventListener("click", e=>{ if(e.target===modal) close(); });
  bPhantom?.addEventListener("click", ()=>connect("phantom"));
  bSolflr ?.addEventListener("click", ()=>connect("solflare"));
  bBackpk ?.addEventListener("click", ()=>connect("backpack"));

  // Otomatik sessiz bağlanma
  window.addEventListener("load", ()=>{ ensureConnected(); });

  // Public API
  window.WalletLite = { open, close, connect, ensureConnected, onAddress };
})();
</script>
