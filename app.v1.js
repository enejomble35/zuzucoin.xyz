// ================================
// ZUZU — APP CORE (UI + i18n + UX)
// ================================

// ---- Global Config (burayı istediğin zaman değiştirebilirsin)
const ZUZU_CONFIG = {
  tokenSymbol: "ZUZU",
  tokenDecimals: 9,
  presalePrice: 0.005, // USDT örnek fiyat (UI gösterimi)
  // senin SOL alıcı adresin:
  ownerSol: "31Cjkx2PA5oMapNxxGAiZhuHDcvAyQ7hogqB8Hx6f1pW",
  // USDT (SPL) mint (mainnet) — istersen doğrula/degistir
  usdtMint: "Es9vMFrzaCwZq1whatever-placeholder-fix-if-needed",

  // NFT / koleksiyon linkleri
  contractAddress:"0xF2bbbEcB417725813BF5E940d678793fACDa9729",
  collectionUrl:"https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a/contract/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts",

  // Presale haftalık USDT fiyatları (UI)
  weekPrices:[0.0050,0.0065,0.0080,0.0100],

  // NFT grid içerikleri
  nfts:[
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

// global export (solana.v1.js içinden de erişilecek)
window.ZUZU_CONFIG = ZUZU_CONFIG;

// ---- i18n (TR/EN)
const I = {
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",
      hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",collection_page:"Koleksiyon Sayfası",contract:"Kontrat:",
      days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",
      w1:"1. Hafta (En Ucuz)",w2:"2. Hafta",w3:"3. Hafta",w4:"4. Hafta (Son Fırsat)",cost:"Maliyet:",buy:"Satın Al",exchanges:"Desteklenen Borsalar",
      stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile pasif gelir elde et. Erken stake edenler rozet & airdrop önceliği alır.",
      calc_title:"Kazanç Hesaplayıcı",amount2:"Miktar (ZUZU)",lock:"Kilit Süresi",nft_have:"Elinde NFT var mı?",early:"Erken Rozet",calc_btn:"Hesapla",
      ret:"Toplam Getiri",avg:"Aylık Ortalama",boost:"Toplam Boost",token_title:"Tokonomi (Görselleştirilmiş)",road_title:"Yol Haritası",
      road_lead:"Topluluk, staking, NFT drop’ları ve listelemelere odaklı plan."},
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
      hero_lead:"Stake and win <b>ZUZU Mascot NFT</b>. Limited supply, high <b>utility</b>.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",collection_page:"Collection Page",contract:"Contract:",
      days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",
      w1:"Week 1 (Cheapest)",w2:"Week 2",w3:"Week 3",w4:"Week 4 (Last Chance)",cost:"Cost:",buy:"Buy",exchanges:"Supported Exchanges",
      stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>.",
      calc_title:"Earnings Calculator",amount2:"Amount (ZUZU)",lock:"Lock Period",nft_have:"Have NFT?",early:"Early Badge",calc_btn:"Calculate",
      ret:"Total Return",avg:"Monthly Avg",boost:"Total Boost",token_title:"Tokenomics (Visualized)",road_title:"Roadmap",road_lead:"Plan focused on community, staking, NFT drops, listings."}
};
window.ZUZU_I18N = I;

function applyLang(lang="tr"){
  document.querySelectorAll("[data-i]").forEach(el=>{
    const k = el.getAttribute("data-i");
    if (I[lang] && I[lang][k]) el.innerHTML = I[lang][k];
  });
}
(function initLang(){
  const sel = document.getElementById("langSel");
  if(sel){ sel.addEventListener("change", ()=>applyLang(sel.value)); }
  applyLang("tr");
})();

// ---- Countdown (sabit tarih: window.LAUNCH_AT_ISO)
(function countdown(){
  const target = new Date(window.LAUNCH_AT_ISO || "2025-11-05T13:00:00+03:00").getTime();
  const pad=n=>n.toString().padStart(2,"0");
  function tick(){
    const left=Math.max(0, target - Date.now());
    const d=Math.floor(left/86400000),
          h=Math.floor((left%86400000)/3600000),
          m=Math.floor((left%3600000)/60000),
          s=Math.floor((left%60000)/1000);
    const ids=["cdDays","cdHours","cdMins","cdSecs"];
    [d,h,m,s].forEach((v,i)=>{ const el=document.getElementById(ids[i]); if(el && el.textContent!==pad(v)) el.textContent=pad(v); });
  }
  tick(); setInterval(tick,1000);
})();

// ---- NFT Grid render
(function renderNFTs(){
  const g=document.getElementById("nftGrid"); if(!g) return;
  let html="";
  ZUZU_CONFIG.nfts.forEach(n=>{
    const img=`assets/images/mask/${n.id}.png`;
    const link=`${ZUZU_CONFIG.collectionUrl}?tokenId=${n.id}`;
    html+=`
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
  g.innerHTML=html;
})();

// ---- Linkler + Kontrat
(function setupLinks(){
  const c=ZUZU_CONFIG.contractAddress;
  const short=`${c.slice(0,6)}...${c.slice(-4)}`;
  const cd=document.getElementById("contractDisplay");
  const cd2=document.getElementById("contractDisplay2");
  if (cd)  cd.textContent = short;
  if (cd2) cd2.textContent = c;

  const t1=document.getElementById("thirdwebNFTRoute");
  const t2=document.getElementById("thirdwebNFTRoute2");
  if (t1) t1.href = ZUZU_CONFIG.collectionUrl;
  if (t2) t2.href = ZUZU_CONFIG.collectionUrl;
})();

// ---- Presale maliyet görselleme (örnek: 10k ZUZU)
(function presaleCosts(){
  const qty=10000;
  ZUZU_CONFIG.weekPrices.forEach((p,i)=>{
    const priceEl=document.getElementById("p"+i);
    const costEl=document.getElementById("c"+i);
    if(priceEl) priceEl.textContent = p.toFixed(4);
    if(costEl)  costEl.textContent  = (qty*p).toLocaleString();
  });
  ["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
    const b=document.getElementById(id); if(!b) return;
    b.addEventListener("click", ()=>{
      const cost=(qty*ZUZU_CONFIG.weekPrices[i]).toFixed(2);
      const input=document.getElementById("amountUSDT");
      if(input){ input.value = cost; input.focus(); }
    });
  });
})();

// ---- Referral
(function referral(){
  const makeId=()=>Math.random().toString(36).slice(2,10);
  const myRef=localStorage.getItem("zref")||makeId(); localStorage.setItem("zref",myRef);
  const url=new URL(location.href); url.searchParams.set("ref",myRef);
  const refIn=document.getElementById("refLink"); if(refIn) refIn.value=url.toString();
  document.getElementById("copyRef")?.addEventListener("click", async()=>{
    try{ await navigator.clipboard.writeText(refIn.value); alert("Kopyalandı!"); }catch{ alert("Kopyalanamadı"); }
  });
  document.getElementById("shareRef")?.addEventListener("click", async()=>{
    try{
      if(navigator.share){ await navigator.share({title:"Join ZUZU",url:refIn.value}); }
      else { await navigator.clipboard.writeText(refIn.value); alert("Link kopyalandı."); }
    }catch(e){}
  });
})();

// ---- Ticker görünürlük küçük hack
(function ensureTickerVisible(){
  const track=document.getElementById('exTrack'); if(!track) return;
  track.style.willChange='transform'; track.style.transform='translateX(0)'; setTimeout(()=>{ track.style.transform=''; },50);
})();

// ---- Stake Hesaplayıcı (UI)
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

// ---- Solana modülü ile butonları bağla (solana.v1.js gelen global ile)
(function bindWalletButtons(){
  const tryBind=()=>{
    if(!window.ZUZU_Solana){ setTimeout(tryBind,100); return; }
    // Connect/Disconnect
    document.getElementById("connectBtn")?.addEventListener("click",  ()=>ZUZU_Solana.open());
    document.getElementById("btnConnect")?.addEventListener("click", ()=>ZUZU_Solana.open());
    document.getElementById("btnDisconnect")?.addEventListener("click", ()=>ZUZU_Solana.disconnect());

    // SOL / USDT gönder
    document.getElementById("sendSOL")?.addEventListener("click", ()=>ZUZU_Solana.sendSOL("amountSOL"));
    document.getElementById("sendUSDT")?.addEventListener("click", ()=>ZUZU_Solana.sendUSDT("amountUSDT", ZUZU_CONFIG.usdtMint));
  };
  tryBind();
})();
