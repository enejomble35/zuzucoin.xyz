/* =========================
   ZUZU – Global Config
========================= */
const CONFIG = {
  collectionUrl: "https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a/contract/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts",
  // Countdown: 50 gün
  launchAt: Date.now() + 50 * 24 * 60 * 60 * 1000,
  // Satış haftaları: basit 7g+7g+7g+geri kalan
  saleStart: Date.now(),
  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100], // referans fiyat (USDT eşdeğeri; yalnızca ekranda)
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
  fr:{}, es:{}
};
I.fr = {...I.en}; I.es = {...I.en};

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
  applyLang(sel.value || "en");
})();

/* =========================
   Countdown (50 gün)
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
   Presale – aktif hafta
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
    if (i === w) { btn.disabled = false; btn.classList.add("active-week"); }
    else { btn.disabled = true; btn.classList.remove("active-week"); }
  }
}
updateActiveWeekUI();

/* =========================
   Maliyet hesap (tüm haftalar)
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
   NFT Grid render (contain)
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
   LİNKLER
========================= */
(function setupLinks(){
  const t1 = document.getElementById("thirdwebNFTRoute");
  const t2 = document.getElementById("thirdwebNFTRoute2");
  if (t1) t1.href = CONFIG.collectionUrl;
  if (t2) t2.href = CONFIG.collectionUrl;
})();

/* =========================================================
   SOLANA CÜZDAN – PHANTOM / SOLFLARE / BACKPACK
   (EVM/MetaMask bölümü tamamen kaldırıldı)
========================================================= */

const SolWallet = (()=>{

  let currentProvider = null;     // seçilen provider objesi
  let connectedPubkey = null;     // base58
  const listenersBound = new WeakSet();

  function detect(){
    const P = {};
    P.phantom  = (window.solana && window.solana.isPhantom) ? window.solana : null;
    P.solflare = (window.solflare && window.solflare.isSolflare) ? window.solflare : null;
    const bp = window.backpack && window.backpack.solana;
    P.backpack = (bp && bp.isBackpack) ? bp : null;
    return P;
  }

  function short(pk){ return pk ? pk.slice(0,4)+"…"+pk.slice(-4) : ""; }

  function setButton(text){
    const b = document.getElementById("connectBtn");
    if(b) b.textContent = text;
  }

  function deepLink(which){
    const host = location.origin.replace(/^https?:\/\//,'');
    if (which==="phantom")  location.href = `https://phantom.app/ul/browse/${host}`;
    if (which==="solflare") location.href = `https://solflare.com/ul/v1/browse/${host}`;
    if (which==="backpack") location.href = `https://backpack.app/ul/browse/${host}`;
  }

  async function connect(which){
    const provs = detect();
    currentProvider = (which==="phantom")  ? provs.phantom
                    : (which==="solflare") ? provs.solflare
                    : (which==="backpack") ? provs.backpack
                    : (provs.phantom || provs.solflare || provs.backpack);

    if(!currentProvider){
      // mobil – uygulama içinde aç
      deepLink(which || "phantom");
      return false;
    }

    try{
      const res = await currentProvider.connect({ onlyIfTrusted:false });
      const pk = (res?.publicKey || currentProvider.publicKey)?.toString();
      if(!pk) throw new Error("no publicKey");
      connectedPubkey = pk;
      setButton(short(pk));
      bindEvents(currentProvider);
      return true;
    }catch(e){
      console.warn("solana connect error:", e);
      alert("Connection cancelled or failed.");
      return false;
    }
  }

  async function ensureConnected(){
    if(connectedPubkey) return true;
    const provs = detect();
    for(const p of [provs.phantom, provs.solflare, provs.backpack]){
      if(!p) continue;
      try{
        const r = await p.connect({ onlyIfTrusted:true });
        const pk = (r?.publicKey || p.publicKey)?.toString();
        if(pk){ connectedPubkey = pk; setButton(short(pk)); bindEvents(p); currentProvider=p; return true; }
      }catch(_){}
    }
    // hiçbiri bağlı değilse doğrudan Phantom bağlantısı dene (yüklü değilse deep-link)
    return connect("phantom");
  }

  function bindEvents(provider){
    if(!provider || listenersBound.has(provider)) return;
    provider.on?.("connect", ()=>{ 
      const pk = provider.publicKey?.toString();
      if(pk){ connectedPubkey = pk; setButton(short(pk)); }
    });
    provider.on?.("disconnect", ()=>{ connectedPubkey=null; setButton(I[(localStorage.getItem("zuzu_lang")||"en")].connect); });
    listenersBound.add(provider);
  }

  return { connect, ensureConnected, short };
})();

// Connect butonu
document.getElementById("connectBtn")?.addEventListener("click", ()=>SolWallet.connect());

// “Buy” butonları – önce bağlan, sonra (şimdilik) demo akış
["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
  const b = document.getElementById(id);
  if (!b) return;
  b.addEventListener("click", async ()=>{
    const weekActive = (i === getActiveWeek());
    if(!weekActive){ alert("This week is not active."); return; }
    const ok = await SolWallet.ensureConnected();
    if(!ok) return;
    // === Buraya gerçek SPL USDT / SOL ödeme akışı eklenecek ===
    alert("Wallet connected ✅\nPayment flow (SPL) will be wired next.");
  });
});

/* =========================
   UX küçük rötuşlar
========================= */
// Ticker ilk frame’de görünür olsun
(function ensureTickerVisible(){
  const track = document.getElementById('exTrack');
  if(!track) return;
  track.style.willChange = 'transform';
  track.style.transform = 'translateX(0)';
  setTimeout(()=>{ track.style.transform = ''; }, 50);
})();
