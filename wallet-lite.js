/* =========================
   WALLET MODAL (Phantom / Solflare / Backpack)
   - Mobile deeplink + return auto-connect (visibilitychange + retry)
   - Desktop: injected provider ile direkt connect
========================= */
(function () {
  const APP_URL = "https://zuzucoin.xyz";
  const LS_KEY = "zuzu_last_wallet"; // 'phantom' | 'solflare' | 'backpack'
  const RETRY_MS = 500;
  const RETRY_FOR = 10000; // 10s

  let pubkey = null;

  function setConnected(pk) {
    pubkey = pk;
    const btn = document.getElementById("connectBtn");
    if (btn) {
      btn.textContent = pk.slice(0, 4) + "..." + pk.slice(-4);
      btn.classList.add("connected");
    }
    document.querySelector(".wallet-modal")?.remove();
  }

  /* ---------- injected connect helpers ---------- */
  async function tryConnectInjectedPhantom(trusted = true) {
    try {
      const p = window.solana || window?.phantom?.solana;
      if (!p || !p.isPhantom) return false;
      const res = await p.connect({ onlyIfTrusted: trusted ? true : false });
      if (res?.publicKey) {
        setConnected(res.publicKey.toString());
        return true;
      }
    } catch (e) {}
    return false;
  }
  async function tryConnectInjectedSolflare(trusted = true) {
    try {
      const s = window.solflare;
      if (!s || !s.connect) return false;
      await s.connect();
      const pk = s?.publicKey?.toString?.();
      if (pk) {
        setConnected(pk);
        return true;
      }
    } catch (e) {}
    return false;
  }
  async function tryConnectInjectedBackpack(trusted = true) {
    try {
      const b = window.backpack;
      if (!b || !b.connect) return false;
      const r = await b.connect();
      const pk = r?.publicKey?.toString?.() || r?.[0];
      if (pk) {
        setConnected(pk);
        return true;
      }
    } catch (e) {}
    return false;
  }

  /* ---------- auto-connect on return ---------- */
  async function autoConnectRetry() {
    const choice = localStorage.getItem(LS_KEY);
    if (!choice) return;

    const start = Date.now();
    const tick = async () => {
      const elapsed = Date.now() - start;
      let ok = false;
      if (choice === "phantom") ok = await tryConnectInjectedPhantom(true);
      else if (choice === "solflare") ok = await tryConnectInjectedSolflare(true);
      else if (choice === "backpack") ok = await tryConnectInjectedBackpack(true);

      if (ok) {
        localStorage.removeItem(LS_KEY);
        return;
      }
      if (elapsed < RETRY_FOR) setTimeout(tick, RETRY_MS);
    };
    tick();
  }

  // Sayfa görünür olunca tekrar dene (wallet'tan dönünce tetiklenir)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") autoConnectRetry();
  });
  // İlk yüklemede de dener
  window.addEventListener("load", autoConnectRetry);

  /* ---------- deeplink launchers ---------- */
  function launchPhantomDeeplink() {
    localStorage.setItem(LS_KEY, "phantom");
    const url =
      "https://phantom.app/ul/v1/connect" +
      "?app_url=" +
      encodeURIComponent(APP_URL) +
      "&redirect_link=" +
      encodeURIComponent(APP_URL);
    window.location.href = url;
  }
  function launchSolflareDeeplink() {
    localStorage.setItem(LS_KEY, "solflare");
    const url =
      "https://solflare.com/ul/v1/connect" +
      "?app_url=" +
      encodeURIComponent(APP_URL) +
      "&redirect_link=" +
      encodeURIComponent(APP_URL);
    window.location.href = url;
  }
  function launchBackpackDeeplink() {
    localStorage.setItem(LS_KEY, "backpack");
    const url =
      "https://backpack.app/ul/v1/connect" +
      "?app_url=" +
      encodeURIComponent(APP_URL) +
      "&redirect_link=" +
      encodeURIComponent(APP_URL);
    window.location.href = url;
  }

  /* ---------- main modal ---------- */
  function openWalletModal() {
    const modal = document.createElement("div");
    modal.className = "wallet-modal";
    modal.innerHTML = `
      <div class="wallet-backdrop" onclick="this.parentNode.remove()"></div>
      <div class="wallet-box">
        <h3>Connect Wallet</h3>
        <div class="wallet-grid">

          <button class="wallet-item" id="wPhantom">
            <img src="assets/wallets/phantom.svg"
                 onerror="this.onerror=null;this.src='assets/wallets/phantom.png'"
                 alt="Phantom">
            <span>Phantom</span>
          </button>

          <button class="wallet-item" id="wSolflare">
            <img src="assets/wallets/solflare.svg"
                 onerror="this.onerror=null;this.src='assets/wallets/solflare.png'"
                 alt="Solflare">
            <span>Solflare</span>
          </button>

          <button class="wallet-item" id="wBackpack">
            <img src="assets/wallets/backpack.svg"
                 onerror="this.onerror=null;this.src='assets/wallets/backpack.png'"
                 alt="Backpack">
            <span>Backpack</span>
          </button>

        </div>
        <p class="note">
          If the app opens, approve <b>zuzucoin.xyz</b> to connect.<br>
          You’ll be redirected back automatically.
        </p>
      </div>`;
    document.body.appendChild(modal);

    // Button handlers: önce web extension dene, olmazsa deeplink
    document.getElementById("wPhantom").onclick = async () => {
      const ok = await tryConnectInjectedPhantom(false);
      if (!ok) launchPhantomDeeplink();
    };
    document.getElementById("wSolflare").onclick = async () => {
      const ok = await tryConnectInjectedSolflare(false);
      if (!ok) launchSolflareDeeplink();
    };
    document.getElementById("wBackpack").onclick = async () => {
      const ok = await tryConnectInjectedBackpack(false);
      if (!ok) launchBackpackDeeplink();
    };
  }

  // public export
  window.openWalletModal = openWalletModal;

  // connect button bağla
  document.getElementById("connectBtn")?.addEventListener("click", openWalletModal);
})();
