/* =========================
   ZUZU – Config + I18N + UI
========================= */

// ---- Temel Config (gerekirse değiştir) ----
window.CONFIG = window.CONFIG || {
  ownerSol: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF",
  usdtMint: "Es9vMFrzaCERa7eBwbxe9jH9n1t42AT3zh7TBTtRkP4d", // USDT (SPL)
  collectionUrl:
    "https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a/contract/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts",
  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100],
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

// ---- Sayaç: 50 gün “bir kere” ayarla, sonra sabit kalsın ----
(function setupCountdown(){
  let la = Number(localStorage.getItem("zuzu_launchAt") || 0);
  if (!la || Number.isNaN(la) || la < Date.now()) {
    la = Date.now() + 50 * 86400000;
    localStorage.setItem("zuzu_launchAt", String(la));
  }
  CONFIG.launchAt = la;
})();
function tick(){
  const left = Math.max(0, (CONFIG.launchAt||0) - Date.now());
  const d = Math.floor(left/86400000),
        h = Math.floor((left%86400000)/3600000),
        m = Math.floor((left%3600000)/60000),
        s = Math.floor((left%60000)/1000);
  const pad=(n)=>String(n).padStart(2,"0");
  [["cdDays",d],["cdHours",h],["cdMins",m],["cdSecs",s]].forEach(([id,v])=>{
    const el = document.getElementById(id); if(el) el.textContent = pad(v);
  });
}
setInterval(tick,1000); tick();

// ---- I18N (EN/TR/FR/RU/PL) ----
const I = {
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
      hero_lead:"Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high <b>utility</b>.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",collection_page:"Collection Page",contract:"Contract:",
      days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",amount:"Amount (ZUZU)",
      w1:"Week 1 (Cheapest)",w2:"Week 2",w3:"Week 3",w4:"Week 4 (Last Chance)",cost:"Cost:",buy:"Buy",exchanges:"Supported Exchanges",
      invite_t:"Invite & Earn", invite_p:"Share your personal link. When friends buy, you both win extra ZUZU.", invite_btn:"Copy my invite link"},
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",
      hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",collection_page:"Koleksiyon Sayfası",contract:"Kontrat:",
      days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",amount:"Miktar (ZUZU)",
      w1:"1. Hafta (En Ucuz)",w2:"2. Hafta",w3:"3. Hafta",w4:"4. Hafta (Son Fırsat)",cost:"Maliyet:",buy:"Satın Al",exchanges:"Desteklenen Borsalar",
      invite_t:"Davet Et & Kazan", invite_p:"Kişisel linkini paylaş. Arkadaşların aldıkça ikiniz de ekstra ZUZU kazanırsınız.", invite_btn:"Davet linkimi kopyala"},
  fr:{invite_t:"Inviter & Gagner", invite_p:"Partagez votre lien…", invite_btn:"Copier mon lien"},
  ru:{invite_t:"Пригласи и заработай", invite_p:"Делись персональной ссылкой…", invite_btn:"Скопировать ссылку"},
  pl:{invite_t:"Zaproś i Zarabiaj", invite_p:"Udostępnij swój link…", invite_btn:"Kopiuj mój link"}
};
function applyLang(lang="en"){
  const pack = I[lang] || I.en;
  document.querySelectorAll("[data-i]").forEach(el=>{
    const k = el.getAttribute("data-i");
    if (pack[k]) el.innerHTML = pack[k];
  });
  document.querySelectorAll(".lang-flag").forEach(f=>f.classList.toggle("active", f.dataset.lang===lang));
  localStorage.setItem("zuzu_lang", lang);
}
(function initLangMenu(){
  let menu = document.getElementById("langMenu");
  if (!menu) { // yoksa otomatik oluştur
    const connect = document.getElementById("connectBtn");
    const wrapper = document.createElement("div");
    wrapper.className="lang-menu"; wrapper.id="langMenu";
    wrapper.innerHTML = `
      <button type="button" class="lang-trigger"><img src="flags/en.png" onerror="this.src='flags/en.jpg'"><span>EN</span></button>
      <ul>
        <li class="lang-flag" data-lang="en"><img src="flags/en.png" onerror="this.src='flags/en.jpg'"> EN</li>
        <li class="lang-flag" data-lang="tr"><img src="flags/tr.png" onerror="this.src='flags/tr.jpg'"> TR</li>
        <li class="lang-flag" data-lang="fr"><img src="flags/fr.png" onerror="this.src='flags/fr.jpg'"> FR</li>
        <li class="lang-flag" data-lang="ru"><img src="flags/ru.png" onerror="this.src='flags/ru.jpg'"> RU</li>
        <li class="lang-flag" data-lang="pl"><img src="flags/pl.png" onerror="this.src='flags/pt.png'"> PL</li>
      </ul>`;
    connect?.parentNode?.insertBefore(wrapper, connect);
    menu = wrapper;
  }
  menu.addEventListener("click",(e)=>{
    const li = e.target.closest(".lang-flag");
    if (!li) { menu.classList.toggle("show"); return; }
    applyLang(li.dataset.lang);
    menu.classList.remove("show");
  });
  document.addEventListener("click",(e)=>{ if(!e.target.closest("#langMenu")) menu.classList.remove("show"); });
  applyLang(localStorage.getItem("zuzu_lang") || "en");
})();

// ---- NFT Grid ----
(function renderNFTs(){
  const g = document.getElementById("nftGrid"); if(!g) return;
  g.innerHTML = CONFIG.nfts.map(n=>`
    <div class="nft">
      <img src="assets/images/mask/${n.id}.png"
           onerror="this.onerror=null;this.src='assets/images/branding/zuzu-logo.png';"
           alt="${n.name}">
      <div class="meta">
        <div><b>${n.name}</b><div style="color:#9fb6e6">${n.rarity}</div></div>
        <span class="tag">${n.supply.toLocaleString()}</span>
      </div>
      <a class="z-btn z-btn-ghost" style="margin:0 10px 10px" href="${CONFIG.collectionUrl}?tokenId=${n.id}" target="_blank" rel="noopener">View ↗</a>
    </div>
  `).join("");
})();

// ---- Aktif hafta / maliyet hesap ----
function saleStart(){ const s = Number(localStorage.getItem("zuzu_saleStart")) || Date.now(); localStorage.setItem("zuzu_saleStart", String(s)); return s; }
function activeWeek(){
  const days = Math.floor((Date.now() - saleStart())/86400000);
  return (days<7)?0:(days<14)?1:(days<21)?2:3;
}
function updateActiveWeekUI(){
  const w = activeWeek();
  for(let i=0;i<4;i++){
    const b=document.getElementById("buyW"+i); if(!b) continue;
    if(i===w){ b.disabled=false; b.classList.add("active-week"); }
    else{ b.disabled=true; b.classList.remove("active-week"); }
  }
}
function updateCosts(){
  const qty = parseFloat((document.getElementById("buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  CONFIG.weekPrices.forEach((p,i)=>{
    const pe=document.getElementById("p"+i), ce=document.getElementById("c"+i);
    if(pe) pe.textContent = p.toFixed(4);
    if(ce) ce.textContent = (qty*p).toFixed(2);
  });
}
document.getElementById("buyAmount")?.addEventListener("input", updateCosts);
updateActiveWeekUI(); updateCosts();

// ---- Invite / Referans ----
(function inviteBox(){
  if(document.getElementById("inviteBox")) return;
  const sec = document.createElement("section");
  sec.id="inviteBox"; sec.className="z-section";
  sec.innerHTML = `<div class="z-container">
    <div class="section-head"><h2 data-i="invite_t">Invite & Earn</h2>
    <p data-i="invite_p">Share your personal link. When friends buy, you both win extra ZUZU.</p></div>
    <div class="card" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <input id="inviteLink" class="input" style="flex:1" readonly>
      <button id="inviteCopy" class="z-btn z-btn-primary" data-i="invite_btn">Copy my invite link</button>
    </div></div>`;
  document.body.appendChild(sec);

  const code = localStorage.getItem("zuzu_ref") ||
               localStorage.getItem("zuzu_pk") ||
               Math.random().toString(36).slice(2,8).toUpperCase();
  localStorage.setItem("zuzu_ref", code);
  const link = `${location.origin}${location.pathname}?ref=${encodeURIComponent(code)}`;
  document.getElementById("inviteLink").value = link;
  document.getElementById("inviteCopy").addEventListener("click", async ()=>{
    try{ await navigator.clipboard.writeText(link); const b=document.getElementById("inviteCopy"); b.textContent="Copied!"; setTimeout(()=>applyLang(localStorage.getItem("zuzu_lang")||"en"),900);}catch{}
  });
  const qp = new URLSearchParams(location.search);
  const from = qp.get("ref"); if(from) localStorage.setItem("zuzu_referred_by", from);
})();

// ---- Satın alma (SOL / USDT) ----
async function handleBuy(weekIndex){
  const qty = parseFloat((document.getElementById("buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  if (qty<=0) return alert("Enter a valid amount.");
  const price = CONFIG.weekPrices[weekIndex] ?? CONFIG.weekPrices[activeWeek()];
  const payWith = (document.getElementById("payWith")?.value || "USDT").toUpperCase(); // USDT or SOL
  const costUSDT = qty * price;
  if (payWith==="SOL") {
    const ok = await window.__zuzu_buySOL?.(costUSDT);
    if(ok) alert("Purchase sent with SOL.");
  } else {
    const ok = await window.__zuzu_buyUSDT?.(costUSDT);
    if(ok) alert("Purchase sent with USDT (SPL).");
  }
}
["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
  const b=document.getElementById(id); if(!b) return; b.addEventListener("click",()=>handleBuy(i));
});
