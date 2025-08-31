/* ===============================
   CONFIG & VARIABLES
   =============================== */
const CONFIG = {
  // Haftalık fiyatlar (USDT)
  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100],

  // NFT koleksiyonu
  contractAddress: "0xF2bbbEcB417725813BF5E940d678793fACDa9729",
  collectionUrl: "https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a/contract/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts",

  // Alıcı cüzdan (satıştan gelen USDT buraya düşer)
  receiver: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3",

  // Desteklenen ağlar: ETH, BSC, Polygon
  USDT: {
    1:  "0xdAC17F958D2ee523a2206206994597C13D831ec7", // ETH USDT
    56: "0x55d398326f99059fF775485246999027B3197955", // BSC USDT
    137:"0x2132D05D31c914a87C6611C10748AaCbE0dfFfFF"  // Polygon USDT
  },

  // NFT listesi
  nfts: [
    { id: 0, name:"ZUZU Hero", rarity:"Epic", supply:200 },
    { id: 1, name:"ZUZU Rogue", rarity:"Rare", supply:2500 },
    { id: 2, name:"ZUZU Berserker", rarity:"Epic", supply:800 },
    { id: 3, name:"ZUZU Hacker", rarity:"Rare", supply:600 },
    { id: 4, name:"ZUZU Sorceress", rarity:"Legendary", supply:100 },
    { id: 5, name:"ZUZU Warrior", rarity:"Common", supply:5000 },
    { id: 6, name:"ZUZU Maiden", rarity:"Uncommon", supply:2000 },
    { id: 7, name:"ZUZU Scientist", rarity:"Epic", supply:700 },
    { id: 8, name:"ZUZU Titan", rarity:"Legendary", supply:150 }
  ],

  // Pre-sale start (50 gün geri sayım)
  launchAt: Date.now() + 50*24*60*60*1000
};

/* ===============================
   MULTI-LANGUAGE
   =============================== */
function t(lang){
  const dict = {
    en: {
      presale_title:"Pre-Sale — Countdown",
      buy:"Buy", cost:"Cost", exchanges:"Supported Exchanges",
      stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",
      calc_title:"Earnings Calculator", calc_btn:"Calculate",
      ret:"Total Return", avg:"Monthly Avg", boost:"Total Boost",
      token_title:"Tokenomics (Visualized)", road_title:"Roadmap",
      connect:"Connect Wallet", hero_badge:"Pre-Sale • Stake to Win NFT"
    },
    tr: {
      presale_title:"Ön Satış — Geri Sayım",
      buy:"Satın Al", cost:"Maliyet", exchanges:"Desteklenen Borsalar",
      stake_title:"Stake Pro — Kilitle, Kazan, NFT Al ✨",
      calc_title:"Kazanç Hesaplayıcı", calc_btn:"Hesapla",
      ret:"Toplam Kazanç", avg:"Aylık Ortalama", boost:"Toplam Boost",
      token_title:"Tokonomi (Görsel)", road_title:"Yol Haritası",
      connect:"Cüzdan Bağla", hero_badge:"Ön Satış • Stake ile NFT Kazan"
    }
  };
  document.querySelectorAll("[data-i]").forEach(el=>{
    const key=el.getAttribute("data-i");
    if(dict[lang] && dict[lang][key]) el.innerHTML = dict[lang][key];
  });
}
/* ===============================
   COUNTDOWN
   =============================== */
function tick(){
  const left = Math.max(0, CONFIG.launchAt - Date.now());
  const d=Math.floor(left/864e5), h=Math.floor(left%864e5/36e5), 
        m=Math.floor(left%36e5/6e4), s=Math.floor(left%6e4/1e3);
  const pad=n=>n.toString().padStart(2,"0");
  ["cdDays","cdHours","cdMins","cdSecs"].forEach((id,i)=>{
    const vals=[d,h,m,s]; const el=document.getElementById(id);
    if(el) el.textContent=pad(vals[i]);
  });
}
tick(); setInterval(tick,1000);

/* ===============================
   PRESALE COST CALC
   =============================== */
function updateCosts(){
  const qty=parseFloat(document.getElementById("buyAmount").value||"0");
  CONFIG.weekPrices.forEach((p,i)=>{
    const cost=(qty*p)||0;
    const priceEl=document.getElementById("p"+i);
    const costEl=document.getElementById("c"+i);
    if(priceEl) priceEl.textContent=p.toFixed(4);
    if(costEl) costEl.textContent=cost.toLocaleString()+" USDT";
  });
}
document.getElementById("buyAmount")?.addEventListener("input",updateCosts);

/* ===============================
   NFT GRID
   =============================== */
(function renderNFTs(){
  const g=document.getElementById("nftGrid"); let html="";
  CONFIG.nfts.forEach(n=>{
    const img=`assets/images/mask/${n.id}.png`;
    const link=`${CONFIG.collectionUrl}?tokenId=${n.id}`;
    html+=`
    <div class="nft">
      <img src="${img}" alt="${n.name}" loading="lazy" style="object-fit:contain;aspect-ratio:1/1;">
      <div class="meta"><b>${n.name}</b><div>${n.rarity} • Supply ${n.supply}</div></div>
      <a class="z-btn z-btn-ghost" href="${link}" target="_blank">View ↗</a>
    </div>`;
  });
  if(g) g.innerHTML=html;
})();

/* ===============================
   WALLET CONNECTION (MetaMask)
   =============================== */
const btn=document.getElementById("connectBtn");
btn?.addEventListener("click", async()=>{
  if(window.ethereum){
    try{
      await window.ethereum.request({method:"eth_requestAccounts"});
      btn.textContent="MetaMask ✓";
    }catch(e){ alert("Connection rejected."); }
  }else{
    alert("Please install MetaMask.");
  }
});

/* ===============================
   BUY FUNCTION (Claim model)
   =============================== */
async function buyTokens(){
  if(!window.ethereum) return alert("Install MetaMask first!");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const network = await provider.getNetwork();
  const usdtAddr = CONFIG.USDT[network.chainId];
  if(!usdtAddr) return alert("Unsupported network, switch ETH/BSC/Polygon");

  const usdt = new ethers.Contract(usdtAddr, [
    "function transfer(address to,uint amount) public returns(bool)"
  ], signer);

  const qty = parseFloat(document.getElementById("buyAmount").value||"0");
  const price = CONFIG.weekPrices[0]; // aktif hafta fiyatı (basit)
  const amount = ethers.utils.parseUnits((qty*price).toString(),6); // USDT 6 decimals

  try{
    const tx = await usdt.transfer(CONFIG.receiver, amount);
    await tx.wait();
    alert("Purchase done! Please claim your ZUZU later.");
  }catch(e){
    console.error(e);
    alert("Transaction failed.");
  }
}
document.getElementById("buyBtn")?.addEventListener("click", buyTokens);
