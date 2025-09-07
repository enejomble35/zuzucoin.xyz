/* =======================================================
   ZUZUCOIN — Solana Wallet Modal
   Phantom • Solflare • Backpack
   - Uzantı varsa direkt bağlanır
   - Uzantı yoksa deeplink + redirect (zuzucoin.xyz)
   - Geri dönünce onlyIfTrusted ile auto-connect
   - Bağlandıktan sonra Connect Wallet butonunda kısaltılmış
     public key gösterilir ve localStorage'a yazılır.
==========================================================*/
(function () {
  const APP_ORIGIN = location.origin || "https://zuzucoin.xyz";
  const REDIRECT = location.href.split('#')[0]; // hash'i temizle
  const LS_KEY = "zuzu_pubkey";

  const $ = sel => document.querySelector(sel);
  const connectBtn = $("#connectBtn");

  // ------------------------------------------------------
  // UI: Modal oluşturan helper
  // ------------------------------------------------------
  function ensureModal() {
    if ($("#walletModal")) return $("#walletModal");

    const wrap = document.createElement("div");
    wrap.id = "walletModal";
    wrap.className = "wallet-modal";
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML = `
      <div class="wallet-backdrop"></div>
      <div class="wallet-box">
        <button id="wmClose" class="wm-close" aria-label="Close">×</button>
        <h3>Connect Wallet</h3>
        <div class="wallet-grid">
          <button id="wPhantom"  class="wallet-item">
            <img onerror="this.replaceWith(document.createTextNode('🟣'))"
                 src="assets/wallets/phantom.svg" alt="Phantom">
            <span>Phantom</span>
          </button>
          <button id="wSolflare" class="wallet-item">
            <img onerror="this.replaceWith(document.createTextNode('🟠'))"
                 src="assets/wallets/solflare.svg" alt="Solflare">
            <span>Solflare</span>
          </button>
          <button id="wBackpack" class="wallet-item">
            <img onerror="this.replaceWith(document.createTextNode('🟡'))"
                 src="assets/wallets/backpack.svg" alt="Backpack">
            <span>Backpack</span>
          </button>
        </div>
        <p class="note">
          If the app opens, approve <b>zuzucoin.xyz</b> to connect.
          You’ll be redirected back automatically.
        </p>
      </div>`;
    document.body.appendChild(wrap);

    // kapatma
    wrap.querySelector("#wmClose").addEventListener("click", hideModal);
    wrap.querySelector(".wallet-backdrop").addEventListener("click", hideModal);

    // buton clickleri
    wrap.querySelector("#wPhantom").addEventListener("click", connectPhantom);
    wrap.querySelector("#wSolflare").addEventListener("click", connectSolflare);
    wrap.querySelector("#wBackpack").addEventListener("click", connectBackpack);

    return wrap;
  }

  function showModal() {
    const m = ensureModal();
    m.classList.add("show");
    m.setAttribute("aria-hidden", "false");
  }
  function hideModal() {
    const m = $("#walletModal");
    if (!m) return;
    m.classList.remove("show");
    m.setAttribute("aria-hidden", "true");
  }

  // ------------------------------------------------------
  // Bağlantı durumu butona yaz
  // ------------------------------------------------------
  function setConnected(pk) {
    try { localStorage.setItem(LS_KEY, pk || ""); } catch {}
    if (connectBtn && pk) {
      connectBtn.textContent = pk.slice(0, 4) + "..." + pk.slice(-4);
    }
    hideModal();
  }

  // Global getter (isteğe bağlı)
  window.__zuzu_pubkey = () => {
    try { return localStorage.getItem(LS_KEY) || null; } catch { return null; }
  };

  // ------------------------------------------------------
  // Auto connect (geri dönüşte tetiklenir)
  // ------------------------------------------------------
  async function tryTrustedConnect() {
    // Phantom
    try {
      if (window.solana?.isPhantom && window.solana?.connect) {
        const res = await window.solana.connect({ onlyIfTrusted: true });
        if (res?.publicKey) return setConnected(res.publicKey.toString());
      }
    } catch (_) {}

    // Solflare (extension)
    try {
      if (window.solflare?.connect) {
        await window.solflare.connect();
        if (window.solflare?.publicKey)
          return setConnected(window.solflare.publicKey.toString());
    } } catch (_) {}

    // Backpack
    try {
      if (window.backpack?.connect) {
        const r = await window.backpack.connect();
        const pk = (r?.publicKey || r)?.toString?.() || r?.[0];
        if (pk) return setConnected(pk);
      }
    } catch (_) {}
  }

  // İlk yüklemede ve görünürlük geri gelince dene
  window.addEventListener("load", tryTrustedConnect);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) tryTrustedConnect();
  });

  // ------------------------------------------------------
  // ConnectBtn davranışı: önce modal aç
  // (extension varsa zaten modal içinden tek tıkla bağlayacağız)
  // ------------------------------------------------------
  connectBtn?.addEventListener("click", showModal);

  // ------------------------------------------------------
  // Sağlayıcılar
  // ------------------------------------------------------
  function phantomDeeplink() {
    const base = "https://phantom.app/ul/v1/connect";
    const q = new URLSearchParams({
      app_url: APP_ORIGIN,
      redirect_link: REDIRECT,
      cluster: "mainnet-beta"
    });
    return `${base}?${q.toString()}`;
  }
  function solflareDeeplink() {
    const base = "https://solflare.com/ul/v1/connect";
    const q = new URLSearchParams({
      app_url: APP_ORIGIN,
      redirect_link: REDIRECT,
      cluster: "solana"
    });
    return `${base}?${q.toString()}`;
  }
  function backpackDeeplink() {
    const base = "https://www.backpack.app/ul/v1/connect";
    const q = new URLSearchParams({
      app_url: APP_ORIGIN,
      redirect_link: REDIRECT
    });
    return `${base}?${q.toString()}`;
  }

  async function connectPhantom() {
    // Extension varsa direkt bağlan
    try {
      if (window.solana?.isPhantom && window.solana?.connect) {
        const res = await window.solana.connect({ onlyIfTrusted: false });
        if (res?.publicKey) return setConnected(res.publicKey.toString());
      }
    } catch (e) {
      console.warn("Phantom ext connect failed", e);
    }
    // Yoksa deeplink
    location.href = phantomDeeplink();
  }

  async function connectSolflare() {
    try {
      if (window.solflare?.connect) {
        await window.solflare.connect();
        if (window.solflare?.publicKey)
          return setConnected(window.solflare.publicKey.toString());
      }
    } catch (e) {
      console.warn("Solflare ext connect failed", e);
    }
    location.href = solflareDeeplink();
  }

  async function connectBackpack() {
    try {
      if (window.backpack?.connect) {
        const r = await window.backpack.connect();
        const pk = (r?.publicKey || r)?.toString?.() || r?.[0];
        if (pk) return setConnected(pk);
      }
    } catch (e) {
      console.warn("Backpack ext connect failed", e);
    }
    location.href = backpackDeeplink();
  }
})();
