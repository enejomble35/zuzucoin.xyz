/* =========================================================
   Solana Wallet Modal + Deep Link Connector
   Wallets: Phantom, Solflare, Backpack
   - Desktop: injected provider ile connect()
   - Mobile: universal link; dönüşte onlyIfTrusted:true ile auto-connect
   - Invite helpers: window.__zuzu_pubkey(), window.__zuzu_invite()
========================================================= */
(function () {
  const APP_URL = "https://zuzucoin.xyz";
  const $ = (s, r = document) => r.querySelector(s);

  let pubkey = null;

  /* ---------------- Modal UI ---------------- */
  function ensureModal() {
    let m = $("#walletModal");
    if (m) return m;
    m = document.createElement("div");
    m.id = "walletModal";
    m.className = "wallet-modal";
    m.setAttribute("aria-hidden", "true");
    m.innerHTML = `
      <div class="wm-backdrop"></div>
      <div class="wm-box">
        <div class="wm-head">
          <h3>Connect Wallet</h3>
          <button id="wmClose" aria-label="Close">✕</button>
        </div>
        <div class="wm-list">
          <button class="wm-item" id="wPhantom">
            <img src="assets/wallets/phantom.svg" alt="Phantom" loading="lazy"><span>Phantom</span>
          </button>
          <button class="wm-item" id="wSolflare">
            <img src="assets/wallets/solflare.svg" alt="Solflare" loading="lazy"><span>Solflare</span>
          </button>
          <button class="wm-item" id="wBackpack">
            <img src="assets/wallets/backpack.svg" alt="Backpack" loading="lazy"><span>Backpack</span>
          </button>
        </div>
        <p class="wm-note">If the app opens, approve <b>zuzucoin.xyz</b> to connect. You’ll be redirected back automatically.</p>
      </div>`;
    document.body.appendChild(m);
    m.querySelector("#wmClose").addEventListener("click", hide);
    m.querySelector(".wm-backdrop").addEventListener("click", hide);
    return m;
  }
  function show() {
    const m = ensureModal();
    m.classList.add("show");
    m.setAttribute("aria-hidden", "false");
  }
  function hide() {
    const m = $("#walletModal");
    if (!m) return;
    m.classList.remove("show");
    m.setAttribute("aria-hidden", "true");
  }
  window.openWalletModal = show;

  function setConnected(pk) {
    pubkey = pk || null;
    try { localStorage.setItem("zuzu_pubkey", pubkey || ""); } catch {}
    const btn = $("#connectBtn");
    if (btn) {
      const lbl = btn.dataset.iLabel || "Connect Wallet";
      if (pubkey) {
        btn.textContent = pubkey.slice(0, 4) + "..." + pubkey.slice(-4);
        btn.classList.add("connected");
      } else {
        btn.textContent = lbl;
        btn.classList.remove("connected");
      }
    }
    if (pubkey) hide();
  }
  window.__zuzu_pubkey = () => pubkey || localStorage.getItem("zuzu_pubkey") || null;
  window.__zuzu_invite = () => {
    const pk = window.__zuzu_pubkey && window.__zuzu_pubkey();
    return pk ? `${APP_URL}/?ref=${encodeURIComponent(pk)}` : "";
  };

  /* --------- Auto-trusted connect (desktop & mobile dönüş) --------- */
  async function tryTrustedConnect() {
    // Phantom
    try {
      if (window.solana?.isPhantom) {
        const r = await window.solana.connect({ onlyIfTrusted: true });
        if (r?.publicKey) return setConnected(r.publicKey.toString());
      }
    } catch {}
    // Solflare
    try {
      if (window.solflare?.connect) {
        await window.solflare.connect({ onlyIfTrusted: true });
        if (window.solflare?.publicKey) return setConnected(window.solflare.publicKey.toString());
      }
    } catch {}
    // Backpack
    try {
      if (window.backpack?.connect) {
        const r = await window.backpack.connect({ onlyIfTrusted: true });
        const pk = (r?.publicKey || r)?.toString?.();
        if (pk) return setConnected(pk);
      }
    } catch {}
    return null;
  }

  ["load", "pageshow", "focus", "visibilitychange"].forEach(ev => {
    window.addEventListener(ev, () => {
      if (ev === "visibilitychange" && document.hidden) return;
      tryTrustedConnect();
    }, { passive: true });
  });

  /* ---------------- Deep links (mobile) ---------------- */
  // Bazı cüzdanlar "redirect_link", bazıları "redirect_url" bekliyor → ikisini de ekliyoruz.
  function deepQuery() {
    const red = encodeURIComponent(APP_URL);
    const app = encodeURIComponent(APP_URL);
    const common = `app_url=${app}&redirect_link=${red}&redirect_url=${red}&dapp_enforce=1&with_redirect=1&open_in_wallet=1&cluster=mainnet-beta`;
    return common;
  }
  function deepLink(kind) {
    const q = deepQuery();
    if (kind === "phantom")  return `https://phantom.app/ul/v1/connect?${q}`;
    if (kind === "solflare") return `https://solflare.com/ul/v1/connect?${q}`;
    if (kind === "backpack") return `https://backpack.app/ul/v1/connect?${q}`;
    return "#";
  }

  /* ---------------- Clicks ---------------- */
  function wire() {
    $("#connectBtn")?.addEventListener("click", e => { e.preventDefault(); show(); });

    $("#wPhantom")?.addEventListener("click", async () => {
      try {
        if (window.solana?.isPhantom) {
          const r = await window.solana.connect();
          return setConnected(r?.publicKey?.toString());
        }
      } catch {}
      window.location.href = deepLink("phantom");
    });

    $("#wSolflare")?.addEventListener("click", async () => {
      try {
        if (window.solflare?.connect) {
          await window.solflare.connect();
          return setConnected(window.solflare?.publicKey?.toString());
        }
      } catch {}
      window.location.href = deepLink("solflare");
    });

    $("#wBackpack")?.addEventListener("click", async () => {
      try {
        if (window.backpack?.connect) {
          const r = await window.backpack.connect();
          const pk = (r?.publicKey || r)?.toString?.();
          if (pk) return setConnected(pk);
        }
      } catch {}
      window.location.href = deepLink("backpack");
    });
  }

  window.addEventListener("DOMContentLoaded", wire);

  /* --------- Ref param yakalama (davet) --------- */
  (function captureRef() {
    try {
      const p = new URLSearchParams(location.search);
      const ref = p.get("ref");
      if (ref) localStorage.setItem("zuzu_ref_from", ref);
    } catch {}
  })();
})();
