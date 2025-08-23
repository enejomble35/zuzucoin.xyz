/* ================== SOURCES / CONFIG ================== */
const CONFIG = {
  // Başlangıç: Türkiye saati
  presaleStart: "2025-09-15T18:00:00+03:00",
  weekPrices: [0.0010,0.0015,0.0020,0.0025],
  tokenomics: { labels:['Presale','Liquidity','Marketing','Team','Airdrop'], data:[55,20,12,6,7] },
  exchanges:[ 'mexc','gateio','bitmart','bybit','kucoin','okx' ],
  maskots:['hero','ranger','warrior','hacker','rogue','titan','sorceress','berserker','scientist','maiden'],
  alias:{ sorceress:['sorceress','maiden'], maiden:['maiden','sorceress'] }
};
// localStorage override (admin.html kaydeder)
try{
  const ov = JSON.parse(localStorage.getItem('zuzu_cfg_override')||'null');
  if(ov){
    if(ov.presaleStart) CONFIG.presaleStart = ov.presaleStart;
    if(Array.isArray(ov.weekPrices) && ov.weekPrices.length===4) CONFIG.weekPrices = ov.weekPrices;
    if(ov.tokenomics?.data) CONFIG.tokenomics.data = ov.tokenomics.data;
  }
}catch{}

/* ================== MULTI-LANG ================== */
const STR = {
  tr:{ title:"ZUZU • AI Meme Intelligence",
       heroTitle:"YAPAY ZEKA <span class='z'>ZUZU</span> ORDUSU",
       heroText:"ZUZU; memetik enerjiyi AI Meme Intelligence katmanıyla birleştirir. Presale fonları non-custodial hazinede tutulur. Paylaş, tap-to-earn ile puan topla, stake ile daha fazla kazanç hedefle.",
       day:"Gün",hour:"Saat",min:"Dakika",sec:"Saniye",week:"Hafta",buy:"Satın Al",soon:"Yakında",ended:"Bitti",
       gTitle:"ZUZU Maskot Galerisi", rTitle:"Yol Haritası", tTitle:"Tokenomi",
       r1t:"Phase 1 — Presale • Topluluk • Maskot Drop", r1i1:"Ön satış ve topluluk inşası", r1i2:"Maskot NFT drop",
       r2t:"Phase 2 — CEX Başvuruları • Pazarlama • Partnerlikler", r2i1:"Global pazarlama, KOL iş birlikleri", r2i2:"CEX listeleme başvuruları",
       r3t:"Phase 3 — Tap-to-Earn • Staking • AI Meme Intelligence", r3i1:"Tap-to-Earn mini oyunlar", r3i2:"Stake paneli ve ödüller",
       wallet:"Cüzdan Bağla", wTitle:"Cüzdan Bağla"
  },
  en:{ title:"ZUZU • AI Meme Intelligence",
       heroTitle:"AI-POWERED <span class='z'>ZUZU</span> ARMY",
       heroText:"ZUZU merges memetic energy with AI Meme Intelligence. Presale funds are held in a non-custodial treasury. Share, tap-to-earn and stake to maximize rewards.",
       day:"Days",hour:"Hours",min:"Minutes",sec:"Seconds",week:"Week",buy:"Buy",soon:"Soon",ended:"Ended",
       gTitle:"ZUZU Mascot Gallery", rTitle:"Roadmap", tTitle:"Tokenomics",
       r1t:"Phase 1 — Presale • Community • Mascot Drop", r1i1:"Presale & community building", r1i2:"Mascot NFT drop",
       r2t:"Phase 2 — CEX Listings • Marketing • Partnerships", r2i1:"Global marketing & KOLs", r2i2:"CEX listing applications",
       r3t:"Phase 3 — Tap-to-Earn • Staking • AI Meme Intelligence", r3i1:"Tap-to-Earn mini games", r3i2:"Staking panel & rewards",
       wallet:"Connect Wallet", wTitle:"Connect Wallet"
  },
  ru:{ title:"ZUZU • AI Meme Intelligence",
       heroTitle:"АРМИЯ <span class='z'>ZUZU</span> НА ИИ",
       heroText:"ZUZU объединяет мемную энергию с AI Meme Intelligence. Средства пресейла хранятся в некастодиальном казначействе. Делись, tap-to-earn и стейк для максимальной выгоды.",
       day:"Дни",hour:"Часы",min:"Мин",sec:"Сек",week:"Неделя",buy:"Купить",soon:"Скоро",ended:"Завершено",
       gTitle:"Галерея маскотов ZUZU", rTitle:"Дорожная карта", tTitle:"Токеномика",
       r1t:"Фаза 1 — Пресейл • Сообщество • Дроп маскотов", r1i1:"Построение сообщества", r1i2:"Дроп NFT маскотов",
       r2t:"Фаза 2 — СEX листинги • Маркетинг • Партнерства", r2i1:"Глобальный маркетинг", r2i2:"Заявки на листинг",
       r3t:"Фаза 3 — Tap-to-Earn • Стейкинг • AI Meme Intelligence", r3i1:"Мини-игры", r3i2:"Стейкинг и награды",
       wallet:"Подключить кошелёк", wTitle:"Подключить кошелёк"
  },
  hi:{ title:"ZUZU • AI Meme Intelligence",
       heroTitle:"एआई संचालित <span class='z'>ZUZU</span> सेना",
       heroText:"ZUZU, मेमेटिक ऊर्जा को AI Meme Intelligence के साथ जोड़ता है। प्रीसेल निधि नॉन-कस्टोडियल ट्रेजरी में रखी जाती है। शेयर करें, tap-to-earn और स्टेक करें।",
       day:"दिन",hour:"घंटे",min:"मिनट",sec:"सेकंड",week:"सप्ताह",buy:"खरीदो",soon:"जल्द",ended:"समाप्त",
       gTitle:"ZUZU मैस्कॉट गैलरी", rTitle:"रोडमैप", tTitle:"टोकनोमिक्स",
       r1t:"फेज 1 — प्रीसेल • कम्युनिटी • मैस्कॉट ड्रॉप", r1i1:"कम्युनिटी बिल्डिंग", r1i2:"मैस्कॉट NFT ड्रॉप",
       r2t:"फेज 2 — CEX लिस्टिंग • मार्केटिंग • पार्टनरशिप", r2i1:"ग्लोबल मार्केटिंग", r2i2:"लिस्टिंग आवेदन",
       r3t:"फेज 3 — Tap-to-Earn • स्टेकिंग • AI Meme Intelligence", r3i1:"मिनी गेम्स", r3i2:"स्टेकिंग और रिवार्ड्स",
       wallet:"वॉलेट कनेक्ट", wTitle:"वॉलेट कनेक्ट"
  },
  es:{ title:"ZUZU • AI Meme Intelligence",
       heroTitle:"EJÉRCITO <span class='z'>ZUZU</span> IMPULSADO POR IA",
       heroText:"ZUZU fusiona la energía memética con AI Meme Intelligence. Los fondos del presale se guardan en tesorería no custodial. Comparte, tap-to-earn y stake para más recompensas.",
       day:"Días",hour:"Horas",min:"Min",sec:"Seg",week:"Semana",buy:"Comprar",soon:"Pronto",ended:"Finalizado",
       gTitle:"Galería de Mascotas ZUZU", rTitle:"Hoja de Ruta", tTitle:"Tokenomics",
       r1t:"Fase 1 — Presale • Comunidad • Mascot Drop", r1i1:"Construcción de comunidad", r1i2:"Drop de NFT de mascotas",
       r2t:"Fase 2 — Listados CEX • Marketing • Alianzas", r2i1:"Marketing global", r2i2:"Solicitudes de listado",
       r3t:"Fase 3 — Tap-to-Earn • Staking • AI Meme Intelligence", r3i1:"Mini juegos", r3i2:"Panel de staking y recompensas",
       wallet:"Conectar Billetera", wTitle:"Conectar Billetera"
  },
  de:{ title:"ZUZU • AI Meme Intelligence",
       heroTitle:"KI-GESTÜTZTE <span class='z'>ZUZU</span> ARMEE",
       heroText:"ZUZU vereint memetische Energie mit AI Meme Intelligence. Presale-Mittel liegen in einer Non-Custodial-Treasury. Teile, tap-to-earn und stake für mehr Rewards.",
       day:"Tage",hour:"Std",min:"Min",sec:"Sek",week:"Woche",buy:"Kaufen",soon:"Bald",ended:"Beendet",
       gTitle:"ZUZU Maskottchen Galerie", rTitle:"Roadmap", tTitle:"Tokenomics",
       r1t:"Phase 1 — Presale • Community • Maskottchen Drop", r1i1:"Community Aufbau", r1i2:"Maskottchen-NFT Drop",
       r2t:"Phase 2 — CEX Listings • Marketing • Partnerschaften", r2i1:"Globales Marketing", r2i2:"Listing Anträge",
       r3t:"Phase 3 — Tap-to-Earn • Staking • AI Meme Intelligence", r3i1:"Mini-Spiele", r3i2:"Staking & Rewards",
       wallet:"Wallet verbinden", wTitle:"Wallet verbinden"
  },
  fr:{ title:"ZUZU • AI Meme Intelligence",
       heroTitle:"ARMÉE <span class='z'>ZUZU</span> PROPULSÉE PAR IA",
       heroText:"ZUZU fusionne l’énergie mématique avec AI Meme Intelligence. Les fonds du presale sont conservés en trésorerie non-custodiale. Partage, tap-to-earn et stake pour plus de gains.",
       day:"Jours",hour:"Heures",min:"Min",sec:"Sec",week:"Semaine",buy:"Acheter",soon:"Bientôt",ended:"Terminé",
       gTitle:"Galerie des Mascottes ZUZU", rTitle:"Feuille de Route", tTitle:"Tokenomics",
       r1t:"Phase 1 — Presale • Communauté • Mascotte Drop", r1i1:"Construction de communauté", r1i2:"Drop NFT mascotte",
       r2t:"Phase 2 — Listings CEX • Marketing • Partenariats", r2i1:"Marketing global", r2i2:"Demandes de listing",
       r3t:"Phase 3 — Tap-to-Earn • Staking • AI Meme Intelligence", r3i1:"Mini-jeux", r3i2:"Panel de staking & récompenses",
       wallet:"Connecter le Wallet", wTitle:"Connecter le Wallet"
  },
  ar:{ title:"ZUZU • ذكاء الميم الاصطناعي",
       heroTitle:"جيش <span class='z'>ZUZU</span> المدعوم بالذكاء الاصطناعي",
       heroText:"تدمج ZUZU طاقة الميم مع ذكاء الميم الاصطناعي. تحفظ أموال البيع المسبق في خزينة غير وصائية. شارك، tap-to-earn ثم قم بالـ stake لزيادة الأرباح.",
       day:"أيام",hour:"ساعات",min:"دقائق",sec:"ثوانٍ",week:"أسبوع",buy:"شراء",soon:"قريبًا",ended:"انتهى",
       gTitle:"معرض تمائم ZUZU", rTitle:"خريطة الطريق", tTitle:"اقتصاد الرمز",
       r1t:"المرحلة 1 — بيع مسبق • المجتمع • إسقاط التمائم", r1i1:"بناء المجتمع", r1i2:"إسقاط NFT للتمائم",
       r2t:"المرحلة 2 — إدراجات CEX • التسويق • الشراكات", r2i1:"تسويق عالمي", r2i2:"طلبات الإدراج",
       r3t:"المرحلة 3 — Tap-to-Earn • Staking • ذكاء الميم", r3i1:"ألعاب مصغّرة", r3i2:"لوحة Staking والمكافآت",
       wallet:"ربط المحفظة", wTitle:"ربط المحفظة"
  },
  pt:{ title:"ZUZU • IA Meme Intelligence",
       heroTitle:"EXÉRCITO <span class='z'>ZUZU</span> COM IA",
       heroText:"ZUZU une a energia memética com AI Meme Intelligence. Fundos do presale ficam em tesouraria non-custodial. Compartilhe, tap-to-earn e stake para mais ganhos.",
       day:"Dias",hour:"Horas",min:"Min",sec:"Seg",week:"Semana",buy:"Comprar",soon:"Em breve",ended:"Encerrado",
       gTitle:"Galeria de Mascotes ZUZU", rTitle:"Roteiro", tTitle:"Tokenomics",
       r1t:"Fase 1 — Presale • Comunidade • Mascot Drop", r1i1:"Construção de comunidade", r1i2:"Drop de NFT",
       r2t:"Fase 2 — Listagens CEX • Marketing • Parcerias", r2i1:"Marketing global", r2i2:"Pedidos de listagem",
       r3t:"Fase 3 — Tap-to-Earn • Staking • AI Meme Intelligence", r3i1:"Mini jogos", r3i2:"Staking e recompensas",
       wallet:"Conectar Carteira", wTitle:"Conectar Carteira"
  },
  it:{ title:"ZUZU • AI Meme Intelligence",
       heroTitle:"ESERCITO <span class='z'>ZUZU</span> POTENZIATO DALL'IA",
       heroText:"ZUZU unisce l’energia memetica con AI Meme Intelligence. I fondi del presale sono in tesoreria non-custodial. Condividi, tap-to-earn e fai staking.",
       day:"Giorni",hour:"Ore",min:"Min",sec:"Sec",week:"Settimana",buy:"Acquista",soon:"Presto",ended:"Terminato",
       gTitle:"Galleria Mascotte ZUZU", rTitle:"Roadmap", tTitle:"Tokenomics",
       r1t:"Fase 1 — Presale • Community • Mascot Drop", r1i1:"Costruzione della community", r1i2:"Drop NFT mascotte",
       r2t:"Fase 2 — Listing CEX • Marketing • Partnership", r2i1:"Marketing globale", r2i2:"Richieste di listing",
       r3t:"Fase 3 — Tap-to-Earn • Staking • AI Meme Intelligence", r3i1:"Mini giochi", r3i2:"Pannello staking & ricompense",
       wallet:"Collega Wallet", wTitle:"Collega Wallet"
  },
  zh:{ title:"ZUZU • AI Meme Intelligence",
       heroTitle:"由 AI 驱动的 <span class='z'>ZUZU</span> 军团",
       heroText:"ZUZU 将迷因能量与 AI Meme Intelligence 结合。预售资金存放在非托管金库。分享、Tap-to-Earn 并质押以获得更多收益。",
       day:"天",hour:"小时",min:"分钟",sec:"秒",week:"周",buy:"购买",soon:"即将",ended:"已结束",
       gTitle:"ZUZU 吉祥物画廊", rTitle:"路线图", tTitle:"代币经济",
       r1t:"阶段 1 — 预售 • 社区 • 吉祥物空投", r1i1:"社区建设", r1i2:"吉祥物 NFT 空投",
       r2t:"阶段 2 — CEX 上线 • 营销 • 合作", r2i1:"全球营销", r2i2:"申请上线",
       r3t:"阶段 3 — Tap-to-Earn • 质押 • AI Meme Intelligence", r3i1:"小游戏", r3i2:"质押面板与奖励",
       wallet:"连接钱包", wTitle:"连接钱包"
  }
};
const $ = s => document.querySelector(s);
const setHTML = (id,html)=>{ const el = typeof id==='string' ? document.getElementById(id) : id; if(el) el.innerHTML = html; };
const setTXT  = (id,txt)=>{ const el = typeof id==='string' ? document.getElementById(id) : id; if(el) el.textContent = txt; };

let LANG = localStorage.getItem('zuzu_lang') || 'tr';
const langSel = document.getElementById('lang');
langSel.value = LANG;

/* RTL toggle (Arabic) */
function applyDir(){
  if(LANG==='ar'){ document.documentElement.setAttribute('dir','rtl'); }
  else{ document.documentElement.removeAttribute('dir'); }
}

function applyLang(){
  const T = STR[LANG] || STR.tr;
  document.title = T.title;
  setHTML('heroTitle', T.heroTitle);
  setTXT('heroText', T.heroText);
  setTXT('t-day', T.day); setTXT('t-hour', T.hour); setTXT('t-min', T.min); setTXT('t-sec', T.sec);
  setTXT('galleryTitle', T.gTitle); setTXT('roadmapTitle', T.rTitle); setTXT('tokenTitle', T.tTitle);
  setTXT('r1t', T.r1t); setTXT('r1i1', T.r1i1); setTXT('r1i2', T.r1i2);
  setTXT('r2t', T.r2t); setTXT('r2i1', T.r2i1); setTXT('r2i2', T.r2i2);
  setTXT('r3t', T.r3t); setTXT('r3i1', T.r3i1); setTXT('r3i2', T.r3i2);
  $('#btnWallet').textContent = T.wallet;
  $('#wTitle').textContent = T.wTitle;
  applyDir();
  renderWeeks(); // yazılar değişsin
}
langSel.addEventListener('change',()=>{
  LANG = langSel.value;
  localStorage.setItem('zuzu_lang', LANG);
  applyLang();
});

/* ========== SAFE IMAGE RESOLVE (HEAD check) ========== */
async function goodImage(url){
  try{
    const r = await fetch(url,{method:'HEAD',cache:'no-store'});
    if(!r.ok) return false;
    const ct = (r.headers.get('content-type')||'').toLowerCase();
    const len = parseInt(r.headers.get('content-length')||'0',10);
    return ct.startsWith('image') && len>50; // 0KB/bozuk dosyayı ele
  }catch(e){ return false; }
}
async function resolveImage(candidates){
  for(const u of candidates){
    if(await goodImage(u)) return u + (u.includes('?')?'&':'?') + 'v=' + Date.now();
  }
  return null;
}

/* ========== EXCHANGE LOGOS ========== */
async function renderExchanges(){
  const row = $('#exList'); row.innerHTML='';
  for(const id of CONFIG.exchanges){
    const img=document.createElement('img'); img.alt=id.toUpperCase();
    const url=await resolveImage([`/assets/zuzu/exchanges/${id}.svg`,`/assets/zuzu/exchanges/${id}.png`]);
    if(url){ img.src=url; row.appendChild(img); }
  }
}

/* ========== TOKENOMICS ========== */
function renderChart(){
  const ctx=$('#donut').getContext('2d');
  new Chart(ctx,{type:'doughnut',
    data:{labels:CONFIG.tokenomics.labels,datasets:[{data:CONFIG.tokenomics.data,backgroundColor:['#24e0b6','#31c4ff','#ffd166','#a78bfa','#ff8fab'],borderColor:'#0f1828',borderWidth:2}]},
    options:{plugins:{legend:{display:false}},cutout:'60%'}
  });
}

/* ========== COUNTDOWN + WEEKS ========== */
const start=new Date(CONFIG.presaleStart).getTime();
const weekMS=7*24*3600*1000;
function weekIndex(){
  const now=Date.now(); if(now<start) return -1;
  for(let i=0;i<4;i++){ const s=start+i*weekMS, e=s+weekMS; if(now>=s&&now<e) return i; }
  return 4;
}
function tick(){
  const end=start+4*weekMS, left=Math.max(0,end-Date.now());
  const d=Math.floor(left/86400000), h=Math.floor((left%86400000)/3600000),
        m=Math.floor((left%3600000)/60000), s=Math.floor((left%60000)/1000);
  setTXT('cd-d',d); setTXT('cd-h',h); setTXT('cd-m',m); setTXT('cd-s',s);
}
function renderWeeks(){
  const T=STR[LANG]; const box=$('#weeks'); box.innerHTML='';
  const idx=weekIndex();
  CONFIG.weekPrices.forEach((p,i)=>{
    const div=document.createElement('div'); div.className='w';
    div.innerHTML=`<h4>${i+1}. ${T.week}</h4>
      <div class="price">${p.toFixed(4)} USDT</div>
      <button class="buy ${idx===i?'active':'disabled'}" data-w="${i}">
        ${idx===i?T.buy:(idx<i?T.soon:T.ended)}
      </button>`;
    box.appendChild(div);
  });
  box.querySelectorAll('.buy.active').forEach(b=>b.addEventListener('click',()=>alert(`${parseInt(b.dataset.w)+1}. ${T.week} — ${T.buy}`)));
}

/* ========== GALLERY ========== */
function candidates(name){
  const base='/assets/zuzu/realistic/';
  const names=CONFIG.alias[name]?CONFIG.alias[name]:[name];
  const list=[];
  names.forEach(n=>['png','jpg','jpeg','webp'].forEach(ext=>list.push(base+n+'.'+ext)));
  return list;
}
async function buildGallery(){
  const grid=$('#gallery'); grid.innerHTML='';
  for(const key of CONFIG.maskots){
    const card=document.createElement('div'); card.className='card';
    const title='ZUZU '+ key.charAt(0).toUpperCase()+key.slice(1);
    card.innerHTML=`<h3>${title}</h3>`;
    const img=document.createElement('img'); img.className='thumb'; img.alt=title; img.loading='lazy';
    const url=await resolveImage(candidates(key));
    if(url){ img.src=url; card.appendChild(img); }
    else{ const b=document.createElement('div'); b.className='badge err'; b.textContent='görsel/animasyon bulunamadı'; card.appendChild(b); }
    grid.appendChild(card);
  }
}

/* ========== WALLET ========== */
const modal = document.getElementById('walletModal');
document.getElementById('btnWallet').onclick = ()=> modal.classList.remove('hidden');
document.getElementById('wClose').onclick  = ()=> modal.classList.add('hidden');

document.getElementById('evmBtn').onclick = async ()=>{
  try{
    if(window.ethereum){
      const accts = await ethereum.request({method:'eth_requestAccounts'});
      document.getElementById('addrBox').textContent = 'EVM: '+accts[0];
    }else{
      location.href = 'https://metamask.app.link/dapp/'+location.host;
    }
  }catch(e){ alert('EVM: '+e.message); }
};
document.getElementById('solBtn').onclick = ()=>{
  // Phantom app yoksa mağazaya yönlendir
  const dapp = encodeURIComponent(location.origin);
  location.href = 'https://phantom.app/ul/browse/'+dapp;
};
document.getElementById('tonBtn').onclick = ()=>{
  // Tonkeeper deeplink
  location.href = 'tonkeeper://';
};

/* ========== INIT ========== */
applyLang();
renderExchanges();
renderChart();
renderWeeks();
buildGallery();
tick(); setInterval(tick,1000);
