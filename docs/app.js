/* =========================
   ZUZU — Frontend Config
========================= */
const CFG = {
  // Polygon mainnet
  chainIdHex: "0x89",
  chainName: "Polygon",
  rpcUrls: ["https://polygon-rpc.com"],
  blockExplorerUrls: ["https://polygonscan.com"],

  // Treasury (alıcı) — sizin EVM cüzdanınız
  treasury: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3",

  // USDT (Polygon PoS) kontratı
  usdt: "0xC2132D05D31c914a87C6611C10748AaCBdDaE49a",

  // Presale fiyatları (USDT)
  weekPrices: [0.0045, 0.0060, 0.0075, 0.0090],

  // Geri sayım — 24 Kasım 2025 13:00 TR
  // (sabit; LS’ye yazılır, reset olmaz)
  launchAtISO: "2025-11-24T13:00:00+03:00",

  LS_ADDR: "zuzu_evm_addr",
  LS_WALLET: "zuzu_evm_wallet",
  LS_LANG: "zuzu_lang",
  LS_LAUNCH: "zuzu_launch_fixed"
};

/* =========================
   yardımcılar
========================= */
const $  = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];
const toHex = (n, bytes=32) => "0x" + BigInt(n).toString(16).padStart(bytes*2,"0");
const padAddr = (a) => a.toLowerCase().replace(/^0x/,"").padStart(64,"0");

/* =========================
   Diller
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
      hero_badge:"Предпродажа • Стейкинг для NFT",hero_title:"ЗУЗУ — Робо-Ёж 🦔⚡",
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

function applyLang(lang){
  localStorage.setItem(CFG.LS_LANG, lang);
  $("#langCode") && ($("#langCode").textContent = lang.toUpperCase());
  $("#langFlag") && ($("#langFlag").src = `flags/${lang}.png`);
  $$("[data-i]").forEach(el=>{
    const k=el.getAttribute("data-i");
    if(I[lang] && I[lang][k]) el.innerHTML = I[lang][k];
  });
}
(function initLang(){
  const saved = localStorage.getItem(CFG.LS_LANG) || "en";
  applyLang(saved);
  const langBtn=$("#langBtn"), langMenu=$("#langMenu");
  if(langBtn && langMenu){
    langBtn.addEventListener("click", (e)=>{ e.stopPropagation(); langMenu.classList.toggle("show"); });
    $$(".lang-opt").forEach(b=>b.addEventListener("click", (e)=>{
      e.stopPropagation(); applyLang(b.dataset.lang); langMenu.classList.remove("show");
    }));
    document.addEventListener("click", (e)=>{ if(!langMenu?.contains(e.target) && e.target!==langBtn) langMenu?.classList.remove("show"); });
  }
})();

/* =========================
   Geri Sayım (sabit tarih)
========================= */
(function countdown(){
  let ts = localStorage.getItem(CFG.LS_LAUNCH);
  if(!ts){
    ts = Date.parse(CFG.launchAtISO).toString();
    localStorage.setItem(CFG.LS_LAUNCH, ts);
  }
  const target = parseInt(ts,10);
  function tick(){
    const left = Math.max(0, target - Date.now());
    const d=Math.floor(left/86400000);
    const h=Math.floor((left%86400000)/3600000);
    const m=Math.floor((left%3600000)/60000);
    const s=Math.floor((left%60000)/1000);
    const pad=n=>n.toString().padStart(2,"0");
    $("#cdDays")?.( $("#cdDays").textContent = pad(d) );
    $("#cdHours")?.( $("#cdHours").textContent = pad(h) );
    $("#cdMins")?.( $("#cdMins").textContent = pad(m) );
    $("#cdSecs")?.( $("#cdSecs").textContent = pad(s) );
  }
  tick(); setInterval(tick,1000);
})();

/* =========================
   Fiyat / maliyet
========================= */
(function prices(){
  const P = CFG.weekPrices;
  P.forEach((p,i)=>{ $("#p"+i) && ($("#p"+i).textContent = p.toFixed(4)); });
  function updateCosts(){
    const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
    P.forEach((p,i)=>{ $("#c"+i) && ($("#c"+i).textContent = (qty*p).toLocaleString(undefined,{maximumFractionDigits:2})); });
  }
  $("#buyAmount")?.addEventListener("input", updateCosts);
  updateCosts();
})();

/* =========================
   NFT Grid (1..12 png)
========================= */
(function renderNFTs(){
  const g=$("#nftGrid"); if(!g) return;
  g.innerHTML = Array.from({length:12}).map((_,i)=> {
    const idx=i+1;
    return `
      <div class="nft">
        <img src="assets/images/mask/${idx}.png" alt="ZUZU #${idx}" loading="lazy"
             onerror="this.style.display='none'">
        <div class="meta"><b>ZUZU #${idx}</b><span class="tag">${idx%5===0?'Legendary':(idx%2?'Rare':'Epic')}</span></div>
      </div>`;
  }).join("");
})();

/* =========================
   Referans Link
========================= */
(function ref(){
  const url = new URL(location.href);
  if(url.searchParams.get("ref")) localStorage.setItem("zuzu_ref", url.searchParams.get("ref"));
  const ref = localStorage.getItem("zuzu_ref") || "";
  const out = $("#refLink"); const copyBtn = $("#copyRef");
  if(out){ out.value = `${location.origin}${location.pathname}?ref=${ref||"YOURCODE"}`; }
  copyBtn?.addEventListener("click", ()=>{ navigator.clipboard.writeText(out.value); alert("Copied!"); });
})();

/* =========================
   Cüzdanlar (MetaMask + Phantom EVM)
========================= */
const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent||"");

const Wallets = {
  metamask: {
    key: "metamask",
    label: "MetaMask",
    icon: `<svg viewBox="0 0 212 189" width="22" height="22"><path fill="#E2761B" d="M...Z"/></svg>`, // kısaltılmış: UI için ikon şart değil
    has: () => !!window.ethereum && (!window.phantom || window.ethereum !== window.phantom.ethereum),
    provider: () => window.ethereum
  },
  phantom: {
    key: "phantom",
    label: "Phantom",
    icon: `<svg viewBox="0 0 1024 1024" width="22" height="22"><circle cx="512" cy="512" r="512" fill="#7b61ff"/><circle cx="420" cy="470" r="40" fill="#fff"/><circle cx="600" cy="470" r="40" fill="#fff"/></svg>`,
    has: () => !!window.phantom?.ethereum,
    provider: () => window.phantom?.ethereum
  }
};

let CURRENT = { addr:null, wallet:null };

function walletListHTML(){
  return Object.values(Wallets).map(w=>`
    <button class="wbtn" data-key="${w.key}">
      ${w.icon || ""}<span>${w.label}</span>
    </button>`).join("");
}

function setBuyButtonsEnabled(ok){
  ["buyW0","buyW1","buyW2","buyW3"].forEach(id=>{
    const b = document.getElementById(id); if(!b) return;
    b.disabled = !ok; b.style.opacity = ok ? "1" : ".5"; b.style.pointerEvents = ok ? "auto" : "none";
  });
}

(function initWalletUI(){
  const modal = $("#walletModal");
  const list  = $("#wlist");
  const btnConnect = $("#connectBtn");
  const btnClose = $("#wmClose");
  const btnDisconnect = $("#disconnectBtn");

  if(list) list.innerHTML = walletListHTML();

  // restore
  const savedAddr = localStorage.getItem(CFG.LS_ADDR);
  const savedWal  = localStorage.getItem(CFG.LS_WALLET);
  if(savedAddr && savedWal){ onConnected(savedWal, savedAddr, {silent:true}); }
  else { setBuyButtonsEnabled(false); }

  btnConnect?.addEventListener("click", ()=>{
    const direct = Wallets.metamask.has() ? Wallets.metamask :
                   (Wallets.phantom.has() ? Wallets.phantom : null);
    if(direct){ connectFlow(direct.key); }
    else{
      modal?.classList.add("show"); modal?.removeAttribute("hidden");
    }
  });

  list?.addEventListener("click", (e)=>{
    const btn = e.target.closest(".wbtn"); if(!btn) return;
    connectFlow(btn.dataset.key);
  });

  btnClose?.addEventListener("click", ()=>{ modal?.classList.remove("show"); modal?.setAttribute("hidden",""); });
  modal?.addEventListener("click", (e)=>{ if(e.target===modal){ modal.classList.remove("show"); modal.setAttribute("hidden",""); } });

  btnDisconnect?.addEventListener("click", async ()=>{
    CURRENT = {addr:null, wallet:null};
    localStorage.removeItem(CFG.LS_ADDR);
    localStorage.removeItem(CFG.LS_WALLET);
    $("#connectBtn") && ($("#connectBtn").textContent = I[(localStorage.getItem(CFG.LS_LANG)||"en")].connect || "Connect Wallet");
    setBuyButtonsEnabled(false);
    alert("Disconnected.");
  });
})();

async function ensurePolygon(provider){
  const chainId = await provider.request({ method: "eth_chainId" });
  if(chainId?.toLowerCase() === CFG.chainIdHex) return;
  try{
    await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CFG.chainIdHex }]});
  }catch(err){
    // zincir ekle
    await provider.request({ method: "wallet_addEthereumChain", params: [{
      chainId: CFG.chainIdHex, chainName: CFG.chainName, rpcUrls: CFG.rpcUrls,
      nativeCurrency: { name:"MATIC", symbol:"MATIC", decimals:18 },
      blockExplorerUrls: CFG.blockExplorerUrls
    }]});
  }
}

async function connectFlow(key){
  const impl = Wallets[key]; if(!impl) return;
  const provider = impl.provider();
  const modal = $("#walletModal");

  if(provider){
    try{
      await ensurePolygon(provider);
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      const addr = accounts[0];
      onConnected(key, addr);
      modal?.classList.remove("show"); modal?.setAttribute("hidden",""); 
    }catch(e){
      alert("Wallet connection rejected or failed.");
    }
    return;
  }

  // mobil & provider yok → market linkleri
  modal?.classList.remove("show"); modal?.setAttribute("hidden","");
  const url = "https://metamask.app.link/dapp/"+location.host+location.pathname;
  window.open(url, "_blank");
}

function onConnected(key, addr, opts={}){
  CURRENT = { addr, wallet:key };
  localStorage.setItem(CFG.LS_ADDR, addr);
  localStorage.setItem(CFG.LS_WALLET, key);
  $("#connectBtn") && ($("#connectBtn").textContent = `${addr.slice(0,6)}...${addr.slice(-4)}`);
  $("#disconnectBtn") && ($("#disconnectBtn").style.display = "inline-flex");
  setBuyButtonsEnabled(true);
  if(!opts.silent) console.log("Connected:", key, addr);
}

/* =========================
   Satın Alma (MATIC veya USDT transfer)
========================= */
function activeWeek(){ return 0; } // gerekirse haftayı dinamik yaparsın
["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
  const b = $("#"+id); if(!b) return; b.addEventListener("click", ()=>handleBuy(i));
});

async function handleBuy(weekIdx){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  if(qty<=0) return alert("Enter a valid amount.");
  if(weekIdx!==activeWeek()) return alert("This week is not active.");
  if(!CURRENT.addr) return alert("Connect wallet first (MetaMask / Phantom).");

  const price = CFG.weekPrices[weekIdx];
  const usdtCost = qty * price;
  const payWith = $("#payWith")?.value || "USDT";

  const provider = Wallets[CURRENT.wallet]?.provider?.();
  if(!provider) return alert("Provider not found.");

  await ensurePolygon(provider);

  if(payWith === "MATIC"){
    // MATIC direkt transfer (native)
    const valueHex = toHex(Math.round(usdtCost * 1e18)); // ≈USDT fiyatına göre MATIC’le ödeme (isteğe bağlı)
    try{
      await provider.request({
        method: "eth_sendTransaction",
        params: [{ from: CURRENT.addr, to: CFG.treasury, value: valueHex }]
      });
      alert("Payment sent. Thank you!");
    }catch(e){ console.error(e); alert("Payment failed."); }
    return;
  }

  // USDT ERC20 transfer: data = 0xa9059cbb + addr + amount
  const amount = BigInt(Math.round(usdtCost * 1e6)); // USDT 6 decimals
  const data = "0xa9059cbb" + padAddr(CFG.treasury) + amount.toString(16).padStart(64,"0");

  try{
    await provider.request({
      method: "eth_sendTransaction",
      params: [{
        from: CURRENT.addr,
        to: CFG.usdt,
        data,
        value: "0x0"
      }]
    });
    alert("USDT payment sent. Thank you!");
  }catch(e){ console.error(e); alert("Payment failed (USDT)."); }
}

/* =========================
   Borsa ticker nudge
========================= */
(function ensureTickerVisible(){
  const t=$("#exTrack"); if(!t) return;
  t.style.transform="translateX(0)"; setTimeout(()=>t.style.transform="", 60);
})();
