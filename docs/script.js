/* =========================
   ZUZU — script.js (stable)
========================= */

/* CONFIG */
const CONFIG={
  launchKey:"zuzu_launchAt",
  defaultCountdownDays:60,
  weekPrices:[0.0050,0.0065,0.0080,0.0100],
  nfts:Array.from({length:10}).map((_,i)=>({id:i,name:`ZUZU #${i+1}`,rarity:i%5===0?'Legendary':(i%2?'Rare':'Epic')})),
  cluster:"devnet", /* test aşaması: cüzdanı devnet yap */
  treasury:"FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF",
  LS_ADDR:"zuzu_connected_addr",
  LS_WALLET:"zuzu_connected_wallet",
  LS_LANG:"zuzu_lang",
  SS_AWAIT:"zuzu_await_wallet",
  SS_TARGET:"zuzu_target_wallet"
};

/* helpers */
const $=(q,root=document)=>root.querySelector(q);
const $$=(q,root=document)=>[...root.querySelectorAll(q)];
const UA=navigator.userAgent||"";
const IS_MOBILE=/Android|iPhone|iPad|iPod/i.test(UA);
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const pad=(n)=>n.toString().padStart(2,"0");

/* Countdown */
function getLaunchAt(){
  let ts=localStorage.getItem(CONFIG.launchKey);
  if(!ts){ ts=(Date.now()+CONFIG.defaultCountdownDays*86400000).toString(); localStorage.setItem(CONFIG.launchKey,ts); }
  return parseInt(ts,10);
}
function tick(){
  const left=Math.max(0,getLaunchAt()-Date.now());
  const d=Math.floor(left/86400000);
  const h=Math.floor((left%86400000)/3600000);
  const m=Math.floor((left%3600000)/60000);
  const s=Math.floor((left%60000)/1000);
  $("#cdDays")?.( $("#cdDays").textContent=pad(d) );
  $("#cdHours")?.( $("#cdHours").textContent=pad(h) );
  $("#cdMins")?.( $("#cdMins").textContent=pad(m) );
  $("#cdSecs")?.( $("#cdSecs").textContent=pad(s) );
}
tick(); setInterval(tick,1000);

/* Costs */
function updateCosts(){
  const inp=$("#buyAmount");
  const qty=parseFloat((inp?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  CONFIG.weekPrices.forEach((p,i)=>{
    $("#p"+i)&&($("#p"+i).textContent=p.toFixed(4));
    $("#c"+i)&&($("#c"+i).textContent=(qty*p).toLocaleString(undefined,{maximumFractionDigits:2}));
  });
}
$("#buyAmount")?.addEventListener("input",updateCosts); updateCosts();

/* NFTs */
(function renderNFTs(){
  const g=$("#nftGrid"); if(!g) return;
  g.innerHTML=CONFIG.nfts.map(n=>`
    <div class="nft">
      <img src="assets/images/mask/${n.id}.png?v=1" alt="${n.name}" loading="lazy" onerror="this.style.display='none'">
      <div class="meta"><b>${n.name}</b><span class="tag">${n.rarity}</span></div>
    </div>`).join("");
})();

/* Invite link */
(function refLink(){
  const url=new URL(location.href);
  if(url.searchParams.get("ref")) localStorage.setItem("zuzu_refAddr",url.searchParams.get("ref"));
  const addr=localStorage.getItem("zuzu_refAddr")||"";
  const out=$("#refLink"); const copyBtn=$("#copyRef");
  if(out){ out.value=`${location.origin}${location.pathname}?ref=${addr||"YOURCODE"}`; }
  copyBtn?.addEventListener("click",()=>{ navigator.clipboard.writeText(out.value); alert("Copied!"); });
})();

/* ============ Wallet Connect (Phantom & Solflare) ============ */
const ICONS={
  phantom:"data:image/svg+xml;utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#7963f0"/><text x="24" y="30" text-anchor="middle" font-size="16" fill="#fff" font-family="Arial" font-weight="700">PH</text></svg>'),
  solflare:"data:image/svg+xml;utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#ff6b00"/><text x="24" y="30" text-anchor="middle" font-size="16" fill="#fff" font-family="Arial" font-weight="700">SF</text></svg>')
};
const Wallets={
  phantom:{
    key:"phantom", label:"Phantom", icon:"assets/images/wallets/phantom.png",
    has:()=>!!(window.phantom?.solana?.isPhantom||window.solana?.isPhantom),
    provider:()=>window.phantom?.solana||window.solana,
    deeplink:(u)=>`https://phantom.app/ul/browse/${encodeURIComponent(u)}?network=${CONFIG.cluster}`,
    async connect(){ const p=this.provider(); if(!p) throw new Error("no provider"); try{await p.connect({onlyIfTrusted:true});}catch{} const r=await p.connect(); return (r?.publicKey||p.publicKey).toString(); },
    async disconnect(){ try{ await this.provider()?.disconnect?.(); }catch{} }
  },
  solflare:{
    key:"solflare", label:"Solflare", icon:"assets/images/wallets/solflare.png",
    has:()=>!!window.solflare,
    provider:()=>window.solflare,
    deeplink:(u)=>`https://solflare.com/ul/v1/browse/${encodeURIComponent(u)}?network=${CONFIG.cluster}`,
    async connect(){ const p=this.provider(); if(!p) throw new Error("no provider"); try{await p.connect({onlyIfTrusted:true});}catch{} const r=await p.connect(); return (r?.publicKey||p.publicKey).toString(); },
    async disconnect(){ try{ await this.provider()?.disconnect?.(); }catch{} }
  }
};
let CURRENT_ADDRESS=null, CURRENT_WALLET=null;

function walletListHTML(){
  return Object.values(Wallets).map(w=>`
    <button class="wbtn" data-key="${w.key}">
      <img src="${w.icon}" onerror="this.src='${ICONS[w.key]}'" alt="${w.label}"><span>${w.label}</span>
    </button>`).join("");
}
(function initWalletUI(){
  const modal=$("#walletModal"), list=$("#wlist");
  if(list) list.innerHTML=walletListHTML();

  function openModal(){ modal?.classList.add("show"); }
  function closeModal(){ modal?.classList.remove("show"); }

  const bind=()=>[ $("#connectBtn"), ...$$("[data-connect]") ].filter(Boolean).forEach(btn=>{
    if(btn.dataset._b) return; btn.dataset._b="1";
    btn.addEventListener("click", ()=>{
      if(!IS_MOBILE && (Wallets.phantom.has()||Wallets.solflare.has())){
        const prefer=Wallets.phantom.has()?"phantom":"solflare";
        connectFlow(prefer);
      }else openModal();
    });
  });
  bind(); new MutationObserver(bind).observe(document.body,{childList:true,subtree:true});

  list?.addEventListener("click",(e)=>{
    const key=e.target.closest(".wbtn")?.dataset.key; if(!key) return;
    connectFlow(key);
  });

  $("#wmClose")?.addEventListener("click", closeModal);
  modal?.addEventListener("click",(e)=>{ if(e.target===modal) closeModal(); });

  const sa=localStorage.getItem(CONFIG.LS_ADDR), sw=localStorage.getItem(CONFIG.LS_WALLET);
  if(sa&&sw) onConnected(sw,sa,{silent:true}); else setBuyButtonsEnabled(false);

  ["load","visibilitychange"].forEach(ev=>document.addEventListener(ev,()=>{ if(document.hidden) return; autoConnectIfReturned(); }));
})();

async function connectFlow(key){
  const impl=Wallets[key]; if(!impl) return;
  const url=location.href;

  if(IS_MOBILE && !impl.has()){
    sessionStorage.setItem(CONFIG.SS_AWAIT,"1");
    sessionStorage.setItem(CONFIG.SS_TARGET,key);
    location.href=impl.deeplink(url);
    return;
  }
  try{
    const addr=await impl.connect();
    onConnected(key,addr);
    $("#walletModal")?.classList.remove("show");
  }catch(e){ alert(`${impl.label} bağlantısı iptal/başarısız.`); }
}
async function autoConnectIfReturned(){
  if(sessionStorage.getItem(CONFIG.SS_AWAIT)!=="1") return;
  const key=sessionStorage.getItem(CONFIG.SS_TARGET); const impl=Wallets[key];
  if(!impl||!impl.has()) return;
  try{ const addr=await impl.connect(); onConnected(key,addr); }
  finally{ sessionStorage.removeItem(CONFIG.SS_AWAIT); sessionStorage.removeItem(CONFIG.SS_TARGET); }
}
function onConnected(key,addr,{silent}={}){
  CURRENT_WALLET=key; CURRENT_ADDRESS=addr;
  localStorage.setItem(CONFIG.LS_ADDR,addr);
  localStorage.setItem(CONFIG.LS_WALLET,key);
  [$("#connectBtn"), ...$$("[data-connect]")].forEach(b=>b&&(b.textContent=`${addr.slice(0,6)}...${addr.slice(-4)}`));
  $("#disconnectBtn")?.style.setProperty("display","inline-flex");
  setBuyButtonsEnabled(true);
  if(!silent) console.log("Connected:",key,addr);
}
$("#disconnectBtn")?.addEventListener("click", async ()=>{
  try{ if(CURRENT_WALLET&&Wallets[CURRENT_WALLET]) await Wallets[CURRENT_WALLET].disconnect(); }catch{}
  CURRENT_ADDRESS=null; CURRENT_WALLET=null;
  localStorage.removeItem(CONFIG.LS_ADDR); localStorage.removeItem(CONFIG.LS_WALLET);
  [$("#connectBtn"), ...$$("[data-connect]")].forEach(b=>b&&(b.textContent="Cüzdan Bağla"));
  $("#disconnectBtn")?.style.setProperty("display","none");
  setBuyButtonsEnabled(false);
  alert("Cüzdan bağlantısı kesildi.");
});

/* BUY — Solana Pay deep link (devnet testi) */
function usdtToSol(x){ // demo kur (örnek): 1 SOL = 100 USDT
  return +(x/100).toFixed(4);
}
["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>$("#"+id)?.addEventListener("click",()=>handleBuy(i)));
function setBuyButtonsEnabled(ok){
  ["buyW0","buyW1","buyW2","buyW3"].forEach(id=>{
    const b=document.getElementById(id); if(!b) return;
    b.disabled=!ok; b.style.opacity=ok?"1":".5"; b.style.pointerEvents=ok?"auto":"none";
  });
}
function handleBuy(weekIdx){
  const qty=parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  if(qty<=0) return alert("Geçerli miktar gir.");
  if(!CURRENT_ADDRESS) return alert("Önce cüzdan bağla.");

  const price=CONFIG.weekPrices[weekIdx]??CONFIG.weekPrices[0];
  const usdtCost=qty*price;
  const amountSol=usdtToSol(usdtCost);

  const u=new URL(`solana:${CONFIG.treasury}`);
  u.searchParams.set("amount",amountSol.toString());
  u.searchParams.set("label","ZUZU Presale");
  u.searchParams.set("message",`ZUZU ${qty} adet (${price} USDT)`);
  u.searchParams.set("reference",CURRENT_ADDRESS);
  if(CONFIG.cluster!=="mainnet-beta") u.searchParams.set("cluster",CONFIG.cluster);

  window.location.href=u.toString();
}

/* small polish */
(function ensureExStrip(){ /* nothing */ })();
