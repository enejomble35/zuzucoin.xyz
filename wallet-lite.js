/* ===========================================
   ZUZU – Wallet modal (Phantom / Solflare / Backpack)
   Mobile: cüzdanın in-app browser’ında aç → injected provider ile bağlan
   Desktop: extension varsa direkt bağlan
   Auto-retry: görünür olunca 10s boyunca dene
=========================================== */
(function () {
  const APP_URL = "https://zuzucoin.xyz";
  const LS_KEY = "zuzu_last_wallet";
  const RETRY_MS = 600, RETRY_FOR = 10000;

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const DL = {
    // CÜZDAN İÇİNDE SİTEYİ AÇ (browse)
    phantomBrowse:  "https://phantom.app/ul/browse/"   + encodeURIComponent(APP_URL),
    solflareBrowse: "https://solflare.com/ul/v1/browse/" + encodeURIComponent(APP_URL),
    backpackBrowse: "https://backpack.app/ul/browse/"  + encodeURIComponent(APP_URL),
  };

  function setConnected(pk) {
    const btn = document.getElementById("connectBtn");
    if (btn) {
      btn.textContent = pk.slice(0, 4) + "..." + pk.slice(-4);
      btn.classList.add("connected");
    }
    document.querySelector(".wallet-modal")?.remove();
  }

  /* ---------- injected tries ---------- */
  async function tryPhantom(trusted = true) {
    try {
      const p = window.solana || window?.phantom?.solana;
      if (!p || !p.isPhantom) return false;
      const res = await p.connect({ onlyIfTrusted: !!trusted });
      if (res?.publicKey) { setConnected(res.publicKey.toString()); return true; }
    } catch (_) {}
    return false;
  }
  async function trySolflare(trusted = true) {
    try {
      const s = window.solflare;
      if (!s?.connect) return false;
      await s.connect();
      const pk = s?.publicKey?.toString?.();
      if (pk) { setConnected(pk); return true; }
    } catch (_) {}
    return false;
  }
  async function tryBackpack(trusted = true) {
    try {
      const b = window.backpack;
      if (!b?.connect) return false;
      const r = await b.connect();
      const pk = r?.publicKey?.toString?.() || r?.[0];
      if (pk) { setConnected(pk); return true; }
    } catch (_) {}
    return false;
  }

  async function autoRetry() {
    const target = localStorage.getItem(LS_KEY);
    if (!target) return;
    const start = Date.now();
    const step = async () => {
      let ok = false;
      if (target === "phantom")  ok = await tryPhantom(true);
      if (target === "solflare") ok = await trySolflare(true);
      if (target === "backpack") ok = await tryBackpack(true);
      if (ok) { localStorage.removeItem(LS_KEY); return; }
      if (Date.now() - start < RETRY_FOR) setTimeout(step, RETRY_MS);
    };
    step();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") autoRetry();
  });
  window.addEventListener("load", autoRetry);

  /* ---------- open modal ---------- */
  function openWalletModal() {
    const el = document.createElement("div");
    el.className = "wallet-modal";
    el.innerHTML = `
      <div class="wallet-backdrop" onclick="this.parentNode.remove()"></div>
      <div class="wallet-box">
        <h3>Connect Wallet</h3>
        <div class="wallet-grid">

          <button class="wallet-item" id="wPhantom">
            <img src="assets/wallets/phantom.svg"
                 onerror="this.onerror=null;this.src='assets/wallets/phantom.png'" alt="Phantom">
            <span>Phantom</span>
          </button>

          <button class="wallet-item" id="wSolflare">
            <img src="assets/wallets/solflare.svg"
                 onerror="this.onerror=null;this.src='assets/wallets/solflare.png'" alt="Solflare">
            <span>Solflare</span>
          </button>

          <button class="wallet-item" id="wBackpack">
            <img src="assets/wallets/backpack.svg"
                 onerror="this.onerror=null;this.src='assets/wallets/backpack.png'" alt="Backpack">
            <span>Backpack</span>
          </button>

        </div>
        <p class="note">
          On mobile, the site will open inside the wallet. Approve <b>zuzucoin.xyz</b> and you'll be connected.
        </p>
      </div>`;
    document.body.appendChild(el);

    // Her butonda: 1) extension/injected varsa bağlan  2) değilse cüzdanın BROWSE deeplink’ine git
    document.getElementById("wPhantom").onclick = async () => {
      localStorage.setItem(LS_KEY, "phantom");
      if (await tryPhantom(false)) return;
      window.location.href = DL.phantomBrowse;
    };
    document.getElementById("wSolflare").onclick = async () => {
      localStorage.setItem(LS_KEY, "solflare");
      if (await trySolflare(false)) return;
      window.location.href = DL.solflareBrowse;
    };
    document.getElementById("wBackpack").onclick = async () => {
      localStorage.setItem(LS_KEY, "backpack");
      if (await tryBackpack(false)) return;
      window.location.href = DL.backpackBrowse;
    };
  }

  // butona bağla
  document.getElementById("connectBtn")?.addEventListener("click", openWalletModal);

  // Eğer zaten wallet webview’inde açıldıysak otomatik bağlanmayı dene
  window.addEventListener("load", async () => {
    // Phantom/Solflare/Backpack webview’lerinde injected provider mevcut oluyor
    if (await tryPhantom(true)) return;
    if (await trySolflare(true)) return;
    await tryBackpack(true);
  });
})();
