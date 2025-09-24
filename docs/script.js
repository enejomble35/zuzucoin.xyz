/* ========================= CONFIG (Polygon + EVM) ========================= */
const CONFIG = {
  // Polygon mainnet
  chainIdHex: "0x89", // 137
  chainName: "Polygon Mainnet",
  rpcUrls: ["https://polygon-rpc.com", "https://rpc.ankr.com/polygon"],
  blockExplorerUrls: ["https://polygonscan.com"],

  // Tokens & treasury
  USDT_POLYGON: "0xC2132D05D31c914a87C6611C10748AEB04B58e8F", // 6 decimals
  ZUZU_TOKEN:   "0xfEe7dd881255EE85b7D6FeAF778e10988486AFc2",
  PRESALE_TREASURY: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3",

  // Optional: 0x swap API (Polygon)
  ZEROX_BASE: "https://polygon.api.0x.org",

  // Countdown
  launchKey: "zuzu_launchAt",
  launchKeyVersion: "poly-v1",
  defaultCountdownDays: 60,

  // Presale prices (USDT)
  weekPrices: [0.0045, 0.0060, 0.0075, 0.0090],

  // LS keys
  LS_ADDR: "zuzu_connected_addr",
  LS_WALLET: "zuzu_connected_wallet",
  LS_LANG: "zuzu_lang"
};

/* ========================= i18n (same as before) ========================= */
const I = {
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",hero_lead:"Stake et ve **ZUZU Maskot NFT** kazan. Sınırlı arz, yüksek **utility**.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! **Sınırlı tahsis**, topluluğa özel fiyat.",
      amount:"Miktar (ZUZU)",cost:"Maliyet:",buy:"Satın Al",exchanges:"Desteklenen Borsalar",
      stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, **APY + NFT BOOST** ile kazan.",
      token_title:"Tokonomi (Görsel)",road_title:"Yol Haritası"},
  en:{connect:"Connect Wallet"} // (diğer diller mevcut koddan kısaltıldı)
};

/* helpers */
const $  = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];

/* Lang (kısaltılmış) */
function applyLang(lang){
  localStorage.setItem(CONFIG.LS_LANG, lang);
  $("#langCode") && ($("#langCode").textContent = lang.toUpperCase());
  $("#langFlag") && ($("#langFlag").src = `flags/${lang}.png`);
  $$("[data-i]").forEach(el=>{
    const k=el.getAttribute("data-i");
    if(I[lang] && I[lang][k]) el.innerHTML = I[lang][k];
  });
}
(function initLang(){
  const saved = localStorage.getItem(CONFIG.LS_LANG) || "tr";
  applyLang(saved);
  const langBtn=$("#langBtn"), langMenu=$("#langMenu");
  if(langBtn && langMenu){
    langBtn.addEventListener("click", (e)=>{ e.stopPropagation(); langMenu.classList.toggle("show"); });
    $$(".lang-opt").forEach(b=>b.addEventListener("click", (e)=>{
      e.stopPropagation(); applyLang(b.dataset.lang); langMenu.classList.remove("show");
    }));
    document.addEventListener("click", (e)=>{
      if(!langMenu?.contains(e.target) && e.target!==langBtn) langMenu?.classList.remove("show");
    });
  }
})();

/* ========================= Countdown (+60 gün) ========================= */
function storageKey(){ return `${CONFIG.launchKey}:${CONFIG.launchKeyVersion}`; }
function ensureFutureTs(ts){
  const now = Date.now();
  const minTarget = now + CONFIG.defaultCountdownDays*24*3600*1000;
  if(!ts || isNaN(ts) || ts < now) return minTarget;
  return ts;
}
function getLaunchAt(){
  const url = new URL(location.href);
  let raw = localStorage.getItem(storageKey());
  if(url.searchParams.get("resetcd")==="1") raw = null;
  let ts = raw ? parseInt(raw,10) : NaN;
  ts = ensureFutureTs(ts);
  localStorage.setItem(storageKey(), ts.toString());
  return ts;
}
function tick(){
  const left = Math.max(0, getLaunchAt() - Date.now());
  const d=Math.floor(left/86400000);
  const h=Math.floor((left%86400000)/3600000);
  const m=Math.floor((left%3600000)/60000);
  const s=Math.floor((left%60000)/1000);
  const pad=n=>n.toString().padStart(2,"0");
  $("#cdDays")  && ($("#cdDays").textContent  = pad(d));
  $("#cdHours") && ($("#cdHours").textContent = pad(h));
  $("#cdMins")  && ($("#cdMins").textContent  = pad(m));
  $("#cdSecs")  && ($("#cdSecs").textContent  = pad(s));
}
tick(); setInterval(tick,1000);

/* ========================= Fiyat/maliyet ========================= */
function updateCosts(){
  const inp = $("#buyAmount");
  const qty = parseFloat((inp?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  CONFIG.weekPrices.forEach((p,i)=>{
    $("#p"+i) && ($("#p"+i).textContent = p.toFixed(4));
    $("#c"+i) && ($("#c"+i).textContent = (qty*p).toLocaleString(undefined,{maximumFractionDigits:2}));
  });
}
$("#buyAmount")?.addEventListener("input", updateCosts);
updateCosts();

/* ========================= NFT grid (örnek) ========================= */
(function renderNFTs(){
  const g=$("#nftGrid"); if(!g) return;
  g.innerHTML = Array.from({length:10}).map((_,i)=>`
    <div class="nft">
      <img src="assets/images/mask/${i}.png" alt="ZUZU #${i+1}" loading="lazy"
           onerror="this.style.display='none'">
      <div class="meta"><b>ZUZU #${i+1}</b><span class="tag">${i%5===0?'Legendary':(i%2?'Rare':'Epic')}</span></div>
    </div>`).join("");
})();

/* ========================= Referans link ========================= */
(function refLink(){
  const url = new URL(location.href);
  if(url.searchParams.get("ref")) localStorage.setItem("zuzu_refAddr", url.searchParams.get("ref"));
  const addr = localStorage.getItem("zuzu_refAddr") || "";
  const out = $("#refLink");
  const copyBtn = $("#copyRef");
  if(out){ out.value = `${location.origin}${location.pathname}?ref=${addr||"YOURCODE"}`; }
  copyBtn?.addEventListener("click", ()=>{
    navigator.clipboard.writeText(out.value); alert("Copied!");
  });
})();

/* ========================= Wallets (EVM: MetaMask + Phantom) ========================= */
const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent||"");

function pickEvmProvider(){
  const eth = window.ethereum;
  if(!eth) return null;
  const providers = eth.providers || [];
  if(providers.length){
    const phantom = providers.find(p=>p.isPhantom);
    if(phantom) return phantom;
    const metamask = providers.find(p=>p.isMetaMask);
    if(metamask) return metamask;
    return providers[0];
  }
  return eth;
}

function walletListHTML(){
  return `
    <button class="wbtn" data-key="metamask"><img src="assets/images/wallets/metamask.png" alt="MetaMask" width="22" height="22"><span>MetaMask</span></button>
    <button class="wbtn" data-key="phantom"><img src="assets/images/wallets/phantom.png" alt="Phantom" width="22" height="22"><span>Phantom</span></button>
  `;
}

let CURRENT_ADDRESS = null;
let CURRENT_PROVIDER = null;

(function initWalletUI(){
  const modal = $("#walletModal");
  const list  = $("#wlist");
  const btnConnect = $("#connectBtn");
  const btnClose = $("#wmClose");
  const btnDisconnect = $("#disconnectBtn");

  if(list) list.innerHTML = walletListHTML();

  // önceki oturum
  const savedAddr = localStorage.getItem(CONFIG.LS_ADDR);
  if(savedAddr){ onConnected(savedAddr, {silent:true}); } else { setBuyButtonsEnabled(false); }

  // connect
  btnConnect?.addEventListener("click", async ()=>{
    const provider = pickEvmProvider();
    if(provider){
      try{
        await ensurePolygon(provider);
        const accounts = await provider.request({ method:'eth_requestAccounts' });
        const addr = accounts?.[0];
        if(!addr) throw new Error("No account");
        CURRENT_PROVIDER = provider;
        onConnected(addr);
      }catch(e){
        console.error(e); alert("Wallet connection failed or rejected.");
      }
    } else {
      modal?.classList.add("show"); modal?.removeAttribute("hidden");
    }
  });

  // list click (fallback)
  list?.addEventListener("click", async ()=>{
    const provider = pickEvmProvider();
    if(!provider){ alert("EVM cüzdanı bulunamadı. MetaMask/Phantom ile aç."); return; }
    try{
      await ensurePolygon(provider);
      const accounts = await provider.request({ method:'eth_requestAccounts' });
      const addr = accounts?.[0];
      if(!addr) throw new Error("No account");
      CURRENT_PROVIDER = provider;
      onConnected(addr);
      modal?.classList.remove("show"); modal?.setAttribute("hidden","");
    }catch(e){
      console.error(e); alert("Wallet connection failed or rejected.");
    }
  });

  // close / backdrop
  btnClose?.addEventListener("click", ()=>{ modal?.classList.remove("show"); modal?.setAttribute("hidden",""); });
  modal?.addEventListener("click", (e)=>{ if(e.target===modal){ modal.classList.remove("show"); modal.setAttribute("hidden",""); } });

  // disconnect
  btnDisconnect?.addEventListener("click", async ()=>{
    CURRENT_ADDRESS=null; CURRENT_PROVIDER=null;
    localStorage.removeItem(CONFIG.LS_ADDR);
    $("#connectBtn") && ($("#connectBtn").textContent = I[(localStorage.getItem(CONFIG.LS_LANG)||"tr")].connect || "Connect Wallet");
    setBuyButtonsEnabled(false);
    alert("Disconnected.");
  });
})();

async function ensurePolygon(provider){
  try{
    await provider.request({ method:'wallet_switchEthereumChain', params:[{ chainId: CONFIG.chainIdHex }] });
  }catch(err){
    if(err?.code === 4902){
      await provider.request({ method:'wallet_addEthereumChain', params:[{
        chainId: CONFIG.chainIdHex,
        chainName: CONFIG.chainName,
        nativeCurrency: { name:'MATIC', symbol:'MATIC', decimals:18 },
        rpcUrls: CONFIG.rpcUrls,
        blockExplorerUrls: CONFIG.blockExplorerUrls
      }]});
    }else{ throw err; }
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

/* ========================= BUY FLOW ========================= */
function activeWeek(){ return 0; } // İstersen tarih tabanlı hale getiririz.

["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
  const b = $("#"+id); if(!b) return; b.addEventListener("click", ()=>handleBuy(i));
});

function setBuyButtonsEnabled(ok){
  ["buyW0","buyW1","buyW2","buyW3"].forEach(id=>{
    const b = document.getElementById(id); if(!b) return;
    b.disabled = !ok; b.style.opacity = ok ? "1" : ".5"; b.style.pointerEvents = ok ? "auto" : "none";
  });
}

function parseAmountTo6Decimals(num){
  const s = String(num);
  if(!/^[0-9]+(\.[0-9]+)?$/.test(s)) return 0n;
  const [intPart, fracPartRaw=''] = s.split('.');
  const frac = (fracPartRaw + '000000').slice(0,6);
  return BigInt(intPart) * 1000000n + BigInt(frac);
}

function encodeERC20Transfer(to, amountBigInt){
  // transfer(address,uint256)
  const fn = "a9059cbb";
  const addr = to.toLowerCase().replace(/^0x/, '').padStart(64,'0');
  const amt  = amountBigInt.toString(16).padStart(64,'0');
  return "0x" + fn + addr + amt;
}

async function handleBuy(weekIdx){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  if(qty<=0){ alert("Geçerli miktar gir."); return; }
  if(weekIdx!==activeWeek()){ alert("Bu hafta henüz aktif değil."); return; }
  if(!CURRENT_ADDRESS || !CURRENT_PROVIDER){ alert("Önce cüzdan bağla (MetaMask/Phantom)."); return; }

  const price = CONFIG.weekPrices[weekIdx];
  const usdtCost = qty * price;
  const payMethod = $("#payWith")?.value || "USDT_POLYGON";

  try{
    await ensurePolygon(CURRENT_PROVIDER);

    if(payMethod === "USDT_POLYGON"){
      // Doğrudan USDT transfer → Treasury
      const usdtAmount = parseAmountTo6Decimals(usdtCost.toFixed(6));
      if(usdtAmount <= 0n){ alert("Tutar çok küçük."); return; }
      const data = encodeERC20Transfer(CONFIG.PRESALE_TREASURY, usdtAmount);
      const tx = { from: CURRENT_ADDRESS, to: CONFIG.USDT_POLYGON, data, value: "0x0" };
      const txHash = await CURRENT_PROVIDER.request({ method:'eth_sendTransaction', params:[tx] });
      alert(`Payment sent!\nTX: ${txHash}`);
    } else if (payMethod === "MATIC"){
      // MATIC ile öde → 0x ile swap, çıkış USDT doğrudan Treasury'ye
      const buyAmount = parseAmountTo6Decimals(usdtCost.toFixed(6)).toString(); // USDT 6d
      const params = new URLSearchParams({
        buyToken: "USDT",
        sellToken: "MATIC",
        buyAmount,                        // hedef USDT miktarı
        takerAddress: CURRENT_ADDRESS,    // tx gönderen
        recipient: CONFIG.PRESALE_TREASURY, // USDT'nin gideceği adres (hazinede toplanır)
        slippagePercentage: "0.02"        // %2 tolerans
      });
      const url = `${CONFIG.ZEROX_BASE}/swap/v1/quote?${params.toString()}`;
      const quote = await fetch(url).then(r=>r.json());

      if(quote?.to && quote?.data){
        const tx = {
          from: CURRENT_ADDRESS,
          to: quote.to,
          data: quote.data,
          value: quote.value || "0x0", // MATIC miktarı (hex)
          gas: quote.gas,              // bazı cüzdanlar gas'ı kendisi hesaplar, yoksa bu alanı bırakabilirsin
        };
        const txHash = await CURRENT_PROVIDER.request({ method:'eth_sendTransaction', params:[tx] });
        alert(`Swap+Pay sent!\nTX: ${txHash}`);
      }else{
        console.error(quote);
        alert("Swap teklifi alınamadı. Daha sonra tekrar dene.");
      }
    }
    // TODO: backend’e satın alma kaydı ping (opsiyonel)
  }catch(e){
    console.error(e);
    alert("Ödeme reddedildi veya başarısız.");
  }
}

/* ========================= Ticker nudge ========================= */
(function ensureTickerVisible(){
  const t=$("#exTrack"); if(!t) return; t.style.transform="translateX(0)";
  setTimeout(()=>t.style.transform="", 60);
})();
