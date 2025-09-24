/* =========================
   CONFIG
========================= */
const CONFIG = {
  // SABİT LAUNCH: 23 Kasım 2025 Pazar 13:00 (TR, UTC+3)
  LAUNCH_ISO: "2025-11-23T13:00:00+03:00",

  WEEK_DAYS: 15,
  weekPrices: [0.040, 0.060, 0.080, 0.100],

  POLYGON_CHAINID: "0x89",
  USDT: "0xC2132D05D31c914a87C6611C10748AEb04B58e8F", // Polygon USDT (6)
  TREASURY: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3",

  LS_LANG: "zuzu_lang",
  LS_REF_SELF: "zuzu_ref_self",
  LS_REF_COUNT: "zuzu_ref_count"
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
      stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>.",
      token_title:"Tokenomics (Visualized)",road_title:"Roadmap"},
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",
      hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",
      stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile kazan.",
      token_title:"Tokonomi (Görsel)",road_title:"Yol Haritası"},
  fr:{nav_presale:"Pré-vente",nav_stake:"Stake",nav_nft:"Récompenses NFT",nav_roadmap:"Feuille de route",nav_token:"Tokenomics",connect:"Connecter le Wallet",
      hero_badge:"Pré-vente • Stake pour gagner un NFT",hero_title:"ZUZU — Hérisson Robotique 🦔⚡",
      hero_lead:"Stake et gagne un <b>NFT Mascotte ZUZU</b>.",cta_stake:"Commencer le Stake",cta_nft:"Récompenses NFT",
      days:"JOURS",hours:"HEURES",mins:"MINUTES",secs:"SECONDES",
      presale_title:"Pré-vente — Compte à rebours",presale_lead:"Prépare-toi pour la pré-vente ZUZU ! <b>Allocation limitée</b>.",
      stake_title:"Stake Pro — Verrouille, Gagne, Reçois un NFT ✨",stake_lead:"Verrouille ton ZUZU et gagne <b>APY + BOOST NFT</b>.",
      token_title:"Tokenomics (Visualisé)",road_title:"Feuille de route"},
  pt:{nav_presale:"Pré-venda",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Roteiro",nav_token:"Tokenomics",connect:"Conectar Carteira",
      hero_badge:"Pré-venda • Stake para ganhar NFT",hero_title:"ZUZU — Ouriço Robótico 🦔⚡",
      hero_lead:"Faça stake e ganhe <b>NFT Mascote ZUZU</b>.",cta_stake:"Começar Stake",cta_nft:"Recompensas NFT",
      days:"DIAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",
      presale_title:"Pré-venda — Contagem regressiva",presale_lead:"Prepare-se para a pré-venda ZUZU! <b>Alocação limitada</b>.",
      stake_title:"Stake Pro — Trave, Ganhe, Receba NFT ✨",stake_lead:"Trave seu ZUZU e ganhe <b>APY + BOOST NFT</b>.",
      token_title:"Tokenomics (Visualizado)",road_title:"Roteiro"},
  ru:{nav_presale:"Предпродажа",nav_stake:"Стейкинг",nav_nft:"NFT награды",nav_roadmap:"Дорожная карта",nav_token:"Токеномика",connect:"Подключить кошелёк",
      hero_badge:"Предпродажа • Стейкинг для NFT",hero_title:"ЗУЗУ — Робо-Ёж 🦔⚡",
      hero_lead:"Стейкай и получай <b>маскот NFT ZUZU</b>.",cta_stake:"Начать стейкинг",cta_nft:"NFT награды",
      days:"ДНИ",hours:"ЧАСЫ",mins:"МИН.",secs:"СЕК.",
      presale_title:"Предпродажа — Обратный отсчёт",presale_lead:"Готовься к предпродаже ZUZU! <b>Ограниченная аллокация</b>.",
      stake_title:"Stake Pro — Заморозь, Заработай, Получи NFT ✨",stake_lead:"Заморозь ZUZU и получай <b>APY + NFT BOOST</b>.",
      token_title:"Токеномика (визуально)",road_title:"Дорожная карта"},
  es:{nav_presale:"Pre-venta",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Hoja de ruta",nav_token:"Tokenomics",connect:"Conectar Billetera",
      hero_badge:"Pre-venta • Stake para ganar NFT",hero_title:"ZUZU — Erizo Robótico 🦔⚡",
      hero_lead:"Haz stake y gana <b>NFT Mascota ZUZU</b>.",cta_stake:"Empezar Stake",cta_nft:"Recompensas NFT",
      days:"DÍAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",
      presale_title:"Pre-venta — Cuenta regresiva",presale_lead:"¡Prepárate para la pre-venta ZUZU! <b>Asignación limitada</b>.",
      stake_title:"Stake Pro — Bloquea, Gana, Obtén NFT ✨",stake_lead:"Bloquea tu ZUZU y gana <b>APY + BOOST NFT</b>.",
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

/* ========== Countdown — sabit tarih ========== */
const LAUNCH = Date.parse(CONFIG.LAUNCH_ISO);
function tick(){
  const left = Math.max(0, LAUNCH - Date.now());
  const d=Math.floor(left/86400000);
  const h=Math.floor((left%86400000)/3600000);
  const m=Math.floor((left%3600000)/60000);
  const s=Math.floor((left%60000)/1000);
  const pad=n=>n.toString().padStart(2,"0");
  const dEl=$("#cdDays"),hEl=$("#cdHours"),mEl=$("#cdMins"),sEl=$("#cdSecs");
  if(dEl) dEl.textContent=pad(d);
  if(hEl) hEl.textContent=pad(h);
  if(mEl) mEl.textContent=pad(m);
  if(sEl) sEl.textContent=pad(s);
}
tick(); setInterval(tick,1000);

/* Presale tarihleri (4x15 gün) */
const START = LAUNCH - (60*24*3600*1000);
const W1_START = START;
const W2_START = W1_START + CONFIG.WEEK_DAYS*86400000;
const W3_START = W2_START + CONFIG.WEEK_DAYS*86400000;
const W4_START = W3_START + CONFIG.WEEK_DAYS*86400000;
const W_END    = LAUNCH;

function fmtRange(a,b){
  const dA = new Date(a), dB = new Date(b - 86400000);
  const fmt = (d)=> d.toLocaleDateString('tr-TR',{day:'2-digit',month:'short'});
  return `${fmt(dA)} — ${fmt(dB)}`;
}
$("#w1d")&&( $("#w1d").textContent = fmtRange(W1_START, W2_START) );
$("#w2d")&&( $("#w2d").textContent = fmtRange(W2_START, W3_START) );
$("#w3d")&&( $("#w3d").textContent = fmtRange(W3_START, W4_START) );
$("#w4d")&&( $("#w4d").textContent = fmtRange(W4_START, W_END) );

function activeWeekIndex(now=Date.now()){
  if(now>=W1_START && now<W2_START) return 0;
  if(now>=W2_START && now<W3_START) return 1;
  if(now>=W3_START && now<W4_START) return 2;
  if(now>=W4_START && now<=W_END)   return 3;
  return -1; // presale dışı
}
function highlightWeek(){
  const idx = activeWeekIndex();
  ["wk1","wk2","wk3","wk4"].forEach((id,i)=>{ const el=$("#"+id); if(!el) return; el.classList.toggle("active", i===idx); });
  $("#activeW")&&( $("#activeW").textContent = idx>=0?`W${idx+1}`:"—");
}
highlightWeek();
setInterval(highlightWeek, 60000);

/* Fiyat/cost hesap */
function updateCost(){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  const idx = activeWeekIndex();
  const price = CONFIG.weekPrices[Math.max(0,idx)];
  const cost = qty * price;
  const el=$("#costUSDT"); if(el) el.textContent = cost.toLocaleString(undefined,{maximumFractionDigits:2});
}
$("#buyAmount")?.addEventListener("input", updateCost);
updateCost();

/* ========== Invite & Earn (frontend) ========== */
(function referralsInit(){
  // ref ziyaret
  const url = new URL(location.href);
  const incoming = url.searchParams.get("ref");
  if(incoming){
    // basit sayaç: her yeni kişi gelen kişinin sayacını localStorage'ta artırır (demo)
    const key = `${CONFIG.LS_REF_COUNT}:${incoming}`;
    const prev = parseInt(localStorage.getItem(key)||"0",10);
    localStorage.setItem(key, String(prev+1));
  }

  // kendi ref kodu
  let selfCode = localStorage.getItem(CONFIG.LS_REF_SELF);
  if(!selfCode){
    selfCode = (Math.random().toString(36).slice(2,8)+Date.now().toString(36).slice(-4)).toUpperCase();
    localStorage.setItem(CONFIG.LS_REF_SELF, selfCode);
  }
  const out=$("#refLink");
  if(out) out.value = `${location.origin}${location.pathname}?ref=${selfCode}`;
  $("#copyRef")?.addEventListener("click", ()=>{ navigator.clipboard.writeText(out.value); alert("Copied!"); });

  // sayım
  const myCount = parseInt(localStorage.getItem(`${CONFIG.LS_REF_COUNT}:${selfCode}`)||"0",10);
  $("#refCount")&&( $("#refCount").textContent = myCount );
  $("#refBonus")&&( $("#refBonus").textContent = (myCount*250).toLocaleString() );
})();

/* ========== NFT grid (12 adet) ========== */
(function renderNFTs(){
  const g=$("#nftGrid"); if(!g) return;
  g.innerHTML = Array.from({length:12}).map((_,i)=>`
    <div class="nft">
      <img src="assets/images/mask/${i}.png" alt="ZUZU #${i+1}" loading="lazy"
           onerror="this.style.display='none'">
      <div class="meta"><b>ZUZU #${i+1}</b><span class="tag">${i%5===0?'Legendary':(i%2?'Rare':'Epic')}</span></div>
    </div>`).join("");
})();

/* =========================
   Wallet (MetaMask / Polygon)
========================= */
let provider, signer, userAddress;

function hasMM(){ return typeof window.ethereum!=="undefined"; }

async function ensurePolygon(){
  const chainId = await provider.send("eth_chainId",[]);
  if(chainId !== CONFIG.POLYGON_CHAINID){
    try{
      await provider.send("wallet_switchEthereumChain",[ { chainId: CONFIG.POLYGON_CHAINID } ]);
    }catch(e){
      await provider.send("wallet_addEthereumChain",[{
        chainId: CONFIG.POLYGON_CHAINID,
        chainName: "Polygon Mainnet",
        rpcUrls: ["https://polygon-rpc.com"],
        nativeCurrency: { name:"MATIC", symbol:"MATIC", decimals:18 },
        blockExplorerUrls: ["https://polygonscan.com"]
      }]);
    }
  }
}

async function connectWallet(){
  if(!hasMM()){ alert("MetaMask not found. Please install MetaMask."); return; }
  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts",[]);
  await ensurePolygon();
  signer = provider.getSigner();
  userAddress = await signer.getAddress();
  const btn=$("#connectBtn");
  if(btn) btn.textContent = `${userAddress.slice(0,6)}...${userAddress.slice(-4)}`;
  const d=$("#disconnectBtn"); if(d) d.style.display="inline-flex";

  // ref linki adresinle güncelle (daha profesyonel)
  localStorage.setItem(CONFIG.LS_REF_SELF, userAddress);
  const out=$("#refLink"); if(out) out.value = `${location.origin}${location.pathname}?ref=${userAddress}`;
}
$("#connectBtn")?.addEventListener("click", connectWallet);
$("#disconnectBtn")?.addEventListener("click", ()=>{ provider=null; signer=null; userAddress=null; $("#connectBtn").textContent = I[(localStorage.getItem(CONFIG.LS_LANG)||"en")].connect || "Connect Wallet"; $("#disconnectBtn").style.display="none"; });

/* BUY */
async function buyNow(){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  const pay = $("#payWith")?.value || "USDT";
  const idx = activeWeekIndex();
  if(idx<0){ alert("Presale is not active yet."); return; }
  if(!qty || qty<=0){ alert("Enter a valid amount."); return; }
  if(!userAddress){ await connectWallet(); if(!userAddress) return; }

  const price = CONFIG.weekPrices[idx];
  const usdtCost = qty * price;

  await ensurePolygon();

  if(pay==="MATIC"){
    // DEMO oran: 1 MATIC ≈ 0.5 USDT varsayımı (backend yoksa)
    const valueWei = ethers.utils.parseEther((usdtCost/0.5).toFixed(6));
    const tx = await signer.sendTransaction({ to: CONFIG.TREASURY, value: valueWei });
    alert("Sent. TX: "+tx.hash);
  }else{
    // USDT transfer
    const usdtAbi = ["function transfer(address to,uint256 amount) returns (bool)","function decimals() view returns (uint8)"];
    const usdt = new ethers.Contract(CONFIG.USDT, usdtAbi, signer);
    const decimals = await usdt.decimals(); // 6
    const amt = ethers.utils.parseUnits(usdtCost.toFixed(decimals), decimals);
    const t = await usdt.transfer(CONFIG.TREASURY, amt);
    alert("USDT sent. TX: "+t.hash);
  }
}
$("#buyNow")?.addEventListener("click", buyNow);
