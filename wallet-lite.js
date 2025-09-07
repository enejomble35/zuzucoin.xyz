/* ===== Lightweight Solana wallet connector =====
   - Phantom / Solflare / Backpack
   - Eklenti varsa: window.solana / window.solflare / window.backpack -> connect()
   - Yoksa: deeplink ile uyg. aç -> redirect back to zuzucoin.xyz
================================================= */

(function(){
  const CONF = window.ZUZU_CONFIG || {};
  let pubkey = null;

  // Modal
  const modal  = document.getElementById("walletModal");
  const closeB = document.getElementById("wmClose");
  const bPh    = document.getElementById("wPhantom");
  const bSf    = document.getElementById("wSolflare");
  const bBp    = document.getElementById("wBackpack");
  const connectBtn = document.getElementById("connectBtn");

  function show(){ modal?.classList.add("show"); modal?.setAttribute("aria-hidden","false"); }
  function hide(){ modal?.classList.remove("show"); modal?.setAttribute("aria-hidden","true"); }
  window.openWalletModal = show;
  closeB?.addEventListener("click", hide);
  modal?.addEventListener("click", e=>{ if(e.target===modal) hide(); });

  const APP_URL = "https://zuzucoin.xyz";
  const returnTo = () => window.location.href.split('#')[0];

  /* ------- Connect helpers ------- */
  async function connectPhantom(){
    try{
      if (window.solana?.isPhantom) {
        const res = await window.solana.connect({ onlyIfTrusted:false });
        pubkey = res.publicKey?.toString();
        afterConnected("Phantom");
        return;
      }
    }catch(e){ console.warn(e); }
    // Deeplink
    const link = "https://phantom.app/ul/v1/connect?app_url="
      + encodeURIComponent(APP_URL)
      + "&dapp_encryption_public_key=&redirect_link="
      + encodeURIComponent(returnTo());
    window.location.href = link;
  }

  async function connectSolflare(){
    try{
      if (window.solflare?.connect) {
        await window.solflare.connect();
        pubkey = window.solflare.publicKey?.toString();
        afterConnected("Solflare");
        return;
      }
    }catch(e){ console.warn(e); }
    const link = "https://solflare.com/ul/v1/connect?url="
      + encodeURIComponent(APP_URL)
      + "&redirect="
      + encodeURIComponent(returnTo());
    window.location.href = link;
  }

  async function connectBackpack(){
    try{
      if (window.backpack?.connect) {
        const accs = await window.backpack.connect();
        pubkey = (accs?.publicKey || accs)?.toString?.() || accs?.[0];
        afterConnected("Backpack");
        return;
      }
    }catch(e){ console.warn(e); }
    // backpack deeplink basit yönlendirme
    window.location.href = "https://www.backpack.app/download";
  }

  function afterConnected(providerName){
    hide();
    if(connectBtn && pubkey){
      connectBtn.textContent = pubkey.slice(0,4)+"..."+pubkey.slice(-4);
    }
    console.log("Connected via", providerName, pubkey);
  }

  bPh?.addEventListener("click", connectPhantom);
  bSf?.addEventListener("click", connectSolflare);
  bBp?.addEventListener("click", connectBackpack);

  /* ------- Presale Buy (SOL veya USDT-SPL) ------- */
  window.solanaPresaleBuy = async function({quantity, payment, price}){
    // Bu demo fonksiyon gerçek transfer/ATA yaratma vb. yapmaz.
    // Ama akışı doğru yönetir: cüzdan bağlı değilse bağlatır,
    // bağlıysa onay bilgisini gösterir.

    if(!pubkey){
      // modal aç, kullanıcı cüzdan seçsin
      show();
      throw new Error("WALLET_NOT_CONNECTED");
    }

    const costUSDT = quantity * (price || CONF.presalePrice);
    const payType = (payment === "USDT") ? "USDT (SPL)" : "SOL";

    alert(
      `Wallet: ${pubkey}\n` +
      `Amount: ${quantity} ${CONF.tokenSymbol}\n` +
      `Payment: ${payType}\n` +
      `Est. cost: ${costUSDT.toFixed(2)} USDT (ref)\n\n` +
      `Demo akış: gerçek transfer için on-chain program/endpoint gerekir.`
    );

    // Burada gerçekleyeceğin işlem:
    // - SOL ödemesi: transfer to CONF.ownerSol
    // - USDT(SPL): token programı ile transfer (mint/ATA)
    // Not: Bu repo statik olduğu için, gerçek işlemi sunucu/SDK ile bağlaman gerekir.
  };

})();
