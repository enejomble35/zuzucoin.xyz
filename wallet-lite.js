/* ------------------------------------------------------
   ZUZU — Solana Wallet Connect (Phantom / Solflare / Backpack)
   - Masaüstü: injected provider ile bağlan
   - Mobil: cüzdanın in-app browser’ına deeplink (browse) at,
            site wallet içi açılınca otomatik connect iste.
   - Bağlanınca "Connect Wallet" butonu kısaltılmış adres gösterir.
------------------------------------------------------ */

(function () {
  const APP_URL = "https://zuzucoin.xyz";               // kendi alan adın
  const EXPECT_FLAG = "__zuzu_expect_wallet";           // mobil dönüş işareti
  const CONNECTED_KEY = "__zuzu_pubkey";

  const $ = (sel) => document.querySelector(sel);

  const connectBtn = $("#connectBtn");
  const modal = document.createElement("div");
  modal.id = "walletModal";
  modal.className = "wallet-modal";
  modal.innerHTML = `
    <div class="wallet-backdrop" id="wmBackdrop"></div>
    <div class="wallet-box">
      <div class="wallet-head">
        <h3>Connect Wallet</h3>
        <button id="wmClose" class="wm-x" aria-label="Close">×</button>
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
    </div>
  `;
  document.body.appendChild(modal);

  const bPh = $("#wPhantom"), bSf = $("#wSolflare"), bBp = $("#wBackpack");
  const closeBtn = $("#wmClose");
  const backdrop = $("#wmBackdrop");

  const show = () => modal.classList.add("show");
  const hide = () => modal.classList.remove("show");

  closeBtn?.addEventListener("click", hide);
  backdrop?.addEventListener("click", hide);
  connectBtn?.addEventListener("click", show);

  function setConnected(pk) {
    if (!pk) return;
    localStorage.setItem(CONNECTED_KEY, pk);
    if (connectBtn) {
      connectBtn.textContent = pk.slice(0, 4) + "..." + pk.slice(-4);
      connectBtn.classList.add("connected");
    }
    hide();
  }

  // Sayfa tekrar açılmışsa kısa adresi geri yükle
  (function restore() {
    const pk = localStorage.getItem(CONNECTED_KEY);
    if (pk && connectBtn) {
      connectBtn.textContent = pk.slice(0, 4) + "..." + pk.slice(-4);
      connectBtn.classList.add("connected");
    }
  })();

  // ---- Masaüstü: injected provider ile bağlan
  async function connectInjected() {
    const prov =
      window.solana          ||               // Phantom / Backpack (çoğu)
      window.phantom?.solana ||               // eski phantom alias
      window.backpack?.solana||
      window.solflare;                        // Solflare injected

    if (!prov) return null;

    try {
      const res = await prov.connect({ onlyIfTrusted: false });
      const pk =
        res?.publicKey?.toString?.() ||
        prov.publicKey?.toString?.() ||
        res?.publicKey ||
        "";
      if (pk) setConnected(pk);
      return pk;
    } catch (e) {
      console.warn("Injected connect rejected", e);
      return null;
    }
  }

  // ---- Mobil: cüzdan uygulamasının in-app browser’ına geç
  function openInWallet(app) {
    // Bu yöntem gerçek "connect" handshake istemez;
    // app, bizim URL’yi kendi iç tarayıcısında açar → provider injected olur.
    // Dönünce sayfa otomatik connect dener (aşağıdaki autoConnect).
    localStorage.setItem(EXPECT_FLAG, "1");
    let link = "";
    if (app === "phantom")  link = `https://phantom.app/ul/browse/${location.host}`;
    if (app === "solflare") link = `https://solflare.com/ul/v1/browse/${location.host}`;
    if (app === "backpack") link = `https://backpack.app/ul/browse/${location.host}`;
    window.location.href = link;
  }

  // ---- Butonlar
  bPh?.addEventListener("click", async () => {
    const pk = await connectInjected();
    if (!pk) openInWallet("phantom");
  });
  bSf?.addEventListener("click", async () => {
    const pk = await connectInjected();
    if (!pk) openInWallet("solflare");
  });
  bBp?.addEventListener("click", async () => {
    const pk = await connectInjected();
    if (!pk) openInWallet("backpack");
  });

  // ---- Wallet içi açıldıysa otomatik connect dene
  async function autoConnect() {
    if (!localStorage.getItem(EXPECT_FLAG)) return;
    // wallet içindeki tarayıcıda provider gelir
    const prov =
      window.solana || window.phantom?.solana || window.backpack?.solana || window.solflare;
    if (!prov) return; // henüz hazır değilse bekle
    try {
      const res = await prov.connect({ onlyIfTrusted: false });
      const pk =
        res?.publicKey?.toString?.() || prov.publicKey?.toString?.() || res?.publicKey || "";
      if (pk) {
        setConnected(pk);
        localStorage.removeItem(EXPECT_FLAG);
      }
    } catch (e) {
      console.warn("autoConnect fail", e);
    }
  }
  // provider gelmesi gecikebilir; birkaç kez dene
  let tries = 0;
  const t = setInterval(() => {
    tries++;
    autoConnect();
    if (tries > 20) clearInterval(t);
  }, 600);

  // Dışarıya util: bağlı adresi isteyen diğer dosyalar için
  window.__zuzu_pk = () => localStorage.getItem(CONNECTED_KEY) || "";
})();
