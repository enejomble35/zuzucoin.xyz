/* ======================================================
   ZUZUCOIN — App bootstrap (UI + i18n + wallet state)
   Bu dosya, script.js ve wallet-lite.js ile birlikte çalışır.
====================================================== */

(function(){
  const $  = (s,root=document)=>root.querySelector(s);
  const $$ = (s,root=document)=>Array.from(root.querySelectorAll(s));
  const LS_LANG = "zuzu_lang";

  // -------- Dil (bayrak menüsü) ----------
  function setupLangMenu(){
    const toggle = $("#langToggle");
    const menu   = $("#langMenu");
    if(!toggle || !menu) return;

    // Bayrak görselleri garanti olsun
    $$("#langMenu .lang-flag").forEach(li=>{
      const code = li.dataset.lang;
      const img  = li.querySelector("img");
      if (img && !img.getAttribute("src")) {
        img.src = `flags/${code}.png`;
        img.alt = code.toUpperCase();
        img.loading = "lazy";
        img.onerror = () => { img.style.display="none"; li.prepend(document.createTextNode(code.toUpperCase()+" ")); };
      }
    });

    // Aç-kapa
    toggle.addEventListener("click", (e)=>{
      e.preventDefault();
      menu.classList.toggle("open");
    });
    document.addEventListener("click",(e)=>{
      if(!menu.contains(e.target) && e.target!==toggle) menu.classList.remove("open");
    });

    // Tıklayınca dili uygula + kaydet
    $$("#langMenu .lang-flag").forEach(li=>{
      li.addEventListener("click", ()=>{
        const lang = li.dataset.lang || "en";
        try{ localStorage.setItem(LS_LANG, lang); }catch{}
        applyLang(lang);                 // script.js içinden
        toggle.querySelector("span").textContent = lang.toUpperCase();
        menu.classList.remove("open");
      });
    });

    // İlk dil
    let initial = "en";
    try{ initial = localStorage.getItem(LS_LANG) || "en"; }catch{}
    applyLang(initial);
    toggle.querySelector("span").textContent = initial.toUpperCase();
  }

  // -------- Sayaç, NFT grid, presale kutuları ----------
  function setupUIBasics(){
    // Sayaç anında bir kez ve sonra her sn
    if (typeof tick === "function") {
      tick();
      setInterval(tick, 1000);
    }
    // NFT grid (script.js içindeki renderNFTs IIFE’ı varsa atlar)
    if (typeof renderNFTs === "function") {
      const g = $("#nftGrid");
      if (g && g.children.length === 0) renderNFTs();
    }

    // Haftaya göre "Buy" düğmeleri etkin/pasif
    if (typeof updateActiveWeekUI === "function") updateActiveWeekUI();

    // Miktar değiştikçe maliyetleri güncelle
    const amt = $("#buyAmount");
    if (amt && typeof updateCosts === "function") {
      amt.addEventListener("input", updateCosts);
      updateCosts();
    }
  }

  // -------- Cüzdan durumu ----------
  function setWalletLabel(pk){
    const b = $("#connectBtn");
    if(!b) return;
    if (pk && pk.length > 8) {
      b.textContent = pk.slice(0,4)+"..."+pk.slice(-4);
      b.classList.add("connected");
    } else {
      b.textContent = (b.dataset.iLabel || "Connect Wallet");
      b.classList.remove("connected");
    }
  }

  async function refreshWalletState(){
    try{
      // wallet-lite.js global helper
      const pk = (window.__zuzu_pubkey && window.__zuzu_pubkey()) || null;
      setWalletLabel(pk);
    }catch{ setWalletLabel(null); }
  }

  // Görünürlük geri gelince otomatik dene (wallet-lite da dener)
  document.addEventListener("visibilitychange", ()=>{
    if(!document.hidden) refreshWalletState();
  });

  // -------- Satın alma butonları ----------
  function setupBuyButtons(){
    const ids = ["buyW0","buyW1","buyW2","buyW3"];
    ids.forEach((id,idx)=>{
      const b = $("#"+id);
      if(!b) return;
      b.addEventListener("click", async ()=>{
        const qtyRaw = ($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,"");
        const qty = parseFloat(qtyRaw)||0;
        if (qty<=0) { alert("Enter a valid ZUZU amount."); return; }

        // aktif hafta kontrol (script.js’teki fonksiyon)
        if (typeof getActiveWeek === "function" && idx !== getActiveWeek()){
          alert("This sale week is not active.");
          return;
        }

        // Cüzdan bağlı mı? değilse modalı açtır
        if (window.ZUZU_SOL?.requireConnection && !(await window.ZUZU_SOL.requireConnection())) {
          return; // kullanıcı cüzdana gidecek, geri dönünce auto-connect
        }

        // İşlem (şimdilik cüzdanda yapılacağı için bilgi mesajı)
        const price = (window.CONFIG?.weekPrices?.[idx]) || 0;
        const cost  = +(qty * price).toFixed(2);
        if (window.ZUZU_SOL?.startPurchase) {
          window.ZUZU_SOL.startPurchase({ qty, price, cost });
        } else {
          alert(`Open your wallet to complete purchase.\n\nAmount: ${qty} ZUZU\nPrice: ${price} USDT\nTotal: ${cost} USDT`);
        }
      });
    });
  }

  // -------- Başlat --------
  window.addEventListener("DOMContentLoaded", ()=>{
    // Connect butonu etiketini i18n anahtarıyla sakla
    const b = $("#connectBtn");
    if (b) b.dataset.iLabel = b.textContent.trim();

    setupLangMenu();
    setupUIBasics();
    setupBuyButtons();
    refreshWalletState();

    console.log("ZUZUCOIN app.v1 booted ✅");
  });
})();
