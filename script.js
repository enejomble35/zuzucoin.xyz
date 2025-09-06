// COUNTDOWN
(function(){
  const target = new Date(ZUZU_CONFIG.launchAtISO).getTime();
  const ids=['cdDays','cdHours','cdMins','cdSecs'];
  const pad=n=>n.toString().padStart(2,'0');
  function tick(){
    const left = Math.max(0, target - Date.now());
    const d=Math.floor(left/86400000), h=Math.floor(left%86400000/3600000),
          m=Math.floor(left%3600000/60000), s=Math.floor(left%60000/1000);
    [d,h,m,s].forEach((v,i)=>{const el=document.getElementById(ids[i]); if(el) el.textContent=pad(v);});
  }
  tick(); setInterval(tick,1000);
})();

// COST BOXES
(function(){
  function update(){
    const qty=parseFloat((document.getElementById("buyAmount")?.value||"0").replace(/[^\d.]/g,""))||0;
    ZUZU_CONFIG.weekPrices.forEach((p,i)=>{
      const cost=qty*p;
      const pe=document.getElementById('p'+i), ce=document.getElementById('c'+i);
      if(pe) pe.textContent=p.toFixed(4);
      if(ce) ce.textContent=isFinite(cost)?cost.toLocaleString():0;
    });
  }
  document.getElementById('buyAmount')?.addEventListener('input',update); update();
})();

// NFT GRID
(function(){
  const g=document.getElementById('nftGrid'); if(!g) return;
  g.innerHTML = ZUZU_CONFIG.nfts.map(n=>`
    <div class="nft">
      <img src="assets/images/mask/${n.id}.png" alt="${n.name}" loading="lazy" onerror="this.style.display='none'">
      <div class="meta"><div><b>${n.name}</b><div style="color:#9fb6e6;font-size:.9rem">Supply: ${n.supply.toLocaleString()}</div></div><span class="tag">${n.rarity}</span></div>
    </div>`).join('');
})();

// LINKS
(function(){
  const c="0xF2bbbEcB417725813BF5E940d678793fACDa9729";
  const cd=document.getElementById('contractDisplay'); if(cd) cd.textContent=`${c.slice(0,6)}...${c.slice(-4)}`;
  document.getElementById("thirdwebNFTRoute")?.setAttribute('href', ZUZU_CONFIG.collectionUrl);
  document.getElementById("thirdwebNFTRoute2")?.setAttribute('href', ZUZU_CONFIG.collectionUrl);
})();
