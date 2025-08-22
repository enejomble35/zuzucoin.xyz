// ===== Utils
const $ = q => document.querySelector(q);
const $$ = q => document.querySelectorAll(q);
function fmt(n){ return Number(n).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:6}); }

// ===== Presale kalkülasyon
const stage = $('#stage');
const amount = $('#amount');
const priceTxt = $('#priceTxt');
const totalTxt = $('#totalTxt');

function currentPrice(){
  const i = stage.selectedIndex;
  return [0.002,0.003,0.004,0.005][i];
}
function recalc(){
  const p = currentPrice();
  const a = Number(amount.value||0);
  priceTxt.textContent = `Fiyat: ${p.toFixed(6)} USDT / ZUZU`;
  totalTxt.textContent = `Toplam: ${fmt(a*p)} USDT`;
}
stage.onchange = recalc;
amount.oninput = recalc;
$$('.chips button').forEach(b=>b.onclick = ()=>{ amount.value = b.dataset.q; recalc(); });
recalc();

// ===== Copy & QR
$('#copyAddr').onclick = ()=>{
  navigator.clipboard.writeText($('#receiver').value);
  $('#copyAddr').textContent = 'Kopyalandı!';
  setTimeout(()=>$('#copyAddr').textContent='Kopyala',1500);
};
// Minimal QR (görüntü kalitesi amaçlı çok basit)
(function drawQR(){
  const c = $('#qr'), ctx = c.getContext('2d');
  ctx.fillStyle='#0e1b26'; ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle='#00cfe6';
  for(let y=0;y<18;y++){
    for(let x=0;x<18;x++){
      if(Math.random()>0.65) ctx.fillRect(5+x*10,5+y*10,8,8);
    }
  }
})();

// ===== Tap-to-earn (demo)
let score=0, mul=1.0;
$('#tapBtn').onclick = ()=>{ score += 1*mul; $('#score').textContent = fmt(score); };
$('#mul').textContent = mul.toFixed(1)+'x';

// ===== Staking (demo)
const apyMap = { '30 gün':12, '60 gün':22, '90 gün':36 };
function calcStake(){
  const days = $('#stakeDays').value; const apy = apyMap[days]||12;
  $('#apy').textContent = apy+'%';
  const amt = Number($('#stakeAmt').value||0);
  const earn = amt*(apy/100)*(30/365); // yaklaşık 1 ay
  $('#est').textContent = fmt(earn);
}
$('#stakeDays').onchange = calcStake;
$('#stakeAmt').oninput = calcStake;
calcStake();
$('#stakeDemo').onclick = ()=>alert('Stake (Demo): UI hazır. Akıllı kontrat entegre edildiğinde aktif olacak.');

// ===== Lottie Auto Loader (+ GIF/SVG fallback)
function initLotties(){
  $$('.lottie-slot').forEach(slot=>{
    const json = slot.dataset.json;
    if(json){
      fetch(json,{method:'HEAD'}).then(r=>{
        if(r.ok){
          slot.innerHTML=''; // fallback temizle
          lottie.loadAnimation({
            container: slot, renderer:'svg', loop:true, autoplay:true, path: json
          });
        }
      }).catch(()=>{ /* svg/gif fallback zaten içeride */ });
    }
  });
}
document.addEventListener('DOMContentLoaded', initLotties);

// ===== Wallet bağlama (stub)
$('#connectBtn').onclick = ()=>alert('Cüzdan bağlama modülü v9’da (Web3Modal + WalletConnect) eklenecek.');

// ===== Buy (stub)
$('#buyUsdt').onclick = ()=>alert('USDT (BEP20) transferi için adres: '+$('#receiver').value);
