/* =========================
   CONFIG
========================= */
const CONFIG = {
  launchKey: "zuzu_launchAt",
  defaultLaunchISO: "2025-12-31T23:59:59Z",

  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100], // USDT
  nfts: Array.from({ length: 10 }).map((_, i) => ({
    id: i, name: `ZUZU #${i + 1}`, rarity: i % 5 === 0 ? 'Legendary' : (i % 2 ? 'Rare' : 'Epic')
  })),

  // Solana
  cluster: "mainnet-beta",                 // deeplink için doğru değer
  treasury: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF",   // ✅ gerçek SOL hazine adresin

  // LS keys
  LS_ADDR: "zuzu_connected_addr",
  LS_WALLET: "zuzu_connected_wallet",
  LS_LANG: "zuzu_lang"
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
      token_title:"Tokonomi (Görsel)",road_title:"Yol Haritası"},
  fr:{nav_presale:"Pré-vente",nav_stake:"Stake",nav_nft:"Récompenses NFT",nav_roadmap:"Feuille de route",nav_token:"Tokenomics",connect:"Connecter le Wallet",
      hero_badge:"Pré-vente • Stake pour gagner un NFT",hero_title:"ZUZU — Hérisson Robotique 🦔⚡",
      hero_lead:"Stake et gagne un <b>NFT Mascotte ZUZU</b>.",cta_stake:"Commencer le Stake",cta_nft:"Récompenses NFT",
      days:"JOURS",hours:"HEURES",mins:"MINUTES",secs:"SECONDES",
      presale_title:"Pré-vente — Compte à rebours",presale_lead:"Prépare-toi pour la pré-vente ZUZU ! <b>Allocation limitée</b>.",
      amount:"Montant (ZUZU)",cost:"Coût :",buy:"Acheter",exchanges:"Bourses prises en charge",
      stake_title:"Stake Pro — Verrouille, Gagne, Reçois un NFT ✨",stake_lead:"Verrouille ton ZUZU et gagne <b>APY + BOOST NFT</b>.",
      token_title:"Tokenomics (Visualisé)",road_title:"Feuille de route"},
  pt:{nav_presale:"Pré-venda",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Roteiro",nav_token:"Tokenomics",connect:"Conectar Carteira",
      hero_badge:"Pré-venda • Stake para ganhar NFT",hero_title:"ZUZU — Ouriço Robótico 🦔⚡",
      hero_lead:"Faça stake e ganhe <b>NFT Mascote ZUZU</b>.",cta_stake:"Começar Stake",cta_nft:"Recompensas NFT",
      days:"DIAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",
      presale_title:"Pré-venda — Contagem regressiva",presale_lead:"Prepare-se para a pré-venda ZUZU! <b>Alocação limitada</b>.",
      amount:"Quantidade (ZUZU)",cost:"Custo:",buy:"Comprar",exchanges:"Exchanges suportadas",
      stake_title:"Stake Pro — Trave, Ganhe, Receba NFT ✨",stake_lead:"Trave seu ZUZU e ganhe <b>APY + BOOST NFT</b>.",
      token_title:"Tokenomics (Visualizado)",road_title:"Roteiro"},
  ru:{nav_presale:"Предпродажа",nav_stake:"Стейкинг",nav_nft:"NFT награды",nav_roadmap:"Дорожная карта",nav_token:"Токеномика",connect:"Подключить кошелёк",
      hero_badge:"Предпродажа • Стейкинг для NFT",hero_title:"ZUZU — Робо-Ёж 🦔⚡",
      hero_lead:"Стейкай и получай <b>маскот NFT ZUZU</b>.",cta_stake:"Начать стейкинг",cta_nft:"NFT награды",
      days:"ДНИ",hours:"ЧАСЫ",mins:"МИН.",secs:"СЕК.",
      presale_title:"Предпродажа — Обратный отсчёт",presale_lead:"Готовься к предпродаже ZUZU! <b>Ограниченная аллокация</b>.",
      amount:"Количество (ZUZU)",cost:"Стоимость:",buy:"Купить",exchanges:"Поддерживаемые биржи",
      stake_title:"Stake Pro — Заморозь, Заработай, Получи NFT ✨",stake_lead:"Заморозь ZUZU и получай <b>APY + NFT BOOST</b>.",
      token_title:"Токеномика (визуально)",road_title:"Дорожная карта"},
  es:{nav_presale:"Pre-venta",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Hoja de ruta",nav_token:"Tokenomics",connect:"Conectar Billetera",
      hero_badge:"Pre-venta • Stake para ganar NFT",hero_title:"ZUZU — Erizo Robótico 🦔⚡",
      hero_lead:"Haz stake y gana <b>NFT Mascota ZUZU</b>.",cta_stake:"Empezar Stake",cta_nft:"Recompensas NFT",
      days:"DÍAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",
      presale_title:"Pre-venta — Cuenta regresiva",presale_lead:"¡Prepárate para la pre-venta ZUZU! <b>Asignación limitada</b>.",
      amount:"Cantidad (ZUZU)",cost:"Costo:",buy:"Comprar",exchanges:"Exchanges compatibles",
      stake_title:"Stake Pro — Bloquea, Gana, Obtén NFT ✨",stake_lead:"Bloquea tu ZUZU y gana <b>APY + BOOST NFT</b>.",
      token_title:"Tokenomics (Visualizado)",road_title:"Hoja de ruta"}
};

/* =============== helpers =============== */
const $  = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];

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
  const saved = localStorage.getItem(CONFIG.LS_LANG) || "en";
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

/* =============== Countdown =============== */
function getLaunchAt(){
  let ts = localStorage.getItem(CONFIG.launchKey);
  if(!ts){ ts = new Date(CONFIG.defaultLaunchISO).getTime().toString(); localStorage.setItem(CONFIG.launchKey, ts); }
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
      <img src="assets/images/mask/${n.id}.png" alt="${n.name}" loading="lazy"
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
   Wallet Connect (Solana)
========================= */
const Wallets = {
  phantom:{
    key:'phantom', label:'Phantom', icon:'assets/images/wallets/phantom.png',
    has:()=>!!(window.solana && (window.solana.isPhantom || window.solana.isPhantomApp)),
    connect:async()=>{ const p=window.solana; const r=await p.connect({ onlyIfTrusted:false }); return (r?.publicKey||p.publicKey).toString(); },
    disconnect:async()=>{ try{ await window.solana.disconnect?.(); }catch{} },
    deeplink:(url)=>`https://phantom.app/ul/browse/${encodeURIComponent(url)}?ref=zuzu&network=${encodeURIComponent(CONFIG.cluster)}`
  },
  solflare:{
    key:'solflare', label:'Solflare', icon:'assets/images/wallets/solflare.png',
    has:()=>!!(window.solflare && (window.solflare.isSolflare || typeof window.solflare.connect==="function")),
    connect:async()=>{ const p=window.solflare; const r=await p.connect(); return (r?.publicKey||p.publicKey).toString(); },
    disconnect:async()=>{ try{ await window.solflare.disconnect?.(); }catch{} },
    deeplink:(url)=>`https://solflare.com/ul/v1/browse/${encodeURIComponent(url)}?ref=zuzu&network=${encodeURIComponent(CONFIG.cluster)}`
  },
  backpack:{
    key:'backpack', label:'Backpack', icon:'assets/images/wallets/backpack.png',
    has:()=>!!(window.backpack?.solana?.isBackpack || window.backpack?.isBackpack),
    connect:async()=>{ const p = window.backpack?.solana || window.backpack; const r=await p.connect(); return (r?.publicKey||p.publicKey).toString(); },
    disconnect:async()=>{ try{ await (window.backpack?.solana||window.backpack)?.disconnect?.(); }catch{} },
    deeplink:(url)=>`https://backpack.app/ul/browse/${encodeURIComponent(url)}?network=${encodeURIComponent(CONFIG.cluster)}`
  }
};

let CURRENT_ADDRESS = null;
let CURRENT_WALLET  = null;

function walletListHTML(){
  // PNG varsa onu göster; PNG yüklenemezse aynı klasördeki SVG’ye düş.
  return Object.values(Wallets).map(w=>`
    <button class="wbtn" data-key="${w.key}">
      <img src="${w.icon}" alt="${w.label}" width="22" height="22"
           onerror="this.onerror=null; this.src='assets/images/wallets/${w.key}.svg'">
      <span>${w.label}</span>
    </button>`).join("");
}

/* ----- modal lifecycle ----- */
(function initWalletModal(){
  const modal = $("#walletModal"); const list = $("#wlist");
  const btnConnect = $("#connectBtn"); const btnClose = $("#wmClose");
  const btnDisconnect = $("#disconnectBtn");
  if(!modal || !list || !btnConnect) return;

  list.innerHTML = walletListHTML();

  // geri yükle
  const savedAddr   = localStorage.getItem(CONFIG.LS_ADDR);
  const savedWallet = localStorage.getItem(CONFIG.LS_WALLET);
  if(savedAddr && savedWallet){
    CURRENT_ADDRESS = savedAddr;
    CURRENT_WALLET  = savedWallet;
    btnConnect.textContent = `${savedAddr.slice(0,6)}...${savedAddr.slice(-4)}`;
    btnDisconnect && (btnDisconnect.style.display = "inline-flex");
    setBuyButtonsEnabled(true); // bağlandıysa aktif
  }

  // backdrop & esc
  modal.addEventListener("click", (e)=>{ if(e.target === modal) modal.classList.remove("show"); });
  btnClose?.addEventListener("click", ()=>modal.classList.remove("show"));
  document.addEventListener("keydown",(e)=>{ if(e.key==="Escape") modal.classList.remove("show"); });

  // connect
  btnConnect.addEventListener("click", async ()=>{
    const direct = Wallets.phantom.has() ? Wallets.phantom :
                   (Wallets.solflare.has() ? Wallets.solflare :
                   (Wallets.backpack.has() ? Wallets.backpack : null));
    if(direct){ await connectFlow(direct.key); }
    else{ modal.classList.add("show"); }
  });

  // list click
  list.addEventListener("click", async (e)=>{
    const btn = e.target.closest(".wbtn"); if(!btn) return;
    await connectFlow(btn.dataset.key);
  });

  // disconnect
  btnDisconnect?.addEventListener("click", async ()=>{
    if(!CURRENT_WALLET) return;
    try{ await Wallets[CURRENT_WALLET]?.disconnect?.(); }catch{}
    CURRENT_WALLET = null; CURRENT_ADDRESS = null;
    localStorage.removeItem(CONFIG.LS_ADDR);
    localStorage.removeItem(CONFIG.LS_WALLET);
    $("#connectBtn").textContent = I[(localStorage.getItem(CONFIG.LS_LANG)||"en")].connect || "Connect Wallet";
    btnDisconnect.style.display = "none";
    setBuyButtonsEnabled(false);
    alert("Disconnected.");
  });

  if(!CURRENT_ADDRESS) setBuyButtonsEnabled(false); // başlangıçta kapalı
})();

async function connectFlow(key){
  const impl = Wallets[key];
  const modal = $("#walletModal");
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const nowUrl   = location.href;

  // mobil + provider yok → wallet içinde site
  if(!impl.has() && isMobile){
    modal?.classList.remove("show");
    sessionStorage.setItem("zuzu_await_wallet","1");
    window.open(impl.deeplink(nowUrl), "_blank");
    return;
  }

  try{
    const addr = await withTimeout(impl.connect(), 20000);
    onConnected(key, addr);
    modal?.classList.remove("show");
  }catch(err){
    if (sessionStorage.getItem("zuzu_await_wallet")==="1" && impl.has()){
      sessionStorage.removeItem("zuzu_await_wallet");
      try{
        const addr = await withTimeout(impl.connect(), 20000);
        onConnected(key, addr);
        return;
      }catch(e){}
    }
    console.warn("wallet connect failed:", err);
    if(!impl.has()){
      modal?.classList.add("show");
      alert("Wallet provider not found. Please install or open on mobile wallet.");
    }else{
      alert("Wallet connection rejected or failed.");
    }
  }
}

function onConnected(key, addr){
  CURRENT_ADDRESS = addr;
  CURRENT_WALLET  = key;
  localStorage.setItem(CONFIG.LS_ADDR, addr);
  localStorage.setItem(CONFIG.LS_WALLET, key);

  const btnConnect = $("#connectBtn");
  if(btnConnect) btnConnect.textContent = `${addr.slice(0,6)}...${addr.slice(-4)}`;
  const btnDisconnect = $("#disconnectBtn");
  if(btnDisconnect) btnDisconnect.style.display = "inline-flex";

  const out = $("#refLink");
  if(out) out.value = `${location.origin}${location.pathname}?ref=${addr}`;

  setBuyButtonsEnabled(true); // BAĞLANIR BAĞLANMAZ AÇ
}

function withTimeout(promise, ms){
  return new Promise((resolve,reject)=>{
    const t = setTimeout(()=>reject(new Error("timeout")), ms);
    promise.then(v=>{ clearTimeout(t); resolve(v); }, e=>{ clearTimeout(t); reject(e); });
  });
}

/* =============== Satın alma (stub) =============== */
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
  if(!CURRENT_ADDRESS){ alert("Önce cüzdan bağla (Phantom / Solflare / Backpack)."); return; }

  const price = CONFIG.weekPrices[weekIdx];
  const usdtCost = qty * price;

  if(!CONFIG.treasury){
    alert("Treasury adresi tanımlı değil.");
    return;
  }

  const payWith = $("#payWith").value;
  if(payWith==="SOL"){
    // Placeholder kur: 1 USDT ≈ 0.01 SOL (örnek). Kur entegrasyonu isteğe bağlı.
    const solAmount = (usdtCost * 0.01).toFixed(4);
    const deeplink = `https://phantom.app/ul/transfer?recipient=${encodeURIComponent(CONFIG.treasury)}&amount=${solAmount}&reference=${encodeURIComponent(CURRENT_ADDRESS)}&network=${encodeURIComponent(CONFIG.cluster)}`;
    window.open(deeplink, "_blank");
    alert(`Phantom açılacak. ~${solAmount} SOL gönderiyorsun.\n(Oran örnek; gerçek kur entegrasyonu eklenecek.)`);
  }else{
    alert("USDT (Solana) transferi için SPL-Token işlem entegrasyonu eklenecek.");
  }
}

/* =============== ufak dokunuş =============== */
(function ensureTickerVisible(){
  const t=$("#exTrack"); if(!t) return;
  t.style.transform="translateX(0)"; setTimeout(()=>t.style.transform="", 60);
})();
