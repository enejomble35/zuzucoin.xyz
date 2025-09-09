/* Phantom Deep-Link Connect (mobile)
 * - Creates ephemeral dapp keypair
 * - Opens Phantom connect URL with dapp_encryption_public_key + redirect_link
 * - On return, decrypts payload (public_key, session) and marks connected
 * Requires: tweetnacl + bs58 on page
 */

(function () {
  const LS_KEYS = {
    DAPP_SK: "ph_dapp_secret_key_b58",
    DAPP_PK: "ph_dapp_public_key_b58",
    SESSION: "ph_session_b58",
    PUBKEY: "ph_connected_address",
  };

  const bs58 = window.bs58;
  const nacl = window.nacl;

  function b58(s) { return bs58.encode(s); }
  function d58(s) { return bs58.decode(s); }

  function short(pk){ return pk.slice(0,4) + "..." + pk.slice(-4); }
  function setConnected(addr){
    localStorage.setItem(LS_KEYS.PUBKEY, addr);
    const btn = document.getElementById("connectBtn");
    if (btn) {
      btn.textContent = short(addr);
      btn.classList.add("connected");
      btn.dataset.address = addr;
    }
    // modal kapat
    document.querySelector(".wallet-modal")?.remove();
  }

  // 1) “Connect” için Phantom’a gidiş linkini hazırla ve aç
  function openPhantomConnect() {
    // ephemeral dapp keypair
    const kp = nacl.box.keyPair();
    const dappPkB58 = b58(kp.publicKey);
    const dappSkB58 = b58(kp.secretKey);

    localStorage.setItem(LS_KEYS.DAPP_PK, dappPkB58);
    localStorage.setItem(LS_KEYS.DAPP_SK, dappSkB58);

    const appUrl = "https://zuzucoin.xyz";
    const redirect = window.location.href.split('#')[0].split('?')[0]; // temiz
    const url =
      "https://phantom.app/ul/v1/connect" +
      "?app_url=" + encodeURIComponent(appUrl) +
      "&dapp_encryption_public_key=" + encodeURIComponent(dappPkB58) +
      "&redirect_link=" + encodeURIComponent(redirect) +
      "&cluster=mainnet-beta";

    // gerçek anchor ile aç (bloklanmasın)
    const a = document.createElement("a");
    a.href = url;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // 2) Phantom dönüşünü yakala → decrypt et
  function handleReturnIfPresent() {
    const p = new URLSearchParams(window.location.search);
    const encPk = p.get("phantom_encryption_public_key");
    const data = p.get("data");
    const nonce = p.get("nonce");
    const errorCode = p.get("errorCode");

    if (errorCode) {
      // kullanıcı iptal etmiş olabilir; query’yi temizleyip çık
      history.replaceState({}, "", window.location.pathname);
      return;
    }
    if (!encPk || !data || !nonce) return;

    try {
      const dappSkB58 = localStorage.getItem(LS_KEYS.DAPP_SK);
      if (!dappSkB58) throw new Error("Missing dapp secret key");

      const dappSk = d58(dappSkB58);
      const phantomPk = d58(encPk);
      const shared = nacl.box.before(phantomPk, dappSk);

      const decrypted = nacl.box.open.after(d58(data), d58(nonce), shared);
      if (!decrypted) throw new Error("Cannot decrypt payload");

      const payload = JSON.parse(new TextDecoder().decode(decrypted));
      // payload: { public_key: base58, session: base58 }
      const addr = payload.public_key;
      const session = payload.session;

      localStorage.setItem(LS_KEYS.SESSION, session);
      setConnected(addr);
    } catch (e) {
      console.warn("Phantom return parse failed:", e);
      alert("Wallet script couldn’t be loaded. Please refresh.");
    } finally {
      // query’yi temizle
      history.replaceState({}, "", window.location.pathname);
      // ephemeral anahtarları temizle (güvenlik)
      localStorage.removeItem(LS_KEYS.DAPP_PK);
      localStorage.removeItem(LS_KEYS.DAPP_SK);
    }
  }

  // 3) Sayfa yenilendiğinde session varsa butonu bağlı göster
  function restoreSession() {
    const addr = localStorage.getItem(LS_KEYS.PUBKEY);
    if (addr) setConnected(addr);
  }

  // dışa aç
  window.ZUZU_PHANTOM = {
    openConnect: openPhantomConnect,
    restore: restoreSession,
    handleReturn: handleReturnIfPresent,
  };

  // İlk yüklemede dönüşü kontrol et + session’ı geri yükle
  window.addEventListener("load", () => {
    handleReturnIfPresent();
    restoreSession();
  });
})();
