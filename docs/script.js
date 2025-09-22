/* ========================= CONFIG (QuikNode + Backend) ========================= */
const CONFIG = {
  rpc: "https://silent-frequent-bird.solana-mainnet.quiknode.pro/xxxxxxxxxxxx/",
  cluster: "mainnet-beta",
  treasury: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF",

  // <-- BURAYA kendi backend adresini yaz (Render/Railway vs)
  backendUrl: "https://SENIN-BACKEND-URLIN", // örn: https://zuzu-backend.onrender.com

  // Countdown
  launchKey: "zuzu_launchAt",
  launchKeyVersion: "v2",          // versiyonlayarak eski kayıtları sıfırlar
  defaultCountdownDays: 60,        // 60 gün

  // Presale fiyatları
  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100], // USDT

  // LS keys
  LS_ADDR: "zuzu_connected_addr",
  LS_WALLET: "zuzu_connected_wallet",
  LS_LANG: "zuzu_lang"
};

/* ========================= i18n (EN/TR/FR/PT/RU/ES) ========================= */
const I = {
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",hero_lead:"Stake and win **ZUZU Maskot NFT**. Limited supply, high **utility**.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! **Limited allocation**, community price.",
      amount:"Amount (ZUZU)",cost:"Cost:",buy:"Buy",exchanges:"Supported Exchanges",
      stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn **APY + NFT BOOST**.",
      token_title:"Tokenomics (Visualized)",road_title:"Roadmap"},
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",hero_lead:"Stake et ve **ZUZU Maskot NFT** kazan. Sınırlı arz, yüksek **utility**.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! **Sınırlı tahsis**, topluluğa özel fiyat.",
      amount:"Miktar (ZUZU)",cost:"Maliyet:",buy:"Satın Al",exchanges:"Desteklenen Borsalar",
      stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, **APY + NFT BOOST** ile kazan.",
      token_title:"Tokonomi (Görsel)",road_title:"Yol Haritası"},
  fr:{nav_presale:"Pré-vente",nav_stake:"Stake",nav_nft:"Récompenses NFT",nav_roadmap:"Feuille de route",nav_token:"Tokenomics",connect:"Connecter le Wallet",
      hero_badge:"Pré-vente • Stake pour gagner un NFT",hero_title:"ZUZU — Hérisson Robotique 🦔⚡",hero_lead:"Stake et gagne un **NFT Mascotte ZUZU**.",
      cta_stake:"Commencer le Stake",cta_nft:"Récompenses NFT",days:"JOURS",hours:"HEURES",mins:"MINUTES",secs:"SECONDES",
      presale_title:"Pré-vente — Compte à rebours",presale_lead:"Prépare-toi pour la pré-vente ZUZU ! **Allocation limitée**.",
      amount:"Montant (ZUZU)",cost:"Coût :",buy:"Acheter",exchanges:"Bourses prises en charge",
      stake_title:"Stake Pro — Verrouille, Gagne, Reçois un NFT ✨",stake_lead:"Verrouille ton ZUZU et gagne **APY + BOOST NFT**.",
      token_title:"Tokenomics (Visualisé)",road_title:"Feuille de route"},
  pt:{nav_presale:"Pré-venda",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Roteiro",nav_token:"Tokenomics",connect:"Conectar Carteira",
      hero_badge:"Pré-venda • Stake para ganhar NFT",hero_title:"ZUZU — Ouriço Robótico 🦔⚡",hero_lead:"Faça stake e ganhe **NFT Mascote ZUZU**.",
      cta_stake:"Começar Stake",cta_nft:"Recompensas NFT",days:"DIAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",
      presale_title:"Pré-venda — Contagem regressiva",presale_lead:"Prepare-se para a pré-venda ZUZU! **Alocação limitada**.",
      amount:"Quantidade (ZUZU)",cost:"Custo:",buy:"Comprar",exchanges:"Exchanges suportadas",
      stake_title:"Stake Pro — Trave, Ganhe, Receba NFT ✨",stake_lead:"Trave seu ZUZU e ganhe **APY + BOOST NFT**.",
      token_title:"Tokenomics (Visualizado)",road_title:"Roteiro"},
  ru:{nav_presale:"Предпродажа",nav_stake:"Стейкинг",nav_nft:"NFT награды",nav_roadmap:"Дорожная карта",nav_token:"Токеномика",connect:"Подключить кошелёк",
      hero_badge:"Предпродажа • Стейкинг для NFT",hero_title:"ЗУЗУ — Робо-Ёж 🦔⚡",hero_lead:"Стейкай и получай **маскот NFT ZUZU**.",
      cta_stake:"Начать стейкинг",cta_nft:"NFT награды",days:"ДНИ",hours:"ЧАСЫ",mins:"МИН.",secs:"СЕК.",
      presale_title:"Предпродажа — Обратный отсчёт",presale_lead:"Готовься к предпродаже ZUZU! **Ограниченная аллокация**.",
      amount:"Количество (ZUZU)",cost:"Стоимость:",buy:"Купить",exchanges:"Поддерживаемые биржи",
      stake_title:"Stake Pro — Заморозь, Заработай, Получи NFT ✨",stake_lead:"Заморозь ZUZU и получай **APY + NFT BOOST**.",
      token_title:"Токеномика (визуально)",road_title:"Дорожная карта"},
  es:{nav_presale:"Pre-venta",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Hoja de ruta",nav_token:"Tokenomics",connect:"Conectar Billetera",
      hero_badge:"Pre-venta • Stake para ganar NFT",hero_title:"ZUZU — Erizo Robótico 🦔⚡",hero_lead:"Haz stake y gana **NFT Mascota ZUZU**.",
      cta_stake:"Empezar Stake",cta_nft:"Recompensas NFT",days:"DÍAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",
      presale_title:"Pre-venta — Cuenta regresiva",presale_lead:"¡Prepárate para la pre-venta ZUZU! **Asignación limitada**.",
      amount:"Cantidad (ZUZU)",cost:"Costo:",buy:"Comprar",exchanges:"Exchanges compatibles",
      stake_title:"Stake Pro — Bloquea, Gana, Obtén NFT ✨",stake_lead:"Bloquea tu ZUZU y gana **APY + BOOST NFT**.",
      token_title:"Tokenomics (Visualizado)",road_title:"Hoja de ruta"}
};

/* helpers */
const $  = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];

/* Lang */
function applyLang(lang){
  localStorage.setItem(CONFIG.LS_LANG, lang);
  $("#langCode") && ($("#langCode").textContent = lang.toUpperCase());
  $("#langFlag") && ($("#langFlag").src = `flags/${lang}.png`);
  $$("[data-i]").forEach(el=>{
    const k=el.getAttribute("data-i");
    if(I[lang] && I[lang][k]) el.innerHTML = I[lang][k];
  });
}
(function initLang(){
  const saved = localStorage.getItem(CONFIG.LS_LANG) || "en";
  applyLang(saved);
  const langBtn=$("#langBtn"), langMenu=$("#langMenu");
  if(langBtn && langMenu){
    langBtn.addEventListener("click", (e)=>{ e.stopPropagation(); langMenu.classList.toggle("show"); });
    $$(".lang-opt").forEach(b=>b.addEventListener("click", (e)=>{
      e.stopPropagation(); applyLang(b.dataset.lang); langMenu.classList.remove("show");
    }));
    document.addEventListener("click", (e)=>{
      if(!langMenu?.contains(e.target) && e.target!==langBtn) langMenu?.classList.remove("show");
    });
  }
})();

/* ========================= Countdown (her zaman bugünden +60 gün) ========================= */
function storageKey(){ return `${CONFIG.launchKey}:${CONFIG.launchKeyVersion}`; }
function ensureFutureTs(ts){
  const now = Date.now();
  const minTarget = now + CONFIG.defaultCountdownDays*24*3600*1000; // +60 gün
  if(!ts || isNaN(ts) || ts < now) return minTarget;
  return ts;
}
function getLaunchAt(){
  const url = new URL(location.href);
  let raw = localStorage.getItem(storageKey());
  if(url.searchParams.get("resetcd")==="1") raw = null; // manuel sıfırlama
  let ts = raw ? parseInt(raw,10) : NaN;
  ts = ensureFutureTs(ts);
  localStorage.setItem(storageKey(), ts.toString());
  return ts;
}
function tick(){
  const left = Math.max(0, getLaunchAt() - Date.now());
  const d=Math.floor(left/86400000);
  const h=Math.floor((left%86400000)/3600000);
  const m=Math.floor((left%3600000)/60000);
  const s=Math.floor((left%60000)/1000);
  const pad=n=>n.toString().padStart(2,"0");
  $("#cdDays")  && ($("#cdDays").textContent  = pad(d));
  $("#cdHours") && ($("#cdHours").textContent = pad(h));
  $("#cdMins")  && ($("#cdMins").textContent  = pad(m));
  $("#cdSecs")  && ($("#cdSecs").textContent  = pad(s));
}
tick(); setInterval(tick,1000);

/* ========================= Fiyat/maliyet ========================= */
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

/* ========================= NFT grid (örnek) ========================= */
(function renderNFTs(){
  const g=$("#nftGrid"); if(!g) return;
  g.innerHTML = Array.from({length:10}).map((_,i)=>`
    <div class="nft">
      <img src="assets/images/mask/${i}.png" alt="ZUZU #${i+1}" loading="lazy"
           onerror="this.style.display='none'">
      <div class="meta"><b>ZUZU #${i+1}</b><span class="tag">${i%5===0?'Legendary':(i%2?'Rare':'Epic')}</span></div>
    </div>`).join("");
})();

/* ========================= Invite link ========================= */
(function refLink(){
  const url = new URL(location.href);
  if(url.searchParams.get("ref")) localStorage.setItem("zuzu_refAddr", url.searchParams.get("ref"));
  const addr = localStorage.getItem("zuzu_refAddr") || "";
  const out = $("#refLink");
  const copyBtn = $("#copyRef");
  if(out){ out.value = `${location.origin}${location.pathname}?ref=${addr||"YOURCODE"}`; }
  copyBtn?.addEventListener("click", ()=>{
    navigator.clipboard.writeText(out.value); alert("Copied!");
  });
})();

/* ========================= Wallets (Phantom + Solflare) ========================= */
const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent||"");

const Wallets = {
  phantom:{
    key:'phantom', label:'Phantom', icon:'assets/images/wallets/phantom.png',
    has:()=> !!(window.phantom?.solana?.isPhantom || window.solana?.isPhantom),
    provider:()=> window.phantom?.solana || window.solana,
    async connect(){
      const p=this.provider(); if(!p) throw new Error("no provider");
      try{ const r=await p.connect({ onlyIfTrusted:true }); if(r?.publicKey) return r.publicKey.toString(); }catch(_){}
      const r2=await p.connect(); return (r2?.publicKey||p.publicKey).toString();
    },
    deeplink:(url)=>`https://phantom.app/ul/browse/${encodeURIComponent(url)}?network=${encodeURIComponent(CONFIG.cluster)}`
  },
  solflare:{
    key:'solflare', label:'Solflare', icon:'assets/images/wallets/solflare.png',
    has:()=> !!(window.solflare?.isSolflare || typeof window.solflare?.connect==="function"),
    provider:()=> window.solflare,
    async connect(){
      const p=this.provider(); if(!p) throw new Error("no provider");
      try{ const r=await p.connect({ onlyIfTrusted:true }); if(r?.publicKey) return r.publicKey.toString(); }catch(_){}
      const r2=await p.connect(); return (r2?.publicKey||p.publicKey).toString();
    },
    deeplink:(url)=>`https://solflare.com/ul/v1/browse/${encodeURIComponent(url)}?network=${encodeURIComponent(CONFIG.cluster)}`
  }
};

let CURRENT_ADDRESS = null;
let CURRENT_WALLET  = null;

function walletListHTML(){
  return Object.values(Wallets).map(w=>`
    <button class="wbtn" data-key="${w.key}">
      <img src="${w.icon}" alt="${w.label}" width="22" height="22"
           onerror="this.onerror=null; this.src='assets/images/wallets/${w.key}.svg'">
      <span>${w.label}</span>
    </button>`).join("");
}

(function initWalletUI(){
  const modal = $("#walletModal");
  const list  = $("#wlist");
  const btnConnect = $("#connectBtn");
  const btnClose = $("#wmClose");
  const btnDisconnect = $("#disconnectBtn");

  if(list) list.innerHTML = walletListHTML();

  // önceki oturum
  const savedAddr   = localStorage.getItem(CONFIG.LS_ADDR);
  const savedWallet = localStorage.getItem(CONFIG.LS_WALLET);
  if(savedAddr && savedWallet){
    onConnected(savedWallet, savedAddr, {silent:true});
  } else {
    setBuyButtonsEnabled(false);
  }

  // connect
  btnConnect?.addEventListener("click", ()=>{
    const direct = Wallets.phantom.has() ? Wallets.phantom : (Wallets.solflare.has() ? Wallets.solflare : null);
    if(direct){ connectFlow(direct.key); }
    else { modal?.classList.add("show"); modal?.removeAttribute("hidden"); }
  });

  // list
  list?.addEventListener("click", (e)=>{
    const btn = e.target.closest(".wbtn"); if(!btn) return; connectFlow(btn.dataset.key);
  });

  // close / backdrop
  btnClose?.addEventListener("click", ()=>{ modal?.classList.remove("show"); modal?.setAttribute("hidden",""); });
  modal?.addEventListener("click", (e)=>{ if(e.target===modal){ modal.classList.remove("show"); modal.setAttribute("hidden",""); } });

  // disconnect
  btnDisconnect?.addEventListener("click", async ()=>{
    try{ await Wallets[CURRENT_WALLET]?.provider()?.disconnect?.(); }catch{}
    CURRENT_ADDRESS=null; CURRENT_WALLET=null;
    localStorage.removeItem(CONFIG.LS_ADDR);
    localStorage.removeItem(CONFIG.LS_WALLET);
    $("#connectBtn") && ($("#connectBtn").textContent = I[(localStorage.getItem(CONFIG.LS_LANG)||"en")].connect || "Connect Wallet");
    setBuyButtonsEnabled(false);
    alert("Disconnected.");
  });
})();

async function connectFlow(key){
  const impl = Wallets[key]; if(!impl) return;
  const modal = $("#walletModal");
  const nowUrl = location.origin + location.pathname;

  if(!IS_MOBILE && impl.has()){
    try{
      const addr = await impl.connect();
      onConnected(key, addr); modal?.classList.remove("show"); modal?.setAttribute("hidden","");
      return;
    }catch(e){
      alert("Wallet connection rejected or failed."); return;
    }
  }
  // Mobil veya provider yok → cüzdan içi tarayıcı
  modal?.classList.remove("show"); modal?.setAttribute("hidden","");
  sessionStorage.setItem("zuzu_await_wallet","1");
  window.open(impl.deeplink(nowUrl), "_blank");
}

function onConnected(key, addr, opts={}){
  CURRENT_ADDRESS = addr; CURRENT_WALLET = key;
  localStorage.setItem(CONFIG.LS_ADDR, addr);
  localStorage.setItem(CONFIG.LS_WALLET, key);
  $("#connectBtn") && ($("#connectBtn").textContent = `${addr.slice(0,6)}...${addr.slice(-4)}`);
  $("#disconnectBtn") && ($("#disconnectBtn").style.display = "inline-flex");
  setBuyButtonsEnabled(true);
  if(!opts.silent) console.log("Connected:", key, addr);
}

/* ========================= Satın alma (Backend oranı + Solana Pay) ========================= */
function activeWeek(){ return 0; } // şu an Week 1 aktif varsayıldı
["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
  const b = $("#"+id); if(!b) return; b.addEventListener("click", ()=>handleBuy(i));
});
function setBuyButtonsEnabled(ok){
  ["buyW0","buyW1","buyW2","buyW3"].forEach(id=>{
    const b = document.getElementById(id); if(!b) return;
    b.disabled = !ok; b.style.opacity = ok ? "1" : ".5"; b.style.pointerEvents = ok ? "auto" : "none";
  });
}
async function handleBuy(weekIdx){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  if(qty<=0){ alert("Enter a valid amount."); return; }
  if(weekIdx!==activeWeek()){ alert("This week is not active."); return; }
  if(!CURRENT_ADDRESS){ alert("Connect wallet first (Phantom or Solflare)."); return; }

  const price = CONFIG.weekPrices[weekIdx];
  const usdtCost = qty * price;

  try{
    // backend'den SOL miktarını al
    const q = await fetch(`${CONFIG.backendUrl}/api/quote?usdt=${usdtCost}`).then(r=>r.json());
    const solAmount = Number(q.sol).toFixed(6);

    // Solana Pay URI — cüzdanlar otomatik yakalar
    const params = new URLSearchParams({
      amount: solAmount,
      reference: CURRENT_ADDRESS,
      label: "ZUZUCOIN Presale",
      message: "ZUZU presale payment"
    });
    const solanaPayUrl = `solana:${encodeURIComponent(CONFIG.treasury)}?${params.toString()}&network=${encodeURIComponent(CONFIG.cluster)}`;
    try{ window.open(solanaPayUrl, "_blank"); }catch{ location.href = solanaPayUrl; }
  }catch(e){
    console.error(e);
    alert("Quote failed. Backend URL doğru mu çalışıyor mu kontrol et.");
  }
}

/* ========================= Ticker görünür nudge ========================= */
(function ensureTickerVisible(){
  const t=$("#exTrack"); if(!t) return; t.style.transform="translateX(0)";
  setTimeout(()=>t.style.transform="", 60);
})();
