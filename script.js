/* ================================
   ZUZU – Tek Dosya JS
   ================================ */

// ---- SABİTLER
const RECEIVER = '0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3';

// ---- COUNTDOWN (demo)
(function countdown(){
  const target = Date.now()+1000*60*60*24*39 + 1000*60*23 + 1000*58; // 39g 23s 58d
  const dEl = document.getElementById('dLeft');
  const hEl = document.getElementById('hLeft');
  const mEl = document.getElementById('mLeft');
  const sEl = document.getElementById('sLeft');
  const tick = () => {
    const diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff/86400000);
    const h = Math.floor(diff%86400000/3600000);
    const m = Math.floor(diff%3600000/60000);
    const s = Math.floor(diff%60000/1000);
    dEl.textContent = `${d} Gün`; hEl.textContent = `${h} Saat`; mEl.textContent = `${m} Dakika`; sEl.textContent = `${s} Saniye`;
    requestAnimationFrame(tick);
  };
  tick();
})();

// ---- REFERANS KOPYALA
document.getElementById('btnRefCopy').onclick = () => {
  navigator.clipboard.writeText(document.getElementById('refLink').value);
};

// ---- RECEIVER KOPYALA
document.getElementById('btnRcCopy').onclick = () => {
  navigator.clipboard.writeText(RECEIVER);
};

// ---- FİYAT HESABI
const stageSel = document.getElementById('stageSel');
const amountEl = document.getElementById('buyAmount');
const priceLine = document.getElementById('priceLine');
const totalLine = document.getElementById('totalLine');

function redrawPrice(){
  const p = parseFloat(stageSel.value||'0.002');
  const amt = parseFloat(amountEl.value||'0');
  priceLine.textContent = `Fiyat: ${p.toFixed(6)} USDT / ZUZU`;
  totalLine.textContent = `Toplam: ${(p*amt).toFixed(6)} USDT`;
}
stageSel.onchange = redrawPrice;
amountEl.oninput = redrawPrice;
document.querySelectorAll('.pick').forEach(btn=>{
  btn.onclick = ()=>{ amountEl.value = btn.dataset.amt; redrawPrice(); };
});
redrawPrice();

// ---- CÜZDAN BAĞLA (MetaMask / EVM)
const btnConnect = document.getElementById('btnConnect');
const walletInfo = document.getElementById('walletInfo');
let provider, signer, address;

async function connectWallet(){
  try{
    if(!window.ethereum){
      btnConnect.textContent = 'MetaMask Yükle';
      walletInfo.textContent = 'Cüzdan bulunamadı.';
      return;
    }
    provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts',[]);
    signer = await provider.getSigner();
    address = await signer.getAddress();
    const short = address.slice(0,6)+'...'+address.slice(-4);
    btnConnect.textContent = short+' ✓';
    walletInfo.textContent = 'Bağlı';
    walletInfo.onclick = () => navigator.clipboard.writeText(address);
  }catch(e){
    console.warn('wallet error', e);
    walletInfo.textContent = 'Bağlantı reddedildi';
  }
}
btnConnect.onclick = connectWallet;

// ---- SATIN AL (DEMO: yalnızca bilgilendirme)
document.getElementById('btnBuy').onclick = ()=>{
  alert('USDT (BEP20) ile satın alma için akıllı sözleşme entegrasyonu bir sonraki aşamada aktif edilecek.\nŞimdilik receiver adresine transfer (memo: ZUZU presale) ile ilerleyebilirsiniz:\n\n'+RECEIVER);
};

// ---- TOKENOMİ GRAFİĞİ
(function drawTokenomics(){
  const ctx = document.getElementById('tokenChart');
  if(!ctx) return;
  new Chart(ctx,{
    type:'doughnut',
    data:{
      labels:['Presale 45%','Liquidity 25%','Marketing 15%','Team 10%','Airdrop 5%'],
      datasets:[{
        data:[45,25,15,10,5],
        backgroundColor:['#00ffc3','#18a0fb','#ffb24d','#ff657a','#7e8cff'],
        borderColor:'rgba(255,255,255,.06)',
        borderWidth:2,
        hoverOffset:8
      }]
    },
    options:{
      plugins:{legend:{display:false}},
      cutout:'58%'
    }
  });
})();

/* ==========================
   MASKOT GALERİ – LOTTIE
   ========================== */

/* Basit ama hoş duran 10 Lottie JSON’u (minimal vektör) ve fallback SVG’ler */
const FallbackSVG = {
  logo:     `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><rect width='512' height='512' rx='24' fill='#07121a'/><circle cx='256' cy='256' r='210' fill='#0a1420'/><g fill='#00ffd0'><rect x='168' y='190' width='36' height='50' rx='10'/><rect x='308' y='190' width='36' height='50' rx='10'/></g><rect x='176' y='300' width='160' height='26' rx='13' fill='#ff7a1a'/></svg>`,
  hero:     `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><rect width='512' height='512' rx='24' fill='#08131f'/><rect x='96' y='120' width='320' height='280' rx='24' fill='#0e2233' stroke='#00ffd0' stroke-width='4'/><rect x='146' y='200' width='220' height='40' rx='12' fill='#00ffd0'/><circle cx='256' cy='300' r='24' fill='#00ffd0'/></svg>`,
  hacker:   `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><rect width='512' height='512' rx='24' fill='#07111a'/><rect x='90' y='120' width='332' height='272' rx='24' fill='#0d1e2c'/><rect x='120' y='248' width='272' height='12' rx='6' fill='#00ffd0'/></svg>`,
  warrior:  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><rect width='512' height='512' rx='24' fill='#081420'/><rect x='240' y='160' width='20' height='200' fill='#ff9a55'/><rect x='220' y='160' width='60' height='20' fill='#ff9a55'/></svg>`,
  sorceress:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><rect width='512' height='512' rx='24' fill='#07121a'/><circle cx='256' cy='280' r='60' fill='#00ffd0'/></svg>`,
  ranger:   `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><rect width='512' height='512' rx='24' fill='#06121a'/><rect x='136' y='220' width='240' height='40' rx='14' fill='#00ffd0'/></svg>`,
  berserker:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><rect width='512' height='512' rx='24' fill='#081420'/><circle cx='256' cy='256' r='180' fill='#28171b'/><circle cx='256' cy='256' r='150' fill='#ff6677'/></svg>`,
  scientist:`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><rect width='512' height='512' rx='24' fill='#081420'/><rect x='120' y='180' width='272' height='10' fill='#00ffd0'/><rect x='120' y='220' width='272' height='10' fill='#00ffd0'/><rect x='120' y='260' width='272' height='10' fill='#00ffd0'/></svg>`,
  rogue:    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><rect width='512' height='512' rx='24' fill='#07121a'/><rect x='176' y='300' width='160' height='26' rx='13' fill='#cfe3ff'/></svg>`,
  titan:    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><rect width='512' height='512' rx='24' fill='#06121a'/><circle cx='256' cy='256' r='140' fill='#0d1e2c' stroke='#00ffd0' stroke-width='8'/></svg>`
};

// Lottie helper: dönen glow/çizgi animasyonları — cep JSON’lar
function glowCircleJSON(color=[0,1,0.82,1]){
  return {
    v:"5.7.4",fr:30,ip:0,op:120,w:512,h:512,nm:"glow",ddd:0,assets:[],
    layers:[{ty:4,nm:"g",ks:{o:{a:0,k:100},p:{a:0,k:[256,256,0]},a:{a:0,k:[0,0,0]},s:{a:0,k:[100,100,100]}},
      shapes:[
        {ty:"el",p:{a:0,k:[0,0]},s:{a:0,k:[420,420]},fl:{c:{a:0,k:[0.04,0.07,0.12,1]}}},
        {ty:"el",p:{a:0,k:[0,0]},s:{a:1,k:[{t:0,s:[420,420]},{t:60,s:[460,460]},{t:120,s:[420,420]}]},
         st:{o:{a:0,k:0}},fl:{c:{a:0,k:color}}}
      ]
    }]
  };
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

(function buildGallery(){
  const root = document.getElementById('zgal');
  root.innerHTML = ITEMS.map(it => `
    <article class="zcard">
      <div class="zanim" data-key="${it.key}">
        <img alt="${it.name}" src="data:image/svg+xml;utf8,${encodeURIComponent(FallbackSVG[it.key])}">
      </div>
      <div class="zinfo"><div class="zname">${it.name}</div><div class="zdesc">${it.desc}</div></div>
      <button class="zbtn" data-show="${it.key}" aria-label="${it.name}"></button>
    </article>
  `).join('');

  document.querySelectorAll('.zanim').forEach(holder=>{
    const k = holder.dataset.key;
    try{
      const anim = lottie.loadAnimation({
        container: holder, renderer:'svg', loop:true, autoplay:true, animationData: LOTTIES[k]
      });
      // fallback img gizle
      const img = holder.querySelector('img'); if (img) img.style.display = 'none';
    }catch(e){ console.warn('lottie fail', k, e); }
  });
})();

// ---- Lightbox: büyük animasyon
(function lightbox(){
  const box = document.getElementById('zbox');
  const nameEl = document.getElementById('zboxName');
  const descEl = document.getElementById('zboxDesc');
  const animEl = document.getElementById('zboxAnim');
  let current;

  const open = (key)=>{
    nameEl.textContent = ITEMS.find(i=>i.key===key).name;
    descEl.textContent = ITEMS.find(i=>i.key===key).desc;
    animEl.innerHTML = '';
    current = lottie.loadAnimation({container: animEl, renderer:'svg', loop:true, autoplay:true, animationData: LOTTIES[key]});
    box.classList.add('active');
  };
  const close = ()=>{
    box.classList.remove('active');
    if(current){ try{ current.destroy(); }catch(_){} current=null; }
  };

  document.addEventListener('click', e=>{
    const btn = e.target.closest('[data-show]'); if(btn){ open(btn.dataset.show); }
    if(e.target.hasAttribute('data-close')) close();
  });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') close(); });
})();
