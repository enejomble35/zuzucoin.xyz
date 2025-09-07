/* ======================================================
   ZUZUCOIN — Solana helpers (provider detect + flow)
   wallet-lite.js ile ortak çalışır
====================================================== */

(function(){
  const $ = s => document.querySelector(s);
  const LS_PK = "zuzu_pubkey";

  // -------- Sağlayıcılar --------
  function getProviders(){
    return {
      phantom : (window.solana && window.solana.isPhantom) ? window.solana : null,
      solflare: window.solflare || null,
      backpack: window.backpack || null
    };
  }

  function getStoredPk(){
    try { return localStorage.getItem(LS_PK) || null; } catch { return null; }
  }

  // wallet-lite sonrası public key’i oku
  function currentPubkey(){
    if (typeof window.__zuzu_pubkey === "function") {
      return window.__zuzu_pubkey() || getStoredPk();
    }
    return getStoredPk();
  }

  // -------- Event bağlama (adres değişirse butonu güncelle) --------
  function bindProviderEvents(){
    const { phantom, solflare, backpack } = getProviders();

    if (phantom?.on) {
      phantom.on("connect", () => updateBtn());
      phantom.on("disconnect", () => updateBtn());
      phantom.on("accountChanged", () => updateBtn());
    }
    if (solflare?.on) {
      solflare.on("connect", updateBtn);
      solflare.on("disconnect", updateBtn);
    }
    if (backpack?.on) {
      backpack.on("connect", updateBtn);
      backpack.on("disconnect", updateBtn);
    }
  }

  function setButton(pk){
    const btn = $("#connectBtn");
    if (!btn) return;
    if (pk) {
      btn.textContent = pk.slice(0,4)+"..."+pk.slice(-4);
      btn.classList.add("connected");
    } else {
      btn.textContent = btn.dataset.iLabel || "Connect Wallet";
      btn.classList.remove("connected");
    }
  }

  function updateBtn(){
    setButton(currentPubkey());
  }

  // -------- Bağlı mı? Değilse modal aç --------
  async function requireConnection(){
    const pk = currentPubkey();
    if (pk) { updateBtn(); return true; }
    // wallet-lite.js içindeki show modal tetikleme
    if (typeof window.openWalletModal === "function") {
      window.openWalletModal();         // eski helper varsa
    } else {
      const btn = $("#connectBtn");
      btn?.click();                     // yeni modal: buton click ile açılıyor
    }
    return false;
  }

  // -------- Satın alma başlatıcı (bilgi amaçlı) --------
  function startPurchase({qty, price, cost}){
    const pk = currentPubkey();
    if (!pk) { alert("Please connect your wallet first."); return; }

    // Burada gerçek SPL-USDT transferi/program çağrısı yapılabilir.
    // Şimdilik bilgilendirici mesaj + claim sürecine yönlendirme:
    alert(
      `Purchase summary\n\nWallet: ${pk}\nAmount: ${qty} ZUZU\nPrice: ${price} USDT\nTotal: ${cost} USDT\n\n` +
      `Complete the payment in your wallet. If you used a deeplink, you'll be redirected back automatically.\n`+
      `Your allocation will appear in the Claim Portal.`
    );
  }

  // -------- Başlat --------
  window.addEventListener("DOMContentLoaded", ()=>{
    bindProviderEvents();
    updateBtn();
    // Sayfa görünür olunca muhtemel auto-connect sonrası etiketi tazele
    document.addEventListener("visibilitychange", ()=>{
      if(!document.hidden) updateBtn();
    });
    console.log("ZUZUCOIN solana.v1 ready ✅");
  });

  // Dışarı ver
  window.ZUZU_SOL = {
    requireConnection,
    startPurchase,
    currentPubkey
  };
})();
