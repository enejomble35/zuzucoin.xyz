/* ====== CONFIG (Polygon + Backend) ====== */
const CONFIG = {
  // sabit lansman: 23 Kasım 13:00 (TRT +03:00)
  launchAt: Date.parse("2025-11-23T13:00:00+03:00"),

  // weeks (USDT)
  weekPrices: [0.040, 0.060, 0.080, 0.100],

  // Polygon
  CHAIN_ID_HEX: "0x89", // 137
  CHAIN_PARAMS: {
    chainId: "0x89",
    chainName: "Polygon Mainnet",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com"]
  },

  // senin adreslerin
  TREASURY: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3", // örnek
  ZUZU_TOKEN: "0x0000000000000000000000000000000000000000", // token adresini koy
  USDT_TOKEN: "0xC2132D05D31c914a87C6611C10748AaCbC5329Ed", // Polygon USDT

  // backend (USDT -> MATIC çevirimi için)
  backendUrl: "https://SENIN-BACKEND-URLIN" // /api/quote?usdt=xx -> {matic: "x.y"}
};

/* ====== helpers ====== */
const $  = (q, r=document) => r.querySelector(q);
const $$ = (q, r=document) => [...r.querySelectorAll(q)];
const pad = n => n.toString().padStart(2,"0");

/* ====== i18n (kısa) ====== */
const I = {
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",
      hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Pre-Sale — Tek Kart Görünüm",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",
      stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile kazan.",
      token_title:"Tokonomi (Görsel)"},
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
      hero_lead:"Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high <b>utility</b>.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Single Card",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>."}
};

function applyLang(lang){
  localStorage.setItem("zuzu_lang", lang);
  $("#langCode").textContent = lang.toUpperCase();
  $("#langFlag").src = `flags/${lang}.png`;
  $$("[data-i]").forEach(el=>{
    const k = el.getAttribute("data-i");
    if(I[lang] && I[lang][k]) el.innerHTML = I[lang][k];
  });
}
(function initLang(){
  const saved = localStorage.getItem("zuzu_lang") || "tr";
  applyLang(saved);
  const btn=$("#langBtn"), menu=$("#langMenu");
  btn.addEventListener("click",(e)=>{e.stopPropagation(); menu.classList.toggle("show");});
  $$(".lang-opt").forEach(b=>b.addEventListener("click",(e)=>{e.stopPropagation();applyLang(b.dataset.lang);menu.classList.remove("show");}));
  document.addEventListener("click",(e)=>{ if(!menu.contains(e.target) && e.target!==btn) menu.classList.remove("show"); });
})();

/* ====== countdown (sabit tarih bozulmaz) ====== */
function tick(){
  const left = Math.max(0, CONFIG.launchAt - Date.now());
  const d=Math.floor(left/86400000);
  const h=Math.floor((left%86400000)/3600000);
  const m=Math.floor((left%3600000)/60000);
  const s=Math.floor((left%60000)/1000);
  $("#cdDays").textContent  = pad(d);
  $("#cdHours").textContent = pad(h);
  $("#cdMins").textContent  = pad(m);
  $("#cdSecs").textContent  = pad(s);
}
tick(); setInterval(tick,1000);

/* ====== NFT grid (10 adet) ====== */
(function renderNFTs(){
  const g=$("#nftGrid"); if(!g) return;
  g.innerHTML = Array.from({length:10}).map((_,i)=>`
    <div class="nft">
      <img src="assets/images/mask/${i}.png" alt="ZUZU #${i+1}" loading="lazy"
           onerror="this.style.display='none'">
      <div class="meta"><b>ZUZU #${i+1}</b><span class="tag">${i%5===0?'Legendary':(i%2?'Rare':'Epic')}</span></div>
    </div>`).join("");
})();

/* ====== Referral ====== */
(function ref(){
  const url = new URL(location.href);
  const ref = url.searchParams.get("ref");
  if(ref) localStorage.setItem("zuzu_ref", ref);
  const my = localStorage.getItem("zuzu_my") || "";
  const out = $("#refLink"); const copy = $("#copyRef");
  out.value = `${location.origin}${location.pathname}?ref=${my||'YOURCODE'}`;
  copy.addEventListener("click", ()=>{ navigator.clipboard.writeText(out.value); alert("Kopyalandı"); });
  const rn=$("#refNote"); const raddr = localStorage.getItem("zuzu_ref");
  rn.textContent = raddr ? `Aktif ref: ${raddr.slice(0,6)}...${raddr.slice(-4)} (başarılı alış başına +250 ZUZU)` : "Aktif ref yok.";
})();

/* ====== fiyat/maliyet ====== */
function activeWeek(){
  // istersen gerçek tarihle hesaplayabilirsin, şimdilik Week1 aktif
  return 0;
}
function updateCosts(){
  const qty = parseFloat($("#buyAmount").value||"0")||0;
  const price = CONFIG.weekPrices[activeWeek()];
  const usdt = qty * price;
  $("#costRow").innerHTML = `Seçilen hafta fiyatı: <b>${price.toFixed(3)}</b> USDT — Maliyet ≈ <b>${usdt.toFixed(2)}</b> USDT`;
}
$("#buyAmount").addEventListener("input", updateCosts); updateCosts();

/* ====== Wallet (MetaMask / Polygon) ====== */
let CURRENT_ADDR=null;

function hasMM(){ return typeof window.ethereum !== "undefined"; }

async function ensurePolygon(){
  const eth = window.ethereum;
  const cid = await eth.request({ method:"eth_chainId" });
  if(cid !== CONFIG.CHAIN_ID_HEX){
    try{
      await eth.request({ method:"wallet_switchEthereumChain", params:[{ chainId: CONFIG.CHAIN_ID_HEX }]});
    }catch(e){
      if(e.code===4902){
        await eth.request({ method:"wallet_addEthereumChain", params:[CONFIG.CHAIN_PARAMS]});
      }else{ throw e; }
    }
  }
}

async function connectMM(){
  if(!hasMM()){ alert("MetaMask not found. Please install MetaMask."); return; }
  await ensurePolygon();
  const [acc] = await ethereum.request({ method:"eth_requestAccounts" });
  CURRENT_ADDR = acc;
  localStorage.setItem("zuzu_my", acc);
  $("#connectBtn").textContent = `${acc.slice(0,6)}...${acc.slice(-4)}`;
  $("#disconnectBtn").style.display="inline-flex";
}

(function initWalletUI(){
  const btn=$("#connectBtn"), modal=$("#walletModal"), close=$("#wmClose"), mm=$("#mmBtn"), disc=$("#disconnectBtn");
  btn.addEventListener("click", ()=>{
    if(hasMM()){ connectMM(); }
    else { modal.classList.add("show"); }
  });
  mm.addEventListener("click", ()=>connectMM().then(()=>modal.classList.remove("show")));
  close.addEventListener("click", ()=>modal.classList.remove("show"));
  modal.addEventListener("click",(e)=>{ if(e.target===modal) modal.classList.remove("show"); });
  disc.addEventListener("click", ()=>{ CURRENT_ADDR=null; $("#connectBtn").textContent=I[localStorage.getItem("zuzu_lang")||"tr"].connect; localStorage.removeItem("zuzu_my"); disc.style.display="none"; });
})();

/* ====== Buy (backend'ten MATIC kotası + native transfer) ====== */
async function handleBuy(){
  const qty  = parseFloat($("#buyAmount").value||"0")||0;
  if(qty<=0) return alert("Geçerli miktar gir.");
  if(activeWeek()!==0) return alert("Şu an W1 aktif örnek yapı."); // istersen kaldır

  const price = CONFIG.weekPrices[0];
  const usdtCost = qty * price;

  if(!CURRENT_ADDR){ return alert("Önce MetaMask ile bağlan."); }

  // Backend'ten USDT->MATIC çevir ve native transfer başlat
  let maticAmt = null;
  try{
    const r = await fetch(`${CONFIG.backendUrl}/api/quote?usdt=${usdtCost}`).then(x=>x.json());
    maticAmt = r.matic; // string
  }catch(e){
    console.warn("quote fail", e);
  }

  if(!maticAmt){
    return alert("Fiyatlandırma servisi ulaşılamadı (backend). Lütfen daha sonra tekrar deneyin.");
  }

  // native transfer
  try{
    const tx = await ethereum.request({
      method:"eth_sendTransaction",
      params:[{
        from: CURRENT_ADDR,
        to: CONFIG.TREASURY,
        value: "0x" + BigInt(Math.floor(parseFloat(maticAmt)*1e18)).toString(16),
      }]
    });
    alert("Gönderildi. Tx: "+tx);
  }catch(e){
    console.error(e); alert("İşlem iptal/başarısız.");
  }
}

$("#buyBtn").addEventListener("click", handleBuy);

/* ====== küçük iyileştirmeler ====== */
$("#zuzuAddr").textContent = CONFIG.ZUZU_TOKEN.replace(/(.{6}).+(.{4})/,"$1…$2");
$("#treasuryAddr").textContent = CONFIG.TREASURY.replace(/(.{6}).+(.{4})/,"$1…$2");
