(function () {
  const AC_KEY = "autoconnect";        // #autoconnect=phantom|solflare|backpack
  const WAIT_MS = 9000;                // provider enjekte olana kadar en fazla bekleme
  const TICK_MS = 250;                 // yoklama aralığı

  // ---------- tiny ui helpers
  const $ = (id)=>document.getElementById(id);
  const short = (a)=>a ? (a.slice(0,4)+"..."+a.slice(-4)) : "";
  function setStatus(t){ const el=$("solanaStatus"); if(el) el.textContent=t; }
  function setAddr(a){ const el=$("walletAddr"); if(el) el.textContent=a||"Not connected"; }
  function setConnectLabel(t){ const b=$("connectBtn"); if(b) b.textContent=t||"Connect Wallet"; }

  // ---------- env
  function isMobileWeb(){
    const ua = navigator.userAgent||"";
    const m  = /Android|iPhone|iPad|iPod/i.test(ua);
    const inWallet = /Phantom/i.test(ua) || /Solflare/i.test(ua) || /Backpack/i.test(ua);
    return m && !inWallet;
  }
  function detect(){
    if (window.phantom && window.phantom.solana) return {name:"phantom", adapter:window.phantom.solana};
    if (window.solana && (window.solana.isPhantom||window.solana.isBackpack)) return {name:(window.solana.isBackpack?"backpack":"phantom"), adapter:window.solana};
    if (window.solflare && window.solflare.isSolflare) return {name:"solflare", adapter:window.solflare};
    if (window.backpack && window.backpack.solana) return {name:"backpack", adapter:window.backpack.solana};
    return null;
  }

  // ---------- modal
  let sheet=null;
  function openSheet(){ if(!sheet) sheet=$("walletSheet"); if(sheet) sheet.style.display="block"; }
  function closeSheet(){ if(sheet) sheet.style.display="none"; }

  // dapp URL’ine #autoconnect paramı ekle
  function withAutoConnect(url, wallet){
    try{
      const u = new URL(url);
      const h = new URLSearchParams((u.hash||"").replace(/^#/, ""));
      h.set(AC_KEY, wallet);
      u.hash = "#"+h.toString();
      return u.toString();
    }catch(_){
      return url + (url.includes("#")?"&":"#") + AC_KEY+"="+wallet;
    }
  }
  // wallet deeplink
  function deeplinkFor(name){
    const target = withAutoConnect(location.href, name);
    const enc = encodeURIComponent(target);
    if (name==="phantom")  return "https://phantom.app/ul/browse/"+enc;
    if (name==="solflare") return "https://solflare.com/ul/browse/"+enc;
    if (name==="backpack") return "https://backpack.app/ul/browse/"+enc;
    return null;
  }

  // ---------- connect core
  let current=null;

  async function doConnect(adapter){
    const res = await adapter.connect();               // Phantom/Solflare prompt’u burada gelir
    const key = (res && res.publicKey) ? res.publicKey : adapter.publicKey;
    const b58 = key && key.toString ? key.toString() : String(key||"");
    setStatus("Bağlandı"); setConnectLabel(short(b58)); setAddr(short(b58));
    window.__zuzuWallet = {adapter, publicKey:key};
  }

  // provider gelene kadar bekle & bağlan
  async function waitAndConnect(expectName){
    const t0 = Date.now();
    while (Date.now()-t0 < WAIT_MS) {
      const found = detect();
      if (found && (!expectName || found.name===expectName)) {
        current = found.adapter;
        try { await doConnect(current); } catch(e){ console.warn(e); setStatus("Bağlantı reddedildi"); }
        return true;
      }
      await new Promise(r=>setTimeout(r,TICK_MS));
    }
    return false;
  }

  async function startConnectFlow(choice){
    try{
      // 1) Enjekte varsa direkt bağlan
      const found = detect();
      if (found && (!choice || found.name===choice)) {
        current = found.adapter;
        if (current.isConnected && current.publicKey) {
          const b58 = current.publicKey.toString?current.publicKey.toString():String(current.publicKey);
          setStatus("Bağlandı"); setConnectLabel(short(b58)); setAddr(short(b58));
          window.__zuzuWallet = {adapter:current, publicKey:current.publicKey};
        } else {
          await doConnect(current);
        }
        closeSheet();
        return;
      }

      // 2) Mobil tarayıcı → wallet app’e deeplink + autoconnect işareti
      if (isMobileWeb()) {
        const link = deeplinkFor(choice||"phantom");
        if (link) {
          // iOS/Android bazı durumlarda geç açılıyor; kullanıcı geri dönerse tekrar deneyeceğiz
          location.href = link;
        } else {
          alert("Wallet app link not available.");
        }
        return;
      }

      // 3) Masaüstünde eklenti yok
      alert("Please install "+(choice?choice:"a Solana wallet")+" (Phantom / Solflare / Backpack).");
    }catch(err){
      console.warn(err); alert("Wallet connect error.");
    }
  }

  function disconnect(){
    try{ if(current && current.disconnect) current.disconnect(); }catch(_){}
    current=null; setStatus("Hazır (cüzdan bekleniyor)"); setConnectLabel("Connect Wallet"); setAddr("Not connected");
  }

  // ---------- bindings
  function bind(){
    const c = $("connectBtn"); if(c) c.addEventListener("click", openSheet);
    const d = $("btnDisconnect"); if(d) d.addEventListener("click", disconnect);
    const ph=$("wsPhantom"), sf=$("wsSolflare"), bk=$("wsBackpack"), cl=$("wsClose");
    if(ph) ph.addEventListener("click", ()=>startConnectFlow("phantom"));
    if(sf) sf.addEventListener("click", ()=>startConnectFlow("solflare"));
    if(bk) bk.addEventListener("click", ()=>startConnectFlow("backpack"));
    if(cl) cl.addEventListener("click", closeSheet);

    // Uygulama arkaplandan öne geldiğinde tekrar dene (deeplink dönüşü)
    document.addEventListener("visibilitychange", ()=>{
      if (!document.hidden) {
        const want = new URLSearchParams((location.hash||"").replace(/^#/, "")).get(AC_KEY);
        if (want && !window.__zuzuWallet) waitAndConnect(want);
      }
    });
  }

  // ---------- boot
  async function boot(){
    bind();

    // halihazırda bağlı mı?
    const found = detect();
    if (found && found.adapter.publicKey) {
      const b58 = found.adapter.publicKey.toString?found.adapter.publicKey.toString():String(found.adapter.publicKey);
      setStatus("Hazır"); setConnectLabel(short(b58)); setAddr(short(b58));
      window.__zuzuWallet = {adapter:found.adapter, publicKey:found.adapter.publicKey};
      return;
    }

    // autoconnect bayrağı var mı? (wallet app’te açıldı)
    const pHash = new URLSearchParams((location.hash||"").replace(/^#/, ""));
    const want = pHash.get(AC_KEY);
    if (want) {
      setStatus("Cüzdan bekleniyor…");
      const ok = await waitAndConnect(want);   // provider enjekte olana kadar bekle
      if (!ok) setStatus("Cüzdan görünmüyor. Uygulama içinde açtığınızdan emin olun.");
    } else {
      setStatus("Hazır (cüzdan bekleniyor)");
    }
  }

  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
