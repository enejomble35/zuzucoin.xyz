/* ===== CONFIG ===== */
const CONFIG = {
  cluster: "mainnet-beta", // devnet istiyorsan "devnet" yap
  treasury: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF",
  weekPrices: [0.0050,0.0065,0.0080,0.0100],
  launchKey: "zuzu_launchAt",
  defaultCountdownDays: 60,
  LS_ADDR: "zuzu_connected_addr",
  LS_WALLET: "zuzu_connected_wallet"
};

const $  = (q,root=document)=>root.querySelector(q);
const $$ = (q,root=document)=>[...root.querySelectorAll(q)];
const UA = navigator.userAgent||"";
const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(UA);
const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

/* ===== Countdown ===== */
function getLaunchAt(){
  let ts = localStorage.getItem(CONFIG.launchKey);
  if(!ts){ ts = (Date.now() + CONFIG.defaultCountdownDays*24*3600*1000).toString(); localStorage.setItem(CONFIG.launchKey, ts); }
  return +ts;
}
function tick(){
  const left = Math.max(0, getLaunchAt() - Date.now());
  const d=Math.floor(left/86400000);
  const h=Math.floor((left%86400000)/3600000);
  const m=Math.floor((left%3600000)/60000);
  const s=Math.floor((left%60000)/1000);
  const pad=n=>n.toString().padStart(2,"0");
  $("#cdDays").textContent  = pad(d);
  $("#cdHours").textContent = pad(h);
  $("#cdMins").textContent  = pad(m);
  $("#cdSecs").textContent  = pad(s);
}
tick(); setInterval(tick,1000);

/* ===== Costs ===== */
function updateCosts(){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  CONFIG.weekPrices.forEach((p,i)=>{
    $("#p"+i).textContent = p.toFixed(4);
    $("#c"+i).textContent = (qty*p).toLocaleString(undefined,{maximumFractionDigits:2});
  });
}
$("#buyAmount")?.addEventListener("input",updateCosts); updateCosts();

/* ===== NFT grid ===== */
(function renderNFTs(){
  const g=$("#nftGrid"); if(!g) return;
  const items = Array.from({length:10}).map((_,i)=>({
    id:i, name:`ZUZU #${i+1}`, rarity: i%5===0?"Legendary":(i%2?"Rare":"Epic")
  }));
  g.innerHTML = items.map(n=>`
   <div class="nft">
     <img src="assets/images/mask/${n.id}.png" alt="${n.name}" onerror="this.style.display='none'">
     <div class="meta"><b>${n.name}</b><span class="tag">${n.rarity}</span></div>
   </div>`).join("");
})();

/* ===== Invite link ===== */
(function refLink(){
  const url=new URL(location.href);
  if(url.searchParams.get("ref")) localStorage.setItem("zuzu_refAddr", url.searchParams.get("ref"));
  const addr=localStorage.getItem("zuzu_refAddr")||"";
  const out=$("#refLink");
  out.value = `${location.origin}${location.pathname}?ref=${addr||"YOURCODE"}`;
  $("#copyRef")?.addEventListener("click", ()=>{ navigator.clipboard.writeText(out.value); alert("Kopyalandı!"); });
})();

/* ===== Wallets (Phantom & Solflare) ===== */
const ICONS = {
  phantom:"assets/images/wallets/phantom.png",
  solflare:"assets/images/wallets/solflare.png"
};
const Wallets = {
  phantom:{
    key:"phantom", label:"Phantom", icon:ICONS.phantom,
    has:()=>!!(window.solana?.isPhantom||window.phantom?.solana?.isPhantom),
    provider:()=>window.solana||window.phantom?.solana,
    deeplinkBrowse:(url)=>`https://phantom.app/ul/browse/${encodeURIComponent(url)}?network=${encodeURIComponent(CONFIG.cluster)}`,
    async connect(){
      const p=this.provider(); if(!p) throw new Error("no provider");
      try{ const r=await p.connect?.({onlyIfTrusted:true}); if(r?.publicKey) return r.publicKey.toString(); }catch(_){}
      const r=await p.connect(); return (r?.publicKey||p.publicKey).toString();
    },
    async disconnect(){ try{ await this.provider()?.disconnect?.(); }catch{} }
  },
  solflare:{
    key:"solflare", label:"Solflare", icon:ICONS.solflare,
    has:()=>!!window.solflare,
    provider:()=>window.solflare,
    deeplinkBrowse:(url)=>`https://solflare.com/ul/v1/browse/${encodeURIComponent(url)}?network=${encodeURIComponent(CONFIG.cluster)}`,
    async connect(){ const p=this.provider(); if(!p) throw new Error("no provider"); await p.connect(); return p?.publicKey?.toString()||""; },
    async disconnect(){ try{ await this.provider()?.disconnect?.(); }catch{} }
  }
};
let CURRENT_ADDRESS=null, CURRENT_WALLET=null;

function walletListHTML(){
  return Object.values(Wallets).map(w=>`
    <button class="wbtn" data-key="${w.key}">
      <img src="${w.icon}" alt="${w.label}"><span>${w.label}</span>
    </button>`).join("");
}
(function initWalletUI(){
  const modal=$("#walletModal"); const list=$("#wlist"); if(list) list.innerHTML=walletListHTML();

  function bindConnectButtons(){
    [$("#connectBtn"), ...$$("[data-connect]")].forEach(btn=>{
      if(!btn||btn.dataset._bind) return;
      btn.dataset._bind="1";
      btn.addEventListener("click", ()=>{
        // tercih: Phantom > Solflare
        const direct = Wallets.phantom.has()?Wallets.phantom:(Wallets.solflare.has()?Wallets.solflare:null);
        if(direct) connectFlow(direct.key); else modal?.classList.add("show");
      });
    });
  }
  bindConnectButtons();
  new MutationObserver(bindConnectButtons).observe(document.body,{subtree:true,childList:true});

  list?.addEventListener("click",(e)=>{
    const btn=e.target.closest(".wbtn"); if(!btn) return;
    connectFlow(btn.dataset.key);
  });

  $("#wmClose")?.addEventListener("click",()=>modal?.classList.remove("show"));
  modal?.addEventListener("click",(e)=>{ if(e.target===modal) modal.classList.remove("show"); });

  // önceki oturum
  const sa=localStorage.getItem(CONFIG.LS_ADDR), sw=localStorage.getItem(CONFIG.LS_WALLET);
  if(sa && sw) onConnected(sw, sa, {silent:true}); else setBuyButtonsEnabled(false);
})();

async function connectFlow(key){
  const impl=Wallets[key]; if(!impl) return;
  const modal=$("#walletModal");

  // Mobil & provider yok → uygulama içinde siteyi aç
  if(!impl.has() && IS_MOBILE){
    const targetUrl = impl.deeplinkBrowse(location.href);
    location.assign(targetUrl); // uygulamaya geç
    return;
  }
  // Masaüstü ve eklenti yok
  if(!impl.has() && !IS_MOBILE){
    alert(`${impl.label} eklentisi bulunamadı.`);
    $("#walletModal")?.classList.add("show");
    return;
  }
  try{
    const addr=await impl.connect();
    onConnected(key, addr);
    modal?.classList.remove("show");
  }catch(e){
    alert("Bağlantı iptal edildi veya başarısız.");
  }
}
function onConnected(key,addr,{silent}={}){
  CURRENT_ADDRESS=addr; CURRENT_WALLET=key;
  localStorage.setItem(CONFIG.LS_ADDR,addr);
  localStorage.setItem(CONFIG.LS_WALLET,key);
  [$("#connectBtn"), ...$$("[data-connect]")].forEach(b=>b&&(b.textContent=`${addr.slice(0,6)}...${addr.slice(-4)}`));
  const out=$("#refLink"); if(out) out.value=`${location.origin}${location.pathname}?ref=${addr}`;
  setBuyButtonsEnabled(true);
  if(!silent) console.log("Connected:",key,addr);
}

/* ===== Buy (Solana Pay via Phantom UL) ===== */
["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
  $("#"+id)?.addEventListener("click", ()=>handleBuy(i));
});
function setBuyButtonsEnabled(ok){
  ["buyW0","buyW1","buyW2","buyW3"].forEach(id=>{
    const b=$("#"+id); if(!b) return;
    b.disabled=!ok; b.style.opacity = ok ? "1" : ".5";
  });
}
function activeWeek(){ return 0; } // şimdilik W1 aktif

function handleBuy(weekIdx){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  if(qty<=0){ alert("Geçerli miktar gir."); return; }
  if(weekIdx!==activeWeek()){ alert("Bu hafta aktif değil."); return; }
  if(!CURRENT_ADDRESS){ alert("Önce cüzdan bağla."); return; }

  const price=CONFIG.weekPrices[weekIdx];
  const usdtCost = qty*price;

  // Basit kur: 1 USDT ~ 0.01 SOL (örnek). Gerçekte backend ile fiyat çek.
  const solAmount = (usdtCost*0.01).toFixed(4);

  // Phantom UL — Solana Pay transfer
  const deeplink = `https://phantom.app/ul/transfer`+
    `?recipient=${encodeURIComponent(CONFIG.treasury)}`+
    `&amount=${encodeURIComponent(solAmount)}`+
    `&asset=SOL`+
    `&reference=${encodeURIComponent(CURRENT_ADDRESS)}`+
    `&label=${encodeURIComponent("ZUZU Presale")}`+
    `&message=${encodeURIComponent("ZUZU presale payment")}`+
    `&network=${encodeURIComponent(CONFIG.cluster)}`+
    `&redirect_link=${encodeURIComponent(location.href)}`;

  // cüzdan uygulamasında veya dış tarayıcıda aç
  if(/Phantom/i.test(UA) || window.solana?.isPhantomApp){ location.href=deeplink; }
  else { window.open(deeplink,"_blank"); }

  alert(`Cüzdanda onay ekranı açılır (~${solAmount} SOL). Onaydan sonra bu sayfaya dönersin.`);
}

/* ===== tiny polish ===== */
(function ensureExStrip(){ /* nothing */ })();
