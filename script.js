/***********************
 * ZUZU – i18n + Görseller (WebP kesin + Lottie bindirme) + Sayaç + Tokenomi + Cüzdan
 ***********************/

/* --------- Kaynaklar / Fallback zinciri --------- */
const SRC = {
  // site kökü
  root: location.origin,
  // CDN fallback’leri
  cdn: [
    "https://cdn.jsdelivr.net/gh/enejomble35/zuzucoin.xyz@main",
    "https://raw.githubusercontent.com/enejomble35/zuzucoin.xyz/main"
  ]
};
const PATH = {
  webp: "/assets/zuzu/realistic/",
  lottie: "/zuzu/lottie/"
};

/* --------- i18n --------- */
const I18N = {
  tr:{
    hero_title: "YAPAY ZEKA <span class='c-brand'>ZUZU</span> ORDUSU",
    hero_desc:  "ZUZU; memetik enerjiyi <b>AI Meme Intelligence</b> katmanıyla birleştirir. Presale fonları <b>non-custodial</b> hazinede tutulur. Paylaş, <b>tap-to-earn</b> ile puan topla, <b>stake</b> ile daha fazla kazanç hedefle.",
    d:"Gün",h:"Saat",m:"Dakika",s:"Saniye",
    w1:"1. Hafta",w2:"2. Hafta",w3:"3. Hafta",w4:"4. Hafta",
    gallery_title:"ZUZU Maskot Galerisi",
    roadmap_title:"Yol Haritası",
    phase1:"Presale • Topluluk • Maskot Drop",
    phase2:"CEX Başvuruları • Pazarlama • Partnerlikler",
    phase3:"Tap-to-Earn • Staking • AI Meme Intelligence",
    token_title:"Tokenomi",
    token_note:"Presale, likidite ve airdrop yüzdeleri <code>config.json</code>’dan gelir.",
    wallet_btn:"Cüzdan Bağla",
    wallet_head:"Cüzdan Bağla",
    wallet_evm:"MetaMask / OKX / Bitget",
    wallet_sol:"Phantom (Solana)",
    wallet_ton:"TonConnect",
    wallet_none:"Bağlı değil"
  },
  en:{
    hero_title:"AI-POWERED <span class='c-brand'>ZUZU</span> ARMY",
    hero_desc: "ZUZU merges memetic energy with <b>AI Meme Intelligence</b>. Presale funds are held in a <b>non-custodial</b> treasury. Share, earn points with <b>tap-to-earn</b>, and aim for more with <b>staking</b>.",
    d:"Days",h:"Hours",m:"Minutes",s:"Seconds",
    w1:"Week 1",w2:"Week 2",w3:"Week 3",w4:"Week 4",
    gallery_title:"ZUZU Mascot Gallery",
    roadmap_title:"Roadmap",
    phase1:"Presale • Community • Mascot Drop",
    phase2:"CEX Listings Apps • Marketing • Partnerships",
    phase3:"Tap-to-Earn • Staking • AI Meme Intelligence",
    token_title:"Tokenomics",
    token_note:"Presale, liquidity and airdrop ratios come from <code>config.json</code>.",
    wallet_btn:"Connect Wallet",
    wallet_head:"Connect Wallet",
    wallet_evm:"MetaMask / OKX / Bitget",
    wallet_sol:"Phantom (Solana)",
    wallet_ton:"TonConnect",
    wallet_none:"Not connected"
  },
  ru:{
    hero_title:"АРМИЯ ИИ <span class='c-brand'>ZUZU</span>",
    hero_desc:"ZUZU объединяет мем-энергию с <b>AI Meme Intelligence</b>. Средства пресейла хранятся в <b>non-custodial</b> казне. Делись, зарабатывай очки с <b>tap-to-earn</b>, увеличивай доход со <b>staking</b>.",
    d:"Дни",h:"Часы",m:"Мин",s:"Сек",
    w1:"1 неделя",w2:"2 неделя",w3:"3 неделя",w4:"4 неделя",
    gallery_title:"Галерея Маскотов ZUZU",
    roadmap_title:"Дорожная карта",
    phase1:"Presale • Сообщество • Дроп маскотов",
    phase2:"Заявки на листинг • Маркетинг • Партнерства",
    phase3:"Tap-to-Earn • Стейкинг • AI Meme Intelligence",
    token_title:"Токеномика",
    token_note:"Доли берутся из <code>config.json</code>.",
    wallet_btn:"Подключить кошелек",
    wallet_head:"Подключить кошелек",
    wallet_evm:"MetaMask / OKX / Bitget",
    wallet_sol:"Phantom (Solana)",
    wallet_ton:"TonConnect",
    wallet_none:"Не подключен"
  },
  es:{
    hero_title:"EJÉRCITO DE IA <span class='c-brand'>ZUZU</span>",
    hero_desc:"ZUZU combina la energía meme con <b>AI Meme Intelligence</b>. Los fondos de la preventa se guardan en una tesorería <b>no custodial</b>. Comparte, gana puntos con <b>tap-to-earn</b> y gana más con <b>staking</b>.",
    d:"Días",h:"Horas",m:"Min",s:"Seg",
    w1:"Semana 1",w2:"Semana 2",w3:"Semana 3",w4:"Semana 4",
    gallery_title:"Galería de Mascotas ZUZU",
    roadmap_title:"Hoja de Ruta",
    phase1:"Preventa • Comunidad • Lanzamiento de Mascotas",
    phase2:"Aplicaciones CEX • Marketing • Alianzas",
    phase3:"Tap-to-Earn • Staking • AI Meme Intelligence",
    token_title:"Tokenomía",
    token_note:"Porcentajes desde <code>config.json</code>.",
    wallet_btn:"Conectar Billetera",
    wallet_head:"Conectar Billetera",
    wallet_evm:"MetaMask / OKX / Bitget",
    wallet_sol:"Phantom (Solana)",
    wallet_ton:"TonConnect",
    wallet_none:"No conectado"
  },
  de:{
    hero_title:"KI-GESTÜTZTE <span class='c-brand'>ZUZU</span> ARMEE",
    hero_desc:"ZUZU vereint Meme-Energie mit <b>AI Meme Intelligence</b>. Presale-Mittel liegen im <b>non-custodial</b> Tresor. Teile, verdiene Punkte mit <b>tap-to-earn</b> und steigere mit <b>Staking</b>.",
    d:"Tage",h:"Std",m:"Min",s:"Sek",
    w1:"Woche 1",w2:"Woche 2",w3:"Woche 3",w4:"Woche 4",
    gallery_title:"ZUZU Maskottchen-Galerie",
    roadmap_title:"Roadmap",
    phase1:"Presale • Community • Maskottchen-Drop",
    phase2:"CEX-Anträge • Marketing • Partnerschaften",
    phase3:"Tap-to-Earn • Staking • AI Meme Intelligence",
    token_title:"Tokenomics",
    token_note:"Verhältnisse aus <code>config.json</code>.",
    wallet_btn:"Wallet verbinden",
    wallet_head:"Wallet verbinden",
    wallet_evm:"MetaMask / OKX / Bitget",
    wallet_sol:"Phantom (Solana)",
    wallet_ton:"TonConnect",
    wallet_none:"Nicht verbunden"
  },
  fr:{
    hero_title:"ARMÉE IA <span class='c-brand'>ZUZU</span>",
    hero_desc:"ZUZU combine l’énergie mème avec <b>AI Meme Intelligence</b>. Les fonds de prévente sont conservés dans une trésorerie <b>non-custodial</b>. Partage, gagne des points avec <b>tap-to-earn</b> et plus avec le <b>staking</b>.",
    d:"Jours",h:"Heures",m:"Min",s:"Sec",
    w1:"Semaine 1",w2:"Semaine 2",w3:"Semaine 3",w4:"Semaine 4",
    gallery_title:"Galerie des Mascottes ZUZU",
    roadmap_title:"Feuille de Route",
    phase1:"Prévente • Communauté • Drop Mascotte",
    phase2:"Dépôts CEX • Marketing • Partenariats",
    phase3:"Tap-to-Earn • Staking • AI Meme Intelligence",
    token_title:"Tokenomie",
    token_note:"Ratios depuis <code>config.json</code>.",
    wallet_btn:"Connecter le wallet",
    wallet_head:"Connecter le wallet",
    wallet_evm:"MetaMask / OKX / Bitget",
    wallet_sol:"Phantom (Solana)",
    wallet_ton:"TonConnect",
    wallet_none:"Non connecté"
  },
  zh:{
    hero_title:"AI 驱动的 <span class='c-brand'>ZUZU</span> 军团",
    hero_desc:"ZUZU 将表情包能量与 <b>AI Meme Intelligence</b> 结合。预售资金存于 <b>非托管</b> 金库。分享，<b>tap-to-earn</b> 获得积分，并通过 <b>质押</b> 获得更多收益。",
    d:"天",h:"时",m:"分",s:"秒",
    w1:"第1周",w2:"第2周",w3:"第3周",w4:"第4周",
    gallery_title:"ZUZU 吉祥物画廊",
    roadmap_title:"路线图",
    phase1:"预售 • 社区 • 吉祥物空投",
    phase2:"CEX 申请 • 营销 • 合作",
    phase3:"Tap-to-Earn • 质押 • AI Meme Intelligence",
    token_title:"代币经济",
    token_note:"比例来自 <code>config.json</code>。",
    wallet_btn:"连接钱包",
    wallet_head:"连接钱包",
    wallet_evm:"MetaMask / OKX / Bitget",
    wallet_sol:"Phantom (Solana)",
    wallet_ton:"TonConnect",
    wallet_none:"未连接"
  },
  hi:{
    hero_title:"एआई-संचालित <span class='c-brand'>ZUZU</span> सेना",
    hero_desc:"ZUZU <b>AI Meme Intelligence</b> के साथ मीम ऊर्जा को जोड़ता है। प्रीसैल निधि <b>नॉन-कस्टोडियल</b> ट्रेजरी में रहती है। साझा करें, <b>tap-to-earn</b> से अंक कमाएँ, और <b>स्टेकिंग</b> से अधिक पाएं।",
    d:"दिन",h:"घंटे",m:"मिनट",s:"सेकंड",
    w1:"सप्ताह 1",w2:"सप्ताह 2",w3:"सप्ताह 3",w4:"सप्ताह 4",
    gallery_title:"ZUZU मास्कॉट गैलरी",
    roadmap_title:"रोडमैप",
    phase1:"प्रीसैल • कम्युनिटी • मास्कॉट ड्रॉप",
    phase2:"CEX आवेदन • मार्केटिंग • पार्टनरशिप",
    phase3:"Tap-to-Earn • स्टेकिंग • AI Meme Intelligence",
    token_title:"टोकनॉमिक्स",
    token_note:"अनुपात <code>config.json</code> से आता है।",
    wallet_btn:"वॉलेट कनेक्ट करें",
    wallet_head:"वॉलेट कनेक्ट करें",
    wallet_evm:"MetaMask / OKX / Bitget",
    wallet_sol:"Phantom (Solana)",
    wallet_ton:"TonConnect",
    wallet_none:"कनेक्ट नहीं"
  }
};

function setLang(lang){
  const dict = I18N[lang] || I18N.tr;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.dataset.i18n;
    if(dict[key]!==undefined) el.innerHTML = dict[key];
  });
  localStorage.setItem("zuzu_lang",lang);
}
document.getElementById("lang").addEventListener("change",e=>setLang(e.target.value));
window.addEventListener("DOMContentLoaded",()=>{
  const saved = localStorage.getItem("zuzu_lang") || "tr";
  document.getElementById("lang").value = saved;
  setLang(saved);
});

/* --------- Maskot listesi --------- */
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

/* --------- Yardımcılar --------- */
function el(tag,cls){const e=document.createElement(tag); if(cls) e.className=cls; return e;}

/* URL adayları (site + cdn’ler) */
function urlCandidates(relPath){
  return [
    SRC.root + relPath + "?v=41",
    ...SRC.cdn.map(base => base + relPath + "?v=41")
  ];
}

/* WebP: sıra ile dener, biri mutlaka düşer */
function putWebp(container, key, title){
  const img = new Image(); img.className="thumb"; img.alt=title;
  const names = key==="sorceress" ? ["sorceress","maiden"] : [key];
  const rels  = names.map(n=> PATH.webp + n + ".webp");
  const urls  = rels.flatMap(r => urlCandidates(r));
  let i=0;
  const tryNext=()=>{ if(i>=urls.length){ showBadge(container,"görsel/animasyon bulunamadı"); return; } img.src=urls[i++]; };
  img.onerror = tryNext;
  container.appendChild(img);
  tryNext();
}

/* Lottie: varsa bindir, yoksa sessiz */
async function tryLottie(container, key){
  const names = key==="sorceress" ? ["sorceress","maiden"] : [key];
  for(const n of names){
    const rel = PATH.lottie + `zuzu_${n}.json`;
    for(const url of urlCandidates(rel)){
      try{
        const r = await fetch(url,{cache:"no-store"}); if(!r.ok) continue;
        const json = await r.json();
        const layer = el("div","lottieLayer"); container.appendChild(layer);
        lottie.loadAnimation({container:layer,renderer:"svg",loop:true,autoplay:true,animationData:json});
        return true;
      }catch(_){}
    }
  }
  return false;
}
function showBadge(container, text){
  const badge = el("div","badge-error"); badge.textContent = text;
  container.parentElement.appendChild(badge);
}

/* --------- Galeri --------- */
function buildGallery(){
  const grid = document.getElementById("zuzu-gallery");
  grid.innerHTML = "";
  ZUZU.forEach(({key,title})=>{
    const card = el("div","card");
    card.appendChild(Object.assign(el("h3"),{textContent:title}));
    const anim = el("div","animBox"); card.appendChild(anim);
    grid.appendChild(card);

    // 1) WebP kesin
    putWebp(anim,key,title);
    // 2) Lottie bindirme (varsa)
    tryLottie(anim,key);
  });
}

/* --------- Sayaç + Haftalık fiyat --------- */
async function initCountdown(){
  try{
    const conf = await fetch("/config.json?"+Date.now()).then(r=>r.json());
    const start = new Date(conf.presaleStart).getTime();
    const end   = new Date(conf.presaleEnd).getTime();
    // haftalık
    q("#w1").textContent = conf.weeks?.[0] || "0.0010 USDT";
    q("#w2").textContent = conf.weeks?.[1] || "0.0015 USDT";
    q("#w3").textContent = conf.weeks?.[2] || "0.0020 USDT";
    q("#w4").textContent = conf.weeks?.[3] || "0.0025 USDT";

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
    }
    tick(); setInterval(tick,1000);
  }catch(e){ console.warn("countdown:",e); }
}
const q = s=>document.querySelector(s);

/* --------- Tokenomi --------- */
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

/* --------- Cüzdan Modal --------- */
const modal = document.getElementById("wallet-modal");
document.getElementById("btn-wallet").onclick = ()=> modal.classList.remove("hidden");
document.getElementById("closeModal").onclick = ()=> modal.classList.add("hidden");
const setAddr = t => (document.getElementById("addrBox").textContent = t || I18N[localStorage.getItem("zuzu_lang")||"tr"].wallet_none);

// EVM
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
// Solana
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
// TON
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

/* --------- Başlat --------- */
window.addEventListener('DOMContentLoaded', ()=>{
  buildGallery();
  initCountdown();
  initChart();
});
