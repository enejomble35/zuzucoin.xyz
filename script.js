/* ZUZU base script (layout bozmadan) */
(function(){
  const CONFIG = {
    saleStart: Date.parse("2025-12-01T00:00:00Z"), // sabit—yenileyince sıfırlanmaz
    weekPrices: [0.0050,0.0065,0.0080,0.0100],
    contractAddr: "0xF2bbbEcB4177…9729",
    collectionUrl: "https://thirdweb.com/team/zuzu/maskot",
    nfts: Array.from({length:12},(_,i)=>({id:i,name:`ZUZU #${i+1}`,rarity:["Rare","Epic","Legendary"][i%3]}))
  };
  window.__ZUZU_CFG = CONFIG;

  /* ---------- Countdown ---------- */
  const D=document.getElementById("cdDays"),H=document.getElementById("cdHours"),
        M=document.getElementById("cdMins"),S=document.getElementById("cdSecs");
  const pad=n=>String(n).padStart(2,"0");
  function tick(){
    const left=Math.max(0, CONFIG.saleStart - Date.now());
    const d=Math.floor(left/86400000), h=Math.floor(left%86400000/3600000),
          m=Math.floor(left%3600000/60000), s=Math.floor(left%60000/1000);
    if(D)D.textContent=pad(d); if(H)H.textContent=pad(h); if(M)M.textContent=pad(m); if(S)S.textContent=pad(s);
  }
  tick(); setInterval(tick,1000);

  /* ---------- Prices & costs ---------- */
  ["p0","p1","p2","p3"].forEach((id,i)=>{ const el=document.getElementById(id); if(el) el.textContent=CONFIG.weekPrices[i].toFixed(4); });
  const amt=document.getElementById("buyAmount");
  const costEls=[0,1,2,3].map(i=>document.getElementById("c"+i));
  function updateCosts(){
    const n=parseFloat((amt?.value||"0").replaceAll(",",""))||0;
    CONFIG.weekPrices.forEach((p,i)=>{ if(costEls[i]) costEls[i].textContent=(n*p).toFixed(2); });
  }
  amt?.addEventListener("input",updateCosts); updateCosts();

  /* ---------- Buy buttons (demo) ---------- */
  function buy(week){
    const n=parseFloat((amt?.value||"0").replaceAll(",",""))||0; if(!n) return alert("Enter amount.");
    if(!localStorage.getItem("zuzu_pk")){ document.getElementById("connectBtn")?.click(); return; }
    const price=CONFIG.weekPrices[week], total=(n*price).toFixed(2);
    const net=document.getElementById("networkSel")?.value || "sol";
    alert(`(Demo)\nWallet: ${localStorage.getItem("zuzu_pk")}\nAmount: ${n} ZUZU\nPay: ${net.toUpperCase()}\nEst: ${total} USDT\n\nGerçek transfer SPL/Solana SDK ile cüzdan içinde yapılmalı.`);
  }
  [0,1,2,3].forEach(i=>document.getElementById("buyW"+i)?.addEventListener("click",()=>buy(i)));

  /* ---------- Stake cards ---------- */
  (function(){
    const host=document.getElementById("stakeCards"); if(!host) return;
    const tiers=[{n:"Silver",d:30,a:"12%"},{n:"Gold",d:90,a:"28%"},{n:"Diamond",d:180,a:"45%"}];
    host.innerHTML=tiers.map(t=>`
      <div class="stake-card">
        <div class="tier ${t.n.toLowerCase()}">${t.n}</div>
        <div class="stat"><div class="label">Lock</div><b>${t.d} days</b></div>
        <div class="stat"><div class="label">Base APY</div><b>${t.a}</b></div>
        <button class="z-btn z-btn-primary" onclick="document.getElementById('connectBtn').click()">Stake</button>
      </div>`).join("");
  })();

  /* ---------- NFT grid ---------- */
  (function(){
    const wrap=document.getElementById("nftGrid"); if(!wrap) return;
    wrap.innerHTML = CONFIG.nfts.map(n=>`
      <div class="nft">
        <img src="assets/images/mask/${n.id}.png" alt="${n.name}" onerror="this.style.background='#0b1426';this.style.height='160px'">
        <div class="meta"><div>${n.name}</div><span class="tag">${n.rarity}</span></div>
      </div>`).join("");
  })();

  /* ---------- Contract/collection ---------- */
  const cd=document.getElementById("contractDisplay"); if(cd) cd.textContent = CONFIG.contractAddr;
  const cp=document.getElementById("thirdwebNFTRoute"); if(cp) cp.href = CONFIG.collectionUrl;
})();
