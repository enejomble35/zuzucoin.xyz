/* ========= Global Config ========= */
const CONFIG = {
  ownerSol: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF",
  collectionUrl: "https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a/contract/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts",
  contractAddress: "0xF2bbbEcB417725813BF5E940d678793fACDa9729",
  fx: { sol_usdt: 150 },           // tahmini kur
  launchAt: Date.now() + 50*24*60*60*1000,
  saleStart: Date.now(),
  weekPrices: [0.0050,0.0065,0.0080,0.0100],
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

/* ========= Dil & Nav ========= */
function buildLangUI(){
  const btn = document.getElementById("langBtn");
  const menu = document.getElementById("langMenu");
  const flag = document.getElementById("langFlag");
  if(!btn || !menu) return;

  const set = (lang)=>{
    applyLang(lang);
    flag.src = `flags/${lang}.png`;
    btn.querySelector("span").textContent = lang.toUpperCase();
    menu.classList.remove("show");
  };

  btn.addEventListener("click", ()=>menu.classList.toggle("show"));
  menu.querySelectorAll("button[data-lang]").forEach(b=>{
    b.addEventListener("click", ()=>set(b.dataset.lang));
  });

  // ilk açılış
  const init = currentLang();
  flag.src = `flags/${init}.png`; btn.querySelector("span").textContent = init.toUpperCase();
  applyLang(init);

  // dışarı tıkla kapat
  document.addEventListener("click",(e)=>{
    if(!menu.contains(e.target) && e.target!==btn) menu.classList.remove("show");
  });
}
buildLangUI();

/* ========= Countdown ========= */
function tick(){
  const left = Math.max(0, CONFIG.launchAt - Date.now());
  const d = Math.floor(left/86400000);
  const h = Math.floor((left%86400000)/3600000);
  const m = Math.floor((left%3600000)/60000);
  const s = Math.floor((left%60000)/1000);
  const pad=n=>String(n).padStart(2,"0");
  [["cdDays",d],["cdHours",h],["cdMins",m],["cdSecs",s]].forEach(([id,v])=>{
    const el = document.getElementById(id); if(el) el.textContent = pad(v);
  });
}
tick(); setInterval(tick,1000);

/* ========= Aktif hafta ========= */
function getActiveWeek(){
  const days = Math.floor((Date.now() - CONFIG.saleStart)/86400000);
  return (days<7)?0:(days<14)?1:(days<21)?2:3;
}
function updateActiveWeekUI(){
  const w = getActiveWeek();
  for(let i=0;i<4;i++){
    const btn = document.getElementById("buyW"+i);
    if(!btn) continue;
    if(i===w){ btn.disabled=false; btn.classList.add("active-week"); }
    else { btn.disabled=true; btn.classList.remove("active-week"); }
  }
}
updateActiveWeekUI();

/* ========= Maliyet + ödeme seçimi ========= */
function updateCosts(){
  const qty = parseFloat((document.getElementById("buyAmount")?.value||"0").replace(/[^\d.]/g,""))||0;
  CONFIG.weekPrices.forEach((p,i)=>{
    const costUSDT = qty*p;
    const priceEl = document.getElementById("p"+i);
    const costEl  = document.getElementById("c"+i);
    const estEl   = document.getElementById("cEst"+i);
    const paySel  = document.getElementById("paySel"+i);
    if(priceEl) priceEl.textContent = p.toFixed(4);
    if(costEl)  costEl.textContent  = (isFinite(costUSDT)?costUSDT:0).toLocaleString(undefined,{maximumFractionDigits:2});
    if(estEl && paySel){
      if(paySel.value==="SOL"){
        const sol = costUSDT/(CONFIG.fx.sol_usdt||150);
        estEl.textContent = `(${window.ZI[currentLang()].est} ${sol.toFixed(4)} SOL)`;
      } else estEl.textContent = "";
    }
  });
}
document.getElementById("buyAmount")?.addEventListener("input",updateCosts);
["0","1","2","3"].forEach(i=>document.getElementById("paySel"+i)?.addEventListener("change",updateCosts));
updateCosts();

/* ========= Buy (demo) ========= */
async function handleBuy(wi){
  const qty = parseFloat((document.getElementById("buyAmount")?.value||"0").replace(/[^\d.]/g,""))||0;
  if(qty<=0) return alert("Enter a valid amount.");
  const active = getActiveWeek(); if(wi!==active) return alert("This week is not active.");
  const price = CONFIG.weekPrices[wi], costUSDT=qty*price;
  const mode = document.getElementById("paySel"+wi)?.value||"USDT";
  const pk = (window.__zuzu_pubkey && window.__zuzu_pubkey()) || "—";
  if(mode==="USDT"){
    alert(`Wallet: ${pk}\nAmount: ${qty} ZUZU\nPayment: USDT (SPL)\nEst. cost: ${costUSDT.toFixed(2)} USDT\n\nNote: on-chain işlemi backend/Solana SDK ile eklenecek.`);
  }else{
    const sol = costUSDT/(CONFIG.fx.sol_usdt||150);
    alert(`Wallet: ${pk}\nAmount: ${qty} ZUZU\nPayment: SOL\nEst. cost: ${sol.toFixed(4)} SOL (${costUSDT.toFixed(2)} USDT)`);
  }
}
["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>document.getElementById(id)?.addEventListener("click",()=>handleBuy(i)));

/* ========= NFT Grid ========= */
function renderNFTs(){
  const g=document.getElementById("nftGrid"); if(!g) return; let html="";
  CONFIG.nfts.forEach(n=>{
    const img=`assets/images/mask/${n.id}.png`, link=`${CONFIG.collectionUrl}?tokenId=${n.id}`;
    html += `<div class="nft">
      <img src="${img}" alt="${n.name}" loading="lazy" onerror="this.style.display='none'">
      <div class="meta"><div><b>${n.name}</b><div style="color:#9fb6e6;font-size:.9rem">Supply: ${n.supply.toLocaleString()}</div></div>
      <span class="tag">${n.rarity}</span></div>
      <a class="z-btn z-btn-ghost" style="margin:0 10px 10px" href="${link}" target="_blank" rel="noopener">View ↗</a>
    </div>`;
  });
  g.innerHTML=html;
}
renderNFTs();

/* ========= Referral ========= */
(function referrals(){
  const bar = document.getElementById("inviteBar"); if(!bar) return;
  function refresh(){
    const pk = (window.__zuzu_pubkey && window.__zuzu_pubkey())||"";
    if(!pk){ bar.innerHTML = `<span class="z-chip" data-i="invite_bar">${window.ZI[currentLang()].invite_bar}</span>`; return; }
    const link = (window.__zuzu_invite && window.__zuzu_invite()) || "";
    bar.innerHTML = `
      <span class="z-chip">${pk.slice(0,6)}...${pk.slice(-6)}</span>
      <button class="z-btn z-btn-ghost" id="copyInvite" data-i="invite_btn">${window.ZI[currentLang()].invite_btn}</button>`;
    document.getElementById("copyInvite")?.addEventListener("click", async ()=>{
      try{ await navigator.clipboard.writeText(link); alert(window.ZI[currentLang()].invite_copied); }
      catch{ alert(link); }
    });
  }
  try{
    const p = new URLSearchParams(location.search); const ref=p.get("ref");
    if(ref && !localStorage.getItem("zuzu_ref_done")){ localStorage.setItem("zuzu_ref_from",ref); localStorage.setItem("zuzu_ref_done","1"); }
  }catch{}
  refresh();
  ["load","pageshow","focus"].forEach(ev=>window.addEventListener(ev,refresh,{passive:true}));
})();

/* ========= Linkler ========= */
(function setupLinks(){
  const c=CONFIG.contractAddress, short=`${c.slice(0,6)}...${c.slice(-4)}`;
  const cd=document.getElementById("contractDisplay"), cd2=document.getElementById("contractDisplay2");
  if(cd) cd.textContent=short; if(cd2) cd2.textContent=c;
  const t1=document.getElementById("thirdwebNFTRoute"), t2=document.getElementById("thirdwebNFTRoute2");
  if(t1) t1.href=CONFIG.collectionUrl; if(t2) t2.href=CONFIG.collectionUrl;
})();
