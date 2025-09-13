/* =========================
   CONFIG
========================= */
const CONFIG = {
  launchKey: "zuzu_launchAt",
  defaultCountdownDays: 60,

  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100],
  nfts: Array.from({ length: 10 }).map((_, i) => ({
    id: i, name: `ZUZU #${i + 1}`, rarity: i % 5 === 0 ? 'Legendary' : (i % 2 ? 'Rare' : 'Epic')
  })),

  // ağ / ödemeler
  cluster: "devnet", // test için devnet
  treasury: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF",

  // Storage keys
  LS_ADDR: "zuzu_connected_addr",
  LS_WALLET: "zuzu_connected_wallet",
  LS_LANG: "zuzu_lang",

  // Session flags (deeplink round-trip)
  SS_AWAIT: "zuzu_await_wallet",
  SS_TARGET: "zuzu_target_wallet"
};

/* helpers */
const $  = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];
const UA = navigator.userAgent || "";
const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(UA);
const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

/* =========================
   Countdown 60g (persist)
========================= */
function getLaunchAt(){
  let ts = localStorage.getItem(CONFIG.launchKey);
  if(!ts){ ts = (Date.now() + CONFIG.defaultCountdownDays*24*3600*1000).toString(); localStorage.setItem(CONFIG.launchKey, ts); }
  return parseInt(ts,10);
}
function tick(){
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
}
tick(); setInterval(tick, 1000);

/* =========================
   Costs
========================= */
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

/* =========================
   NFT grid
========================= */
(function renderNFTs(){
  const g=$("#nftGrid"); if(!g) return;
  g.innerHTML = CONFIG.nfts.map(n=>`
    <div class="nft">
      <img src="assets/images/mask/${n.id}.png" alt="${n.name}" loading="lazy" onerror="this.style.display='none'">
      <div class="meta"><b>${n.name}</b><span class="tag">${n.rarity}</span></div>
    </div>`).join("");
})();

/* =========================
   Invite link
========================= */
(function refLink(){
  const url = new URL(location.href);
  if(url.searchParams.get("ref")) localStorage.setItem("zuzu_refAddr", url.searchParams.get("ref"));
  const addr = localStorage.getItem("zuzu_refAddr") || "";
  const out = $("#refLink"); const copyBtn = $("#copyRef");
  if(out){ out.value = `${location.origin}${location.pathname}?ref=${addr||"YOURCODE"}`; }
  copyBtn?.addEventListener("click", ()=>{ navigator.clipboard.writeText(out.value); alert("Kopyalandı!"); });
})();

/* =========================
   Wallet Connect (Phantom & Solflare)
========================= */
const ICONS = {
  phantom:  "data:image/svg+xml;utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#7963f0"/><text x="24" y="30" text-anchor="middle" font-size="16" fill="#fff" font-family="Arial" font-weight="700">PH</text></svg>'),
  solflare: "data:image/svg+xml;utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#ff6b00"/><text x="24" y="30" text-anchor="middle" font-size="16" fill="#fff" font-family="Arial" font-weight="700">SF</text></svg>')
};

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
      <img src="${w.icon}" alt="${w.label}" width="22" height="22"
           onerror="this.onerror=null;this.src='${ICONS[w.key]}'">
      <span>${w.label}</span>
    </button>`).join("");
}

(function initWalletUI(){
  const modal = $("#walletModal");
  const list  = $("#wlist");
  if(list) list.innerHTML = walletListHTML();

  // connect buttons
  function bindConnectButtons(){
    const all = [$("#connectBtn"), ...$$("[data-connect]")].filter(Boolean);
    all.forEach(btn=>{
      if(btn.dataset._bind) return;
      btn.dataset._bind = "1";
      btn.addEventListener("click", ()=>{
        const direct = Wallets.phantom.has() ? Wallets.phantom :
                       (Wallets.solflare.has() ? Wallets.solflare : null);

        if(direct && !IS_MOBILE){
          // Masaüstü eklenti → direkt bağlan
          connectFlow(direct.key);
        }else{
          // Mobil veya eklenti yok → modal aç
          modal?.classList.add("show");
        }
      });
    });
  }
  bindConnectButtons();

  // modal seçim
  list?.addEventListener("click", e=>{
    const btn = e.target.closest(".wbtn"); if(!btn) return;
    connectFlow(btn.dataset.key);
  });

  // modal kapat
  $("#wmClose")?.addEventListener("click", ()=>modal?.classList.remove("show"));
  modal?.addEventListener("click", (e)=>{ if(e.target===modal) modal.classList.remove("show"); });

  // önceki oturumu yükle
  const savedAddr   = localStorage.getItem(CONFIG.LS_ADDR);
  const savedWallet = localStorage.getItem(CONFIG.LS_WALLET);
  if(savedAddr && savedWallet){ onConnected(savedWallet, savedAddr, {silent:true}); }
  else { setBuyButtonsEnabled(false); }

  // injection bekle
  window.addEventListener("solana#initialized", ()=>{ autoConnectIfReturned(); }, {once:false});
  window.addEventListener("load", ()=>{ setTimeout(autoConnectIfReturned, 500); });
  document.addEventListener("visibilitychange", ()=>{ if(!document.hidden) autoConnectIfReturned(); });

  new MutationObserver(bindConnectButtons).observe(document.body, {subtree:true, childList:true});
})();

async function connectFlow(key){
  const impl = Wallets[key]; if(!impl) return;
  const modal = $("#walletModal");
  const nowUrl = location.href;

  // Mobil + provider yok → seçilen cüzdanın deeplink'i ile siteyi o cüzdan içinde aç
  if(IS_MOBILE && !impl.has()){
    sessionStorage.setItem(CONFIG.SS_AWAIT, "1");
    sessionStorage.setItem(CONFIG.SS_TARGET, key);
    modal?.classList.remove("show");
    location.assign(impl.deeplink(nowUrl));
    return;
  }

  // Masaüstü & provider yok
  if(!impl.has() && !IS_MOBILE){
    modal?.classList.add("show");
    alert(`${impl.label} eklentisi bulunamadı.`);
    return;
  }

  // provider var → bağlan
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

async function autoConnectIfReturned(){
  const awaiting = sessionStorage.getItem(CONFIG.SS_AWAIT)==="1";
  const target   = sessionStorage.getItem(CONFIG.SS_TARGET);
  if(!awaiting || !target) return;
  const impl = Wallets[target]; if(!impl) return;

  if(impl.has()){
    try{
      const addr = await withRetry(()=>impl.connect(), 2, 250);
      onConnected(target, addr);
      sessionStorage.removeItem(CONFIG.SS_AWAIT);
      sessionStorage.removeItem(CONFIG.SS_TARGET);
    }catch(e){
      console.warn("autoConnect failed:", e);
    }
  }
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
   Buy (Solana Pay URL — cüzdan seçer)
========================= */
function activeWeek(){ return 0; }
["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
  const b = $("#"+id); if(!b) return;
  b.addEventListener("click", ()=>handleBuy(i));
});
function setBuyButtonsEnabled(ok){
  ["buyW0","buyW1","buyW2","buyW3"].forEach(id=>{
    const b = document.getElementById(id); if(!b) return;
    b.disabled = !ok; b.style.opacity = ok ? "1" : ".5"; b.style.pointerEvents = ok ? "auto" : "none";
  });
}

function usdtToSol(usdt){ // demo sabit oran: 1 SOL ~ 100 USDT
  const SOL_PER_USDT = 1/100;
  return +(usdt * SOL_PER_USDT).toFixed(6);
}

function solanaPayUrl({recipient, amountSol, reference, label, message, cluster}){
  // Solana Pay standard URL
  const u = new URL(`solana:${recipient}`);
  u.searchParams.set("amount", amountSol.toString());
  if(label)   u.searchParams.set("label", label);
  if(message) u.searchParams.set("message", message);
  if(reference) u.searchParams.set("reference", reference);
  if(cluster && cluster!=="mainnet-beta") u.searchParams.set("cluster", cluster);
  return u.toString();
}

function handleBuy(weekIdx){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  if(qty<=0){ alert("Geçerli miktar gir."); return; }
  if(weekIdx!==activeWeek()){ alert("Bu hafta aktif değil."); return; }
  if(!CURRENT_ADDRESS){ alert("Önce cüzdan bağla."); return; }

  const price = CONFIG.weekPrices[weekIdx];
  const usdtCost = qty * price;
  const amountSol = usdtToSol(usdtCost);

  const url = solanaPayUrl({
    recipient: CONFIG.treasury,
    amountSol,
    reference: CURRENT_ADDRESS,
    label: "ZUZUCOIN Presale",
    message: "ZUZU presale payment",
    cluster: CONFIG.cluster
  });

  // Solana Pay linki → mobilde cüzdan app'i, masaüstünde Phantom/Solflare açar
  window.location.href = url;
}

/* =========================
   small polish
========================= */
(function ensureTickerVisible(){
  const t=$("#exTrack"); if(!t) return;
  t.style.transform="translateX(0)"; setTimeout(()=>t.style.transform="", 60);
})();
