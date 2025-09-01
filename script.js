/* =========================
   ZUZU — Global Config
   (Countdown & Sale Start kalıcı: localStorage)
========================= */

// 50 günlük countdown'ı sabitle (yenileyince sıfırlanmasın)
(function persistLaunchAt(){
  const KEY = "zuzuLaunchAt";
  const saved = localStorage.getItem(KEY);
  if (!saved) {
    const t = Date.now() + 50*24*60*60*1000; // 50 gün
    localStorage.setItem(KEY, String(t));
  }
})();
const LAUNCH_AT = parseInt(localStorage.getItem("zuzuLaunchAt")||"0",10) || (Date.now()+50*86400000);

// Pre-sale başlangıcı sabitle (hafta seçimi buna göre)
(function persistSaleStart(){
  const KEY = "zuzuSaleStart";
  const saved = localStorage.getItem(KEY);
  if (!saved) {
    localStorage.setItem(KEY, String(Date.now()));
  }
})();
const SALE_START = parseInt(localStorage.getItem("zuzuSaleStart")||String(Date.now()),10);

const CONFIG = {
  ownerAddress: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3",
  contractAddress: "0xF2bbbEcB417725813BF5E940d678793fACDa9729",
  collectionUrl: "https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a/contract/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts",
  launchAt: LAUNCH_AT,
  saleStart: SALE_START,
  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100], // USDT
  nfts: [
    { id:0, name:"ZUZU Hero",      rarity:"Epic",      supply:200 },
    { id:1, name:"ZUZU Rogue",     rarity:"Rare",      supply:2500 },
    { id:2, name:"ZUZU Berserker", rarity:"Epic",      supply:800 },
    { id:3, name:"ZUZU Hacker",    rarity:"Rare",      supply:600 },
    { id:4, name:"ZUZU Sorceress", rarity:"Epic",      supply:750 },
    { id:5, name:"ZUZU Warrior",   rarity:"Rare",      supply:900 },
    { id:6, name:"ZUZU Maiden",    rarity:"Rare",      supply:1100 },
    { id:7, name:"ZUZU Ranger",    rarity:"Rare",      supply:1000 },
    { id:8, name:"ZUZU Scientist", rarity:"Epic",      supply:1100 },
    { id:9, name:"ZUZU Titan",     rarity:"Legendary", supply:250 }
  ]
};

// Desteklenen ağlar + USDT adresleri
const CHAINS = {
  1: { // Ethereum
    hex: "0x1",
    name: "Ethereum",
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    usdtDecimals: 6,
    params: null
  },
  56: { // BNB Chain
    hex: "0x38",
    name: "BNB Chain",
    usdt: "0x55d398326f99059fF775485246999027B3197955",
    usdtDecimals: 18,
    params: {
      chainId: "0x38",
      chainName: "BNB Smart Chain",
      nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
      rpcUrls: ["https://bsc-dataseed.binance.org"],
      blockExplorerUrls: ["https://bscscan.com"]
    }
  },
  137: { // Polygon
    hex: "0x89",
    name: "Polygon",
    usdt: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    usdtDecimals: 6,
    params: {
      chainId: "0x89",
      chainName: "Polygon Mainnet",
      nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
      rpcUrls: ["https://polygon-rpc.com"],
      blockExplorerUrls: ["https://polygonscan.com"]
    }
  }
};

// Basit ERC20 ABI
const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

/* =========================
   I18N (EN/TR/FR/ES)
========================= */
const I = {
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
      hero_lead:"Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high <b>utility</b>.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",collection_page:"Collection Page",contract:"Contract:",
      days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",amount:"Amount (ZUZU)",
      w1:"Week 1 (Cheapest)",w2:"Week 2",w3:"Week 3",w4:"Week 4 (Last Chance)",cost:"Cost:",buy:"Buy",exchanges:"Supported Exchanges",
      stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>. Early stakers get badge & airdrop priority.",
      calc_title:"Earnings Calculator",amount2:"Amount (ZUZU)",lock:"Lock Period",nft_have:"Have NFT?",early:"Early Badge",calc_btn:"Calculate",
      ret:"Total Return",avg:"Monthly Avg",boost:"Total Boost",token_title:"Tokenomics (Visualized)",road_title:"Roadmap",
      road_lead:"Clear plan focused on community, staking, NFT drops, listings."},
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",
      hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",collection_page:"Koleksiyon Sayfası",contract:"Kontrat:",
      days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",amount:"Miktar (ZUZU)",
      w1:"1. Hafta (En Ucuz)",w2:"2. Hafta",w3:"3. Hafta",w4:"4. Hafta (Son Fırsat)",cost:"Maliyet:",buy:"Satın Al",exchanges:"Desteklenen Borsalar",
      stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile pasif gelir elde et. Erken stake edenler rozet & airdrop önceliği alır.",
      calc_title:"Kazanç Hesaplayıcı",amount2:"Miktar (ZUZU)",lock:"Kilit Süresi",nft_have:"Elinde NFT var mı?",early:"Erken Rozet",calc_btn:"Hesapla",
      ret:"Toplam Getiri",avg:"Aylık Ortalama",boost:"Toplam Boost",token_title:"Tokonomi (Görselleştirilmiş)",road_title:"Yol Haritası",
      road_lead:"Topluluk, staking, NFT drop’ları ve listelemelere odaklı plan."},
  fr:{nav_presale:"Pré-vente",nav_stake:"Stake",nav_nft:"Récompenses NFT",nav_roadmap:"Feuille de route",nav_token:"Tokenomics",connect:"Connecter le Wallet",
      hero_badge:"Pré-vente • Stake pour gagner un NFT",hero_title:"ZUZU — Hérisson Robotique 🦔⚡",
      hero_lead:"Stake et gagne un <b>NFT Mascotte ZUZU</b>. Offre limitée, forte <b>utilité</b>.",
      cta_stake:"Commencer le Stake",cta_nft:"Récompenses NFT",collection_page:"Page de la Collection",contract:"Contrat :",
      days:"JOURS",hours:"HEURES",mins:"MINUTES",secs:"SECONDES",
      presale_title:"Pré-vente — Compte à rebours",presale_lead:"Prépare-toi pour la pré-vente ZUZU ! <b>Allocation limitée</b>, prix communauté.",amount:"Montant (ZUZU)",
      w1:"Semaine 1 (Moins cher)",w2:"Semaine 2",w3:"Semaine 3",w4:"Semaine 4 (Dernière chance)",cost:"Coût :",buy:"Acheter",exchanges:"Bourses prises en charge",
      stake_title:"Stake Pro — Verrouille, Gagne, Reçois un NFT ✨",stake_lead:"Verrouille ton ZUZU, gagne <b>APY + BOOST NFT</b>. Badge & airdrop prioritaires pour les premiers.",
      calc_title:"Calculateur de gains",amount2:"Montant (ZUZU)",lock:"Période de verrouillage",nft_have:"Tu as un NFT ?",early:"Badge précoce",calc_btn:"Calculer",
      ret:"Gain total",avg:"Moyenne mensuelle",boost:"Boost total",token_title:"Tokenomics (Visualisé)",road_title:"Feuille de route",
      road_lead:"Plan axé sur communauté, staking, drops NFT et listings."},
  es:{nav_presale:"Pre-venta",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Hoja de ruta",nav_token:"Tokenomics",connect:"Conectar Billetera",
      hero_badge:"Pre-venta • Stake para ganar NFT",hero_title:"ZUZU — Erizo Robótico 🦔⚡",
      hero_lead:"Haz stake y gana <b>NFT Mascota ZUZU</b>. Suministro limitado, gran <b>utilidad</b>.",
      cta_stake:"Empezar Stake",cta_nft:"Recompensas NFT",collection_page:"Página de Colección",contract:"Contrato:",
      days:"DÍAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",
      presale_title:"Pre-venta — Cuenta regresiva",presale_lead:"¡Prepárate para la pre-venta ZUZU! <b>Asignación limitada</b>, precio para la comunidad.",amount:"Cantidad (ZUZU)",
      w1:"Semana 1 (Más barata)",w2:"Semana 2",w3:"Semana 3",w4:"Semana 4 (Última oportunidad)",cost:"Costo:",buy:"Comprar",exchanges:"Exchanges compatibles",
      stake_title:"Stake Pro — Bloquea, Gana, Obtén NFT ✨",stake_lead:"Bloquea tu ZUZU, gana <b>APY + BOOST NFT</b>. Primeros obtienen insignia y prioridad de airdrop.",
      calc_title:"Calculadora de ganancias",amount2:"Cantidad (ZUZU)",lock:"Periodo de bloqueo",nft_have:"¿Tienes NFT?",early:"Insignia temprana",calc_btn:"Calcular",
      ret:"Retorno total",avg:"Promedio mensual",boost:"Impulso total",token_title:"Tokenomics (Visualizado)",road_title:"Hoja de ruta",
      road_lead:"Plan centrado en comunidad, staking, drops NFT y listados."}
};

function applyLang(lang="en"){
  document.querySelectorAll("[data-i]").forEach(el=>{
    const k = el.getAttribute("data-i");
    if (I[lang] && I[lang][k]) el.innerHTML = I[lang][k];
  });
}
(function initLang(){
  const sel = document.getElementById("langSel");
  if (!sel) return;
  sel.addEventListener("change", ()=>applyLang(sel.value));
  applyLang("en");
})();

/* =========================
   Countdown (sabit 50 gün)
========================= */
function tick(){
  const left = Math.max(0, CONFIG.launchAt - Date.now());
  const d = Math.floor(left / 86400000);
  const h = Math.floor((left % 86400000) / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  const pad = n=>n.toString().padStart(2,"0");
  const ids = ["cdDays","cdHours","cdMins","cdSecs"];
  [d,h,m,s].forEach((v,i)=>{
    const el = document.getElementById(ids[i]);
    if (el && el.textContent !== pad(v)) el.textContent = pad(v);
  });
}
tick(); setInterval(tick, 1000);

/* =========================
   Aktif hafta (7g/7g/7g/geri)
========================= */
function getActiveWeek(){
  const days = Math.floor((Date.now() - CONFIG.saleStart) / 86400000);
  if (days < 7)  return 0;
  if (days < 14) return 1;
  if (days < 21) return 2;
  return 3;
}
function updateActiveWeekUI(){
  const w = getActiveWeek();
  for(let i=0;i<4;i++){
    const btn = document.getElementById("buyW"+i);
    if (!btn) continue;
    if (i === w) {
      btn.disabled = false;
      btn.classList.add("active-week");
    } else {
      btn.disabled = true;
      btn.classList.remove("active-week");
    }
  }
}
updateActiveWeekUI();

/* =========================
   Maliyet Hesap
========================= */
function updateCosts(){
  const qty = parseFloat((document.getElementById("buyAmount")?.value||"0").toString().replace(/[^\d.]/g,"")) || 0;
  CONFIG.weekPrices.forEach((p,i)=>{
    const cost = qty * p;
    const priceEl = document.getElementById("p"+i);
    const costEl  = document.getElementById("c"+i);
    if (priceEl) priceEl.textContent = p.toFixed(4);
    if (costEl)  costEl.textContent  = (isFinite(cost)?cost:0).toLocaleString();
  });
}
document.getElementById("buyAmount")?.addEventListener("input", updateCosts);
updateCosts();

/* =========================
   NFT Grid (contain)
========================= */
(function renderNFTs(){
  const g = document.getElementById("nftGrid");
  if (!g) return;
  let html = "";
  CONFIG.nfts.forEach(n=>{
    const img = `assets/images/mask/${n.id}.png`;
    const link = `${CONFIG.collectionUrl}?tokenId=${n.id}`;
    html += `
      <div class="nft">
        <img src="${img}" alt="${n.name}" loading="lazy"
             style="aspect-ratio:1/1;object-fit:contain;background:#0f1a30;padding:8px;border-bottom:1px solid #1d2d50"
             onerror="this.style.display='none'">
        <div class="meta">
          <div>
            <b>${n.name}</b>
            <div style="color:#9fb6e6;font-size:.9rem">Supply: ${n.supply.toLocaleString()}</div>
          </div>
          <span class="tag">${n.rarity}</span>
        </div>
        <a class="z-btn z-btn-ghost" style="margin:0 10px 10px" href="${link}" target="_blank" rel="noopener">View ↗</a>
      </div>`;
  });
  g.innerHTML = html;
})();

/* =========================
   Hesaplayıcı
========================= */
(function setupCalc(){
  const amount=document.getElementById("stakeAmount");
  const duration=document.getElementById("stakeDuration");
  const nft=document.getElementById("nftBoost");
  const early=document.getElementById("earlyBoost");
  const total=document.getElementById("resultTotal");
  const monthly=document.getElementById("resultMonthly");
  const boost=document.getElementById("resultBoost");
  if(!amount||!duration||!nft||!early||!total||!monthly||!boost) return;

  const apy={30:12,90:24,180:40,365:65,540:85};
  const calc=()=>{
    const a=parseFloat((amount.value||"0").toString().replace(/[^\d.]/g,""))||0;
    const d=parseInt(duration.value,10)||0;
    const base=apy[d]||0;
    const nb=parseFloat(nft.value||"0"), eb=parseFloat(early.value||"0");
    const tb=nb+eb;
    const gross=a*((base+tb)/100)*(d/365);
    const m=gross/(d/30);
    total.textContent=(gross.toFixed(2))+" ZUZU";
    monthly.textContent=(m.toFixed(2))+" ZUZU";
    boost.textContent="+"+tb+"%";
  };
  document.getElementById("calcBtn")?.addEventListener("click",calc);
  calc();
})();
// ------- PATCH START: robust provider detection + mobile MM -------

function isMobile(){
  return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
}
function inMetaMaskMobile(){
  // bazı sürümlerde UA içinde MetaMaskMobile geçer, bazı sürümlerde geçmez
  return typeof window !== 'undefined' && !!window.ethereum && !window.ethereum.isBraveWallet;
}
function buildMetaMaskDeepLink(){
  // MetaMask uygulamasında bu sayfayı aç
  return `https://metamask.app.link/dapp/${location.host}${location.pathname}`;
}

/** Çoklu provider varsa gerçek MetaMask'ı veya ilk EIP-1193 provider'ı döndür */
function getInjectedMetaMask(){
  const eth = window.ethereum;
  if (!eth) return null;

  // 1) Standart “isMetaMask”
  if (eth.isMetaMask) return eth;

  // 2) Çoklu provider array’i varsa önce MetaMask’ı, yoksa ilk provider’ı al
  if (Array.isArray(eth.providers) && eth.providers.length){
    const mm = eth.providers.find(p => p && p.isMetaMask);
    return mm || eth.providers[0];
  }

  // 3) Bazı mobil sürümler "isMetaMask" set etmiyor, ama ethereum var → kabul et
  return eth;
}

let provider, signer, currentAccount = null, currentChainId = null;

async function ensureProvider(){
  // 1) Herhangi bir EIP-1193 provider varsa kullan
  if (typeof window !== 'undefined' && window.ethereum){
    const injected = getInjectedMetaMask();
    if (injected){
      provider = new ethers.providers.Web3Provider(injected, "any");
      return provider;
    }
  }

  // 2) Mobil tarayıcıdaysak MetaMask uygulamasına yönlendir
  if (isMobile()){
    const link = buildMetaMaskDeepLink();
    // Eğer kullanıcı zaten MetaMask içindeyse yönlendirme yapma
    if (!inMetaMaskMobile()) {
      window.location.href = link;
      throw new Error("deeplink: redirecting to MetaMask app");
    }
  }

  // 3) Son çare uyarı
  alert("MetaMask not detected. Please install MetaMask.");
  throw new Error("No MetaMask");
}

async function connectWallet(){
  await ensureProvider();

  const accounts = await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  currentAccount = accounts[0];
  currentChainId = (await provider.getNetwork()).chainId;

  const btn = document.getElementById("connectBtn");
  if (btn && currentAccount) {
    btn.textContent = `${currentAccount.slice(0,6)}...${currentAccount.slice(-4)}`;
  }

  // Dinleyiciler (hangi provider ise ona bağlan)
  const eth = window.ethereum;
  if (eth && !eth._zuzuBound){
    eth.on("accountsChanged", (accs)=>{
      const b = document.getElementById("connectBtn");
      if (accs && accs.length>0) {
        currentAccount = accs[0];
        if (b) b.textContent = `${currentAccount.slice(0,6)}...${currentAccount.slice(-4)}`;
      } else {
        currentAccount = null;
        if (b) b.textContent = "Connect Wallet";
      }
    });
    eth.on("chainChanged", ()=>{
      window.location.reload();
    });
    eth._zuzuBound = true;
  }
}

/** Connect butonundaki guard – ethereum varsa uyarı verme */
(function guardConnectBtn(){
  const b = document.getElementById('connectBtn');
  if(!b) return;
  b.addEventListener('click', ()=>{
    if(!window.ethereum){
      if (isMobile()){
        // dış tarayıcıdaysa MetaMask uygulamasında aç
        const link = buildMetaMaskDeepLink();
        window.location.href = link;
      } else {
        alert('MetaMask not detected. Please install MetaMask and refresh the page.');
      }
    }
  }, {capture:true});
})();

// ------- PATCH END -------
(function ensureTickerVisible(){
  const track = document.getElementById('exTrack');
  if(!track) return;
  track.style.willChange = 'transform';
  track.style.transform = 'translateX(0)';
  setTimeout(()=>{ track.style.transform = ''; }, 60);
})();
