<script>
/* =============== ZUZU — Wallet Lite (Phantom / Solflare / Backpack) =============== */
/* Bağlantı stratejisi:
   1) window içindeki sağlayıcıyı yakala ve connect() çağır.
   2) Sağlayıcı yoksa ilgili wallet'ın "browse" universal link'i ile siteni wallet içi tarayıcıda aç.
   Bu akış hem mobilde hem masaüstünde (wallet extension varsa) çalışır.
*/

const ZU_SITE = location.origin + location.pathname; // örn. https://zuz ucoin.xyz/
const LS_KEY  = "zuzu_wallet_pubkey";

const $ = sel => document.querySelector(sel);
const on = (el,ev,cb) => el && el.addEventListener(ev,cb,{passive:true});

/* ---------- Modal UI (inline SVG ikonlarla) ---------- */
const MODAL_HTML = `
  <div id="zuzuWModal" class="zuwrap" style="
    position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;
    background:rgba(6,10,18,.54);backdrop-filter:blur(2px)">
    <div class="panel" style="width:min(560px,92%);background:#0f1828;border:1px solid #203252;border-radius:16px;box-shadow:0 14px 42px rgba(0,0,0,.45)">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #1c2a46">
        <b style="color:#dfe8ff;font-size:18px">Connect Wallet</b>
        <button id="zuzuWClose" aria-label="Close" style="border:0;background:#17233c;color:#cfe2ff;border-radius:10px;cursor:pointer;width:32px;height:32px">✕</button>
      </div>
      <div style="padding:10px 12px 4px;display:grid;gap:10px">
        ${walletRow("phantom","Phantom",PHANTOM_SVG())}
        ${walletRow("solflare","Solflare",SOLFLARE_SVG())}
        ${walletRow("backpack","Backpack",BACKPACK_SVG())}
      </div>
      <div style="padding:12px 14px 16px;color:#9fb4dd;border-top:1px solid #1c2a46;font-size:14px">
        On mobile, the site opens inside the wallet. Approve <b>zuz ucoin.xyz</b>, then you’ll return here automatically.
      </div>
    </div>
  </div>
`;
function walletRow(key,label,icon){
  return `
  <button data-wallet="${key}" class="wbtn" style="
    display:flex;align-items:center;gap:10px;background:#12203a;border:1px solid #22365a;color:#e7f0ff;
    border-radius:12px;padding:14px;cursor:pointer">
    <span style="width:28px;height:28px;display:grid;place-items:center">${icon}</span>
    <span style="font-weight:700">${label}</span>
  </button>`;
}
function PHANTOM_SVG(){
  return `<svg viewBox="0 0 24 24" width="24" height="24" fill="#9aaeff"><path d="M12 2c5.5 0 10 4.2 10 9.5S17.5 21 12 21c-2.1 0-4-.6-5.6-1.6-.5-.3-.7-.9-.4-1.4.5-.8 1.4-1.9 2.7-2.4 1.1-.5 2.3.2 3.4.2 3.6 0 6.5-2.6 6.5-5.8S15.6 4 12 4 5.5 6.6 5.5 9.8c0 .7.1 1.4.3 2 .2.5-.3 1.1-.9 1-.9-.2-1.9-.9-2.2-2.6C2.5 5.8 6.7 2 12 2z"/></svg>`;
}
function SOLFLARE_SVG(){
  return `<svg viewBox="0 0 24 24" width="24" height="24"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#ff8a00"/><stop offset="1" stop-color="#ff3d71"/></linearGradient></defs><circle cx="12" cy="12" r="10" fill="url(#g)"/></svg>`;
}
function BACKPACK_SVG(){
  return `<svg viewBox="0 0 24 24" width="24" height="24" fill="#7bd3ff"><path d="M8 6a4 4 0 018 0v1h1.5A2.5 2.5 0 0120 9.5V18a3 3 0 01-3 3H7a3 3 0 01-3-3V9.5A2.5 2.5 0 016.5 7H8V6zm2 1h4V6a2 2 0 10-4 0v1zm-3 5h10v2H7v-2z"/></svg>`;
}

(function injectModal(){
  if($('#zuzuWModal')) return;
  document.body.insertAdjacentHTML('beforeend', MODAL_HTML);
  on($('#zuzuWClose'), 'click', ()=> toggleModal(false));
  document.querySelectorAll('#zuzuWModal .wbtn').forEach(b=>{
    on(b,'click', ()=> handleChoice(b.dataset.wallet));
  });
})();
function toggleModal(v){ const m = $('#zuzuWModal'); if(!m) return; m.style.display = v?'flex':'none'; }

/* ---------- Sağlayıcı tespiti ---------- */
function getProviders(){
  const p = {
    phantom:   window.solana && window.solana.isPhantom ? window.solana : null,
    solflare:  window.solflare && window.solflare.isSolflare ? window.solflare
             : (window.solana && window.solana.isSolflare ? window.solana : null),
    backpack:  (window.backpack && window.backpack.solana) ? window.backpack.solana : null,
  };
  return p;
}

/* ---------- Deeplink fallback ---------- */
function openInWalletBrowser(wallet){
  const enc = encodeURIComponent(location.href);
  const links = {
    phantom:  `https://phantom.app/ul/browse/${enc}`,
    solflare: `https://solflare.com/ul/v1/browse?browserUrl=${enc}`,
    // iki domaini de dene (bazı cihazlarda biri çalışıyor)
    backpack:  [`https://backpack.app/ul/browse/${enc}`, `https://www.backpack.app/ul/browse/${enc}`],
  };
  let target = links[wallet];
  if (Array.isArray(target)) { window.open(target[0], '_blank'); setTimeout(()=>window.open(target[1], '_blank'), 150); }
  else { window.open(target, '_blank'); }
}

/* ---------- Bağlanma ---------- */
async function connectPhantom(p){
  const res = await p.connect({ onlyIfTrusted:false });
  return res.publicKey?.toString();
}
async function connectSolflare(p){
  if (p.connect) { await p.connect(); }
  const pk = p.publicKey || (p.wallet && p.wallet.publicKey);
  return pk?.toString();
}
async function connectBackpack(p){
  // Backpack provider çoğunlukla window.backpack.solana şeklinde
  const res = await p.connect();
  const pk = res?.publicKey || p.publicKey;
  return pk?.toString();
}

async function handleChoice(wallet){
  const prov = getProviders();
  try{
    if (wallet==='phantom' && prov.phantom){
      const pub = await connectPhantom(prov.phantom);
      return afterConnected(pub, 'Phantom');
    }
    if (wallet==='solflare' && prov.solflare){
      const pub = await connectSolflare(prov.solflare);
      return afterConnected(pub, 'Solflare');
    }
    if (wallet==='backpack' && prov.backpack){
      const pub = await connectBackpack(prov.backpack);
      return afterConnected(pub, 'Backpack');
    }
    // Sağlayıcı yoksa deeplink ile wallet içi tarayıcıda aç
    openInWalletBrowser(wallet);
  }catch(e){
    console.warn('wallet connect error', e);
    alert('Connection was cancelled or failed.');
  }
}

function afterConnected(pubkey, label){
  if(!pubkey) { alert(label+' connected, but no public key returned.'); return; }
  localStorage.setItem(LS_KEY, pubkey);
  const btn = $('#connectBtn');
  if(btn){
    const short = pubkey.slice(0,6) + '…' + pubkey.slice(-4);
    btn.textContent = short;
  }
  toggleModal(false);
}

/* ---------- Düğme davranışı ---------- */
(function wireButton(){
  const btn = $('#connectBtn');
  if(!btn) return;
  // varsa daha önce bağlanan adresi göster
  const saved = localStorage.getItem(LS_KEY);
  if(saved){
    const short = saved.slice(0,6)+'…'+saved.slice(-4);
    btn.textContent = short;
  }
  on(btn,'click', (e)=>{
    e.preventDefault();
    toggleModal(true);
  });
})();

/* Güvenlik: bazı SPA'larda tekrar tekrar modal eklenmesini engelle */
window.__zuzu_wallet_lite_loaded__ = true;
</script>
