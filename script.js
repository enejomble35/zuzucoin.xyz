/* ====== ZUZU v5 – Front & Wallet ====== */

/* --- CONFIG --- */
const RECEIVER = "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3"; // senin USDT kasası
const USDT_BEP20 = "0x55d398326f99059fF775485246999027B3197955"; // BSC-Peg USDT
const USDT_DECIMALS = 18; // BSC-Peg USDT = 18
const BSC_PARAMS = {
  chainId: "0x38",
  chainName: "BNB Smart Chain",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: ["https://bsc-dataseed.binance.org/"],
  blockExplorerUrls: ["https://bscscan.com/"],
};

// stage fiyatları (haftalık)
const STAGES = [
  { name: "Stage 1 — 0.002000 USDT / ZUZU", price: 0.002000 },
  { name: "Stage 2 — 0.003000 USDT / ZUZU", price: 0.003000 },
  { name: "Stage 3 — 0.004000 USDT / ZUZU", price: 0.004000 },
  { name: "Stage 4 — 0.005000 USDT / ZUZU", price: 0.005000 },
];

/* --- I18N (TR/EN) --- */
const i18n = {
  tr: {
    connect: "Cüzdan Bağla",
    heroTitle: "ZUZU IS HERE",
    heroLead: "Bir sonraki büyük meme coini iniş yaptı",
    days: "Gün", hours: "Saat", mins: "Dakika", secs: "Saniye",
    presale: "Ön Satış Aşaması", stage: "Aşama", howMuch: "Kaç ZUZU?",
    price: "Fiyat:", total: "Toplam:", buy: "USDT (BEP20) ile Satın Al",
    gasHint: "Ödeme USDT (BEP20) ile doğrudan proje kasasına gider. Gas için az miktar BNB gerekir.",
    receiver: "Ödeme Alıcı Adresi", copy: "Kopyala",
    audit1: "Sözleşme: USDT (BEP20)",
    audit2: "Transfer →", audit3: "Non-custodial, direkt kasaya",
    transparency: "Şeffaflık",
    transparencyTxt: "Satın alışlar USDT → Receiver olarak zincire kaydolur. Admin Panel üzerinden son işlemleri görebilirsin.",
    raised: "Toplanan",
  },
  en: {
    connect: "Connect Wallet",
    heroTitle: "ZUZU IS HERE",
    heroLead: "The next great meme coin has landed",
    days: "Days", hours: "Hours", mins: "Mins", secs: "Secs",
    presale: "Presale Stage", stage: "Stage", howMuch: "How many ZUZU?",
    price: "Price:", total: "Total:", buy: "Buy with USDT (BEP20)",
    gasHint: "Payment goes directly to the project treasury in USDT (BEP20). A bit of BNB is required for gas.",
    receiver: "Receiver Address", copy: "Copy",
    audit1: "Contract: USDT (BEP20)",
    audit2: "Transfer →", audit3: "Non-custodial, direct treasury",
    transparency: "Transparency",
    transparencyTxt: "Purchases are recorded on-chain as Receiver transfers. You can view recent tx from the Admin Panel.",
    raised: "Raised",
  },
};
const LANGS = [["tr","TR"],["en","EN"]];

// helpers
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* --- Lang init --- */
(function initLang(){
  const sel = $("#lang"); LANGS.forEach(([k,l])=>{
    const o=document.createElement("option"); o.value=k; o.textContent=l; sel.appendChild(o);
  });
  const def = (navigator.language||"tr").slice(0,2); sel.value = LANGS.map(l=>l[0]).includes(def)?def:"tr";
  applyLang(sel.value); sel.onchange = e=>applyLang(e.target.value);
})();
function applyLang(k){
  const t = i18n[k];
  $$("[data-i18n]").forEach(n=>{ n.textContent = t[n.dataset.i18n] || n.textContent; });
}

/* --- Countdown (40 gün) --- */
(function initCountdown(){
  const end = Date.now() + 40*24*60*60*1000;
  const d=$("#d"),h=$("#h"),m=$("#m"),s=$("#s");
  setInterval(()=>{
    const r=end - Date.now(); const dd=Math.max(0, Math.floor(r/86400000));
    const hh=Math.max(0, Math.floor(r%86400000/3600000));
    const mm=Math.max(0, Math.floor(r%3600000/60000));
    const ss=Math.max(0, Math.floor(r%60000/1000));
    d.textContent=String(dd).padStart(2,"0");
    h.textContent=String(hh).padStart(2,"0");
    m.textContent=String(mm).padStart(2,"0");
    s.textContent=String(ss).padStart(2,"0");
  }, 1000);
})();

/* --- Mascot: blink + happy --- */
(function mascot(){
  const face = $("#face");
  setInterval(()=> face.classList.toggle("blink"), 3800);
  setInterval(()=> face.classList.toggle("happy"), 5200);
})();

/* --- Stage + Price calc --- */
(function initStage(){
  const sel = $("#stage");
  STAGES.forEach((s,i)=>{ const o=document.createElement("option"); o.value=i; o.textContent=s.name; sel.appendChild(o);});
  sel.value=0;
  calc();
  $("#amount").addEventListener("input", calc);
  $("#stage").addEventListener("change", calc);
  $$(".chip").forEach(c=> c.onclick = ()=>{ $("#amount").value = c.dataset.amt; calc(); });
})();
function calc(){
  const amt = Number($("#amount").value || 0);
  const price = STAGES[Number($("#stage").value)].price;
  $("#price").textContent = price.toFixed(6);
  $("#total").textContent = (amt*price).toFixed(6);
}

/* --- Receiver + QR --- */
(function initReceiver(){
  $("#receiver").value = RECEIVER;
  $("#short").textContent = RECEIVER.slice(0,6)+"…"+RECEIVER.slice(-4);
  $("#qr").src = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${RECEIVER}`;
  $("#copy").onclick = ()=>{ navigator.clipboard.writeText(RECEIVER); };
})();

/* --- Progress dummy (0/300k) --- */
(function progress(){
  const tgt=300000; let cur=0;
  const fill=$("#barFill"),txt=$("#raisedTxt");
  const tick=()=>{ cur=Math.min(cur+Math.random()*1200, 0); // şimdilik 0; gerçek admin panelde okuyacağız
    const pct = Math.min(100, (cur/tgt)*100); fill.style.width = pct+"%";
    txt.textContent = `$${cur.toLocaleString(undefined,{maximumFractionDigits:0})} / $${tgt.toLocaleString()}`;
  };
  tick();
})();

/* --- Wallet Connect + USDT transfer --- */
let provider, signer, account;
$("#btnConnect").onclick = connect;
$("#btnBuy").onclick = buy;

async function connect(){
  if(!window.ethereum){ alert("MetaMask / TrustWallet gerekli."); return; }
  provider = new ethers.providers.Web3Provider(window.ethereum);
  const net = await provider.getNetwork();
  if(net.chainId !== 56){
    try{ await window.ethereum.request({method:"wallet_switchEthereumChain", params:[{chainId:BSC_PARAMS.chainId}]}); }
    catch(e){
      if(e.code===4902){ await window.ethereum.request({method:"wallet_addEthereumChain", params:[BSC_PARAMS]}); }
      else throw e;
    }
  }
  await provider.send("eth_requestAccounts",[]);
  signer = provider.getSigner();
  account = await signer.getAddress();
  $("#btnConnect").textContent = account.slice(0,6)+"…"+account.slice(-4);
}

async function buy(){
  try{
    if(!signer) await connect();
    const amountZUZU = Number($("#amount").value||0);
    if(amountZUZU<=0) return alert("Miktar gir.");
    // ZUZU presale fiyatı -> kullanıcı USDT ödeyecek
    const price = STAGES[Number($("#stage").value)].price;
    const usdtToPay = ethers.utils.parseUnits((amountZUZU * price).toFixed(6), USDT_DECIMALS);

    const usdt = new ethers.Contract(USDT_BEP20, [
      "function transfer(address to, uint value) returns (bool)"
    ], signer);

    const tx = await usdt.transfer(RECEIVER, usdtToPay);
    $("#btnBuy").disabled = true; $("#btnBuy").textContent = "İşlem gönderildi…";
    await tx.wait();
    $("#btnBuy").textContent = "Tamamlandı ✔";
    $("#btnBuy").disabled = false;
    alert("Ödeme alındı. Teşekkürler!");
  }catch(err){
    console.error(err);
    alert(err?.message || "İşlem iptal edildi / hata.");
    $("#btnBuy").disabled = false; $("#btnBuy").textContent = "USDT (BEP20) ile Satın Al";
  }
}

/* --- Parallax küçük hareket --- */
window.addEventListener("mousemove", e=>{
  const x = (e.clientX/window.innerWidth - .5)*8;
  const y = (e.clientY/window.innerHeight - .5)*8;
  $("#face").style.transform = `translate(${x}px, ${y}px)`;
});
