/* ZUZU V9 – Presale + Anime Lottie Loader
   - config.json'dan adres/stage bilgilerini çeker
   - Lottie animasyonlarını assets/zuzu/lottie/*.json'dan otomatik yükler
   - Tap-to-Earn, Staking demo, referans link, countdown, QR kodu
*/

const $ = (q, p=document) => p.querySelector(q);
const $$ = (q, p=document) => [...p.querySelectorAll(q)];

const state = {
  unitPrices: [0.002000, 0.003000, 0.004000, 0.005000],
  receiver: "",
  raised: 0,
  hardcap: 300000,
  refMul: 1.0
};

async function loadConfig(){
  try{
    const r = await fetch('config.json?_=' + Date.now());
    const cfg = await r.json();
    state.receiver = cfg.receiver || "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3";
    state.raised = cfg.raised || 0;
    if(cfg.unitPrices && cfg.unitPrices.length) state.unitPrices = cfg.unitPrices;
  }catch(e){
    // fallback
    state.receiver = "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3";
  }
}

function formatUSD(x){ return Number(x).toLocaleString('en-US', {minimumFractionDigits:6, maximumFractionDigits:6}); }
function formatMoney(x){ return Number(x).toLocaleString('en-US', {maximumFractionDigits:2}); }

function updatePrices(){
  const stageIdx = +$('#stage').value;
  const qty = Math.max(1, +$('#qty').value || 0);
  const unit = state.unitPrices[stageIdx] || state.unitPrices[0];

  $('#unitPrice').textContent = unit.toFixed(6);
  $('#totalPrice').textContent = formatUSD(qty * unit);
}

function bindChips(){
  $$('.chip').forEach(ch => ch.addEventListener('click', () => {
    $('#qty').value = ch.dataset.q;
    updatePrices();
  }));
}

function initRef(){
  const url = new URL(location.href);
  const myRef = location.origin + location.pathname + '?ref=share-this-link';
  $('#refLink').value = myRef;

  // gelen ref varsa çarpan
  const hasRef = url.searchParams.get('ref');
  state.refMul = hasRef ? 1.2 : 1.0;
  $('#tapMul').textContent = state.refMul.toFixed(1) + 'x';

  $('#copyRef').onclick = () => {
    navigator.clipboard.writeText($('#refLink').value);
    $('#copyRef').textContent = 'Kopyalandı';
    setTimeout(()=>$('#copyRef').textContent='Kopyala', 1200);
  };
}

function initQR(){
  $('#receiver').value = state.receiver;
  $('#copyAddr').onclick = () => {
    navigator.clipboard.writeText(state.receiver);
    $('#copyAddr').textContent = 'Kopyalandı';
    setTimeout(()=>$('#copyAddr').textContent='Kopyala', 1200);
  };
  const box = $('#qrcode');
  box.innerHTML = '';
  new QRCode(box, {
    text: state.receiver,
    width: 150, height: 150,
    colorDark : "#00e5ff",
    colorLight : "#0c1424",
    correctLevel : QRCode.CorrectLevel.H
  });

  const pct = Math.min(100, (state.raised/state.hardcap)*100);
  $('#raisedBar').style.width = pct + '%';
  $('#raisedText').textContent = `$${formatMoney(state.raised)} / $${formatMoney(state.hardcap)}`;
}

function initLotties(){
  // Tüm .lottie-box elemanlarını yükle
  $$('.lottie-box').forEach(el=>{
    const path = el.dataset.lottie;
    if(!path) return;
    lottie.loadAnimation({
      container: el,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path
    });
  });
}

function connectWallet(){
  const btn = $('#btnConnect');
  btn.onclick = async ()=>{
    if(!window.ethereum){
      alert('Cüzdan bulunamadı. MetaMask/TrustWallet kurun.');
      return;
    }
    try{
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const acc = accounts[0];
      btn.textContent = acc.slice(0,6)+'…'+acc.slice(-4);
    }catch(e){
      console.warn(e);
    }
  }
}

function initBuy(){
  // Kart butonu placeholder
  $('#btnBuyCard').onclick = ()=> alert('Kart ile satın alma yakında.');
  // USDT butonu placeholder
  $('#btnBuyUSDT').onclick = ()=> alert('Cüzdan bağlantısı sonrası USDT transfer: ' + state.receiver);
}

function initTap(){
  const key = 'zuzu.tap.score';
  let score = +(localStorage.getItem(key) || 0);
  $('#tapScore').textContent = score;

  $('#tapBtn').onclick = ()=>{
    // temel + çarpan
    score += Math.round(1 * state.refMul);
    $('#tapScore').textContent = score;
    localStorage.setItem(key, score);
    $('#tapBtn').classList.add('pulse');
    setTimeout(()=>$('#tapBtn').classList.remove('pulse'),180);
  };
}

function initStake(){
  const apyMap = { "30":12, "60":22, "90":36 };
  const calc = ()=>{
    const d = $('#stakeDays').value;
    const apy = apyMap[d] || 12;
    const amt = +$('#stakeAmount').value || 0;
    const gain = amt * (apy/100) * (d/365);
    $('#apy').textContent = apy + '%';
    $('#stakeEarn').textContent = gain.toFixed(2);
  };
  $('#stakeDays').onchange = calc;
  $('#stakeAmount').oninput = calc;
  calc();
}

function initCountdown(){
  // basit 40 gün demo
  const end = Date.now() + 40*24*3600*1000;
  setInterval(()=>{
    const diff = end - Date.now();
    let s = Math.max(0, Math.floor(diff/1000));
    const d = Math.floor(s/86400); s-=d*86400;
    const h = Math.floor(s/3600); s-=h*3600;
    const m = Math.floor(s/60); s-=m*60;
    $('#cd-d').textContent = String(d).padStart(2,'0');
    $('#cd-h').textContent = String(h).padStart(2,'0');
    $('#cd-m').textContent = String(m).padStart(2,'0');
    $('#cd-s').textContent = String(s).padStart(2,'0');
  },1000);
}

async function main(){
  await loadConfig();
  bindChips();
  initRef();
  initQR();
  initLotties();
  connectWallet();
  initBuy();
  initTap();
  initStake();
  initCountdown();

  // olay bağla
  $('#stage').onchange = updatePrices;
  $('#qty').oninput = updatePrices;
  updatePrices();
}

document.addEventListener('DOMContentLoaded', main);
