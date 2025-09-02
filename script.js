/* =========================
   ZUZU – Global Config
========================= */
const CONFIG = {
  ownerAddress: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3", // USDT ödemeleri buraya
  contractAddress: "0xF2bbbEcB417725813BF5E940d678793fACDa9729",
  collectionUrl: "https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a/contract/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts",
  launchAt: Date.now() + 50 * 24 * 60 * 60 * 1000, // 50 gün
  saleStart: Date.now(),
  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100],
  nfts: [
    { id:0, name:"ZUZU Hero", rarity:"Epic", supply:200 },
    { id:1, name:"ZUZU Rogue", rarity:"Rare", supply:2500 },
    { id:2, name:"ZUZU Berserker", rarity:"Epic", supply:800 },
    { id:3, name:"ZUZU Hacker", rarity:"Rare", supply:600 },
    { id:4, name:"ZUZU Sorceress", rarity:"Epic", supply:750 },
    { id:5, name:"ZUZU Warrior", rarity:"Rare", supply:900 },
    { id:6, name:"ZUZU Maiden", rarity:"Rare", supply:1100 },
    { id:7, name:"ZUZU Ranger", rarity:"Rare", supply:1000 },
    { id:8, name:"ZUZU Scientist", rarity:"Epic", supply:1100 },
    { id:9, name:"ZUZU Titan", rarity:"Legendary", supply:250 }
  ]
};

// Ağ bilgileri
const CHAINS = {
  1: {
    hex: "0x1",
    name: "Ethereum",
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    usdtDecimals: 6
  },
  56: {
    hex: "0x38",
    name: "BNB Chain",
    usdt: "0x55d398326f99059fF775485246999027B3197955",
    usdtDecimals: 18,
    params: {
      chainId: "0x38",
      chainName: "BNB Smart Chain",
      nativeCurrency: { name:"BNB", symbol:"BNB", decimals:18 },
      rpcUrls: ["https://bsc-dataseed.binance.org"],
      blockExplorerUrls: ["https://bscscan.com"]
    }
  },
  137: {
    hex: "0x89",
    name: "Polygon",
    usdt: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    usdtDecimals: 6,
    params: {
      chainId: "0x89",
      chainName: "Polygon Mainnet",
      nativeCurrency: { name:"MATIC", symbol:"MATIC", decimals:18 },
      rpcUrls: ["https://polygon-rpc.com"],
      blockExplorerUrls: ["https://polygonscan.com"]
    }
  }
};

// ERC20 ABI
const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

/* =========================
   Çoklu Dil
========================= */
const I = {
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
      hero_lead:"Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high <b>utility</b>.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",collection_page:"Collection Page",contract:"Contract:",
      days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",amount:"Amount (ZUZU)",
      w1:"Week 1 (Cheapest)",w2:"Week 2",w3:"Week 3",w4:"Week 4 (Last Chance)",cost:"Cost:",buy:"Buy",exchanges:"Supported Exchanges"},
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",
      hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>."},
  fr:{nav_presale:"Pré-vente",nav_stake:"Stake",nav_nft:"Récompenses NFT",nav_roadmap:"Feuille de route",nav_token:"Tokenomics",connect:"Connecter le Wallet",
      hero_badge:"Pré-vente • Stake pour gagner un NFT",hero_title:"ZUZU — Hérisson Robotique 🦔⚡"},
  es:{nav_presale:"Pre-venta",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Hoja de ruta",nav_token:"Tokenomics",connect:"Conectar Billetera",
      hero_badge:"Pre-venta • Stake para ganar NFT",hero_title:"ZUZU — Erizo Robótico 🦔⚡"}
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
   Countdown
========================= */
function tick(){
  const left = Math.max(0, CONFIG.launchAt - Date.now());
  const d = Math.floor(left / 86400000);
  const h = Math.floor((left % 86400000) / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  const pad = n=>n.toString().padStart(2,"0");
  ["cdDays","cdHours","cdMins","cdSecs"].forEach((id,i)=>{
    const val = [d,h,m,s][i];
    const el = document.getElementById(id);
    if (el) el.textContent = pad(val);
  });
}
tick(); setInterval(tick,1000);
/* =========================
   Presale Haftaları
========================= */
function getActiveWeek(){
  const days = Math.floor((Date.now() - CONFIG.saleStart) / 86400000);
  if (days < 7) return 0;
  if (days < 14) return 1;
  if (days < 21) return 2;
  return 3;
}
function updateActiveWeekUI(){
  const w = getActiveWeek();
  for(let i=0;i<4;i++){
    const btn = document.getElementById("buyW"+i);
    if (btn){
      btn.disabled = i!==w;
      btn.classList.toggle("active-week", i===w);
    }
  }
}
updateActiveWeekUI();

/* =========================
   Maliyet Hesap
========================= */
function updateCosts(){
  const qty = parseFloat(document.getElementById("buyAmount")?.value||0);
  CONFIG.weekPrices.forEach((p,i)=>{
    const cost = qty * p;
    const priceEl = document.getElementById("p"+i);
    const costEl  = document.getElementById("c"+i);
    if (priceEl) priceEl.textContent = p.toFixed(4);
    if (costEl)  costEl.textContent  = cost.toFixed(2);
  });
}
document.getElementById("buyAmount")?.addEventListener("input",updateCosts);
updateCosts();

/* =========================
   MetaMask Connect & Buy
========================= */
let provider, signer, currentAccount = null;

async function ensureProvider(){
  if (!window.ethereum) {
    alert("MetaMask not found. Please install it.");
    throw new Error("No MetaMask");
  }
  provider = new ethers.providers.Web3Provider(window.ethereum,"any");
  return provider;
}

async function connectWallet(){
  await ensureProvider();
  const accounts = await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  currentAccount = accounts[0];
  const btn = document.getElementById("connectBtn");
  if (btn) btn.textContent = `${currentAccount.slice(0,6)}...${currentAccount.slice(-4)}`;

  if (!window.ethereum._zuzuBound){
    window.ethereum.on("accountsChanged",(accs)=>{
      const b=document.getElementById("connectBtn");
      if(accs.length>0){
        currentAccount=accs[0];
        if(b) b.textContent=`${currentAccount.slice(0,6)}...${currentAccount.slice(-4)}`;
      }else{
        currentAccount=null; if(b) b.textContent="Connect Wallet";
      }
    });
    window.ethereum.on("chainChanged",()=>window.location.reload());
    window.ethereum._zuzuBound=true;
  }
}

async function switchNetwork(targetId){
  await ensureProvider();
  const meta = CHAINS[targetId];
  if(!meta) throw new Error("Unsupported network");
  try{
    await window.ethereum.request({ method:"wallet_switchEthereumChain", params:[{chainId:meta.hex}] });
  }catch(err){
    if(err.code===4902 && meta.params){
      await window.ethereum.request({ method:"wallet_addEthereumChain", params:[meta.params] });
    }else{ throw err; }
  }
}

async function handleBuy(weekIndex){
  try{
    const qty = parseFloat(document.getElementById("buyAmount")?.value||0);
    if(qty<=0) return alert("Enter valid amount");
    const active=getActiveWeek();
    if(weekIndex!==active) return alert("This week not active");

    const price = CONFIG.weekPrices[weekIndex];
    const cost  = qty*price;

    const chainId = parseInt(document.getElementById("networkSel").value);
    await switchNetwork(chainId);

    const meta = CHAINS[chainId];
    const token = new ethers.Contract(meta.usdt,ERC20_ABI,provider).connect(signer);
    const amount = ethers.utils.parseUnits(cost.toFixed(meta.usdtDecimals>6?6:meta.usdtDecimals), meta.usdtDecimals);

    const bal = await token.balanceOf(currentAccount);
    if(bal.lt(amount)) return alert("Insufficient USDT balance");

    const tx = await token.transfer(CONFIG.ownerAddress, amount);
    await tx.wait();

    alert(`Purchase successful!\nTX: ${tx.hash}`);
  }catch(e){
    console.error(e);
    alert("Transaction failed");
  }
}

document.getElementById("connectBtn")?.addEventListener("click",connectWallet);
["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
  document.getElementById(id)?.addEventListener("click",()=>handleBuy(i));
});
