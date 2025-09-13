/* =========================
   CONFIG (RPC + network)
========================= */
const CONFIG = {
  launchKey: "zuzu_launchAt",
  defaultCountdownDays: 60,

  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100],
  nfts: Array.from({ length: 10 }).map((_, i) => ({
    id: i, name: `ZUZU #${i + 1}`, rarity: i % 5 === 0 ? 'Legendary' : (i % 2 ? 'Rare' : 'Epic')
  })),

  // Solana
  cluster: "devnet", // QuickNode URL'in devnet olduğu için
  treasury: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF",
  rpcUrl: "https://silent-frequent-bird.solana-devnet.quiknode.pro/e0ed937fff5bf2985f977a6bdb352b9769d32af2/",

  // Storage keys
  LS_ADDR: "zuzu_connected_addr",
  LS_WALLET: "zuzu_connected_wallet",
  LS_LANG: "zuzu_lang",

  // Session flags (deeplink round-trip)
  SS_AWAIT: "zuzu_await_wallet",
  SS_TARGET: "zuzu_target_wallet"
};

const $  = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];
const UA = navigator.userAgent || "";
const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(UA);
const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

/* =========================
   WALLET CONNECT (Phantom + Solflare)
   - Masaüstünde: extension ile bağlanır
   - Mobil tarayıcıda provider yoksa: otomatik deeplink ile cüzdan içi browser’da siteyi açar
========================= */
const Wallets = {
  phantom:{
    key:'phantom', label:'Phantom', icon:'assets/images/wallets/phantom.png',
    has:()=> !!(window.phantom?.solana?.isPhantom || window.solana?.isPhantom || window.solana?.isPhantomApp),
    provider:()=> window.phantom?.solana || window.solana,
    deeplink:(url)=>`https://phantom.app/ul/browse/${encodeURIComponent(url)}?network=${encodeURIComponent(CONFIG.cluster)}`,
    async connect(){
      let p=this.provider(); if(!p){ await sleep(250); p=this.provider(); }
      if(!p) throw new Error("no provider");
      try{ const r=await p.connect?.({onlyIfTrusted:true}); const pk=(r?.publicKey||p.publicKey); if(pk) return pk.toString(); }catch(_){}
      const r2=await p.connect(); return (r2?.publicKey||p.publicKey).toString();
    },
    async disconnect(){ try{ await this.provider()?.disconnect?.(); }catch{} }
  },
  solflare:{
    key:'solflare', label:'Solflare', icon:'assets/images/wallets/solflare.png',
    has:()=> !!(window.solflare?.isSolflare || typeof window.solflare?.connect==="function"),
    provider:()=> window.solflare,
    deeplink:(url)=>`https://solflare.com/ul/v1/browse/${encodeURIComponent(url)}?network=${encodeURIComponent(CONFIG.cluster)}`,
    async connect(){
      let p=this.provider(); if(!p){ await sleep(250); p=this.provider(); }
      if(!p) throw new Error("no provider");
      try{ const r=await p.connect?.({onlyIfTrusted:true}); const pk=(r?.publicKey||p.publicKey); if(pk) return pk.toString(); }catch(_){}
      const r2=await p.connect(); return (r2?.publicKey||p.publicKey).toString();
    },
    async disconnect(){ try{ await this.provider()?.disconnect?.(); }catch{} }
  }
};

let CURRENT_ADDRESS = null;
let CURRENT_WALLET  = null;

function walletListHTML(){
  return Object.values(Wallets).map(w=>`
    <button class="wbtn" data-key="${w.key}">
      <img src="${w.icon}" alt="${w.label}" width="22" height="22">
      <span>${w.label}</span>
    </button>`).join("");
}

(function initWalletUI(){
  const modal = $("#walletModal");
  const list  = $("#wlist");
  if(list) list.innerHTML = walletListHTML();

  function bindConnectButtons(){
    const all = [$("#connectBtn"), ...$$("[data-connect]")].filter(Boolean);
    all.forEach(btn=>{
      if(btn.dataset._bind) return;
      btn.dataset._bind = "1";
      btn.addEventListener("click", ()=>{
        const direct = Wallets.phantom.has() ? Wallets.phantom :
                       (Wallets.solflare.has() ? Wallets.solflare : null);
        if(direct){ connectFlow(direct.key); }
        else{
          // MOBİL tarayıcıda provider yoksa: otomatik cüzdana taşı
          if(IS_MOBILE){
            const target = "phantom"; // çoğunluk Phantom
            const urlNow = location.href;
            const dl = Wallets[target].deeplink(urlNow);
            location.assign(dl);
          }else{
            modal?.classList.add("show");
          }
        }
      });
    });
  }
  bindConnectButtons();

  list?.addEventListener("click", e=>{
    const btn = e.target.closest(".wbtn"); if(!btn) return;
    connectFlow(btn.dataset.key);
  });

  $("[data-open='phantom']")?.addEventListener("click", ()=>connectFlow("phantom"));
  $("[data-open='solflare']")?.addEventListener("click", ()=>connectFlow("solflare"));

  $("#wmClose")?.addEventListener("click", ()=>modal?.classList.remove("show"));
  modal?.addEventListener("click", (e)=>{ if(e.target===modal) modal.classList.remove("show"); });

  const savedAddr   = localStorage.getItem(CONFIG.LS_ADDR);
  const savedWallet = localStorage.getItem(CONFIG.LS_WALLET);
  if(savedAddr && savedWallet){ onConnected(savedWallet, savedAddr, {silent:true}); }
  else { setBuyButtonsEnabled(false); }

  new MutationObserver(bindConnectButtons).observe(document.body, {subtree:true, childList:true});

  window.addEventListener("solana#initialized", ()=>{ /* no-op */ }, {once:false});
})();

async function connectFlow(key){
  const impl = Wallets[key]; if(!impl) return;
  const modal = $("#walletModal");
  const nowUrl = location.href;

  if(!impl.has() && IS_MOBILE){
    sessionStorage.setItem(CONFIG.SS_AWAIT, "1");
    sessionStorage.setItem(CONFIG.SS_TARGET, key);
    modal?.classList.remove("show");
    const targetUrl = impl.deeplink(nowUrl);
    location.assign(targetUrl);
    return;
  }

  if(!impl.has() && !IS_MOBILE){
    modal?.classList.add("show");
    alert(`${impl.label} eklentisi bulunamadı. Lütfen ${impl.label} extension’ını kurup tekrar deneyin.`);
    return;
  }

  try{
    const addr = await withRetry(()=>impl.connect(), 2, 300);
    onConnected(key, addr);
    modal?.classList.remove("show");
  }catch(err){
    console.warn("wallet connect failed:", err);
    alert("Cüzdan bağlantısı iptal edildi veya başarısız.");
  }
}

function withRetry(fn, tries=2, wait=250){
  return new Promise(async (resolve, reject)=>{
    let lastErr;
    for(let i=0;i<tries;i++){
      try{ const v = await fn(); return resolve(v); }
      catch(e){ lastErr = e; await sleep(wait); }
    }
    reject(lastErr||new Error("failed"));
  });
}

function onConnected(key, addr, opts={}){
  CURRENT_ADDRESS = addr;
  CURRENT_WALLET  = key;
  localStorage.setItem(CONFIG.LS_ADDR, addr);
  localStorage.setItem(CONFIG.LS_WALLET, key);
  [$("#connectBtn"), ...$$("[data-connect]")].forEach(btn=>{
    if(btn) btn.textContent = `${addr.slice(0,6)}...${addr.slice(-4)}`;
  });
  const out = $("#refLink"); if(out) out.value = `${location.origin}${location.pathname}?ref=${addr}`;
  setBuyButtonsEnabled(true);
  if(!opts.silent) console.log("Connected:", key, addr);
}

/* =========================
   BUY — On-chain transfer (SOL)
   - web3.js ile blockhash alır (QuickNode RPC)
   - kullanıcı cüzdanında sign + send
========================= */

function setBuyButtonsEnabled(ok){
  ["buyW0","buyW1","buyW2","buyW3"].forEach(id=>{
    const b = document.getElementById(id); if(!b) return;
    b.disabled = !ok; b.style.opacity = ok ? "1" : ".5"; b.style.pointerEvents = ok ? "auto" : "none";
  });
}

// haftayı şimdilik 0 kabul edelim (sen mantığı değiştirebilirsin)
function activeWeek(){ return 0; }

// butonlar
["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
  const b = $("#"+id); if(!b) return;
  b.addEventListener("click", ()=>handleBuy(i));
});

// QuickNode üzerinden connection
function getConn(){
  return new solanaWeb3.Connection(CONFIG.rpcUrl, { commitment: "confirmed" });
}

// ZUZU fiyatından SOL’a kaba çeviri (örnek). Gerçekte backend’den fiyat çekmelisin.
async function usdtToSol(usdt){
  // DEVNET olduğu için örnek oran: 1 SOL = 100 USDT (sadece demo)
  return usdt / 100;
}

async function handleBuy(weekIdx){
  try{
    const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
    if(qty<=0){ alert("Geçerli miktar gir."); return; }
    if(weekIdx!==activeWeek()){ alert("Bu hafta aktif değil."); return; }
    if(!CURRENT_ADDRESS){ alert("Önce cüzdan bağla."); return; }

    const price = CONFIG.weekPrices[weekIdx];
    const usdtCost = qty * price;
    const solAmount = await usdtToSol(usdtCost);

    const provider = (CURRENT_WALLET==="phantom" ? Wallets.phantom.provider() : Wallets.solflare.provider());
    if(!provider) throw new Error("wallet provider yok");

    // web3.js ile transfer tx’i hazırla
    const conn = getConn();
    const fromPub = new solanaWeb3.PublicKey(CURRENT_ADDRESS);
    const toPub   = new solanaWeb3.PublicKey(CONFIG.treasury);

    const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash("finalized");
    const tx = new solanaWeb3.Transaction({
      feePayer: fromPub,
      recentBlockhash: blockhash
    }).add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: fromPub,
        toPubkey: toPub,
        lamports: Math.round(solanaWeb3.LAMPORTS_PER_SOL * solAmount)
      })
    );

    // Phantom & Solflare: signAndSendTransaction veya 2 adım kullanılabilir
    let sig;
    if(provider.signAndSendTransaction){
      const res = await provider.signAndSendTransaction(tx);
      sig = res.signature || res; // phantom {signature} döndürür
    }else if(provider.signTransaction){
      const signed = await provider.signTransaction(tx);
      const raw = signed.serialize();
      sig = await conn.sendRawTransaction(raw);
    }else{
      throw new Error("wallet sign method yok");
    }

    // confirmation
    await conn.confirmTransaction({ signature:sig, blockhash, lastValidBlockHeight }, "confirmed");
    alert("Ödeme alındı!\nTX: "+sig);
  }catch(err){
    console.error(err);
    alert("İşlem iptal/başarısız: "+(err.message||err));
  }
}
