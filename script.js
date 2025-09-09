/* =========================
   ZUZU — Config
========================= */
const CONFIG = {
  saleStart: Date.parse("2025-12-01T00:00:00Z"), // sabit tarih: yenileyince sıfırlanmaz
  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100],
  nfts: Array.from({length:12}, (_,i)=>({ id:i, name:`ZUZU #${i+1}`, rarity:["Rare","Epic","Legendary"][i%3], supply: 200+i*50 })),
  contractAddr: "0xF2bbbEcB417725813B...9729",
  collectionUrl: "https://thirdweb.com/team/enezuzu/maskot",
};

/* Sayaç */
(function(){
  const dEl = document.getElementById("cdDays");
  const hEl = document.getElementById("cdHours");
  const mEl = document.getElementById("cdMins");
  const sEl = document.getElementById("cdSecs");
  function pad(n){ return String(n).padStart(2,"0"); }
  function tick(){
    const left = Math.max(0, CONFIG.saleStart - Date.now());
    const d = Math.floor(left/86400000),
          h = Math.floor((left%86400000)/3600000),
          m = Math.floor((left%3600000)/60000),
          s = Math.floor((left%60000)/1000);
    if(dEl) dEl.textContent = pad(d);
    if(hEl) hEl.textContent = pad(h);
    if(mEl) mEl.textContent = pad(m);
    if(sEl) sEl.textContent = pad(s);
  }
  tick(); setInterval(tick, 1000);
})();

/* Haftalar + fiyat etiketleri */
(function(){
  ["p0","p1","p2","p3"].forEach((id,i)=>{ const el=document.getElementById(id); if(el) el.textContent = CONFIG.weekPrices[i].toFixed(4); });
  const addrEl = document.getElementById("contractDisplay");
  if(addrEl) addrEl.textContent = CONFIG.contractAddr.slice(0,6)+"…"+CONFIG.contractAddr.slice(-4);
  const col = document.getElementById("thirdwebNFTRoute");
  if(col) col.href = CONFIG.collectionUrl;

  // maliyet ön gösterim
  const amt = document.getElementById("buyAmount");
  const costEls = [0,1,2,3].map(i=>document.getElementById("c"+i));
  function updateCosts(){
    const n = parseFloat((amt?.value||"0").replaceAll(",","")) || 0;
    CONFIG.weekPrices.forEach((p,i)=>{ if(costEls[i]) costEls[i].textContent = (n*p).toFixed(2); });
  }
  amt?.addEventListener("input", updateCosts); updateCosts();

  // satın alma (demo akış, chain işlemini cüzdanlar içinde yapacaksın)
  function buyAt(weekIdx){
    const n = parseFloat((amt?.value||"0").replaceAll(",","")) || 0;
    if(!n || n<=0) return alert("Enter amount.");
    const netSel = document.getElementById("networkSel")?.value || "sol";
    const price = CONFIG.weekPrices[weekIdx];
    const total = (n*price).toFixed(2);
    if(!localStorage.getItem("zuzu_pk")){
      // önce cüzdan
      document.getElementById("connectBtn")?.click();
      return;
    }
    alert(`(Demo)\nWallet: ${localStorage.getItem("zuzu_pk")}\nAmount: ${n} ZUZU\nPayment: ${netSel.toUpperCase()}\nEst. cost: ${total} USDT\n\nOn-chain transfer için cüzdan içinde SPL/Solana SDK işlemi çalıştırılmalı.`);
  }
  [0,1,2,3].forEach(i=>document.getElementById("buyW"+i)?.addEventListener("click", ()=>buyAt(i)));
})();

/* Stake kartları (kısa) */
(function(){
  const host = document.getElementById("stakeCards"); if(!host) return;
  const tiers = [
    {name:"Silver",   days:30,  apy:"12%"},
    {name:"Gold",     days:90,  apy:"28%"},
    {name:"Diamond",  days:180, apy:"45%"},
  ];
  host.innerHTML = tiers.map(t=>`
    <div class="stake-card">
      <div class="tier ${t.name.toLowerCase()}">${t.name}</div>
      <div class="stat"><div class="label">Lock</div><b>${t.days} days</b></div>
      <div class="stat"><div class="label">Base APY</div><b>${t.apy}</b></div>
      <button class="z-btn z-btn-primary" onclick="document.getElementById('connectBtn').click()">Stake</button>
    </div>`).join("");
})();

/* NFT Grid */
function renderNFTs(){
  const wrap = document.getElementById("nftGrid"); if(!wrap) return;
  wrap.innerHTML = CONFIG.nfts.map(n=>`
    <div class="nft">
      <img src="assets/images/mask/${n.id}.png" alt="${n.name}" onerror="this.style.background='#0b1426'">
      <div class="meta">
        <div>${n.name}</div><span class="tag">${n.rarity}</span>
      </div>
    </div>`).join("");
}
renderNFTs();
