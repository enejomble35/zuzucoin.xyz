/* ================================
   ZUZU – Tek Dosya JS (V2 – Realistic Covers + Lottie)
   ================================ */

const RECEIVER = '0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3';

/* ---------- Countdown (demo) ---------- */
(function countdown(){
  const t = Date.now()+1000*60*60*24*39 + 1000*60*23 + 1000*58;
  const dEl = $('#dLeft'), hEl = $('#hLeft'), mEl = $('#mLeft'), sEl = $('#sLeft');
  if(!dEl||!hEl||!mEl||!sEl) return;
  const tick = () => {
    const diff = Math.max(0, t - Date.now());
    const d = Math.floor(diff/86400000),
          h = Math.floor(diff%86400000/3600000),
          m = Math.floor(diff%3600000/60000),
          s = Math.floor(diff%60000/1000);
    dEl.textContent = `${d} Gün`; hEl.textContent = `${h} Saat`;
    mEl.textContent = `${m} Dakika`; sEl.textContent = `${s} Saniye`;
    requestAnimationFrame(tick);
  };
  tick();
})();

/* ---------- Helpers ---------- */
function $(sel){ return document.getElementById(sel); }
function qs(sel,root=document){ return root.querySelector(sel); }
function qsa(sel,root=document){ return [...root.querySelectorAll(sel)]; }

/* ---------- Copy buttons ---------- */
$('#btnRefCopy')?.addEventListener('click',()=>navigator.clipboard.writeText($('#refLink').value));
$('#btnRcCopy')?.addEventListener('click',()=>navigator.clipboard.writeText(RECEIVER));

/* ---------- Price calc ---------- */
const stageSel = $('#stageSel');
const amountEl = $('#buyAmount');
const priceLine = $('#priceLine');
const totalLine = $('#totalLine');
function redrawPrice(){
  if(!stageSel||!amountEl) return;
  const p = parseFloat(stageSel.value||'0.002');
  const amt = parseFloat(amountEl.value||'0');
  priceLine.textContent = `Fiyat: ${p.toFixed(6)} USDT / ZUZU`;
  totalLine.textContent = `Toplam: ${(p*amt).toFixed(6)} USDT`;
}
stageSel?.addEventListener('change',redrawPrice);
amountEl?.addEventListener('input',redrawPrice);
qsa('.pick').forEach(b=>b.addEventListener('click',()=>{ amountEl.value=b.dataset.amt; redrawPrice(); }));
redrawPrice();

/* ---------- Wallet connect (MetaMask/EVM) ---------- */
const btnConnect = $('#btnConnect');
const walletInfo = $('#walletInfo');
let provider, signer, address;

async function connectWallet(){
  try{
    if(!window.ethereum){ btnConnect.textContent='MetaMask Yükle'; walletInfo.textContent='Cüzdan bulunamadı'; return; }
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts',[]);
    signer = await provider.getSigner();
    address = await signer.getAddress();
    const short = address.slice(0,6)+'...'+address.slice(-4);
    btnConnect.textContent = short+' ✓';
    walletInfo.textContent = 'Bağlı (kopyalamak için tıkla)';
    walletInfo.onclick = ()=>navigator.clipboard.writeText(address);
  }catch(e){ walletInfo.textContent='Bağlantı reddedildi'; console.warn(e); }
}
btnConnect?.addEventListener('click',connectWallet);

/* ---- Buy (demo info) ---- */
$('#btnBuy')?.addEventListener('click',()=>{
  alert('USDT (BEP20) ile satın alma akıllı sözleşme entegrasyonu bir sonraki aşamada aktif edilecek.\nŞimdilik receiver adresine transfer ile ilerleyin:\n\n'+RECEIVER);
});

/* ---------- Tokenomics donut ---------- */
(function drawTokenomics(){
  const ctx = $('#tokenChart'); if(!ctx) return;
  new Chart(ctx,{
    type:'doughnut',
    data:{
      labels:['Presale 45%','Liquidity 25%','Marketing 15%','Team 10%','Airdrop 5%'],
      datasets:[{
        data:[45,25,15,10,5],
        backgroundColor:['#00ffc3','#18a0fb','#ffb24d','#ff657a','#7e8cff'],
        borderColor:'rgba(255,255,255,.06)', borderWidth:2, hoverOffset:8
      }]
    },
    options:{ plugins:{legend:{display:false}}, cutout:'58%' }
  });
})();

/* =========================================================
   MASKOT – Gerçekçi kapak + Lottie (yüklenirse) + Lightbox
   ========================================================= */

/* Kapak görselleri (repo’ya yüklediklerin) */
const COVERS = {
  logo:      null, // yoksa SVG fallback kullan
  hero:      'assets/zuzu/realistic/hero.webp',
  hacker:    'assets/zuzu/realistic/hacker.webp',
  warrior:   'assets/zuzu/realistic/warrior.webp',
  sorceress: 'assets/zuzu/realistic/sorceress.webp',
  ranger:    'assets/zuzu/realistic/ranger.webp',
  berserker: 'assets/zuzu/realistic/berserker.webp',
  scientist: 'assets/zuzu/realistic/scientist.webp',
  rogue:     'assets/zuzu/realistic/rogue.webp',
  titan:     'assets/zuzu/realistic/titan.webp'
};

/* Basit glow animasyon JSON (gözükmesi için) */
function glowCircleJSON(color=[0,1,0.82,1]){
  return {v:"5.7.4",fr:30,ip:0,op:120,w:512,h:512,nm:"glow",ddd:0,assets:[],
    layers:[{ty:4,nm:"g",ks:{o:{a:0,k:100},p:{a:0,k:[256,256,0]},a:{a:0,k:[0,0,0]},s:{a:0,k:[100,100,100]}},
      shapes:[
        {ty:"el",p:{a:0,k:[0,0]},s:{a:0,k:[420,420]},fl:{c:{a:0,k:[0.04,0.07,0.12,1]}}},
        {ty:"el",p:{a:0,k:[0,0]},s:{a:1,k:[{t:0,s:[420,420]},{t:60,s:[460,460]},{t:120,s:[420,420]}]},
         st:{o:{a:0,k:0}},fl:{c:{a:0,k:color}}}
      ]}]};
}
const LOTTIES = {
  logo: glowCircleJSON([0,1,0.82,1]),
  hero: glowCircleJSON([0,1,0.82,1]),
  hacker: glowCircleJSON([0,1,0.82,1]),
  warrior: glowCircleJSON([1,0.55,0.3,1]),
  sorceress: glowCircleJSON([0,1,0.82,1]),
  ranger: glowCircleJSON([0,1,0.82,1]),
  berserker: glowCircleJSON([1,0.35,0.35,1]),
  scientist: glowCircleJSON([0,1,0.82,1]),
  rogue: glowCircleJSON([0.85,0.88,1,1]),
  titan: glowCircleJSON([0,1,0.82,1])
};

const FALLBACK_SVG = {
  logo:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><rect width='512' height='512' rx='24' fill='#07121a'/><circle cx='256' cy='256' r='210' fill='#0a1420'/><g fill='#00ffd0'><rect x='168' y='190' width='36' height='50' rx='10'/><rect x='308' y='190' width='36' height='50' rx='10'/></g><rect x='176' y='300' width='160' height='26' rx='13' fill='#ff7a1a'/></svg>`
};

/* Kart listesi */
const ITEMS = [
  {key:'logo',name:'ZUZU Logo',desc:'Temel maskot – glow'},
  {key:'hero',name:'ZUZU Hero',desc:'Neon zırh + hatlar'},
  {key:'hacker',name:'ZUZU Hacker',desc:'Yüz tarama + sinyal'},
  {key:'warrior',name:'ZUZU Warrior',desc:'Kılıç parlaması'},
  {key:'sorceress',name:'ZUZU Sorceress',desc:'Büyü küresi'},
  {key:'ranger',name:'ZUZU Ranger',desc:'Vizör + kayış'},
  {key:'berserker',name:'ZUZU Berserker',desc:'Kızgın aura'},
  {key:'scientist',name:'ZUZU Scientist',desc:'Devre hatları'},
  {key:'rogue',name:'ZUZU Rogue',desc:'Gizli bıçak'},
  {key:'titan',name:'ZUZU Titan',desc:'Kalkan + pulse'}
];

/* Galeriyi kur */
(function buildGallery(){
  const root = $('#zgal'); if(!root) return;
  root.innerHTML = ITEMS.map(it=>{
    const cover = COVERS[it.key];
    const coverTag = cover
      ? `<img class="thumb" src="${cover}" alt="${it.name}" loading="lazy">`
      : `<img class="thumb" src="data:image/svg+xml;utf8,${encodeURIComponent(FALLBACK_SVG.logo)}" alt="${it.name}" loading="lazy">`;
    return `
      <article class="zcard">
        <div class="zanim" data-key="${it.key}">
          ${coverTag}
        </div>
        <div class="zinfo"><div class="zname">${it.name}</div><div class="zdesc">${it.desc}</div></div>
        <button class="zbtn" data-show="${it.key}" aria-label="${it.name}"></button>
      </article>`;
  }).join('');

  // Lottie'yi görünür olunca başlat (performans)
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      const holder = entry.target;
      io.unobserve(holder);
      const k = holder.dataset.key;
      try{
        const anim = lottie.loadAnimation({container:holder, renderer:'svg', loop:true, autoplay:true, animationData:LOTTIES[k]});
        // Kapak altta dursun ama çok koyu kalmasın
        const img = holder.querySelector('.thumb');
        if(img){ img.style.opacity = '0.22'; img.style.transition='opacity .4s ease'; }
      }catch(e){ /* lottie yüklenemezse kapak zaten kalır */ }
    });
  },{rootMargin:'50px'});
  qsa('.zanim',root).forEach(h=>io.observe(h));
})();

/* Lightbox */
(function lightbox(){
  const box = $('#zbox'); if(!box) return;
  const nameEl = $('#zboxName'), descEl = $('#zboxDesc'), animEl = $('#zboxAnim');
  let current;
  const open = (key)=>{
    const meta = ITEMS.find(i=>i.key===key);
    nameEl.textContent = meta.name; descEl.textContent = meta.desc;
    animEl.innerHTML = '';
    try{
      current = lottie.loadAnimation({container:animEl, renderer:'svg', loop:true, autoplay:true, animationData: LOTTIES[key]});
    }catch(e){
      // Lottie yoksa büyük kapak göster
      const cover = COVERS[key] || `data:image/svg+xml;utf8,${encodeURIComponent(FALLBACK_SVG.logo)}`;
      animEl.innerHTML = `<img src="${cover}" alt="${meta.name}" style="width:100%;height:100%;object-fit:contain;">`;
    }
    box.classList.add('active');
  };
  const close = ()=>{
    box.classList.remove('active');
    if(current){ try{ current.destroy(); }catch(_){} current=null; }
  };
  document.addEventListener('click',e=>{
    const btn = e.target.closest('[data-show]'); if(btn){ open(btn.dataset.show); }
    if(e.target.hasAttribute('data-close')) close();
  });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
})();

/* Küçük QR efektini hareketli yap (daha canlı dursun) */
(function animateQR(){
  const qr = qs('.qr'); if(!qr) return;
  let t=0; const tick=()=>{
    t+=0.02;
    qr.style.backgroundPosition = `${Math.sin(t)*8}px ${Math.cos(t)*8}px`;
    requestAnimationFrame(tick);
  }; tick();
})();
