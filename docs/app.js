/* ======= CONFIG ======= */
const CONFIG = {
  // Presale başlangıcı (TR saatiyle) — 23 Kasım 2025 Pazar 13:00
  PRESALE_START_ISO: "2025-11-23T13:00:00+03:00",
  // 4 hafta x 15 gün = 60 gün
  WEEK_LENGTH_DAYS: 15,
  PRICES: [0.040, 0.060, 0.080, 0.100],
  // Polygon
  CHAIN: {
    chainId: "0x89", // Polygon mainnet
    chainName: "Polygon",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com"]
  },
  LS_LANG: "zuzu_lang",
  LS_ADDR: "zuzu_evm_addr",
  REF_KEY: "zuzu_ref",
  REWARD_ZUZU: 250
};

/* ======= HELPERS ======= */
const $  = (q,root=document)=>root.querySelector(q);
const $$ = (q,root=document)=>[...root.querySelectorAll(q)];
const fmt2 = n => n.toString().padStart(2,"0");

/* ======= I18N ======= */
const I = {
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",
      stake_sim:"Stake Simulator",claim_portal:"Claim Portal",buy_token:"Buy $ZUZU",
      connect:"Connect Wallet",hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
      hero_lead:"Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high <b>utility</b>.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",
      w1:"Week 1",w2:"Week 2",w3:"Week 3",w4:"Week 4",buy_now:"Buy Now",pay_note:"Payments via MetaMask (EVM) on Polygon",
      not_active:"Presale is not active yet.",pricing:"Presale Pricing",invite:"Invite & Earn",
      invite_p:"Share your link. Each purchase via your link earns <b>250 ZUZU</b>.",
      copy:"Copy",stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>.",
      road_title:"Roadmap",token_title:"Tokenomics (Visualized)"},
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",
      stake_sim:"Stake Simülatör",claim_portal:"Claim Portal",buy_token:"$ZUZU Satın Al",
      connect:"Cüzdan Bağla",hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",
      hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",
      w1:"1. Hafta",w2:"2. Hafta",w3:"3. Hafta",w4:"4. Hafta",buy_now:"Satın Al",pay_note:"Ödemeler MetaMask (EVM) ile Polygon üzerinde",
      not_active:"Ön satış henüz aktif değil.",pricing:"Ön Satış Fiyatları",invite:"Davet Et & Kazan",
      invite_p:"Bağlantını paylaş. Her satın almada <b>250 ZUZU</b> kazanırsın.",
      copy:"Kopyala",stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile kazan.",
      road_title:"Yol Haritası",token_title:"Tokonomi (Görsel)"},
  es:{nav_presale:"Pre-venta",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Hoja de ruta",nav_token:"Tokenomics",
      stake_sim:"Simulador de Stake",claim_portal:"Portal de Claim",buy_token:"Comprar $ZUZU",
      connect:"Conectar Billetera",hero_badge:"Pre-venta • Stake para ganar NFT",hero_title:"ZUZU — Erizo Robótico 🦔⚡",
      hero_lead:"Haz stake y gana <b>NFT Mascota ZUZU</b>.",cta_stake:"Empezar Stake",cta_nft:"Recompensas NFT",
      days:"DÍAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",
      presale_title:"Pre-venta — Cuenta regresiva",presale_lead:"¡Prepárate! <b>Asignación limitada</b>.",w1:"Semana 1",w2:"Semana 2",w3:"Semana 3",w4:"Semana 4",
      buy_now:"Comprar ahora",pay_note:"Pagos vía MetaMask (EVM) en Polygon",not_active:"La pre-venta aún no está activa.",
      pricing:"Precios de pre-venta",invite:"Invita y gana",invite_p:"Comparte tu link. Ganas <b>250 ZUZU</b> por compra.",copy:"Copiar",
      stake_title:"Stake Pro — Bloquea, Gana, Obtén NFT ✨",stake_lead:"Bloquea tu ZUZU y gana <b>APY + BOOST NFT</b>.",
      road_title:"Hoja de ruta",token_title:"Tokenomics (Visualizado)"},
  fr:{/* …kısa tutuyoruz */...I_en_shim()},
  pt:{...I_en_shim()},
  ru:{...I_en_shim()},
  zh:{...I_en_shim()}
};
// küçük yardımcı – diğer diller için İngilizceye düş
function I_en_shim(){return {
  nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",
  stake_sim:"Stake Simulator",claim_portal:"Claim Portal",buy_token:"Buy $ZUZU",
  connect:"Connect Wallet",hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
  hero_lead:"Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high <b>utility</b>.",
  cta_stake:"Start Staking",cta_nft:"NFT Rewards",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
  presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>.",
  w1:"Week 1",w2:"Week 2",w3:"Week 3",w4:"Week 4",buy_now:"Buy Now",
  pay_note:"Payments via MetaMask (EVM) on Polygon",not_active:"Presale is not active yet.",
  pricing:"Presale Pricing",invite:"Invite & Earn",invite_p:"Share your link. Each purchase via your link earns <b>250 ZUZU</b>.",
  copy:"Copy",stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>.",
  road_title:"Roadmap",token_title:"Tokenomics (Visualized)"
};}

/* apply language */
function applyLang(lang){
  localStorage.setItem(CONFIG.LS_LANG, lang);
  const dict = I[lang] || I.en;
  $$("[data-i]").forEach(el=>{
    const k=el.getAttribute("data-i");
    if(dict[k]) el.innerHTML = dict[k];
  });
  $("#langCode").textContent = lang.toUpperCase();
  $("#langFlag").src = `flags/${lang}.png`;
  // FS menu aynısı
  $("#langCodeFS").textContent = lang.toUpperCase();
  $("#langFlagFS").src = `flags/${lang}.png`;
}
(function initLang(){
  const saved = localStorage.getItem(CONFIG.LS_LANG) || "tr"; // TR ile başlat
  applyLang(saved);
  function wire(btnId,dropId){
    const t=$(btnId), d=$(dropId);
    t?.addEventListener("click",(e)=>{e.stopPropagation();d.classList.toggle("show");});
    d?.addEventListener("click",(e)=>{
      const b=e.target.closest(".lang-op"); if(!b) return;
      applyLang(b.dataset.lang); d.classList.remove("show");
    });
    document.addEventListener("click",(e)=>{ if(!d?.contains(e.target) && e.target!==t) d?.classList.remove("show"); });
  }
  wire("#langToggle","#langDrop");
  wire("#langToggleFS","#langDropFS");
})();

/* ======= HAMBURGER MENU ======= */
(function menu(){
  const m=$("#fsMenu"), btn=$("#hamb"), x=$("#fsClose");
  btn?.addEventListener("click",()=>m.classList.add("show"));
  x?.addEventListener("click",()=>m.classList.remove("show"));
  m?.addEventListener("click",(e)=>{ if(e.target===m) m.classList.remove("show"); });
})();

/* ======= COUNTDOWN (23 Kasım 13:00 TR) ======= */
const START_TS = new Date(CONFIG.PRESALE_START_ISO).getTime();
function tick(){
  const left = Math.max(0, START_TS - Date.now());
  const d = Math.floor(left/86400000);
  const h = Math.floor((left%86400000)/3600000);
  const m = Math.floor((left%3600000)/60000);
  const s = Math.floor((left%60000)/1000);
  $("#cdD").textContent = fmt2(d);
  $("#cdH").textContent = fmt2(h);
  $("#cdM").textContent = fmt2(m);
  $("#cdS").textContent = fmt2(s);
}
tick(); setInterval(tick,1000);

/* ======= PRESALE WEEKS DATES ======= */
function weekRange(i){
  const start = new Date(START_TS + i*CONFIG.WEEK_LENGTH_DAYS*86400000);
  const end   = new Date(START_TS + (i+1)*CONFIG.WEEK_LENGTH_DAYS*86400000 - 1);
  return `${start.toLocaleDateString('tr-TR',{day:'2-digit',month:'short'})} — ${end.toLocaleDateString('tr-TR',{day:'2-digit',month:'short'})}`;
}
["w1d","w2d","w3d","w4d"].forEach((id,i)=>{ const el=$("#"+id); if(el) el.textContent = weekRange(i); });

function activeWeekIndex(){
  const now = Date.now();
  for(let i=0;i<4;i++){
    const ws = START_TS + i*CONFIG.WEEK_LENGTH_DAYS*86400000;
    const we = START_TS + (i+1)*CONFIG.WEEK_LENGTH_DAYS*86400000;
    if(now>=ws && now<we) return i;
  }
  return (now<START_TS) ? -1 : 3; // başlamadan önce -1, bitti ise 3
}

/* ======= REFERRAL ======= */
(function ref(){
  const url=new URL(location.href);
  const ref=url.searchParams.get("ref");
  if(ref) localStorage.setItem(CONFIG.REF_KEY, ref);
  const code=localStorage.getItem(CONFIG.REF_KEY) || "YOURCODE";
  const out=$("#refLink"); if(out) out.value = `${location.origin}${location.pathname}?ref=${code}`;
  $("#copyRef")?.addEventListener("click",()=>{ navigator.clipboard.writeText(out.value); alert("Copied!"); });
})();

/* ======= NFT (10 adet) ======= */
(function nfts(){
  const g=$("#nftGrid"); if(!g) return;
  g.innerHTML = Array.from({length:10}).map((_,i)=>`
    <div class="nft">
      <img src="assets/images/mask/${i}.png" alt="ZUZU #${i+1}"
           onerror="this.style.display='none'"/>
      <div class="meta"><b>ZUZU #${i+1}</b><span class="tag">${i%5===0?'Legendary':(i%2?'Rare':'Epic')}</span></div>
    </div>`).join("");
})();

/* ======= WALLET (MetaMask / Polygon) ======= */
let EVM_ADDR=null;

async function ensureMetamask(){
  if(!window.ethereum){ alert("MetaMask not found. Please install MetaMask."); return false; }
  try{
    const chainId = await ethereum.request({ method:"eth_chainId" });
    if(chainId !== CONFIG.CHAIN.chainId){
      try{
        await ethereum.request({ method:"wallet_switchEthereumChain", params:[{ chainId: CONFIG.CHAIN.chainId }] });
      }catch(switchErr){
        // chain yoksa ekle
        await ethereum.request({ method:"wallet_addEthereumChain", params:[CONFIG.CHAIN] });
      }
    }
    return true;
  }catch(e){ console.error(e); return false; }
}

async function connect(){
  if(!(await ensureMetamask())) return;
  try{
    const accs = await ethereum.request({ method:"eth_requestAccounts" });
    EVM_ADDR = accs[0];
    localStorage.setItem(CONFIG.LS_ADDR,EVM_ADDR);
    $("#btnConnect").textContent = `${EVM_ADDR.slice(0,6)}...${EVM_ADDR.slice(-4)}`;
  }catch(e){ console.error(e); }
}
(function restore(){
  const a = localStorage.getItem(CONFIG.LS_ADDR);
  if(a){ EVM_ADDR=a; $("#btnConnect").textContent = `${a.slice(0,6)}...${a.slice(-4)}`; }
})();
$("#btnConnect")?.addEventListener("click", connect);

/* ======= BUY ======= */
function presaleActive(){
  const aw = activeWeekIndex();
  if(aw<0){ $("#notActive").hidden=false; return false; }
  $("#notActive").hidden=true; return true;
}
$("#btnBuy")?.addEventListener("click", async ()=>{
  if(!presaleActive()) return;
  if(!EVM_ADDR){ await connect(); if(!EVM_ADDR) return; }

  const qty = parseFloat(($("#amt").value||"0").toString().replace(/[^\d.]/g,""))||0;
  if(qty<=0){ alert("Enter a valid amount."); return; }

  const week = activeWeekIndex();
  const price = CONFIG.PRICES[week];
  const payTok = $("#payToken").value;
  const cost = qty * price;

  // Burada gerçek kontrat/ödemeyi entegre edeceksin.
  alert(`Week ${week+1} • Price ${price.toFixed(3)} USDT\nAmount ${qty} ZUZU\nPay with ${payTok}\nEstimated cost ≈ ${cost.toFixed(2)} ${payTok}`);
});

/* ======= MISC ======= */
$("#fsBuy")?.addEventListener("click",()=>$("#fsMenu")?.classList.remove("show"));
