/* ------------------------------------------------------
   ZUZU — App bootstrap (lang, countdown, buy, referral)
------------------------------------------------------ */

// ---- DİL: lang.js/<code>.json dosyalarını yükler
const SUPPORTED_LANGS = ["en","tr","fr","es","ru","pl"];
async function loadLang(code){
  const lang = SUPPORTED_LANGS.includes(code) ? code : "en";
  try{
    const res = await fetch(`/lang.js/${lang}.json?ts=${Date.now()}`, {cache:"no-store"});
    const dict = await res.json();
    document.querySelectorAll("[data-i]").forEach(el=>{
      const k = el.getAttribute("data-i");
      if(dict[k]) el.innerHTML = dict[k];
    });
    localStorage.setItem("zuzu_lang", lang);
  }catch(e){ console.warn("Lang load fail", e); }
}
function setupLangMenu(){
  const btn  = document.getElementById("langBtn");
  const menu = document.getElementById("langMenu");
  if(!btn || !menu) return;
  btn.addEventListener("click", ()=> menu.classList.toggle("open"));
  menu.querySelectorAll("[data-lang]").forEach(it=>{
    it.addEventListener("click", ()=>{
      loadLang(it.dataset.lang);
      menu.classList.remove("open");
    });
  });
  const saved = localStorage.getItem("zuzu_lang") || "en";
  loadLang(saved); // ilk açılışta uygula
}

// ---- Sayaç
function startCountdown(untilMs){
  const ids=["cdDays","cdHours","cdMins","cdSecs"];
  const pad=n=>n.toString().padStart(2,"0");
  function tick(){
    const left=Math.max(0, untilMs - Date.now());
    const d=Math.floor(left/86400000);
    const h=Math.floor((left%86400000)/3600000);
    const m=Math.floor((left%3600000)/60000);
    const s=Math.floor((left%60000)/1000);
    [d,h,m,s].forEach((v,i)=>{ const el=document.getElementById(ids[i]); if(el) el.textContent=pad(v); });
  }
  tick(); setInterval(tick,1000);
}

// ---- Satın alma (window.ZUZU_SOL: solana.v1.js)
function setupBuy(){
  const amountEl=document.getElementById("buyAmount");
  const methodEl=document.getElementById("payMethod"); // "SOL" | "USDT"
  const prices=[0.0050,0.0065,0.0080,0.0100]; // USDT per ZUZU

  async function buy(week){
    const qty=parseFloat((amountEl?.value||"0").toString().replace(/[^\d.]/g,""))||0;
    if(qty<=0) return alert("Enter a valid amount.");
    const cost=qty*prices[week];

    try{
      let sig="";
      if(methodEl?.value==="USDT"){ sig = await window.ZUZU_SOL.payUSDT(cost); }
      else {
        const rough=100; // örnek kur; backend ile güncelle
        sig = await window.ZUZU_SOL.paySOL(cost/rough);
      }
      alert("Payment sent!\nTx Signature:\n"+sig);
    }catch(e){ console.error(e); alert("Payment failed or rejected."); }
  }

  ["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
    document.getElementById(id)?.addEventListener("click", ()=>buy(i));
  });
}

// ---- Referral
function setupReferral(){
  const out=document.getElementById("refLink");
  if(!out) return;
  const pk = (window.__zuzu_pk && window.__zuzu_pk()) || "";
  const id = pk || ("guest-"+Math.random().toString(36).slice(2,8));
  const url=new URL(location.href); url.searchParams.set("ref", id);
  out.value=url.toString();
}

// ---- Başlat
window.addEventListener("DOMContentLoaded", ()=>{
  setupLangMenu();
  const target = (window.ZUZU_CONFIG && window.ZUZU_CONFIG.launchAt) || Date.now()+50*86400000;
  startCountdown(target);
  setupBuy();
  setupReferral();
});
