/* ==== Countdown ==== */
(function(){
  const launch = new Date(ZUZU_CONFIG.launchAtISO).getTime();
  function tick(){
    const left = Math.max(0, launch - Date.now());
    const d = Math.floor(left/86400000);
    const h = Math.floor((left%86400000)/3600000);
    const m = Math.floor((left%3600000)/60000);
    const s = Math.floor((left%60000)/1000);
    const pad=n=>n.toString().padStart(2,'0');
    const ids=['cdDays','cdHours','cdMins','cdSecs'];
    [d,h,m,s].forEach((v,i)=>{ const el=document.getElementById(ids[i]); if(el) el.textContent=pad(v); });
  }
  tick(); setInterval(tick,1000);
})();

/* ==== Presale cost boxes ==== */
(function(){
  function updateCosts(){
    const qty = parseFloat((document.getElementById("buyAmount")?.value||"0").toString().replace(/[^\d.]/g,"")) || 0;
    ZUZU_CONFIG.weekPrices.forEach((p,i)=>{
      const cost = qty * p;
      const priceEl = document.getElementById("p"+i);
      const costEl  = document.getElementById("c"+i);
      if (priceEl) priceEl.textContent = p.toFixed(4);
      if (costEl)  costEl.textContent  = (isFinite(cost)?cost:0).toLocaleString();
    });
  }
  document.getElementById("buyAmount")?.addEventListener("input", updateCosts);
  updateCosts();
})();

/* ==== NFT Grid ==== */
(function(){
  const g = document.getElementById("nftGrid");
  if (!g) return;
  let html = "";
  ZUZU_CONFIG.nfts.forEach(n=>{
    const img = `assets/images/mask/${n.id}.png`;
    html += `
    <div class="nft">
      <img src="${img}" alt="${n.name}" loading="lazy"
           onerror="this.style.display='none'">
      <div class="meta">
        <div>
          <b>${n.name}</b>
          <div style="color:#9fb6e6;font-size:.9rem">Supply: ${n.supply.toLocaleString()}</div>
        </div>
        <span class="tag">${n.rarity}</span>
      </div>
    </div>`;
  });
  g.innerHTML = html;
})();

/* ==== Links + contract display ==== */
(function(){
  const c = "0xF2bbbEcB417725813BF5E940d678793fACDa9729";
  const short = `${c.slice(0,6)}...${c.slice(-4)}`;
  const cd = document.getElementById("contractDisplay");
  if (cd)  cd.textContent = short;
  document.getElementById("thirdwebNFTRoute")?.setAttribute('href', ZUZU_CONFIG.collectionUrl);
  document.getElementById("thirdwebNFTRoute2")?.setAttribute('href', ZUZU_CONFIG.collectionUrl);
})();

/* ==== Calculator ==== */
(function(){
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

/* ==== Minor UX ==== */
(function(){
  // ticker kick
  const track = document.getElementById('exTrack');
  if(track){ track.style.willChange='transform'; track.style.transform='translateX(0)'; setTimeout(()=>track.style.transform='',50); }
})();
