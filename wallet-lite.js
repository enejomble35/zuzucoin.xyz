(function () {
  // ------- helpers
  function short(b){ return b ? (b.slice(0,4)+"..."+b.slice(-4)) : ""; }
  function setStatus(t){ var s=document.getElementById("solanaStatus"); if(s) s.textContent=t; }
  function setAddr(a){ var el=document.getElementById("walletAddr"); if(el) el.textContent=a||"Not connected"; }
  function setConnectLabel(txt){
    var b=document.getElementById("connectBtn");
    if (b) b.textContent = txt || "Connect Wallet";
  }
  function isMobileWeb(){
    var ua = navigator.userAgent || "";
    var isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
    var inWallet = /Phantom/i.test(ua) || /Solflare/i.test(ua) || /Backpack/i.test(ua);
    return isMobile && !inWallet;
  }
  function detect(){
    if (window.phantom && window.phantom.solana) return {name:"phantom", adapter:window.phantom.solana};
    if (window.solana && (window.solana.isPhantom||window.solana.isBackpack)) return {name:(window.solana.isBackpack?"backpack":"phantom"), adapter:window.solana};
    if (window.solflare && window.solflare.isSolflare) return {name:"solflare", adapter:window.solflare};
    if (window.backpack && window.backpack.solana) return {name:"backpack", adapter:window.backpack.solana};
    return null;
  }

  // ------- modal
  var sheet = null;
  function openSheet(){ if(!sheet) sheet=document.getElementById("walletSheet"); if(sheet) sheet.style.display="block"; }
  function closeSheet(){ if(sheet) sheet.style.display="none"; }

  function deeplinkFor(name){
    var url = encodeURIComponent(window.location.href);
    if (name==="phantom")  return "https://phantom.app/ul/browse/"+url;
    if (name==="solflare") return "https://solflare.com/ul/browse/"+url;
    if (name==="backpack") return "https://backpack.app/ul/browse/"+url; // bazı sürümlerde yok; sorun olmazsa kalsın
    return null;
  }

  // ------- connect logic
  var current=null, pubkey=null;

  async function doConnectPrefer(name){
    try{
      // 1) Enjekte varsa bağlan
      var found = detect();
      if(found && (!name || name===found.name)){
        current = found.adapter;
        if(current.isConnected && current.publicKey){
          pubkey = current.publicKey;
        }else{
          var res = await current.connect();
          pubkey = (res && res.publicKey) ? res.publicKey : current.publicKey;
        }
        var b58 = pubkey.toString ? pubkey.toString() : String(pubkey);
        setStatus("Bağlandı"); setConnectLabel(short(b58)); setAddr(short(b58));
        window.__zuzuWallet = {adapter:current, publicKey:pubkey};
        closeSheet();
        return;
      }

      // 2) Enjeksyon yoksa (mobil web): seçilen cüzdan uygulamasına yönlendir
      if(isMobileWeb()){
        var link = deeplinkFor(name || "phantom");
        if(link){ window.location.href = link; }
        else alert("Wallet app link not available.");
        return;
      }

      // 3) Masaüstünde eklenti yok
      alert("Please install "+(name?name:"a Solana wallet")+" (Phantom / Solflare / Backpack).");
    }catch(e){
      console.warn(e); alert("Wallet connect error.");
    }
  }

  function disconnect(){
    try{ if(current && current.disconnect) current.disconnect(); }catch(e){}
    current=null; pubkey=null;
    setStatus("Hazır (cüzdan bekleniyor)"); setConnectLabel("Connect Wallet"); setAddr("Not connected");
  }

  // ------- UI bindings
  function bind(){
    // connect button
    var c = document.getElementById("connectBtn");
    if(c){
      c.addEventListener("click", function(){
        var found = detect();
        if(found && !isMobileWeb()){
          // masaüstü: tek sağlayıcı varsa direkt bağlan, birden fazlaysa seçim aç
          openSheet();
        }else{
          // mobil tarayıcı: seçim aç (deeplink için)
          openSheet();
        }
      });
    }

    var bp = document.getElementById("btnDisconnect");
    if(bp) bp.addEventListener("click", disconnect);

    var ph = document.getElementById("wsPhantom");
    var sf = document.getElementById("wsSolflare");
    var bk = document.getElementById("wsBackpack");
    var cl = document.getElementById("wsClose");

    if(ph) ph.addEventListener("click", ()=>doConnectPrefer("phantom"));
    if(sf) sf.addEventListener("click", ()=>doConnectPrefer("solflare"));
    if(bk) bk.addEventListener("click", ()=>doConnectPrefer("backpack"));
    if(cl) cl.addEventListener("click", closeSheet);
  }

  // ------- boot
  function boot(){
    bind();
    var found = detect();
    if(found && found.adapter.publicKey){
      var b58 = found.adapter.publicKey.toString ? found.adapter.publicKey.toString() : String(found.adapter.publicKey);
      setStatus("Hazır"); setConnectLabel(short(b58)); setAddr(short(b58));
      window.__zuzuWallet = {adapter:found.adapter, publicKey:found.adapter.publicKey};
    }else{
      setStatus("Hazır (cüzdan bekleniyor)");
    }
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
