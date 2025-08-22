/* =========================================================
   ZUZU – Tek Parça Script
   - Lottie animasyonları (otomatik yükleme + fallback)
   - Maskot Galerisi oluşturma
   - Cüzdan bağlama (ethers otomat yükleme)
   - Borsa logoları (simple-icons ile)
   ========================================================= */

const CFG = {
  receiver: "0x69014a76eE25c8B73dAe9044dfcAd7356fe74bC3",
  usdt: "0x55d398326f99059fF775485246999027B3197955",   // BSC USDT
  hardCap: 300000,
  base: "assets/zuzu",
  lotties: [
    { key: "logo",      title: "ZUZU Logo",      hint: "Temel maskot – glow" },
    { key: "hero",      title: "ZUZU Hero",      hint: "Neon zırh + hatlar" },
    { key: "hacker",    title: "ZUZU Hacker",    hint: "Yüz tarama + sinyal" },
    { key: "warrior",   title: "ZUZU Warrior",   hint: "Kılıç parlaması" },
    { key: "sorceress", title: "ZUZU Sorceress", hint: "Büyü küresi" },
    { key: "ranger",    title: "ZUZU Ranger",    hint: "Vizör + kayış" },
    { key: "berserker", title: "ZUZU Berserker", hint: "Kızgın aura" },
    { key: "scientist", title: "ZUZU Scientist", hint: "Devre hatları" },
    { key: "rogue",     title: "ZUZU Rogue",     hint: "Gizli bıçak" },
    { key: "titan",     title: "ZUZU Titan",     hint: "Kalkan + pulse" },
  ],
  // simple-icons slugs
  exchanges: [
    { name: "MEXC",   slug: "mexc" },
    { name: "Gate.io",slug: "gateio" },
    { name: "BitMart",slug: "bitmart" },
    { name: "BingX",  slug: "bingx" },
    { name: "Bybit",  slug: "bybit" },
    { name: "KuCoin", slug: "kucoin" },
    { name: "OKX",    slug: "okx" },
  ]
};

// ---------- mini helper ----------
const $ = q => document.querySelector(q);
const $$ = q => Array.from(document.querySelectorAll(q));
const fmt = n => Number(n).toLocaleString('en-US', { maximumFractionDigits: 6 });
const price = () => 0.002;

// ---------- dynamic loaders ----------
function loadScript(src){
  return new Promise((res, rej)=>{
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
}
async function ensureLottie(){
  if (window.lottie) return;
  await loadScript("https://cdn.jsdelivr.net/npm/lottie-web@5.12.2/build/player/lottie.min.js");
}
async function ensureEthers(){
  if (window.ethers) return;
  await loadScript("https://cdn.jsdelivr.net/npm/ethers@6.13.2/dist/ethers.umd.min.js");
}

// ---------- REF + TIMER ----------
function initRef(){
  const url = new URL(location.href);
  const ref = url.searchParams.get('ref') || localStorage.getItem('zref') || 'share-this-link';
  localStorage.setItem('zref', ref);
  const a = document.createElement('a');
  a.href = `${location.origin}${location.pathname}?ref=${ref}`;
  a.textContent = a.href;
  const refBox = $('#refLink');
  if (refBox && !refBox.querySelector('a')) refBox.appendChild(a);
}
function initTimer(){
  const end = Date.now() + 39*24*3600*1000;
  const ids = {d:'#d',h:'#h',m:'#m',s:'#s'};
  const el = {}; for(const k in ids){ el[k] = $(ids[k]); }
  function tick(){
    let diff = Math.max(0, end - Date.now());
    let d = Math.floor(diff/864e5); diff-=d*864e5;
    let h = Math.floor(diff/36e5);  diff-=h*36e5;
    let m = Math.floor(diff/6e4);   diff-=m*6e4;
    let s = Math.floor(diff/1e3);
    if(el.d){ el.d.textContent = d; el.h.textContent=h; el.m.textContent=m; el.s.textContent=s; }
  }
  tick(); setInterval(tick, 1000);
}

// ---------- PRESALE UI ----------
function initPresale(){
  const amount = $('#amountInp');
  const pLabel = $('#priceTag');
  const tLabel = $('#totalTag');

  function recalc(){
    const p = price();
    const q = Number(amount?.value||0);
    if (pLabel) pLabel.textContent = fmt(p);
    if (tLabel) tLabel.textContent = fmt(p*q);
  }
  if (amount){
    amount.addEventListener('input', recalc);
    $$('.chip').forEach(c=>c.addEventListener('click',()=>{
      amount.value = c.dataset.q; recalc();
    }));
    recalc();
  }
  const recv = $('#receiverInp'); if (recv) recv.value = CFG.receiver;
  const copy = $('#copyRc'); if (copy) copy.onclick = ()=>navigator.clipboard.writeText(CFG.receiver);
}

// ---------- GALLERY ----------
async function buildGallery(){
  const box = $('#gallery');
  if (!box) return;
  await ensureLottie();

  // eski html'i temizle ve kendimiz oluştur
  box.innerHTML = '';
  CFG.lotties.forEach((m,i)=>{
    const card = document.createElement('div');
    card.className = 'animCard';

    const thumb = document.createElement('div');
    thumb.className = 'animThumb';
    thumb.id = `anim-${i}`;
    // görünmeme sorununu engelle: sabit boy ver
    thumb.style.width = '88px';
    thumb.style.height = '88px';
    thumb.style.borderRadius = '14px';
    thumb.style.background = 'rgba(255,255,255,0.02)';
    thumb.style.display = 'flex';
    thumb.style.alignItems = 'center';
    thumb.style.justifyContent = 'center';

    const info = document.createElement('div');
    info.className = 'animInfo';
    info.innerHTML = `<b>${m.title}</b><small>${m.hint}</small>`;

    card.append(thumb, info);
    box.appendChild(card);

    // Önce JSON dene, olmazsa SVG’ye düş
    const json = `${CFG.base}/lottie/zuzu_${m.key}.json`;
    const svg  = `${CFG.base}/svg/zuzu_${m.key}.svg`;

    fetch(json, {method:'HEAD'})
      .then(r=>{
        if(r.ok){
          lottie.loadAnimation({container: thumb, renderer:'svg', loop:true, autoplay:true, path: json});
        }else{
          const img = new Image();
          img.src = svg; img.style.width='64px'; img.style.height='64px';
          thumb.appendChild(img);
        }
      })
      .catch(_=>{
        const img = new Image();
        img.src = svg; img.style.width='64px'; img.style.height='64px';
        thumb.appendChild(img);
      });
  });
}

// ---------- EXCHANGE LOGOS ----------
async function buildExchanges(){
  const row = $('#exchanges');
  if (!row) return;
  row.innerHTML = '';
  for(const ex of CFG.exchanges){
    const badge = document.createElement('div');
    badge.className = 'ex-badge';

    const img = new Image();
    const url = `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${ex.slug}.svg`;
    // SVG'yi <img> içine almak için data URL'a çevir
    try{
      const svgText = await fetch(url).then(r=> r.ok ? r.text() : null);
      if (svgText){
        const blob = new Blob([svgText], {type:'image/svg+xml'});
        img.src = URL.createObjectURL(blob);
      }else{
        img.style.display='none';
        badge.textContent = ex.name;
      }
    }catch(e){
      img.style.display='none';
      badge.textContent = ex.name;
    }
    img.alt = ex.name;
    img.style.width='18px';
    img.style.height='18px';
    img.style.marginRight='6px';

    const label = document.createElement('span');
    label.textContent = ex.name;

    badge.append(img,label);
    row.appendChild(badge);
  }
}

// ---------- WALLET ----------
let provider, signer, user;
async function connectWallet(){
  await ensureEthers();
  if (!window.ethereum){ alert('Cüzdan bulunamadı (MetaMask/OKX vb).'); return; }
  const ethers = window.ethers;
  provider = new ethers.BrowserProvider(window.ethereum);
  signer   = await provider.getSigner();
  user     = await signer.getAddress();
  const btn = $('#connectBtn') || $('#connectWallet');
  if (btn) btn.textContent = user.slice(0,6)+'...'+user.slice(-4);
}

const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 value) returns (bool)"
];

async function buyWithUSDT(){
  try{
    await ensureEthers();
    const ethers = window.ethers;
    if (!signer) await connectWallet();
    if (!signer) return;

    const q = Number($('#amountInp')?.value||0);
    const total = q * price();
    if (!total || total<=0) { alert('Geçersiz miktar.'); return; }

    const usdt = new ethers.Contract(CFG.usdt, ERC20_ABI, signer);
    const dec  = await usdt.decimals();
    const val  = ethers.parseUnits(total.toString(), dec);
    const bal  = await usdt.balanceOf(user);
    if (bal < val){ alert('USDT bakiyesi yetersiz.'); return; }

    const btn = $('#buyUsdtBtn'); if (btn) btn.textContent = 'Gönderiliyor...';
    const tx  = await usdt.transfer(CFG.receiver, val);
    await tx.wait();
    if (btn) btn.textContent = 'USDT (BEP20) ile Satın Al';
    alert('Başarılı: ' + tx.hash);
  }catch(e){
    console.error(e);
    const btn = $('#buyUsdtBtn'); if (btn) btn.textContent = 'USDT (BEP20) ile Satın Al';
    alert('İşlem başarısız/iptal.');
  }
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', async ()=>{
  initRef();
  initTimer();
  initPresale();
  await buildExchanges();
  await buildGallery();

  // buton bağla (iki id'den biri olabilir)
  const cbtn = $('#connectBtn') || $('#connectWallet');
  if (cbtn) cbtn.addEventListener('click', connectWallet);
  const bbtn = $('#buyUsdtBtn'); if (bbtn) bbtn.addEventListener('click', buyWithUSDT);
});
