/* ZUZU — UI core (dil, sayaç, NFT grid, hafta/ödeme, ref link, satın alma stub) */

// --- Constants ---
const SALE_END = Date.parse("2025-12-31T23:59:59Z"); // sabit tarih
const WEEKS = [
  {name:"Week 1", price:0.0050},
  {name:"Week 2", price:0.0055},
  {name:"Week 3", price:0.0060},
  {name:"Week 4", price:0.0065},
];

// --- Init ---
window.addEventListener("DOMContentLoaded", ()=>{
  // Lang
  applyLang(localStorage.getItem("zuzu_lang") || "en");
  const langBtn = $("langBtn"), langMenu = $("langMenu");
  langBtn?.addEventListener("click", ()=>toggle(langMenu));
  $all(".lang-opt").forEach(b=>b.addEventListener("click", ()=>{applyLang(b.dataset.lang); hide(langMenu);} ));

  // Pay mode
  const payBtn = $("paySelect"), payMenu = $("payMenu");
  payBtn?.addEventListener("click", ()=>toggle(payMenu));
  $all(".pay-opt").forEach(p=>p.addEventListener("click", ()=>{
    payBtn.dataset.mode = p.dataset.mode; payBtn.textContent = p.textContent; hide(payMenu);
  }));

  // Week tabs
  let currentWeek = 0;
  const tabs = $all(".buy-tabs .tab");
  const priceNote = $("priceNote");
  function updatePriceNote(){
    const w = WEEKS[currentWeek];
    priceNote.textContent = `${w.name} • Price ${w.price.toFixed(4)} USDT per ZUZU`;
  }
  tabs.forEach(t=>t.addEventListener("click", ()=>{
    tabs.forEach(x=>x.classList.remove("active"));
    t.classList.add("active");
    currentWeek = +t.dataset.week; updatePriceNote();
  }));
  updatePriceNote();

  // Ref link
  setRefLink();
  document.addEventListener("zuzu:walletConnected", setRefLink);
  $("copyRef")?.addEventListener("click", ()=>{
    const v = $("refLink")?.value||""; if(!v) return;
    navigator.clipboard.writeText(v); toast("Copied");
  });

  // NFT grid
  renderNFTs();

  // Countdown
  tick(); setInterval(tick, 1000);

  // Buy
  $("buyNow")?.addEventListener("click", ()=>{
    const amt = Number($("buyAmount")?.value||0);
    if(!amt || amt<=0) return alert("Amount?");
    const mode = $("paySelect")?.dataset.mode || "SOL";
    // Not: Gerçek on-chain yok. Cüzdana yönlendirme + connect tetiklenir.
    if(!window.__zuzu_pk?.()){
      // modalı aç
      document.getElementById("connectBtn")?.click();
      return;
    }
    alert(`Redirecting to wallet…\nAmount: ${amt} ZUZU\nPay: ${mode}\n(${WEEKS[currentWeek].name})`);
  });
});

// --- Helpers ---
function $(id){ return document.getElementById(id); }
function $all(sel){ return Array.from(document.querySelectorAll(sel)); }
function toggle(el){ if(el) el.classList.toggle("show"); }
function hide(el){ if(el) el.classList.remove("show"); }
function toast(msg){ try{ console.log(msg); }catch{} }

// --- Countdown ---
function tick(){
  const left = Math.max(0, SALE_END - Date.now());
  const d = Math.floor(left/86400000);
  const h = Math.floor((left%86400000)/3600000);
  const m = Math.floor((left%3600000)/60000);
  const s = Math.floor((left%60000)/1000);
  const P=n=>String(n).padStart(2,"0");
  setText("cdDays",P(d)); setText("cdHours",P(h)); setText("cdMins",P(m)); setText("cdSecs",P(s));
}
function setText(id,txt){ const el=$(id); if(el) el.textContent=txt; }

// --- NFT Grid ---
function renderNFTs(){
  const list=[
    {id:1,name:"ZUZU Hero",rarity:"Epic",img:"assets/images/mask/0.png"},
    {id:2,name:"ZUZU Rogue",rarity:"Rare",img:"assets/images/mask/1.png"},
    {id:3,name:"ZUZU Hacker",rarity:"Rare",img:"assets/images/mask/2.png"},
    {id:4,name:"ZUZU Sorceress",rarity:"Epic",img:"assets/images/mask/3.png"},
    {id:5,name:"ZUZU Warrior",rarity:"Rare",img:"assets/images/mask/4.png"},
  ];
  const grid=$("nftGrid"); if(!grid) return;
  grid.innerHTML=list.map(n=>`
    <div class="nft-card">
      <img src="${n.img}" alt="${n.name}">
      <div class="cap"><span>#${n.id} ${n.name}</span><b>${n.rarity}</b></div>
    </div>`).join("");
}

// --- Ref link (wallet bağlanınca otomatik güncellenir) ---
function setRefLink(){
  const base = location.origin + location.pathname;
  const ref = window.__zuzu_pk?.() || (localStorage.getItem("zuzu_id") || (localStorage.setItem("zuzu_id","u"+Math.random().toString(36).slice(2)), localStorage.getItem("zuzu_id")));
  const link = `${base}?ref=${encodeURIComponent(ref)}`;
  const inp = $("refLink"); if(inp) inp.value = link;
}
