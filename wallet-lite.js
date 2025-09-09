/* Wallet modal – Phantom deep-link + Solflare/Backpack open-in-app */
(function () {
  function openModal() {
    const box = document.createElement("div");
    box.className = "wallet-modal";
    box.innerHTML = `
      <div class="wallet-backdrop"></div>
      <div class="wallet-box">
        <button class="wm-close" id="wmClose" aria-label="Close">✕</button>
        <h3>Connect Wallet</h3>
        <div class="wallet-grid">
          <button class="wallet-item" id="wPhantom">
            <img src="assets/wallets/phantom.svg" onerror="this.src='assets/wallets/phantom.png'"><span>Phantom</span>
          </button>
          <button class="wallet-item" id="wSolflare">
            <img src="assets/wallets/solflare.svg" onerror="this.src='assets/wallets/solflare.png'"><span>Solflare</span>
          </button>
          <button class="wallet-item" id="wBackpack">
            <img src="assets/wallets/backpack.svg" onerror="this.src='assets/wallets/backpack.png'"><span>Backpack</span>
          </button>
        </div>
        <p class="note">On mobile, the wallet opens. Approve <b>zuzucoin.xyz</b> and you'll return here automatically.</p>
      </div>`;
    document.body.appendChild(box);

    // kapatma
    document.getElementById("wmClose").onclick = ()=>box.remove();
    box.querySelector(".wallet-backdrop").onclick = ()=>box.remove();

    // butonlar
    document.getElementById("wPhantom").onclick = ()=>{
      if (window.ZUZU_PHANTOM?.openConnect) window.ZUZU_PHANTOM.openConnect();
      else alert("Wallet module not loaded.");
    };
    document.getElementById("wSolflare").onclick = ()=>{
      window.ZUZU_SOLFLARE?.openApp ? window.ZUZU_SOLFLARE.openApp() : alert("Wallet module not loaded.");
    };
    document.getElementById("wBackpack").onclick = ()=>{
      window.ZUZU_BACKPACK?.openApp ? window.ZUZU_BACKPACK.openApp() : alert("Wallet module not loaded.");
    };
  }

  // ana buton
  document.getElementById("connectBtn")?.addEventListener("click", openModal);

  // geri dönünce olası injected bağlantıları dener
  document.addEventListener("visibilitychange", ()=>{
    if (document.visibilityState!=="visible") return;
    window.ZUZU_PHANTOM?.restore?.();
    window.ZUZU_SOLFLARE?.tryInjectedConnect?.();
    window.ZUZU_BACKPACK?.tryInjectedConnect?.();
  });
})();
