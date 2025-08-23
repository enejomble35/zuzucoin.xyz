/***********************
 * ZUZU – Gallery + Wallet + Countdown + Chart (multi-source fallback)
 ***********************/

// === Kaynaklar (sıralı denenecek) ===
const SOURCES = {
  webp: [
    // 1) jsDelivr (commit cache hızlı)
    "https://cdn.jsdelivr.net/gh/enejomble35/zuzucoin.xyz@main/assets/zuzu/realistic/",
    // 2) GitHub RAW
    "https://raw.githubusercontent.com/enejomble35/zuzucoin.xyz/main/assets/zuzu/realistic/",
    // 3) Site kökü (aynı repo)
    "/assets/zuzu/realistic/"
  ],
  lottie: [
    "https://cdn.jsdelivr.net/gh/enejomble35/zuzucoin.xyz@main/zuzu/lottie/",
    "https://raw.githubusercontent.com/enejomble35/zuzucoin.xyz/main/zuzu/lottie/",
    "/zuzu/lottie/"
  ]
};

// Maskot listesi
const ZUZU = [
  { key:"hero",      title:"ZUZU Hero"      },
  { key:"ranger",    title:"ZUZU Ranger"    },
  { key:"warrior",   title:"ZUZU Warrior"   },
  { key:"hacker",    title:"ZUZU Hacker"    },
  { key:"rogue",     title:"ZUZU Rogue"     },
  { key:"titan",     title:"ZUZU Titan"     },
  { key:"sorceress", title:"ZUZU Sorceress" },
  { key:"berserker", title:"ZUZU Berserker" },
  { key:"scientist", title:"ZUZU Scientist" }
];

// Bazı repolarda "sorceress" = maiden olarak geçiyor, alias ekleyelim
const FILE_ALIAS = {
  sorceress: ["sorceress","maiden"]
};

// === Yardımcılar ===

// Belirli uzantı için tüm muhtemel URL'leri sırayla döndür
function candidateUrls(key, ext){
  const names = FILE_ALIAS[key] || [key];
  const srcs = ext === "json" ? SOURCES.lottie : SOURCES.webp;
  const list = [];
  names.forEach(n=>{
    srcs.forEach(base => list.push(base + (ext==="json" ? `zuzu_${n}.json` : `${n}.webp`)));
  });
  return list;
}

// IMG için zincirleme fallback
function loadImageWithFallback(img, urls, onFail){
  let i = 0;
  const next = ()=>{
    if(i >= urls.length){ onFail && onFail(); return; }
    img.src = urls[i] + (urls[i].includes("http") ? `?v=${Date.now()}` : "");
    i++;
  };
  img.onerror = next;
  next();
}

// Lottie için dene; olmazsa onError()
function loadLottieWithFallback(container, key, onSuccess, onError){
  const urls = candidateUrls(key, "json");
  let i = 0, anim;

  const tryNext = ()=>{
    if(i >= urls.length){ onError(); return; }
    const path = urls[i] + (urls[i].includes("http") ? `?v=${Date.now()}` : "");
    i++;

    // fetch ile var mı yok mu kontrol (CORS ok), sonra render et
    fetch(path, {cache:"no-store"})
      .then(r => r.ok ? r.json() : Promise.reject(new Error(r.status)))
      .then(json => {
        anim = lottie.loadAnimation({
          container, renderer:"svg", loop:true, autoplay:true, animationData: json
        });
        onSuccess && onSuccess(anim);
      })
      .catch(tryNext);
  };
  tryNext();
}

// === GALERİ ===
function buildGallery(){
  const grid = document.getElementById("zuzu-gallery");
  grid.innerHTML = "";

  ZUZU.forEach(({key,title})=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${title}</h3>`;
    const animBox = document.createElement("div");
    animBox.className = "animBox";
    card.appendChild(animBox);
    grid.appendChild(card);

    // Önce Lottie, olmazsa webp
    let lottieOk = false;
    loadLottieWithFallback(animBox, key, ()=>{ lottieOk = true; }, ()=>{
      // Lottie bulunamadı -> webp fallback
      const img = document.createElement("img");
      img.className = "thumb";
      img.alt = title;
      animBox.appendChild(img);

      const imgUrls = candidateUrls(key, "webp");
      loadImageWithFallback(img, imgUrls, ()=>{
        // webp de olmadı -> rozet
        const badge = document.createElement("div");
        badge.className = "badge-error";
        badge.textContent = "görsel/animasyon bulunamadı";
        card.appendChild(badge);
      });
    });

    // 2. güvenlik: bazı cihazlarda lottie sessiz fail -> 2.5s sonra hâlâ boş ise webp’ye düş
    setTimeout(()=>{
      if(!lottieOk && animBox.children.length===0){
        const img = document.createElement("img");
        img.className = "thumb";
        img.alt = title;
        animBox.appendChild(img);
        loadImageWithFallback(img, candidateUrls(key,"webp"));
      }
    }, 2500);
  });
}

// === Sayaç ===
async function initCountdown(){
  try{
    const conf = await fetch("config.json?"+Date.now()).then(r=>r.json());
    const start = new Date(conf.presaleStart).getTime();
    const end   = new Date(conf.presaleEnd).getTime();
    const cdBox = document.getElementById("cd");
    const cdBar = document.getElementById("cd-bar");

    function tick(){
      const now = Date.now();
      const total = end - start;
      const done  = Math.max(0, Math.min(total, now - start));
      const left  = Math.max(0, end - now);
      const d = Math.floor(left/86400000);
      const h = Math.floor((left%86400000)/3600000);
      const m = Math.floor((left%3600000)/60000);
      const s = Math.floor((left%60000)/1000);
      cdBox.textContent = `${d}g ${h}s ${m}d ${s}sn`;
      cdBar.style.width = `${(done/total)*100}%`;
      if(left<=0) cdBox.textContent = "Ön satış bitti";
    }
    tick();
    setInterval(tick,1000);
  }catch(e){ console.warn("config.json okunamadı", e); }
}

// === Tokenomi ===
async function initChart(){
  try{
    const conf = await fetch("config.json?"+Date.now()).then(r=>r.json());
    const ctx  = document.getElementById('tokenChart').getContext('2d');
    new Chart(ctx,{
      type:'doughnut',
      data:{
        labels:['Presale','Liquidity','Marketing','Team','Airdrop'],
        datasets:[{
          data:conf.tokenomics,
          backgroundColor:['#24e0b6','#31c4ff','#ffd166','#a78bfa','#ff8fab'],
          borderColor:'#0e1522', borderWidth:2
        }]
      },
      options:{ plugins:{legend:{display:false}}, cutout:'60%' }
    });
  }catch(e){ console.warn("Chart init hatası", e); }
}

// === Cüzdan Modal ===
const modal = document.getElementById("wallet-modal");
document.getElementById("btn-wallet").onclick = ()=> modal.classList.remove("hidden");
document.getElementById("closeModal").onclick = ()=> modal.classList.add("hidden");
function setAddr(t){ const el = document.getElementById("addrBox"); if(el) el.textContent = t; }

document.getElementById("evmConnect").onclick = async ()=>{
  try{
    if(!window.ethereum){ alert("Tarayıcı cüzdanı yok (MetaMask/OKX/Bitget)"); return; }
    const accts = await window.ethereum.request({method:"eth_requestAccounts"});
    setAddr("EVM: "+accts[0]);
  }catch(e){ alert("EVM bağlantı: "+e.message); }
};
document.getElementById("solConnect").onclick = async ()=>{
  try{
    const p = window.solana;
    if(!p || !p.isPhantom){ alert("Phantom bulunamadı"); return; }
    const r = await p.connect(); setAddr("Solana: "+r.publicKey.toString());
  }catch(e){ alert("Solana bağlantı: "+e.message); }
};
let tonUi;
window.addEventListener('load',()=>{
  try{ tonUi = new TON_CONNECT_UI.TonConnectUI({ manifestUrl: location.origin+'/tonconnect-manifest.json' }); }catch(_){}
});
document.getElementById("tonConnect").onclick = async ()=>{
  try{
    if(!tonUi){ alert("TonConnect yüklenmedi"); return; }
    await tonUi.openModal();
    setAddr("TON: "+(tonUi.account?.address || "Bağlı değil"));
  }catch(e){ alert("TON bağlantı: "+e.message); }
};

// === Başlat ===
window.addEventListener('DOMContentLoaded', ()=>{
  buildGallery();
  initCountdown();
  initChart();
});
