/* ===============================
   GLOBAL KONFİG
=============================== */
window.ZUZU_CONFIG = {
  // *** Ödeme alıcı SOL adresi ***
  ownerSol: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF",

  // Ön satış hedef tarihi (yerelden bağımsız ISO)
  launchAtISO: "2025-11-05T13:00:00Z",

  // NFT görselleri (var olmayanı otomatik gizlemeyeceğiz; yerine hero koyarız)
  nftImages: [
    "assets/images/nft/1.png","assets/images/nft/2.png","assets/images/nft/3.png",
    "assets/images/nft/4.png","assets/images/nft/5.png","assets/images/nft/6.png"
  ],

  // Diller (flags/xx.png ve lang/xx.json dosyaları mevcut)
  languages: [
    {code:"tr", name:"Türkçe", flag:"flags/tr.png"},
    {code:"en", name:"English", flag:"flags/en.png"},
    {code:"fr", name:"Français", flag:"flags/fr.png"},
    {code:"pt", name:"Português", flag:"flags/pt.png"},
    {code:"ru", name:"Русский", flag:"flags/ru.png"},
  ],
};

/* ===============================
   DİL SİSTEMİ
=============================== */
const I18N = {
  current: "tr",
  dict: {},
  async set(code){
    try{
      const res = await fetch(`lang/${code}.json?${Date.now()}`);
      const data = await res.json();
      I18N.dict = data; I18N.current = code;
      // Uygula
      document.querySelectorAll("[data-i18n]").forEach(el=>{
        const k = el.getAttribute("data-i18n");
        if(data[k]) el.innerHTML = data[k];
      });
      // Bayrak ve kod
      const meta = ZUZU_CONFIG.languages.find(l=>l.code===code);
      if(meta){
        document.getElementById("langFlag").src = meta.flag;
        document.getElementById("langCode").textContent = code.toUpperCase();
      }
      localStorage.setItem("zuzu_lang", code);
    }catch(e){ console.error("Lang load error", e); }
  },
  buildMenu(){
    const wrap = document.getElementById("langDrop");
    wrap.innerHTML = "";
    ZUZU_CONFIG.languages.forEach(l=>{
      const b = document.createElement("button");
      b.innerHTML = `<img src="${l.flag}" width="18" height="18" alt="${l.code}"><span>${l.name}</span>`;
      b.onclick = ()=>{ wrap.style.display="none"; I18N.set(l.code); };
      wrap.appendChild(b);
    });
    document.getElementById("langBtn").onclick = ()=>{
      wrap.style.display = wrap.style.display==="block"?"none":"block";
    };
    document.addEventListener("click",(e)=>{
      if(!document.getElementById("langMenu").contains(e.target)) wrap.style.display="none";
    });
    // önceki seçim
    I18N.set(localStorage.getItem("zuzu_lang") || "tr");
  }
};

/* ===============================
   GÖRSELLER & NFT GRID
=============================== */
function buildNFTGrid(){
  const grid = document.getElementById("nftGrid");
  if(!grid) return;
  grid.innerHTML = "";
  ZUZU_CONFIG.nftImages.forEach((src,i)=>{
    const card = document.createElement("div");
    card.className = "nft";
    card.innerHTML = `
      <img src="${src}" alt="NFT #${i+1}" onerror="this.src='assets/images/branding/zuzu-hero.png'">
      <div class="meta"><span>#${String(i+1).padStart(3,"0")}</span><span class="tag">ZUZU</span></div>
    `;
    grid.appendChild(card);
  });
}

/* ===============================
   COUNTDOWN
=============================== */
function startCountdown(){
  const target = new Date(ZUZU_CONFIG.launchAtISO).getTime();
  function tick(){
    const now = Date.now();
    let diff = Math.max(0, target - now);
    const d = Math.floor(diff/86400000); diff -= d*86400000;
    const h = Math.floor(diff/3600000); diff -= h*3600000;
    const m = Math.floor(diff/60000);   diff -= m*60000;
    const s = Math.floor(diff/1000);
    const set = (id,v)=>{ const el=document.getElementById(id); if(el) el.textContent=String(v).padStart(2,"0"); };
    set("cdDays",d); set("cdHours",h); set("cdMins",m); set("cdSecs",s);
    requestAnimationFrame(tick);
  }
  tick();
}

/* ===============================
   WALLET UI KANCALARI
=============================== */
function wireWalletButtons(){
  const clickers = ["connectBtn","btnConnect"].map(id=>document.getElementById(id)).filter(Boolean);
  clickers.forEach(btn=>btn.addEventListener("click", ()=>WalletLite.openPicker()));
  const disc = document.getElementById("btnDisconnect");
  if(disc) disc.onclick = ()=>WalletLite.disconnect();
  // satın al
  document.querySelectorAll(".buyBtn").forEach(b=>{
    b.addEventListener("click", async ()=>{
      const amount = Number(document.getElementById("amountIn").value||"0");
      const pay = document.getElementById("paySel").value;
      await ZUZU_SOL.buyTokens(amount, pay);
    });
  });
}

/* ===============================
   PAGE INIT
=============================== */
window.addEventListener("DOMContentLoaded", ()=>{
  I18N.buildMenu();
  buildNFTGrid();
  startCountdown();
  wireWalletButtons();
  // büyük görsel fallback zaten HTML'de
});
