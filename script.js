/* =========================
   ZUZU – Global Config
========================= */
const CONFIG = {
  // EVM alanlarını koruyoruz ama kullanmıyoruz
  ownerAddress: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3",
  contractAddress: "0xF2bbbEcB417725813BF5E940d678793fACDa9729",
  collectionUrl: "https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a/contract/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts",

  // ✅ Solana kasa adresi
  treasurySolana: "31Cjkx2PA5oMapNxxGAiZhuHDcvAyQ7hogqB8Hx6f1pW",

  // (Opsiyonel) sabit tarih istersen doldur: "2025-10-01T18:00:00Z"
  launchAtISO: "",

  // Haftalık fiyatlar
  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100],
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

/* =========================
   Çoklu Dil (EN/TR/FR/ES)
========================= */
const I = { /* (içerikler aynı — kısaltıldı) */ };
I.en={nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
hero_lead:"Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high <b>utility</b>.",
cta_stake:"Start Staking",cta_nft:"NFT Rewards",collection_page:"Collection Page",contract:"Contract:",
days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",amount:"Amount (ZUZU)",
w1:"Week 1 (Cheapest)",w2:"Week 2",w3:"Week 3",w4:"Week 4 (Last Chance)",cost:"Cost:",buy:"Buy",exchanges:"Supported Exchanges",
stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>. Early stakers get badge & airdrop priority.",
calc_title:"Earnings Calculator",amount2:"Amount (ZUZU)",lock:"Lock Period",nft_have:"Have NFT?",early:"Early Badge",calc_btn:"Calculate",
ret:"Total Return",avg:"Monthly Avg",boost:"Total Boost",token_title:"Tokenomics (Visualized)",road_title:"Roadmap",
road_lead:"Clear plan focused on community, staking, NFT drops, listings."};
I.tr={/* ... aynı içerik ... */}; I.fr={/* ... */}; I.es={/* ... */};

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
   Countdown — kalıcı tarih
========================= */
const LS_KEYS = { launch:"zuzu_launch_at", saleStart:"zuzu_sale_start" };
const DAY = 86400000;
const DEFAULT_OFFSET = 50*DAY;

function getPersistedTs(key, fallbackTs){
  const v = Number(localStorage.getItem(key));
  if (Number.isFinite(v) && v>0) return v;
  localStorage.setItem(key, String(fallbackTs));
  return fallbackTs;
}

const LAUNCH_AT = (() => {
  if (CONFIG.launchAtISO) return new Date(CONFIG.launchAtISO).getTime();
  const first = Date.now() + DEFAULT_OFFSET;
  return getPersistedTs(LS_KEYS.launch, first);
})();
const SALE_START = getPersistedTs(LS_KEYS.saleStart, Date.now());

function tick(){
  const left = Math.max(0, LAUNCH_AT - Date.now());
  const d = Math.floor(left / DAY);
  const h = Math.floor((left % DAY) / 3600000);
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
   Presale – aktif hafta
========================= */
function getActiveWeek(){
  const days = Math.floor((Date.now() - SALE_START) / DAY);
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
    if (i === w) { btn.disabled = false; btn.classList.add("active-week"); }
    else { btn.disabled = true; btn.classList.remove("active-week"); }
  }
}
updateActiveWeekUI();

/* =========================
   Maliyet hesap
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
   NFT Grid
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

/* =========================
   LİNKLER + KONTRAT
========================= */
(function setupLinks(){
  const c = CONFIG.contractAddress;
  const short = `${c.slice(0,6)}...${c.slice(-4)}`;
  const cd = document.getElementById("contractDisplay");
  const cd2 = document.getElementById("contractDisplay2");
  if (cd)  cd.textContent = short;
  if (cd2) cd2.textContent = c;

  const t1 = document.getElementById("thirdwebNFTRoute");
  const t2 = document.getElementById("thirdwebNFTRoute2");
  if (t1) t1.href = CONFIG.collectionUrl;
  if (t2) t2.href = CONFIG.collectionUrl;
})();

/* =========================================================
   SOLANA akışına bağlama
========================================================= */

// EVM kartını gizle
(function hideEvmCard(){
  const netSel = document.getElementById("networkSel");
  if (!netSel) return;
  const card = netSel.closest(".card");
  if (card) card.style.display = "none";
})();

// Connect Wallet => Solana connect
(function wireSolanaConnect(){
  const btn = document.getElementById("connectBtn");
  if (!btn) return;
  btn.addEventListener("click", ()=>{
    if (typeof window.__zuzuSolanaConnect === "function"){
      window.__zuzuSolanaConnect();
    } else {
      alert("Loading Solana wallet… please wait a moment and try again.");
    }
  });
})();

// Hafta butonları → Solana USDT
function handleWeekClick(weekIndex){
  const qty = parseFloat((document.getElementById("buyAmount")?.value||"0").toString().replace(/[^\d.]/g,"")) || 0;
  if (qty <= 0) { alert("Enter a valid ZUZU amount."); return; }

  const active = getActiveWeek();
  if (weekIndex !== active) { alert("This week is not active."); return; }
  const price = CONFIG.weekPrices[weekIndex];
  const cost  = qty * price;

  const usdtInput = document.getElementById("usdtAmount");
  if (usdtInput) usdtInput.value = cost.toFixed(2);

  const box = document.getElementById("solanaWalletBox");
  if (box?.scrollIntoView) box.scrollIntoView({behavior:"smooth", block:"center"});

  const usdtBtn = document.getElementById("btnBuyUSDT");
  if (usdtBtn){ usdtBtn.classList.add("pulse"); setTimeout(()=>usdtBtn.classList.remove("pulse"), 1200); }
}
["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
  const b = document.getElementById(id);
  if (b) b.onclick = ()=>handleWeekClick(i);
});

/* =========================
   Ticker fix
========================= */
(function ensureTickerVisible(){
  const track = document.getElementById('exTrack');
  if(!track) return;
  track.style.willChange = 'transform';
  track.style.transform = 'translateX(0)';
  setTimeout(()=>{ track.style.transform = ''; }, 50);
})();

/* =========================
   Global UI helpers
========================= */
window.__zuzuSetConnectLabel = function(text){
  const b = document.getElementById('connectBtn');
  if (b && text) b.textContent = text;
};

/* =========================
   Referral — UI & param kaydet
========================= */
(function referralInit(){
  // 1) URL'den ref paramını yakala ve kaydet
  const url = new URL(window.location.href);
  const ref = url.searchParams.get('ref');
  if (ref) localStorage.setItem('zuzu_ref', ref);

  // 2) "Seni davet eden" bilgisi
  const who = localStorage.getItem('zuzu_ref');
  const note = document.getElementById('refYouWereInvited');
  if (note && who){
    note.style.display = 'block';
    note.textContent = `Invited by: ${who.slice(0,4)}...${who.slice(-4)}`;
  }

  // 3) Kopyala & Paylaş
  const input = document.getElementById('refLink');
  const copyBtn = document.getElementById('btnCopyRef');
  const shareBtn = document.getElementById('btnShareRef');

  if (copyBtn) copyBtn.onclick = async ()=>{
    if (!input?.value) return alert('Connect wallet to get your referral link.');
    try{
      await navigator.clipboard.writeText(input.value);
      copyBtn.textContent = 'Copied ✔';
      setTimeout(()=>copyBtn.textContent='Copy Link', 1200);
    }catch(_){ alert('Copy failed'); }
  };

  if (shareBtn) shareBtn.onclick = async ()=>{
    if (!input?.value) return alert('Connect wallet to get your referral link.');
    const data = { title:'ZUZUCOIN Presale', text:'Join ZUZU presale with my referral link!', url: input.value };
    if (navigator.share) { try{ await navigator.share(data); }catch(_){} }
    else { try{ await navigator.clipboard.writeText(input.value); alert('Link copied.'); }catch(_){ alert('Share not supported'); } }
  };

})();

// Solana bağlantısından sonra referral linkini doldurmak için
window.__zuzuSetReferral = function(myAddr){
  const input = document.getElementById('refLink');
  if (!input) return;
  const base = location.origin + location.pathname;
  input.value = `${base}?ref=${encodeURIComponent(myAddr)}`;
};
