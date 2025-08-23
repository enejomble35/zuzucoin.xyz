/***********************
 * ZUZU – Görseller + Lottie bindirme + Sayaç + Tokenomi
 ***********************/
const SRC = {
  lottie: "/zuzu/lottie/",
  webp:   "/assets/zuzu/realistic/",
  logo:   "/assets/zuzu/svg/zuzu_logo.svg"
};

// 10 maskot
const ZUZU = [
  { key:"hero",      title:"ZUZU Hero" },
  { key:"ranger",    title:"ZUZU Ranger" },
  { key:"warrior",   title:"ZUZU Warrior" },
  { key:"hacker",    title:"ZUZU Hacker" },
  { key:"rogue",     title:"ZUZU Rogue" },
  { key:"titan",     title:"ZUZU Titan" },
  { key:"sorceress", title:"ZUZU Sorceress" },
  { key:"berserker", title:"ZUZU Berserker" },
  { key:"scientist", title:"ZUZU Scientist" },
  { key:"maiden",    title:"ZUZU Maiden" } // 10. kart
];

/* ---- Yardımcılar ---- */
function el(tag, cls){ const e=document.createElement(tag); if(cls) e.className=cls; return e; }

/* Lottie varsa bindir; yoksa sessiz geç */
async function tryLottie(container, key){
  const tryKeys = key==="sorceress" ? ["sorceress","maiden"] : [key];
  for(const k of tryKeys){
    const url = `${SRC.lottie}zuzu_${k}.json`;
    try{
      const r = await fetch(url,{cache:"no-store"});
      if(!r.ok) continue;
      const json = await r.json();
      const layer = el("div","lottieLayer");
      container.appendChild(layer);
      lottie.loadAnimation({container:layer,renderer:"svg",loop:true,autoplay:true,animationData:json});
      return true;
    }catch(_){}
  }
  return false;
}

/* WebP mutlaka göster (alias ile) */
function putWebp(container, key, title){
  const img = new Image();
  img.className="thumb"; img.alt=title;
  const tryKeys = key==="sorceress" ? ["sorceress","maiden"] : [key];
  let i=0;
  const tryNext=()=>{
    if(i>=tryKeys.length){
      const badge = el("div","badge-error");
      badge.textContent="görsel/animasyon bulunamadı";
      container.parentElement.appendChild(badge);
      return;
    }
    img.src = `${SRC.webp}${tryKeys[i++]}.webp?v=29`;
  };
  img.onerror = tryNext;
  container.appendChild(img);
  tryNext();
}

/* --- Galeri --- */
function buildGallery(){
  const grid = document.getElementById("zuzu-gallery");
  grid.innerHTML = "";
  ZUZU.forEach(({key,title})=>{
    const card = el("div","card");
    card.appendChild(Object.assign(el("h3"),{textContent:title}));
    const anim = el("div","animBox");
    card.appendChild(anim);
    grid.appendChild(card);

    // 1) WebP'yi koy (kesin görünür)
    putWebp(anim,key,title);
    // 2) Lottie varsa üzerine bindir
    tryLottie(anim,key);
  });
}

/* --- Sayaç + Haftalık fiyat --- */
async function initCountdown(){
  try{
    const conf = await fetch("/config.json?"+Date.now()).then(r=>r.json());
    const start = new Date(conf.presaleStart).getTime();
    const end   = new Date(conf.presaleEnd).getTime();
    const ids = s=>document.getElementById(s);
    const d=ids("d"),h=ids("h"),m=ids("m"),s=ids("s");
    // haftalık
    ids("w1").textContent = conf.weeks?.[0] || "0.0010 USDT";
    ids("w2").textContent = conf.weeks?.[1] || "0.0015 USDT";
    ids("w3").textContent = conf.weeks?.[2] || "0.0020 USDT";
    ids("w4").textContent = conf.weeks?.[3] || "0.0025 USDT";

    function tick(){
      const now = Date.now();
      let left = Math.max(0, end-now);
      const DD = Math.floor(left/86400000); left%=86400000;
      const HH = Math.floor(left/3600000);  left%=3600000;
      const MM = Math.floor(left/60000);    left%=60000;
      const SS = Math.floor(left/1000);
      d.textContent=String(DD).padStart(2,"0");
      h.textContent=String(HH).padStart(2,"0");
      m.textContent=String(MM).padStart(2,"0");
      s.textContent=String(SS).padStart(2,"0");
    }
    tick(); setInterval(tick,1000);
  }catch(e){ console.warn("countdown init:",e); }
}

/* --- Tokenomi --- */
async function initChart(){
  try{
    const conf = await fetch("/config.json?"+Date.now()).then(r=>r.json());
    const ctx = document.getElementById("tokenChart");
    new Chart(ctx,{
      type:'doughnut',
      data:{
        labels:['Presale','Liquidity','Marketing','Team','Airdrop'],
        datasets:[{
          data: conf.tokenomics || [62,18,10,6,4],
          backgroundColor:['#24e0b6','#31c4ff','#ffd166','#a78bfa','#ff8fab'],
          borderColor:'#0d1729', borderWidth:2
        }]
      },
      options:{ plugins:{legend:{display:false}}, cutout:'62%' }
    });
  }catch(e){ console.warn("chart init:",e); }
}

/* --- Cüzdan Modal --- */
const modal = document.getElementById("wallet-modal");
document.getElementById("btn-wallet").onclick = ()=> modal.classList.remove("hidden");
document.getElementById("closeModal").onclick = ()=> modal.classList.add("hidden");
const addrBox = document.getElementById("addrBox");
const setAddr = t => addrBox.textContent = t || "Bağlı değil";

// EVM
document.getElementById("evmConnect").onclick = async ()=>{
  try{
    if(window.ethereum){
      const accts = await window.ethereum.request({method:"eth_requestAccounts"});
      return setAddr("EVM: "+accts[0]);
    }
    // Deeplink fallback
    location.href = "https://metamask.app.link/dapp/"+location.hostname+location.pathname;
    alert("Tarayıcı cüzdanı bulunamadı. MetaMask/OKX/Bitget yüklü olmalı.");
  }catch(e){ alert("EVM bağlantı: "+e.message); }
};
// Solana
document.getElementById("solConnect").onclick = async ()=>{
  try{
    const p = window.solana;
    if(p && p.isPhantom){
      const r = await p.connect(); return setAddr("Solana: "+r.publicKey.toString());
    }
    location.href = "https://phantom.app/ul/browse/"+location.href;
    alert("Phantom cüzdan bulunamadı.");
  }catch(e){ alert("Solana bağlantı: "+e.message); }
};
// TON
let tonUi; window.addEventListener('load',()=>{
  try{ tonUi = new TON_CONNECT_UI.TonConnectUI({ manifestUrl: location.origin+'/tonconnect-manifest.json' }); }catch(_){}
});
document.getElementById("tonConnect").onclick = async ()=>{
  try{
    if(!tonUi) return alert("TonConnect yüklenmedi");
    await tonUi.openModal();
    setAddr("TON: "+(tonUi.account?.address || "Bağlı değil"));
  }catch(e){ alert("TON bağlantı: "+e.message); }
};

/* --- Başlat --- */
window.addEventListener('DOMContentLoaded', ()=>{
  buildGallery();
  initCountdown();
  initChart();
});
