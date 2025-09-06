/* =========================
   ZUZU – App Config
========================= */
const ZUZU_CONFIG = {
  tokenSymbol: "ZUZU",
  tokenDecimals: 9,
  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100], // USDT
  // USDT→SOL dönüşüm (yaklaşık). 1 USDT ≈ 0.00667 SOL (SOL~150$ iken).
  usdToSol: 0.00667,
  // Alıcı SOL adresin:
  ownerSol: "31Cjkx2PA5oMapNxxGAiZhuHDcvAyQ7hogqB8Hx6f1pW",
  // Sabit tarih – sayaç buna göre işler
  launchAtISO: "2025-11-05T13:00:00+03:00",
  // Koleksiyon & EVM kontrat görüntüsü (UI için)
  collectionUrl: "https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a",
  contractAddress: "0xF2bbbEcB417725813BF5E940d678793fACDa9729"
};

/* =========================
   Diller (TR/EN/FR/PT/RU)
========================= */
const I = {
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
      road_lead:"Topluluk, staking, NFT drop’ları ve listelemelere odaklı plan."
  },
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
      hero_lead:"Stake and win <b>ZUZU Mascot NFT</b>. Limited supply, high <b>utility</b>.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",collection_page:"Collection Page",contract:"Contract:",
      days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",amount:"Amount (ZUZU)",
      w1:"Week 1 (Cheapest)",w2:"Week 2",w3:"Week 3",w4:"Week 4 (Last Chance)",cost:"Cost:",buy:"Buy",exchanges:"Supported Exchanges",
      stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>. Early stakers get badge & airdrop priority.",
      calc_title:"Earnings Calculator",amount2:"Amount (ZUZU)",lock:"Lock Period",nft_have:"Have NFT?",early:"Early Badge",calc_btn:"Calculate",
      ret:"Total Return",avg:"Monthly Avg",boost:"Total Boost",token_title:"Tokenomics (Visualized)",road_title:"Roadmap",
      road_lead:"Clear plan focused on community, staking, NFT drops, listings."
  },
  fr:{nav_presale:"Pré-vente",nav_stake:"Stake",nav_nft:"Récompenses NFT",nav_roadmap:"Feuille de route",nav_token:"Tokenomics",connect:"Connecter le Wallet",
      hero_badge:"Pré-vente • Stake pour gagner un NFT",hero_title:"ZUZU — Hérisson Robotique 🦔⚡",
      hero_lead:"Stake et gagne un <b>NFT Mascotte ZUZU</b>. Offre limitée, forte <b>utilité</b>.",
      cta_stake:"Commencer le Stake",cta_nft:"Récompenses NFT",collection_page:"Page de Collection",contract:"Contrat :",
      days:"JOURS",hours:"HEURES",mins:"MINUTES",secs:"SECONDES",
      presale_title:"Pré-vente — Compte à rebours",presale_lead:"Prépare-toi ! <b>Allocation limitée</b>.",amount:"Montant (ZUZU)",
      w1:"Semaine 1 (Moins cher)",w2:"Semaine 2",w3:"Semaine 3",w4:"Semaine 4 (Dernière chance)",cost:"Coût :",buy:"Acheter",exchanges:"Bourses"
  },
  pt:{nav_presale:"Pré-venda",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Roteiro",nav_token:"Tokenomics",connect:"Conectar Carteira",
      hero_badge:"Pré-venda • Faça stake e ganhe NFT",hero_title:"ZUZU — O Ouriço Robótico 🦔⚡",
      hero_lead:"Faça stake e ganhe <b>NFT Mascote ZUZU</b>. Oferta limitada, grande <b>utilidade</b>.",
      days:"DIAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS"
  },
  ru:{nav_presale:"Предпродажа",nav_stake:"Стейкинг",nav_nft:"NFT награды",nav_roadmap:"Дорожная карта",nav_token:"Токеномика",connect:"Подключить кошелёк",
      hero_badge:"Предпродажа • Стейкинг для NFT",hero_title:"ZUZU — Робот-ёж 🦔⚡",
      hero_lead:"Стейк и получи <b>маскот-NFT ZUZU</b>. Ограниченный запас, высокая <b>польза</b>.",
      days:"ДНИ",hours:"ЧАСЫ",mins:"МИН",secs:"СЕК"
  }
};

function applyLang(lang="tr"){
  document.querySelectorAll("[data-i]").forEach(el=>{
    const k=el.getAttribute("data-i");
    if(I[lang]&&I[lang][k]) el.innerHTML=I[lang][k];
  });
}
(function initLang(){
  const sel=document.getElementById("langSel");
  if(!sel) return;
  const saved=localStorage.getItem("zuzu_lang")||"tr";
  sel.value=saved; applyLang(saved);
  sel.addEventListener("change",()=>{ localStorage.setItem("zuzu_lang",sel.value); applyLang(sel.value); });
})();

/* =========================
   Sayaç (sabit ISO)
========================= */
(function(){
  const endAt=new Date(ZUZU_CONFIG.launchAtISO).getTime();
  function tick(){
    const left=Math.max(0,endAt-Date.now());
    const d=Math.floor(left/86400000);
    const h=Math.floor((left%86400000)/3600000);
    const m=Math.floor((left%3600000)/60000);
    const s=Math.floor((left%60000)/1000);
    const pad=n=>n.toString().padStart(2,"0");
    ["cdDays","cdHours","cdMins","cdSecs"].forEach((id,i)=>{
      const v=[d,h,m,s][i], el=document.getElementById(id);
      if(el && el.textContent!==pad(v)) el.textContent=pad(v);
    });
  }
  tick(); setInterval(tick,1000);
})();

/* =========================
   Presale maliyet yazıları
========================= */
(function updateCosts(){
  const qty=()=>parseFloat((document.getElementById("buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  function render(){
    ZUZU_CONFIG.weekPrices.forEach((p,i)=>{
      const priceEl=document.getElementById("p"+i);
      const costEl=document.getElementById("c"+i);
      if(priceEl) priceEl.textContent=p.toFixed(4);
      if(costEl)  costEl.textContent=(qty()*p).toLocaleString();
    });
  }
  document.getElementById("buyAmount")?.addEventListener("input",render);
  render();
})();

/* =========================
   NFT Grid (geri geldi)
========================= */
(function renderNFTs(){
  const g=document.getElementById("nftGrid"); if(!g) return;
  const list=[
    {id:0,name:"ZUZU Hero",rarity:"Epic",supply:200},
    {id:1,name:"ZUZU Rogue",rarity:"Rare",supply:2500},
    {id:2,name:"ZUZU Berserker",rarity:"Epic",supply:800},
    {id:3,name:"ZUZU Hacker",rarity:"Rare",supply:600},
    {id:4,name:"ZUZU Sorceress",rarity:"Epic",supply:750},
    {id:5,name:"ZUZU Warrior",rarity:"Rare",supply:900},
    {id:6,name:"ZUZU Maiden",rarity:"Rare",supply:1100},
    {id:7,name:"ZUZU Ranger",rarity:"Rare",supply:1000},
    {id:8,name:"ZUZU Scientist",rarity:"Epic",supply:1100},
    {id:9,name:"ZUZU Titan",rarity:"Legendary",supply:250}
  ];
  let html="";
  list.forEach(n=>{
    const img=`assets/images/mask/${n.id}.png`;
    html+=`
    <div class="nft">
      <img src="${img}" alt="${n.name}" loading="lazy"
           onerror="this.src='assets/images/mask/fallback.png'">
      <div class="meta"><div><b>${n.name}</b>
        <div style="color:#9fb6e6;font-size:.9rem">Supply: ${n.supply.toLocaleString()}</div>
      </div><span class="tag">${n.rarity}</span></div>
      <a class="z-btn z-btn-ghost" style="margin:0 10px 10px"
         href="${ZUZU_CONFIG.collectionUrl}" target="_blank" rel="noopener">View ↗</a>
    </div>`;
  });
  g.innerHTML=html;
})();

/* =========================
   Linkler / kontrat yazıları
========================= */
(function setupLinks(){
  const c=ZUZU_CONFIG.contractAddress;
  const short=`${c.slice(0,6)}...${c.slice(-4)}`;
  document.getElementById("contractDisplay")?.textContent=short;
  document.getElementById("contractDisplay2")?.textContent=c;
  document.getElementById("thirdwebNFTRoute")?.setAttribute("href",ZUZU_CONFIG.collectionUrl);
  document.getElementById("thirdwebNFTRoute2")?.setAttribute("href",ZUZU_CONFIG.collectionUrl);
})();
