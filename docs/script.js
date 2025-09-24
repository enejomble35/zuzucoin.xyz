/* ========================= CONFIG (Polygon + EVM) ========================= */
const CONFIG = {
  chainIdHex: "0x89", // Polygon mainnet
  USDT_POLYGON: "0xC2132D05D31c914a87C6611C10748AEB04B58e8F", // resmi USDT (6d) - kontrol et
  ZUZU_TOKEN: "0xfEe7dd881255EE85b7D6FeAF778e10988486AFc2",
  PRESALE_TREASURY: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3", // senin verdiğin adres
  ZEROX_BASE: "https://polygon.api.0x.org",
  launchKey: "zuzu_launchAt",
  launchKeyVersion: "poly-v1",
  defaultCountdownDays: 60,
  weekPrices: [0.0045,0.0060,0.0075,0.0090],
  LS_ADDR: "zuzu_connected_addr",
  LS_LANG: "zuzu_lang"
};

/* ========================= i18n (tam ekliyoruz - TR + EN temel) ========================= */
const I = {
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",hero_lead:"Stake and win **ZUZU Mascot NFT**.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! **Limited allocation**.",
      amount:"Amount (ZUZU)",cost:"Cost:",buy:"Buy",exchanges:"Supported Exchanges",stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn APY + NFT BOOST."},
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Robotic Kirpi 🦔⚡",hero_lead:"Stake et ve ZUZU Maskot NFT kazan.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! Sınırlı tahsis.",
      amount:"Miktar (ZUZU)",cost:"Maliyet:",buy:"Satın Al",exchanges:"Desteklenen Borsalar",stake_title:"Stake Pro — Kilitle, Kazan, NFT ✨",stake_lead:"Kilitle, APY + NFT BOOST al."}
};

/* helpers */
const $ = (q,root=document)=>root.querySelector(q);
const $$ = (q,root=document)=>[...root.querySelectorAll(q)];

/* LANG */
function applyLang(lang){
  localStorage.setItem(CONFIG.LS_LANG, lang);
  $("#langCode") && ($("#langCode").textContent = lang.toUpperCase());
  $("#langFlag") && ($("#langFlag").src = `flags/${lang}.png`);
  $$("[data-i]").forEach(el=>{
    const k = el.getAttribute("data-i");
    if(I[lang] && I[lang][k]) el.innerHTML = I[lang][k];
  });
}
(function initLang(){
  const saved = localStorage.getItem(CONFIG.LS_LANG) || "tr";
  applyLang(saved);
  const langBtn = $("#langBtn"), langMenu = $("#langMenu");
  if(langBtn && langMenu){
    langBtn.addEventListener("click", e=>{ e.stopPropagation(); langMenu.classList.toggle("show"); langMenu.setAttribute("aria-hidden", !langMenu.classList.contains("show")); });
    $$(".lang-opt").forEach(b=>b.addEventListener("click", (e)=>{ e.stopPropagation(); applyLang(b.dataset.lang); langMenu.classList.remove("show"); }));
    document.addEventListener("click", (e)=>{ if(!langMenu.contains(e.target) && e.target !== langBtn) { langMenu.classList.remove("show"); } });
  }
})();

/* ========================= Countdown */
function storageKey(){ return `${CONFIG.launchKey}:${CONFIG.launchKeyVersion}`; }
function ensureFutureTs(ts){ const now=Date.now(); const minTarget = now + CONFIG.defaultCountdownDays*24*3600*1000; if(!ts || isNaN(ts) || ts < now) return minTarget; return ts; }
function getLaunchAt(){ const url=new URL(location.href); let raw=localStorage.getItem(storageKey()); if(url.searchParams.get("resetcd")==="1") raw=null; let ts = raw ? parseInt(raw,10) : NaN; ts = ensureFutureTs(ts); localStorage.setItem(storageKey(), ts.toString()); return ts; }
function tick(){ const left=Math.max(0,getLaunchAt()-Date.now()); const d=Math.floor(left/86400000); const h=Math.floor((left%86400000)/3600000); const m=Math.floor((left%3600000)/60000); const s=Math.floor((left%60000)/1000); const pad=n=>n.toString().padStart(2,"0"); $("#cdDays")&&( $("#cdDays").textContent=pad(d) ); $("#cdHours")&&( $("#cdHours").textContent=pad(h) ); $("#cdMins")&&( $("#cdMins").textContent=pad(m) ); $("#cdSecs")&&( $("#cdSecs").textContent=pad(s) ); }
tick(); setInterval(tick,1000);

/* ========================= Prices & costs */
function updateCosts(){ const inp=$("#buyAmount"); const qty = parseFloat((inp?.value||"0").toString().replace(/[^\d.]/g,""))||0; CONFIG.weekPrices.forEach((p,i)=>{ $("#p"+i)&&($("#p"+i).textContent = p.toFixed(4)); $("#c"+i&&$("#c"+i).textContent=(qty*p).toLocaleString(undefined,{maximumFractionDigits:2}); }); }
$("#buyAmount")?.addEventListener("input", updateCosts);
updateCosts();

/* ========================= NFT render (unchanged) */
(function renderNFTs(){ const g=$("#nftGrid"); if(!g) return; g.innerHTML = Array.from({length:10}).map((_,i)=>`<div class="nft"><img src="assets/images/mask/${i}.png" alt="ZUZU #${i+1}" loading="lazy" onerror="this.style.display='none'"><div class="meta"><b>ZUZU #${i+1}</b><span class="tag">${i%5===0?'Legendary':(i%2?'Rare':'Epic')}</span></div></div>`).join(""); })();

/* ========================= Ref link */
(function refLink(){ const url=new URL(location.href); if(url.searchParams.get("ref")) localStorage.setItem("zuzu_refAddr", url.searchParams.get("ref")); const addr = localStorage.getItem("zuzu_refAddr") || ""; const out = $("#refLink"); if(out){ out.value = `${location.origin}${location.pathname}?ref=${addr||"YOURCODE"}`; } $("#copyRef")?.addEventListener("click", ()=>{ navigator.clipboard.writeText(out.value); alert("Copied!"); }); })();

/* ========================= Wallet handling (EVM robust) */
const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent||"");
let CURRENT_ADDRESS = null;
let CURRENT_PROVIDER = null;

function pickEvmProvider(){
  if(window.ethereum){
    // If multiple providers injected (MetaMask + Phantom), prefer MetaMask first then Phantom
    const p = window.ethereum;
    if(p.providers && Array.isArray(p.providers)){
      const mm = p.providers.find(x=>x.isMetaMask);
      if(mm) return mm;
      const ph = p.providers.find(x=>x.isPhantom);
      if(ph) return ph;
      return p.providers[0];
    }
    return p;
  }
  return null;
}

function walletListHTML(){
  return `
    <button class="wbtn" data-key="metamask"><img src="assets/images/wallets/metamask.png" alt="MetaMask" width="22" height="22" onerror="fallbackImg(this)"><span>MetaMask</span></button>
    <button class="wbtn" data-key="phantom"><img src="assets/images/wallets/phantom.png" alt="Phantom" width="22" height="22" onerror="fallbackImg(this)"><span>Phantom</span></button>
  `;
}

function setBuyButtonsEnabled(ok){
  ["buyW0","buyW1","buyW2","buyW3"].forEach(id=>{
    const b=document.getElementById(id); if(!b) return; b.disabled = !ok; b.style.opacity = ok ? "1":".5";
    b.style.pointerEvents = ok ? "auto":"none";
  });
}

(function initWalletUI(){
  const modal = $("#walletModal");
  const list = $("#wlist");
  const btnConnect = $("#connectBtn");
  const btnClose = $("#wmClose");
  const btnDisconnect = $("#disconnectBtn");

  if(list) list.innerHTML = walletListHTML();

  const savedAddr = localStorage.getItem(CONFIG.LS_ADDR);
  if(savedAddr){ onConnected(savedAddr, {silent:true}); } else { setBuyButtonsEnabled(false); }

  btnConnect?.addEventListener("click", async ()=>{
    const provider = pickEvmProvider();
    if(provider && !IS_MOBILE){
      try{
        await ensurePolygon(provider);
        const accounts = await provider.request({ method:'eth_requestAccounts' });
        const addr = accounts?.[0];
        if(!addr) throw new Error("No account");
        CURRENT_PROVIDER = provider;
        onConnected(addr);
        modal?.classList.remove("show"); modal?.setAttribute("hidden","");
        return;
      }catch(e){ console.warn(e); alert("Cüzdan bağlantısı reddedildi veya hata."); return; }
    }
    // Mobil veya provider yok -> modal + deeplink öner
    modal?.classList.add("show"); modal?.removeAttribute("hidden");
  });

  list?.addEventListener("click", async (e)=>{
    const btn = e.target.closest(".wbtn"); if(!btn) return;
    const key = btn.dataset.key;
    if(!IS_MOBILE){
      const provider = pickEvmProvider();
      if(!provider){ alert("Tarayıcıda EVM cüzdanı yok. MetaMask/Phantom içinde aç."); return; }
      try{ await ensurePolygon(provider); const acc = await provider.request({ method:'eth_requestAccounts' }); onConnected(acc[0]); modal?.classList.remove("show"); modal?.setAttribute("hidden",""); }catch(e){ console.warn(e); alert("Bağlantı hatası."); }
    } else {
      // mobil deeplink
      openMobileDeepLink(key);
    }
  });

  btnClose?.addEventListener("click", ()=>{ modal?.classList.remove("show"); modal?.setAttribute("hidden",""); });
  modal?.addEventListener("click", (e)=>{ if(e.target===modal) { modal.classList.remove("show"); modal.setAttribute("hidden",""); } });

  btnDisconnect?.addEventListener("click", ()=>{ CURRENT_ADDRESS=null; CURRENT_PROVIDER=null; localStorage.removeItem(CONFIG.LS_ADDR); $("#connectBtn")&&($("#connectBtn").textContent=I[(localStorage.getItem(CONFIG.LS_LANG)||"tr")].connect||"Connect Wallet"); setBuyButtonsEnabled(false); alert("Disconnected."); });
})();

async function ensurePolygon(provider){
  try{
    await provider.request({ method:'wallet_switchEthereumChain', params:[{ chainId: CONFIG.chainIdHex }] });
  }catch(err){
    if(err && (err.code === 4902 || err.message?.includes("Unrecognized chain"))){
      await provider.request({ method:'wallet_addEthereumChain', params:[{
        chainId: CONFIG.chainIdHex,
        chainName: "Polygon Mainnet",
        nativeCurrency: { name:"MATIC", symbol:"MATIC", decimals:18 },
        rpcUrls: ["https://polygon-rpc.com"],
        blockExplorerUrls: ["https://polygonscan.com"]
      }]});
    } else {
      throw err;
    }
  }
}

function onConnected(addr, opts={}){
  CURRENT_ADDRESS = addr;
  localStorage.setItem(CONFIG.LS_ADDR, addr);
  $("#connectBtn") && ($("#connectBtn").textContent = `${addr.slice(0,6)}...${addr.slice(-4)}`);
  $("#disconnectBtn") && ($("#disconnectBtn").style.display = "inline-flex");
  setBuyButtonsEnabled(true);
  if(!opts.silent) console.log("Connected:", addr);
}

/* Mobile deeplink helper */
function openMobileDeepLink(key){
  const nowUrl = encodeURIComponent(location.href);
  if(key === "metamask"){
    // MetaMask Mobile universal link
    const url = `https://metamask.app.link/dapp/${location.host}${location.pathname}`;
    window.open(url, "_blank");
  } else if(key === "phantom"){
    // Phantom deep link (opens in Phantom browser)
    const url = `https://phantom.app/ul/browse/${location.origin + location.pathname}`;
    window.open(url, "_blank");
  } else {
    alert("Cüzdan için destek yok.");
  }
}

/* ========================= BUY flow (USDT / MATIC via 0x) */
function activeWeek(){ return 0; } // istersen tarih tabanlı yapılır
["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{ const btn = document.getElementById(id); if(!btn) return; btn.addEventListener("click", ()=>handleBuy(i)); });

function parseAmountTo6Decimals(numStr){
  const s = String(numStr);
  if(!/^[0-9]+(\.[0-9]+)?$/.test(s)) return 0n;
  const [intPart, frac=''] = s.split('.');
  const fracPad = (frac + '000000').slice(0,6);
  return BigInt(intPart) * 1000000n + BigInt(fracPad);
}

function encodeERC20Transfer(to, amountBigInt){
  const fn = "a9059cbb";
  const addr = to.toLowerCase().replace(/^0x/,"").padStart(64,"0");
  const amt = amountBigInt.toString(16).padStart(64,"0");
  return "0x" + fn + addr + amt;
}

async function handleBuy(weekIdx){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  if(qty <= 0){ alert("Geçerli miktar gir."); return; }
  if(weekIdx !== activeWeek()){ alert("Bu hafta aktif değil."); return; }
  if(!CURRENT_ADDRESS){ alert("Önce cüzdan bağla."); return; }

  const price = CONFIG.weekPrices[weekIdx];
  const usdtCost = (qty * price).toFixed(6);
  const payWith = $("#payWith")?.value || "USDT_POLYGON";

  try{
    const provider = pickEvmProvider();
    if(!provider){ alert("EVM cüzdanı bulunamadı. MetaMask/Phantom içinde aç."); return; }
    await ensurePolygon(provider);

    if(payWith === "USDT_POLYGON"){
      const amt = parseAmountTo6Decimals(usdtCost);
      if(amt <= 0n){ alert("Tutar çok küçük."); return; }
      const data = encodeERC20Transfer(CONFIG.PRESALE_TREASURY, amt);
      const tx = { from: CURRENT_ADDRESS, to: CONFIG.USDT_POLYGON, data, value: "0x0" };
      const txHash = await provider.request({ method:'eth_sendTransaction', params:[tx] });
      alert(`Ödeme gönderildi!\nTX: ${txHash}`);
    } else if(payWith === "MATIC"){
      // 0x quote al -> kullanıcı onayı ile gönder
      const buyAmount = parseAmountTo6Decimals(usdtCost).toString(); // USDT 6d
      const qs = new URLSearchParams({
        buyToken: "USDT",
        sellToken: "MATIC",
        buyAmount,
        takerAddress: CURRENT_ADDRESS,
        recipient: CONFIG.PRESALE_TREASURY,
        slippagePercentage: "0.02"
      });
      const url = `${CONFIG.ZEROX_BASE}/swap/v1/quote?${qs.toString()}`;
      const quote = await fetch(url).then(r=>r.json());
      if(quote?.to && quote?.data){
        const tx = { from: CURRENT_ADDRESS, to: quote.to, data: quote.data, value: quote.value || "0x0" };
        const txHash = await provider.request({ method:'eth_sendTransaction', params:[tx] });
        alert(`Swap+Pay gönderildi!\nTX: ${txHash}`);
      } else {
        console.error("Quote hatası:", quote);
        alert("Swap teklifi alınamadı.");
      }
    }
    // opsiyonel: backend kaydı ekleyebilirsin burada (fetch to backend)
  }catch(e){
    console.error(e);
    alert("Ödeme reddedildi veya hata oldu.");
  }
}

/* small UI niceties */
(function ensureTickerVisible(){ const t=$("#exTrack"); if(!t) return; t.style.transform="translateX(0)"; setTimeout(()=>t.style.transform="",60); })();

/* fallbackImg global (index.html'de de tanımlı ama double-safe) */
function fallbackImg(img){
  try{
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><rect rx='6' width='100%' height='100%' fill='#7f9cff'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='12' fill='white'>Z</text></svg>`;
    img.onerror = null;
    img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }catch(e){ img.style.display='none'; }
}
