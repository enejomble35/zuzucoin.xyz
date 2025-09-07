/* ===== Global config (wallet-lite da okur) ===== */
window.ZUZU_CONFIG = {
  tokenSymbol: "ZUZU",
  tokenDecimals: 9,
  presalePrice: 0.0050,
  ownerSol: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF"
};

/* ===== Site content ===== */
const CONFIG = {
  contractAddress: "0xF2bbbEcB417725813BF5E940d678793fACDa9729",
  collectionUrl: "https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a/contract/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts",
  launchAt: Date.now() + 50*24*60*60*1000,
  saleStart: Date.now(),
  weekPrices: [0.0050,0.0065,0.0080,0.0100],
  nfts: [
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
  ]
};

/* ===== i18n (EN/TR/FR/ES/RU) ===== */
const I = {/* -- metinler uzun, önceki mesajımdakiyle birebir aynı -- */};
I.en= {...I.en}; I.tr={...I.tr}; I.fr={...I.fr}; I.es={...I.es}; I.ru={...I.ru}; // kısaltım (içerikler önceki gönderide)

/* === helpers === */
const pad2 = n=>n.toString().padStart(2,"0");
const num = v => {
  const n = parseFloat((v??"0").toString().replace(/[^\d.]/g,""));
  return Number.isFinite(n)?n:0;
};
function activeWeek(){
  const d = Math.floor((Date.now()-CONFIG.saleStart)/86400000);
  if(d<7) return 0; if(d<14) return 1; if(d<21) return 2; return 3;
}
function applyLang(lang="en"){
  document.querySelectorAll("[data-i]").forEach(el=>{
    const k=el.getAttribute("data-i");
    if(I[lang] && I[lang][k]) el.innerHTML=I[lang][k];
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  /* Dil dropdown */
  const wrap = document.getElementById("langWrap");
  const btn  = document.getElementById("langBtn");
  const flag = document.getElementById("langFlag");
  const menu = document.getElementById("langMenu");
  function setLang(lc){
    applyLang(lc);
    flag.src = `assets/flags/${lc}.png`;
    localStorage.setItem("zuzu_lang", lc);
  }
  const saved = localStorage.getItem("zuzu_lang") || "en";
  setLang(saved);
  btn?.addEventListener("click", ()=>{
    const open = menu.classList.toggle("open");
    btn.setAttribute("aria-expanded", open?"true":"false");
  });
  menu?.querySelectorAll("[data-lang]").forEach(x=>{
    x.addEventListener("click", ()=>{
      setLang(x.dataset.lang);
      menu.classList.remove("open");
    });
  });
  document.addEventListener("click", (e)=>{
    if(!wrap.contains(e.target)) menu.classList.remove("open");
  });

  /* Sayaç */
  function tick(){
    const left = Math.max(0, CONFIG.launchAt - Date.now());
    const d = Math.floor(left/86400000);
    const h = Math.floor((left%86400000)/3600000);
    const m = Math.floor((left%3600000)/60000);
    const s = Math.floor((left%60000)/1000);
    ["cdDays","cdHours","cdMins","cdSecs"].forEach((id,i)=>{
      const v=[d,h,m,s][i];
      const el=document.getElementById(id);
      if(el) el.textContent = pad2(v);
    });
  }
  tick(); setInterval(tick,1000);

  /* Aktif hafta vurgusu */
  function paintWeeks(){
    const w = activeWeek();
    for(let i=0;i<4;i++){
      const b=document.getElementById("buyW"+i);
      if(!b) continue;
      if(i===w){ b.disabled=false; b.classList.add("active-week"); }
      else { b.disabled=true; b.classList.remove("active-week"); }
    }
  }
  paintWeeks();

  /* Maliyet */
  function recalc(){
    const qty = num(document.getElementById("buyAmount")?.value);
    CONFIG.weekPrices.forEach((p,i)=>{
      const cost=qty*p;
      const pe=document.getElementById("p"+i);
      const ce=document.getElementById("c"+i);
      if(pe) pe.textContent=p.toFixed(4);
      if(ce) ce.textContent=(isFinite(cost)?cost:0).toLocaleString();
    });
  }
  document.getElementById("buyAmount")?.addEventListener("input", recalc);
  recalc();

  /* NFT grid */
  (()=>{
    const g=document.getElementById("nftGrid"); if(!g) return;
    g.innerHTML = CONFIG.nfts.map(n=>`
      <div class="nft">
        <img src="assets/images/mask/${n.id}.png" alt="${n.name}" loading="lazy"
             style="aspect-ratio:1/1;object-fit:contain;background:#0f1a30;padding:8px;border-bottom:1px solid #1d2d50"
             onerror="this.style.display='none'">
        <div class="meta">
          <div>
            <b>${n.name}</b>
            <div style="color:#9fb6e6;font-size:.9rem">Supply: ${n.supply.toLocaleString()}</div>
          </div>
          <span class="tag">${n.rarity}</span>
        </div>
        <a class="z-btn z-btn-ghost" style="margin:0 10px 10px" href="${CONFIG.collectionUrl}?tokenId=${n.id}" target="_blank" rel="noopener">View ↗</a>
      </div>`).join("");
  })();

  /* Linkler */
  (()=>{
    const c=CONFIG.contractAddress, short=`${c.slice(0,6)}...${c.slice(-4)}`;
    const cd=document.getElementById("contractDisplay");
    const cd2=document.getElementById("contractDisplay2");
    if(cd) cd.textContent=short; if(cd2) cd2.textContent=c;
    const t1=document.getElementById("thirdwebNFTRoute");
    const t2=document.getElementById("thirdwebNFTRoute2");
    if(t1) t1.href=CONFIG.collectionUrl; if(t2) t2.href=CONFIG.collectionUrl;
  })();

  /* Wallet modal aç */
  document.getElementById("connectBtn")?.addEventListener("click", ()=>{
    window.openWalletModal && window.openWalletModal();
  });

  /* Satın al -> wallet-lite’e delege */
  ["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
    const b=document.getElementById(id); if(!b) return;
    b.addEventListener("click", async ()=>{
      if(i!==activeWeek()){ alert("This week is not active."); return; }
      const qty = num(document.getElementById("buyAmount")?.value);
      const pay = document.getElementById("paySel")?.value || "SOL"; // SOL ya da USDT(SPL)
      if(qty<=0){ alert("Enter a valid amount."); return; }
      if(typeof window.solanaPresaleBuy!=="function"){ alert("Wallet module not loaded"); return; }
      try{
        await window.solanaPresaleBuy({ quantity: qty, payment: pay, price: CONFIG.weekPrices[i] });
      }catch(e){ console.error(e); alert("Transaction failed or cancelled."); }
    });
  });

  /* Exchange ticker mobil fix */
  const tr = document.getElementById("exTrack");
  if(tr){ tr.style.willChange="transform"; tr.style.transform="translateX(0)"; setTimeout(()=>tr.style.transform="",50); }
});
