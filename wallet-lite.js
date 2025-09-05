(function () {
  // Bu dosya SADECE "connect" işini çözer. Web3/SPL beklemez.

  // Kısa yazdırma
  function short(base58) { return base58 ? base58.slice(0,4) + "..." + base58.slice(-4) : ""; }

  // Status yazdır (varsa)
  function setStatus(t) {
    try { var s = document.getElementById("solanaStatus"); if (s) s.textContent = "Durum: " + t; } catch(e){}
  }

  // Bağlı etiketi
  function setConnectLabel(text) {
    if (typeof window.__zuzuSetConnectLabel === "function") window.__zuzuSetConnectLabel(text);
    else { var b = document.getElementById("connectBtn"); if (b) b.textContent = text || "Connect Wallet"; }
  }

  // Davet linki üret
  function setReferral(addr) {
    if (typeof window.__zuzuSetReferral === "function") window.__zuzuSetReferral(addr);
    try {
      if (addr) localStorage.setItem("zuzu_ref_last", addr);
    } catch(e){}
  }

  // Cüzdan tespiti
  function detectWallet() {
    if (window.phantom && window.phantom.solana) return window.phantom.solana;
    if (window.solana && (window.solana.isPhantom || window.solana.isBackpack)) return window.solana;
    if (window.solflare && window.solflare.isSolflare) return window.solflare;
    if (window.backpack && window.backpack.solana) return window.backpack.solana;
    return null;
  }

  // Global durum
  var adapter = null;
  var pubkey  = null;

  // HIZLI CONNECT — kütüphane gerekmez
  function quickConnect() {
    try {
      adapter = detectWallet();
      if (!adapter) {
        setStatus("Cüzdan bulunamadı (Phantom/Solflare/Backpack kur).");
        // Kullanıcıya kurulum yolu açalım
        window.open("https://phantom.app/download", "_blank");
        return;
      }
      // Bazı cüzdanlar bağlanmış olabilir:
      if (adapter.isConnected && adapter.publicKey) {
        pubkey = adapter.publicKey;
        setStatus("Bağlandı");
        setConnectLabel(short(pubkey.toString ? pubkey.toString() : String(pubkey)));
        setReferral(pubkey.toString ? pubkey.toString() : String(pubkey));
        // Paylaş: diğer dosyalar da kullansın
        window.__zuzuWallet = { adapter: adapter, publicKey: pubkey };
        return;
      }
      // Normal bağlantı
      adapter.connect().then(function (res) {
        var pk = (res && res.publicKey) ? res.publicKey : adapter.publicKey;
        pubkey = pk;
        setStatus("Bağlandı");
        var b58 = pk.toString ? pk.toString() : String(pk);
        setConnectLabel(short(b58));
        setReferral(b58);
        window.__zuzuWallet = { adapter: adapter, publicKey: pk };
      }).catch(function () {
        setStatus("Bağlantı iptal edildi");
      });
    } catch (e) {
      alert("Wallet connect error.");
      try { console.error(e); } catch(_) {}
    }
  }

  // Disconnect (buton varsa çalışsın)
  function quickDisconnect() {
    try { if (adapter && adapter.disconnect) adapter.disconnect(); } catch(e){}
    pubkey = null;
    setStatus("Bağlantı kesildi");
    setConnectLabel("Connect Wallet");
  }

  // Global fonksiyon — app.v1.js bu ismi çağırıyor
  window.__zuzuSolanaConnect = quickConnect;
  window.__zuzuSolanaDisconnect = quickDisconnect;

  // Sayfa açılışında: cüzdan var mı kontrol et, varsa label'ı hazırla
  function bootLite(){
    var w = detectWallet();
    if (w && w.publicKey) {
      var pk = w.publicKey.toString ? w.publicKey.toString() : String(w.publicKey);
      setConnectLabel(short(pk));
      setStatus("Hazır");
      window.__zuzuWallet = { adapter: w, publicKey: w.publicKey };
    } else {
      setStatus("Hazır (cüzdan bekleniyor)");
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bootLite); else bootLite();
})();
