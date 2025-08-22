// =========================
// CONFIG
// =========================
const CFG = {
  receiver: "0x69014a76eE25c8B73dAe9044dfcAd7356fe74bC3",
  usdtContract: "0x55d398326f99059fF775485246999027B3197955",
  hardCap: 300000,
  lotties: {
    logo:       "assets/zuzu/lottie/zuzu_logo.json",
    hero:       "assets/zuzu/lottie/zuzu_hero.json",
    hacker:     "assets/zuzu/lottie/zuzu_hacker.json",
    warrior:    "assets/zuzu/lottie/zuzu_warrior.json",
    sorceress:  "assets/zuzu/lottie/zuzu_sorceress.json",
    ranger:     "assets/zuzu/lottie/zuzu_ranger.json",
    berserker:  "assets/zuzu/lottie/zuzu_berserker.json",
    scientist:  "assets/zuzu/lottie/zuzu_scientist.json",
    rogue:      "assets/zuzu/lottie/zuzu_rogue.json",
    titan:      "assets/zuzu/lottie/zuzu_titan.json"
  }
};

// =========================
// Helpers
// =========================
function $(q){return document.querySelector(q)}
function el(tag,cls){const n=document.createElement(tag); if(cls) n.className=cls; return n;}
function fmt(x){return Number(x).toLocaleString('en-US',{maximumFractionDigits:6})}
function price(){return 0.002;}

// =========================
// Ref Link & Timer
// =========================
function buildRef(){
  const url = new URL(window.location.href);
  let ref = url.searchParams.get('ref') || localStorage.getItem('zref') || 'share-this-link';
  localStorage.setItem('zref', ref);
  const a = document.createElement('a');
  a.href = `${location.origin}${location.pathname}?ref=${ref}`;
  a.textContent = a.href;
  $('#refLink').appendChild(a);
}

function timerInit(){
  const tEnd = Date.now() + 39*24*3600*1000;
  setInterval(()=>{
    let diff = Math.max(0, tEnd - Date.now());
    let d = Math.floor(diff/864e5); diff-=d*864e5;
    let h = Math.floor(diff/36e5);  diff-=h*36e5;
    let m = Math.floor(diff/6e4);   diff-=m*6e4;
    let s = Math.floor(diff/1e3);
    $('#d').textContent=d; $('#h').textContent=h; $('#m').textContent=m; $('#s').textContent=s;
  },1000);
}

// =========================
// Presale Calc
// =========================
function bindPresale(){
  const amountInp = $('#amountInp');
  const priceTag  = $('#priceTag');
  const totalTag  = $('#totalTag');
  const quick = document.querySelectorAll('.chip');

  function recalc(){
    const p = price();
    priceTag.textContent = fmt(p);
    const q = Number(amountInp.value||0);
    totalTag.textContent = fmt(q*p);
  }
  amountInp.addEventListener('input', recalc);
  quick.forEach(c=>c.addEventListener('click',()=>{
    amountInp.value = c.dataset.q; recalc();
  }));
  recalc();
}

// =========================
// Gallery
// =========================
const MASKS = [
  ['ZUZU Logo',      CFG.lotties.logo,      'Temel maskot – glow'],
  ['ZUZU Hero',      CFG.lotties.hero,      'Neon zırh + hatlar'],
  ['ZUZU Hacker',    CFG.lotties.hacker,    'Yüz tarama + sinyal'],
  ['ZUZU Warrior',   CFG.lotties.warrior,   'Kılıç parlaması'],
  ['ZUZU Sorceress', CFG.lotties.sorceress, 'Büyü küresi'],
  ['ZUZU Ranger',    CFG.lotties.ranger,    'Vizör + kayış'],
  ['ZUZU Berserker', CFG.lotties.berserker, 'Kızgın aura'],
  ['ZUZU Scientist', CFG.lotties.scientist, 'Devre hatları'],
  ['ZUZU Rogue',     CFG.lotties.rogue,     'Gizli bıçak'],
  ['ZUZU Titan',     CFG.lotties.titan,     'Kalkan + pulse'],
];

function buildGallery(){
  const wrap = $('#gallery');
  MASKS.forEach((m,i)=>{
    const card = el('div','animCard');
    const thumb = el('div','animThumb'); thumb.id = 'anim-'+i;
    const info = el('div','animInfo');
    info.innerHTML = `<b>${m[0]}</b><small>${m[2]}</small>`;
    card.append(thumb,info);
    wrap.appendChild(card);
    try{
      lottie.loadAnimation({container: thumb,renderer:'svg',loop:true,autoplay:true,path:m[1]});
    }catch(e){ console.warn('Lottie fail',m[0]); }
  });
}

// =========================
// Wallet / Ethers
// =========================
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
  if (!window.ethereum) { alert('MetaMask yok.'); return; }
  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
  userAddr = await signer.getAddress();
  $('#connectBtn').textContent = userAddr.slice(0,6)+'...'+userAddr.slice(-4);
}
const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 value) returns (bool)"
];
async function buyWithUSDT(){
  try{
    const ethers = await loadEthers();
    if (!signer) { await connectWallet(); if (!signer) return; }
    const zuzu = Number($('#amountInp').value||0);
    const usdtAmount = zuzu * price();
    if (!usdtAmount || usdtAmount<=0){ alert('Geçersiz miktar'); return; }
    const usdt = new ethers.Contract(CFG.usdtContract, ERC20_ABI, signer);
    const decimals = await usdt.decimals();
    const value = ethers.parseUnits(usdtAmount.toString(), decimals);
    const bal = await usdt.balanceOf(userAddr);
    if (bal < value){ alert('USDT yetersiz'); return; }
    $('#buyUsdtBtn').textContent = 'Gönderiliyor...';
    const tx = await usdt.transfer(CFG.receiver, value);
    await tx.wait();
    $('#buyUsdtBtn').textContent = 'USDT (BEP20) ile Satın Al';
    alert('Başarılı! Tx: '+tx.hash);
  }catch(e){
    console.error(e);
    $('#buyUsdtBtn').textContent = 'USDT (BEP20) ile Satın Al';
    alert('İşlem iptal/başarısız.');
  }
}

// =========================
// INIT
// =========================
document.addEventListener('DOMContentLoaded', ()=>{
  $('#receiverInp').value = CFG.receiver;
  buildRef(); timerInit(); bindPresale(); buildGallery();
  $('#copyRc').addEventListener('click',()=>{ navigator.clipboard.writeText(CFG.receiver); });
  $('#connectBtn').addEventListener('click', connectWallet);
  $('#buyUsdtBtn').addEventListener('click', buyWithUSDT);
});
