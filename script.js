/* =========================
   ZUZU — script.js (stabil, mobile-first)
   Son güncelleme: bağlanma/logolar/60g countdown/tek akış
========================= */

/* =========================
   CONFIG
========================= */
const CONFIG = {
  // 60 günlük geri sayım (ilk girişte başlar ve saklanır)
  launchKey: "zuzu_launchAt",
  defaultCountdownDays: 60,

  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100], // USDT
  nfts: Array.from({ length: 10 }).map((_, i) => ({
    id: i, name: `ZUZU #${i + 1}`, rarity: i % 5 === 0 ? 'Legendary' : (i % 2 ? 'Rare' : 'Epic')
  })),

  // Solana
  // Phantom deeplink paramı için doğru değer: "mainnet-beta"
  cluster: "mainnet-beta",
  // ✅ HAZİNE ADRESİN (senin verdiğin):
  treasury: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF",

  // LS keys
  LS_ADDR: "zuzu_connected_addr",
  LS_WALLET: "zuzu_connected_wallet",
  LS_LANG: "zuzu_lang",

  // Session (mobil deeplink round-trip)
  SS_AWAIT: "zuzu_await_wallet",
  SS_TARGET: "zuzu_target_wallet"
};

/* =========================
   i18n
========================= */
const I = {
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
      hero_lead:"Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high <b>utility</b>.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",
      amount:"Amount (ZUZU)",cost:"Cost:",buy:"Buy",exchanges:"Supported Exchanges",
      stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>.",
      token_title:"Tokenomics (Visualized)",road_title:"Roadmap"},
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",
      hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",
      amount:"Miktar (ZUZU)",cost:"Maliyet:",buy:"Satın Al",exchanges:"Desteklenen Borsalar",
      stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile kazan.",
      token_title:"Tokonomi (Görsel)",road_title:"Yol Haritası"}
  // (diğer diller mevcutsa aynı kalır)
};

/* =============== helpers =============== */
const $  = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];
const UA = navigator.userAgent || "";
const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(UA);

/* =============== Lang UI =============== */
function applyLang(lang){
  localStorage.setItem(CONFIG.LS_LANG, lang);
  $("#langCode") && ($("#langCode").textContent = lang.toUpperCase());
  $("#langFlag") && ($("#langFlag").src = `flags/${lang}.png`);
  document.querySelectorAll("[data-i]").forEach(el=>{
    const k=el.getAttribute("data-i");
    if(I[lang] && I[lang][k]) el.innerHTML=I[lang][k];
  });
}
(function initLang(){
  const saved = localStorage.getItem(CONFIG.LS_LANG) || "tr";
  applyLang(saved);
  const langBtn=$("#langBtn"), langMenu=$("#langMenu");
  if(langBtn && langMenu){
    langBtn.addEventListener("click", ()=>langMenu.classList.toggle("show"));
    $$(".lang-opt").forEach(b=>b.addEventListener("click", ()=>{
      applyLang(b.dataset.lang); langMenu.classList.remove("show");
    }));
    document.addEventListener("click", (e)=>{
      if(!langMenu.contains(e.target) && e.target!==langBtn) langMenu.classList.remove("show");
    });
  }
})();

/* =============== Countdown (60 gün) =============== */
function getLaunchAt(){
  let ts = localStorage.getItem(CONFIG.launchKey);
  if(!ts){
    const in60 = Date.now() + CONFIG.defaultCountdownDays*24*3600*1000;
    ts = in60.toString();
    localStorage.setItem(CONFIG.launchKey, ts);
  }
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
tick(); setInterval(tick,1000);

/* =============== Presale fiyat / maliyet =============== */
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

/* =============== NFT grid =============== */
(function renderNFTs(){
  const g=$("#nftGrid"); if(!g) return;
  g.innerHTML = CONFIG.nfts.map(n=>`
    <div class="nft">
      <img src="assets/images/mask/${n.id}.png?v=1" alt="${n.name}" loading="lazy"
           onerror="this.style.display='none'">
      <div class="meta"><b>${n.name}</b><span class="tag">${n.rarity}</span></div>
    </div>`).join("");
})();

/* =============== Invite link =============== */
(function refLink(){
  const url = new URL(location.href);
  if(url.searchParams.get("ref")) localStorage.setItem("zuzu_refAddr", url.searchParams.get("ref"));
  const addr = localStorage.getItem("zuzu_refAddr") || "";
  const out = $("#refLink"); const copyBtn = $("#copyRef");
  if(out){ out.value = `${location.origin}${location.pathname}?ref=${addr||"YOURCODE"}`; }
  if(copyBtn){ copyBtn.addEventListener("click", ()=>{ navigator.clipboard.writeText(out.value); alert("Copied!"); }); }
})();

/* =========================
   Wallet Connect — tek akış
   - Phantom / Solflare / Backpack
   - Mobil: provider yoksa wallet app içinde site
   - Wallet içi: otomatik connect()
   - Tüm sayfalardaki butonlar (#connectBtn + [data-connect])
========================= */

const Wallets = {
  phantom:{
    key:'phantom', label:'Phantom', icon:'assets/images/wallets/phantom.png',
    // Phantom tespit (in-app + extension)
    has:()=> !!(window.phantom?.solana?.isPhantom || window.solana?.isPhantom || window.solana?.isPhantomApp),
    provider:()=> window.phantom?.solana || window.solana,
    async connect(){
      const p=this.provider();
      try{ const r=await p.connect({onlyIfTrusted:true}); const pk=(r?.publicKey||p.publicKey); if(pk) return pk.toString(); }catch(_){}
      const r2=await p.connect(); return (r2?.publicKey||p.publicKey).toString();
    },
    async disconnect(){ try{ await this.provider()?.disconnect?.(); }catch{} },
    deeplink:(url)=>`https://phantom.app/ul/browse/${encodeURIComponent(url)}?network=${encodeURIComponent(CONFIG.cluster)}`
  },
  solflare:{
    key:'solflare', label:'Solflare', icon:'assets/images/wallets/solflare.png',
    has:()=> !!(window.solflare?.isSolflare || typeof window.solflare?.connect==="function"),
    provider:()=> window.solflare,
    async connect(){
      const p=this.provider();
      try{ const r=await p.connect({onlyIfTrusted:true}); const pk=(r?.publicKey||p.publicKey); if(pk) return pk.toString(); }catch(_){}
      const r2=await p.connect(); return (r2?.publicKey||p.publicKey).toString();
    },
    async disconnect(){ try{ await this.provider()?.disconnect?.(); }catch{} },
    deeplink:(url)=>`https://solflare.com/ul/v1/browse/${encodeURIComponent(url)}?network=${encodeURIComponent(CONFIG.cluster)}`
  },
  backpack:{
    key:'backpack', label:'Backpack', icon:'assets/images/wallets/backpack.png',
    has:()=> !!(window.backpack?.solana?.isBackpack || window.backpack?.isBackpack || window.xnft?.solana?.isBackpack),
    provider:()=> window.backpack?.solana || window.backpack || window.xnft?.solana,
    async connect(){
      const p=this.provider();
      try{ const r=await p.connect({onlyIfTrusted:true}); const pk=(r?.publicKey||p.publicKey); if(pk) return pk.toString(); }catch(_){}
      const r2=await p.connect(); return (r2?.publicKey||p.publicKey).toString();
    },
    async disconnect(){ try{ await this.provider()?.disconnect?.(); }catch{} },
    deeplink:(url)=>`https://backpack.app/ul/browse/${encodeURIComponent(url)}?network=${encodeURIComponent(CONFIG.cluster)}`
  }
};

let CURRENT_ADDRESS = null;
let CURRENT_WALLET  = null;

function walletListHTML(){
  // PNG → SVG → text fallback
  return Object.values(Wallets).map(w=>`
    <button class="wbtn" data-key="${w.key}">
      <img src="${w.icon}" alt="${w.label}" width="22" height="22"
        onerror="this.onerror=null;(this.src='assets/images/wallets/${w.key}.svg');this.onerror=function(){this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${w.label}' }))}">
      <span>${w.label}</span>
    </button>`).join("");
}

(function initWalletUI(){
  const modal = $("#walletModal");
  const list  = $("#wlist");
  if(list) list.innerHTML = walletListHTML();

  // Global “bağlan” butonları (navbar + stake/claim simülatör)
  function bindGlobalConnectButtons(){
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
  bindGlobalConnectButtons();

  // Modal liste tıklama
  list?.addEventListener("click", e=>{
    const btn = e.target.closest(".wbtn"); if(!btn) return;
    connectFlow(btn.dataset.key);
  });

  // Modal kapat
  $("#wmClose")?.addEventListener("click", ()=>modal?.classList.remove("show"));
  modal?.addEventListener("click", (e)=>{ if(e.target===modal) modal.classList.remove("show"); });

  // Kayıtlı oturum → geri yükle
  const savedAddr   = localStorage.getItem(CONFIG.LS_ADDR);
  const savedWallet = localStorage.getItem(CONFIG.LS_WALLET);
  if(savedAddr && savedWallet){ onConnected(savedWallet, savedAddr, {silent:true}); }
  else { setBuyButtonsEnabled(false); }

  // Stake/Claim gibi sonradan yüklenen butonlar için
  const mo = new MutationObserver(bindGlobalConnectButtons);
  mo.observe(document.body, {subtree:true, childList:true});

  // Wallet app içine dönmüşsek otomatik bağla
  autoConnectIfReturned();
})();

async function connectFlow(key){
  const impl = Wallets[key]; if(!impl) return;
  const modal = $("#walletModal");
  const urlNow = location.href;

  // Provider yoksa ve mobil isek → wallet app içinde siteyi aç
  if(!impl.has() && IS_MOBILE){
    try{
      sessionStorage.setItem(CONFIG.SS_AWAIT, "1");
      sessionStorage.setItem(CONFIG.SS_TARGET, key);
      modal?.classList.remove("show");
      // Aynı sayfaya döndüğümüzde w= ile tanıyacağız
      window.location.href = impl.deeplink(addUrlFlag(urlNow, `w=${key}`));
      return;
    }catch(e){
      window.open(impl.deeplink(addUrlFlag(urlNow, `w=${key}`)), "_blank");
      return;
    }
  }

  // Masaüstü ve provider yoksa → modalda kal
  if(!impl.has() && !IS_MOBILE){
    modal?.classList.add("show");
    alert("Wallet eklentisi yok. Phantom/Solflare/Backpack kurup tekrar deneyin.");
    return;
  }

  // Provider var → bağlan
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
      onConnected(want, addr, {silent:false});
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

  // Navbar + tüm sayfalardaki bağlan butonlarını güncelle
  [$("#connectBtn"), ...$$("[data-connect]")].forEach(btn=>{
    if(btn) btn.textContent = `${addr.slice(0,6)}...${addr.slice(-4)}`;
  });

  // Referans linki
  const out = $("#refLink"); if(out) out.value = `${location.origin}${location.pathname}?ref=${addr}`;

  // Satın al butonlarını aç
  setBuyButtonsEnabled(true);

  if(!opts.silent) console.log("Connected:", key, addr);
}

function withTimeout(promise, ms){
  return new Promise((resolve,reject)=>{
    const t = setTimeout(()=>reject(new Error("timeout")), ms);
    promise.then(v=>{ clearTimeout(t); resolve(v); }, e=>{ clearTimeout(t); reject(e); });
  });
}

/* =============== Satın alma (Phantom transfer deeplink) =============== */
function activeWeek(){ return 0; }

["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
  const b = $("#"+id); if(!b) return;
  b.addEventListener("click", ()=>handleBuy(i));
});

function setBuyButtonsEnabled(ok){
  ["buyW0","buyW1","buyW2","buyW3"].forEach(id=>{
    const b = document.getElementById(id); if(!b) return;
    b.disabled = !ok;
    b.style.opacity = ok ? "1" : ".5";
    b.style.pointerEvents = ok ? "auto" : "none";
  });
}

function handleBuy(weekIdx){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  if(qty<=0){ alert("Geçerli miktar gir."); return; }
  if(weekIdx!==activeWeek()){ alert("Bu hafta aktif değil."); return; }
  if(!CURRENT_ADDRESS){ alert("Önce cüzdan bağla."); return; }

  const price = CONFIG.weekPrices[weekIdx];
  const usdtCost = qty * price;

  // NOT: Aşağıdaki kur örnektir. Gerçek kur entegrasyonu eklenmedikçe kullanıcıya açıkça belirtilir.
  const solAmount = (usdtCost * 0.01).toFixed(4);

  // Phantom transfer deeplink
  const redirect = location.href; // işlem sonrası geri dönüş
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

  alert(`Phantom transfer ekranı açılacak (~${solAmount} SOL). İşlem sonrası siteye geri dönersin.`);
}

/* =============== ufak dokunuş =============== */
(function ensureTickerVisible(){
  const t=$("#exTrack"); if(!t) return;
  t.style.transform="translateX(0)"; setTimeout(()=>t.style.transform="", 60);
})();
