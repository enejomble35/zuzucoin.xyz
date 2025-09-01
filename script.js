/* =========================
   ZUZU – Global Config
========================= */
const CONFIG = {
  ownerAddress: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3", // USDT ödemeleri
  contractAddress: "0xF2bbbEcB417725813BF5E940d678793fACDa9729",
  collectionUrl: "https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a/contract/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts",
  // Countdown sabit tarih (50 gün sonrası)
  launchAt: new Date("2025-10-20T00:00:00Z").getTime(),
  saleStart: Date.now(),
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
   Chains + USDT Contracts
========================= */
const CHAINS = {
  1: { // Ethereum
    hex: "0x1",
    name: "Ethereum",
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    usdtDecimals: 6,
  },
  56: { // BNB Chain
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
  137: { // Polygon
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

const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

/* =========================
   Diller (EN / TR / FR / ES)
========================= */
const I = {
  en:{connect:"Connect Wallet",buy:"Buy",cost:"Cost:"},
  tr:{connect:"Cüzdan Bağla",buy:"Satın Al",cost:"Maliyet:"},
  fr:{connect:"Connecter",buy:"Acheter",cost:"Coût:"},
  es:{connect:"Conectar",buy:"Comprar",cost:"Costo:"}
};
function applyLang(lang="en"){
  document.querySelectorAll("[data-i]").forEach(el=>{
    const k=el.getAttribute("data-i");
    if(I[lang] && I[lang][k]) el.innerHTML=I[lang][k];
  });
}
(function initLang(){
  const sel=document.getElementById("langSel");
  sel.addEventListener("change",()=>applyLang(sel.value));
  applyLang("en");
})();

/* =========================
   Countdown
========================= */
function tick(){
  const left=Math.max(0, CONFIG.launchAt-Date.now());
  const d=Math.floor(left/86400000);
  const h=Math.floor((left%86400000)/3600000);
  const m=Math.floor((left%3600000)/60000);
  const s=Math.floor((left%60000)/1000);
  const pad=n=>n.toString().padStart(2,"0");
  ["cdDays","cdHours","cdMins","cdSecs"].forEach((id,i)=>{
    const v=[d,h,m,s][i];
    const el=document.getElementById(id);
    if(el) el.textContent=pad(v);
  });
}
setInterval(tick,1000); tick();

/* =========================
   Presale Costs
========================= */
function updateCosts(){
  const qty=parseFloat(document.getElementById("buyAmount")?.value||"0")||0;
  CONFIG.weekPrices.forEach((p,i)=>{
    document.getElementById("p"+i).textContent=p.toFixed(4);
    document.getElementById("c"+i).textContent=(qty*p).toFixed(2);
  });
}
document.getElementById("buyAmount")?.addEventListener("input",updateCosts);
updateCosts();

/* =========================
   MetaMask Connect + Buy
========================= */
let provider, signer, currentAccount;

async function ensureProvider(){
  if(!window.ethereum){alert("MetaMask not found.");throw new Error("No MetaMask");}
  provider=new ethers.providers.Web3Provider(window.ethereum,"any");
  signer=provider.getSigner();
  return provider;
}

async function connectWallet(){
  await ensureProvider();
  const acc=await provider.send("eth_requestAccounts",[]);
  currentAccount=acc[0];
  document.getElementById("connectBtn").textContent=currentAccount.slice(0,6)+"..."+currentAccount.slice(-4);
}

async function switchNetwork(targetId){
  const meta=CHAINS[targetId];
  try{
    await window.ethereum.request({method:"wallet_switchEthereumChain",params:[{chainId:meta.hex}]});
  }catch(e){
    if(e.code===4902 && meta.params){
      await window.ethereum.request({method:"wallet_addEthereumChain",params:[meta.params]});
    }else throw e;
  }
}

async function handleBuy(weekIndex){
  try{
    await ensureProvider();
    if(!currentAccount) await connectWallet();
    const qty=parseFloat(document.getElementById("buyAmount").value)||0;
    if(qty<=0) return alert("Invalid amount");
    const price=CONFIG.weekPrices[weekIndex];
    const cost=qty*price;

    const chainId=parseInt(document.getElementById("networkSel").value,10);
    await switchNetwork(chainId);
    const meta=CHAINS[chainId];
    const token=new ethers.Contract(meta.usdt,ERC20_ABI,signer);
    const amount=ethers.utils.parseUnits(cost.toString(), meta.usdtDecimals);

    const bal=await token.balanceOf(currentAccount);
    if(bal.lt(amount)) return alert("Insufficient USDT");

    const tx=await token.transfer(CONFIG.ownerAddress,amount);
    await tx.wait();
    alert("Success! TX: "+tx.hash);
  }catch(e){console.error(e);alert("Buy failed.");}
}

document.getElementById("connectBtn").addEventListener("click",connectWallet);
["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
  document.getElementById(id).addEventListener("click",()=>handleBuy(i));
});
