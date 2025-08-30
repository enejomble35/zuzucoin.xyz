/* ========= ZUZU CONFIG ========= */
const CONFIG = {
  contractAddress: "0xF2bbbEcB417725813BF5E940d678793fACDa9729",
  collectionUrl: "https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a/contract/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts",
  launchAt: Date.now() + 1000*60*60*24*17 + 1000*60*90, // 17 gün 1.5 saat
  weekPrices: [0.0050,0.0065,0.0080,0.0100],
  nfts: [
    {id:0,name:"ZUZU Hero",      rarity:"Epic",      supply:200},
    {id:1,name:"ZUZU Rogue",     rarity:"Rare",      supply:2500},
    {id:2,name:"ZUZU Berserker", rarity:"Epic",      supply:800},
    {id:3,name:"ZUZU Hacker",    rarity:"Rare",      supply:600},
    {id:4,name:"ZUZU Sorceress", rarity:"Epic",      supply:750},
    {id:5,name:"ZUZU Warrior",   rarity:"Rare",      supply:900},
    {id:6,name:"ZUZU Maiden",    rarity:"Rare",      supply:1100},
    {id:7,name:"ZUZU Ranger",    rarity:"Rare",      supply:1000},
    {id:8,name:"ZUZU Scientist", rarity:"Epic",      supply:1100},
    {id:9,name:"ZUZU Titan",     rarity:"Legendary", supply:250}
  ]
};

/* ==== Lang (kısa) ==== */
const I = {
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",hero_lead:"Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high <b>utility</b>.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",collection_page:"Collection Page",contract:"Contract:",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",amount:"Amount (ZUZU)",
      w1:"Week 1 (Cheapest)",w2:"Week 2",w3:"Week 3",w4:"Week 4 (Last Chance)",cost:"Cost:",buy:"Buy",exchanges:"Supported Exchanges",
      stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>. Early stakers get badge & airdrop priority.",
      calc_title:"Earnings Calculator",amount2:"Amount (ZUZU)",lock:"Lock Period",nft_have:"Have NFT?",early:"Early Badge",calc_btn:"Calculate",ret:"Total Return",avg:"Monthly Avg",boost:"Total Boost",
      token_title:"Tokenomics (Visualized)",road_title:"Roadmap",road_lead:"Clear plan focused on community, staking, NFT drops, listings."},
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",collection_page:"Koleksiyon Sayfası",contract:"Kontrat:",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",amount:"Miktar (ZUZU)",
      w1:"1. Hafta (En Ucuz)",w2:"2. Hafta",w3:"3. Hafta",w4:"4. Hafta (Son Fırsat)",cost:"Maliyet:",buy:"Satın Al",exchanges:"Desteklenen Borsalar",
      stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile pasif gelir elde et. Erken stake edenler rozet & airdrop önceliği alır.",
      calc_title:"Kazanç Hesaplayıcı",amount2:"Miktar (ZUZU)",lock:"Kilit Süresi",nft_have:"Elinde NFT var mı?",early:"Erken Rozet",calc_btn:"Hesapla",ret:"Toplam Getiri",avg:"Aylık Ortalama",boost:"Toplam Boost",
      token_title:"Tokonomi (Görselleştirilmiş)",road_title:"Yol Haritası",road_lead:"Topluluk, staking, NFT drop’ları ve listelemelere odaklı plan."},
  fr:{nav_presale:"Pré-vente",nav_stake:"Stake",nav_nft:"Récompenses NFT",nav_roadmap:"Feuille de route",nav_token:"Tokenomics",connect:"Connecter le Wallet"},
  es:{nav_presale:"Pre-venta",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Hoja de ruta",nav_token:"Tokenomics",connect:"Conectar Billetera"}
};
function trn(lang){
  document.querySelectorAll("[data-i]").forEach(el=>{
    const k=el.getAttribute("data-i"); if(I[lang]&&I[lang][k]) el.innerHTML=I[lang][k];
  });
}
const sel=document.getElementById("langSel"); sel.addEventListener("change",()=>trn(sel.value)); trn("en");

/* ==== Contract & links ==== */
document.getElementById("contractDisplay").textContent =
  CONFIG.contractAddress.slice(0,6)+"..."+CONFIG.contractAddress.slice(-4);
document.getElementById("contractDisplay2").textContent = CONFIG.contractAddress;
document.getElementById("thirdwebNFTRoute").href = CONFIG.collectionUrl;
document.getElementById("thirdwebNFTRoute2").href = CONFIG.collectionUrl;

/* ==== Countdown ==== */
function tick(){
  const left=Math.max(0,CONFIG.launchAt-Date.now());
  const d=Math.floor(left/864e5), h=Math.floor(left%864e5/36e5),
        m=Math.floor(left%36e5/6e4), s=Math.floor(left%6e4/1e3);
  const pad=n=>n.toString().padStart(2,"0");
  const ids=["cdDays","cdHours","cdMins","cdSecs"];
  [d,h,m,s].forEach((v,i)=>{ const el=document.getElementById(ids[i]); if(el) el.textContent=pad(v); });
}
tick(); setInterval(tick,1000);

/* ==== Pre-sale prices/cost ==== */
function updateCosts(){
  const qty=parseFloat(document.getElementById("buyAmount").value||"0");
  CONFIG.weekPrices.forEach((p,i)=>{
    const priceEl=document.getElementById("p"+i);
    const costEl=document.getElementById("c"+i);
    if(priceEl) priceEl.textContent=p.toFixed(4);
    if(costEl)  costEl.textContent=((qty*p)||0).toLocaleString();
  });
}
document.getElementById("buyAmount").addEventListener("input",updateCosts); updateCosts();

/* ==== NFT Grid render — KESMESİZ ==== */
(function renderNFTs(){
  const g=document.getElementById("nftGrid"); let html="";
  CONFIG.nfts.forEach(n=>{
    const img=`assets/images/mask/${n.id}.png`;
    const link=`${CONFIG.collectionUrl}?tokenId=${n.id}`;
    html+=`
      <div class="nft">
        <img class="nft-img" src="${img}" alt="${n.name}" loading="lazy">
        <div class="meta">
          <div><b>${n.name}</b>
            <div style="color:#9fb6e6;font-size:.9rem">Supply: ${n.supply.toLocaleString()}</div>
          </div>
          <span class="tag">${n.rarity}</span>
        </div>
        <a class="z-btn z-btn-ghost" style="margin:0 10px 10px" target="_blank" href="${link}">View ↗</a>
      </div>`;
  });
  g.innerHTML=html;
})();

/* ==== Calculator ==== */
(function setupCalc(){
  const amount=$("#stakeAmount"), duration=$("#stakeDuration"),
        nft=$("#nftBoost"), early=$("#earlyBoost"),
        total=$("#resultTotal"), monthly=$("#resultMonthly"), boost=$("#resultBoost");
  const apy={30:12,90:24,180:40,365:65,540:85};
  function calc(){
    const a=parseFloat((amount.value||"0").toString().replace(/[^\d.]/g,""))||0;
    const d=parseInt(duration.value,10)||0;
    const base=apy[d]||0;
    const tb=(parseFloat(nft.value||"0")||0) + (parseFloat(early.value||"0")||0);
    const gross=a*((base+tb)/100)*(d/365);
    const m=gross/(d/30);
    total.textContent=gross.toFixed(2)+" ZUZU";
    monthly.textContent=m.toFixed(2)+" ZUZU";
    boost.textContent="+"+tb+"%";
  }
  $("#calcBtn").addEventListener("click",calc);
  calc();
  function $(q){return document.querySelector(q);}
})();

/* ==== Wallet Connect (Modal + MetaMask/TON/Phantom) ==== */
const connectBtn = document.getElementById("connectBtn");
const modal = document.getElementById("walletModal");
const wmClose = document.getElementById("wmClose");
const btnMeta = document.getElementById("btnMeta");
const btnTon  = document.getElementById("btnTon");
const btnPh   = document.getElementById("btnPh");

function openModal(){ modal.style.display="block"; }
function closeModal(){ modal.style.display="none"; }
connectBtn.addEventListener("click", openModal);
wmClose.addEventListener("click", closeModal);
modal.querySelector(".z-modal__backdrop").addEventListener("click", closeModal);

// TON UI (manifest domaininizde)
let tonUi;
try{
  tonUi = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: "https://zuzucoin.xyz/tonconnect-manifest.json"
  });
}catch(e){ console.warn("TON UI init fail:", e); }

// MetaMask
btnMeta.addEventListener("click", async ()=>{
  try{
    if (window.ethereum && window.ethereum.request){
      await window.ethereum.request({ method:"eth_requestAccounts" });
      connectBtn.textContent = "MetaMask ✓";
      closeModal();
      return;
    }
    // Mobil deeplink (MetaMask içi tarayıcıda açar)
    window.location.href = "https://metamask.app.link/dapp/zuzucoin.xyz";
  }catch(e){
    alert("MetaMask connection failed");
  }
});

// TON
btnTon.addEventListener("click", async ()=>{
  try{
    if (tonUi){ await tonUi.openModal(); connectBtn.textContent="TON ✓"; closeModal(); }
    else alert("TON UI not ready");
  }catch(e){ alert("TON connection failed"); }
});

// Phantom (Solana)
btnPh.addEventListener("click", async ()=>{
  try{
    if (window.solana && window.solana.isPhantom){
      await window.solana.connect();
      connectBtn.textContent = "Phantom ✓";
      closeModal();
    }else{
      window.open("https://phantom.app/", "_blank");
    }
  }catch(e){ alert("Phantom connection failed"); }
});
