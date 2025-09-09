/* ====== ZUZU – Global Config ====== */
const CONFIG = {
  // launchAt kalıcı olsun: ilk kez hesapla ve localStorage’a yaz
  get launchAt(){
    const LS_KEY = "zuzu_launch_at";
    let ts = Number(localStorage.getItem(LS_KEY)||0);
    if(!ts || ts < Date.now()){ // ilk kurulum: bugünden 82 gün sonra değil -> sabit tarih istersen değiştir
      // örnek sabit tarih: 2025-12-01 UTC
      ts = Date.parse("2025-12-01T00:00:00Z");
      localStorage.setItem(LS_KEY, String(ts));
    }
    return ts;
  },
  saleStart: Date.now(), // aktif hafta göstergesi için
  weekPrices: [0.0050,0.0065,0.0080,0.0100], // USDT
  collectionUrl: "https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a/contract/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts",
  ownerSol: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF",
  nfts: [
    { id:0, name:"ZUZU Hero",      rarity:"Epic",      supply:200 },
    { id:1, name:"ZUZU Rogue",     rarity:"Rare",      supply:2500 },
    { id:2, name:"ZUZU Berserker", rarity:"Epic",      supply:800 },
    { id:3, name:"ZUZU Hacker",    rarity:"Rare",      supply:600 },
    { id:4, name:"ZUZU Sorceress", rarity:"Epic",      supply:750 },
    { id:5, name:"ZUZU Warrior",   rarity:"Rare",      supply:900 },
    { id:6, name:"ZUZU Maiden",    rarity:"Rare",      supply:1100 },
    { id:7, name:"ZUZU Ranger",    rarity:"Rare",      supply:1000 },
    { id:8, name:"ZUZU Scientist", rarity:"Epic",      supply:1100 },
    { id:9, name:"ZUZU Titan",     rarity:"Legendary", supply:250 }
  ]
};

/* ====== Dil ====== */
function applyLang(lang){
  const dict = window.I?.[lang] || window.I?.en;
  document.querySelectorAll("[data-i]").forEach(el=>{
    const k = el.getAttribute("data-i");
    if(dict && dict[k]) el.innerHTML = dict[k];
  });
  // buton etiket/ikon
  const btn = document.getElementById("langBtn");
  if(btn){ btn.querySelector("span").textContent = (lang||"en").toUpperCase();
           const flag = document.getElementById("flagIcon");
           if(flag) flag.src = `flags/${lang}.png`; }
  localStorage.setItem("zuzu_lang", lang);
}
function initLang(){
  const dd = document.getElementById("langDropdown");
  const menu = document.getElementById("langMenu");
  const btn  = document.getElementById("langBtn");
  btn?.addEventListener("click", ()=> dd.classList.toggle("open"));
  menu?.querySelectorAll("button").forEach(b=>{
    b.addEventListener("click", ()=>{
      dd.classList.remove("open");
      applyLang(b.dataset.lang);
    });
  });
  document.addEventListener("click",(e)=>{
    if(!dd.contains(e.target)) dd.classList.remove("open");
  });
  const saved = localStorage.getItem("zuzu_lang") || "en";
  applyLang(saved);
}

/* ====== Sayaç ====== */
function tick(){
  const left = Math.max(0, CONFIG.launchAt - Date.now());
  const d = Math.floor(left / 86400000);
  const h = Math.floor((left % 86400000) / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  const pad = n => n.toString().padStart(2,"0");
  [["cdDays",d],["cdHours",h],["cdMins",m],["cdSecs",s]].forEach(([id,v])=>{
    const el = document.getElementById(id);
    if (el) el.textContent = pad(v);
  });
}

/* ====== Presale haftası / maliyet ====== */
function getActiveWeek(){
  const days = Math.floor((Date.now() - CONFIG.saleStart) / 86400000);
  if (days < 7)  return 0;
  if (days < 14) return 1;
  if (days < 21) return 2;
  return 3;
}
function updateActiveWeekUI(){
  const w = getActiveWeek();
  for(let i=0;i<4;i++){
    const btn = document.getElementById("buyW"+i);
    if (!btn) continue;
    if (i === w) { btn.disabled = false; btn.classList.add("active-week"); }
    else { btn.disabled = true; btn.classList.remove("active-week"); }
  }
}
function updateCosts(){
  const qty = parseFloat((document.getElementById("buyAmount")?.value||"0").toString().replace(/[^\d.]/g,"")) || 0;
  CONFIG.weekPrices.forEach((p,i)=>{
    const costEl  = document.getElementById("c"+i);
    const cost = qty * p;
    if (costEl) costEl.textContent = (isFinite(cost)?cost:0).toLocaleString();
  });
}

/* ====== NFT Grid ====== */
function renderNFTs(){
  const g = document.getElementById("nftGrid"); if(!g) return;
  let html = "";
  CONFIG.nfts.forEach(n=>{
    const img = `assets/images/mask/${n.id}.png`;
    const link = `${CONFIG.collectionUrl}?tokenId=${n.id}`;
    html += `
      <div class="nft">
        <img src="${img}" alt="${n.name}" loading="lazy" onerror="this.style.display='none'">
        <div class="meta">
          <div>
            <b>${n.name}</b>
            <div style="color:#9fb6e6;font-size:.9rem">Supply: ${n.supply.toLocaleString()}</div>
          </div>
          <span class="tag">${n.rarity}</span>
        </div>
        <a class="z-btn z-btn-ghost" style="margin:0 10px 10px" href="${link}" target="_blank" rel="noopener">View ↗</a>
      </div>`;
  });
  g.innerHTML = html;
}

/* ====== Referral ====== */
function initReferral(){
  const addr = (localStorage.getItem("ph_addr_b58")||"").slice(0,44); // Phantom kaydından kısalt
  const base = location.origin + location.pathname.replace(/index\.html?$/,"");
  const my = new URL(base, location.href);
  const ref = addr || "your-wallet";
  my.searchParams.set("ref", ref);
  const i = document.getElementById("refLink"); if(i) i.value = my.toString();
  document.getElementById("copyRef")?.addEventListener("click",()=>{
    i.select(); i.setSelectionRange(0,99999);
    document.execCommand("copy");
    const n = document.getElementById("refCopyNote"); if(n){ n.style.display="block"; setTimeout(()=>n.style.display="none",1200); }
  });
}

/* ====== Buy (demo: sadece yönlendir / uyar) ====== */
async function handleBuy(weekIndex){
  const qty = parseFloat((document.getElementById("buyAmount")?.value||"0").toString().replace(/[^\d.]/g,"")) || 0;
  if (qty <= 0) { alert("Enter a valid amount."); return; }
  const active = getActiveWeek();
  if (weekIndex !== active) { alert("This week is not active."); return; }
  const pay = document.getElementById("payAsset")?.value || "SOL";
  alert(`Demo flow\nAmount: ${qty} ZUZU\nPay: ${pay}\n\nOn-chain transfer işlemleri SPL (USDT) / SOL için ayrı sözleşmede yapılır.`);
}

/* ====== Init ====== */
window.addEventListener("DOMContentLoaded", ()=>{
  // Dil
  initLang();

  // Sayaç
  tick(); setInterval(tick, 1000);

  // Presale UI
  updateActiveWeekUI();
  document.getElementById("buyAmount")?.addEventListener("input", updateCosts);
  ["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
    document.getElementById(id)?.addEventListener("click", ()=>handleBuy(i));
  });
  updateCosts();

  // NFT
  renderNFTs();

  // Referral
  initReferral();
});
