// ========== TonConnect UI ==========
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

// ========== EVM (MetaMask) Connect ==========
async function connectEVM() {
  if (!window.ethereum) {
    alert('MetaMask bulunamadı. Lütfen kurun.');
    window.open('https://metamask.io/download/','_blank');
    return;
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();
  const addr = await signer.getAddress();
  console.log('EVM cüzdan:', addr);
  alert('EVM bağlı: ' + addr);
}

// ========== Solana (Phantom) Connect ==========
async function connectSol() {
  const phantom = window.solana;
  if (!phantom || !phantom.isPhantom) {
    alert('Phantom cüzdanı bulunamadı. Lütfen kurun.');
    window.open('https://phantom.app/','_blank');
    return;
  }
  const resp = await phantom.connect();
  console.log('Solana cüzdan:', resp.publicKey.toString());
  alert('Solana bağlı: ' + resp.publicKey.toString());
}

document.getElementById('btn-evm')?.addEventListener('click', connectEVM);
document.getElementById('btn-sol')?.addEventListener('click', connectSol);

// ========== Buy buttons (dummy deep-links & info) ==========
document.querySelectorAll('.buy').forEach(btn => {
  btn.addEventListener('click', () => {
    const chain = btn.dataset.chain;
    const price = btn.dataset.price;
    const cfg = window.ZUZU_CFG;

    if (chain === 'evm') {
      alert(`EVM ağında USDT ile alım için hedef adres:\n${cfg.evmUSDTReceiver}\n\n(Fonksiyon prototipidir)`);
      // Burada kontrat/USDT transfer logic eklenecek.
    } else if (chain === 'sol') {
      alert(`Solana alım adresi:\n${cfg.solReceiver}`);
    } else if (chain === 'ton') {
      // Tonkeeper deeplink örneği:
      const url = `https://app.tonkeeper.com/transfer/${cfg.tonReceiver}`;
      window.open(url, '_blank');
    }
  });
});

// ========== Slot Machine Countdown ==========
// Reel bir sütunda 0..9 sayılarından oluşan bir şerit döndürür.
const NUMS = ['0','1','2','3','4','5','6','7','8','9'];
function makeReelHTML(n) {
  return NUMS.map(d => `<div class="d">${d}</div>`).join('') + `<div class="d">${n}</div>`;
}
function setReelValue(reelEl, n) {
  // İçeriği sondaki hedef rakamla biten bir şerit halinde ayarla
  reelEl.innerHTML = makeReelHTML(n);
  const total = reelEl.children.length;
  const offset = (total - 1) * 46; // .slot yüksekliği (46px)
  // Kaydırma: slot-makinesi etkisi
  requestAnimationFrame(() => {
    reelEl.style.transform = `translateY(-${offset}px)`;
  });
}

function split2(n) { return String(n).padStart(2,'0').split(''); }

function updateCountdown() {
  const end = window.ZUZU_CFG?.presaleEnd || new Date(Date.now() + 1000*60*60*24*7);
  const now = new Date();
  let diff = Math.max(0, end - now);

  const s = Math.floor(diff/1000)%60;
  const m = Math.floor(diff/(1000*60))%60;
  const h = Math.floor(diff/(1000*60*60))%24;
  const d = Math.floor(diff/(1000*60*60*24));

  const map = {
    days: split2(Math.min(99,d)),
    hours: split2(h),
    minutes: split2(m),
    seconds: split2(s)
  };

  Object.entries(map).forEach(([type, digits]) => {
    const group = document.querySelector(`.slots[data-type="${type}"]`);
    if (!group) return;
    const [d1, d2] = digits;
    const reels = group.querySelectorAll('.reel');
    setReelValue(reels[0], d1);
    setReelValue(reels[1], d2);
  });
}

function initReels() {
  document.querySelectorAll('.reel').forEach(r => {
    r.innerHTML = makeReelHTML(0);
  });
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

window.addEventListener('DOMContentLoaded', initReels);
