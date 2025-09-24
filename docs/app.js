/* =========================
   ZUZU — Frontend (app.js)
   - Türkiye saatine göre sabit launch: 2025-11-24 13:00 TRT
   - Presale: 4 segment × 15 gün = 60 gün (tek timeline card)
   - Referral + claim butonu (ödemeden sonra backend ile bağlarsın)
   - Polygon (MetaMask / Phantom EVM) destekli
========================= */

const CFG = {
  chainIdHex: "0x89",
  chainName: "Polygon",
  rpcUrls: ["https://polygon-rpc.com"],
  blockExplorerUrls: ["https://polygonscan.com"],

  // treasury / presale receiving address
  treasury: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3",
  usdt: "0xC2132D05D31c914a87C6611C10748AaCBdDaE49a", // standard USDT on Polygon (example)

  // Presale prices (USDT)
  weekPrices: [0.0045, 0.0060, 0.0075, 0.0090],

  // LAUNCH = 24 Nov 2025 13:00 TRT (fixed)
  launchAtISO: "2025-11-24T13:00:00+03:00",

  LS_ADDR: "zuzu_evm_addr",
  LS_WALLET: "zuzu_evm_wallet",
  LS_LAUNCH: "zuzu_launch_fixed",
  LS_LANG: "zuzu_lang"
};

/* helpers */
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const pad = (n) => n.toString().padStart(2, "0");
const toHex = (n, bytes=32) => "0x" + BigInt(n).toString(16).padStart(bytes*2,"0");
const padAddr = (a) => a.toLowerCase().replace(/^0x/,"").padStart(64,"0");

/* i18n minimal (kopya) */
const I = {
  en:{connect:"Connect Wallet",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS"},
  tr:{connect:"Cüzdan Bağla",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE"}
};

/* =========================
   LANG INIT (kısa)
========================= */
(function initLang(){
  const saved = localStorage.getItem(CFG.LS_LANG) || "en";
  $("#langCode") && ($("#langCode").textContent = saved.toUpperCase());
  $("#langFlag") && ($("#langFlag").src = `flags/${saved}.png`);
  // veri-i etiketlerin tamamını update etmiyoruz; ana buton texti
  $("#connectBtn") && ($("#connectBtn").textContent = I[saved]?.connect || "Connect Wallet");
  const langBtn=$("#langBtn"), langMenu=$("#langMenu");
  if(langBtn && langMenu){
    langBtn.addEventListener("click", (e)=>{ e.stopPropagation(); langMenu.classList.toggle("show"); });
    $$(".lang-opt").forEach(b=>b.addEventListener("click", ()=>{
      const l=b.dataset.lang; localStorage.setItem(CFG.LS_LANG,l);
      $("#langCode").textContent = l.toUpperCase(); $("#langFlag").src = `flags/${l}.png`;
      $("#connectBtn").textContent = I[l]?.connect || "Connect Wallet";
      langMenu.classList.remove("show");
    }));
    document.addEventListener("click",(e)=>{ if(!langMenu.contains(e.target) && e.target!==langBtn) langMenu.classList.remove("show"); });
  }
})();

/* =========================
   COUNTDOWN: target = launchAtISO (fixed TR time)
   Also store once in LS to prevent accidental reset
========================= */
(function initCountdown(){
  let ts = localStorage.getItem(CFG.LS_LAUNCH);
  if(!ts){
    ts = Date.parse(CFG.launchAtISO).toString();
    localStorage.setItem(CFG.LS_LAUNCH, ts);
  }
  const target = parseInt(ts,10);
  function tick(){
    const left = Math.max(0, target - Date.now());
    const d = Math.floor(left/86400000);
    const h = Math.floor((left%86400000)/3600000);
    const m = Math.floor((left%3600000)/60000);
    const s = Math.floor((left%60000)/1000);
    $("#cdDays") && ($("#cdDays").textContent = pad(d));
    $("#cdHours") && ($("#cdHours").textContent = pad(h));
    $("#cdMins") && ($("#cdMins").textContent = pad(m));
    $("#cdSecs") && ($("#cdSecs").textContent = pad(s));
  }
  tick(); setInterval(tick,1000);
})();

/* =========================
   PRESALE TIMELINE: 4x15 gün = 60 gün
   presaleEnd = launchAt
   presaleStart = launchAt - 60 gün
   Renders a 4-segment bar with dates and prices
========================= */
(function renderPresaleTimeline(){
  const launch = Date.parse(CFG.launchAtISO);
  const SEG_DAYS = 15;
  const segments = [];
  const presaleEnd = launch;
  const presaleStart = presaleEnd - (60 * 24*3600*1000);
  for(let i=0;i<4;i++){
    const segStart = presaleStart + i*SEG_DAYS*24*3600*1000;
    const segEnd   = segStart + SEG_DAYS*24*3600*1000 - 1;
    segments.push({index:i, start:segStart, end:segEnd, price:CFG.weekPrices[i]});
  }

  // render timeline HTML
  const container = $("#presaleTimeline");
  if(container){
    container.innerHTML = segments.map(s => {
      const sd = new Date(s.start); const ed = new Date(s.end);
      const startStr = sd.toLocaleDateString(undefined, {day:"2-digit",month:"short"});
      const endStr   = ed.toLocaleDateString(undefined, {day:"2-digit",month:"short"});
      return `<div class="segment">
                <div class="seg-head">Week ${s.index+1}</div>
                <div class="seg-dates">${startStr} — ${endStr}</div>
                <div class="seg-price">1 ZUZU = <b>${s.price.toFixed(4)}</b> USDT</div>
              </div>`;
    }).join("");
  }

  // also list a short price summary
  const pinfo = $("#presalePrices");
  if(pinfo){
    pinfo.innerHTML = `<div style="display:flex;gap:12px;flex-wrap:wrap">
      ${segments.map(s=>`<div class="price-chip">W${s.index+1}: <b>${s.price.toFixed(4)}</b></div>`).join("")}
    </div>`;
  }
})();

/* =========================
   NFT GRID render
========================= */
(function renderNFTs(){
  const g=$("#nftGrid"); if(!g) return;
  g.innerHTML = Array.from({length:12}).map((_,i)=> {
    const idx=i+1;
    return `
      <div class="nft">
        <img src="assets/images/mask/${idx}.png" alt="ZUZU #${idx}" loading="lazy" onerror="this.style.display='none'">
        <div class="meta"><b>ZUZU #${idx}</b><span class="tag">${idx%5===0?'Legendary':(idx%2?'Rare':'Epic')}</span></div>
      </div>`;
  }).join("");
})();

/* =========================
   REF LINK
========================= */
(function refInit(){
  const url = new URL(location.href);
  if(url.searchParams.get("ref")) localStorage.setItem("zuzu_ref", url.searchParams.get("ref"));
  const ref = localStorage.getItem("zuzu_ref") || "";
  const out = $("#refLink"); const copyBtn = $("#copyRef"); const claimBtn = $("#claimRef");
  if(out) out.value = `${location.origin}${location.pathname}?ref=${ref||"YOURCODE"}`;
  copyBtn?.addEventListener("click", ()=>{ navigator.clipboard.writeText(out.value); alert("Copied!"); });
  claimBtn?.addEventListener("click", ()=>{ alert("Referral rewards are claimable after purchase (connect wallet & open claim portal)."); });
})();

/* =========================
   WALLET: MetaMask + Phantom EVM support
   - connectFlow -> ensure polygon chain -> request accounts
   - add listeners: accountsChanged, chainChanged
========================= */
const Wallets = {
  metamask:{ key:"metamask", label:"MetaMask", has:()=>!!window.ethereum, provider:()=>window.ethereum },
  phantom:{ key:"phantom", label:"Phantom", has:()=>!!window.phantom?.ethereum, provider:()=>window.phantom?.ethereum }
};

let CURRENT = { addr:null, wallet:null };

function walletListHTML(){
  return Object.values(Wallets).map(w=>`
    <button class="wbtn" data-key="${w.key}">
      <span style="width:22px;display:inline-block">🔒</span><span>${w.label}</span>
    </button>`).join("");
}

function setBuyButtonsEnabled(ok){
  ["buyNow"].forEach(id=>{
    const b = document.getElementById(id); if(!b) return;
    b.disabled = !ok; b.style.opacity = ok ? "1" : ".5"; b.style.pointerEvents = ok ? "auto" : "none";
  });
}

(function initWalletUI(){
  const modal = $("#walletModal");
  const list  = $("#wlist");
  const btnConnect = $("#connectBtn");
  const btnClose = $("#wmClose");
  const btnDisconnect = $("#disconnectBtn");

  if(list) list.innerHTML = walletListHTML();

  const savedAddr = localStorage.getItem(CFG.LS_ADDR);
  const savedWal  = localStorage.getItem(CFG.LS_WALLET);
  if(savedAddr && savedWal){ onConnected(savedWal, savedAddr, {silent:true}); }
  else { setBuyButtonsEnabled(false); }

  btnConnect?.addEventListener("click", ()=>{
    const direct = Wallets.metamask.has() ? Wallets.metamask : (Wallets.phantom.has() ? Wallets.phantom : null);
    if(direct){ connectFlow(direct.key); }
    else{ modal?.classList.add("show"); modal?.removeAttribute("hidden"); }
  });

  list?.addEventListener("click",(e)=>{ const b=e.target.closest(".wbtn"); if(!b) return; connectFlow(b.dataset.key); });

  btnClose?.addEventListener("click", ()=>{ modal?.classList.remove("show"); modal?.setAttribute("hidden",""); });
  modal?.addEventListener("click",(e)=>{ if(e.target===modal){ modal.classList.remove("show"); modal.setAttribute("hidden",""); } });

  btnDisconnect?.addEventListener("click", ()=>{ CURRENT={addr:null,wallet:null}; localStorage.removeItem(CFG.LS_ADDR); localStorage.removeItem(CFG.LS_WALLET); $("#connectBtn") && ($("#connectBtn").textContent = I[(localStorage.getItem(CFG.LS_LANG)||"en")].connect || "Connect Wallet"); setBuyButtonsEnabled(false); alert("Disconnected."); });

  // quick buy button
  $("#buyNow")?.addEventListener("click", ()=>{ handleBuy(); });
})();

async function ensurePolygon(provider){
  try{
    const chainId = await provider.request({ method: "eth_chainId" });
    if(chainId?.toLowerCase() === CFG.chainIdHex) return;
    await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CFG.chainIdHex }] });
  }catch(err){
    // attempt add chain
    try{
      await provider.request({ method: "wallet_addEthereumChain", params: [{
        chainId: CFG.chainIdHex, chainName: CFG.chainName, rpcUrls: CFG.rpcUrls,
        nativeCurrency: { name:"MATIC", symbol:"MATIC", decimals:18 },
        blockExplorerUrls: CFG.blockExplorerUrls
      }]});
    }catch(e){ console.error("Chain switch/add failed",e); throw e; }
  }
}

async function connectFlow(key){
  const impl = Wallets[key]; if(!impl) return;
  const provider = impl.provider();
  const modal = $("#walletModal");

  if(provider){
    try{
      await ensurePolygon(provider);
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      const addr = accounts[0];
      onConnected(key, addr);
      modal?.classList.remove("show"); modal?.setAttribute("hidden","");

      // listeners
      provider.on && provider.on("accountsChanged", (accs)=>{ if(accs.length===0){ CURRENT={addr:null,wallet:null}; localStorage.removeItem(CFG.LS_ADDR); localStorage.removeItem(CFG.LS_WALLET); $("#connectBtn").textContent = I[(localStorage.getItem(CFG.LS_LANG)||"en")].connect; setBuyButtonsEnabled(false); } else { onConnected(key, accs[0], {silent:true}); }});
      provider.on && provider.on("chainChanged", (chainId)=>{ if(chainId.toLowerCase() !== CFG.chainIdHex) { ensurePolygon(provider).catch(()=>{}); } });

    }catch(e){
      console.error(e);
      alert("Wallet connection rejected or failed. Check provider / chain.");
    }
    return;
  }

  // mobile & provider not present - open wallet deeplink (metamask mobile)
  const deeplink = "https://metamask.app.link/dapp/"+location.host+location.pathname;
  window.open(deeplink, "_blank");
}

function onConnected(key, addr, opts={}){
  CURRENT = { addr, wallet:key };
  localStorage.setItem(CFG.LS_ADDR, addr);
  localStorage.setItem(CFG.LS_WALLET, key);
  $("#connectBtn") && ($("#connectBtn").textContent = `${addr.slice(0,6)}...${addr.slice(-4)}`);
  $("#disconnectBtn") && ($("#disconnectBtn").style.display = "inline-flex");
  setBuyButtonsEnabled(true);
  if(!opts.silent) console.log("Connected:", key, addr);
}

/* =========================
   BUY handler
   - supports MATIC native or USDT ERC20 transfer on Polygon
   - minimal: sends transaction via eth_sendTransaction
   - NOTE: for production, use backend invoice + signature flow
========================= */
async function handleBuy(){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  if(qty<=0) return alert("Enter a valid ZUZU amount.");
  if(!CURRENT.addr) return alert("Connect wallet first.");

  // determine active segment based on presale timeline
  const launch = Date.parse(CFG.launchAtISO);
  const presaleStart = launch - (60*24*3600*1000);
  const now = Date.now();
  if(now < presaleStart || now > launch) return alert("Presale is not active now.");
  const elapsed = now - presaleStart;
  const segIndex = Math.min(3, Math.floor(elapsed / (15*24*3600*1000)));
  const price = CFG.weekPrices[segIndex];
  const usdtCost = qty * price;
  const payWith = $("#payWith")?.value || "USDT";

  const provider = Wallets[CURRENT.wallet]?.provider?.();
  if(!provider) return alert("Provider not found. Connect again.");

  await ensurePolygon(provider);

  if(payWith === "MATIC"){
    // For demo: convert USDT cost to MATIC via fixed rate? (here we assume 1 USDT = 1 MATIC for simplicity)
    const maticAmount = usdtCost; // **WARNING**: replace with real conversion in production
    const valueHex = toHex(Math.round(maticAmount * 1e18));
    try{
      await provider.request({ method: "eth_sendTransaction", params: [{ from: CURRENT.addr, to: CFG.treasury, value: valueHex }]});
      alert("MATIC payment sent. Thanks!");
    }catch(e){ console.error(e); alert("Payment failed."); }
    return;
  }

  // USDT transfer (6 decimals)
  const amount = BigInt(Math.round(usdtCost * 1e6)); // USDT 6 decimals
  const data = "0xa9059cbb" + padAddr(CFG.treasury) + amount.toString(16).padStart(64,"0");

  try{
    await provider.request({ method: "eth_sendTransaction", params: [{ from: CURRENT.addr, to: CFG.usdt, data, value: "0x0" }]});
    alert("USDT payment sent. Thank you!");
  }catch(e){ console.error(e); alert("USDT payment failed."); }
}

/* =========================
   small UI tweaks
========================= */
(function smallInits(){
  // ticker nudge
  const t=$("#exTrack"); if(t){ t.style.transform="translateX(0)"; setTimeout(()=>t.style.transform="",60); }

  // show stored contract addresses if provided (placeholder)
  $("#addrZuzu") && ($("#addrZuzu").textContent = localStorage.getItem("zuzu_token_addr") || "0x... (set your token)");
})();
