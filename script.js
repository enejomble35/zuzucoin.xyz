/***********************
 *  CONFIG
 ***********************/
const CONFIG = {
  // Countdown hedefi (Türkiye Saati)
  countdownTarget: '2025-09-01T21:00:00+03:00',

  // Ön satış DEMO modu: true → işlem simülasyonu; false → gerçek sözleşmeye tx atacak.
  presaleDemo: true,

  // Gerçek sözleşmeyi kullanmak istersen:
  evm: {
    // Örnek: BSC Testnet 0x61 / Polygon 0x89 / Ethereum 0x1
    chainIdHex: '0x61', // BSC testnet örnek
    rpc: 'https://bsc-testnet.publicnode.com',
    contract: '',       // 0x.... ZUZU presale sözleşmesi (BUY: buy(uint8 tier) payable)
    abi: [
      // Basit örnek ABI. Kendi sözleşmen farklıysa bunu değiştir.
      {
        "inputs":[{"internalType":"uint8","name":"tier","type":"uint8"}],
        "name":"buy","outputs":[],"stateMutability":"payable","type":"function"
      }
    ]
  }
};

/***********************
 *  PRELOADER
 ***********************/
window.addEventListener('load', () => {
  const p = document.getElementById('preloader');
  if (p) p.style.display = 'none';
});

/***********************
 *  i18n (TR/EN)
 ***********************/
const I18N = {
  tr: {
    "nav.about":"Hakkımızda","nav.community":"Topluluk","nav.stake":"Stake","nav.roadmap":"Yol Haritası","nav.tokenomics":"Tokonomi",
    "btn.wallet":"Cüzdan Bağla","btn.buy":"Satın Al","btn.close":"Kapat",
    "hero.title":"Kirpinin Gücü: <span class='grad'>ZUZUCOIN</span>",
    "hero.lead":"ZUZUCOIN; neon şehirlerin arasında dolaşan <strong>anime-robotik kirpi</strong> maskotunun ruhunu taşır. <em>Topluluk odaklı</em>, <em>oyunlaştırma</em> içeren, adil ve şeffaf bir web3 ekonomisini hedefler.",
    "cd.days":"Gün","cd.hours":"Saat","cd.minutes":"Dakika","cd.seconds":"Saniye",
    "community.title":"Topluluk","community.lead":"Telegram, X ve Discord’da global bir aile. Etkinlikler, airdrop’lar, mini oyunlar ve daha fazlası.",
    "stake.title":"Stake","stake.lead":"ZUZU’larını kilitle, pasif gelir kazan. Erken stakleyenler özel rozet ve ödüller alır.","stake.button":"Stake Paneli (yakında)",
    "gallery.title":"ZUZU Maskot Galerisi","gallery.lead":"Anime-robotik kirpi koleksiyonundan 10 özel görsel",
    "roadmap.title":"Yol Haritamız","roadmap.q1":"<strong>Q1:</strong> Marka, site, topluluk — maskot koleksiyonu",
    "roadmap.q2":"<strong>Q2:</strong> Ön satış, stake (ödüller), mini-oyun",
    "roadmap.q3":"<strong>Q3:</strong> Partnerlikler, borsa listelemeleri için başvurular",
    "roadmap.q4":"<strong>Q4:</strong> Global pazarlama, ekosistem genişlemesi",
    "token.title":"Tokonomi","token.total":"Toplam Arz:"
  },
  en: {
    "nav.about":"About","nav.community":"Community","nav.stake":"Stake","nav.roadmap":"Roadmap","nav.tokenomics":"Tokenomics",
    "btn.wallet":"Connect Wallet","btn.buy":"Buy","btn.close":"Close",
    "hero.title":"Power of the Hedgehog: <span class='grad'>ZUZUCOIN</span>",
    "hero.lead":"ZUZUCOIN carries the spirit of an <strong>anime-robotic hedgehog</strong>. A fair and transparent web3 economy with <em>community focus</em> and <em>gamification</em>.",
    "cd.days":"Days","cd.hours":"Hours","cd.minutes":"Minutes","cd.seconds":"Seconds",
    "community.title":"Community","community.lead":"A global family on Telegram, X and Discord. Events, airdrops, mini games and more.",
    "stake.title":"Stake","stake.lead":"Lock your ZUZU, earn passive income. Early stakers get special badges & rewards.","stake.button":"Stake Panel (soon)",
    "gallery.title":"ZUZU Mascot Gallery","gallery.lead":"10 exclusive visuals from the anime-robotic hedgehog collection",
    "roadmap.title":"Roadmap","roadmap.q1":"<strong>Q1:</strong> Brand, site, community — mascot collection",
    "roadmap.q2":"<strong>Q2:</strong> Presale, staking (rewards), mini game",
    "roadmap.q3":"<strong>Q3:</strong> Partnerships, CEX listings applications",
    "roadmap.q4":"<strong>Q4:</strong> Global marketing, ecosystem expansion",
    "token.title":"Tokenomics","token.total":"Total Supply:"
  }
};

function applyI18n(lang){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if (I18N[lang] && I18N[lang][key]){
      el.innerHTML = I18N[lang][key];
    }
  });
  localStorage.setItem('zuzu_lang', lang);
}
const langSel = document.getElementById('langSwitch');
langSel?.addEventListener('change', e => applyI18n(e.target.value));
applyI18n(localStorage.getItem('zuzu_lang') || 'tr');

/***********************
 *  Wallet Connect (EVM, Solana, TON)
 ***********************/
const btnWallet = document.getElementById('btnWallet');
const walletMenu = document.getElementById('walletMenu');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const modalClose = document.getElementById('modalClose');

btnWallet?.addEventListener('click', ()=>{
  const open = walletMenu.style.display === 'block';
  walletMenu.style.display = open ? 'none':'block';
  btnWallet.setAttribute('aria-expanded', String(!open));
});
document.addEventListener('click', (e)=>{
  if (!walletMenu.contains(e.target) && !btnWallet.contains(e.target)){
    walletMenu.style.display = 'none';
  }
});

modalClose?.addEventListener('click', ()=> modal.style.display='none');
modal?.addEventListener('click',(e)=>{ if(e.target===modal) modal.style.display='none' });

function showModal(title, text){
  modalTitle.textContent = title;
  modalText.innerHTML = text;
  modal.style.display = 'flex';
}

/*** EVM / MetaMask ***/
async function connectEVM(){
  if (!window.ethereum){
    showModal('MetaMask', 'MetaMask yüklü değil. Lütfen tarayıcı eklentisini yükleyin.');
    return;
  }
  try{
    // Ağ uyumu
    const want = CONFIG.evm.chainIdHex;
    const curr = await window.ethereum.request({method:'eth_chainId'});
    if (curr !== want){
      try{
        await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: want }] });
      }catch(swErr){
        // Eğer ağ ekli değilse
        await window.ethereum.request({
          method:'wallet_addEthereumChain',
          params:[{ chainId: want, rpcUrls:[CONFIG.evm.rpc], chainName:'ZUZU Chain', nativeCurrency:{name:'Test',symbol:'TST',decimals:18} }]
        });
      }
    }
    const accs = await window.ethereum.request({method:'eth_requestAccounts'});
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = accs[0];
    window.zuzu = { provider, signer, address, chainId: await signer.getChainId() };

    showModal('MetaMask', `Bağlandı: <br/><code>${address}</code>`);
  }catch(e){
    console.error(e);
    showModal('MetaMask', 'Bağlantı reddedildi veya hata oluştu.');
  }
}

/*** Solana / Phantom ***/
async function connectSolana(){
  try{
    const provider = window.solana; // Phantom
    if (!provider || !provider.isPhantom){
      showModal('Solana', 'Phantom cüzdanı bulunamadı. Lütfen Phantom yükleyin.');
      return;
    }
    const resp = await provider.connect();
    const address = resp.publicKey.toString();
    window.zuzuSol = { provider, address };
    showModal('Solana', `Bağlandı: <br/><code>${address}</code>`);
  }catch(e){
    console.error(e);
    showModal('Solana', 'Bağlantı reddedildi veya hata oluştu.');
  }
}

/*** TON / TonConnect UI ***/
let tonUI;
async function connectTON(){
  try{
    if (!tonUI){
      tonUI = new TonConnectUI.TonConnectUI({
        manifestUrl: 'https://zuzucoin.xyz/tonconnect-manifest.json' // istersen ekleriz; yoksa default modal çalışır
      });
    }
    const conn = await tonUI.connectWallet();
    const address = conn?.account?.address || '(adres)';
    window.zuzuTon = { address, conn };
    showModal('TON', `Bağlandı: <br/><code>${address}</code>`);
  }catch(e){
    console.error(e);
    showModal('TON', 'Bağlantı reddedildi veya hata oluştu.');
  }
}

walletMenu?.addEventListener('click', (e)=>{
  if (!e.target.matches('button')) return;
  const t = e.target.getAttribute('data-wallet');
  walletMenu.style.display = 'none';
  if (t==='evm') connectEVM();
  if (t==='solana') connectSolana();
  if (t==='ton') connectTON();
});

/***********************
 *  Countdown
 ***********************/
const targetDate = new Date(CONFIG.countdownTarget);
const elD = document.getElementById('cdDays');
const elH = document.getElementById('cdHours');
const elM = document.getElementById('cdMinutes');
const elS = document.getElementById('cdSeconds');

function pad(n){ return n.toString().padStart(2,'0'); }
function tick(){
  const now = new Date();
  let diff = Math.max(0, targetDate - now);
  const d = Math.floor(diff / (1000*60*60*24));
  diff -= d * (1000*60*60*24);
  const h = Math.floor(diff / (1000*60*60));
  diff -= h * (1000*60*60);
  const m = Math.floor(diff / (1000*60));
  diff -= m * (1000*60);
  const s = Math.floor(diff / 1000);

  [elD,elH,elM,elS].forEach(el=>{ el.classList.remove('spin'); void el.offsetWidth; el.classList.add('spin'); });
  elD.textContent = pad(d); elH.textContent = pad(h); elM.textContent = pad(m); elS.textContent = pad(s);
}
setInterval(tick,1000); tick();

/***********************
 *  Presale (Demo → Real switch)
 ***********************/
async function buyTier(tier, priceStr){
  if (CONFIG.presaleDemo){
    showModal('Ön Satış (DEMO)', `Tier: ${tier}. Fiyat: ${priceStr}.<br/>Gerçek satış için sözleşme adresi eklenince otomatik aktif olacak.`);
    return;
  }

  // Gerçek EVM örneği:
  try{
    if (!window.zuzu?.signer){
      await connectEVM();
      if (!window.zuzu?.signer) return;
    }
    const signer = window.zuzu.signer;
    const contract = new ethers.Contract(CONFIG.evm.contract, CONFIG.evm.abi, signer);

    // priceStr "0.0015 USDT" gibi → değeri parse edemez; normalde kontratın fiyatı kendinde olmalı.
    // Örnek olarak "native coin" ile ödeme gönderen demo:
    const value = ethers.utils.parseEther('0.001'); // örnek
    const tx = await contract.buy(tier, { value });
    showModal('Ön Satış', `İşlem gönderildi: <br/><code>${tx.hash}</code>`);
  }catch(e){
    console.error(e);
    showModal('Ön Satış', 'İşlem gönderilemedi. Sözleşme/ABI ayarlarını kontrol et.');
  }
}
document.querySelectorAll('.buy').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const card = btn.closest('.tier');
    const tier = parseInt(card.dataset.tier,10);
    const price = card.querySelector('.price').textContent;
    buyTier(tier, price);
  });
});

/***********************
 *  Tilt effect
 ***********************/
document.addEventListener('mousemove', (e)=>{
  document.querySelectorAll('.tilt img').forEach(img=>{
    const r = img.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) return;
    const cx = e.clientX - r.left, cy = e.clientY - r.top;
    const rx = ((cy/r.height)-0.5)*6;
    const ry = ((cx/r.width)-0.5)*-6;
    img.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
  });
});
document.querySelectorAll('.tilt img').forEach(img=>{
  img.addEventListener('mouseleave', ()=> img.style.transform='none');
});

/***********************
 *  Mask gallery (0..9 + isimler)
 ***********************/
const maskNames = ["Titan","Hacker","Maiden","Scientist","Berserker","Sorceress","Rogue","Warrior","Ranger","Hero"];
(function buildGallery(){
  const wrap = document.getElementById('maskGrid');
  if (!wrap) return;
  for (let i=0;i<10;i++){
    const box = document.createElement('div');
    box.className = 'mask-item';
    box.innerHTML = `
      <figure class="mask-card">
        <img src="assets/images/masks/${i}.png" alt="${maskNames[i]}">
        <figcaption>${maskNames[i]}</figcaption>
      </figure>`;
    wrap.appendChild(box);
  }
})();
