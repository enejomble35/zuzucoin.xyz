/* =========================
   ZUZU – App bootstrap (light)
   • Connect Wallet butonu: modül yüklü değilse dinamik yükle, sonra aç
   • Dil menüsü çalışsın
========================= */
(function () {
  // --- dil ---
  window.addEventListener("DOMContentLoaded", ()=>{
    // lang.js içindeki applyLang mevcut varsayımıyla:
    const cur = localStorage.getItem("zuzu_lang") || "en";
    if (typeof applyLang === "function") applyLang(cur);

    document.querySelectorAll(".lang-item").forEach(li=>{
      li.addEventListener("click", ()=>{
        const lang = li.dataset.lang;
        localStorage.setItem("zuzu_lang", lang);
        if (typeof applyLang === "function") applyLang(lang);
        document.getElementById("langMenu")?.classList.remove("show");
      });
    });

    document.getElementById("langToggle")?.addEventListener("click", ()=>{
      document.getElementById("langMenu")?.classList.toggle("show");
    });
  });

  // --- connect wallet (dinamik modül yükleme) ---
  async function ensureWalletModule(){
    if (window.ZUZU_WALLET?.isReady?.()) return true;
    try{
      await new Promise((res,rej)=>{
        const s = document.createElement("script");
        s.src = "wallet-lite.js?v=3";  // cache bust
        s.async = true;
        s.onload = res;
        s.onerror = ()=>rej(new Error("wallet load error"));
        document.head.appendChild(s);
      });
      return !!window.ZUZU_WALLET?.isReady?.();
    }catch(e){
      console.warn(e);
      return false;
    }
  }
/* App boot */
window.addEventListener("DOMContentLoaded", ()=>{
  // dil – mevcut kodun varsa onunla kalır
  // sayaç – mevcut kodun varsa onunla kalır

  // cüzdandan dönüşte adres yazdırmak için:
  // (wallet-lite.js zaten visibilitychange’te deniyor; burada da ilk boyada bir kez deneriz)
  setTimeout(()=> {
    if (window.ZUZU_WALLET?.setConnected && (window.solana || window.solflare || window.backpack)) {
      // injected quick try
      const p = window.solana || window?.phantom?.solana;
      (async ()=>{
        try{
          if(p?.isPhantom){
            const r = await p.connect({ onlyIfTrusted:true });
            if(r?.publicKey){ window.ZUZU_WALLET.setConnected(r.publicKey.toString()); return; }
          }
        }catch{}
        try{
          const s = window.solflare;
          if(s?.connect){ await s.connect(); const pk=s?.publicKey?.toString?.(); if(pk) return window.ZUZU_WALLET.setConnected(pk); }
        }catch{}
        try{
          const b = window.backpack;
          if(b?.connect){ const r=await b.connect(); const pk=r?.publicKey?.toString?.()||r?.[0]; if(pk) window.ZUZU_WALLET.setConnected(pk); }
        }catch{}
      })();
    }
  }, 300);
});
  async function openWallet(){
    const ok = await ensureWalletModule();
    if (!ok) return alert("Wallet script couldn’t be loaded. Please refresh.");
    window.ZUZU_WALLET.open();
  }

  window.addEventListener("DOMContentLoaded", ()=>{
    document.getElementById("connectBtn")?.addEventListener("click", openWallet, {capture:true});
  });
})();
