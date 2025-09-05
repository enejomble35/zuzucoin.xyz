(function () {
  const AC_KEY = "autoconnect";   // #autoconnect=phantom|solflare|backpack
  const WAIT_MS = 8000;
  const TICK_MS = 200;

  // ------------- helpers
  const $ = id => document.getElementById(id);
  const short = a => a ? (a.slice(0,4)+"..."+a.slice(-4)) : "";
  const setStatus = t => { const el=$("solanaStatus"); if(el) el.textContent=t; };
  const setAddr   = a => { const el=$("walletAddr");   if(el) el.textContent=a||"Not connected"; };
  const setConnectLabel = t => { const b=$("connectBtn"); if(b) b.textContent=t||"Connect Wallet"; };

  function isMobileWeb(){
    const ua = navigator.userAgent||"";
    const mobile = /Android|iPhone|iPad|iPod/i.test(ua);
    const inWallet = /Phantom/i.test(ua) || /Solflare/i.test(ua) || /Backpack/i.test(ua);
    return mobile && !inWallet; // gerçek mobil tarayıcı (wallet içi değil)
  }
  function detect(){
    if (window.phantom && window.phantom.solana) return {name:"phantom", adapter:window.phantom.solana};
    if (window.solana && (window.solana.isPhantom||window.solana.isBackpack)) return {name:(window.solana.isBackpack?"backpack":"phantom"), adapter:window.solana};
    if (window.solflare && window.solflare.isSolflare) return {name:"solflare", adapter:window.solflare};
    if (window.backpack && window.backpack.solana) return {name:"backpack", adapter:window.backpack.solana};
    return null;
  }

  // ------------- wallet chooser sheet (index.html’de var)
  let sheet=null;
  const openSheet = ()=>{ if(!sheet) sheet=$("walletSheet"); if(sheet) sheet.style.display="block"; };
  const closeSheet= ()=>{ if(sheet) sheet.style.display="none"; };

  // dapp URL’ine #autoconnect ekle
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
  // wallet app deeplink
  function deeplinkFor(name){
    const target = withAutoConnect(location.href, name);
    const enc = encodeURIComponent(target);
    if (name==="phantom")  return "https://phantom.app/ul/browse/"+enc;
    if (name==="solflare") return "https://solflare.com/ul/browse/"+enc;
    if (name==="backpack") return "https://backpack.app/ul/browse/"+enc;
    return null;
  }

  // ------------- “tap to connect” overlay (gesture garantisi)
  function ensureTapOverlay(onTap){
    if ($("tapConnect")) return;
    const wrap = document.createElement("div");
    wrap.id = "tapConnect";
    wrap.style.cssText = "position:fixed;inset:0;z-index:120;background:rgba(2,10,24,.66);display:flex;align-items:center;justify-content:center";
    wrap.innerHTML = `
      <div style="background:#0f1a30;border:1px solid #22365a;border-radius:16px;padding:16px;width:min(420px,92%);text-align:center">
        <h3 style="margin:0 0 8px;color:#dbe7ff">Cüzdana Bağlan</h3>
        <p style="color:#9fb6e6;margin:0 0 12px">Devam etmek için dokunun.</p>
        <button id="tapConnectBtn" class="z-btn z-btn-primary" style="justify-content:center">Bağlan</button>
        <div style="margin-top:8px"><button id="tapConnectCancel" class="z-btn" style="justify-content:center">İptal</button></div>
      </div>`;
    document.body.appendChild(wrap);
    $("tapConnectBtn").addEventListener("click", ()=>{ onTap(); hideTapOverlay(); });
    $("tapConnectCancel").addEventListener("click", hideTapOverlay);
  }
  function hideTapOverlay(){ const el=$("tapConnect"); if(el) el.remove(); }

  // ------------- connect core
  let current=null;

  async function doConnect(adapter){
    // bazı cüzdanlar jest dışında reddettiği için, bu fonksiyon mutlaka kullanıcı tıklaması ile çağrılmalı
    const res = await adapter.connect({ onlyIfTrusted:false });
    const key = (res && res.publicKey) ? res.publicKey : adapter.publicKey;
    const b58 = key && key.toString ? key.toString() : String(key||"");
    setStatus("Bağlandı"); setConnectLabel(short(b58)); setAddr(short(b58));
    window.__zuzuWallet = {adapter, publicKey:key};
  }

  // provider enjekte olana kadar bekle
  async function waitProvider(expectName){
    const t0 = Date.now();
    while (Date.now()-t0 < WAIT_MS) {
      const f = detect();
      if (f && (!expectName || f.name===expectName)) return f.adapter;
      await new Promise(r=>setTimeout(r,TICK_MS));
    }
    return null;
  }

  async function startConnectFlow(choice){
    try{
      const found = detect();
      if (found && (!choice || found.name===choice)) {
        current = found.adapter;
        // jest şartını sağlamak için sheet açıkken butona tıklamayı kullandık => direkt bağlan
        await doConnect(current);
        closeSheet();
        return;
      }
      if (isMobileWeb()){
        const link = deeplinkFor(choice||"phantom");
        if (link) location.href = link;
        else alert("Wallet app link not available.");
        return;
      }
      alert("Please install "+(choice||"a Solana wallet")+" (Phantom / Solflare / Backpack).");
    }catch(e){ console.warn(e); alert("Wallet connect error."); }
  }

  function disconnect(){
    try{ if(current && current.disconnect) current.disconnect(); }catch(_){}
    current=null; setStatus("Hazır (cüzdan bekleniyor)"); setConnectLabel("Connect Wallet"); setAddr("Not connected");
  }

  // ------------- bindings
  function bind(){
    const c=$("connectBtn"); if(c) c.addEventListener("click", openSheet);
    const d=$("btnDisconnect"); if(d) d.addEventListener("click", disconnect);
    const ph=$("wsPhantom"), sf=$("wsSolflare"), bk=$("wsBackpack"), cl=$("wsClose");
    if(ph) ph.addEventListener("click", ()=>startConnectFlow("phantom"));
    if(sf) sf.addEventListener("click", ()=>startConnectFlow("solflare"));
    if(bk) bk.addEventListener("click", ()=>startConnectFlow("backpack"));
    if(cl) cl.addEventListener("click", closeSheet);

    document.addEventListener("visibilitychange", async ()=>{
      if (!document.hidden) {
        const want = new URLSearchParams((location.hash||"").replace(/^#/, "")).get(AC_KEY);
        if (want && !window.__zuzuWallet) {
          // wallet app’e döndük → provider geldiğinde, kullanıcıdan 1 dokunuş iste
          const adapter = await waitProvider(want);
          if (adapter) ensureTapOverlay(()=>doConnect(adapter));
        }
      }
    });
  }

  // ------------- boot
  async function boot(){
    bind();

    const found = detect();
    if (found && found.adapter.publicKey) {
      const b58 = found.adapter.publicKey.toString?found.adapter.publicKey.toString():String(found.adapter.publicKey);
      setStatus("Hazır"); setConnectLabel(short(b58)); setAddr(short(b58));
      window.__zuzuWallet = {adapter:found.adapter, publicKey:found.adapter.publicKey};
      return;
    }

    const want = new URLSearchParams((location.hash||"").replace(/^#/, "")).get(AC_KEY);
    if (want) {
      // wallet webview içinde açıldı; provider hazır olur olmaz bağlanmayı kullanıcı jestiyle tetikle
      const adapter = await waitProvider(want);
      if (adapter) {
        // sayfa ilk açılır açılmaz hemen bağlan demek yerine "dokun" overlay’i göster
        ensureTapOverlay(()=>doConnect(adapter));
      } else {
        setStatus("Cüzdan görünmüyor. Uygulama içinde açtığınızdan emin olun.");
      }
    } else {
      setStatus("Hazır (cüzdan bekleniyor)");
    }
  }

  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
