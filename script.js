/* -------- TON UI -------- */
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const tonUi = new TON_CONNECT_UI.TonConnectUI({
      manifestUrl: location.origin + '/tonconnect-manifest.json',
      buttonRootId: 'ton-connect'
    });
    window.__tonUi = tonUi;
  } catch (e) {
    console.warn('TON UI yüklenemedi:', e);
  }
});

/* -------- EVM & SOL Connect -------- */
async function connectEVM(){
  if(!window.ethereum){ alert('MetaMask bulunamadı.'); window.open('https://metamask.io/download/','_blank'); return; }
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();
  alert('EVM bağlı: ' + await signer.getAddress());
}
async function connectSol(){
  const p = window.solana;
  if(!p || !p.isPhantom){ alert('Phantom bulunamadı.'); window.open('https://phantom.app/','_blank'); return; }
  const r = await p.connect(); alert('Solana bağlı: ' + r.publicKey.toString());
}
document.getElementById('btn-evm')?.addEventListener('click', connectEVM);
document.getElementById('btn-sol')?.addEventListener('click', connectSol);

/* -------- Buy buttons (placeholder) -------- */
document.querySelectorAll('.buy').forEach(b=>{
  b.addEventListener('click',()=>{
    const ch=b.dataset.chain, price=b.dataset.price, C=window.ZUZU_CFG;
    if(ch==='evm') alert(`EVM alım adresi:\n${C.evmUSDTReceiver}\n(USDT transfer/kontrat entegrasyonu sonra)`);
    if(ch==='sol') alert(`Solana alım adresi:\n${C.solReceiver}`);
    if(ch==='ton'){ const url=`https://app.tonkeeper.com/transfer/${C.tonReceiver}`; window.open(url,'_blank'); }
  });
});

/* -------- Slot-Machine Countdown (stabil) -------- */
const DIGITS = ['0','1','2','3','4','5','6','7','8','9'];
function buildReel(el){
  // 0..9 iki kez → wrap sırasında takılma olmaz
  el.innerHTML = [...DIGITS, ...DIGITS].map(d=>`<div class="d">${d}</div>`).join('');
}
function setDigit(el, n){
  // Hedef: ikinci döngüdeki n (index = 10 + n)
  const idx = 10 + Number(n);
  const h = 50; // .slot yüksekliği
  requestAnimationFrame(()=>{ el.style.transform = `translateY(-${idx*h}px)`; });
}
function two(n){ return String(n).padStart(2,'0'); }

function updateCountdown(){
  const end = window.ZUZU_CFG?.presaleEnd || new Date(Date.now()+7*864e5);
  let diff = Math.max(0, end - new Date());

  const s = Math.floor(diff/1000)%60;
  const m = Math.floor(diff/60000)%60;
  const h = Math.floor(diff/3600000)%24;
  const d = Math.floor(diff/86400000);

  const map = {
    days: two(Math.min(99,d)),
    hours: two(h),
    minutes: two(m),
    seconds: two(s)
  };

  Object.entries(map).forEach(([type, digits])=>{
    const group = document.querySelector(`.slots[data-type="${type}"]`);
    if(!group) return;
    const [d1,d2] = digits.split('');
    const reels = group.querySelectorAll('.reel');
    setDigit(reels[0], d1);
    setDigit(reels[1], d2);
  });
}

function initReels(){
  document.querySelectorAll('.reel').forEach(buildReel);
  updateCountdown();
  setInterval(updateCountdown, 1000);
}
window.addEventListener('DOMContentLoaded', initReels);
