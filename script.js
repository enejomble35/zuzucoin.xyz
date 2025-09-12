/* =========================
   ZUZU — script.js (stable)
========================= */

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

  cluster: "mainnet-beta",
  treasury: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF",

  LS_ADDR: "zuzu_connected_addr",
  LS_WALLET: "zuzu_connected_wallet",
  LS_LANG: "zuzu_lang",

  SS_AWAIT: "zuzu_await_wallet",
  SS_TARGET: "zuzu_target_wallet"
};

/* small helpers */
const $  = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];
const UA = navigator.userAgent || "";
const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(UA);

/* =========================
   i18n (EN/TR minimal)
========================= */
const I = {
  en:{connect:"Connect Wallet",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS"},
  tr:{connect:"Cüzdan Bağla",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE"}
};
function applyLang(lang){
  localStorage.setItem(CONFIG.LS_LANG, lang);
  $("#langCode") && ($("#langCode").textContent = lang.toUpperCase());
  $("#langFlag") && ($("#langFlag").src = `flags/${lang}.png`);
  $$("[data-i]").forEach(el=>{
    const k=el.getAttribute("data-i");
    if(I[lang] && I[lang][k]) el.innerHTML=I[lang][k];
  });
}
(function initLang(){
  const saved = localStorage.getItem(CONFIG.LS_LANG) || "tr";
  applyLang(saved);
  $("#langBtn")?.addEventListener("click", ()=>$("#langMenu")?.classList.toggle("show"));
  $$(".lang-opt").forEach(b=>b.addEventListener("click", ()=>{
    applyLang(b.dataset.lang); $("#langMenu")?.classList.remove("show");
  }));
  document.addEventListener("click", (e)=>{
    if(!$("#langMenu")?.contains(e.target) && e.target!==$("#langBtn")) $("#langMenu")?.classList.remove("show");
  });
})();

/* =========================
   Countdown (60d persist)
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
   Price / cost boxes
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
      <img src="assets/images/mask/${n.id}.png?v=1" alt="${n.name}" loading="lazy" onerror="this.style.display='none'">
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
  copyBtn?.addEventListener("click", ()=>{ navigator.clipboard.writeText(out.value); alert("Copied!"); });
})();

/* =========================
   Wallet Connect (mobile/desktop)
========================= */

/* Data-URI ikon fallback (dosya eksikse yine görünür) */
const ICONS = {
  phantom:  "data:image/svg+xml;utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#7963f0"/><text x="24" y="30" text-anchor="middle" font-size="16" fill="#fff" font-family="Arial" font-weight="700">PH</text></svg>'),
  solflare: "data:image/svg+xml;utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#ff6b00"/><text x="24" y="30" text-anchor="middle" font-size="16" fill="#fff" font-family="Arial" font-weight="700">SF</text></svg>'),
  backpack: "data:image/svg+xml;utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#111"/><text x="24" y="30" text-anchor="middle" font-size="16" fill="#fff" font-family="Arial" font-weight="700">BP</text></svg>')
};

const Wallets = {
  phantom:{
    key:'phantom', label:'Phantom',
    icon: 'assets/images/wallets/phantom.png',
    has:()=> !!(window.phantom?.solana?.isPhantom || window.solana?.isPhantom || window.solana?.isPhantomApp),
    provider:()=> window.phantom?.solana || window.solana,
    deeplink:(url)=>`https://phantom.app/ul/browse/${encodeURIComponent(url)}?network=${encodeURIComponent(CONFIG.cluster)}`,
    async connect(){
      const p=this.provider();
      // bazı cüzdanlar injection'ı geç yapıyor → 2 deneme
      if(!p){ await sleep(250); }
      const prov = this.provider(); if(!prov) throw new Error("no provider");
      try{ const r=await prov.connect({ onlyIfTrusted:true }); const pk=(r?.publicKey||prov.publicKey); if(pk) return pk.toString(); }catch(_){}
      const r2=await prov.connect(); return (r2?.publicKey||prov.publicKey).toString();
    },
    async disconnect(){ try{ await this.provider()?.disconnect?.(); }catch{} }
  },
  solflare:{
    key:'solflare', label:'Solflare',
    icon: 'assets/images/wallets/solflare.png',
    has:()=> !!(window.solflare?.isSolflare || typeof window.solflare?.connect==="function"),
    provider:()=> window.solflare,
    deeplink:(url)=>`https://solflare.com/ul/v1/browse/${encodeURIComponent(url)}?network=${encodeURIComponent(CONFIG.cluster)}`,
    async connect(){
      const p=this.provider(); if(!p){ await sleep(250); }
      const prov=this.provider(); if(!prov) throw new Error("no provider");
      try{ const r=await prov.connect({ onlyIfTrusted:true }); const pk=(r?.publicKey||prov.publicKey); if(pk) return pk.toString(); }catch(_){}
      const r2=await prov.connect(); return (r2?.publicKey||prov.publicKey).toString();
    },
    async disconnect(){ try{ await this.provider()?.disconnect?.(); }catch{} }
  },
  backpack:{
    key:'backpack', label:'Backpack',
    icon: 'assets/images/wallets/backpack.png',
    has:()=> !!(window.backpack?.solana?.isBackpack || window.backpack?.isBackpack || window.xnft?.solana?.isBackpack),
    provider:()=> window.backpack?.solana || window.backpack || window.xnft?.solana,
    deeplink:(url)=>`https://backpack.app/ul/browse/${encodeURIComponent(url)}?network=${encodeURIComponent(CONFIG.cluster)}`,
    async connect(){
      const p=this.provider(); if(!p){ await sleep(250); }
      const prov=this.provider(); if(!prov) throw new Error("no provider");
      try{ const r=await prov.connect({ onlyIfTrusted:true }); const pk=(r?.publicKey||prov.publicKey); if(pk) return pk.toString(); }catch(_){}
      const r2=await prov.connect(); return (r2?.publicKey||prov.publicKey).toString();
    },
    async disconnect(){ try{ await this.provider()?.disconnect?.(); }catch{} }
  }
};

let CURRENT_ADDRESS = null;
let CURRENT_WALLET  = null;

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

function walletListHTML(){
  // PNG varsa göster, yoksa Data-URI’ye düş
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

  // tüm "connect" entry noktaları
  function bindConnectButtons(){
    const all = [$("#connectBtn"), ...$$("[data-connect]")].filter(Boolean);
    all.forEach(btn=>{
      if(btn.dataset._bind) return;
      btn.dataset._bind = "1";
      btn.addEventListener("click", ()=>{
        const direct = Wallets.phantom.has() ? Wallets.phantom :
                       (Wallets.solflare.has() ? Wallets.solflare :
                       (Wallets.backpack.has() ? Wallets.backpack : null));
        if(direct){ connectFlow(direct.key); }
        else{ modal?.classList.add("show"); }
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

  // stake/claim sayfalarında da çalışsın diye
  new MutationObserver(bindConnectButtons).observe(document.body, {subtree:true, childList:true});

  // wallet içindeysek injection gecikmesine karşı otomatik dene
  window.addEventListener("load", ()=>{ setTimeout(autoConnectIfReturned, 400); });
  document.addEventListener("visibilitychange", ()=>{ if(!document.hidden) autoConnectIfReturned(); });
})();

async function connectFlow(key){
  const impl = Wallets[key]; if(!impl) return;
  const modal = $("#walletModal");
  const nowUrl = location.href;

  // mobil dış tarayıcı → wallet app içinde aç
  if(!impl.has() && IS_MOBILE){
    try{
      sessionStorage.setItem(CONFIG.SS_AWAIT, "1");
      sessionStorage.setItem(CONFIG.SS_TARGET, key);
      modal?.classList.remove("show");
      const urlWithW = addUrlFlag(nowUrl, `w=${key}`);
      location.href = impl.deeplink(urlWithW);
      return;
    }catch{
      window.open(impl.deeplink(addUrlFlag(nowUrl, `w=${key}`)), "_blank");
      return;
    }
  }

  // masaüstü ve provider yok
  if(!impl.has() && !IS_MOBILE){
    modal?.classList.add("show");
    alert("Wallet eklentisi yok. Phantom/Solflare/Backpack kurup tekrar deneyin.");
    return;
  }

  // provider var → bağlan
  try{
    const addr = await withTimeout(impl.connect(), 20000);
    onConnected(key, addr);
    modal?.classList.remove("show");
  }catch(err){
    console.warn("wallet connect failed:", err);
    alert("Cüzdan bağlantısı iptal edildi veya başarısız.");
  }
}

function addUrlFlag(url, flagKV){
  try{
    const u = new URL(url);
    const [k,v] = flagKV.split("=");
    u.searchParams.set(k, v);
    return u.toString();
  }catch{ return url; }
}

async function autoConnectIfReturned(){
  const u = new URL(location.href);
  const qW = u.searchParams.get("w");
  const awaiting = sessionStorage.getItem(CONFIG.SS_AWAIT)==="1";
  const target   = sessionStorage.getItem(CONFIG.SS_TARGET);
  const want = qW || target || null;
  if(!want) return;
  const impl = Wallets[want]; if(!impl) return;

  if(impl.has()){
    try{
      const addr = await withTimeout(impl.connect(), 20000);
      onConnected(want, addr);
      sessionStorage.removeItem(CONFIG.SS_AWAIT);
      sessionStorage.removeItem(CONFIG.SS_TARGET);
      u.searchParams.delete("w");
      history.replaceState({}, "", u.toString());
    }catch(e){
      console.warn("autoConnect failed:", e);
    }
  }else if(awaiting){
    $("#walletModal")?.classList.add("show");
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

function withTimeout(promise, ms){
  return new Promise((resolve,reject)=>{
    const t = setTimeout(()=>reject(new Error("timeout")), ms);
    promise.then(v=>{ clearTimeout(t); resolve(v); }, e=>{ clearTimeout(t); reject(e); });
  });
}

/* =========================
   Buy (Phantom transfer deeplink)
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
function handleBuy(weekIdx){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  if(qty<=0){ alert("Geçerli miktar gir."); return; }
  if(weekIdx!==activeWeek()){ alert("Bu hafta aktif değil."); return; }
  if(!CURRENT_ADDRESS){ alert("Önce cüzdan bağla."); return; }

  const price = CONFIG.weekPrices[weekIdx];
  const usdtCost = qty * price;
  const solAmount = (usdtCost * 0.01).toFixed(4); // örnek kur

  const redirect = location.href;
  const deeplink = `https://phantom.app/ul/transfer`+
    `?recipient=${encodeURIComponent(CONFIG.treasury)}`+
    `&amount=${encodeURIComponent(solAmount)}`+
    `&asset=SOL`+
    `&reference=${encodeURIComponent(CURRENT_ADDRESS)}`+
    `&label=${encodeURIComponent("ZUZUCOIN Presale")}`+
    `&message=${encodeURIComponent("ZUZU presale payment")}`+
    `&network=${encodeURIComponent(CONFIG.cluster)}`+
    `&redirect_link=${encodeURIComponent(redirect)}`;

  const inPhantom = /Phantom/i.test(UA) || window.solana?.isPhantomApp;
  if(inPhantom){ location.href = deeplink; } else { window.open(deeplink, "_blank"); }

  alert(`Phantom transfer ekranı açılıyor (~${solAmount} SOL). İşlem sonrası bu sayfaya dönersin.`);
}

/* =========================
   small polish
========================= */
(function ensureTickerVisible(){
  const t=$("#exTrack"); if(!t) return;
  t.style.transform="translateX(0)"; setTimeout(()=>t.style.transform="", 60);
})();
