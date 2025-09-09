/* Wallet modal (final) – Phantom deep-link + Solflare/Backpack open-in-app */
(function () {
  const APP = "https://zuzucoin.xyz";

  function openModal() {
    const box = document.createElement("div");
    box.className = "wallet-modal";
    box.innerHTML = `
      <div class="wallet-backdrop" onclick="this.parentNode.remove()"></div>
      <div class="wallet-box">
        <button class="wm-close" id="wmClose">✕</button>
        <h3>Connect Wallet</h3>
        <div class="wallet-grid">
          <button class="wallet-item" id="wPhantom">
            <img src="assets/wallets/phantom.svg" onerror="this.src='assets/wallets/phantom.png'"><span>Phantom</span>
          </button>
          <a class="wallet-item"
             href="https://solflare.com/ul/v1/browse/${encodeURIComponent(APP)}"
             rel="noopener">
            <img src="assets/wallets/solflare.svg" onerror="this.src='assets/wallets/solflare.png'"><span>Solflare</span>
          </a>
          <a class="wallet-item"
             href="https://backpack.app/ul/browse/${encodeURIComponent(APP)}"
             rel="noopener">
            <img src="assets/wallets/backpack.svg" onerror="this.src='assets/wallets/backpack.png'"><span>Backpack</span>
          </a>
        </div>
        <p class="note">On mobile, the wallet opens. Approve <b>zuzucoin.xyz</b> and you’ll return here automatically.</p>
      </div>`;
    document.body.appendChild(box);
    document.getElementById("wmClose").onclick = ()=>box.remove();

    // Phantom: resmi deep-link connect akışı (phantom.dlink.js)
    document.getElementById("wPhantom").onclick = ()=>{
      if (!window.ZUZU_PHANTOM?.openConnect) {
        alert("Wallet script couldn’t be loaded. Please refresh.");
        return;
      }
      window.ZUZU_PHANTOM.openConnect();
    };
  }

  document.getElementById("connectBtn")?.addEventListener("click", openModal);

  // sayfa tekrar görünür olduğunda (wallet içinden geri dönüş) adresi restore et
  document.addEventListener("visibilitychange", ()=>{
    if (document.visibilityState === "visible") {
      window.ZUZU_PHANTOM?.restore?.();
    }
  });
})();
