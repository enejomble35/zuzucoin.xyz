/* Lightweight Solana wallet modal (Phantom / Solflare / Backpack)
   - Mobil: deeplink -> “zuzucoin.xyz’e bağlan?” -> geri dön -> sessiz bağlan
   - Web: provider ile bağlan
   - Bağlanınca Connect Wallet butonunda kısaltılmış adres göster ve localStorage'a yaz
*/
(function () {
  const APP_URL = "https://zuzucoin.xyz";
  const CONNECT_BTN = document.getElementById("connectBtn");
  const MODAL_ID = "walletModal";

  function ensureModal() {
    if (document.getElementById(MODAL_ID)) return;
    const el = document.createElement("div");
    el.id = MODAL_ID;
    el.className = "wallet-modal";
    el.innerHTML = `
      <div class="wallet-backdrop" data-x="1"></div>
      <div class="wallet-box">
        <div class="wallet-head">
          <h3>Connect Wallet</h3>
          <button class="x" data-x="1">✕</button>
        </div>
        <div class="wallet-grid">
          <button id="wPhantom"  class="wallet-item">
            <img src="assets/wallets/phantom.svg" alt="Phantom"><span>Phantom</span>
          </button>
          <button id="wSolflare" class="wallet-item">
            <img src="assets/wallets/solflare.svg" alt="Solflare"><span>Solflare</span>
          </button>
          <button id="wBackpack" class="wallet-item">
            <img src="assets/wallets/backpack.svg" alt="Backpack"><span>Backpack</span>
          </button>
        </div>
        <p class="note">If the app opens, approve <b>zuzucoin.xyz</b> to connect. You’ll be redirected back automatically.</p>
      </div>`;
    document.body.appendChild(el);
    el.addEventListener("click", (e) => { if (e.target.dataset.x) el.remove(); });
  }
  function showModal(){ ensureModal(); document.getElementById(MODAL_ID).classList.add("show"); }
  function hideModal(){ const m=document.getElementById(MODAL_ID); if(m) m.remove(); }

  function setConnected(pubkey) {
    if (!CONNECT_BTN) return;
    const short = pubkey.slice(0, 4) + "..." + pubkey.slice(-4);
    CONNECT_BTN.textContent = short;
    CONNECT_BTN.classList.add("connected");
    localStorage.setItem("zuzu_pk", pubkey);
    hideModal();
  }

  // açılışta butonu doldur
  (function restore(){
    const pk = localStorage.getItem("zuzu_pk");
    if (pk && CONNECT_BTN) {
      CONNECT_BTN.textContent = pk.slice(0,4)+"..."+pk.slice(-4);
      CONNECT_BTN.classList.add("connected");
    }
  })();

  async function connectWeb() {
    try {
      if (window.solana?.isPhantom) {
        const r = await window.solana.connect({ onlyIfTrusted:false });
        if (r?.publicKey) return setConnected(r.publicKey.toString());
      }
    } catch {}
    try {
      if (window.solflare?.connect) {
        await window.solflare.connect();
        if (window.solflare.publicKey) return setConnected(window.solflare.publicKey.toString());
      }
    } catch {}
    try {
      if (window.backpack?.connect) {
        const r = await window.backpack.connect();
        const pk = (r?.publicKey || r)?.toString?.() || r?.[0];
        if (pk) return setConnected(pk);
      }
    } catch {}
    showModal();
  }

  function openPhantomDL() {
    const link =
      "https://phantom.app/ul/v1/connect" +
      "?app_url=" + encodeURIComponent(APP_URL) +
      "&redirect_link=" + encodeURIComponent(window.location.origin + window.location.pathname + "#w=phantom");
    window.location.href = link;
  }
  function openSolflareDL() {
    const link =
      "https://solflare.com/ul/v1/connect" +
      "?app_url=" + encodeURIComponent(APP_URL) +
      "&redirect_link=" + encodeURIComponent(window.location.origin + window.location.pathname + "#w=solflare");
    window.location.href = link;
  }
  function openBackpackDL() {
    const link =
      "https://backpack.app/ul/v1/connect" +
      "?app_url=" + encodeURIComponent(APP_URL) +
      "&redirect_link=" + encodeURIComponent(window.location.origin + window.location.pathname + "#w=backpack");
    window.location.href = link;
  }

  document.getElementById("connectBtn")?.addEventListener("click", () => {
    if (window.solana?.isPhantom || window.solflare || window.backpack) return connectWeb();
    showModal();
  });
  document.addEventListener("click", (e)=>{
    if (e.target?.id === "wPhantom") return openPhantomDL();
    if (e.target?.id === "wSolflare") return openSolflareDL();
    if (e.target?.id === "wBackpack") return openBackpackDL();
  });

  async function tryTrustedReconnect() {
    const tag = (location.hash || "").slice(1);
    if (!tag) return;
    try {
      if (tag.includes("phantom") && window.solana?.connect) {
        const r = await window.solana.connect({ onlyIfTrusted:true });
        if (r?.publicKey) return setConnected(r.publicKey.toString());
      }
    } catch {}
    try {
      if (tag.includes("solflare") && window.solflare?.connect) {
        await window.solflare.connect();
        if (window.solflare.publicKey) return setConnected(window.solflare.publicKey.toString());
      }
    } catch {}
    try {
      if (tag.includes("backpack") && window.backpack?.connect) {
        const r = await window.backpack.connect();
        const pk = (r?.publicKey || r)?.toString?.() || r?.[0];
        if (pk) return setConnected(pk);
      }
    } catch {}
  }
  window.addEventListener("load", tryTrustedReconnect);

  // Dışarı aç
  window.__zuzu_getPubkey = () => localStorage.getItem("zuzu_pk") || null;
})();
