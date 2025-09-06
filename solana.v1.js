// ===== Solana Connect + Purchase (simple) =====
(function(){
  const state = {
    wallet: null,
    pubkey: null,
    provider: null,   // 'phantom' | 'solflare' | 'backpack'
  };

  // Provider var mı?
  function hasProvider(which){
    if (which === 'phantom')  return !!(window.phantom && window.phantom.solana);
    if (which === 'solflare') return !!window.solflare;
    if (which === 'backpack') return !!window.backpack;
    return false;
  }

  // Ekrana yaz
  function setStatus(txt){ const s=document.getElementById('solStatus'); if(s) s.textContent=txt; }
  function setWalletLabel(pk){
    const el=document.getElementById('solWalletLabel');
    if (el) el.textContent = pk ? (pk.slice(0,4)+'...'+pk.slice(-4)) : 'Not connected';
    const btn=document.getElementById('connectBtn');
    if (btn && pk) btn.textContent = (pk.slice(0,4)+'...'+pk.slice(-4));
  }

  // Bağlan
  async function connect(which){
    try{
      if (!hasProvider(which)) {
        // mobile fallback: wallet-lite.js deep link ile açmıştık, dönüşte provider gelir
        setStatus('Wallet açılıyor…');
        return;
      }
      let w;
      if (which==='phantom') w = window.phantom.solana;
      if (which==='solflare') w = window.solflare;
      if (which==='backpack') w = window.backpack;

      const res = await w.connect({ onlyIfTrusted:false });
      state.wallet = w;
      state.provider = which;
      state.pubkey = res.publicKey.toString();
      setStatus('Bağlandı');
      setWalletLabel(state.pubkey);
      localStorage.setItem('zuzu_wallet_connected','1');
    }catch(e){
      console.warn('connect err', e);
      setStatus('Bağlantı reddedildi / hata');
    }
  }

  // Bağlantıyı kes
  async function disconnect(){
    try{ await state.wallet?.disconnect?.(); }catch(_){}
    state.wallet=null; state.pubkey=null; state.provider=null;
    setWalletLabel(null);
    setStatus('Hazır (cüzdan bekleniyor)');
    localStorage.removeItem('zuzu_wallet_connected');
  }

  // Satın al (sadece demo: amount USDT maliyeti hesaplar ve info verir)
  async function buyWithWeek(wi){
    if(!state.pubkey){ alert('Önce cüzdan bağla.'); return; }
    const qty = parseFloat((document.getElementById("buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
    if(qty<=0){ alert('Geçerli miktar gir.'); return; }
    const price = ZUZU_CONFIG.weekPrices[wi];
    const costUSDT = qty * price;
    alert(`(DEMO) ${qty} ZUZU için ödeyeceğin ~${costUSDT.toFixed(2)} USDT.\nGerçek transfer SPL-Token işlemi entegre edildiğinde burada imzalanacak.`);
  }

  // Global export
  window.ZUZU_SOL = { hasProvider, connect, disconnect, state };

  // UI: butonlar
  document.getElementById('btnSolConnect')?.addEventListener('click', ()=>{
    // modal aç
    window.ZUZU_WALLET.openChooser();
  });
  document.getElementById('btnSolDisconnect')?.addEventListener('click', disconnect);
  document.getElementById('connectBtn')?.addEventListener('click', ()=>{
    window.ZUZU_WALLET.openChooser();
  });
  ['buyW0','buyW1','buyW2','buyW3'].forEach((id,i)=>{
    const b=document.getElementById(id); if(!b) return;
    b.addEventListener('click', ()=>buyWithWeek(i));
  });

  // Dönüş sonrası provider geldi mi poll et (deep link flow)
  (function waitProvider(){
    const tryname = localStorage.getItem('zuzu_wallet_try');
    if (!tryname) return;
    let tries = 0;
    const t = setInterval(()=>{
      if (hasProvider(tryname)) {
        clearInterval(t);
        connect(tryname);
        localStorage.removeItem('zuzu_wallet_try');
      } else if (++tries>80) {
        clearInterval(t);
      }
    }, 500);
  })();

})();
