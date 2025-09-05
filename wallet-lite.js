(function () {
  const AC_KEY="autoconnect", WAIT_MS=10000, TICK=200;
  const $=id=>document.getElementById(id);
  const short=a=>a?(a.slice(0,4)+"..."+a.slice(-4)):"";
  const setStatus=t=>{const e=$("solanaStatus"); if(e) e.textContent=t;};
  const setAddr=a=>{const e=$("walletAddr"); if(e) e.textContent=a||"Not connected";};
  const setBtn=t=>{const e=$("connectBtn"); if(e) e.textContent=t||"Connect Wallet";};

  // -------- detect
  function detect(){
    if (window.phantom && window.phantom.solana) return {name:"phantom", adapter:window.phantom.solana};
    if (window.solana && (window.solana.isPhantom||window.solana.isBackpack))
      return {name:(window.solana.isBackpack?"backpack":"phantom"), adapter:window.solana};
    if (window.solflare && window.solflare.isSolflare) return {name:"solflare", adapter:window.solflare};
    if (window.backpack && window.backpack.solana) return {name:"backpack", adapter:window.backpack.solana};
    return null;
  }
  function inMobileBrowser(){
    const ua=navigator.userAgent||"";
    const mobile=/Android|iPhone|iPad|iPod/i.test(ua);
    const inWallet=/Phantom|Solflare|Backpack/i.test(ua);
    return mobile && !inWallet;
  }
  function withAutoConnect(url,wallet){
    try{const u=new URL(url);const h=new URLSearchParams((u.hash||"").replace(/^#/,""));h.set(AC_KEY,wallet);u.hash="#"+h.toString();return u.toString();}
    catch(_){return url+(url.includes("#")?"&":"#")+AC_KEY+"="+wallet;}
  }
  function deeplinkFor(name){
    const target=withAutoConnect(location.href,name);
    const enc=encodeURIComponent(target);
    if(name==="phantom")  return "https://phantom.app/ul/browse/"+enc;
    if(name==="solflare") return "https://solflare.com/ul/browse/"+enc;
    if(name==="backpack") return "https://backpack.app/ul/browse/"+enc;
    return null;
  }

  // -------- tap overlay (gesture guarantee)
  function showTap(onTap){
    if($("tapConnect")) return;
    const w=document.createElement("div");
    w.id="tapConnect";
    w.style.cssText="position:fixed;inset:0;z-index:10000;background:rgba(2,10,24,.66);display:flex;align-items:center;justify-content:center";
    w.innerHTML=`<div class="card" style="width:min(420px,92%);text-align:center">
      <h3 style="margin-top:0">Cüzdana Bağlan</h3>
      <p style="color:#9fb6e6">Devam etmek için dokunun.</p>
      <button id="tapGo" class="z-btn z-btn-primary" style="justify-content:center">Bağlan</button>
      <div style="margin-top:8px"><button id="tapClose" class="z-btn" style="justify-content:center">İptal</button></div>
    </div>`;
    document.body.appendChild(w);
    $("tapGo").onclick=()=>{onTap(); w.remove();};
    $("tapClose").onclick=()=>w.remove();
  }

  let current=null;
  async function doConnect(adapter){
    const res=await adapter.connect({onlyIfTrusted:false});
    const key=(res && res.publicKey)?res.publicKey:adapter.publicKey;
    const b58=key && key.toString?key.toString():String(key||"");
    setStatus("Bağlandı"); setBtn(short(b58)); setAddr(short(b58));
    window.__zuzuWallet={adapter,publicKey:key};
  }
  async function waitProvider(expect){
    const t0=Date.now();
    while(Date.now()-t0<WAIT_MS){
      const f=detect();
      if(f && (!expect || f.name===expect)) return f.adapter;
      await new Promise(r=>setTimeout(r,TICK));
    }
    return null;
  }

  // -------- sheet
  function openSheet(){const s=$("walletSheet"); if(s) {s.style.display="block"; s.style.display="flex";}}
  function closeSheet(){const s=$("walletSheet"); if(s) s.style.display="none";}

  async function start(choice){
    try{
      const f=detect();
      if(f && (!choice || f.name===choice)){
        current=f.adapter; await doConnect(current); closeSheet(); return;
      }
      if(inMobileBrowser()){
        const link=deeplinkFor(choice||"phantom");
        if(link){ location.href=link; return; }
      }
      alert("Please install "+(choice||"a Solana wallet")+" (Phantom / Solflare / Backpack).");
    }catch(e){ console.warn(e); alert("Wallet connect error."); }
  }
  function disconnect(){
    try{ if(current&&current.disconnect) current.disconnect(); }catch(_){}
    current=null; setStatus("Hazır (cüzdan bekleniyor)"); setBtn("Connect Wallet"); setAddr("Not connected");
  }

  function bind(){
    // Eski listener’ları bastır
    const b=$("connectBtn");
    if(b){
      b.onclick=null;
      b.addEventListener("click", (ev)=>{ev.preventDefault();ev.stopImmediatePropagation();openSheet();}, true);
    }
    $("btnDisconnect")?.addEventListener("click",disconnect);
    $("wsPhantom")?.addEventListener("click",()=>start("phantom"));
    $("wsSolflare")?.addEventListener("click",()=>start("solflare"));
    $("wsBackpack")?.addEventListener("click",()=>start("backpack"));
    $("wsClose")?.addEventListener("click",closeSheet);

    // Wallet app’ten dönünce / içinde açılınca
    document.addEventListener("visibilitychange",async ()=>{
      if(!document.hidden){
        const want=new URLSearchParams((location.hash||"").replace(/^#/,"")).get(AC_KEY);
        if(want && !window.__zuzuWallet){
          const adapter=await waitProvider(want);
          if(adapter) showTap(()=>doConnect(adapter));
        }
      }
    });
  }

  async function boot(){
    bind();

    // Zaten bağlıysa UI’ı doldur
    const found=detect();
    if(found && found.adapter.publicKey){
      const b58=found.adapter.publicKey.toString?found.adapter.publicKey.toString():String(found.adapter.publicKey);
      setStatus("Hazır"); setBtn(short(b58)); setAddr(short(b58));
      window.__zuzuWallet={adapter:found.adapter,publicKey:found.adapter.publicKey};
      return;
    }

    // Wallet webview’ında autoconnect ile açıldıysa, provider gelince dokunarak bağlat
    const want=new URLSearchParams((location.hash||"").replace(/^#/,"")).get(AC_KEY);
    if(want){
      const adapter=await waitProvider(want);
      if(adapter) showTap(()=>doConnect(adapter));
      else setStatus("Cüzdan görünmüyor. Uygulama içi webview’da açın.");
    }else{
      setStatus("Hazır (cüzdan bekleniyor)");
    }
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot); else boot();
})();
