// === Global Config ===
window.ZUZU_CONFIG = {
  tokenSymbol: "ZUZU",
  tokenDecimals: 9,
  presalePrice: 0.005,                   // 1 ZUZU = 0.005 USDT
  ownerSol: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF",
  launchAtISO: "2025-11-05T13:00:00Z",
  nftImages: [
    "assets/images/nft/1.png","assets/images/nft/2.png","assets/images/nft/3.png",
    "assets/images/nft/4.png","assets/images/nft/5.png","assets/images/nft/6.png"
  ]
};

// === Countdown ===
function startCountdown(){
  const target = new Date(ZUZU_CONFIG.launchAtISO).getTime();
  const set = (id,v)=>{ const el=document.getElementById(id); if(el) el.textContent=String(v).padStart(2,"0"); };
  (function loop(){
    const d = Math.max(0, target - Date.now());
    const day = Math.floor(d/86400000);
    const hr  = Math.floor(d%86400000/3600000);
    const mn  = Math.floor(d%3600000/60000);
    const sc  = Math.floor(d%60000/1000);
    set("cdDays", day); set("cdHours", hr); set("cdMins", mn); set("cdSecs", sc);
    requestAnimationFrame(loop);
  })();
}

// === NFT Grid ===
function buildNFTGrid(){
  const grid = document.getElementById("nftGrid");
  if(!grid) return;
  grid.innerHTML = "";
  ZUZU_CONFIG.nftImages.forEach((src,i)=>{
    const card = document.createElement("div");
    card.className = "nft";
    card.innerHTML = `
      <img src="${src}" alt="NFT #${i+1}"
           onerror="this.onerror=null;this.src='assets/images/branding/zuzu-hero.png'">
      <div class="meta"><span>#${String(i+1).padStart(3,"0")}</span><span class="tag">ZUZU</span></div>`;
    grid.appendChild(card);
  });
}

// === Buttons ===
function wireUI(){
  document.querySelectorAll("#connectBtn,#btnConnect").forEach(b=>{
    b.addEventListener("click", ()=> WalletLite.openPicker());
  });
  const d = document.getElementById("btnDisconnect");
  if(d) d.onclick = ()=>WalletLite.disconnect();

  document.querySelectorAll(".buyBtn").forEach(b=>{
    b.onclick = async ()=>{
      const qty = Number(document.getElementById("amountIn").value||"0");
      const pay = document.getElementById("paySel").value;
      await ZUZU_SOL.buyTokens(qty, pay);
    }
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  startCountdown();
  buildNFTGrid();
  wireUI();
});
