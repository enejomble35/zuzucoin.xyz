/* ====== CONFIG ====== */
const CFG = {
  chainIdHex: "0x89",
  chainName: "Polygon",
  rpcUrls: ["https://polygon-rpc.com"],
  blockExplorerUrls: ["https://polygonscan.com"],

  treasury: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3",
  usdt: "0xC2132D05D31c914a87C6611C10748AaCBdDaE49a", // Polygon USDT

  // İSTEDİĞİN FİYATLAR:
  weekPrices: [0.040, 0.060, 0.080, 0.100], // USDT

  // 24 Kasım 13:00 (Türkiye) — sabit
  launchAtISO: "2025-11-24T13:00:00+03:00",

  LS_ADDR: "zuzu_evm_addr",
  LS_WALLET: "zuzu_evm_wallet",
  LS_LAUNCH: "zuzu_launch_fixed",
  LS_LANG: "zuzu_lang"
};

/* ====== HELPERS ====== */
const $ = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>[...r.querySelectorAll(s)];
const pad = n => n.toString().padStart(2,"0");
const toHex = (n,bytes=32)=>"0x"+BigInt(n).toString(16).padStart(bytes*2,"0");
const padAddr = a=>a.toLowerCase().replace(/^0x/,"").padStart(64,"0");

/* ====== LANG (TR/EN kısaltılmış) ====== */
(function initLang(){
  const saved = localStorage.getItem(CFG.LS_LANG) || "tr";
  $("#langCode").textContent = saved.toUpperCase();
  $("#langFlag").src = `flags/${saved}.png`;
  const btn=$("#langBtn"), menu=$("#langMenu");
  btn?.addEventListener("click",e=>{e.stopPropagation();menu.classList.toggle("show");});
  $$(".lang-opt").forEach(b=>b.addEventListener("click",()=>{
    const l=b.dataset.lang; localStorage.setItem(CFG.LS_LANG,l);
    $("#langCode").textContent=l.toUpperCase(); $("#langFlag").src=`flags/${l}.png`;
    menu.classList.remove("show");
  }));
  document.addEventListener("click",e=>{ if(!menu.contains(e.target)&&e.target!==btn) menu.classList.remove("show"); });
})();

/* ====== COUNTDOWN ====== */
(function initCountdown(){
  let ts = localStorage.getItem(CFG.LS_LAUNCH);
  if(!ts){ ts = Date.parse(CFG.launchAtISO).toString(); localStorage.setItem(CFG.LS_LAUNCH, ts); }
  const target = parseInt(ts,10);
  function tick(){
    const left = Math.max(0, target - Date.now());
    const d=Math.floor(left/86400000), h=Math.floor((left%86400000)/3600000),
          m=Math.floor((left%3600000)/60000), s=Math.floor((left%60000)/1000);
    $("#cdDays").textContent=pad(d); $("#cdHours").textContent=pad(h);
    $("#cdMins").textContent=pad(m); $("#cdSecs").textContent=pad(s);
  }
  tick(); setInterval(tick,1000);
})();

/* ====== PRESALE TIMELINE + PRICE CHART ====== */
(function renderPresaleUI(){
  const launch = Date.parse(CFG.launchAtISO);
  const presaleStart = launch - (60*24*3600*1000);
  const segDays = 15;

  const segs = Array.from({length:4},(_,i)=>{
    const s=presaleStart+i*segDays*86400000, e=s+segDays*86400000-1;
    return {i, s, e, price: CFG.weekPrices[i]};
  });

  // timeline kartları
  const tl = $("#presaleTimeline");
  tl.innerHTML = segs.map(x=>{
    const sd=new Date(x.s).toLocaleDateString(undefined,{day:"2-digit",month:"short"});
    const ed=new Date(x.e).toLocaleDateString(undefined,{day:"2-digit",month:"short"});
    return `<div class="segment">
      <div class="seg-head">Week ${x.i+1}</div>
      <div class="seg-dates">${sd} — ${ed}</div>
      <div class="seg-price">1 ZUZU = <b>${x.price.toFixed(3)}</b> USDT</div>
    </div>`;
  }).join("");

  // tek panel — mini bar chart + fiyat pill'leri
  const pc = $("#priceChart");
  const maxP = Math.max(...CFG.weekPrices);
  pc.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center">
      <h4 style="margin:0">Presale Pricing</h4>
      <div>${segs.map(s=>`<span class="pill">W${s.i+1}: <b>${s.price.toFixed(3)}</b></span>`).join(" ")}</div>
    </div>
    <div class="chart-bars">
      ${segs.map(s=>{
        const h = Math.max(12, Math.round((s.price/maxP)*100));
        return `<div class="bar" style="height:${h}%"><small>${s.price.toFixed(3)}</small></div>`;
      }).join("")}
    </div>
    <div class="chart-labels">
      ${segs.map(s=>`<div style="text-align:center;color:#9db3db;font-weight:700">W${s.i+1}</div>`).join("")}
    </div>
  `;
})();

/* ====== NFT GRID ====== */
(function renderNFTs(){
  const g=$("#nftGrid"); if(!g) return;
  g.innerHTML = Array.from({length:12}).map((_,i)=>{
    const id=i+1, tag=id%5===0?'Legendary':(id%2?'Rare':'Epic');
    return `<div class="nft">
      <img src="assets/images/mask/${id}.png" alt="ZUZU #${id}" loading="lazy" onerror="this.style.display='none'">
      <div class="meta"><b>ZUZU #${id}</b><span class="pill">${tag}</span></div>
    </div>`;
  }).join("");
})();

/* ====== REFLINK ====== */
(function refInit(){
  const url = new URL(location.href);
  if(url.searchParams.get("ref")) localStorage.setItem("zuzu_ref", url.searchParams.get("ref"));
  const ref = localStorage.getItem("zuzu_ref") || "";
  const out=$("#refLink"); const copy=$("#copyRef"); const claim=$("#claimRef");
  if(out) out.value = `${location.origin}${location.pathname}?ref=${ref||"YOURCODE"}`;
  copy?.addEventListener("click",()=>{ navigator.clipboard.writeText(out.value); alert("Copied!"); });
  claim?.addEventListener("click",()=>{ alert("Referral rewards will be claimable after purchase."); });
})();

/* ====== WALLET (MetaMask/Phantom EVM) ====== */
const Wallets = {
  metamask:{key:"metamask",has:()=>!!window.ethereum,provider:()=>window.ethereum},
  phantom:{key:"phantom",has:()=>!!window.phantom?.ethereum,provider:()=>window.phantom?.ethereum}
};
let CURRENT={addr:null,wallet:null};

function walletListHTML(){
  return Object.values(Wallets).map(w=>`<button class="wbtn" data-key="${w.key}"><span>🔒</span>${w.key}</button>`).join("");
}
function setBuyButtonsEnabled(ok){
  const b=$("#buyNow"); if(!b) return; b.disabled=!ok; b.style.opacity=ok?"1":".5"; b.style.pointerEvents=ok?"auto":"none";
}

(function initWalletUI(){
  const modal=$("#walletModal"), list=$("#wlist"), btnConnect=$("#connectBtn"), btnClose=$("#wmClose"), btnDisconnect=$("#disconnectBtn");
  if(list) list.innerHTML=walletListHTML();

  const savedAddr=localStorage.getItem(CFG.LS_ADDR), savedWal=localStorage.getItem(CFG.LS_WALLET);
  if(savedAddr && savedWal){ onConnected(savedWal,savedAddr,{silent:true}); } else { setBuyButtonsEnabled(false); }

  btnConnect?.addEventListener("click", ()=>{
    const direct = Wallets.metamask.has()?Wallets.metamask:(Wallets.phantom.has()?Wallets.phantom:null);
    if(direct){ connectFlow(direct.key); } else { modal?.classList.add("show"); modal?.removeAttribute("hidden"); }
  });
  list?.addEventListener("click",(e)=>{ const b=e.target.closest(".wbtn"); if(!b) return; connectFlow(b.dataset.key); });
  btnClose?.addEventListener("click", ()=>{ modal?.classList.remove("show"); modal?.setAttribute("hidden",""); });
  modal?.addEventListener("click",(e)=>{ if(e.target===modal){ modal.classList.remove("show"); modal.setAttribute("hidden",""); } });
  btnDisconnect?.addEventListener("click", ()=>{ CURRENT={addr:null,wallet:null}; localStorage.removeItem(CFG.LS_ADDR); localStorage.removeItem(CFG.LS_WALLET); $("#connectBtn").textContent="Cüzdan Bağla"; setBuyButtonsEnabled(false); alert("Disconnected."); });

  $("#buyNow")?.addEventListener("click", ()=>handleBuy());
})();

async function ensurePolygon(provider){
  try{
    const chainId = await provider.request({ method:"eth_chainId" });
    if(chainId?.toLowerCase() === CFG.chainIdHex) return;
    await provider.request({ method:"wallet_switchEthereumChain", params:[{ chainId: CFG.chainIdHex }] });
  }catch(err){
    try{
      await provider.request({ method:"wallet_addEthereumChain", params:[{
        chainId: CFG.chainIdHex, chainName: CFG.chainName, rpcUrls: CFG.rpcUrls,
        nativeCurrency:{ name:"MATIC", symbol:"MATIC", decimals:18 }, blockExplorerUrls: CFG.blockExplorerUrls
      }]} );
    }catch(e){ console.error("Chain switch/add failed",e); throw e; }
  }
}
async function connectFlow(key){
  const impl=Wallets[key]; if(!impl) return; const provider=impl.provider(); const modal=$("#walletModal");
  if(provider){
    try{
      await ensurePolygon(provider);
      const accounts = await provider.request({ method:"eth_requestAccounts" });
      const addr=accounts[0]; onConnected(key,addr);
      modal?.classList.remove("show"); modal?.setAttribute("hidden","");
      provider.on && provider.on("accountsChanged",(a)=>{ if(a.length===0){ CURRENT={addr:null,wallet:null}; localStorage.removeItem(CFG.LS_ADDR); localStorage.removeItem(CFG.LS_WALLET); $("#connectBtn").textContent="Cüzdan Bağla"; setBuyButtonsEnabled(false);} else { onConnected(key,a[0],{silent:true}); }});
      provider.on && provider.on("chainChanged",(id)=>{ if(id.toLowerCase()!==CFG.chainIdHex) ensurePolygon(provider).catch(()=>{}); });
    }catch(e){ console.error(e); alert("Wallet connection failed."); }
    return;
  }
  window.open("https://metamask.app.link/dapp/"+location.host+location.pathname,"_blank");
}
function onConnected(key,addr,opts={}){
  CURRENT={addr,wallet:key}; localStorage.setItem(CFG.LS_ADDR,addr); localStorage.setItem(CFG.LS_WALLET,key);
  $("#connectBtn").textContent=`${addr.slice(0,6)}...${addr.slice(-4)}`;
  $("#disconnectBtn").style.display="inline-flex"; setBuyButtonsEnabled(true);
  if(!opts.silent) console.log("Connected:",key,addr);
}

/* ====== BUY (demo) ====== */
async function handleBuy(){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  if(qty<=0) return alert("Geçerli miktar gir.");
  if(!CURRENT.addr) return alert("Önce cüzdan bağla.");

  const launch = Date.parse(CFG.launchAtISO);
  const start  = launch - (60*24*3600*1000);
  const now = Date.now();
  if(now < start || now > launch) return alert("Presale aktif değil.");
  const idx = Math.min(3, Math.floor((now-start)/(15*24*3600*1000)));
  const price = CFG.weekPrices[idx];
  const usdtCost = qty * price;
  const payWith = $("#payWith").value;

  const provider = Wallets[CURRENT.wallet]?.provider?.(); if(!provider) return alert("Provider yok.");
  await ensurePolygon(provider);

  if(payWith==="MATIC"){
    // ÖRNEK: 1 USDT ≈ 1 MATIC varsayımı (gerçek oran için backend gerekir)
    const valueHex = toHex(Math.round(usdtCost * 1e18));
    try{ await provider.request({ method:"eth_sendTransaction", params:[{ from:CURRENT.addr, to:CFG.treasury, value:valueHex }]}); alert("MATIC ödeme gönderildi."); }
    catch(e){ console.error(e); alert("Ödeme başarısız."); }
    return;
  }

  // USDT (6 decimals) transfer
  const amount = BigInt(Math.round(usdtCost * 1e6));
  const data = "0xa9059cbb" + padAddr(CFG.treasury) + amount.toString(16).padStart(64,"0");
  try{ await provider.request({ method:"eth_sendTransaction", params:[{ from:CURRENT.addr, to:CFG.usdt, data, value:"0x0" }]}); alert("USDT ödeme gönderildi."); }
  catch(e){ console.error(e); alert("USDT ödeme başarısız."); }
}

/* small */
(function tweaks(){
  const t=$("#exTrack"); if(t){ t.style.transform="translateX(0)"; setTimeout(()=>t.style.transform="",60); }
})();
