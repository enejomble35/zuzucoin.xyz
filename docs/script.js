/* ========= SITE CONFIG ========= */
const CONFIG = {
  cluster: "mainnet-beta",                        // "devnet" istersen değiştir
  treasury: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF",
  weekPrices: [0.0050,0.0065,0.0080,0.0100],
  launchKey: "zuzu_launchAt",
  defaultCountdownDays: 60,
  LS_ADDR: "zuzu_connected_addr",
  LS_WALLET: "zuzu_connected_wallet"
};

const $ = (q,root=document)=>root.querySelector(q);
const $$= (q,root=document)=>[...root.querySelectorAll(q)];
const UA = navigator.userAgent||"";
const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(UA);

/* ========= COUNTDOWN ========= */
function getLaunchAt(){
  let ts = localStorage.getItem(CONFIG.launchKey);
  if(!ts){ ts = (Date.now() + CONFIG.defaultCountdownDays*24*3600*1000).toString(); localStorage.setItem(CONFIG.launchKey, ts); }
  return +ts;
}
function tick(){
  const left = Math.max(0, getLaunchAt() - Date.now());
  const d=Math.floor(left/86400000), h=Math.floor((left%86400000)/3600000),
        m=Math.floor((left%3600000)/60000), s=Math.floor((left%60000)/1000);
  const pad=n=>n.toString().padStart(2,"0");
  $("#cdDays").textContent=pad(d); $("#cdHours").textContent=pad(h);
  $("#cdMins").textContent=pad(m); $("#cdSecs").textContent=pad(s);
}
tick(); setInterval(tick,1000);

/* ========= PRICES ========= */
function updateCosts(){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  CONFIG.weekPrices.forEach((p,i)=>{ $("#p"+i).textContent=p.toFixed(4); $("#c"+i).textContent=(qty*p).toFixed(2); });
}
$("#buyAmount")?.addEventListener("input",updateCosts); updateCosts();

/* ========= NFT GRID ========= */
(function renderNFTs(){
  const g=$("#nftGrid"); if(!g) return;
  const items = Array.from({length:10}).map((_,i)=>({id:i,name:`ZUZU #${i+1}`,rarity:i%5===0?"Legendary":(i%2?"Rare":"Epic")}));
  g.innerHTML = items.map(n=>`
   <div class="nft">
     <img src="assets/images/mask/${n.id}.png" alt="${n.name}" onerror="this.style.display='none'">
     <div class="meta"><b>${n.name}</b><span class="tag">${n.rarity}</span></div>
   </div>`).join("");
})();

/* ========= REF LINK ========= */
(function refLink(){
  const url=new URL(location.href);
  if(url.searchParams.get("ref")) localStorage.setItem("zuzu_refAddr", url.searchParams.get("ref"));
  const addr=localStorage.getItem("zuzu_refAddr")||"";
  const out=$("#refLink"); if(out) out.value = `${location.origin}${location.pathname}?ref=${addr||"YOURCODE"}`;
  $("#copyRef")?.addEventListener("click", ()=>{ navigator.clipboard.writeText(out.value); alert("Kopyalandı!"); });
})();

/* ========= WALLETS ========= */
const ICONS={phantom:"assets/images/wallets/phantom.png", solflare:"assets/images/wallets/solflare.png"};
const Wallets = {
  phantom:{
    key:"phantom", label:"Phantom", icon:ICONS.phantom,
    has:()=>!!(window.solana?.isPhantom || window.phantom?.solana?.isPhantom),
    provider:()=>window.solana || window.phantom?.solana,
    deeplinkBrowse:(url)=>`https://phantom.app/ul/browse/${encodeURIComponent(url)}?network=${encodeURIComponent(CONFIG.cluster)}`,
    deeplinkTransfer:({amount,reference,label,message,redirect})=>
      `https://phantom.app/ul/transfer?recipient=${encodeURIComponent(CONFIG.treasury)}&amount=${encodeURIComponent(amount)}&asset=SOL&reference=${encodeURIComponent(reference)}&label=${encodeURIComponent(label)}&message=${encodeURIComponent(message)}&network=${encodeURIComponent(CONFIG.cluster)}&redirect_link=${encodeURIComponent(redirect)}`,
    async connect(){ const p=this.provider(); if(!p) throw new Error("no provider"); try{const r=await p.connect({onlyIfTrusted:true}); if(r?.publicKey) return r.publicKey.toString();}catch{} const r=await p.connect(); return (r?.publicKey||p.publicKey).toString(); },
    async disconnect(){ try{ await this.provider()?.disconnect?.(); }catch{} }
  },
  solflare:{
    key:"solflare", label:"Solflare", icon:ICONS.solflare,
    has:()=>!!window.solflare, provider:()=>window.solflare,
    deeplinkBrowse:(url)=>`https://solflare.com/ul/v1/browse/${encodeURIComponent(url)}?network=${encodeURIComponent(CONFIG.cluster)}`,
    deeplinkTransfer:({amount,reference,label,message,redirect})=>
      `https://solflare.com/ul/v1/transfer?recipient=${encodeURIComponent(CONFIG.treasury)}&amount=${encodeURIComponent(amount)}&asset=SOL&reference=${encodeURIComponent(reference)}&label=${encodeURIComponent(label)}&message=${encodeURIComponent(message)}&network=${encodeURIComponent(CONFIG.cluster)}&redirect=${encodeURIComponent(redirect)}`,
    async connect(){ const p=this.provider(); if(!p) throw new Error("no provider"); await p.connect(); return p?.publicKey?.toString()||""; },
    async disconnect(){ try{ await this.provider()?.disconnect?.(); }catch{} }
  }
};
let CURRENT_ADDRESS=null, CURRENT_WALLET=null;

function walletListHTML(){
  return Object.values(Wallets).map(w=>`<button class="wbtn" data-key="${w.key}"><img src="${w.icon}" alt="${w.label}"><span>${w.label}</span></button>`).join("");
}
(function initWalletUI(){
  const modal=$("#walletModal"); const list=$("#wlist"); if(list) list.innerHTML=walletListHTML();

  function openPicker(){ modal?.classList.add("show"); }
  function bindConnect(){
    [$("#connectBtn"), ...$$("[data-connect]")].forEach(btn=>{
      if(!btn||btn.dataset._b) return; btn.dataset._b="1";
      btn.addEventListener("click", ()=>{
        const direct = Wallets.phantom.has()?Wallets.phantom:(Wallets.solflare.has()?Wallets.solflare:null);
        if(IS_MOBILE){
          // mobil: seçenek göster → seçileni wallet içi tarayıcıda aç
          openPicker();
        }else{
          // web: eklenti varsa direkt bağlan
          if(direct) connectFlow(direct.key); else openPicker();
        }
      });
    });
  }
  bindConnect(); new MutationObserver(bindConnect).observe(document.body,{childList:true,subtree:true});

  list?.addEventListener("click",(e)=>{
    const btn=e.target.closest(".wbtn"); if(!btn) return;
    const key=btn.dataset.key, impl=Wallets[key];
    // mobilde → zuzucoin.xyz’yi cüzdanın tarayıcısında aç
    if(IS_MOBILE && !impl.has()){
      location.assign(impl.deeplinkBrowse(location.href));
      return;
    }
    connectFlow(key);
  });

  $("#wmClose")?.addEventListener("click",()=>modal?.classList.remove("show"));
  modal?.addEventListener("click",e=>{ if(e.target===modal) modal.classList.remove("show"); });

  const sa=localStorage.getItem(CONFIG.LS_ADDR), sw=localStorage.getItem(CONFIG.LS_WALLET);
  if(sa&&sw) onConnected(sw,sa,{silent:true}); else setBuyButtonsEnabled(false);
})();

async function connectFlow(key){
  const impl=Wallets[key]; if(!impl) return;
  if(!impl.has() && !IS_MOBILE){ alert(`${impl.label} eklentisi bulunamadı.`); return; }
  try{
    const addr=await impl.connect();
    onConnected(key,addr);
    $("#walletModal")?.classList.remove("show");
  }catch{ alert("Bağlantı iptal edildi."); }
}
function onConnected(key,addr,{silent}={}){
  CURRENT_ADDRESS=addr; CURRENT_WALLET=key;
  localStorage.setItem(CONFIG.LS_ADDR,addr); localStorage.setItem(CONFIG.LS_WALLET,key);
  [$("#connectBtn"), ...$$("[data-connect]")].forEach(b=>b&&(b.textContent=`${addr.slice(0,6)}...${addr.slice(-4)}`));
  const out=$("#refLink"); if(out) out.value=`${location.origin}${location.pathname}?ref=${addr}`;
  setBuyButtonsEnabled(true); if(!silent) console.log("connected:",key,addr);
}
function setBuyButtonsEnabled(ok){
  ["buyW0","buyW1","buyW2","buyW3"].forEach(id=>{const b=$("#"+id); if(b){ b.disabled=!ok; b.style.opacity=ok?"1":".5"; }});
}

/* ========= BUY (deeplink transfer) ========= */
["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>$("#"+id)?.addEventListener("click",()=>handleBuy(i)));

function handleBuy(weekIdx){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  if(qty<=0) return alert("Geçerli miktar gir.");
  if(!CURRENT_ADDRESS) return alert("Önce cüzdan bağla.");
  const price=CONFIG.weekPrices[weekIdx]; const usdt = qty*price;

  // örnek oran: 1 USDT ~ 0.01 SOL (gerçekte backend/price feed ile hesapla)
  const solAmount = (usdt*0.01).toFixed(4);
  const label="ZUZU Presale", message="ZUZU presale payment", redirect=location.href;
  const maker = (CURRENT_WALLET==="solflare"?Wallets.solflare:Wallets.phantom).deeplinkTransfer;
  const deeplink = maker({amount:solAmount,reference:CURRENT_ADDRESS,label,message,redirect});

  // cüzdan uygulamasında aç
  if(IS_MOBILE || /Phantom/i.test(UA)) location.href=deeplink;
  else window.open(deeplink,"_blank");

  alert(`Cüzdanda onay ekranı açılır (~${solAmount} SOL). Onaydan sonra bu sayfaya dönersin.`);
}
