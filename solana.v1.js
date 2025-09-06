// Basit Solana bağlanma + satın alma (demo)
(function(){
  const S = { wallet:null, pk:null, provider:null };

  function hasProvider(which){
    if (which==='phantom')  return !!(window.phantom && window.phantom.solana);
    if (which==='solflare') return !!window.solflare;
    if (which==='backpack') return !!window.backpack;
    return false;
  }
  function setStatus(t){ const el=document.getElementById('solStatus'); if(el) el.textContent=t; }
  function setWalletLabel(pk){
    const el=document.getElementById('solWalletLabel');
    if (el) el.textContent = pk ? pk.slice(0,4)+'...'+pk.slice(-4) : 'Not connected';
    const b=document.getElementById('connectBtn'); if(b && pk) b.textContent=pk.slice(0,4)+'...'+pk.slice(-4);
  }

  async function connect(which){
    try{
      if (!hasProvider(which)) { setStatus('Wallet açılıyor…'); return; }
      let w = (which==='phantom')?window.phantom.solana
           : (which==='solflare')?window.solflare
           : window.backpack;
      const res = await w.connect({ onlyIfTrusted:false });
      S.wallet=w; S.provider=which; S.pk=res.publicKey.toString();
      setStatus('Bağlandı'); setWalletLabel(S.pk);
      localStorage.setItem('zuzu_wallet_connected','1');
    }catch(e){ console.warn(e); setStatus('Bağlantı reddedildi / hata'); }
  }
  async function disconnect(){ try{await S.wallet?.disconnect?.()}catch{} S.wallet=null;S.pk=null;S.provider=null; setWalletLabel(null); setStatus('Hazır (cüzdan bekleniyor)'); }

  async function buyWeek(i){
    if(!S.pk){ alert('Önce cüzdan bağla.'); return; }
    const qty=parseFloat((document.getElementById("buyAmount")?.value||"0").replace(/[^\d.]/g,""))||0;
    if(qty<=0){ alert('Geçerli miktar gir.'); return; }
    const price=ZUZU_CONFIG.weekPrices[i]; const cost=qty*price;
    alert(`(DEMO) ${qty} ZUZU ≈ ${cost.toFixed(2)} USDT (SPL). İşlem imzası bu noktada yapılacak.`);
  }

  window.ZUZU_SOL = { hasProvider, connect, disconnect, state:S };

  document.getElementById('btnSolDisconnect')?.addEventListener('click', disconnect);
  ['buyW0','buyW1','buyW2','buyW3'].forEach((id,i)=>{
    document.getElementById(id)?.addEventListener('click', ()=>buyWeek(i));
  });

  // deeplink dönüşünü yakala
  (function waitProvider(){
    const tryname = localStorage.getItem('zuzu_wallet_try'); if(!tryname) return;
    let n=0; const t=setInterval(()=>{
      if (hasProvider(tryname)){ clearInterval(t); connect(tryname); localStorage.removeItem('zuzu_wallet_try'); }
      else if(++n>80){ clearInterval(t); }
    },500);
  })();
})();
