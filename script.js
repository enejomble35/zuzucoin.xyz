/* ========= ZUZU CONFIG ========= */
const CONFIG = {
  treasury: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3", // USDT alıcı cüzdan
  contractAddress: "0xF2bbbEcB417725813BF5E940d678793fACDa9729", // NFT kontrat
  collectionUrl: "https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a/contract/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts",
  launchAt: Date.now() + 50 * 24 * 60 * 60 * 1000, // 50 gün geri sayım
  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100], // USDT
  totalSupplyLabel: "500,000,000",
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
  ],
  // Ağlar ve USDT kontratları
  chains: {
    eth: {
      idHex: "0x1",
      name: "Ethereum",
      usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      rpcUrls: ["https://rpc.ankr.com/eth"],
      explorer: "https://etherscan.io"
    },
    bsc: {
      idHex: "0x38",
      name: "BSC",
      usdt: "0x55d398326f99059fF775485246999027B3197955",
      rpcUrls: ["https://bsc-dataseed.binance.org"],
      explorer: "https://bscscan.com"
    },
    polygon: {
      idHex: "0x89",
      name: "Polygon",
      usdt: "0xC2132D05D31c914a87C6611C10748AaCB7cD3",
      rpcUrls: ["https://polygon-rpc.com"],
      explorer: "https://polygonscan.com"
    }
  }
};

// I18N (kısa)
const I = {
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",hero_lead:"Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high <b>utility</b>.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",collection_page:"Collection Page",contract:"Contract:",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",
      w1:"Week 1 (Cheapest)",w2:"Week 2",w3:"Week 3",w4:"Week 4 (Last Chance)",buy:"Buy",exchanges:"Supported Exchanges",
      stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>. Early stakers get badge & airdrop priority.",
      calc_title:"Earnings Calculator",amount2:"Amount (ZUZU)",lock:"Lock Period",nft_have:"Have NFT?",early:"Early Badge",calc_btn:"Calculate",ret:"Total Return",avg:"Monthly Avg",boost:"Total Boost",
      token_title:"Tokenomics (Visualized)",road_title:"Roadmap",road_lead:"Clear plan focused on community, staking, NFT drops, listings."
  },
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",collection_page:"Koleksiyon Sayfası",contract:"Kontrat:",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",
      w1:"1. Hafta (En Ucuz)",w2:"2. Hafta",w3:"3. Hafta",w4:"4. Hafta (Son Fırsat)",buy:"Satın Al",exchanges:"Desteklenen Borsalar",
      stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile pasif gelir elde et. Erken stake edenler rozet & airdrop önceliği alır.",
      calc_title:"Kazanç Hesaplayıcı",amount2:"Miktar (ZUZU)",lock:"Kilit Süresi",nft_have:"Elinde NFT var mı?",early:"Erken Rozet",calc_btn:"Hesapla",ret:"Toplam Getiri",avg:"Aylık Ortalama",boost:"Toplam Boost",
      token_title:"Tokonomi (Görselleştirilmiş)",road_title:"Yol Haritası",road_lead:"Topluluk, staking, NFT drop’ları ve listelemelere odaklı plan."
  },
  fr:{nav_presale:"Pré-vente",nav_stake:"Stake",nav_nft:"Récompenses NFT",nav_roadmap:"Feuille de route",nav_token:"Tokenomics",connect:"Connecter le Wallet",
      hero_badge:"Pré-vente • Stake pour gagner un NFT",hero_title:"ZUZU — Hérisson Robotique 🦔⚡",hero_lead:"Stake et gagne un <b>NFT Mascotte ZUZU</b>. Offre limitée, forte <b>utilité</b>.",
      presale_title:"Pré-vente — Compte à rebours",presale_lead:"Prépare-toi à la pré-vente ZUZU ! <b>Allocation limitée</b>, prix communauté.",
      w1:"Semaine 1 (Moins cher)",w2:"Semaine 2",w3:"Semaine 3",w4:"Semaine 4 (Dernière chance)",buy:"Acheter",exchanges:"Bourses prises en charge",
      stake_title:"Stake Pro — Verrouille, Gagne, Reçois un NFT ✨",stake_lead:"Verrouille ton ZUZU, gagne <b>APY + BOOST NFT</b>. Badge & airdrop prioritaires pour les premiers.",
      calc_title:"Calculateur de gains",amount2:"Montant (ZUZU)",lock:"Période de verrouillage",nft_have:"Tu as un NFT ?",early:"Badge précoce",calc_btn:"Calculer",ret:"Gain total",avg:"Moyenne mensuelle",boost:"Boost total",
      token_title:"Tokenomics (Visualisé)",road_title:"Feuille de route",road_lead:"Plan axé sur la communauté, le staking, les drops NFT et les listings."
  },
  es:{nav_presale:"Pre-venta",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Hoja de ruta",nav_token:"Tokenomics",connect:"Conectar Billetera",
      hero_badge:"Pre-venta • Stake para ganar NFT",hero_title:"ZUZU — Erizo Robótico 🦔⚡",hero_lead:"Haz stake y gana <b>NFT Mascota ZUZU</b>. Suministro limitado, gran <b>utilidad</b>.",
      presale_title:"Pre-venta — Cuenta regresiva",presale_lead:"¡Prepárate para la pre-venta ZUZU! <b>Asignación limitada</b>, precio para la comunidad.",
      w1:"Semana 1 (Más barata)",w2:"Semana 2",w3:"Semana 3",w4:"Semana 4 (Última oportunidad)",buy:"Comprar",exchanges:"Exchanges compatibles",
      stake_title:"Stake Pro — Bloquea, Gana, Obtén NFT ✨",stake_lead:"Bloquea tu ZUZU, gana <b>APY + BOOST NFT</b>. Primeros obtienen insignia y prioridad de airdrop.",
      calc_title:"Calculadora de ganancias",amount2:"Cantidad (ZUZU)",lock:"Periodo de bloqueo",nft_have:"¿Tienes NFT?",early:"Insignia temprana",calc_btn:"Calcular",ret:"Retorno total",avg:"Promedio mensual",boost:"Impulso total",
      token_title:"Tokenomics (Visualizado)",road_title:"Hoja de ruta",road_lead:"Plan centrado en comunidad, staking, drops NFT y listados."
  }
};

function t(lang){
  document.querySelectorAll("[data-i]").forEach(el=>{
    const k = el.getAttribute("data-i");
    if(I[lang] && I[lang][k]) el.innerHTML = I[lang][k];
  });
}
const sel = document.getElementById("langSel");
if (sel) { sel.addEventListener("change",()=>t(sel.value)); t("en"); }

/* ==== Contract & links ==== */
const cDisp = document.getElementById("contractDisplay");
if (cDisp) cDisp.textContent = CONFIG.contractAddress.slice(0,6)+"..."+CONFIG.contractAddress.slice(-4);
const cDisp2 = document.getElementById("contractDisplay2");
if (cDisp2) cDisp2.textContent = CONFIG.contractAddress;
const tw1 = document.getElementById("thirdwebNFTRoute");
const tw2 = document.getElementById("thirdwebNFTRoute2");
if (tw1) tw1.href = CONFIG.collectionUrl;
if (tw2) tw2.href = CONFIG.collectionUrl;

/* ==== Countdown ==== */
function tick(){
  const left = Math.max(0, CONFIG.launchAt - Date.now());
  const d = Math.floor(left/864e5), h = Math.floor(left%864e5/36e5), m = Math.floor(left%36e5/6e4), s = Math.floor(left%6e4/1e3);
  const pad = n => n.toString().padStart(2,"0");
  const ids=["cdDays","cdHours","cdMins","cdSecs"];
  [d,h,m,s].forEach((v,i)=>{ const el=document.getElementById(ids[i]); if(el && el.textContent!==pad(v)) el.textContent=pad(v); });
}
tick(); setInterval(tick,1000);

/* ==== Pre-sale costs ==== */
function updateCosts(){
  const qty = parseFloat(document.getElementById("buyAmount")?.value || "0");
  CONFIG.weekPrices.forEach((p,i)=>{
    const cost = (qty*p)||0;
    const priceEl=document.getElementById("p"+i);
    const costEl=document.getElementById("c"+i);
    if(priceEl) priceEl.textContent=p.toFixed(4);
    if(costEl)  costEl.textContent=cost.toLocaleString();
  });
}
const buyAmountEl = document.getElementById("buyAmount");
if (buyAmountEl) buyAmountEl.addEventListener("input", updateCosts);
updateCosts();

/* ==== NFT Grid ==== */
(function renderNFTs(){
  const g=document.getElementById("nftGrid"); if(!g) return;
  g.innerHTML = CONFIG.nfts.map(n=>{
    const img=`assets/images/mask/${n.id}.png`;
    const link=`${CONFIG.collectionUrl}?tokenId=${n.id}`;
    return `
      <div class="nft">
        <img src="${img}" alt="${n.name}" loading="lazy">
        <div class="meta">
          <div><b>${n.name}</b><div style="color:#9fb6e6;font-size:.9rem">Supply: ${n.supply.toLocaleString()}</div></div>
          <span class="tag">${n.rarity}</span>
        </div>
        <a class="z-btn z-btn-ghost" style="margin-top:6px" href="${link}" target="_blank">View ↗</a>
      </div>`;
  }).join("");
})();

/* ==== Calculator ==== */
function setupCalc(){
 const amount=document.getElementById("stakeAmount");
 const duration=document.getElementById("stakeDuration");
 const nft=document.getElementById("nftBoost");
 const early=document.getElementById("earlyBoost");
 const total=document.getElementById("resultTotal");
 const monthly=document.getElementById("resultMonthly");
 const boost=document.getElementById("resultBoost");
 if(!amount||!duration||!nft||!early) return;
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
 document.getElementById("calcBtn").addEventListener("click",calc);
 calc();
}
setupCalc();

/* ==== Tokenomics Donut (Canvas) ==== */
function drawTokenomics(){
  const c = document.getElementById("tokenomicsChart"); if (!c) return;
  const ctx = c.getContext("2d");
  const W = c.width, H = c.height;
  const cx = W/2 - 10, cy = H/2 + 6, r = 90, inner = 54;

  const parts = [
    { p:35, color:"#8c76ff" }, // community
    { p:20, color:"#1fd4e7" }, // liquidity
    { p:15, color:"#7bff9b" }, // team
    { p:10, color:"#ffb648" }, // treasury
    { p:15, color:"#d77cff" }, // staking
    { p:5,  color:"#ff6a6a" }, // partners
  ];
  ctx.clearRect(0,0,W,H);

  // shadow
  ctx.beginPath();
  ctx.arc(cx,cy,r+14,0,Math.PI*2);
  ctx.fillStyle="rgba(0,0,0,.18)";
  ctx.fill();

  // donut
  let start = -Math.PI/2;
  parts.forEach(seg=>{
    const ang = (seg.p/100)*Math.PI*2;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,r,start,start+ang);
    ctx.closePath();
    ctx.fillStyle=seg.color;
    ctx.fill();
    start+=ang;
  });

  // hole
  ctx.beginPath();
  ctx.arc(cx,cy,inner,0,Math.PI*2);
  ctx.fillStyle="#0e1522";
  ctx.fill();

  // label
  ctx.fillStyle="#cfe0ff";
  ctx.font="700 16px Inter, system-ui";
  ctx.textAlign="center";
  ctx.fillText("Total Supply", cx, cy-4);
  ctx.font="800 18px Inter, system-ui";
  ctx.fillText(CONFIG.totalSupplyLabel, cx, cy+22);
}
drawTokenomics();

/* ==== MetaMask Wallet & Buy (USDT transfer) ==== */
let provider, signer, account;

async function ensureWallet(){
  if(!window.ethereum) { alert("MetaMask not detected."); throw new Error("no metamask"); }
  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts",[]);
  signer = provider.getSigner();
  account = await signer.getAddress();
  return account;
}

async function switchChain(chainKey){
  const chain = CONFIG.chains[chainKey];
  try{
    await window.ethereum.request({ method:"wallet_switchEthereumChain", params:[{ chainId: chain.idHex }] });
  }catch(err){
    if (err && err.code === 4902){
      await window.ethereum.request({
        method:"wallet_addEthereumChain",
        params:[{
          chainId: chain.idHex,
          chainName: chain.name,
          rpcUrls: chain.rpcUrls,
          nativeCurrency: { name: chain.name, symbol: chainKey==="eth"?"ETH":chainKey==="bsc"?"BNB":"MATIC", decimals: 18 },
          blockExplorerUrls: [chain.explorer]
        }]
      });
    } else { throw err; }
  }
}

const USDT_ABI = [
  "function decimals() view returns (uint8)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

async function buyWithUSDT(weekIdx){
  const qtyStr = document.getElementById("buyAmount").value.trim();
  const qty = parseFloat(qtyStr||"0");
  if(!qty || qty<=0) return alert("Please enter amount.");

  const chainSel = document.getElementById("chainSel").value; // bsc/eth/polygon
  const price = CONFIG.weekPrices[weekIdx] || CONFIG.weekPrices[0];
  const usdtAmount = qty * price; // in USDT units

  try{
    await ensureWallet();
    await switchChain(chainSel);

    const net = await provider.getNetwork();
    const chainHex = "0x"+net.chainId.toString(16);
    if (chainHex.toLowerCase() !== CONFIG.chains[chainSel].idHex.toLowerCase()){
      return alert("Wrong network selected.");
    }

    const usdtAddr = CONFIG.chains[chainSel].usdt;
    const token = new ethers.Contract(usdtAddr, USDT_ABI, signer);
    // USDT decimals are 6
    const amount = ethers.utils.parseUnits(usdtAmount.toFixed(6), 6);
    const tx = await token.transfer(CONFIG.treasury, amount);
    await tx.wait();

    alert("Payment success ✅\nWe will add your claim to portal. Keep your wallet connected.");
  }catch(e){
    console.error(e);
    alert("Payment failed: "+(e?.message || e));
  }
}

document.querySelectorAll(".buyBtn").forEach(btn=>{
  btn.addEventListener("click", (ev)=>{
    const w = parseInt(ev.currentTarget.getAttribute("data-week"),10) || 0;
    buyWithUSDT(w);
  });
});

const cbtn = document.getElementById("connectBtn");
if (cbtn){
  cbtn.addEventListener("click", async ()=>{
    try{
      const acc = await ensureWallet();
      cbtn.textContent = acc.slice(0,6)+"..."+acc.slice(-4);
    }catch(e){
      alert("Connect failed: "+(e?.message||e));
    }
  });
}
