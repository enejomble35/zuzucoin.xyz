/* ====== QUICK FIX: image fallback + daha sağlam EVM wallet detect/connect ====== */

/* helpers */
const $ = (q,root=document)=>root.querySelector(q);
const $$ = (q,root=document)=>[...root.querySelectorAll(q)];

/* 1) Img fallback: eğer img 404 olursa inline SVG / harf göster */
function ensureImgFallback(selector, fallbackHTML){
  $$(selector).forEach(img=>{
    if(!img) return;
    // if already replaced skip
    if(img.dataset.fallbackApplied) return;
    img.onerror = function(){
      try{
        const wrapper = document.createElement('span');
        wrapper.className = 'zph'; // style already inlined in index.html
        wrapper.innerHTML = fallbackHTML;
        img.replaceWith(wrapper);
      }catch(e){ console.warn('fallback failed', e); }
    };
    // also check quickly if image is broken already (cached 404)
    setTimeout(()=>{ if(img.naturalWidth === 0){ img.onerror(); img.dataset.fallbackApplied = "1"; } }, 300);
  });
}

/* specify selectors and fallback content (can be single-letter or small svg) */
ensureImgFallback('img#brandLogo', '<strong style="font-size:16px">Z</strong>');
ensureImgFallback('.z-sbtn img[alt="X"], .z-chip img[alt="X"]', '<svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M21 3L7 17l-4 1 1-4L17 3z"/></svg>');
ensureImgFallback('.z-sbtn img[alt="Telegram"], img[alt="Telegram"]', '<svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M2 12l7-2 3 2 6-7-16 17z"/></svg>');
ensureImgFallback('.wbtn img[alt="MetaMask"]', '<span style="font-weight:800">MM</span>');
ensureImgFallback('.wbtn img[alt="Phantom"]', '<span style="font-weight:800">P</span>');
ensureImgFallback('.logo-big', '<div style="width:220px;height:220px;display:flex;align-items:center;justify-content:center;">Z</div>');
/* Additional generic fallback for any other missing image */
ensureImgFallback('img', '<span style="font-weight:700">?</span>');

/* 2) Daha sağlam EVM provider pick ve connect (MetaMask + Phantom EVM fallback + mobile deeplink) */
function pickEvmProvider(){
  // prefer injected providers, handle multiple-provider injection
  if(window.ethereum){
    if(Array.isArray(window.ethereum.providers)){
      // MetaMask + other wallets
      const mm = window.ethereum.providers.find(p=>p.isMetaMask);
      const ph = window.ethereum.providers.find(p=>p.isPhantom);
      return mm || ph || window.ethereum.providers[0];
    }
    return window.ethereum;
  }
  // Phantom has separate global (older solana). EVM Phantom might also inject as window.phantom?.ethereum
  if(window.phantom && window.phantom.ethereum) return window.phantom.ethereum;
  return null;
}

/* Switch to polygon network (tries switch, otherwise tries add) */
async function ensurePolygon(provider){
  const chainHex = '0x89';
  try{
    await provider.request({ method: 'wallet_switchEthereumChain', params:[{ chainId: chainHex }] });
    return;
  }catch(e){
    try{
      await provider.request({ method:'wallet_addEthereumChain', params:[{
        chainId: chainHex,
        chainName: 'Polygon Mainnet',
        nativeCurrency:{name:'MATIC', symbol:'MATIC', decimals:18},
        rpcUrls:['https://polygon-rpc.com'],
        blockExplorerUrls:['https://polygonscan.com']
      }]});
      return;
    }catch(err){
      console.warn('could not switch/add polygon', err);
      throw err;
    }
  }
}

/* Improved connect flow - attach to your connect button */
async function improvedConnectFlow(){
  const btn = $('#connectBtn');
  const modal = $('#walletModal');
  const provider = pickEvmProvider();

  if(provider && !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent||"")){
    // desktop direct connect
    try{
      await ensurePolygon(provider);
      const accs = await provider.request({ method: 'eth_requestAccounts' });
      const addr = accs && accs[0];
      if(addr){
        localStorage.setItem('zuzu_connected_addr', addr);
        btn.textContent = `${addr.slice(0,6)}...${addr.slice(-4)}`;
        document.dispatchEvent(new CustomEvent('zuzu:connected',{detail:{addr}}));
        // enable buy buttons etc. (your existing onConnected handler can be used)
      } else {
        alert('No accounts returned by wallet.');
      }
    }catch(err){
      console.error('connect failed', err);
      alert('Wallet connection failed. Tarayıcıda MetaMask/Phantom açık mı?');
    }
    return;
  }

  // mobile or no provider: open modal so user can deeplink
  if(modal){
    modal.classList.add('show'); modal.removeAttribute('hidden');
  }
}

/* wire up connect button quickly (safe - doesn't override existing complex flow) */
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', ()=>{ $('#connectBtn')?.addEventListener('click', improvedConnectFlow); });
}else{
  $('#connectBtn')?.addEventListener('click', improvedConnectFlow);
}

/* 3) console diagnostics:  show missing assets 404s (monitor) */
window.addEventListener('error', function(e){
  try{
    if(e.target && e.target.tagName === 'IMG'){
      console.warn('Image load error (fallback applied):', e.target.src);
    } else {
      console.error('JS error', e.error || e.message || e);
    }
  }catch(_){}
}, true);

/* end of quick-fix block */

/* ========================= CONFIG (Polygon + EVM) ========================= */
const CONFIG = {
  chainIdHex: "0x89", // Polygon mainnet
  USDT_POLYGON: "0xC2132D05D31c914a87C6611C10748AEB04B58e8F", // 6 decimals (example)
  PRESALE_TREASURY: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3", // senin adres
  ZEROX_BASE: "https://polygon.api.0x.org", // 0x swap API (public)
  launchKey: "zuzu_launchAt",
  launchKeyVersion: "v2",
  defaultCountdownDays: 60,
  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100],
  LS_ADDR: "zuzu_connected_addr",
  LS_LANG: "zuzu_lang"
};

/* ========================= i18n (EN/TR/FR/PT/RU/ES) ========================= */
/* (Aynı I nesnesini index.html'deki data-i ile eşleştiriyor; eski I'yi buraya kopyaladım) */
const I = {
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",hero_lead:"Stake and win **ZUZU Maskot NFT**. Limited supply, high **utility**.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! **Limited allocation**, community price.",
      amount:"Amount (ZUZU)",cost:"Cost:",buy:"Buy",exchanges:"Supported Exchanges",
      stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn **APY + NFT BOOST**.",
      token_title:"Tokenomics (Visualized)",road_title:"Roadmap"},
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",hero_lead:"Stake et ve **ZUZU Maskot NFT** kazan. Sınırlı arz, yüksek **utility**.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! **Sınırlı tahsis**, topluluğa özel fiyat.",
      amount:"Miktar (ZUZU)",cost:"Maliyet:",buy:"Satın Al",exchanges:"Desteklenen Borsalar",
      stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, **APY + NFT BOOST** ile kazan.",
      token_title:"Tokonomi (Görsel)",road_title:"Yol Haritası"},
  fr:{nav_presale:"Pré-vente",nav_stake:"Stake",nav_nft:"Récompenses NFT",nav_roadmap:"Feuille de route",nav_token:"Tokenomics",connect:"Connecter le Wallet",
      hero_badge:"Pré-vente • Stake pour gagner un NFT",hero_title:"ZUZU — Hérisson Robotique 🦔⚡",hero_lead:"Stake et gagne un **NFT Mascotte ZUZU**.",
      cta_stake:"Commencer le Stake",cta_nft:"Récompenses NFT",days:"JOURS",hours:"HEURES",mins:"MINUTES",secs:"SECONDES",
      presale_title:"Pré-vente — Compte à rebours",presale_lead:"Prépare-toi pour la pré-vente ZUZU ! **Allocation limitée**."},
  pt:{nav_presale:"Pré-venda",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Roteiro",nav_token:"Tokenomics",connect:"Conectar Carteira",
      hero_badge:"Pré-venda • Stake para ganhar NFT",hero_title:"ZUZU — Ouriço Robótico 🦔⚡",hero_lead:"Faça stake e ganhe **NFT Mascote ZUZU**.",
      cta_stake:"Começar Stake",cta_nft:"Recompensas NFT",days:"DIAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",
      presale_title:"Pré-venda — Contagem regressiva",presale_lead:"Prepare-se para a pré-venda ZUZU! **Alocação limitada**."},
  ru:{nav_presale:"Предпродажа",nav_stake:"Стейкинг",nav_nft:"NFT награды",nav_roadmap:"Дорожная карта",nav_token:"Токеномика",connect:"Подключить кошелёк",
      hero_badge:"Предпродажа • Стейкинг для NFT",hero_title:"ЗУЗУ — Робо-Ёж 🦔⚡",hero_lead:"Стейкай и получай **маскот NFT ZUZU**."},
  es:{nav_presale:"Pre-venta",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Hoja de ruta",nav_token:"Tokenomics",connect:"Conectar Billetera",
      hero_badge:"Pre-venta • Stake para ganar NFT",hero_title:"ZUZU — Erizo Robótico 🦔⚡",hero_lead:"Haz stake y gana **NFT Mascota ZUZU**."}
};

/* helpers */
const $  = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];

/* Lang handling */
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
  const saved = localStorage.getItem(CONFIG.LS_LANG) || "en";
  applyLang(saved);
  const langBtn = $("#langBtn"), langMenu = $("#langMenu");
  if(langBtn && langMenu){
    langBtn.addEventListener("click", (e)=>{ e.stopPropagation(); langMenu.hidden = !langMenu.hidden; });
    $$(".lang-opt").forEach(b=>b.addEventListener("click", (e)=>{ e.stopPropagation(); applyLang(b.dataset.lang); langMenu.hidden = true; }));
    document.addEventListener("click", (e)=>{ if(!langMenu?.contains(e.target) && e.target!==langBtn) langMenu.hidden = true; });
  }
})();

/* ========================= Countdown (60 gün) ========================= */
function storageKey(){ return `${CONFIG.launchKey}:${CONFIG.launchKeyVersion}`; }
function ensureFutureTs(ts){ const now = Date.now(); const minTarget = now + CONFIG.defaultCountdownDays*24*3600*1000; if(!ts || isNaN(ts) || ts < now) return minTarget; return ts; }
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
  const d=Math.floor(left/86400000), h=Math.floor((left%86400000)/3600000), m=Math.floor((left%3600000)/60000), s=Math.floor((left%60000)/1000);
  const pad = n=>n.toString().padStart(2,"0");
  $("#cdDays") && ($("#cdDays").textContent = pad(d));
  $("#cdHours") && ($("#cdHours").textContent = pad(h));
  $("#cdMins") && ($("#cdMins").textContent = pad(m));
  $("#cdSecs") && ($("#cdSecs").textContent = pad(s));
}
tick(); setInterval(tick,1000);

/* ========================= Price & cost display ========================= */
function updateCosts(){
  const inp = $("#buyAmount");
  const qty = parseFloat((inp?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  CONFIG.weekPrices.forEach((p,i)=>{
    $("#p"+i) && ($("#p"+i).textContent = p.toFixed(4));
    $("#c"+i) && ($("#c"+i).textContent = (qty*p).toLocaleString(undefined,{maximumFractionDigits:6}));
  });
}
$("#buyAmount")?.addEventListener("input", updateCosts);
updateCosts();

/* ========================= NFT grid render ========================= */
(function renderNFTs(){
  const g=$("#nftGrid"); if(!g) return;
  // render 12 örnek NFT; resimler yoksa kart gösterilecek
  const n = 12;
  g.innerHTML = Array.from({length:n}).map((_,i)=>`
    <div class="nft">
      <img src="assets/images/mask/${i}.png" alt="ZUZU #${i+1}" loading="lazy" onerror="this.style.display='none'">
      <div class="meta"><b>ZUZU #${i+1}</b><span class="tag">${i%5===0?'Legendary':(i%2?'Rare':'Epic')}</span></div>
    </div>`).join("");
})();

/* ========================= Invite link (ref) ========================= */
(function refLink(){
  const url = new URL(location.href);
  if(url.searchParams.get("ref")) localStorage.setItem("zuzu_refAddr", url.searchParams.get("ref"));
  const addr = localStorage.getItem("zuzu_refAddr") || "";
  const out = $("#refLink"); const copyBtn = $("#copyRef");
  if(out) out.value = `${location.origin}${location.pathname}?ref=${addr||"YOURCODE"}`;
  copyBtn?.addEventListener("click", ()=>{ navigator.clipboard.writeText(out.value); alert("Copied!"); });
})();

/* ========================= Wallet integration (MetaMask + Phantom EVM) ========================= */
const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent||"");
let CURRENT_ADDRESS = null, CURRENT_PROVIDER = null;

function pickEvmProvider(){
  if(window.ethereum){
    // modern multi-provider detection
    const p = window.ethereum;
    if(p.providers && Array.isArray(p.providers)){
      const mm = p.providers.find(x=>x.isMetaMask);
      const ph = p.providers.find(x=>x.isPhantom);
      return mm || ph || p.providers[0];
    }
    return p;
  }
  return null;
}

function walletListHTML(){
  return `
    <button class="wbtn" data-key="metamask">
      <img src="assets/images/wallets/metamask.png" alt="MetaMask" onerror="this.outerHTML='<span class=&quot;zph&quot;>MM</span>'">
      <span>MetaMask</span>
    </button>
    <button class="wbtn" data-key="phantom">
      <img src="assets/images/wallets/phantom.png" alt="Phantom" onerror="this.outerHTML='<span class=&quot;zph&quot;>P</span>'">
      <span>Phantom</span>
    </button>`;
}

function setBuyButtonsEnabled(ok){
  ["buyW0","buyW1","buyW2","buyW3"].forEach(id=>{
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

  const savedAddr = localStorage.getItem(CONFIG.LS_ADDR);
  if(savedAddr){ onConnected(savedAddr, {silent:true}); } else { setBuyButtonsEnabled(false); }

  btnConnect?.addEventListener("click", async ()=>{
    const provider = pickEvmProvider();
    if(provider && !IS_MOBILE){
      try{
        await ensurePolygon(provider);
        const accs = await provider.request({ method:"eth_requestAccounts" });
        CURRENT_PROVIDER = provider;
        onConnected(accs[0]);
        modal?.classList.remove("show"); modal?.setAttribute("hidden","");
      }catch(err){ console.warn(err); alert("Wallet connection rejected or failed. Tarayıcıda MetaMask/Phantom yüklü mü kontrol et."); }
      return;
    }
    // mobil veya provider yok -> modal aç
    modal?.classList.add("show"); modal?.removeAttribute("hidden");
  });

  list?.addEventListener("click", async (e)=>{
    const btn = e.target.closest(".wbtn"); if(!btn) return;
    const key = btn.dataset.key;
    if(!IS_MOBILE){
      const provider = pickEvmProvider();
      if(!provider){ alert("EVM cüzdanı bulunamadı. Lütfen MetaMask veya Phantom'ta açın."); return; }
      try{
        await ensurePolygon(provider);
        const acc = await provider.request({ method:'eth_requestAccounts' });
        CURRENT_PROVIDER = provider;
        onConnected(acc[0]);
        modal?.classList.remove("show"); modal?.setAttribute("hidden","");
      }catch(e){ console.warn(e); alert("Bağlantı hatası."); }
    } else {
      // mobil deeplink
      if(key==="metamask"){
        window.open(`https://metamask.app.link/dapp/${location.host}${location.pathname}`,"_blank");
      } else {
        window.open(`https://phantom.app/ul/browse/${location.origin}${location.pathname}`,"_blank");
      }
    }
  });

  btnClose?.addEventListener("click", ()=>{ modal?.classList.remove("show"); modal?.setAttribute("hidden",""); });
  modal?.addEventListener("click", (e)=>{ if(e.target===modal){ modal.classList.remove("show"); modal.setAttribute("hidden",""); } });

  btnDisconnect?.addEventListener("click", ()=>{ CURRENT_ADDRESS=null; CURRENT_PROVIDER=null; localStorage.removeItem(CONFIG.LS_ADDR);
    $("#connectBtn") && ($("#connectBtn").textContent = I[(localStorage.getItem(CONFIG.LS_LANG)||"en")].connect || "Connect Wallet");
    setBuyButtonsEnabled(false); alert("Disconnected."); });
})();

async function ensurePolygon(provider){
  try{
    await provider.request({ method:'wallet_switchEthereumChain', params:[{ chainId: CONFIG.chainIdHex }] });
  }catch(err){
    // chain yoksa ekle
    try{
      await provider.request({ method:'wallet_addEthereumChain', params:[{
        chainId: CONFIG.chainIdHex,
        chainName: "Polygon Mainnet",
        nativeCurrency: { name:"MATIC", symbol:"MATIC", decimals:18 },
        rpcUrls: ["https://polygon-rpc.com"],
        blockExplorerUrls: ["https://polygonscan.com"]
      }]});
    }catch(e){ throw e; }
  }
}

function onConnected(addr, opts={}){
  CURRENT_ADDRESS = addr;
  localStorage.setItem(CONFIG.LS_ADDR, addr);
  $("#connectBtn") && ($("#connectBtn").textContent = `${addr.slice(0,6)}...${addr.slice(-4)}`);
  $("#disconnectBtn") && ($("#disconnectBtn").style.display="inline-flex");
  setBuyButtonsEnabled(true);
  if(!opts.silent) console.log("Connected:", addr);
}

/* ========================= BUY logic (USDT transfer or MATIC -> USDT swap) ========================= */
function activeWeek(){ return 0; } // değiştir istersen: hangi haftanın aktif olduğunu döndür
["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{ const b=$("#"+id); if(!b) return; b.addEventListener("click", ()=>handleBuy(i)); });

function toUSDT6(n){ // number -> BigInt (6 decimals)
  return BigInt(Math.round(parseFloat(n)*1e6));
}
function encodeERC20Transfer(to, amount6){
  const fn = "a9059cbb"; // transfer(address,uint256)
  const addr = to.toLowerCase().replace(/^0x/,"").padStart(64,"0");
  const amt  = amount6.toString(16).padStart(64,"0");
  return "0x"+fn+addr+amt;
}

async function handleBuy(weekIdx){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  if(qty<=0){ alert("Enter a valid amount."); return; }
  if(weekIdx!==activeWeek()){ alert("This week is not active."); return; }
  if(!CURRENT_ADDRESS){ alert("Connect wallet first."); return; }
  const price = CONFIG.weekPrices[weekIdx];
  const usdtCost = (qty*price).toFixed(6);
  const payWith = $("#payWith")?.value || "USDT_POLYGON";
  const provider = pickEvmProvider();
  if(!provider){ alert("EVM cüzdanı bulunamadı."); return; }
  await ensurePolygon(provider);

  try{
    if(payWith==="USDT_POLYGON"){
      const amount6 = toUSDT6(usdtCost);
      const data = encodeERC20Transfer(CONFIG.PRESALE_TREASURY, amount6);
      const tx = { from: CURRENT_ADDRESS, to: CONFIG.USDT_POLYGON, data, value: "0x0" };
      const txHash = await provider.request({ method:"eth_sendTransaction", params:[tx] });
      alert(`Payment sent! TX: ${txHash}`);
    } else {
      // MATIC -> USDT via 0x swap API
      const buyAmount = toUSDT6(usdtCost).toString();
      const qs = new URLSearchParams({
        buyToken:"USDT",
        sellToken:"MATIC",
        buyAmount,
        takerAddress: CURRENT_ADDRESS,
        recipient: CONFIG.PRESALE_TREASURY,
        slippagePercentage:"0.02"
      });
      const resp = await fetch(`${CONFIG.ZEROX_BASE}/swap/v1/quote?${qs.toString()}`);
      const quote = await resp.json();
      if(quote?.to && quote?.data){
        const tx = { from: CURRENT_ADDRESS, to: quote.to, data: quote.data, value: quote.value || "0x0" };
        const txHash = await provider.request({ method:"eth_sendTransaction", params:[tx] });
        alert(`Swap+Pay sent! TX: ${txHash}`);
      } else {
        console.error(quote); alert("Swap quote failed. Check console.");
      }
    }
  }catch(e){ console.error(e); alert("Transaction failed or rejected."); }
}

/* small UI nudge for ticker */
(function ensureTickerVisible(){ const t=$("#exTrack"); if(!t) return; t.style.transform="translateX(0)"; setTimeout(()=>t.style.transform="",60); })();
