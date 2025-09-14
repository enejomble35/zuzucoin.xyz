/* =========================
   ZUZU — script.js (Phantom + Solflare, SOL purchase)
========================= */

/* CONFIG */
const CONFIG = {
  rpc: "https://silent-frequent-bird.solana-mainnet.quiknode.pro/xxxxxxxxxxxx/", // ← kendi QuickNode URL’in
  cluster: "mainnet-beta",
  treasury: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF",

  // Fiyatlar (USDT); SOL çevrim için basit oran (gerekirse güncelle)
  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100],
  USDTPER_SOL: 180, // 1 SOL ≈ 180 USDT (örnek)

  // NFT mock
  nfts: Array.from({ length: 10 }).map((_, i) => ({
    id: i, name: `ZUZU #${i + 1}`, rarity: i % 5 === 0 ? 'Legendary' : (i % 2 ? 'Rare' : 'Epic')
  })),

  // Countdown
  launchKey: "zuzu_launchAt",
  defaultCountdownDays: 60,

  // Storage
  LS_ADDR: "zuzu_connected_addr",
  LS_WALLET: "zuzu_connected_wallet",
  LS_LANG: "zuzu_lang",

  // Session flags for deeplink
  SS_AWAIT: "zuzu_await_wallet",
  SS_TARGET: "zuzu_target_wallet"
};

/* Helpers */
const $  = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];
const UA = navigator.userAgent || "";
const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(UA);
const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

/* ====== LANG (FR/PT/ES/RU) ====== */
const I = {
  fr:{nav_presale:"Pré-vente",nav_stake:"Stake",nav_nft:"Récompenses NFT",nav_roadmap:"Feuille de route",nav_token:"Tokenomics",connect:"Connecter le Wallet",
      hero_badge:"Pré-vente • Stake pour gagner un NFT",hero_title:"ZUZU — Hérisson Robotique 🦔⚡",
      hero_lead:"Stake et gagne un <b>NFT Mascotte ZUZU</b>. Offre limitée, forte <b>utilité</b>.",
      cta_stake:"Commencer le Stake",cta_nft:"Récompenses NFT",days:"JOURS",hours:"HEURES",mins:"MINUTES",secs:"SECONDES",
      presale_title:"Pré-vente — Compte à rebours",presale_lead:"Prépare-toi pour la pré-vente ZUZU ! <b>Allocation limitée</b>.",
      amount:"Montant (ZUZU)",cost:"Coût:",buy:"Acheter",exchanges:"Exchanges supportées",
      stake_title:"Stake Pro — Verrouille, Gagne, Reçois un NFT ✨",stake_lead:"Verrouille ton ZUZU et gagne <b>APY + BOOST NFT</b>.",
      token_title:"Tokenomics (Visualisé)",road_title:"Feuille de route"},
  pt:{nav_presale:"Pré-venda",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Roteiro",nav_token:"Tokenomics",connect:"Conectar Carteira",
      hero_badge:"Pré-venda • Stake para ganhar NFT",hero_title:"ZUZU — Ouriço Robótico 🦔⚡",
      hero_lead:"Faça stake e ganhe <b>NFT Mascote ZUZU</b>.",cta_stake:"Começar Stake",cta_nft:"Recompensas NFT",
      days:"DIAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",
      presale_title:"Pré-venda — Contagem regressiva",presale_lead:"Prepare-se! <b>Alocação limitada</b>.",
      amount:"Quantidade (ZUZU)",cost:"Custo:",buy:"Comprar",exchanges:"Exchanges suportadas",
      stake_title:"Stake Pro — Trave, Ganhe, Receba NFT ✨",stake_lead:"Trave seu ZUZU e ganhe <b>APY + BOOST NFT</b>.",
      token_title:"Tokenomics (Visualizado)",road_title:"Roteiro"},
  es:{nav_presale:"Pre-venta",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Hoja de ruta",nav_token:"Tokenomics",connect:"Conectar Billetera",
      hero_badge:"Pre-venta • Stake para ganar NFT",hero_title:"ZUZU — Erizo Robótico 🦔⚡",
      hero_lead:"Haz stake y gana <b>NFT Mascota ZUZU</b>.",cta_stake:"Empezar Stake",cta_nft:"Recompensas NFT",
      days:"DÍAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",
      presale_title:"Pre-venta — Cuenta regresiva",presale_lead:"¡Prepárate! <b>Asignación limitada</b>.",
      amount:"Cantidad (ZUZU)",cost:"Costo:",buy:"Comprar",exchanges:"Exchanges compatibles",
      stake_title:"Stake Pro — Bloquea, Gana, Obtén NFT ✨",stake_lead:"Bloquea tu ZUZU y gana <b>APY + BOOST NFT</b>.",
      token_title:"Tokenomics (Visualizado)",road_title:"Hoja de ruta"},
  ru:{nav_presale:"Предпродажа",nav_stake:"Стейкинг",nav_nft:"NFT награды",nav_roadmap:"Дорожная карта",nav_token:"Токеномика",connect:"Подключить кошелёк",
      hero_badge:"Предпродажа • Стейкинг для NFT",hero_title:"ZUZU — Робо-Ёж 🦔⚡",
      hero_lead:"Стейкай и получай <b>маскот NFT ZUZU</b>.",cta_stake:"Начать стейкинг",cta_nft:"NFT награды",
      days:"ДНИ",hours:"ЧАСЫ",mins:"МИНУТЫ",secs:"СЕКУНДЫ",
      presale_title:"Предпродажа — Обратный отсчёт",presale_lead:"Готовься! <b>Ограниченная аллокация</b>.",
      amount:"Количество (ZUZU)",cost:"Стоимость:",buy:"Купить",exchanges:"Поддерживаемые биржи",
      stake_title:"Stake Pro — Заморозь, Заработай, Получи NFT ✨",stake_lead:"Заморозь ZUZU и получай <b>APY + NFT BOOST</b>.",
      token_title:"Токеномика (визуально)",road_title:"Дорожная карта"}
};

function applyLang(lang){
  localStorage.setItem(CONFIG.LS_LANG, lang);
  $("#langFlag")?.setAttribute("src", `flags/${lang}.png`);
  $("#langCode") && ($("#langCode").textContent = lang.toUpperCase());
  $$("[data-i]").forEach(el=>{
    const k=el.getAttribute("data-i");
    if(I[lang] && I[lang][k]) el.innerHTML = I[lang][k];
  });
}

(function initLang(){
  const saved = localStorage.getItem(CONFIG.LS_LANG) || "fr";
  applyLang(saved);
  const menu=$("#langMenu"), btn=$("#langBtn");
  btn?.addEventListener("click", (e)=>{ e.stopPropagation(); menu?.classList.toggle("show"); });
  $$(".lang-opt").forEach(b=>b.addEventListener("click", (e)=>{
    e.stopPropagation(); applyLang(b.dataset.lang); menu?.classList.remove("show");
  }));
  document.addEventListener("click", (e)=>{
    if(menu && !menu.contains(e.target) && e.target!==btn) menu.classList.remove("show");
  });
})();

/* ====== Countdown (60 gün; bitmişse resetle) ====== */
function getLaunchAt(){
  let ts = parseInt(localStorage.getItem(CONFIG.launchKey)||"0",10);
  if(!ts || ts < Date.now()){ // SIFIRLANMIŞSA YENİLE
    ts = Date.now() + CONFIG.defaultCountdownDays*24*3600*1000;
    localStorage.setItem(CONFIG.launchKey, String(ts));
  }
  return ts;
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

/* ====== Fiyat/maliyet ve SOL karşılığı ====== */
function updateCosts(){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  CONFIG.weekPrices.forEach((p,i)=>{
    const usdt = qty*p;
    const sol  = usdt>0 ? (usdt/CONFIG.USDTPER_SOL) : 0;
    $("#p"+i) && ($("#p"+i).textContent = p.toFixed(4));
    $("#c"+i) && ($("#c"+i).textContent = usdt.toLocaleString(undefined,{maximumFractionDigits:2}));
    $("#s"+i) && ($("#s"+i).textContent = sol.toFixed(4));
  });
}
$("#buyAmount")?.addEventListener("input", updateCosts);
updateCosts();

/* ====== NFT grid ====== */
(function renderNFTs(){
  const g=$("#nftGrid"); if(!g) return;
  g.innerHTML = CONFIG.nfts.map(n=>`
    <div class="nft">
      <img src="assets/images/mask/${n.id}.png?v=1" alt="${n.name}" loading="lazy" onerror="this.style.display='none'">
      <div class="meta"><b>${n.name}</b><span class="tag">${n.rarity}</span></div>
    </div>`).join("");
})();

/* ====== Invite link ====== */
(function refLink(){
  const url = new URL(location.href);
  if(url.searchParams.get("ref")) localStorage.setItem("zuzu_refAddr", url.searchParams.get("ref"));
  const addr = localStorage.getItem(CONFIG.LS_ADDR) || localStorage.getItem("zuzu_refAddr") || "";
  const out = $("#refLink"); const copyBtn = $("#copyRef");
  if(out){ out.value = `${location.origin}${location.pathname}?ref=${addr||"YOURCODE"}`; }
  copyBtn?.addEventListener("click", ()=>{ navigator.clipboard.writeText(out.value); alert("Copied!"); });
})();

/* ====== Borsa bandı görünür başlat ====== */
(function ensureTickerVisible(){
  const t=$("#exTrack"); if(!t) return;
  t.style.transform="translateX(0)"; setTimeout(()=>t.style.transform="", 60);
})();

/* ====== Wallets (Phantom + Solflare) ====== */
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
      let p=this.provider(); if(!p){ await sleep(300); p=this.provider(); }
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
      let p=this.provider(); if(!p){ await sleep(300); p=this.provider(); }
      if(!p) throw new Error("no provider");
      try{ const r=await p.connect?.({onlyIfTrusted:true}); const pk=(r?.publicKey||p.publicKey); if(pk) return pk.toString(); }catch(_){}
      const r2=await p.connect(); return (r2?.publicKey||p.publicKey).toString();
    },
    async disconnect(){ try{ await this.provider()?.disconnect?.(); }catch{} }
  }
};

let CURRENT_ADDRESS = null;
let CURRENT_WALLET  = null;
let connection = null;

function walletListHTML(){
  return Object.values(Wallets).map(w=>`
    <button class="wbtn" data-key="${w.key}">
      <img src="${w.icon}" alt="${w.label}" width="22" height="22"
           onerror="this.onerror=null;this.src='${ICONS[w.key]}'">
      <span>${w.label}</span>
    </button>`).join("");
}

/* Init Wallet UI */
(function initWalletUI(){
  const modal = $("#walletModal");
  const list  = $("#wlist");
  if(list) list.innerHTML = walletListHTML();

  connection = new solanaWeb3.Connection(CONFIG.rpc, "confirmed");

  function bindConnectButtons(){
    const all = [$("#connectBtn"), ...$$("[data-connect]")].filter(Boolean);
    all.forEach(btn=>{
      if(btn.dataset._bind) return;
      btn.dataset._bind = "1";
      btn.addEventListener("click", ()=>{
        const direct = Wallets.phantom.has() ? Wallets.phantom :
                       (Wallets.solflare.has() ? Wallets.solflare : null);
        if(direct){ connectFlow(direct.key); }
        else{ modal?.classList.add("show"); }
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
  window.addEventListener("load", ()=>{ setTimeout(autoConnectIfReturned, 500); });
  document.addEventListener("visibilitychange", ()=>{ if(!document.hidden) autoConnectIfReturned(); });
})();

async function connectFlow(key){
  const impl = Wallets[key]; if(!impl) return;
  const modal = $("#walletModal");
  const nowUrl = location.href;

  if(!impl.has() && IS_MOBILE){
    sessionStorage.setItem(CONFIG.SS_AWAIT, "1");
    sessionStorage.setItem(CONFIG.SS_TARGET, key);
    modal?.classList.remove("show");
    location.assign( impl.deeplink(addUrlFlag(nowUrl, `w=${key}`)) );
    return;
  }

  if(!impl.has() && !IS_MOBILE){
    modal?.classList.add("show");
    alert("Wallet eklentisi yok. Phantom veya Solflare kurun.");
    return;
  }

  try{
    const addr = await impl.connect();
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
      const addr = await impl.connect();
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

function setBuyButtonsEnabled(ok){
  ["buyW0","buyW1","buyW2","buyW3"].forEach(id=>{
    const b = document.getElementById(id); if(!b) return;
    b.disabled = !ok; b.style.opacity = ok ? "1" : ".5"; b.style.pointerEvents = ok ? "auto" : "none";
  });
}

/* ====== BUY (SOL transferi) ====== */
const ACTIVE_WEEK = 0; // şimdilik 1.hafta aktif
["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
  const b = $("#"+id); if(!b) return;
  b.addEventListener("click", ()=>handleBuy(i));
});

async function handleBuy(weekIdx){
  try{
    if(weekIdx!==ACTIVE_WEEK){ alert("Bu hafta aktif değil."); return; }
    const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
    if(qty<=0){ alert("Geçerli miktar gir."); return; }
    if(!CURRENT_ADDRESS){ alert("Önce cüzdan bağla."); return; }

    const priceUSDT = CONFIG.weekPrices[weekIdx];
    const usdtCost = qty * priceUSDT;
    const solAmount = usdtCost / CONFIG.USDTPER_SOL;

    await sendSol(Number(solAmount.toFixed(6)));
    alert("Ödeme isteği gönderildi. İşlemi cüzdandan onaylayın.");
  }catch(e){
    console.error(e);
    alert("Satın alma başarısız: "+(e?.message||e));
  }
}

async function sendSol(solAmount){
  if(!connection) connection = new solanaWeb3.Connection(CONFIG.rpc, "confirmed");
  const provider = (Wallets[CURRENT_WALLET]||{}).provider?.(); if(!provider) throw new Error("Wallet provider yok");

  const fromPubkey = provider.publicKey;
  const toPubkey   = new solanaWeb3.PublicKey(CONFIG.treasury);
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("finalized");

  const lamports = Math.round(solAmount * solanaWeb3.LAMPORTS_PER_SOL);

  const tx = new solanaWeb3.Transaction({
    recentBlockhash: blockhash,
    feePayer: fromPubkey
  }).add(
    solanaWeb3.SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports
    })
  );

  // Phantom & Solflare genelde signAndSendTransaction destekler
  let sig;
  if(typeof provider.signAndSendTransaction === "function"){
    const res = await provider.signAndSendTransaction(tx);
    sig = res.signature || res;
  }else{
    const signed = await provider.signTransaction(tx);
    const raw = signed.serialize();
    sig = await connection.sendRawTransaction(raw, { skipPreflight:false, preflightCommitment:"confirmed" });
  }

  await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, "finalized");
  console.log("TX OK:", sig);
}

/* ====== küçük iyileştirme ====== */
window.addEventListener("solana#initialized", ()=>{ /* mobile phantom inject */ }, {once:false});
