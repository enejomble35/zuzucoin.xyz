/* ========================= CONFIG (Polygon + Backend) ========================= */
const CONFIG = {
  // Polygon
  chainIdHex: "0x89",
  chainName: "Polygon Mainnet",
  rpcUrls: ["https://polygon-rpc.com"],
  explorer: "https://polygonscan.com",
  usdtAddr: "0xc2132D05D31c914a87C6611C10748AaCBa7cBfAa", // USDT on Polygon (6 decimals)
  treasury: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3", // SANA AİT

  // Backend yalnızca referans için (şimdilik kullanılmıyor)
  backendUrl: "",

  // Countdown sabit tarih: 24 Kasım 2025 Pazartesi 13:00 (TRT, UTC+3)
  launchAtUTC: Date.UTC(2025, 10, 24, 10, 0, 0), // ay 0-index, 10=Kasım; 13:00 TRT = 10:00 UTC

  // Presale fiyatları (USDT)
  weekPrices: [0.040, 0.060, 0.085, 0.01],

  // LS keys
  LS_ADDR: "zuzu_connected_addr",
  LS_WALLET: "zuzu_connected_wallet",
  LS_LANG: "zuzu_lang"
};

/* ========================= i18n (EN/TR/FR/PT/RU/ES) ========================= */
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
      presale_title:"Pré-vente — Compte à rebours",presale_lead:"Prépare-toi pour la pré-vente ZUZU ! **Allocation limitée**.",
      amount:"Montant (ZUZU)",cost:"Coût :",buy:"Acheter",exchanges:"Bourses prises en charge",
      stake_title:"Stake Pro — Verrouille, Gagne, Reçois un NFT ✨",stake_lead:"Verrouille ton ZUZU et gagne **APY + BOOST NFT**.",
      token_title:"Tokenomics (Visualisé)",road_title:"Feuille de route"},
  pt:{nav_presale:"Pré-venda",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Roteiro",nav_token:"Tokenomics",connect:"Conectar Carteira",
      hero_badge:"Pré-venda • Stake para ganhar NFT",hero_title:"ZUZU — Ouriço Robótico 🦔⚡",hero_lead:"Faça stake e ganhe **NFT Mascote ZUZU**.",
      cta_stake:"Começar Stake",cta_nft:"Recompensas NFT",days:"DIAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",
      presale_title:"Pré-venda — Contagem regressiva",presale_lead:"Prepare-se para a pré-venda ZUZU! **Alocação limitada**.",
      amount:"Quantidade (ZUZU)",cost:"Custo:",buy:"Comprar",exchanges:"Exchanges suportadas",
      stake_title:"Stake Pro — Trave, Ganhe, Receba NFT ✨",stake_lead:"Trave seu ZUZU e ganhe **APY + BOOST NFT**.",
      token_title:"Tokenomics (Visualizado)",road_title:"Roteiro"},
  ru:{nav_presale:"Предпродажа",nav_stake:"Стейкинг",nav_nft:"NFT награды",nav_roadmap:"Дорожная карта",nav_token:"Токеномика",connect:"Подключить кошелёк",
      hero_badge:"Предпродажа • Стейкинг для NFT",hero_title:"ЗУЗУ — Робо-Ёж 🦔⚡",hero_lead:"Стейкай и получай **маскот NFT ZUZU**.",
      cta_stake:"Начать стейкинг",cta_nft:"NFT награды",days:"ДНИ",hours:"ЧАСЫ",mins:"МИН.",secs:"СЕК.",
      presale_title:"Предпродажа — Обратный отсчёт",presale_lead:"Готовься к предпродаже ZUZU! **Ограниченная аллокация**.",
      amount:"Количество (ZUZU)",cost:"Стоимость:",buy:"Купить",exchanges:"Поддерживаемые биржи",
      stake_title:"Stake Pro — Заморозь, Заработай, Получи NFT ✨",stake_lead:"Заморозь ZUZU и получай **APY + NFT BOOST**.",
      token_title:"Токеномика (визуально)",road_title:"Дорожная карта"},
  es:{nav_presale:"Pre-venta",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Hoja de ruta",nav_token:"Tokenomics",connect:"Conectar Billetera",
      hero_badge:"Pre-venta • Stake para ganar NFT",hero_title:"ZUZU — Erizo Robótico 🦔⚡",hero_lead:"Haz stake y gana **NFT Mascota ZUZU**.",
      cta_stake:"Empezar Stake",cta_nft:"Recompensas NFT",days:"DÍAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",
      presale_title:"Pre-venta — Cuenta regresiva",presale_lead:"¡Prepárate para la pre-venta ZUZU! **Asignación limitada**.",
      amount:"Cantidad (ZUZU)",cost:"Costo:",buy:"Comprar",exchanges:"Exchanges compatibles",
      stake_title:"Stake Pro — Bloquea, Gana, Obtén NFT ✨",stake_lead:"Bloquea tu ZUZU y gana **APY + BOOST NFT**.",
      token_title:"Tokenomics (Visualizado)",road_title:"Hoja de ruta"}
};

/* helpers */
const $  = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];

/* ========================= Lang ========================= */
function applyLang(lang){
  localStorage.setItem(CONFIG.LS_LANG, lang);
  $("#langCode") && ($("#langCode").textContent = lang.toUpperCase());
  const emoji = {en:"🇬🇧",tr:"🇹🇷",fr:"🇫🇷",pt:"🇵🇹",ru:"🇷🇺",es:"🇪🇸"}[lang] || "🇬🇧";
  $("#langEmoji") && ($("#langEmoji").textContent = emoji);
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
    langBtn.addEventListener("click", (e)=>{ e.stopPropagation(); langMenu.classList.toggle("show"); });
    $$(".lang-opt").forEach(b=>b.addEventListener("click", (e)=>{
      e.stopPropagation(); applyLang(b.dataset.lang); langMenu.classList.remove("show");
    }));
    document.addEventListener("click", (e)=>{
      if(!langMenu?.contains(e.target) && e.target!==langBtn) langMenu?.classList.remove("show");
    });
  }
})();

/* ========================= Countdown (sabit tarih) ========================= */
function tick(){
  const left = Math.max(0, CONFIG.launchAtUTC - Date.now());
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

/* ========================= NFT grid (placeholder görseller) ========================= */
(function renderNFTs(){
  const g=$("#nftGrid"); if(!g) return;
  g.innerHTML = Array.from({length:10}).map((_,i)=>`
    <div class="nft">
      <div class="nftph" aria-hidden="true">Z${i+1}</div>
      <div class="meta"><b>ZUZU #${i+1}</b><span class="tag">${i%5===0?'Legendary':(i%2?'Rare':'Epic')}</span></div>
    </div>`).join("");
})();

/* ========================= Invite link ========================= */
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

/* ========================= Wallets (MetaMask + Phantom EVM) ========================= */
const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent||"");

/* provider seçimi */
function pickEvmProvider(){
  if(window.ethereum){
    if(Array.isArray(window.ethereum.providers)){
      const mm = window.ethereum.providers.find(p=>p.isMetaMask);
      const ph = window.ethereum.providers.find(p=>p.isPhantom);
      return mm || ph || window.ethereum.providers[0];
    }
    return window.ethereum;
  }
  if(window.phantom && window.phantom.ethereum) return window.phantom.ethereum;
  return null;
}

/* Polygon’a geçiş/ekleme */
async function ensurePolygon(provider){
  try{
    await provider.request({ method: 'wallet_switchEthereumChain', params:[{ chainId: CONFIG.chainIdHex }] });
  }catch(e){
    await provider.request({ method:'wallet_addEthereumChain', params:[{
      chainId: CONFIG.chainIdHex,
      chainName: CONFIG.chainName,
      nativeCurrency:{name:'MATIC', symbol:'MATIC', decimals:18},
      rpcUrls: CONFIG.rpcUrls,
      blockExplorerUrls:[CONFIG.explorer]
    }]});
  }
}

/* Basit ERC20 arayüzü */
const ERC20_ABI = [
  {"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"type":"function"},
  {"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"type":"function"},
  {"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"type":"function"}
];

/* Basit provider-agnostic contract çağrısı (EIP-1193) */
function getContract(provider, address, abi){
  return {
    async call(method, params){
      const iface = abi.find(a=>a.name===method);
      // sadece read için burada kullanılmadı
      return provider.request({ method:'eth_call', params:[{to:address, data:"0x"}, "latest"]});
    },
    async send(from, method, params){
      // encode sadece transfer için:
      if(method!=="transfer") throw new Error("only transfer supported in this mini helper");
      const to = params[0];
      const value = params[1]; // hex string
      // transfer(address,uint256) keccak id
      const sig = "a9059cbb";
      const addrPadded = to.replace(/^0x/,"").padStart(64,"0");
      const valPadded  = value.replace(/^0x/,"").padStart(64,"0");
      const data = "0x"+sig+addrPadded+valPadded;
      const tx = await provider.request({
        method:"eth_sendTransaction",
        params:[{from, to: CONFIG.usdtAddr, data}]
      });
      return tx;
    }
  };
}

let CURRENT_ADDRESS = null;

/* UI init */
(function initWalletUI(){
  const modal = $("#walletModal");
  const btnConnect = $("#connectBtn");
  const btnClose = $("#wmClose");
  const btnDisconnect = $("#disconnectBtn");
  const wlist = $("#wlist");

  const savedAddr = localStorage.getItem(CONFIG.LS_ADDR);
  if(savedAddr){ onConnected(savedAddr, {silent:true}); } else { setBuyButtonsEnabled(false); }

  btnConnect?.addEventListener("click", connectFlow);
  btnClose?.addEventListener("click", ()=>{ modal?.classList.remove("show"); modal?.setAttribute("hidden",""); });
  modal?.addEventListener("click", (e)=>{ if(e.target===modal){ modal.classList.remove("show"); modal.setAttribute("hidden",""); } });

  wlist?.addEventListener("click", (e)=>{
    const b = e.target.closest(".wbtn"); if(!b) return; connectFlow(b.dataset.wallet);
  });

  btnDisconnect?.addEventListener("click", async ()=>{
    CURRENT_ADDRESS=null;
    localStorage.removeItem(CONFIG.LS_ADDR);
    $("#connectBtn") && ($("#connectBtn").textContent = I[(localStorage.getItem(CONFIG.LS_LANG)||"en")].connect || "Connect Wallet");
    setBuyButtonsEnabled(false);
    alert("Disconnected.");
  });
})();

async function connectFlow(prefer){ // prefer: 'metamask' | 'phantom' | undefined
  const modal = $("#walletModal");
  const provider = pickEvmProvider();

  if(provider && !IS_MOBILE){
    try{
      await ensurePolygon(provider);
      const accs = await provider.request({ method: 'eth_requestAccounts' });
      const addr = accs?.[0];
      if(!addr) throw new Error("No account");
      onConnected(addr);
      modal?.classList.remove("show"); modal?.setAttribute("hidden","");
    }catch(e){
      console.error(e);
      alert("Wallet connection failed. Please approve in wallet.");
    }
    return;
  }

  // mobile veya provider yoksa modal aç
  modal?.classList.add("show"); modal?.removeAttribute("hidden");
}

function onConnected(addr, opts={}){
  CURRENT_ADDRESS = addr;
  localStorage.setItem(CONFIG.LS_ADDR, addr);
  $("#connectBtn") && ($("#connectBtn").textContent = `${addr.slice(0,6)}...${addr.slice(-4)}`);
  $("#disconnectBtn") && ($("#disconnectBtn").style.display = "inline-flex");
  setBuyButtonsEnabled(true);
  if(!opts.silent) console.log("Connected:", addr);
}

/* ========================= Satın alma (USDT transfer) ========================= */
function activeWeek(){ return 0; } // istersen dinamik yaparız
["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
  const b = $("#"+id); if(!b) return; b.addEventListener("click", ()=>handleBuy(i));
});
function setBuyButtonsEnabled(ok){
  ["buyW0","buyW1","buyW2","buyW3"].forEach(id=>{
    const b = document.getElementById(id); if(!b) return;
    b.disabled = !ok; b.style.opacity = ok ? "1" : ".5"; b.style.pointerEvents = ok ? "auto" : "none";
  });
}

async function handleBuy(weekIdx){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  if(qty<=0){ alert("Enter a valid amount."); return; }
  if(weekIdx!==activeWeek()){ alert("This week is not active."); return; }
  if(!CURRENT_ADDRESS){ alert("Connect wallet first."); return; }

  const price = CONFIG.weekPrices[weekIdx];
  const usdtCost = qty * price; // decimal

  const provider = pickEvmProvider();
  if(!provider){ alert("EVM provider not found. Open in MetaMask/Phantom."); return; }
  try{
    await ensurePolygon(provider);

    // USDT 6 decimals → amount bigInt
    const amount = BigInt(Math.round(usdtCost * 1_000_000)); // 6 decimals
    const hexAmount = "0x" + amount.toString(16);

    const contract = getContract(provider, CONFIG.usdtAddr, ERC20_ABI);
    const txHash = await contract.send(CURRENT_ADDRESS, "transfer", [CONFIG.treasury, hexAmount]);

    alert("Payment sent! TX: " + txHash + "\nTrack on Polygonscan.");
    // İstersen burada backend'e satın alma verisi POST edebilirsin.
  }catch(e){
    console.error(e);
    alert("Payment failed or rejected.");
  }
}

/* ========================= Ticker nudge ========================= */
(function ensureTickerVisible(){
  const t=$("#exTrack"); if(!t) return; t.style.transform="translateX(0)";
  setTimeout(()=>t.style.transform="", 60);
})();
