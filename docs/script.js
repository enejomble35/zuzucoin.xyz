/* =========================
   ZUZU — Unified Frontend Script
   - countdown (persist)
   - costs
   - nfts
   - referrals
   - wallet connect (Phantom / Solflare, mobile deeplink)
   - buy SOL (on-chain, QuickNode RPC)
========================= */

/* ---------- CONFIG ---------- */
const CONFIG = {
  // countdown
  launchKey: "zuzu_launchAt",
  defaultCountdownDays: 60,

  // pricing
  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100],

  // nft thumbs (put images into assets/images/mask/0.png ... 9.png)
  nfts: Array.from({ length: 10 }).map((_, i) => ({
    id: i, name: `ZUZU #${i + 1}`, rarity: i % 5 === 0 ? 'Legendary' : (i % 2 ? 'Rare' : 'Epic')
  })),

  // Solana network (DEVNET right now)
  cluster: "devnet",
  rpcUrl: "https://silent-frequent-bird.solana-devnet.quiknode.pro/e0ed937fff5bf2985f977a6bdb352b9769d32af2/",
  treasury: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF",

  // local/session keys
  LS_ADDR: "zuzu_connected_addr",
  LS_WALLET: "zuzu_connected_wallet",
  SS_AWAIT: "zuzu_await_wallet",
  SS_TARGET: "zuzu_target_wallet"
};

/* ---------- helpers ---------- */
const $  = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];
const UA = navigator.userAgent || "";
const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(UA);
const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

/* ---------- countdown (persistent) ---------- */
function getLaunchAt(){
  let ts = localStorage.getItem(CONFIG.launchKey);
  if(!ts){
    ts = (Date.now() + CONFIG.defaultCountdownDays*24*3600*1000).toString();
    localStorage.setItem(CONFIG.launchKey, ts);
  }
  return parseInt(ts,10);
}
function tick(){
  try{
    const left = Math.max(0, getLaunchAt() - Date.now());
    const d=Math.floor(left/86400000);
    const h=Math.floor((left%86400000)/3600000);
    const m=Math.floor((left%3600000)/60000);
    const s=Math.floor((left%60000)/1000);
    const pad=n=>n.toString().padStart(2,"0");
    $("#cdDays")  && ($("#cdDays").textContent = pad(d));
    $("#cdHours") && ($("#cdHours").textContent = pad(h));
    $("#cdMins")  && ($("#cdMins").textContent = pad(m));
    $("#cdSecs")  && ($("#cdSecs").textContent = pad(s));
  }catch(e){ console.warn("countdown err",e); }
}
tick(); setInterval(tick, 1000);

/* ---------- costs ---------- */
function updateCosts(){
  const inp = $("#buyAmount");
  const qty = parseFloat((inp?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  CONFIG.weekPrices.forEach((p,i)=>{
    $("#p"+i) && ($("#p"+i).textContent = p.toFixed(4));
    $("#c"+i) && ($("#c"+i).textContent = (qty*p).toLocaleString(undefined,{maximumFractionDigits:2}));
  });
}
$("#buyAmount")?.addEventListener("input", updateCosts);
updateCosts();

/* ---------- NFT grid ---------- */
(function renderNFTs(){
  const g=$("#nftGrid"); if(!g) return;
  g.innerHTML = CONFIG.nfts.map(n=>`
    <div class="nft">
      <img src="assets/images/mask/${n.id}.png" alt="${n.name}" loading="lazy"
           onerror="this.onerror=null;this.src='assets/images/branding/zuzu-logo.png'">
      <div class="meta"><b>${n.name}</b><span class="tag">${n.rarity}</span></div>
    </div>`).join("");
})();

/* ---------- referrals ---------- */
(function refLink(){
  const url = new URL(location.href);
  if(url.searchParams.get("ref")) localStorage.setItem("zuzu_refAddr", url.searchParams.get("ref"));
  const addr = localStorage.getItem("zuzu_refAddr") || "";
  const out = $("#refLink"); const copyBtn = $("#copyRef");
  if(out){ out.value = `${location.origin}${location.pathname}?ref=${addr||"YOURCODE"}`; }
  copyBtn?.addEventListener("click", ()=>{ navigator.clipboard.writeText(out.value); alert("Copied!"); });
})();

/* ---------- wallet connect ---------- */
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
      // eski click handler'ı komple değiştir
btn.addEventListener("click", ()=>{
  const direct = Wallets.phantom.has() ? Wallets.phantom :
                 (Wallets.solflare.has() ? Wallets.solflare : null);

  if(direct && !IS_MOBILE){
    // Masaüstü eklenti: direkt bağlan
    connectFlow(direct.key);
  }else{
    // Mobil veya eklenti yok: modal aç, kullanıcı seçsin
    const modal = document.getElementById("walletModal");
    modal?.classList.add("show");
  }
});
      });
    });
  }
  bindConnectButtons();

  list?.addEventListener("click", e=>{
    const btn = e.target.closest(".wbtn"); if(!btn) return;
    connectFlow(btn.dataset.key);
  });

  $("#wmClose")?.addEventListener("click", ()=>modal?.classList.remove("show"));
  modal?.addEventListener("click", (e)=>{ if(e.target===modal) modal.classList.remove("show"); });

  const savedAddr   = localStorage.getItem(CONFIG.LS_ADDR);
  const savedWallet = localStorage.getItem(CONFIG.LS_WALLET);
  if(savedAddr && savedWallet){ onConnected(savedWallet, savedAddr, {silent:true}); }
  else { setBuyButtonsEnabled(false); }

  // expose for other pages
  window.__zuzu_pubkey = ()=> CURRENT_ADDRESS || "";
})();

async function connectFlow(key){
  const impl = Wallets[key]; if(!impl) return;
  const modal = $("#walletModal");

  if(!impl.has() && IS_MOBILE){
    sessionStorage.setItem(CONFIG.SS_AWAIT, "1");
    sessionStorage.setItem(CONFIG.SS_TARGET, key);
    modal?.classList.remove("show");
    location.assign(impl.deeplink(location.href));
    return;
  }

  if(!impl.has() && !IS_MOBILE){
    modal?.classList.add("show");
    alert(`${impl.label} eklentisi bulunamadı.`);
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

/* ---------- BUY (SOL transfer, on-chain) ---------- */
function setBuyButtonsEnabled(ok){
  ["buyW0","buyW1","buyW2","buyW3"].forEach(id=>{
    const b = document.getElementById(id); if(!b) return;
    b.disabled = !ok; b.style.opacity = ok ? "1" : ".5"; b.style.pointerEvents = ok ? "auto" : "none";
  });
}
function activeWeek(){ return 0; }
["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
  const b = $("#"+id); if(!b) return;
  b.addEventListener("click", ()=>handleBuy(i));
});

function getConn(){
  return new solanaWeb3.Connection(CONFIG.rpcUrl, { commitment: "confirmed" });
}
// demo kuru: devnette 1 SOL ~ 100 USDT kabul ettik. (mainnette gerçek kura bağla)
async function usdtToSol(usdt){ return usdt / 100; }

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

    const conn = getConn();
    const fromPub = new solanaWeb3.PublicKey(CURRENT_ADDRESS);
    const toPub   = new solanaWeb3.PublicKey(CONFIG.treasury);

    const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash("finalized");
    const tx = new solanaWeb3.Transaction({ feePayer: fromPub, recentBlockhash: blockhash }).add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: fromPub,
        toPubkey: toPub,
        lamports: Math.round(solanaWeb3.LAMPORTS_PER_SOL * solAmount)
      })
    );

    let sig;
    if(provider.signAndSendTransaction){
      const res = await provider.signAndSendTransaction(tx);
      sig = res.signature || res;
    }else if(provider.signTransaction){
      const signed = await provider.signTransaction(tx);
      sig = await conn.sendRawTransaction(signed.serialize());
    }else{
      throw new Error("wallet sign method yok");
    }

    await conn.confirmTransaction({ signature:sig, blockhash, lastValidBlockHeight }, "confirmed");
    alert("Ödeme alındı! TX: "+sig);
  }catch(err){
    console.error(err);
    alert("İşlem iptal/başarısız: "+(err.message||err));
  }
}

/* ---------- small polish ---------- */
(function ensureTickerVisible(){
  const t=$("#exTrack"); if(!t) return;
  t.style.transform="translateX(0)"; setTimeout(()=>t.style.transform="", 60);
})();
