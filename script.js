/* ========= CONFIG ========= */
const CONFIG = {
  receiver: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3",  // USDT alıcı (senin adresin)
  usdt: {
    address: "0x55d398326f99059fF775485246999027B3197955", // BSC USDT
    decimals: 18
  },
  // Stage fiyatları (USDT / ZUZU) – 4 hafta
  stages: [
    { name: "Stage 1 — 0.0020 USDT / ZUZU", price: 0.0020 },
    { name: "Stage 2 — 0.0030 USDT / ZUZU", price: 0.0030 },
    { name: "Stage 3 — 0.0040 USDT / ZUZU", price: 0.0040 },
    { name: "Stage 4 — 0.0050 USDT / ZUZU", price: 0.0050 }
  ],
  // Hedef barı
  softCap: 300000,   // $ hedef
  raised: 12500,     // sahte başlangıç (güncelleyebilirsin)
  // Sayaç bitiş tarihi (TRT)
  endsAt: "2025-09-30T21:00:00+03:00"
};

/* ========= I18N ========= */
const I18N = {
  TR: {
    connect: "Cüzdan Bağla",
    hero_title: "ZUZU IS HERE",
    hero_sub: "Bir sonraki büyük meme coini iniş yaptı",
    day: "Gün", hour:"Saat", minute:"Dakika", second:"Saniye",
    presale: "Ön Satış Aşaması",
    stage: "Aşama",
    howmany: "Kaç ZUZU?",
    price: "Fiyat",
    total: "Toplam",
    buy_usdt: "USDT (BEP20) ile Satın Al",
    gas_hint: "Ödeme USDT (BEP20) ile doğrudan proje kasasına gider. Gas için az miktar BNB gerekir.",
    receiver_title: "Ödeme Alıcı Adresi",
    copy: "Kopyala",
    raised: "Toplanan",
    audit1:"Sözleşme: USDT (BEP20)",
    audit2:"Transfer →",
    audit3:"Non-custodial, direkt kasaya",
    transparency: "Şeffaflık",
    transparency_desc: "Satın alışlar USDT → Receiver olarak zincire kaydolur. Admin Panel üzerinden son işlemleri görebilirsin.",
    about: "Hakkında",
    about_desc: "ZUZU; meme maskot enerjisiyle minimal & ciddi duruşu birleştiren topluluk coinidir. Presale USDT (BEP20) ile direkt kasaya gider. CEX başvuruları presale bitiminde."
  },
  EN: {
    connect: "Connect Wallet",
    hero_title: "ZUZU IS HERE",
    hero_sub: "The next great meme coin has landed",
    day: "Days", hour:"Hours", minute:"Minutes", second:"Seconds",
    presale: "Presale Stage",
    stage: "Stage",
    howmany: "How many ZUZU?",
    price: "Price",
    total: "Total",
    buy_usdt: "Buy with USDT (BEP20)",
    gas_hint: "Payment goes directly to treasury in USDT (BEP20). Small BNB for gas needed.",
    receiver_title: "Receiver Address",
    copy: "Copy",
    raised: "Raised",
    audit1:"Contract: USDT (BEP20)",
    audit2:"Transfer →",
    audit3:"Non-custodial, direct to treasury",
    transparency: "Transparency",
    transparency_desc: "Purchases are on-chain as USDT → Receiver. You can view latest tx in Admin Panel.",
    about: "About",
    about_desc: "ZUZU combines meme energy with a minimal & serious stance. Presale funds go straight to treasury. CEX filings after presale."
  },
  PT:{...I18N_EN_TR("PT")}, RU:{...I18N_EN_TR("RU")}, ZH:{...I18N_EN_TR("ZH")}, HI:{...I18N_EN_TR("HI")}
};

// quick helper to mirror EN text for languages we haven't fully localized:
function I18N_EN_TR(code){
  const base = I18N.EN;
  return {
    connect: base.connect,
    hero_title: base.hero_title,
    hero_sub: base.hero_sub,
    day:"Days", hour:"Hours", minute:"Minutes", second:"Seconds",
    presale: base.presale, stage: base.stage, howmany: base.howmany,
    price: base.price, total: base.total, buy_usdt: base.buy_usdt,
    gas_hint: base.gas_hint, receiver_title: base.receiver_title,
    copy: "Copy", raised: base.raised,
    audit1: base.audit1, audit2: base.audit2, audit3: base.audit3,
    transparency: base.transparency, transparency_desc: base.transparency_desc,
    about: base.about, about_desc: base.about_desc
  };
}

/* ========= DOM ========= */
const $ = s => document.querySelector(s);
const langSelect = $("#langSelect");
const stageSelect = $("#stageSelect");
const inpAmount = $("#inpAmount");
const lblPrice = $("#lblPrice");
const lblTotal = $("#lblTotal");
const receiver = $("#receiver");
const rcvShort = $("#rcvShort");
const btnCopy = $("#btnCopy");
const lblRaised = $("#lblRaised");
const bar = $("#bar");
const y = $("#y");
const tDays = $("#tDays"), tHours=$("#tHours"), tMinutes=$("#tMinutes"), tSeconds=$("#tSeconds");

/* ========= INIT ========= */
y.textContent = new Date().getFullYear();
receiver.value = CONFIG.receiver;
rcvShort.textContent = shortAddr(CONFIG.receiver);

// Lang list
const LANGS = ["TR","EN","PT","RU","ZH","HI"];
LANGS.forEach(k=>{
  const o = document.createElement("option");
  o.value = k; o.textContent = k;
  langSelect.appendChild(o);
});
langSelect.value = "TR";
applyI18N("TR");

// Stages
CONFIG.stages.forEach((s,i)=>{
  const o = document.createElement("option");
  o.value = i; o.textContent = s.name;
  stageSelect.appendChild(o);
});
stageSelect.value = 0;
lblPrice.textContent = CONFIG.stages[0].price.toFixed(6);
calcTotal();

// Raised bar
updateRaised();

// Chips
document.querySelectorAll(".chip").forEach(c=>{
  c.addEventListener("click", ()=>{
    inpAmount.value = c.dataset.amt;
    calcTotal();
  });
});

inpAmount.addEventListener("input", calcTotal);
stageSelect.addEventListener("change", ()=>{
  lblPrice.textContent = CONFIG.stages[stageSelect.value].price.toFixed(6);
  calcTotal();
});

langSelect.addEventListener("change", ()=>{
  applyI18N(langSelect.value);
});

btnCopy.addEventListener("click", ()=>{
  navigator.clipboard.writeText(CONFIG.receiver).then(()=>{
    btnCopy.textContent = "✓";
    setTimeout(()=>btnCopy.textContent = btnCopy.dataset.i18n ? I18N[langSelect.value]["copy"] : "Copy", 800);
  });
});

// QR
drawQR(CONFIG.receiver);

// Countdown
setInterval(()=>{ updateCountdown(new Date(CONFIG.endsAt)); }, 1000);

// Connect + Buy
$("#btnConnect").addEventListener("click", connectWallet);
$("#btnBuy").addEventListener("click", buyWithUSDT);

/* ========= FUNCTIONS ========= */
function calcTotal(){
  const amt = Number(inpAmount.value || 0);
  const price = CONFIG.stages[stageSelect.value].price;
  const total = amt * price;
  lblTotal.textContent = (isFinite(total) ? total : 0).toFixed(6);
}

function updateRaised(){
  const raised = CONFIG.raised;
  const cap = CONFIG.softCap;
  const pct = Math.max(2, Math.min(100, (raised/cap)*100));
  bar.style.width = pct + "%";
  lblRaised.textContent = `$${fmt(raised)} / $${fmt(cap)}`;
}
function fmt(n){ return Number(n).toLocaleString('en-US'); }

function shortAddr(a){ return a.slice(0,6) + "…" + a.slice(-4); }

function applyI18N(code){
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const k = el.dataset.i18n;
    if (I18N[code] && I18N[code][k]) el.textContent = I18N[code][k];
  });
}

function drawQR(text){
  // lightweight QR: simple block canvas (tiny)
  const canvas = document.getElementById("qrcode");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle="#0e1735"; ctx.fillRect(0,0,140,140);
  // Simple pseudo-QR (placeholder) – gösterim için.
  // İstersen gerçek QR için: https://cdn.jsdelivr.net/npm/qrious
  ctx.fillStyle="#9cc7ff";
  for(let y=10;y<130;y+=10){
    for(let x=10;x<130;x+=10){
      if((x*y + text.length) % 17 < 8) ctx.fillRect(x,y,6,6);
    }
  }
}

/* ========== COUNTDOWN ========== */
function updateCountdown(end){
  const now = new Date();
  const diff = (end - now);
  let d=0,h=0,m=0,s=0;
  if (diff>0){
    d = Math.floor(diff/86400000);
    h = Math.floor((diff%86400000)/3600000);
    m = Math.floor((diff%3600000)/60000);
    s = Math.floor((diff%60000)/1000);
  }
  tDays.textContent = String(d).padStart(2,"0");
  tHours.textContent = String(h).padStart(2,"0");
  tMinutes.textContent = String(m).padStart(2,"0");
  tSeconds.textContent = String(s).padStart(2,"0");
}

/* ========== WALLET ========== */
async function connectWallet(){
  if (!window.ethereum){
    alert("MetaMask / TrustWallet gerekli.");
    return;
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  await ensureBSC(provider);
  const s = $("#btnConnect");
  const addr = await provider.getSigner().getAddress();
  s.textContent = shortAddr(addr);
}

async function ensureBSC(provider){
  const BSC = { chainId: "0x38", chainName:"BSC Mainnet", nativeCurrency:{name:"BNB", symbol:"BNB", decimals:18}, rpcUrls:["https://bsc-dataseed.binance.org/"], blockExplorerUrls:["https://bscscan.com"] };
  const net = await provider.getNetwork();
  if (net.chainId !== 56){
    try{
      await provider.provider.request({ method: "wallet_switchEthereumChain", params:[{chainId:"0x38"}] });
    }catch(e){
      if (e.code === 4902){
        await provider.provider.request({ method:"wallet_addEthereumChain", params:[BSC] });
      }else{
        throw e;
      }
    }
  }
}

async function buyWithUSDT(){
  const amtZUZU = Number(inpAmount.value || 0);
  if (!amtZUZU || amtZUZU<1){ alert("Miktar gir."); return; }

  if (!window.ethereum){ alert("MetaMask / TrustWallet gerekli."); return; }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  await ensureBSC(provider);

  const price = CONFIG.stages[stageSelect.value].price;
  const usdtTotal = amtZUZU * price; // USDT
  const signer = provider.getSigner();
  const USDT = new ethers.Contract(
    CONFIG.usdt.address,
    ["function transfer(address to, uint256 value) public returns (bool)","function decimals() view returns (uint8)"],
    signer
  );
  try{
    const d = await USDT.decimals();
    const val = ethers.utils.parseUnits(String(usdtTotal), d);
    const tx = await USDT.transfer(CONFIG.receiver, val);
    alert("İşlem gönderildi: " + tx.hash);
  }catch(err){
    console.error(err);
    alert("Transfer iptal edildi veya hata oluştu.");
  }
}
