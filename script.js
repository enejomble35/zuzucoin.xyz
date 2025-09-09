<script>
/* ZUZU – UI (dil, sayaç, satın alma hesaplama, NFT grid, ref link, stake hesap) */

// --- Config ---
const SALE_END = Date.parse("2025-12-31T23:59:59Z"); // geri sayım için sabit tarih
const WEEK_PRICES = [0.0050, 0.0065, 0.0080, 0.0100]; // USDT
const NFT_LIST = [
  {name:"ZUZU Hero",      img:"assets/images/nft/hero.png",      tag:"+5%"},
  {name:"ZUZU Rogue",     img:"assets/images/nft/rogue.png",     tag:"+8%"},
  {name:"ZUZU Berserker", img:"assets/images/nft/berserker.png", tag:"+10%"},
  {name:"ZUZU Hacker",    img:"assets/images/nft/hacker.png",    tag:"+6%"},
  {name:"ZUZU Sorceress", img:"assets/images/nft/sorceress.png", tag:"+9%"},
  {name:"ZUZU Warrior",   img:"assets/images/nft/warrior.png",   tag:"+7%"},
  {name:"ZUZU Maiden",    img:"assets/images/nft/maiden.png",    tag:"+5%"},
  {name:"ZUZU Scientist", img:"assets/images/nft/scientist.png", tag:"+9%"},
  {name:"ZUZU Titan",     img:"assets/images/nft/titan.png",     tag:"+12%"},
  {name:"ZUZU Guardian",  img:"assets/images/nft/guardian.png",  tag:"+4%"},
];

// --- i18n (kısa metinler) ---
const I18N = {
  en: {
    nav_presale:"Pre-Sale", nav_stake:"Stake", nav_nft:"NFT Rewards",
    nav_roadmap:"Roadmap", nav_token:"Tokenomics", connect:"Connect Wallet",
    hero_badge:"Pre-Sale • Stake to Win NFT",
    hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
    hero_lead:"Stake and win ZUZU Maskot NFT. Limited supply, high utility.",
    cta_stake:"Start Staking", cta_nft:"NFT Rewards",
    collection_page:"Collection Page", contract:"Contract:",
    days:"DAYS", hours:"HOURS", mins:"MINUTES", secs:"SECONDS",
    presale_title:"Pre-Sale — Countdown",
    presale_lead:"Get ready for ZUZU pre-sale! Limited allocation, community price.",
    amount:"Amount (ZUZU)", paywith:"Pay with", cost:"Cost:",
    w1:"Week 1 (Cheapest)", w2:"Week 2", w3:"Week 3", w4:"Week 4 (Last Chance)",
    buy:"Buy", exchanges:"Supported Exchanges",
    stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",
    stake_lead:"Lock your ZUZU, earn APY + NFT BOOST. Early stakers get badge & airdrop priority.",
    calc_title:"Earnings Calculator", amount2:"Amount (ZUZU)", lock:"Lock Period",
    nft_have:"Have NFT?", early:"Early Badge", calc_btn:"Calculate",
    ret:"Total Return", avg:"Monthly Avg", boost:"Total Boost",
    token_title:"Tokenomics (Visualized)", road_title:"Roadmap",
    road_lead:"Clear plan focused on community, staking, NFT drops, listings."
  },
  tr: {
    nav_presale:"Ön Satış", nav_stake:"Stake", nav_nft:"NFT Ödülleri",
    nav_roadmap:"Yol Haritası", nav_token:"Tokonomi", connect:"Cüzdan Bağla",
    hero_badge:"Ön Satış • NFT kazanmak için stake et",
    hero_title:"ZUZU — Robotik Kirpi 🦔⚡",
    hero_lead:"Stake et, ZUZU Maskot NFT kazan. Sınırlı arz, yüksek fayda.",
    cta_stake:"Stakeye Başla", cta_nft:"NFT Ödülleri",
    collection_page:"Koleksiyon Sayfası", contract:"Kontrat:",
    days:"GÜN", hours:"SAAT", mins:"DAKİKA", secs:"SANİYE",
    presale_title:"Ön Satış — Geri Sayım",
    presale_lead:"ZUZU ön satışına hazırlan! Sınırlı allocation, topluluk fiyatı.",
    amount:"Miktar (ZUZU)", paywith:"Ödeme", cost:"Tutar:",
    w1:"1. Hafta (En Ucuz)", w2:"2. Hafta", w3:"3. Hafta", w4:"4. Hafta (Son Şans)",
    buy:"Satın Al", exchanges:"Desteklenen Borsalar",
    stake_title:"Stake Pro — Kilitle, Kazan, NFT Al ✨",
    stake_lead:"ZUZU kilitle, APY + NFT BOOST kazan. Erken kullanıcıya rozet & airdrop önceliği.",
    calc_title:"Kazanç Hesaplayıcı", amount2:"Miktar (ZUZU)", lock:"Kilitleme Süresi",
    nft_have:"NFT Var mı?", early:"Erken Rozet", calc_btn:"Hesapla",
    ret:"Toplam Getiri", avg:"Aylık Ortalama", boost:"Toplam Boost",
    token_title:"Tokonomi (Görselleştirilmiş)", road_title:"Yol Haritası",
    road_lead:"Topluluk, stake, NFT dağıtımları ve listelemelere odaklı net plan."
  },
  fr:{...I18N?.en}, es:{...I18N?.en}, ru:{...I18N?.en}, pl:{...I18N?.en}
};

// --- helpers ---
const $ = (s,sc=document)=>sc.querySelector(s);
const $$ = (s,sc=document)=>[...sc.querySelectorAll(s)];
function shortAddr(pk){ if(!pk) return ""; const a=pk.toString(); return a.slice(0,4)+"…"+a.slice(-4); }

// --- Dil uygulama ---
function applyLang(code){
  const dict = I18N[code] || I18N.en;
  $$("[data-i]").forEach(el=>{
    const key = el.getAttribute("data-i");
    if(dict[key]) el.textContent = dict[key];
  });
  $("#langCode").textContent = code.toUpperCase();
  $("#langFlag").src = `flags/${code}.png`;
  localStorage.setItem("zuzu_lang", code);
}

// --- Sayaç ---
function startCountdown(){
  function tick(){
    const now = Date.now();
    let diff = Math.max(0, SALE_END - now);
    const d = Math.floor(diff/86400000); diff-=d*86400000;
    const h = Math.floor(diff/3600000);  diff-=h*3600000;
    const m = Math.floor(diff/60000);    diff-=m*60000;
    const s = Math.floor(diff/1000);
    $("#cdDays").textContent  = String(d).padStart(2,"0");
    $("#cdHours").textContent = String(h).padStart(2,"0");
    $("#cdMins").textContent  = String(m).padStart(2,"0");
    $("#cdSecs").textContent  = String(s).padStart(2,"0");
  }
  tick(); setInterval(tick, 1000);
}

// --- Satın alma kutuları (tutar hesap) ---
function recalcCosts(){
  const amt = parseFloat($("#buyAmount").value || "0");
  const unit = $("#currencySel").value; // sadece yazı için
  $$(".unit").forEach(u=>u.textContent = unit==="SOL" ? "SOL" : "USDT");
  WEEK_PRICES.forEach((p, i)=>{
    const cost = (amt * p);
    $(`#c${i}`).textContent = isFinite(cost) ? cost.toFixed(4) : "0";
  });
}

// --- NFT Grid doldur ---
function renderNFTs(){
  const grid = $("#nftGrid");
  grid.innerHTML = "";
  NFT_LIST.forEach(n=>{
    const card = document.createElement("div");
    card.className = "nft";
    card.innerHTML = `
      <img src="${n.img}" alt="${n.name}" onerror="this.onerror=null;this.src='assets/images/branding/zuzu-logo.png'">
      <div class="meta"><b>${n.name}</b><span class="tag">${n.tag}</span></div>
    `;
    grid.appendChild(card);
  });
}

// --- Referans link alanı (Invite & Earn bölümündeki input'u doldurur) ---
function fillReferral(){
  const url = new URL(location.href);
  const ref = url.searchParams.get("ref");
  // kendi sayfa linkimizi gösterir; ref varsa korur
  const my = `${location.origin}${location.pathname}${ref?`?ref=${encodeURIComponent(ref)}`:""}`;
  // Eğer index.html’de davet input’u varsa doldur (son düzenlerde olabiliyor/olmayabiliyor)
  const inviteInput = document.querySelector('section input[type="text"], section input:not([type])');
  if(inviteInput) inviteInput.value = my;
}

// --- Stake hesaplayıcı ---
function setupCalc(){
  $("#calcBtn").addEventListener("click", ()=>{
    const amt = parseFloat($("#stakeAmount").value||"0");
    const days = parseInt($("#stakeDuration").value,10);
    const nft  = parseFloat($("#nftBoost").value||"0");
    const early= parseFloat($("#earlyBoost").value||"0");
    if(!amt || !days){ $("#resultTotal").textContent="0 ZUZU"; return; }
    // kaba APY modeli
    const baseApyMap = {30:12,90:24,180:40,365:65,540:85};
    const apy = (baseApyMap[days]||0) + nft + early;
    const total = amt * (1 + (apy/100)*(days/365));
    const monthly = (total-amt) / (days/30);
    $("#resultTotal").textContent   = `${total.toFixed(2)} ZUZU`;
    $("#resultMonthly").textContent = `${Math.max(0,monthly).toFixed(2)} ZUZU`;
    $("#resultBoost").textContent   = `+${apy.toFixed(1)}%`;
  });
}

// --- Wallet UI köprüleri ---
function setupWalletUI(){
  // Connect butonu modal açar
  $("#openWallet").addEventListener("click", ()=>window.WalletLite?.open());
  // Başlık sağındaki kısa adres gösterimi
  window.WalletLite?.onAddress((pk)=>{
    if(pk){
      $("#openWallet").textContent = shortAddr(pk);
    }else{
      $("#openWallet").textContent = I18N[localStorage.getItem("zuzu_lang")||"en"].connect;
    }
  });
  // Satın al (şimdilik sadece bağlanmış mı kontrol eder)
  $$(".buyBtn").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      const connected = await window.WalletLite?.ensureConnected();
      if(!connected){ return; }
      // Burada gerçek transfer/tx eklenecek (SPL USDT / SOL)
      alert("Connected ✅ (Demo). Payment flow to be integrated.");
    });
  });
}

// --- Dil menüsü etkileşimleri ---
function setupLang(){
  const cur = localStorage.getItem("zuzu_lang") || "en";
  applyLang(cur);
  $("#langBtn").addEventListener("click", ()=>$("#langMenu").classList.toggle("open"));
  $$(".lang-opt").forEach(o=>{
    o.addEventListener("click", ()=>{
      $("#langMenu").classList.remove("open");
      applyLang(o.dataset.lang);
    });
  });
  // dışa tıkla kapat
  document.addEventListener("click", (e)=>{
    if(!e.target.closest(".lang-wrap")) $("#langMenu").classList.remove("open");
  });
}

// --- Init ---
window.addEventListener("DOMContentLoaded", ()=>{
  setupLang();
  startCountdown();
  renderNFTs();
  setupCalc();
  fillReferral();
  recalcCosts();
  $("#buyAmount").addEventListener("input", recalcCosts);
  $("#currencySel").addEventListener("change", recalcCosts);
  setupWalletUI();
});
</script>
