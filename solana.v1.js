// ========================================
// ZUZU — SOLANA WALLET (connect + payments)
// ========================================
(function(){
  const CFG = window.ZUZU_CONFIG || {};
  const I18N = window.ZUZU_I18N || {};
  const $ = id => document.getElementById(id);

  // UI helpers
  const setStatus = (t)=>{ const e=$("solanaStatus"); if(e) e.textContent=t; };
  const setAddr   = (a)=>{ const e=$("walletAddr"); if(e) e.textContent=a||"Not connected"; };
  const setBtnLbl = (t)=>{ const e=$("connectBtn"); if(e) e.textContent=t; };
  const short = a => a ? (a.slice(0,4)+"…"+a.slice(-4)) : "";

  // Provider detect
  function detect(){
    if (window.phantom?.solana) return {name:"phantom", adapter:window.phantom.solana};
    if (window.solana && (window.solana.isPhantom||window.solana.isBackpack)) return {name:(window.solana.isBackpack?"backpack":"phantom"), adapter:window.solana};
    if (window.solflare?.isSolflare) return {name:"solflare", adapter:window.solflare};
    if (window.backpack?.solana) return {name:"backpack", adapter:window.backpack.solana};
    return null;
  }

  // Mobile browser?
  function inMobileBrowser(){
    const ua=navigator.userAgent||"";
    const mobile=/Android|iPhone|iPad|iPod/i.test(ua);
    const inWallet=/Phantom|Solflare|Backpack/i.test(ua);
    return mobile && !inWallet;
  }

  // Deep-links (cüzdanın iç tarayıcıda siteyi açmak için)
  function deeplinkFor(name){
    const url = encodeURIComponent(location.href.split("#")[0]);
    if(name==="phantom")  return `https://phantom.app/ul/browse/${url}`;
    if(name==="solflare") return `https://solflare.com/ul/browse/${url}`;
    if(name==="backpack") return `https://backpack.app/ul/browse/${url}`;
    return null;
  }

  // Basit seçim modalı
  function ensureSheet(){
    let back = $("walletSheet");
    if(back) return back;
    back = document.createElement("div");
    back.id="walletSheet";
    back.className="z-modal-back";
    back.innerHTML=`<div class="z-modal">
      <h3>Cüzdan Seç</h3>
      <div class="z-list">
        <button data-w="phantom">Phantom</button>
        <button data-w="solflare">Solflare</button>
        <button data-w="backpack">Backpack</button>
      </div>
      <div class="muted-sm">Masaüstü: eklenti varsa doğrudan bağlanır.<br>Mobil: cüzdanın iç tarayıcısında açılır, “Bağlan” onayı gelir.</div>
      <div style="margin-top:8px"><button id="wsClose" class="z-btn z-btn-ghost" style="width:100%">Kapat</button></div>
    </div>`;
    back.addEventListener("click",e=>{ if(e.target===back) back.style.display="none"; });
    document.body.appendChild(back);
    $("wsClose").onclick = ()=> back.style.display="none";
    return back;
  }
  function openSheet(){ ensureSheet().style.display="flex"; }
  function closeSheet(){ const b=$("walletSheet"); if(b) b.style.display="none"; }

  let adapter=null, publicKey=null;
  const Rpc = new solanaWeb3.Connection("https://api.mainnet-beta.solana.com","confirmed");

  async function doConnect(a){
    const res = await a.connect({ onlyIfTrusted:false });
    const key = (res && res.publicKey) ? res.publicKey : a.publicKey;
    const b58 = key && key.toString ? key.toString() : String(key||"");
    adapter=a; publicKey=key;
    setStatus("Bağlandı"); setAddr(short(b58)); setBtnLbl(short(b58));
    window.__zuzuWallet = { adapter, publicKey };
  }

  async function start(choice){
    try{
      const f = detect();
      // Masaüstünde eklenti varsa direkt bağlan
      if(f && (!choice || f.name===choice)){ await doConnect(f.adapter); closeSheet(); return; }
      // Mobil tarayıcıdaysa deep-link
      if(inMobileBrowser()){
        const link=deeplinkFor(choice||"phantom");
        if(link){ location.href=link; return; }
      }
      alert("Phantom / Solflare / Backpack yükleyin lütfen.");
    }catch(e){ console.warn(e); alert("Wallet connect error."); }
  }

  async function disconnect(){
    try{ await adapter?.disconnect?.(); }catch(_){}
    adapter=null; publicKey=null;
    setStatus("Hazır (cüzdan bekleniyor)");
    setAddr("Not connected");
    setBtnLbl((I18N.tr?.connect)||"Cüzdan Bağla");
    window.__zuzuWallet = null;
  }

  function ready(){ return !!adapter; }
  function get(){ if(!adapter) throw new Error("Wallet not connected"); return {adapter, publicKey}; }

  // ÖDEME: SOL
  async function sendSOL(amountInputId){
    try{
      if(!ready()) await start();
      const {adapter, publicKey} = get();
      const to   = new solanaWeb3.PublicKey(CFG.ownerSol);
      const amount = parseFloat(($(amountInputId)?.value||"0").toString().replace(/[^\d.]/g,""))||0;
      if(amount<=0) return alert("Geçerli SOL miktarı gir.");
      const tx = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: publicKey, toPubkey: to, lamports: Math.round(amount * solanaWeb3.LAMPORTS_PER_SOL)
        })
      );
      tx.feePayer = publicKey;
      const {blockhash,lastValidBlockHeight}=await Rpc.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      const {signature}=await adapter.signAndSendTransaction(tx);
      await Rpc.confirmTransaction({signature, blockhash, lastValidBlockHeight}, "confirmed");
      alert("Success!\nTx: "+signature);
    }catch(e){ console.error(e); alert("SOL gönderimi başarısız: "+(e.message||e)); }
  }

  // ÖDEME: USDT (SPL)
  async function sendUSDT(amountInputId, usdtMint){
    try{
      if(!ready()) await start();
      const {adapter, publicKey}=get();
      const amount=parseFloat(($(amountInputId)?.value||"0").toString().replace(/[^\d.]/g,""))||0;
      if(amount<=0) return alert("Geçerli USDT miktarı gir.");
      const mint = new solanaWeb3.PublicKey(usdtMint || CFG.usdtMint);
      const toOwner = new solanaWeb3.PublicKey(CFG.ownerSol);

      const fromAta = await splToken.getAssociatedTokenAddress(mint, publicKey);
      const toAta   = await splToken.getAssociatedTokenAddress(mint, toOwner);

      const ix=[];
      const toInfo=await Rpc.getAccountInfo(toAta);
      if(!toInfo){
        ix.push(splToken.createAssociatedTokenAccountInstruction(
          publicKey, toAta, toOwner, mint
        ));
      }
      // USDT 6 decimals
      const qty = BigInt(Math.round(amount * 1e6));
      ix.push(splToken.createTransferInstruction(fromAta, toAta, publicKey, qty));

      const tx = new solanaWeb3.Transaction().add(...ix);
      tx.feePayer = publicKey;
      const {blockhash,lastValidBlockHeight}=await Rpc.getLatestBlockhash();
      tx.recentBlockhash = blockhash;

      const {signature}=await adapter.signAndSendTransaction(tx);
      await Rpc.confirmTransaction({signature,blockhash,lastValidBlockHeight},"confirmed");
      alert("Success!\nTx: "+signature);
    }catch(e){ console.error(e); alert("USDT gönderimi başarısız: "+(e.message||e)); }
  }

  // İlk durum
  function init(){
    setStatus("Hazır (cüzdan bekleniyor)");
    const f = detect();
    if(f && f.adapter?.publicKey){
      adapter=f.adapter; publicKey=f.adapter.publicKey;
      const b58=publicKey.toString?publicKey.toString():String(publicKey);
      setAddr(short(b58)); setBtnLbl(short(b58));
      window.__zuzuWallet={adapter,publicKey};
    }
    // sheet içinde seçimleri bağla
    const back=ensureSheet();
    back.querySelectorAll("[data-w]").forEach(b=>{
      b.addEventListener("click", ()=>start(b.getAttribute("data-w")));
    });
  }

  // Public API
  window.ZUZU_Solana = {
    init,
    open: openSheet,
    start,
    disconnect,
    ready,
    get,
    sendSOL,
    sendUSDT
  };

  // otomatik init
  if(document.readyState==="loading"){ document.addEventListener("DOMContentLoaded", init); }
  else { init(); }
})();
