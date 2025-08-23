/***********************
 * ZUZU – i18n + Görseller + Sayaç + Tokenomi + Cüzdan + Hafta Bazlı “Satın Al”
 ***********************/
const DEBUG_URLS_IN_BADGE = true;

/* --- Kaynaklar / Fallback --- */
const SRC = {
  root: location.origin,
  cdn: [
    "https://cdn.jsdelivr.net/gh/enejomble35/zuzucoin.xyz@main",
    "https://raw.githubusercontent.com/enejomble35/zuzucoin.xyz/main"
  ]
};
const PATH = {
  webp: "/assets/zuzu/realistic/",
  lottie: "/zuzu/lottie/"
};

/* --- i18n --- */
const I18N = {
  tr:{ hero_title:"YAPAY ZEKA <span class='c-brand'>ZUZU</span> ORDUSU",
    hero_desc:"ZUZU; memetik enerjiyi <b>AI Meme Intelligence</b> katmanıyla birleştirir. Presale fonları <b>non-custodial</b> hazinede tutulur. Paylaş, <b>tap-to-earn</b> ile puan topla, <b>stake</b> ile daha fazla kazanç hedefle.",
    d:"Gün",h:"Saat",m:"Dakika",s:"Saniye",
    w1:"1. Hafta",w2:"2. Hafta",w3:"3. Hafta",w4:"4. Hafta",
    buy:"Satın Al",
    gallery_title:"ZUZU Maskot Galerisi", roadmap_title:"Yol Haritası",
    phase1:"Presale • Topluluk • Maskot Drop",
    phase2:"CEX Başvuruları • Pazarlama • Partnerlikler",
    phase3:"Tap-to-Earn • Staking • AI Meme Intelligence",
    token_title:"Tokenomi",
    token_note:"Presale, likidite ve airdrop yüzdeleri <code>config.json</code>’dan gelir.",
    wallet_btn:"Cüzdan Bağla", wallet_head:"Cüzdan Bağla",
    wallet_evm:"MetaMask / OKX / Bitget", wallet_sol:"Phantom (Solana)", wallet_ton:"TonConnect", wallet_none:"Bağlı değil" },
  en:{ hero_title:"AI-POWERED <span class='c-brand'>ZUZU</span> ARMY",
    hero_desc:"ZUZU merges memetic energy with <b>AI Meme Intelligence</b>. Presale funds are held in a <b>non-custodial</b> treasury. Share, earn points with <b>tap-to-earn</b>, and aim for more with <b>staking</b>.",
    d:"Days",h:"Hours",m:"Minutes",s:"Seconds",
    w1:"Week 1",w2:"Week 2",w3:"Week 3",w4:"Week 4",
    buy:"Buy",
    gallery_title:"ZUZU Mascot Gallery", roadmap_title:"Roadmap",
    phase1:"Presale • Community • Mascot Drop",
    phase2:"CEX Listings Apps • Marketing • Partnerships",
    phase3:"Tap-to-Earn • Staking • AI Meme Intelligence",
    token_title:"Tokenomics",
    token_note:"Ratios come from <code>config.json</code>.",
    wallet_btn:"Connect Wallet", wallet_head:"Connect Wallet",
    wallet_evm:"MetaMask / OKX / Bitget", wallet_sol:"Phantom (Solana)", wallet_ton:"TonConnect", wallet_none:"Not connected" },
  ru:{ /* (kısaltıldı) */ buy:"Купить" }, es:{ buy:"Comprar" }, de:{ buy:"Kaufen" }, fr:{ buy:"Acheter" }, zh:{ buy:"购买" }, hi:{ buy:"खरीदें" }
};
function setLang(lang){
  const dict = {...I18N.tr, ...(I18N[lang]||{})};
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.dataset.i18n;
    if(dict[key]!=null) el.innerHTML = dict[key];
  });
  localStorage.setItem("zuzu_lang",lang);
}
document.getElementById("lang").addEventListener("change",e=>setLang(e.target.value));
window.addEventListener("DOMContentLoaded",()=>{
  const saved = localStorage.getItem("zuzu_lang") || "tr";
  document.getElementById("lang").value = saved; setLang(saved);
});

/* --- Maskot listesi --- */
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
const q = s=>document.querySelector(s);
const QA = s=>Array.from(document.querySelectorAll(s));

/* --- URL adayları --- */
function urlCandidates(rel){ return [ SRC.root+rel, ...SRC.cdn.map(b=>b+rel) ].map(u=>u+"?v=50"); }

/* --- Hata rozeti --- */
function showBadge(container, msg, list){
  const badge = document.createElement("div");
  badge.className="badge-error";
  badge.innerHTML = msg + (DEBUG_URLS_IN_BADGE && list?.length ? "<br><code>"+list.join("<br>")+"</code>": "");
  container.parentElement.appendChild(badge);
}

/* --- WebP kesin yükle --- */
function putWebp(container, key, title){
  const names = key==="sorceress" ? ["sorceress","maiden"] : [key];
  const rels  = names.map(n=> PATH.webp + n + ".webp");
  const urls  = rels.flatMap(urlCandidates);
  const tried = [];
  const img = new Image(); img.className="thumb"; img.alt=title;
  let i=0;
  const tryNext=()=>{
    if(i>=urls.length){ showBadge(container,"görsel/animasyon bulunamadı",tried); return; }
    const u = urls[i++]; tried.push(u);
    img.src = u; // hata olursa onerror tetiklenecek
  };
  img.onerror = tryNext;
  container.appendChild(img);
  tryNext();
}

/* --- Lottie bindirme --- */
async function tryLottie(container, key){
  const names = key==="sorceress" ? ["sorceress","maiden"] : [key];
  for(const n of names){
    const rel = PATH.lottie + `zuzu_${n}.json`;
    for(const url of urlCandidates(rel)){
      try{
        const r = await fetch(url,{cache:"no-store"}); if(!r.ok) continue;
        const json = await r.json();
        const layer = document.createElement("div"); layer.className="lottieLayer"; container.appendChild(layer);
        lottie.loadAnimation({container:layer,renderer:"svg",loop:true,autoplay:true,animationData:json});
        return true;
      }catch(_){}
    }
  }
  return false;
}

/* --- Galeri --- */
function buildGallery(){
  const grid = q("#zuzu-gallery"); grid.innerHTML = "";
  ZUZU.forEach(({key,title})=>{
    const card = document.createElement("div"); card.className="card";
    const h3 = document.createElement("h3"); h3.textContent = title; card.appendChild(h3);
    const anim = document.createElement("div"); anim.className="animBox"; card.appendChild(anim);
    grid.appendChild(card);
    putWebp(anim,key,title);        // 1) webp kesin
    tryLottie(anim,key);            // 2) varsa anim bindir
  });
}

/* --- Sayaç + Haftalar + Buton Aktifliği --- */
async function initCountdown(){
  try{
    const conf = await fetch("/config.json?"+Date.now()).then(r=>r.json());
    const start = new Date(conf.presaleStart).getTime();
    const end   = new Date(conf.presaleEnd).getTime();
    // haftalık fiyatlar
    q("#w1").textContent = conf.weeks?.[0] || "0.0010 USDT";
    q("#w2").textContent = conf.weeks?.[1] || "0.0015 USDT";
    q("#w3").textContent = conf.weeks?.[2] || "0.0020 USDT";
    q("#w4").textContent = conf.weeks?.[3] || "0.0025 USDT";

    // “Satın Al” linki (şimdilik yer tutucu)
    function buyLink(week){ return "/buy?week="+week; }

    // Butonları hazırla
    QA(".btn-buy").forEach(btn=>{
      btn.onclick = ()=> location.href = buyLink(btn.dataset.week);
    });

    // Aktif haftayı ayarla
    const WEEK = 7*24*3600*1000;
    function setActiveButtons(){
      const now = Date.now();
      let idx = Math.floor((now-start)/WEEK);
      if(idx<0) idx=0; if(idx>3) idx=3;  // 0..3
      QA(".btn-buy").forEach((b,i)=>{
        b.classList.toggle("active", i===idx);
        b.classList.toggle("disabled", i!==idx);
      });
    }

    function tick(){
      const now = Date.now();
      let left = Math.max(0, end-now);
      const DD = Math.floor(left/86400000); left%=86400000;
      const HH = Math.floor(left/3600000);  left%=3600000;
      const MM = Math.floor(left/60000);    left%=60000;
      const SS = Math.floor(left/1000);
      q("#d").textContent = String(DD).padStart(2,"0");
      q("#h").textContent = String(HH).padStart(2,"0");
      q("#m").textContent = String(MM).padStart(2,"0");
      q("#s").textContent = String(SS).padStart(2,"0");
      setActiveButtons();
    }
    tick(); setInterval(tick,1000);
  }catch(e){ console.warn("countdown:",e); }
}

/* --- Tokenomi --- */
async function initChart(){
  try{
    const conf = await fetch("/config.json?"+Date.now()).then(r=>r.json());
    new Chart(document.getElementById("tokenChart"),{
      type:'doughnut',
      data:{
        labels:['Presale','Liquidity','Marketing','Team','Airdrop'],
        datasets:[{
          data: conf.tokenomics || [62,18,10,6,4],
          backgroundColor:['#24e0b6','#31c4ff','#ffd166','#a78bfa','#ff8fab'],
          borderColor:'#0d1729', borderWidth:2
        }]
      },
      options:{plugins:{legend:{display:false}},cutout:'62%'}
    });
  }catch(e){ console.warn("chart:",e); }
}

/* --- Cüzdan Modal --- */
const modal = document.getElementById("wallet-modal");
document.getElementById("btn-wallet").onclick = ()=> modal.classList.remove("hidden");
document.getElementById("closeModal").onclick = ()=> modal.classList.add("hidden");
const setAddr = t => (document.getElementById("addrBox").textContent = t || I18N[localStorage.getItem("zuzu_lang")||"tr"].wallet_none);
document.getElementById("evmConnect").onclick = async ()=>{
  try{
    if(window.ethereum){
      const accts = await window.ethereum.request({method:"eth_requestAccounts"});
      return setAddr("EVM: "+accts[0]);
    }
    location.href = "https://metamask.app.link/dapp/"+location.hostname+location.pathname;
    alert("Tarayıcı cüzdanı bulunamadı. (MetaMask/OKX/Bitget)");
  }catch(e){ alert("EVM: "+e.message); }
};
document.getElementById("solConnect").onclick = async ()=>{
  try{
    const p = window.solana;
    if(p && p.isPhantom){
      const r = await p.connect(); return setAddr("Solana: "+r.publicKey.toString());
    }
    location.href = "https://phantom.app/ul/browse/"+location.href;
    alert("Phantom bulunamadı.");
  }catch(e){ alert("Solana: "+e.message); }
};
let tonUi;
window.addEventListener('load',()=>{
  try{ tonUi = new TON_CONNECT_UI.TonConnectUI({manifestUrl: location.origin+'/tonconnect-manifest.json'}); }catch(_){}
});
document.getElementById("tonConnect").onclick = async ()=>{
  try{
    if(!tonUi) return alert("TonConnect yüklenmedi");
    await tonUi.openModal();
    setAddr("TON: "+(tonUi.account?.address || "Bağlı değil"));
  }catch(e){ alert("TON: "+e.message); }
};

/* --- Başlat --- */
window.addEventListener('DOMContentLoaded', ()=>{
  buildGallery();
  initCountdown();
  initChart();
});
