/***********************
 * ZUZU – stable gallery (WebP first) + tokenomics + wallet
 ***********************/
const V = 35; // cache bust param

// Kaynak dizinleri (tek repo)
const SRC = {
  lottie: [ "/zuzu/lottie/" ],
  webp:   [ "/assets/zuzu/realistic/" ],
  ex:     [ "/assets/zuzu/exchanges/" ],
  logo:   "/assets/zuzu/svg/zuzu_logo.svg"
};

// Maskotlar (10 adet — Maiden dahil)
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
  { key:"maiden",    title:"ZUZU Maiden" }
];

// alias: bazı depolarda sorceress yerine maiden ismi
const ALIAS = { sorceress: ["sorceress","maiden"] };

// --- Yardımcılar ---
function listUrls(key, ext){
  const names = (ALIAS[key] || [key]);
  const bases = (ext==="json" ? SRC.lottie : SRC.webp);
  const out=[];
  names.forEach(n => bases.forEach(b => out.push(b + (ext==="json" ? `zuzu_${n}.json` : `${n}.webp`))));
  return out;
}

function loadImgFallback(box, key, title){
  const urls = listUrls(key, "webp");
  const img  = new Image();
  img.className="thumb";
  let i=0;
  const next=()=>{
    if(i>=urls.length){
      const badge=document.createElement("div");
      badge.className="badge-error";
      badge.textContent="görsel/animasyon bulunamadı";
      box.closest(".card").appendChild(badge);
      return;
    }
    const u = urls[i] + `?v=${V}`; i++;
    img.onerror = next;
    img.onload  = ()=> box.appendChild(img);
    img.src = u;
  };
  next();
}

function loadLottieOver(box, key){
  try{
    const urls = listUrls(key,"json");
    let i=0, placed=false;
    const layer=document.createElement("div");
    layer.className="lottie-layer";
    box.appendChild(layer);

    const attempt=()=>{
      if(i>=urls.length){ return; }
      const path = urls[i] + `?v=${V}`; i++;
      fetch(path,{cache:"no-store"})
        .then(r=> r.ok ? r.json() : Promise.reject())
        .then(json=>{
          lottie.loadAnimation({
            container: layer,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: json
          });
          placed=true;
        })
        .catch(attempt);
    };
    attempt();

    setTimeout(()=>{ if(!placed) layer.remove(); }, 4000);
  }catch(_){}
}

// --- Galeri ---
function buildGallery(){
  const grid=document.getElementById("zuzu-gallery");
  grid.innerHTML="";
  ZUZU.forEach(({key,title})=>{
    const card=document.createElement("div");
    card.className="card";
    card.innerHTML=`<h3>${title}</h3><div class="animBox"></div>`;
    grid.appendChild(card);
    const box=card.querySelector(".animBox");
    loadImgFallback(box,key,title);   // her zaman webp
    loadLottieOver(box,key);         // varsa üstüne lottie
  });
}

// --- Config / Chart / Prices ---
async function readConf(){
  try{
    return await fetch("/config.json?"+V).then(r=>r.json());
  }catch(e){
    console.warn("config.json okunamadı", e);
    return { presaleEnd:"2025-12-31T23:59:59Z", tokenomics:[45,25,15,10,5], weekPrices:["0.0010","0.0015","0.0020","0.0025"] };
  }
}
async function initChart(){
  const conf=await readConf();
  new Chart(document.getElementById("tokenChart").getContext("2d"),{
    type:"doughnut",
    data:{labels:["Presale","Liquidity","Marketing","Team","Airdrop"],
      datasets:[{data:conf.tokenomics,backgroundColor:["#24e0b6","#31c4ff","#ffd166","#a78bfa","#ff8fab"],borderColor:"#0e1522",borderWidth:2}]},
    options:{plugins:{legend:{display:false}},cutout:"60%"}
  });
  const [w1,w2,w3,w4]=conf.weekPrices||["0.0010","0.0015","0.0020","0.0025"];
  document.getElementById("w1").textContent=`${w1} USDT`;
  document.getElementById("w2").textContent=`${w2} USDT`;
  document.getElementById("w3").textContent=`${w3} USDT`;
  document.getElementById("w4").textContent=`${w4} USDT`;
}

// --- Countdown ---
async function initCountdown(){
  const conf=await readConf();
  const end=new Date(conf.presaleEnd).getTime();
  const d=document.getElementById("d"),h=document.getElementById("h"),m=document.getElementById("m"),s=document.getElementById("s");
  function tick(){
    const now=Date.now(); let left=Math.max(0,end-now);
    const D=Math.floor(left/86400000); left%=86400000;
    const H=Math.floor(left/3600000);  left%=3600000;
    const M=Math.floor(left/60000);    left%=60000;
    const S=Math.floor(left/1000);
    d.textContent=String(D).padStart(2,"0");
    h.textContent=String(H).padStart(2,"0");
    m.textContent=String(M).padStart(2,"0");
    s.textContent=String(S).padStart(2,"0");
  }
  tick(); setInterval(tick,1000);
}

// --- Wallet (deeplink fallback’lı) ---
const modal=document.getElementById("wallet-modal");
document.getElementById("btn-wallet").onclick=()=>modal.classList.remove("hidden");
document.getElementById("closeModal").onclick=()=>modal.classList.add("hidden");
const addrBox=document.getElementById("addrBox");
const setAddr=t=>addrBox.textContent=t;

document.getElementById("evmConnect").onclick=async ()=>{
  try{
    if(window.ethereum){
      const accs=await window.ethereum.request({method:"eth_requestAccounts"});
      setAddr("EVM: "+accs[0]);
    }else{
      window.location.href="https://metamask.app.link/dapp/"+location.host;
      alert("Tarayıcı cüzdanı yok. Metamask uygulaması ile açınız.");
    }
  }catch(e){ alert("EVM bağlantı: "+e.message); }
};
document.getElementById("solConnect").onclick=async ()=>{
  try{
    const p=window.solana;
    if(p && p.isPhantom){
      const r=await p.connect(); setAddr("Solana: "+r.publicKey.toString());
    }else{
      window.location.href="https://phantom.app/ul/browse/"+location.href;
      alert("Phantom bulunamadı. Phantom ile açınız.");
    }
  }catch(e){ alert("Solana bağlantı: "+e.message); }
};
document.getElementById("tonConnect").onclick=()=>{
  alert("TON bağlama için uygulama içi modül eklenecek.");
};

// --- Başlat ---
window.addEventListener("DOMContentLoaded",()=>{
  buildGallery();
  initChart();
  initCountdown();
});
