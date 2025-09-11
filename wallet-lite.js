/* ==========================================
   ZUZU — Solana Wallet Connect (Vanilla JS)
   Phantom • Solflare • Backpack
   - Modal aç/kapat
   - Tarayıcı eklentisi varsa bağlan
   - Yoksa cüzdan tarayıcısına yönlendir (mobile)
========================================== */

// (1) Bağlantı durumunu UI'ya yaz
function setConnectedUI(pubkey) {
  const btn = document.getElementById('connectBtn');
  if (!btn) return;
  const k = typeof pubkey === 'string' ? pubkey : String(pubkey || '');
  if (k) {
    const short = k.slice(0, 4) + '…' + k.slice(-4);
    btn.textContent = short;
    btn.dataset.connected = '1';
  } else {
    btn.textContent = (btn.dataset.iText || 'Connect Wallet');
    btn.dataset.connected = '0';
  }
}

// (2) Modal yardımcıları
const modal = document.getElementById('walletModal');
const openModal  = () => modal && (modal.hidden = false);
const closeModal = () => modal && (modal.hidden = true);

// ESC ile kapat
document.addEventListener('keydown', (e)=> {
  if (e.key === 'Escape') closeModal();
});

// X butonu
document.getElementById('wmClose')?.addEventListener('click', closeModal);

// Backdrop tıkla-kapat
modal?.addEventListener('click', (e)=>{
  if (e.target === modal) closeModal();
});

// (3) Entegre buton — modal aç
(function bindOpen(){
  const btn = document.getElementById('connectBtn');
  if (!btn) return;
  if (!btn.dataset.iText) btn.dataset.iText = btn.textContent.trim() || 'Connect Wallet';
  btn.addEventListener('click', openModal);
})();

// (4) ENV/Platform yardımcıları
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// Domain’in tam url’i (wallet browser’a taşımak için)
const ZUZU_URL = location.origin + location.pathname;  // query yoksa yeterli
const encURL   = encodeURIComponent(ZUZU_URL);

// (5) Cüzdan sağlayıcılarını yakala
function getPhantom()  { return window?.solana?.isPhantom ? window.solana : null; }
function getSolflare() { return window?.solflare?.isSolflare ? window.solflare : null; }
// Backpack bazı sürümlerde window.backpack.solana, bazılarında window.solana.isBackpack olabilir.
function getBackpack() {
  if (window?.backpack?.solana) return window.backpack.solana;
  if (window?.solana?.isBackpack) return window.solana;
  return null;
}

// (6) Fallback — cüzdan uygulamasında siteyi aç
function openInWalletBrowser(wallet){
  try {
    if (wallet === 'phantom') {
      // Phantom universal link: cüzdan içi tarayıcıda siteyi açar
      window.location.href = `https://phantom.app/ul/browse/${encURL}`;
      return;
    }
    if (wallet === 'solflare') {
      // Solflare UL (v1)
      window.location.href = `https://solflare.com/ul/v1/browse?url=${encURL}`;
      return;
    }
    if (wallet === 'backpack') {
      // Backpack için resmi UL belgesi sınırlı; deneysel browse linki:
      window.location.href = `https://www.backpack.app/ul/browse/${encURL}`;
      // Çalışmazsa kullanıcı app içinden "Browser" > zuzucoin.xyz açabilir.
      return;
    }
  } catch(e) {
    console.warn('wallet deep link error', e);
  }
  alert('Open this site inside your wallet browser and try again.');
}

// (7) Bağlan fonksiyonları
async function connectPhantom(){
  const provider = getPhantom();
  if (!provider) { 
    if (isMobile) openInWalletBrowser('phantom');
    else window.open('https://phantom.app/', '_blank');
    return;
  }
  try {
    const resp = await provider.connect({ onlyIfTrusted:false });
    const pub = (resp?.publicKey || provider.publicKey)?.toString();
    setConnectedUI(pub);
    localStorage.setItem('zuzu_last_wallet','phantom');
    closeModal();

    // Değişimleri dinle
    provider.on('accountChanged', (pk)=>{
      setConnectedUI(pk ? pk.toString() : '');
    });
  } catch(e){
    console.warn('phantom connect error', e);
  }
}

async function connectSolflare(){
  const sf = getSolflare();
  if (!sf) { 
    if (isMobile) openInWalletBrowser('solflare');
    else window.open('https://solflare.com/', '_blank');
    return;
  }
  try {
    await sf.connect();
    const pub = sf?.publicKey?.toString() || '';
    setConnectedUI(pub);
    localStorage.setItem('zuzu_last_wallet','solflare');
    closeModal();

    sf.on('accountChanged', (pk)=>{
      setConnectedUI(pk ? pk.toString() : '');
    });
  } catch(e){
    console.warn('solflare connect error', e);
  }
}

async function connectBackpack(){
  const bp = getBackpack();
  if (!bp) {
    if (isMobile) openInWalletBrowser('backpack');
    else window.open('https://www.backpack.app/', '_blank');
    return;
  }
  try {
    const resp = await bp.connect();
    const pub = (resp?.publicKey || bp.publicKey)?.toString() || '';
    setConnectedUI(pub);
    localStorage.setItem('zuzu_last_wallet','backpack');
    closeModal();

    bp.on?.('accountChanged', (pk)=>{
      setConnectedUI(pk ? pk.toString() : '');
    });
  } catch(e){
    console.warn('backpack connect error', e);
  }
}

// (8) Modal içi buton davranışı
modal?.querySelectorAll('.wm-item')?.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const w = btn.getAttribute('data-wallet');
    if (w === 'phantom')  return connectPhantom();
    if (w === 'solflare') return connectSolflare();
    if (w === 'backpack') return connectBackpack();
  });
});

// (9) Sayfa açılışında son kullanılan cüzdanı otomatik bağlamaya dene (sessiz)
window.addEventListener('load', async ()=>{
  try{
    const last = localStorage.getItem('zuzu_last_wallet');
    if (last === 'phantom' && getPhantom()?.isConnected) {
      setConnectedUI(getPhantom().publicKey?.toString());
      return;
    }
    if (last === 'solflare' && getSolflare()?.isConnected) {
      setConnectedUI(getSolflare().publicKey?.toString());
      return;
    }
    if (last === 'backpack' && getBackpack()?.isConnected) {
      setConnectedUI(getBackpack().publicKey?.toString());
      return;
    }
    // Bazı cüzdanlar onlyIfTrusted ile sessiz bağlanmaya izin veriyor:
    if (last === 'phantom' && getPhantom()) {
      try {
        const r = await getPhantom().connect({ onlyIfTrusted:true });
        setConnectedUI((r?.publicKey || getPhantom().publicKey)?.toString());
      } catch(_) {}
    }
  }catch(e){ console.warn(e); }
});
