// ---------- Config yükle ----------
let CFG = {receiver:"", bscscanKey:"", usdtContract:"", goalUSD:300000};
fetch('./config.json?v=9').then(r=>r.json()).then(cfg=>{
  CFG = cfg;
  document.getElementById('rcv').value = CFG.receiver || '';
  initAll();
}).catch(_=>{
  // config yoksa da çalışsın
  document.getElementById('rcv').value = '';
  initAll();
});

// ---------- Lottie CDN'ini script.js içinden yükle ----------
function ensureLottie(){
  return new Promise((res)=>{
    if(window.lottie){return res(window.lottie);}
    const s=document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js';
    s.crossOrigin='anonymous';
    s.onload=()=>res(window.lottie);
    document.head.appendChild(s);
  });
}

// ---------- Yardımcılar ----------
const $ = sel => document.querySelector(sel);
function fmt(n, d=6){ return Number(n||0).toFixed(d); }
function price(){
  const val = $('#stageSel').value;
  if(val.includes('0.002000')) return 0.002;
  if(val.includes('0.002500')) return 0.0025;
  return 0.003;
}
function updateTotal(){
  $('#priceLbl').textContent = price().toFixed(6);
  $('#totalLbl').textContent  = fmt(price() * Number($('#amountInp').value||0));
}

// ---------- QR sahte render ----------
function renderQR(){
  const el = $('#qr');
  const c = document.createElement('canvas'); c.width=100; c.height=100;
  el.innerHTML=''; el.appendChild(c);
  const ctx=c.getContext('2d'); ctx.fillStyle='#0c1f27'; ctx.fillRect(0,0,100,100);
  for(let i=0;i<460;i++){ ctx.fillStyle=Math.random()>.5?'#00e6ff':'#29f08f'; ctx.fillRect(Math.random()*100,Math.random()*100,3,3); }
}

// ---------- Tap-to-earn demo ----------
let tapScore=0, mult=1.0;
function bindTap(){
  $('#tapBtn').addEventListener('click', ()=>{
    tapScore += 1*mult;
    $('#tapStat').textContent = `Puan: ${tapScore} • Çarpan: ${mult.toFixed(1)}x`;
  });
}

// ---------- Staking demo ----------
function bindStake(){
  const upd=()=>{
    const apy = 12; $('#apy').textContent = 'Tahmini APY: %'+apy;
    const amt = Number($('#stkAmt').value||0);
    const days = $('#stkDur').selectedIndex===0?30:($('#stkDur').selectedIndex===1?60:90);
    const gain = amt*(apy/100)*(days/365);
    $('#earn').textContent = 'Beklenen kazanç: '+gain.toFixed(2)+' ZUZU';
  };
  $('#stkAmt').addEventListener('input', upd);
  $('#stkDur').addEventListener('change', upd);
  upd();
}

// ---------- Preset değerler ----------
function bindPresets(){
  document.querySelectorAll('.js-preset').forEach(el=>{
    el.addEventListener('click', ()=>{
      $('#amountInp').value = el.dataset.v;
      updateTotal();
    });
  });
  $('#amountInp').addEventListener('input', updateTotal);
  $('#stageSel').addEventListener('change', updateTotal);
  updateTotal();
}

// ---------- Receiver kopyala ----------
function bindCopy(){ $('#copyBtn').addEventListener('click',()=>navigator.clipboard.writeText($('#rcv').value)); }

// ---------- BscScan toplam (yaklaşık) ----------
async function updateRaised(){
  try{
    if(!CFG.bscscanKey || !CFG.receiver){ throw new Error('no-key-or-addr'); }
    // USDT (BEP20) transferlerini çek
    const url = `https://api.bscscan.com/api?module=account&action=tokentx&address=${CFG.receiver}&contractaddress=${CFG.usdtContract}&page=1&offset=50&sort=desc&apikey=${CFG.bscscanKey}`;
    const r = await fetch(url);
    const j = await r.json();
    if(j.status!=='1'){ throw new Error('api'); }
    let total = 0;
    for(const tx of j.result){
      // to = receiver ise gelen para
      if((tx.to||'').toLowerCase() === CFG.receiver.toLowerCase()){
        total += Number(tx.value)/1e18; // USDT decimals 18
      }
    }
    const goal = CFG.goalUSD||300000;
    $('#raised').textContent = `$${Math.floor(total).toLocaleString()} / $${goal.toLocaleString()}`;
  }catch(e){
    $('#raised').textContent = `$0 / $${(CFG.goalUSD||300000).toLocaleString()}`;
  }
}

// ---------- Lottie Galeri ----------
const CARDS=[
  {id:'char-logo',      name:'ZUZU Logo',      desc:'Temel maskot – glow',          file:'zuzu_logo.json'},
  {id:'char-hero',      name:'ZUZU Hero',      desc:'Neon zırh + hatlar',           file:'zuzu_hero.json'},
  {id:'char-hacker',    name:'ZUZU Hacker',    desc:'Yüz tarama + sinyal',          file:'zuzu_hacker.json'},
  {id:'char-warrior',   name:'ZUZU Warrior',   desc:'Kılıç parlaması',              file:'zuzu_warrior.json'},
  {id:'char-sorceress', name:'ZUZU Sorceress', desc:'Büyü küresi',                  file:'zuzu_sorceress.json'},
  {id:'char-ranger',    name:'ZUZU Ranger',    desc:'Vizör + kayış',                file:'zuzu_ranger.json'},
  {id:'char-berserker', name:'ZUZU Berserker', desc:'Kızgın aura',                  file:'zuzu_berserker.json'},
  {id:'char-scientist', name:'ZUZU Scientist', desc:'Devre hatları',                file:'zuzu_scientist.json'},
  {id:'char-rogue',     name:'ZUZU Rogue',     desc:'Gizli bıçak',                  file:'zuzu_rogue.json'},
  {id:'char-titan',     name:'ZUZU Titan',     desc:'Kalkan – pulse',               file:'zuzu_titan.json'},
];

function svgFallback(){
  return `
  <svg viewBox="0 0 120 120">
    <defs><radialGradient id="g" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#00e6ff" stop-opacity=".15"/><stop offset="100%" stop-color="#00e6ff" stop-opacity="0"/></radialGradient></defs>
    <circle cx="60" cy="60" r="54" fill="#0b1118" stroke="#1f3042"/>
    <circle cx="60" cy="60" r="54" fill="url(#g)"/>
    <circle cx="44" cy="52" r="7" fill="#9ff8ff"></circle>
    <circle cx="76" cy="52" r="7" fill="#9ff8ff"></circle>
    <path d="M40 78 Q60 92 80 78" fill="none" stroke="#ff8c2a" stroke-width="8" stroke-linecap="round"/>
  </svg>`;
}

function buildGallery(){
  const g = $('#gallery'); g.innerHTML='';
  CARDS.forEach(card=>{
    const el = document.createElement('div'); el.className='card';
    el.innerHTML = `
      <div class="charbox" id="${card.id}">
        ${svgFallback()}
      </div>
      <div>
        <div class="charname">${card.name}</div>
        <div class="small">${card.desc}</div>
      </div>`;
    g.appendChild(el);
  });
}

async function mountLottie(){
  await ensureLottie();
  const io = ('IntersectionObserver' in window) ? new IntersectionObserver((ents)=>{
    ents.forEach(e=>{ const a=e.target._anim; if(!a) return; e.isIntersecting?a.play():a.pause(); });
  },{threshold:.25}) : null;

  for(const card of CARDS){
    const holder = document.getElementById(card.id);
    if(!holder) continue;
    try{
      const url = `./assets/zuzu/lottie/${card.file}?v=9`;
      const data = await fetch(url).then(r=>r.json());
      const svg = holder.querySelector('svg'); if(svg) svg.style.display='none';
      const box = document.createElement('div'); box.className='lottie-holder'; holder.appendChild(box);
      const anim = lottie.loadAnimation({container:box, renderer:'svg', loop:true, autoplay:true, animationData:data});
      holder._anim = anim; if(io) io.observe(holder);
    }catch(e){
      // fallback olarak svg kalsın
    }
  }
}

// ---------- INIT ----------
function initAll(){
  buildGallery();
  bindTap();
  bindStake();
  bindPresets();
  bindCopy();
  renderQR();
  updateTotal();
  updateRaised().catch(()=>{});
  mountLottie(); // lottie json'ları yükle
}
// ========== WALLET + USDT TRANSFER (BSC) ==========
async function loadEthers() {
  if (window.ethers) return window.ethers;
  await new Promise((res) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/ethers@6.13.2/dist/ethers.umd.min.js';
    s.onload = res; document.head.appendChild(s);
  });
  return window.ethers;
}

let provider, signer, userAddr;

async function connectWallet() {
  const ethers = await loadEthers();
  if (!window.ethereum) { alert('MetaMask / Wallet eklentisi bulunamadı.'); return; }

  provider = new ethers.BrowserProvider(window.ethereum);
  const chain = await provider.getNetwork();

  // BSC mainnet: chainId 56 — otomatik switch
  if (Number(chain.chainId) !== 56) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x38' }], // 56
      });
    } catch (e) {
      // Ağ ekleme
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x38',
          chainName: 'BNB Smart Chain',
          nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
          rpcUrls: ['https://bsc-dataseed.binance.org/'],
          blockExplorerUrls: ['https://bscscan.com']
        }]
      });
    }
  }

  signer = await provider.getSigner();
  userAddr = await signer.getAddress();
  document.getElementById('connectBtn').textContent =
    userAddr.slice(0,6)+'...'+userAddr.slice(-4);
}

// Minimal ERC20 ABI: transfer(address,uint256) only
const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 value) returns (bool)"
];

async function buyWithUSDT() {
  try {
    const ethers = await loadEthers();
    if (!signer) { await connectWallet(); if (!signer) return; }

    const usdtAddr = CFG.usdtContract;
    const receiver = CFG.receiver;
    if (!usdtAddr || !receiver) { alert('USDT sözleşme / receiver adresi eksik.'); return; }

    // Kaç ZUZU alınacak -> kaç USDT ödenecek
    const zuzu = Number(document.getElementById('amountInp').value || 0);
    const usdtPerZuzu = price(); // 0.002 vs
    const usdtAmount = zuzu * usdtPerZuzu;

    if (!usdtAmount || usdtAmount <= 0) { alert('Geçerli bir miktar gir.'); return; }

    const usdt = new ethers.Contract(usdtAddr, ERC20_ABI, signer);
    const decimals = await usdt.decimals(); // 18
    const value = ethers.parseUnits(usdtAmount.toString(), decimals);

    // Bakiyeyi kontrol et (kibar uyarı)
    const bal = await usdt.balanceOf(userAddr);
    if (bal < value) {
      alert('USDT bakiyesi yetersiz.');
      return;
    }

    const tx = await usdt.transfer(receiver, value);
    document.getElementById('buyUsdtBtn').textContent = 'Gönderiliyor...';
    await tx.wait();

    document.getElementById('buyUsdtBtn').textContent = 'USDT (BEP20) ile Satın Al';
    alert('Satın alma tamam! Tx: ' + tx.hash);
    updateRaised().catch(()=>{});
  } catch (err) {
    console.error(err);
    document.getElementById('buyUsdtBtn').textContent = 'USDT (BEP20) ile Satın Al';
    alert('İşlem iptal/başarısız.');
  }
}

// Buton bağla
document.addEventListener('DOMContentLoaded', ()=>{
  const c = document.getElementById('connectBtn');
  const b = document.getElementById('buyUsdtBtn');
  if (c) c.addEventListener('click', connectWallet);
  if (b) b.addEventListener('click', buyWithUSDT);
});
