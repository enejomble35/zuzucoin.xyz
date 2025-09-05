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
  function detectWallet(){
    if (window.phantom && window.phantom.solana) return window.phantom.solana;
    if (window.solana && (window.solana.isPhantom||window.solana.isBackpack)) return window.solana;
    if (window.solflare && window.solflare.isSolflare) return window.solflare;
    if (window.backpack && window.backpack.solana) return window.backpack.solana;
    return null;
  }

  var adapter=null, pubkey=null;

  function quickConnect(){
    try{
      adapter=detectWallet();
      if(!adapter){ setStatus("Cüzdan bulunamadı."); alert("Phantom / Solflare / Backpack kurmalısın."); return; }
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
    }catch(e){ alert("Wallet connect error."); }
  }
  function quickDisconnect(){
    try{ if(adapter && adapter.disconnect) adapter.disconnect(); }catch(e){}
    pubkey=null; setStatus("Bağlantı kesildi"); setConnectLabel("Connect Wallet");
  }

  window.__zuzuSolanaConnect = quickConnect;
  window.__zuzuSolanaDisconnect = quickDisconnect;

  function bootLite(){
    var w=detectWallet();
    if(w && w.publicKey){
      var pk=w.publicKey.toString ? w.publicKey.toString() : String(w.publicKey);
      setConnectLabel(short(pk)); setStatus("Hazır"); window.__zuzuWallet={adapter:w, publicKey:w.publicKey};
    } else { setStatus("Hazır (cüzdan bekleniyor)"); }
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", bootLite); else bootLite();
})();
