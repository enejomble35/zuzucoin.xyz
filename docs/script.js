/* =========================
   CONFIG — (stabil)
========================= */
const CONFIG = {
  launchKey: "zuzu_launchAt",
  defaultLaunchISO: "2025-12-31T23:59:59Z",

  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100], // USDT
  nfts: Array.from({ length: 10 }).map((_, i) => ({
    id: i, name: `ZUZU #${i + 1}`, rarity: i % 5 === 0 ? 'Legendary' : (i % 2 ? 'Rare' : 'Epic')
  })),

  // Solana
  rpc: "https://silent-frequent-bird.solana-mainnet.quiknode.pro/xxxxxxxxxxxx/", // ← QuickNode MAINNET URL’in
  cluster: "mainnet-beta",
  treasury: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF",

  // USDT→SOL kaba oran (gerekirse güncelle veya backend ile gerçek kur çekersin)
  USDTPER_SOL: 180,

  // LS keys
  LS_ADDR: "zuzu_connected_addr",
  LS_WALLET: "zuzu_connected_wallet",
  LS_LANG: "zuzu_lang",

  // deeplink dönüş bayrakları
  SS_AWAIT: "zuzu_await_wallet",
  SS_TARGET: "zuzu_target_wallet",
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
      stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, <b>APY + NFT BOOST</b>.",
      token_title:"Tokenomics (Visualized)",road_title:"Roadmap"},
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",
      hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol!",
      amount:"Miktar (ZUZU)",cost:"Maliyet:",buy:"Satın Al",exchanges:"Desteklenen Borsalar",
      stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"<b>APY + NFT BOOST</b>.",
      token_title:"Tokonomi (Görsel)",road_title:"Yol Haritası"},
  fr:{nav_presale:"Pré-vente",nav_stake:"Stake",nav_nft:"Récompenses NFT",nav_roadmap:"Feuille de route",nav_token:"Tokenomics",connect:"Connecter le Wallet",
      hero_badge:"Pré-vente • Stake pour gagner un NFT",hero_title:"ZUZU — Hérisson Robotique 🦔⚡",
      hero_lead:"Stake et gagne un <b>NFT Mascotte ZUZU</b>.",
      cta_stake:"Commencer le Stake",cta_nft:"Récompenses NFT",
      days:"JOURS",hours:"HEURES",mins:"MINUTES",secs:"SECONDES",
      presale_title:"Pré-vente — Compte à rebours",presale_lead:"Prépare-toi pour la pré-vente ZUZU !",
      amount:"Montant (ZUZU)",cost:"Coût :",buy:"Acheter",exchanges:"Bourses prises en charge",
      stake_title:"Stake Pro — Verrouille, Gagne, Reçois un NFT ✨",stake_lead:"<b>APY + BOOST NFT</b>.",
      token_title:"Tokenomics (Visualisé)",road_title:"Feuille de route"},
  pt:{nav_presale:"Pré-venda",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Roteiro",nav_token:"Tokenomics",connect:"Conectar Carteira",
      hero_badge:"Pré-venda • Stake para ganhar NFT",hero_title:"ZUZU — Ouriço Robótico 🦔⚡",
      hero_lead:"Faça stake e ganhe <b>NFT Mascote ZUZU</b>.",
      cta_stake:"Começar Stake",cta_nft:"Recompensas NFT",
      days:"DIAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",
      presale_title:"Pré-venda — Contagem regressiva",presale_lead:"Prepare-se para a pré-venda!",
      amount:"Quantidade (ZUZU)",cost:"Custo:",buy:"Comprar",exchanges:"Exchanges suportadas",
      stake_title:"Stake Pro — Trave, Ganhe, Receba NFT ✨",stake_lead:"<b>APY + BOOST NFT</b>.",
      token_title:"Tokenomics (Visualizado)",road_title:"Roteiro"},
  ru:{nav_presale:"Предпродажа",nav_stake:"Стейкинг",nav_nft:"NFT награды",nav_roadmap:"Дорожная карта",nav_token:"Токеномика",connect:"Подключить кошелёк",
      hero_badge:"Предпродажа • Стейкинг для NFT",hero_title:"ZUZU — Робо-Ёж 🦔⚡",
      hero_lead:"Стейкай и получай <b>маскот NFT ZUZU</b>.",
      cta_stake:"Начать стейкинг",cta_nft:"NFT награды",
      days:"ДНИ",hours:"ЧАСЫ",mins:"МИН.",secs:"СЕК.",
      presale_title:"Предпродажа — Обратный отсчёт",presale_lead:"Готовься к предпродаже ZUZU!",
      amount:"Количество (ZUZU)",cost:"Стоимость:",buy:"Купить",exchanges:"Поддерживаемые биржи",
      stake_title:"Stake Pro — Заморозь, Заработай, Получи NFT ✨",stake_lead:"<b>APY + NFT BOOST</b>.",
      token_title:"Токеномика (визуально)",road_title:"Дорожная карта"},
  es:{nav_presale:"Pre-venta",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Hoja de ruta",nav_token:"Tokenomics",connect:"Conectar Billetera",
      hero_badge:"Pre-venta • Stake para ganar NFT",hero_title:"ZUZU — Erizo Robótico 🦔⚡",
      hero_lead:"Haz stake y gana <b>NFT Mascota ZUZU</b>.",
      cta_stake:"Empezar Stake",cta_nft:"Recompensas NFT",
      days:"DÍAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",
      presale_title:"Pre-venta — Cuenta regresiva",presale_lead:"¡Prepárate para la pre-venta!",
      amount:"Cantidad (ZUZU)",cost:"Costo:",buy:"Comprar",exchanges:"Exchanges compatibles",
      stake_title:"Stake Pro — Bloquea, Gana, Obtén NFT ✨",stake_lead:"<b>APY + BOOST NFT</b>.",
      token_title:"Tokenomics (Visualizado)",road_title:"Hoja de ruta"}
};

const $  = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];
const UA = navigator.userAgent||"";
const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(UA);

/* =============== Lang UI =============== */
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
  const saved = localStorage.getItem(CONFIG.LS_LANG) || "en";
  applyLang(saved);
  const langBtn=$("#langBtn"), langMenu=$("#langMenu");
  if(langBtn && langMenu){
    langBtn.addEventListener("click",(e)=>{e.stopPropagation(); langMenu.classList.toggle("show");});
    $$(".lang-opt").forEach(b=>b.addEventListener("click",(e)=>{
      e.stopPropagation(); applyLang(b.dataset.lang); langMenu.classList.remove("show");
    }));
    document.addEventListener("click",(e)=>{
      if(langMenu && !langMenu.contains(e.target) && e.target!==langBtn){ langMenu.classList.remove("show"); }
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

/* =============== Presale fiyat/maliyet =============== */
function updateCosts(){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
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
  copyBtn?.addEventListener("click", ()=>{ navigator.clipboard.writeText(out.value); alert("Copied!"); });
})();

/* =========================
   Wallet Connect (Phantom + Solflare)
========================= */
const Wallets = {
  phantom:{
    key:'phantom', label:'Phantom', icon:'assets/images/wallets/phantom.png',
    has:()=> !!(window.phantom?.solana?.isPhantom || window.solana?.isPhantom || window.solana?.isPhantomApp),
    provider:()=> window.phantom?.solana || window.solana,
    deeplink:(url)=>`https://phantom.app/ul/browse/${encodeURIComponent(url)}?network=${encodeURIComponent(CONFIG.cluster)}`,
    connect:async function(){
      let p=this.provider(); if(!p){ await new Promise(r=>setTimeout(r,250)); p=this.provider(); }
      if(!p) throw new Error("no provider");
      try{ const r=await p.connect?.({onlyIfTrusted:true}); const pk=(r?.publicKey||p.publicKey); if(pk) return pk.toString(); }catch(_){}
      const r2=await p.connect(); return (r2?.publicKey||p.publicKey).toString();
    },
    disconnect:async()=>{ try{ await (window.phantom?.solana||window.solana)?.disconnect?.(); }catch{} }
  },
  solflare:{
    key:'solflare', label:'Solflare', icon:'assets/images/wallets/solflare.png',
    has:()=> !!(window.solflare?.isSolflare || typeof window.solflare?.connect==="function"),
    provider:()=> window.solflare,
    deeplink:(url)=>`https://solflare.com/ul/v1/browse/${encodeURIComponent(url)}?network=${encodeURIComponent(CONFIG.cluster)}`,
    connect:async function(){
      let p=this.provider(); if(!p){ await new Promise(r=>setTimeout(r,250)); p=this.provider(); }
      if(!p) throw new Error("no provider");
      try{ const r=await p.connect?.({onlyIfTrusted:true}); const pk=(r?.publicKey||p.publicKey); if(pk) return pk.toString(); }catch(_){}
      const r2=await p.connect(); return (r2?.publicKey||p.publicKey).toString();
    },
    disconnect:async()=>{ try{ await window.solflare?.disconnect?.(); }catch{} }
  }
};

let CURRENT_ADDRESS = null;
let CURRENT_WALLET  = null;
let connection = null;

function walletListHTML(){
  return Object.values(Wallets).map(w=>`
    <button class="wbtn" data-key="${w.key}">
      <img src="${w.icon}" alt="${w.label}" width="22" height="22"
           onerror="this.onerror=null; this.src='assets/images/wallets/${w.key}.svg'">
      <span>${w.label}</span>
    </button>`).join("");
}

/* ----- modal & giriş noktaları ----- */
(function initWalletUI(){
  const modal = $("#walletModal"); const list = $("#wlist");
  const btnConnect = $("#connectBtn"); const btnClose = $("#wmClose");
  const btnDisconnect = $("#disconnectBtn");

  if(list) list.innerHTML = walletListHTML();

  connection = new solanaWeb3.Connection(CONFIG.rpc, "confirmed");

  // önceki oturum
  const savedAddr   = localStorage.getItem(CONFIG.LS_ADDR);
  const savedWallet = localStorage.getItem(CONFIG.LS_WALLET);
  if(savedAddr && savedWallet){
    onConnected(savedWallet, savedAddr, {silent:true});
  }else{
    setBuyButtonsEnabled(false);
  }

  // bağlan butonları
  function bindConnectButtons(){
    const all = [btnConnect, ...$$("[data-connect]")].filter(Boolean);
    all.forEach(b=>{
      if(b.dataset._bind) return;
      b.dataset._bind="1";
      b.addEventListener("click", ()=>{
        const direct = Wallets.phantom.has() ? Wallets.phantom :
                       (Wallets.solflare.has() ? Wallets.solflare : null);
        if(direct){ connectFlow(direct.key); } else { modal?.classList.add("show"); }
      });
    });
  }
  bindConnectButtons();
  new MutationObserver(bindConnectButtons).observe(document.body, {subtree:true,childList:true});

  // modal içi
  list?.addEventListener("click", e=>{
    const btn = e.target.closest(".wbtn"); if(!btn) return;
    connectFlow(btn.dataset.key);
  });

  btnClose?.addEventListener("click", ()=>modal?.classList.remove("show"));
  modal?.addEventListener("click", (e)=>{ if(e.target===modal) modal.classList.remove("show"); });

  // disconnect
  btnDisconnect?.addEventListener("click", async ()=>{
    if(!CURRENT_WALLET) return;
    try{ await Wallets[CURRENT_WALLET]?.disconnect?.(); }catch{}
    CURRENT_WALLET=null; CURRENT_ADDRESS=null;
    localStorage.removeItem(CONFIG.LS_ADDR);
    localStorage.removeItem(CONFIG.LS_WALLET);
    $("#connectBtn").textContent = (I[localStorage.getItem(CONFIG.LS_LANG)||"en"]?.connect)||"Connect Wallet";
    btnDisconnect.style.display="none";
    setBuyButtonsEnabled(false);
    alert("Disconnected.");
  });

  // deeplink dönüş (mobil)
  window.addEventListener("load", ()=>setTimeout(autoConnectIfReturned,500));
  document.addEventListener("visibilitychange", ()=>{ if(!document.hidden) autoConnectIfReturned(); });
})();

async function connectFlow(key){
  const impl = Wallets[key]; if(!impl) return;
  const modal = $("#walletModal");
  const nowUrl = location.href;

  // mobil dış tarayıcı + provider yok → wallet içi tarayıcıya götür
  if(!impl.has() && IS_MOBILE){
    sessionStorage.setItem(CONFIG.SS_AWAIT,"1");
    sessionStorage.setItem(CONFIG.SS_TARGET,key);
    modal?.classList.remove("show");
    location.assign( impl.deeplink(addUrlFlag(nowUrl,`w=${key}`)) );
    return;
  }

  // masaüstü + provider yok
  if(!impl.has() && !IS_MOBILE){
    modal?.classList.add("show");
    alert("No wallet extension. Install Phantom or Solflare.");
    return;
  }

  try{
    const addr = await impl.connect();
    onConnected(key, addr);
    modal?.classList.remove("show");
  }catch(err){
    console.warn("wallet connect failed:", err);
    alert("Wallet connection rejected or failed.");
  }
}

function addUrlFlag(url, kv){
  try{ const u=new URL(url); const [k,v]=kv.split("="); u.searchParams.set(k,v); return u.toString(); }
  catch{ return url; }
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
    }catch(e){ console.warn("autoConnect failed:", e); }
  }else if(awaiting){
    $("#walletModal")?.classList.add("show");
  }
}

function onConnected(key, addr, opts={}){
  CURRENT_ADDRESS = addr;
  CURRENT_WALLET  = key;
  localStorage.setItem(CONFIG.LS_ADDR, addr);
  localStorage.setItem(CONFIG.LS_WALLET, key);

  [$("#connectBtn"), ...$$("[data-connect]")].forEach(b=>{
    if(b) b.textContent = `${addr.slice(0,6)}...${addr.slice(-4)}`;
  });

  const out = $("#refLink"); if(out) out.value = `${location.origin}${location.pathname}?ref=${addr}`;

  setBuyButtonsEnabled(true);
  if(!opts.silent) console.log("Connected:", key, addr);
}

/* =========================
   Satın alma — SOL transferi (tek tık)
========================= */
const ACTIVE_WEEK = 0;

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

async function handleBuy(weekIdx){
  try{
    if(weekIdx!==ACTIVE_WEEK){ alert("This week is not active."); return; }
    const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
    if(qty<=0){ alert("Enter a valid amount."); return; }
    if(!CURRENT_ADDRESS || !CURRENT_WALLET){ alert("Connect wallet first."); return; }
    if(!CONFIG.treasury){ alert("Treasury address missing."); return; }

    const usdt = qty * CONFIG.weekPrices[weekIdx];
    const sol  = usdt / CONFIG.USDTPER_SOL;
    await sendSol(Number(sol.toFixed(6)));
    alert("Payment request sent. Approve in your wallet.");
  }catch(e){
    console.error(e);
    alert("Purchase failed: "+(e?.message||e));
  }
}

async function sendSol(solAmount){
  if(!connection) connection = new solanaWeb3.Connection(CONFIG.rpc, "confirmed");
  const provider = (Wallets[CURRENT_WALLET]||{}).provider?.(); if(!provider) throw new Error("No wallet provider");

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

  let sig;
  if(typeof provider.signAndSendTransaction === "function"){
    const res = await provider.signAndSendTransaction(tx);
    sig = res.signature || res;
  }else{
    const signed = await provider.signTransaction(tx);
    const raw = signed.serialize();
    sig = await connection.sendRawTransaction(raw, { skipPreflight:false, preflightCommitment:"confirmed" });
  }

  await connection.confirmTransaction({ signature:sig, blockhash, lastValidBlockHeight }, "finalized");
  console.log("TX OK:", sig);
}

/* small polish */
(function ensureTickerVisible(){
  const t=$("#exTrack"); if(!t) return;
  t.style.transform="translateX(0)"; setTimeout(()=>t.style.transform="", 60);
})();
