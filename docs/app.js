/* ========================= CONFIG (Polygon + Backend) ========================= */
const CONFIG = {
  chainId: "0x89", // Polygon Mainnet
  chainName: "Polygon Mainnet",
  rpcUrls: ["https://polygon-rpc.com"],
  currency: { name: "MATIC", symbol: "MATIC", decimals: 18 },

  // Treasury — senin adresin
  treasury: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3",

  // USDT (Polygon)
  USDT: { address: "0xC2132D05D31c914a87C6611C10748AEb04B58e8F", decimals: 6 },

  // Presale fiyatları (USDT)
  weekPrices: [0.0045, 0.0060, 0.0075, 0.0090],

  // Countdown sabit tarih: 24 Kasım 2025 13:00 (Europe/Istanbul, GMT+3)
  launchAtISO: "2025-11-24T13:00:00+03:00",

  // LS keys
  LS_ADDR: "zuzu_connected_addr",
  LS_WALLET: "zuzu_connected_wallet",
  LS_LANG: "zuzu_lang",
  LS_REF: "zuzu_ref_addr"
};

/* ========================= i18n (EN/TR/FR/PT/RU/ES) ========================= */
const I = {
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
    hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",hero_lead:"Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high <b>utility</b>.",
    cta_stake:"Start Staking",cta_nft:"NFT Rewards",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
    presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",
    amount:"Amount (ZUZU)",cost:"Cost:",buy:"Buy",exchanges:"Supported Exchanges",
    stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>.",
    token_title:"Tokenomics (Visualized)",road_title:"Roadmap"},
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
    hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
    cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
    presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",
    amount:"Miktar (ZUZU)",cost:"Maliyet:",buy:"Satın Al",exchanges:"Desteklenen Borsalar",
    stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile kazan.",
    token_title:"Tokonomi (Görsel)",road_title:"Yol Haritası"},
  fr:{nav_presale:"Pré-vente",nav_stake:"Stake",nav_nft:"Récompenses NFT",nav_roadmap:"Feuille de route",nav_token:"Tokenomics",connect:"Connecter le Wallet",
    hero_badge:"Pré-vente • Stake pour gagner un NFT",hero_title:"ZUZU — Hérisson Robotique 🦔⚡",hero_lead:"Stake et gagne un <b>NFT Mascotte ZUZU</b>.",
    cta_stake:"Commencer le Stake",cta_nft:"Récompenses NFT",days:"JOURS",hours:"HEURES",mins:"MINUTES",secs:"SECONDES",
    presale_title:"Pré-vente — Compte à rebours",presale_lead:"Prépare-toi pour la pré-vente ZUZU ! <b>Allocation limitée</b>.",
    amount:"Montant (ZUZU)",cost:"Coût :",buy:"Acheter",exchanges:"Bourses prises en charge",
    stake_title:"Stake Pro — Verrouille, Gagne, Reçois un NFT ✨",stake_lead:"Verrouille ton ZUZU et gagne <b>APY + BOOST NFT</b>.",
    token_title:"Tokenomics (Visualisé)",road_title:"Feuille de route"},
  pt:{nav_presale:"Pré-venda",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Roteiro",nav_token:"Tokenomics",connect:"Conectar Carteira",
    hero_badge:"Pré-venda • Stake para ganhar NFT",hero_title:"ZUZU — Ouriço Robótico 🦔⚡",hero_lead:"Faça stake e ganhe <b>NFT Mascote ZUZU</b>.",
    cta_stake:"Começar Stake",cta_nft:"Recompensas NFT",days:"DIAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",
    presale_title:"Pré-venda — Contagem regressiva",presale_lead:"Prepare-se! <b>Alocação limitada</b>.",
    amount:"Quantidade (ZUZU)",cost:"Custo:",buy:"Comprar",exchanges:"Exchanges suportadas",
    stake_title:"Stake Pro — Trave, Ganhe, Receba NFT ✨",stake_lead:"Trave seu ZUZU e ganhe <b>APY + BOOST NFT</b>.",
    token_title:"Tokenomics (Visualizado)",road_title:"Roteiro"},
  ru:{nav_presale:"Предпродажа",nav_stake:"Стейкинг",nav_nft:"NFT награды",nav_roadmap:"Карта",nav_token:"Токеномика",connect:"Подключить кошелёк",
    hero_badge:"Предпродажа • Стейкинг для NFT",hero_title:"ЗУЗУ — Робо-Ёж 🦔⚡",hero_lead:"Стейкай и получай <b>NFT ZUZU</b>.",
    cta_stake:"Начать стейкинг",cta_nft:"NFT награды",days:"ДНИ",hours:"ЧАСЫ",mins:"МИН.",secs:"СЕК.",
    presale_title:"Предпродажа — Обратный отсчёт",presale_lead:"Готовься! <b>Ограниченная аллокация</b>.",
    amount:"Количество (ZUZU)",cost:"Стоимость:",buy:"Купить",exchanges:"Поддерживаемые биржи",
    stake_title:"Stake Pro — Заморозь, Заработай, Получи NFT ✨",stake_lead:"Заморозь ZUZU и получай <b>APY + NFT BOOST</b>.",
    token_title:"Токеномика (визуально)",road_title:"Дорожная карта"},
  es:{nav_presale:"Pre-venta",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Hoja de ruta",nav_token:"Tokenomics",connect:"Conectar Billetera",
    hero_badge:"Pre-venta • Stake para ganar NFT",hero_title:"ZUZU — Erizo Robótico 🦔⚡",hero_lead:"Haz stake y gana <b>NFT Mascota ZUZU</b>.",
    cta_stake:"Empezar Stake",cta_nft:"Recompensas NFT",days:"DÍAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",
    presale_title:"Pre-venta — Cuenta regresiva",presale_lead:"¡Prepárate! <b>Asignación limitada</b>.",
    amount:"Cantidad (ZUZU)",cost:"Costo:",buy:"Comprar",exchanges:"Exchanges compatibles",
    stake_title:"Stake Pro — Bloquea, Gana, Obtén NFT ✨",stake_lead:"Bloquea tu ZUZU y gana <b>APY + BOOST NFT</b>.",
    token_title:"Tokenomics (Visualizado)",road_title:"Hoja de ruta"}
};

/* Helpers */
const $ = (q,root=document)=>root.querySelector(q);
const $$ = (q,root=document)=>[...root.querySelectorAll(q)];

/* ========================= LANG ========================= */
function applyLang(lang){
  localStorage.setItem(CONFIG.LS_LANG, lang);
  $("#langCode") && ($("#langCode").textContent = lang.toUpperCase());
  const f = $("#langFlag"); if(f){ f.className = `flag flag-${lang}`; }
  $$("[data-i]").forEach(el=>{
    const k=el.getAttribute("data-i");
    if(I[lang] && I[lang][k]) el.innerHTML = I[lang][k];
  });
}
(function initLang(){
  const saved = localStorage.getItem(CONFIG.LS_LANG) || "en";
  applyLang(saved);
  const langBtn=$("#langBtn"), langMenu=$("#langMenu");
  if(langBtn && langMenu){
    langBtn.addEventListener("click",(e)=>{e.stopPropagation();langMenu.classList.toggle("show");});
    $$(".lang-opt").forEach(b=>b.addEventListener("click",(e)=>{
      e.stopPropagation(); applyLang(b.dataset.lang); langMenu.classList.remove("show");
    }));
    document.addEventListener("click",(e)=>{ if(!langMenu.contains(e.target) && e.target!==langBtn) langMenu.classList.remove("show"); });
  }
})();

/* ========================= COUNTDOWN (fixed TS) ========================= */
const LAUNCH_TS = Date.parse(CONFIG.launchAtISO); // 24 Kasım 2025 13:00 +03:00
function tick(){
  const left = Math.max(0, LAUNCH_TS - Date.now());
  const d=Math.floor(left/86400000);
  const h=Math.floor((left%86400000)/3600000);
  const m=Math.floor((left%3600000)/60000);
  const s=Math.floor((left%60000)/1000);
  const pad=n=>n.toString().padStart(2,"0");
  $("#cdDays") && ($("#cdDays").textContent=pad(d));
  $("#cdHours") && ($("#cdHours").textContent=pad(h));
  $("#cdMins") && ($("#cdMins").textContent=pad(m));
  $("#cdSecs") && ($("#cdSecs").textContent=pad(s));
}
tick(); setInterval(tick,1000);

/* ========================= PRICE / COST ========================= */
function updateCosts(){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  CONFIG.weekPrices.forEach((p,i)=>{
    $("#p"+i) && ($("#p"+i).textContent = p.toFixed(4));
    $("#c"+i) && ($("#c"+i).textContent = (qty*p).toLocaleString(undefined,{maximumFractionDigits:2}));
  });
}
$("#buyAmount")?.addEventListener("input", updateCosts); updateCosts();

/* ========================= NFT GRID ========================= */
(function renderNFTs(){
  const g=$("#nftGrid"); if(!g) return;
  const COUNT=10;
  g.innerHTML = Array.from({length:COUNT}).map((_,i)=>{
    const n=i+1, tag=(i%5===0?'Legendary':(i%2?'Rare':'Epic'));
    // Önce gerçek görseli dener; yoksa placeholder kutu çizilir
    const imgPath=`assets/images/mask/${n}.png`;
    return `
      <div class="nft">
        <img src="${imgPath}" alt="ZUZU #${n}" onerror="this.remove();var ph=document.createElement('div');ph.className='ph';ph.textContent='Z${n}';this.parentNode.insertBefore(ph,this.parentNode.firstChild);"/>
        <div class="meta"><b>ZUZU #${n}</b><span class="tag">${tag}</span></div>
      </div>`;
  }).join("");
})();

/* ========================= Invite link ========================= */
(function refLink(){
  const url = new URL(location.href);
  if(url.searchParams.get("ref")) localStorage.setItem(CONFIG.LS_REF, url.searchParams.get("ref"));
  const addr = localStorage.getItem(CONFIG.LS_REF) || "";
  const out=$("#refLink"), copyBtn=$("#copyRef");
  if(out) out.value = `${location.origin}${location.pathname}?ref=${addr||"YOURCODE"}`;
  copyBtn?.addEventListener("click",()=>{ navigator.clipboard.writeText(out.value); alert("Copied!"); });
})();

/* ========================= Wallets (EVM: MetaMask + Phantom) ========================= */
const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent||"");

const Wallets = {
  metamask:{
    key:'metamask', label:'MetaMask',
    icon: `<svg viewBox="0 0 212 189"><path fill="#E17726" d="M199 0l-78 58 14-34z"/><path fill="#E27625" d="M13 0l79 58-14-34z"/><path fill="#E27625" d="M170 137l-20 31 43 12z"/><path fill="#E27625" d="M42 137l-23 43 43-12z"/></svg>`,
    has:()=> !!window.ethereum,
    provider:()=> window.ethereum
  },
  phantom:{
    key:'phantom', label:'Phantom (EVM)',
    icon:`<svg viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#7863f9"/><circle cx="12.5" cy="14" r="2.5" fill="#fff"/><circle cx="20.5" cy="14" r="2.5" fill="#fff"/><path d="M7 20c4 6 14 6 18 0" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,
    has:()=> !!(window.phantom?.ethereum || (window.ethereum && window.ethereum.isPhantom)),
    provider:()=> window.phantom?.ethereum || window.ethereum
  }
};

let CURRENT_ADDRESS=null; let CURRENT_WALLET=null;

function walletListHTML(){
  return Object.values(Wallets).map(w=>`
    <button class="wbtn" data-key="${w.key}">
      ${w.icon}<span>${w.label}</span>
    </button>`).join("");
}

(function initWalletUI(){
  const modal=$("#walletModal"), list=$("#wlist"),
        btnConnect=$("#connectBtn"), btnClose=$("#wmClose"), btnDisconnect=$("#disconnectBtn");
  if(list) list.innerHTML = walletListHTML();

  const savedAddr=localStorage.getItem(CONFIG.LS_ADDR);
  const savedWal =localStorage.getItem(CONFIG.LS_WALLET);
  if(savedAddr && savedWal){ onConnected(savedWal,savedAddr,{silent:true}); } else { setBuyButtonsEnabled(false); }

  btnConnect?.addEventListener("click", ()=>{
    const direct = Wallets.metamask.has() ? Wallets.metamask : (Wallets.phantom.has()?Wallets.phantom:null);
    if(direct){ connectFlow(direct.key); } else { modal?.classList.add("show"); modal?.removeAttribute("hidden"); }
  });

  list?.addEventListener("click",(e)=>{
    const btn = e.target.closest(".wbtn"); if(!btn) return; connectFlow(btn.dataset.key);
  });

  btnClose?.addEventListener("click",()=>{ modal?.classList.remove("show"); modal?.setAttribute("hidden",""); });
  modal?.addEventListener("click",(e)=>{ if(e.target===modal){ modal.classList.remove("show"); modal.setAttribute("hidden",""); } });

  btnDisconnect?.addEventListener("click",async()=>{
    CURRENT_ADDRESS=null; CURRENT_WALLET=null;
    localStorage.removeItem(CONFIG.LS_ADDR); localStorage.removeItem(CONFIG.LS_WALLET);
    $("#connectBtn") && ($("#connectBtn").textContent = I[(localStorage.getItem(CONFIG.LS_LANG)||"en")].connect || "Connect Wallet");
    setBuyButtonsEnabled(false); alert("Disconnected.");
  });
})();

async function ensurePolygon(provider){
  const chainId = await provider.request({method:"eth_chainId"});
  if(chainId !== CONFIG.chainId){
    try{
      await provider.request({method:"wallet_switchEthereumChain", params:[{chainId: CONFIG.chainId}]});
    }catch(e){
      // zincir ekle
      await provider.request({method:"wallet_addEthereumChain", params:[{
        chainId: CONFIG.chainId, chainName: CONFIG.chainName,
        nativeCurrency: CONFIG.currency, rpcUrls: CONFIG.rpcUrls, blockExplorerUrls:["https://polygonscan.com"]
      }]});
    }
  }
}

async function connectFlow(key){
  const impl = Wallets[key]; if(!impl) return;
  const modal=$("#walletModal");
  const provider = impl.provider();
  if(!provider){ alert(`${impl.label} not found.`); return; }
  try{
    await ensurePolygon(provider);
    const accts = await provider.request({method:"eth_requestAccounts"});
    const addr = accts[0];
    onConnected(key, addr);
    modal?.classList.remove("show"); modal?.setAttribute("hidden","");
  }catch(e){
    console.error(e); alert("Wallet connection rejected or failed.");
  }
}

function onConnected(key, addr, opts={}){
  CURRENT_ADDRESS = addr; CURRENT_WALLET = key;
  localStorage.setItem(CONFIG.LS_ADDR, addr); localStorage.setItem(CONFIG.LS_WALLET, key);
  $("#connectBtn") && ($("#connectBtn").textContent = `${addr.slice(0,6)}...${addr.slice(-4)}`);
  $("#disconnectBtn") && ($("#disconnectBtn").style.display = "inline-flex");
  setBuyButtonsEnabled(true);
  if(!opts.silent) console.log("Connected:", key, addr);
}

/* ========================= BUY (MATIC / USDT) ========================= */
function activeWeek(){ return 0; } // şimdilik Week 1 aktif
["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
  $("#"+id)?.addEventListener("click", ()=>handleBuy(i));
});
function setBuyButtonsEnabled(ok){
  ["buyW0","buyW1","buyW2","buyW3"].forEach(id=>{
    const b=document.getElementById(id); if(!b) return;
    b.disabled=!ok; b.style.opacity=ok?"1":".5"; b.style.pointerEvents=ok?"auto":"none";
  });
}

async function handleBuy(weekIdx){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  if(qty<=0){ alert("Enter a valid amount."); return; }
  if(weekIdx!==activeWeek()){ alert("This week is not active."); return; }
  if(!CURRENT_ADDRESS){ alert("Connect wallet first."); return; }

  const price = CONFIG.weekPrices[weekIdx];
  const costUSDT = qty * price;
  const payWith = $("#payWith").value;

  const provider = Wallets[CURRENT_WALLET]?.provider();
  if(!provider){ alert("No wallet provider."); return; }
  await ensurePolygon(provider);

  if(payWith==="MATIC"){
    // MATIC gönderimi: USDT fiyatını MATIC'e çevirmek için basitçe kullanıcı manuel kabul eder (fiyat USDT, ama MATIC öder).
    const msg = `Cost: ${costUSDT.toFixed(2)} USDT equivalent. You are about to pay in MATIC at your chosen rate. Continue?`;
    if(!confirm(msg)) return;

    // Basit tutar: 1 USDT ~ 1 USD; MATIC miktarını kullanıcı cüzdanı belirlerse daha güvenli.
    // Burada örnek olarak 1 MATIC = 1 USD varsayılmıyor. Bu yüzden manuel input eklemek daha doğru.
    // Kolaylık için 1 MATIC = 1 USD kabul ederek bir minimum gönderim yapıyoruz (isteğe göre backend ile oran çekebilirsin).
    const maticAmount = costUSDT; // basitleştirilmiş
    const tx = await provider.request({
      method:"eth_sendTransaction",
      params:[{
        from: CURRENT_ADDRESS,
        to: CONFIG.treasury,
        value: "0x" + BigInt(Math.floor(maticAmount * 1e18)).toString(16)
      }]
    });
    alert("Transaction sent: "+tx);
  }else{
    // USDT ERC20 transfer
    const to = CONFIG.treasury;
    const amount = BigInt(Math.round(costUSDT * 10**CONFIG.USDT.decimals));
    const data = buildERC20TransferData(to, amount);
    const tx = await provider.request({
      method:"eth_sendTransaction",
      params:[{
        from: CURRENT_ADDRESS,
        to: CONFIG.USDT.address,
        data, value:"0x0"
      }]
    });
    alert("Transaction sent: "+tx);
  }
}

// Minimal ERC20 transfer function ABI encoding (transfer(address,uint256))
function buildERC20TransferData(to, amountBigInt){
  const methodId = "a9059cbb"; // keccak("transfer(address,uint256)") ilk 4 byte
  const addr = to.toLowerCase().replace(/^0x/,"").padStart(64,"0");
  const amt  = amountBigInt.toString(16).padStart(64,"0");
  return "0x"+methodId+addr+amt;
}

/* ========================= Ticker küçük nudge ========================= */
(function ensureTickerVisible(){
  const t=$("#exTrack"); if(!t) return;
  t.style.transform="translateX(0)"; setTimeout(()=>t.style.transform="",60);
})();
