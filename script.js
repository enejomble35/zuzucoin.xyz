/* ZUZU v4 – light theme, no blue/black */
const CFG_DEFAULT = {
  PROJECT: { name: "ZUZU", tagline: "AI-Powered Meme Intelligence", symbol: "ZUZU", decimals: 18 },
  PRESALE: {
    receiver: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3", // senin BEP20 USDT adresin (EVM format)
    networkName: "BSC",
    chainId: 56,
    stages: [
      { name: "Stage 1 — 0.002000 USDT / ZUZU", priceUsdt: 0.002000 },
      { name: "Stage 2 — 0.003000 USDT / ZUZU", priceUsdt: 0.003000 },
      { name: "Stage 3 — 0.004000 USDT / ZUZU", priceUsdt: 0.004000 },
      { name: "Stage 4 — 0.005000 USDT / ZUZU", priceUsdt: 0.005000 }
    ],
    endDate: "2025-09-30T21:00:00+03:00",
    goalUsd: 300000
  },
  I18N: {
    tr: {
      connect:"Cüzdan Bağla", heroTitle:"ZUZU IS HERE", heroLead:"Bir sonraki büyük meme coini iniş yaptı",
      days:"Gün", hours:"Saat", mins:"Dakika", secs:"Saniye",
      presale:"Ön Satış Aşaması", stage:"Aşama", howMuch:"Kaç ZUZU?", price:"Fiyat:", total:"Toplam:",
      buy:"USDT (BEP20) ile Satın Al", gasHint:"Ödeme USDT (BEP20) ile doğrudan proje kasasına gider. Gas için az miktar BNB gerekir.",
      receiver:"Ödeme Alıcı Adresi", copy:"Kopyala", audit1:"Sözleşme: USDT (BEP20)", audit2:"Transfer →", audit3:"Non-custodial, direkt kasaya",
      transparency:"Şeffaflık", transparencyTxt:"Satın alışlar USDT → Receiver olarak zincire kaydolur. Admin Panel üzerinden son işlemleri görebilirsin.",
      raised:"Toplanan", about:"Hakkında",
      aboutTxt:"ZUZU; meme maskot enerjisiyle minimal ve ciddi duruşu birleştiren topluluk coinidir. Presale USDT (BEP20) ile direkt kasaya gider. CEX başvuruları presale bitiminde."
    },
    en: {
      connect:"Connect Wallet", heroTitle:"ZUZU IS HERE", heroLead:"The next great meme coin has landed",
      days:"Days", hours:"Hours", mins:"Mins", secs:"Secs",
      presale:"Presale Stage", stage:"Stage", howMuch:"How many ZUZU?", price:"Price:", total:"Total:",
      buy:"Buy with USDT (BEP20)", gasHint:"Send USDT (BEP20) directly to treasury. A little BNB gas is required.",
      receiver:"Receiver Address", copy:"Copy", audit1:"Contract: USDT (BEP20)", audit2:"Transfer →", audit3:"Non-custodial, straight to treasury",
      transparency:"Transparency", transparencyTxt:"Purchases settle on-chain to Receiver. You can audit recent transfers on the Admin Panel.",
      raised:"Raised", about:"About",
      aboutTxt:"ZUZU blends meme energy with a serious, minimal stance. Presale funds go directly to treasury. CEX applications after presale."
    },
    pt:{...this?.tr}, ru:{...this?.tr}, zh:{...this?.tr}, hi:{...this?.tr}
  }
};

// --- utils
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const fmt = n => Number(n).toLocaleString(undefined,{minimumFractionDigits:6, maximumFractionDigits:6});
const short = a => a.slice(0,6)+"…"+a.slice(-4);

let CFG = CFG_DEFAULT;

// i18n init
const LANGS = [["tr","TR"],["en","EN"],["pt","PT"],["ru","RU"],["zh","ZH"],["hi","HI"]];
const langSel = $("#lang");
LANGS.forEach(([k,l])=>{ const o=document.createElement("option"); o.value=k; o.textContent=l; langSel.appendChild(o); });
langSel.value = (localStorage.getItem("zuzu_lang")||"tr");
function t(key){ const L = CFG.I18N[langSel.value]||CFG.I18N.tr; return L[key]||key; }
function applyI18N(){
  $$("[data-i18n]").forEach(el => el.textContent = t(el.dataset.i18n));
}
langSel.onchange = ()=>{ localStorage.setItem("zuzu_lang",langSel.value); applyI18N(); };

async function boot(){
  try{
    const res = await fetch("config.json",{cache:"no-store"});
    if(res.ok){ const j = await res.json(); CFG = {...CFG, ...j}; }
  }catch(e){}
  applyI18N();

  // stage list
  const stSel = $("#stage");
  CFG.PRESALE.stages.forEach((s,i)=>{
    const o=document.createElement("option");
    o.value=i; o.textContent=s.name; stSel.appendChild(o);
  });

  // receiver + qr
  const recv = CFG.PRESALE.receiver;
  $("#receiver").value = recv;
  $("#short").textContent = short(recv);
  $("#qr").src = "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data="+encodeURIComponent(recv);

  // calc
  const amount = $("#amount");
  const priceEl = $("#price");
  const totalEl = $("#total");
  function recalc(){
    const st = CFG.PRESALE.stages[+stSel.value||0];
    const p  = st.priceUsdt || 0;
    const n  = Math.max(0, parseInt(amount.value||0));
    priceEl.textContent = p.toFixed(6);
    totalEl.textContent = (p*n).toFixed(6);
  }
  recalc();
  stSel.onchange = recalc;
  amount.oninput = recalc;
  $$(".chip").forEach(c=>c.onclick=()=>{ amount.value=c.dataset.amt; recalc(); });

  // copy
  $("#copy").onclick = async ()=>{
    await navigator.clipboard.writeText(recv);
    $("#copy").textContent = langSel.value==="tr" ? "Kopyalandı!" : "Copied!";
    setTimeout(()=>$("#copy").textContent = t("copy"), 1200);
  };

  // countdown
  const end = new Date(CFG.PRESALE.endDate).getTime();
  setInterval(()=>{
    const now = Date.now(); let d=0,h=0,m=0,s=0;
    let rem = Math.max(0, end-now)/1000;
    d = Math.floor(rem/86400); rem -= d*86400;
    h = Math.floor(rem/3600);  rem -= h*3600;
    m = Math.floor(rem/60);    rem -= m*60;
    s = Math.floor(rem);
    $("#d").textContent = String(d).padStart(2,"0");
    $("#h").textContent = String(h).padStart(2,"0");
    $("#m").textContent = String(m).padStart(2,"0");
    $("#s").textContent = String(s).padStart(2,"0");
  },1000);

  // buy btn → basit modal yerine info
  $("#btnBuy").onclick = ()=>{
    const st = CFG.PRESALE.stages[+stSel.value||0];
    const n  = Math.max(0, parseInt($("#amount").value||0));
    const total = (n * st.priceUsdt).toFixed(6);
    alert(
      (langSel.value==="tr"
        ? `Cüzdanından USDT (BEP20) gönder:\n\nAlıcı: ${recv}\nTutar: ${total} USDT\n\nNot: Az miktar BNB gas gerekir.`
        : `Send USDT (BEP20) from your wallet:\n\nTo: ${recv}\nAmount: ${total} USDT\n\nNote: requires a little BNB gas.`)
    );
  };

  // raised (dummy; istersen admin panelden bağlarız)
  const raised = 0;
  $("#raisedTxt").textContent = `$${raised.toLocaleString()} / $${CFG.PRESALE.goalUsd.toLocaleString()}`;
  $("#barFill").style.width = Math.min(100, (raised/CFG.PRESALE.goalUsd)*100) + "%";

  // connect wallet (opsiyonel)
  $("#btnConnect").onclick = async ()=>{
    if(!window.ethereum){ alert(langSel.value==="tr"?"MetaMask/TrustWallet gerekli.":"MetaMask/TrustWallet required."); return; }
    try{
      await ethereum.request({ method: 'eth_requestAccounts' });
      // BSC'ye geç
      await ethereum.request({ method:'wallet_switchEthereumChain', params:[{ chainId:'0x38' }] });
      $("#btnConnect").textContent = "Bağlandı";
    }catch(e){ console.log(e); }
  };
}
boot();
