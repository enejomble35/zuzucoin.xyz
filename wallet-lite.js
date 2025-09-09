/* ZUZU Wallet (final-anchors)
   - Mobil: gerçek <a href> deep link (bloklanmaz)
   - Phantom/Backpack/Solflare installed → app açılır
   - Yoksa: Play Store / web mağaza fallback
   - Dönüşte injected bağlanmayı denemek için app.v1.js bu olayı dinler
*/
(function () {
  const APP_URL = "https://zuzucoin.xyz";
  const BTN_ID = "connectBtn";

  function byId(id){ return document.getElementById(id); }
  function short(pk){ return pk.slice(0,4)+"..."+pk.slice(-4); }
  function setConnected(pk){
    const b = byId(BTN_ID);
    if(b){ b.textContent = short(pk); b.classList.add("connected"); b.dataset.address = pk; }
    document.querySelector(".wallet-modal")?.remove();
    localStorage.removeItem("z_last_wallet");
  }

  // injected bağlanma (wallet webview’e geri dönünce)
  async function tryInjectedOnce(){
    try{
      const p = window.solana || window?.phantom?.solana;
      if(p?.isPhantom){
        const r = await p.connect({ onlyIfTrusted:false });
        if(r?.publicKey) return setConnected(r.publicKey.toString());
      }
    }catch{}
    try{
      const s = window.solflare;
      if(s?.connect){
        await s.connect();
        const pk = s?.publicKey?.toString?.();
        if(pk) return setConnected(pk);
      }
    }catch{}
    try{
      const b = window.backpack;
      if(b?.connect){
        const r = await b.connect();
        const pk = r?.publicKey?.toString?.() || r?.[0];
        if(pk) return setConnected(pk);
      }
    }catch{}
  }

  // gerçek anchor’lar ile modal
  function openModal(){
    const ret = encodeURIComponent(window.location.href);
    const box = document.createElement("div");
    box.className = "wallet-modal";
    box.innerHTML = `
      <div class="wallet-backdrop" onclick="this.parentNode.remove()"></div>
      <div class="wallet-box">
        <h3>Connect Wallet</h3>
        <div class="wallet-grid">
          <a class="wallet-item" id="phLink"
             href="https://phantom.app/ul/v1/connect?app_url=${encodeURIComponent(APP_URL)}&redirect_link=${ret}"
             rel="noopener">
            <img src="assets/wallets/phantom.svg" onerror="this.src='assets/wallets/phantom.png'"><span>Phantom</span>
          </a>
          <a class="wallet-item" id="sfLink"
             href="https://solflare.com/ul/v1/browse/${encodeURIComponent(APP_URL)}"
             rel="noopener">
            <img src="assets/wallets/solflare.svg" onerror="this.src='assets/wallets/solflare.png'"><span>Solflare</span>
          </a>
          <a class="wallet-item" id="bpLink"
             href="https://backpack.app/ul/browse/${encodeURIComponent(APP_URL)}"
             rel="noopener">
            <img src="assets/wallets/backpack.svg" onerror="this.src='assets/wallets/backpack.png'"><span>Backpack</span>
          </a>
        </div>
        <p class="note">On mobile the wallet opens. Approve <b>zuzucoin.xyz</b>; you’ll be redirected back automatically.</p>
        <button class="wm-close" id="wmClose">✕</button>
      </div>`;
    document.body.appendChild(box);
    document.getElementById("wmClose").onclick = ()=>box.remove();

    // store fallback (uygulama yoksa)
    document.getElementById("phLink").addEventListener("click", ()=>{
      localStorage.setItem("z_last_wallet","phantom");
      setTimeout(()=>{
        if(document.visibilityState === "visible"){
          window.location.href = "https://play.google.com/store/apps/details?id=app.phantom";
        }
      }, 1600);
    });
    document.getElementById("sfLink").addEventListener("click", ()=>{
      localStorage.setItem("z_last_wallet","solflare");
      setTimeout(()=>{
        if(document.visibilityState === "visible"){
          window.location.href = "https://play.google.com/store/apps/details?id=com.solflare.mobile";
        }
      }, 1600);
    });
    document.getElementById("bpLink").addEventListener("click", ()=>{
      localStorage.setItem("z_last_wallet","backpack");
      setTimeout(()=>{
        if(document.visibilityState === "visible"){
          window.location.href = "https://play.google.com/store/apps/details?id=app.backpack";
        }
      }, 1600);
    });
  }

  // Connect butonu
  document.getElementById(BTN_ID)?.addEventListener("click", ()=>{
    openModal();
  });

  // Wallet’tan dönünce injected ile yakala
  document.addEventListener("visibilitychange", async ()=>{
    if(document.visibilityState === "visible"){
      await tryInjectedOnce();
    }
  });

  // sayfa yüklenir yüklenmez (wallet webview inside) bağlanmayı dene
  window.addEventListener("load", ()=>{
    if(localStorage.getItem("z_last_wallet")) tryInjectedOnce();
  });

  // Dışarı açmak isteyenler için
  window.ZUZU_WALLET = { open: openModal, setConnected };
})();
