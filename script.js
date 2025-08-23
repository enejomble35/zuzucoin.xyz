/***********************
 * ZUZU v17 – local-first gallery + exchanges + countdown + wallet
 ***********************/
const SRC={
  lottie:[ "/zuzu/lottie/" ],
  webp:[ "/assets/zuzu/realistic/" ],
  ex:[ "/assets/zuzu/exchanges/" ],
  logo:[ "/assets/zuzu/svg/zuzu_logo.svg" ]
};
// === Kaynaklar (ÖNCE YEREL) ===
const SOURCES = {
  webp: [
    "/assets/zuzu/realistic/", // yerel (en güvenilir)
    "https://cdn.jsdelivr.net/gh/enejomble35/zuzucoin.xyz@main/assets/zuzu/realistic/",
    "https://raw.githubusercontent.com/enejomble35/zuzucoin.xyz/main/assets/zuzu/realistic/"
  ],
  lottie: [
    "/zuzu/lottie/",
    "https://cdn.jsdelivr.net/gh/enejomble35/zuzucoin.xyz@main/zuzu/lottie/",
    "https://raw.githubusercontent.com/enejomble35/zuzucoin.xyz/main/zuzu/lottie/"
  ]
};

// Maskotlar
const ZUZU = [
  { key:"hero",      title:"ZUZU Hero"      },
  { key:"ranger",    title:"ZUZU Ranger"    },
  { key:"warrior",   title:"ZUZU Warrior"   },
  { key:"hacker",    title:"ZUZU Hacker"    },
  { key:"rogue",     title:"ZUZU Rogue"     },
  { key:"titan",     title:"ZUZU Titan"     },
  { key:"sorceress", title:"ZUZU Sorceress" },
  { key:"berserker", title:"ZUZU Berserker" },
  { key:"scientist", title:"ZUZU Scientist" },
  { key:"maiden",    title:"ZUZU Maiden"    } // 10. kart
];

// alias (sorceress = maiden dosyası olabilir)
const FILE_ALIAS = {
  sorceress: ["sorceress","maiden"]
};

// === Yardımcılar ===
function candidateUrls(key, ext){
  const names = FILE_ALIAS[key] || [key];
  const srcs = (ext === "json") ? SOURCES.lottie : SOURCES.webp;
  const out = [];
  names.forEach(n => srcs.forEach(base => out.push(base + (ext === "json" ? `zuzu_${n}.json` : `${n}.webp`))));
  return out;
}

function loadImageWithFallback(img, urls, onFail, onDone){
  let i = 0;
  const tried = [];
  img.loading = "lazy";
  img.decoding = "async";
  img.referrerPolicy = "no-referrer";
  img.crossOrigin = "anonymous";

  const next = ()=>{
    if(i >= urls.length){
      onFail && onFail(tried);
      return;
    }
    const u = urls[i] + (urls[i].startsWith("http") ? `?v=${Date.now()}` : "");
    tried.push(u);
    i++;
    img.onerror = next;
    img.onload = ()=> onDone && onDone(tried);
    img.src = u;
  };
  next();
}

function loadLottieWithFallback(container, key, ok, fail){
  const urls = candidateUrls(key, "json");
  let i = 0;
  const tried = [];
  const next = ()=>{
    if(i >= urls.length){ fail && fail(tried); return; }
    const u = urls[i] + (urls[i].startsWith("http") ? `?v=${Date.now()}` : "");
    tried.push(u); i++;
    fetch(u,{cache:"no-store"}).then(r=>r.ok?r.json():Promise.reject())
      .then(json=>{
        const anim = lottie.loadAnimation({container,renderer:"svg",loop:true,autoplay:true,animationData:json});
        ok && ok(anim, tried);
      }).catch(next);
  };
  next();
}

// === Borsalar ===
const EX = [
  {k:"mexc",  n:"MEXC"},
  {k:"gateio",n:"Gate.io"},
  {k:"bitmart",n:"BitMart"},
  {k:"bybit", n:"Bybit"},
  {k:"kucoin",n:"KuCoin"},
  {k:"okx",   n:"OKX"}
];

function buildExchanges(){
  const row = document.getElementById("exchanges"); row.innerHTML="";
  EX.forEach(({k,n})=>{
    const el = document.createElement("div"); el.className="ex-item";
    const img = document.createElement("img"); img.className="ex-logo"; img.alt=n;
    img.src = `/assets/zuzu/exchanges/${k}.svg`;
    img.onerror = ()=>{ el.innerHTML = `<span class="ex-name">${n}</span>`; };
    el.appendChild(img);
    const name = document.createElement("span"); name.className="ex-name"; name.textContent = n;
    el.appendChild(name);
    row.appendChild(el);
  });
}

// === GALERİ ===
function buildGallery(){
  const grid = document.getElementById("zuzu-gallery"); grid.innerHTML="";
  ZUZU.forEach(({key,title})=>{
    const card = document.createElement("div"); card.className="card";
    card.innerHTML = `<h3>${title}</h3>`;
    const animBox = document.createElement("div"); animBox.className="animBox";
    card.appendChild(animBox); grid.appendChild(card);

    let resolved = false;

    // 1) Lottie dene
    loadLottieWithFallback(animBox, key, ()=>{
      resolved = true;
    }, (triedLottie)=>{

      // 2) WebP fallback
      const img = document.createElement("img"); img.className="thumb"; img.alt = title;
      animBox.appendChild(img);
      loadImageWithFallback(img, candidateUrls(key,"webp"), (triedImg)=>{
        // 3) Tamamen olmadı => hata rozeti + denenenler
        const b = document.createElement("div"); b.className="badge-error";
        b.textContent = "görsel/animasyon bulunamadı";
        card.appendChild(b);
        const dbg = document.createElement("div"); dbg.className="badge-try";
        dbg.textContent = "Denedi: " + [...triedLottie,...triedImg].join(" | ");
        card.appendChild(dbg);
      });
    });

    // Güvenlik: 2.5 sn sonra hâlâ boş ise resme düş
    setTimeout(()=>{
      if(!resolved && animBox.children.length===0){
        const img = document.createElement("img"); img.className="thumb"; img.alt = title;
        animBox.appendChild(img);
        loadImageWithFallback(img, candidateUrls(key,"webp"));
      }
    }, 2500);
  });
}

// === Sayaç ===
async function initCountdown(){
  try{
    const conf = await fetch("/config.json?"+Date.now()).then(r=>r.json());
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
    tick(); setInterval(tick,1000);
  }catch(e){ console.warn("config.json okunamadı", e); }
}

// === Cüzdan ===
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
window.addEventListener('DOMContentLoaded',()=>{
  buildExchanges();
  buildGallery();
  initCountdown();
});
