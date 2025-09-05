(function () {
  function short(b){ return b ? (b.slice(0,4)+"..."+b.slice(-4)) : ""; }
  function setStatus(t){ var s=document.getElementById("solanaStatus"); if(s) s.textContent="Durum: "+t; }
  function setConnectLabel(txt){
    if (typeof window.__zuzuSetConnectLabel==="function") window.__zuzuSetConnectLabel(txt);
    else { var b=document.getElementById("connectBtn"); if(b) b.textContent=txt||"Connect Wallet"; }
  }
  function setReferral(addr){
    if (typeof window.__zuzuSetReferral==="function") window.__zuzuSetReferral(addr);
    try{ if(addr) localStorage.setItem("zuzu_ref_last", addr); }catch(e){}
  }

  /** detect injected wallets */
  function detectWallet(){
    if (window.__zuzuWallet && window.__zuzuWallet.adapter) return window.__zuzuWallet.adapter;
    if (window.phantom && window.phantom.solana) return window.phantom.solana;
    if (window.solana && (window.solana.isPhantom||window.solana.isBackpack)) return window.solana;
    if (window.solflare && window.solflare.isSolflare) return window.solflare;
    if (window.backpack && window.backpack.solana) return window.backpack.solana;
    return null;
  }

  /** build deeplinks to open THIS page inside wallet in-app browsers */
  function setDeeplinkButtons(){
    var bar=document.getElementById("walletOpeners"); if(!bar) return;
    var url = window.location.href;
    var enc = encodeURIComponent(url);

    // Phantom resmi deeplink (https şeması en sorunsuz)
    var phantom = "https://phantom.app/ul/browse/"+enc;
    // Solflare resmi deeplink
    var solflare = "https://solflare.com/ul/browse/"+enc;

    var a1=document.getElementById("openPhantom");
    var a2=document.getElementById("openSolflare");
    if(a1) a1.href = phantom;
    if(a2) a2.href = solflare;

    bar.style.display = "block";
  }

  function isMobileWeb(){
    var ua = navigator.userAgent || "";
    // Cüzdan uygulaması dışındaki popüler mobil tarayıcıları ayrıştır
    var isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
    var inWallet = /Phantom/i.test(ua) || /Solflare/i.test(ua) || /Backpack/i.test(ua);
    return isMobile && !inWallet;
  }

  var adapter=null, pubkey=null;

  /** connect on click (or reconnect) */
  function quickConnect(){
    try{
      adapter = detectWallet();

      // Mobil tarayıcıda enjekte yoksa: deeplink barını göster ve uyar
      if(!adapter && isMobileWeb()){
        setDeeplinkButtons();
        alert("Cüzdan uygulamasında açmanız gerekir. 'Phantom’da Aç' ya da 'Solflare’da Aç' butonunu kullanın.");
        setStatus("Cüzdan bulunamadı (mobil tarayıcı)"); 
        return;
      }

      if(!adapter){
        setStatus("Cüzdan bulunamadı.");
        alert("Phantom / Solflare / Backpack kurmalısın.");
        return;
      }

      if(adapter.isConnected && adapter.publicKey){
        var b58 = adapter.publicKey.toString ? adapter.publicKey.toString() : String(adapter.publicKey);
        pubkey = adapter.publicKey;
        setStatus("Bağlandı"); setConnectLabel(short(b58)); setReferral(b58);
        window.__zuzuWallet={adapter:adapter, publicKey:pubkey};
        return;
      }

      adapter.connect().then(function(res){
        var pk=(res && res.publicKey)? res.publicKey : adapter.publicKey;
        var b58 = pk.toString ? pk.toString() : String(pk);
        pubkey=pk; setStatus("Bağlandı"); setConnectLabel(short(b58)); setReferral(b58);
        window.__zuzuWallet={adapter:adapter, publicKey:pk};
      }).catch(function(){ setStatus("Bağlantı iptal edildi"); });
    }catch(e){ console.warn(e); alert("Wallet connect error."); }
  }

  function quickDisconnect(){
    try{ if(adapter && adapter.disconnect) adapter.disconnect(); }catch(e){}
    pubkey=null; setStatus("Bağlantı kesildi"); setConnectLabel("Connect Wallet");
  }

  // expose
  window.__zuzuSolanaConnect = quickConnect;
  window.__zuzuSolanaDisconnect = quickDisconnect;

  // first paint
  function bootLite(){
    var w=detectWallet();
    if(w && w.publicKey){
      var pk=w.publicKey.toString ? w.publicKey.toString() : String(w.publicKey);
      setConnectLabel(short(pk)); setStatus("Hazır"); window.__zuzuWallet={adapter:w, publicKey:w.publicKey};
    } else {
      setStatus("Hazır (cüzdan bekleniyor)");
      if(isMobileWeb()) setDeeplinkButtons(); // sayfa açılır açılmaz barı göster
    }
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", bootLite); else bootLite();
})();
