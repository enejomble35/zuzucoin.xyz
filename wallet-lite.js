(function () {
  // ------- helpers
  const AC_KEY = "autoconnect"; // URL içinde hash/search anahtarı (#autoconnect=phantom)
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
  // hangi cüzdan enjekte?
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

  // Deeplink: dapp URL’ine #autoconnect=<wallet> ekleyip wallet’ın “browse” linkiyle açıyoruz
  function withAutoConnect(url, wallet){
    try{
      const u = new URL(url);
      // hash’e ekle (ör: #autoconnect=phantom)
      const h = new URLSearchParams((u.hash||"").replace(/^#/, ""));
      h.set(AC_KEY, wallet);
      u.hash = "#"+h.toString();
      return u.toString();
    }catch(e){ return url + (url.includes("#")?"&":"#") + AC_KEY+"="+wallet; }
  }
  function deeplinkFor(name){
    // dapp url’ini autoconnect ile hazırlıyoruz
    const target = withAutoConnect(window.location.href, name);
    const encoded = encodeURIComponent(target);
    if (name==="phantom")  return "https://phantom.app/ul/browse/"+encoded;
    if (name==="solflare") return "https://solflare.com/ul/browse/"+encoded;
    if (name==="backpack") return "https://backpack.app/ul/browse/"+encoded;
    return null;
  }

  // ------- connect logic
  var current=null, pubkey=null;

  async function doConnectNow(adapter){
    const res = await adapter.connect();
    const key = (res && res.publicKey) ? res.publicKey : adapter.publicKey;
    const b58 = key && key.toString ? key.toString() : String(key||"");
    setStatus("Bağlandı");
    setConnectLabel(short(b58));
    setAddr(short(b58));
    window.__zuzuWallet = {adapter, publicKey:key};
  }

  async function doConnectPrefer(name){
    try{
      // 1) Enjekte varsa bağlan (masaüstü veya wallet webview)
      const found = detect();
      if(found && (!name || name===found.name)){
        current = found.adapter;
        if(current.isConnected && current.publicKey){
          const b58 = current.publicKey.toString ? current.publicKey.toString() : String(current.publicKey);
          setStatus("Bağlandı"); setConnectLabel(short(b58)); setAddr(short(b58));
          window.__zuzuWallet = {adapter:current, publicKey:current.publicKey};
          closeSheet();
          return;
        }
        await doConnectNow(current);
        closeSheet();
        return;
      }

      // 2) Mobil tarayıcı (enjekte yok): seçilen cüzdanın uygulamasında ayni URL’yi aç (autoconnect ile)
      if(isMobileWeb()){
        const link = deeplinkFor(name || "phantom");
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
    // connect button -> seçim penceresi
    var c = document.getElementById("connectBtn");
    if(c){
      c.addEventListener("click", function(){
        openSheet();
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

  // ------- boot (sayfa wallet içi açıldıysa otomatik connect)
  async function boot(){
    bind();

    // URL’de #autoconnect=<wallet> var mı?
    const hashParams = new URLSearchParams((location.hash||"").replace(/^#/, ""));
    const searchParams = new URLSearchParams(location.search||"");
    const want = hashParams.get(AC_KEY) || searchParams.get(AC_KEY);

    const found = detect();
    if(found && found.adapter.publicKey){
      // zaten bağlı
      const b58 = found.adapter.publicKey.toString ? found.adapter.publicKey.toString() : String(found.adapter.publicKey);
      setStatus("Hazır"); setConnectLabel(short(b58)); setAddr(short(b58));
      window.__zuzuWallet = {adapter:found.adapter, publicKey:found.adapter.publicKey};
    }else if (found && want){
      // wallet webview’da açıldık ve autoconnect işaretlenmiş → otomatik bağlanmayı dene
      try{
        await doConnectNow(found.adapter);
      }catch(e){
        console.warn(e);
        setStatus("Bağlantı reddedildi");
      }
    }else{
      setStatus("Hazır (cüzdan bekleniyor)");
    }
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
