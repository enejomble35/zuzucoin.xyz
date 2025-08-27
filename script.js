// ===================== I18N =====================
const I18N = {
  tr: {
    "nav.about":"Hakkımızda",
    "nav.community":"Topluluk",
    "nav.stake":"Stake",
    "nav.roadmap":"Yol Haritası",
    "nav.tokenomics":"Tokonomi",
    "wallet.evm":"MetaMask / EVM",
    "hero.title":"Kirpinin Gücü: <span class='grad'>ZUZUCOIN</span>",
    "hero.lead":"ZUZUCOIN; neon şehirlerin arasında dolaşan anime-robotik kirpi maskotunun ruhunu taşır. <b>Topluluk odaklı</b>, <b>oyunlaştırma</b> içeren, adil ve şeffaf bir web3 ekonomisini hedefler.",
    "cd.days":"Gün","cd.hours":"Saat","cd.minutes":"Dakika","cd.seconds":"Saniye",
    "phase.w1":"1. Hafta","phase.w2":"2. Hafta","phase.w3":"3. Hafta","phase.w4":"4. Hafta",
    "btn.buy":"Satın Al",
    "community.title":"Topluluk",
    "community.text":"Telegram, X ve Discord’da global bir aile. Etkinlikler, airdrop’lar, mini oyunlar ve daha fazlası.",
    "stake.title":"Stake",
    "stake.text":"ZUZU’larını kilitle, pasif gelir kazan. Erken stakeleyenler özel rozet ve ödüller alır.",
    "stake.cta":"Stake Paneli (yakında)",
    "gallery.title":"ZUZU Maskot Galerisi","gallery.text":"Anime-robotik kirpi koleksiyonundan 10 özel görsel",
    "roadmap.title":"Yol Haritamız",
    "token.title":"Tokonomi","token.supply":"Toplam Arz:",
    "buy.title":"Satın Alma Bilgisi",
    "buy.desc":"Aşağıdan kullanmak istediğiniz ağı seçin. USDT gönderirken ağı doğru seçtiğinizden emin olun.",
    "buy.note":"Not: Bu sürüm “bilgilendirme” amaçlıdır. Otomatik akıllı sözleşme ödemesi, stake ve dağıtım bir sonraki sürümde eklenecektir."
  },
  en: {
    "nav.about":"About",
    "nav.community":"Community",
    "nav.stake":"Stake",
    "nav.roadmap":"Roadmap",
    "nav.tokenomics":"Tokenomics",
    "wallet.evm":"MetaMask / EVM",
    "hero.title":"Power of the Hedgehog: <span class='grad'>ZUZUCOIN</span>",
    "hero.lead":"ZUZUCOIN embodies the spirit of an anime-robotic hedgehog roaming neon cities. A <b>community-driven</b>, <b>gamified</b>, fair and transparent web3 economy.",
    "cd.days":"Days","cd.hours":"Hours","cd.minutes":"Minutes","cd.seconds":"Seconds",
    "phase.w1":"Week 1","phase.w2":"Week 2","phase.w3":"Week 3","phase.w4":"Week 4",
    "btn.buy":"Buy",
    "community.title":"Community",
    "community.text":"A global family on Telegram, X and Discord. Events, airdrops, mini-games and more.",
    "stake.title":"Stake",
    "stake.text":"Lock your ZUZU and earn passive income. Early stakers get badges and special rewards.",
    "stake.cta":"Staking Panel (soon)",
    "gallery.title":"ZUZU Mascot Gallery","gallery.text":"10 exclusive visuals from our anime-robotic hedgehog collection",
    "roadmap.title":"Roadmap",
    "token.title":"Tokenomics","token.supply":"Total Supply:",
    "buy.title":"Purchase Info",
    "buy.desc":"Choose the network you want to use. Make sure you send USDT on the correct network.",
    "buy.note":"Note: This build is informational. Automated contract payments, staking and distribution will be added in the next release."
  }
};

const langSelect = document.getElementById('langSelect');
function applyI18n(lang){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k = el.getAttribute('data-i18n');
    const v = I18N[lang]?.[k];
    if(v) el.innerHTML = v;
  });
  localStorage.setItem('zuzu_lang', lang);
}
langSelect.addEventListener('change', e=>applyI18n(e.target.value));
applyI18n(localStorage.getItem('zuzu_lang') || 'tr');
langSelect.value = localStorage.getItem('zuzu_lang') || 'tr';

// ===================== COUNTDOWN =====================
const target = new Date(); // 4 haftalık presale örneği
target.setDate(target.getDate()+28);
function pad(n){return n.toString().padStart(2,'0')}
function tick(){
  const now = new Date();
  let t = Math.max(0, target - now);
  const d = Math.floor(t/86400000); t%=86400000;
  const h = Math.floor(t/3600000);  t%=3600000;
  const m = Math.floor(t/60000);    t%=60000;
  const s = Math.floor(t/1000);
  document.getElementById('d').textContent = pad(d);
  document.getElementById('h').textContent = pad(h);
  document.getElementById('m').textContent = pad(m);
  document.getElementById('s').textContent = pad(s);
}
setInterval(tick,1000); tick();

// ===================== MASKOT GRID =====================
const maskots = [
  {file:'0.png', name:'Titan'},
  {file:'1.png', name:'Hacker'},
  {file:'2.png', name:'Maiden'},
  {file:'3.png', name:'Scientist'},
  {file:'4.png', name:'Berserker'},
  {file:'5.png', name:'Sorceress'},
  {file:'6.png', name:'Rogue'},
  {file:'7.png', name:'Warrior'},
  {file:'8.png', name:'Ranger'},
  {file:'9.png', name:'Hero'}
];
const grid = document.getElementById('maskotGrid');
grid.innerHTML = maskots.map(m => `
  <div class="maskot">
    <img src="assets/images/maskots/${m.file}" alt="${m.name}">
    <div class="name">${m.name}</div>
  </div>
`).join('');

// ===================== BUY MODAL =====================
const buyModal = document.getElementById('buyModal');
window.openBuyModal = (price)=>{ buyModal.classList.add('show'); };
window.closeBuyModal = ()=>{ buyModal.classList.remove('show'); };

// ===================== WALLETS =====================
// 1) EVM – MetaMask
const btnEvm = document.getElementById('btnEvm');
btnEvm?.addEventListener('click', async ()=>{
  if(!window.ethereum){ alert('MetaMask bulunamadı. Lütfen yükleyiniz.'); return; }
  try{
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const acc = accounts[0];
    btnEvm.textContent = shorten(acc);
  }catch(err){ console.log(err); }
});

// 2) Solana – Phantom
const btnSol = document.getElementById('btnSol');
btnSol?.addEventListener('click', async ()=>{
  const provider = window.solana;
  if(!provider || !provider.isPhantom){ alert('Phantom cüzdanı bulunamadı.'); return; }
  try{
    const resp = await provider.connect();
    btnSol.textContent = shorten(resp.publicKey.toString());
  }catch(e){ console.log(e); }
});

// 3) TON – TonConnect UI
const tonWrapper = document.getElementById('tonConnectWrapper');
window.addEventListener('DOMContentLoaded', ()=>{
  if(window.TonConnectUI){
    const tonui = new TonConnectUI.TonConnectUI({
      manifestUrl: window.location.origin + '/tonconnect-manifest.json',
      buttonRootId: 'tonConnectWrapper',
      uiPreferences: { theme: 'dark' }
    });
  }
});

function shorten(addr){
  return addr.slice(0,6)+'…'+addr.slice(-4);
}
