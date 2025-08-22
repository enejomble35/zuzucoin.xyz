// === V9.2 Anime Boost + Lottie & SVG birlikte ===

const CONFIG = {
  receiver: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3", // senin adresin
  price: 0.002, // USDT per ZUZU
  raised: 0
};

// Maskot listesi (ad, başlık). İSİMLER dosyalarınla birebir uyumlu!
const MASKS = [
  { key: "zuzu_hacker",    title: "ZUZU Hacker" },
  { key: "zuzu_warrior",   title: "ZUZU Warrior" },
  { key: "zuzu_sorceress", title: "ZUZU Sorceress" },
  { key: "zuzu_mini_bot",  title: "ZUZU Mini-Bot" },
  { key: "zuzu_logo",      title: "ZUZU Logo" },
];

const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

function setRefLink(){
  const url = new URL(window.location.href);
  const ref = url.searchParams.get("ref") || "share-this-link";
  const refLink = `${location.origin}${location.pathname}?ref=${ref}`;
  $("#refLink").value = refLink;
  $("#copyRef").addEventListener("click",()=>{
    navigator.clipboard.writeText(refLink);
    toast("Referans linki kopyalandı");
  });
}

function setupCountdown(){
  // 40 gün simülasyon
  const end = Date.now()+ (40*24*3600*1000);
  setInterval(()=>{
    const diff = Math.max(0, end-Date.now());
    const d = Math.floor(diff/86400000);
    const h = Math.floor((diff%86400000)/3600000);
    const m = Math.floor((diff%3600000)/60000);
    const s = Math.floor((diff%60000)/1000);
    $("#cdDay").textContent = String(d).padStart(2,"0");
    $("#cdHour").textContent = String(h).padStart(2,"0");
    $("#cdMin").textContent = String(m).padStart(2,"0");
    $("#cdSec").textContent = String(s).padStart(2,"0");
  },1000);
}

function setupPresale(){
  const howMany = $("#howMany");
  const stageSel = $("#stageSel");
  const priceSpan = $("#priceSpan");
  const totalSpan = $("#totalSpan");

  const updatePrice = ()=>{
    const price = parseFloat(stageSel.value);
    const qty = parseInt(howMany.value||0);
    priceSpan.textContent = `Fiyat: ${price.toFixed(6)} USDT / ZUZU`;
    totalSpan.textContent = `Toplam: ${(price*qty).toFixed(6)} USDT`;
  };

  $$(".row-btns [data-quick]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      howMany.value = btn.dataset.quick;
      updatePrice();
    });
  });

  howMany.addEventListener("input",updatePrice);
  stageSel.addEventListener("change",updatePrice);
  updatePrice();

  $("#receiver").value = CONFIG.receiver;
  $("#copyRecv").addEventListener("click",()=>{
    navigator.clipboard.writeText(CONFIG.receiver);
    toast("Adres kopyalandı");
  });

  // basit QR: pixel grid (süs)
  const qr = $("#qrBox");
  drawFakeQR(qr);

  $("#buyUSDT").addEventListener("click",()=>{
    toast("USDT (BEP20) ile satın alma akışı yakında entegre edilecek.");
  });
  $("#buyCard").addEventListener("click",()=>{
    toast("Kart ile satın alma yakında aktif olacak.");
  });

  $("#raised").textContent = `$${CONFIG.raised.toLocaleString()} / $300,000`;
}

function drawFakeQR(box){
  const size = 12, cell = Math.floor((box.clientWidth-8)/size);
  const cnv = document.createElement("canvas");
  cnv.width = cnv.height = cell*size;
  const ctx = cnv.getContext("2d");
  ctx.fillStyle = "#0b1119";
  ctx.fillRect(0,0,cnv.width,cnv.height);
  for(let y=0;y<size;y++){
    for(let x=0;x<size;x++){
      if(Math.random()>.55){
        ctx.fillStyle = ["#19e0ff","#4dd0e1","#22f3c3"][Math.floor(Math.random()*3)];
        ctx.fillRect(x*cell,y*cell,cell-1,cell-1);
      }
    }
  }
  box.innerHTML = "";
  box.appendChild(cnv);
}

function setupTapEarn(){
  let score=0;
  const mult = (new URLSearchParams(location.search).get("ref")) ? 1.2 : 1.0;
  $("#multVal").textContent = `${mult.toFixed(1)}x`;
  $("#tapBtn").addEventListener("click",()=>{
    score+= (1*mult);
    $("#scoreVal").textContent = Math.floor(score);
    $("#tapBtn").animate([{transform:"scale(1)"},{transform:"scale(.9)"},{transform:"scale(1)"}],{duration:160});
  });
}

function setupStakeDemo(){
  const apyBase = {30:12,60:22,90:36};
  const stakeDays = $("#stakeDays");
  const amount = $("#stakeAmount");
  const apyVal = $("#apyVal");
  const earnVal = $("#earnVal");

  const recalc = ()=>{
    const d = parseInt(stakeDays.value);
    const apy = apyBase[d]||12;
    const amt = parseFloat(amount.value||0);
    const gain = (amt*apy/100*(d/365)).toFixed(2);
    apyVal.textContent = apy+"%";
    earnVal.textContent = `${gain} ZUZU`;
  };
  stakeDays.addEventListener("change",recalc);
  amount.addEventListener("input",recalc);
  recalc();

  $("#stakeDemo").addEventListener("click",()=>toast("Demo: Sadece görsel simülasyon."));
}

// ---- Lottie Loader (Hero + Mask Grid) ----

let lottieInstances = [];

function loadLottie(el, jsonPath, fallbackImg){
  // JSON dosyasını test et → varsa Lottie yükle, yoksa fallback göster
  fetch(jsonPath, {method:"GET"})
    .then(r=>{
      if(!r.ok) throw new Error("not-found");
      return r.json();
    })
    .then(data=>{
      // Lottie renderla
      const anim = lottie.loadAnimation({
        container: el,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: data
      });
      lottieInstances.push(anim);
      if(fallbackImg) fallbackImg.style.opacity = "0";
    })
    .catch(()=>{
      // JSON yoksa fallback görseli göster
      if(fallbackImg) fallbackImg.style.opacity = "1";
    });
}

function initHero(){
  const holder = $("#heroLottie");
  const img = $("#heroSVG");
  const json = holder.dataset.lottie;
  loadLottie(holder, json, img);
}

// Mask grid build
function buildMaskGrid(){
  const grid = $("#maskGrid");
  grid.innerHTML = "";
  MASKS.forEach(m=>{
    const card = document.createElement("div");
    card.className = "mask-card";
    card.innerHTML = `
      <div class="mask-thumb">
        <div class="lottie-holder" data-lottie="assets/zuzu/lottie/${m.key}.json"></div>
        <img class="svg-fallback" src="assets/zuzu/svg/${m.key}.svg" alt="${m.title}"/>
      </div>
      <div class="mask-meta">
        <div class="mask-title">${m.title}</div>
        <small>Animasyon + SVG (otomatik)</small>
      </div>`;
    grid.appendChild(card);
  });

  // Lazy-observer ile kart görününce Lottie yükle
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const holder = e.target.querySelector(".lottie-holder");
        const img = e.target.querySelector(".svg-fallback");
        const json = holder?.dataset?.lottie;
        if(json && !holder.dataset.loaded){
          holder.dataset.loaded = "1";
          loadLottie(holder, json, img);
        }
      }
    });
  },{threshold:.25});

  $$(".mask-card").forEach(c=>{
    io.observe(c);
    // Modal aç
    c.addEventListener("click",()=>openMaskModal(c));
  });
}

// Modal önizleme
let modalAnim = null;
function openMaskModal(card){
  const holder = card.querySelector(".lottie-holder");
  const img = card.querySelector(".svg-fallback");
  const json = holder.dataset.lottie;
  const title = card.querySelector(".mask-title").textContent;

  const modal = $("#maskModal");
  const mLottie = $("#modalLottie");
  const mImg = $("#modalSVG");
  $("#modalTitle").textContent = title;

  // önce temizle
  if(modalAnim){ modalAnim.destroy(); modalAnim=null; }
  mLottie.innerHTML = "";
  mImg.src = img.src;
  mImg.style.opacity = "0";

  fetch(json).then(r=>{
    if(!r.ok) throw new Error("nf");
    return r.json();
  }).then(data=>{
    modalAnim = lottie.loadAnimation({
      container: mLottie,
      renderer:"svg",
      loop:true,
      autoplay:true,
      animationData:data
    });
  }).catch(()=>{
    mImg.style.opacity = "1";
  });

  modal.classList.add("show");
}
$("#modalClose").addEventListener("click",()=>$("#maskModal").classList.remove("show"));
$("#maskModal").addEventListener("click",(e)=>{
  if(e.target.id==="maskModal") $("#maskModal").classList.remove("show");
});

// -- Küçük yardımcılar --
function toast(msg){
  const d = document.createElement("div");
  d.textContent = msg;
  d.style.position="fixed"; d.style.bottom="18px"; d.style.left="50%";
  d.style.transform="translateX(-50%)"; d.style.background="#101826";
  d.style.border="1px solid #213046"; d.style.color="#cfe6ff";
  d.style.padding="10px 14px"; d.style.borderRadius="10px"; d.style.zIndex=1000;
  d.style.boxShadow="0 6px 16px rgba(0,0,0,.35)";
  document.body.appendChild(d);
  setTimeout(()=>{ d.remove(); }, 1800);
}

// Başlat
window.addEventListener("DOMContentLoaded",()=>{
  setRefLink();
  setupCountdown();
  setupPresale();
  setupTapEarn();
  setupStakeDemo();
  initHero();
  buildMaskGrid();
});
