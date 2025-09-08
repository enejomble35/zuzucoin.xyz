/* =========================
   ZUZU — App Bootstrap (v1)
   Tek dosyada: dil, sayaç, maliyet,
   NFT grid, cüzdan modal, deeplink
   dönüşünde sessiz bağlanma, event wiring.
========================= */

(function () {
  const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);
  const $  = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // ---- Dil kurulumu ----
  function setupLang() {
    const saved = localStorage.getItem("zuzu_lang") || "en";
    if (typeof applyLang === "function") applyLang(saved);

    // Dinleyiciler (langMenu hem otomatik hem statik olabiliyor)
    const menu = $("#langMenu");
    if (menu) {
      on(menu, "click", (e) => {
        const li = e.target.closest(".lang-flag");
        if (!li) return;
        const lang = li.dataset.lang || "en";
        localStorage.setItem("zuzu_lang", lang);
        if (typeof applyLang === "function") applyLang(lang);
      });
    }
  }

  // ---- Sayaç & presale maliyetleri ----
  function setupCountdownAndCosts() {
    // anlık güncelleme
    if (typeof tick === "function") tick();
    // interval
    if (!window.__zuzu_tickInterval) {
      window.__zuzu_tickInterval = setInterval(() => {
        if (typeof tick === "function") tick();
      }, 1000);
    }
    // maliyet
    if (typeof updateCosts === "function") updateCosts();
    on($("#buyAmount"), "input", () => {
      if (typeof updateCosts === "function") updateCosts();
    });
    if (typeof updateActiveWeekUI === "function") updateActiveWeekUI();
  }

  // ---- NFT grid (görüntü garantisi) ----
  function ensureNFTGrid() {
    const g = $("#nftGrid");
    // script.js zaten basıyor; ama boşsa tekrar basalım:
    if (g && g.children.length === 0 && typeof CONFIG !== "undefined") {
      try {
        g.innerHTML = (CONFIG.nfts || []).map(n => `
          <div class="nft">
            <img src="assets/images/mask/${n.id}.png"
                 onerror="this.onerror=null;this.src='assets/images/branding/zuzu-logo.png';"
                 alt="${n.name}">
            <div class="meta">
              <div><b>${n.name}</b><div style="color:#9fb6e6">${n.rarity}</div></div>
              <span class="tag">${(n.supply||0).toLocaleString()}</span>
            </div>
            <a class="z-btn z-btn-ghost" style="margin:0 10px 10px"
               href="${CONFIG.collectionUrl}?tokenId=${n.id}" target="_blank" rel="noopener">View ↗</a>
          </div>
        `).join("");
      } catch (e) { console.warn("NFT grid render skip", e); }
    }
  }

  // ---- Cüzdan modal / deeplink dönüşü ----
  function setupWallet() {
    // Connect butonu -> modal
    const connectBtn = $("#connectBtn");
    on(connectBtn, "click", (e) => {
      e.preventDefault();
      if (typeof openWalletModal === "function") {
        openWalletModal();
      } else if (typeof window.showWalletModal === "function") {
        window.showWalletModal();
      } else {
        alert("Wallet module not loaded.");
      }
    });

    // Deeplink dönüşünde sessiz bağlanma (Phantom/Solflare/Backpack)
    async function tryTrusted() {
      // wallet-lite.js uzun sürüm zaten bunu yapıyor; yoksa burada deneriz
      try {
        if (window.solana?.isPhantom) {
          const r = await window.solana.connect({ onlyIfTrusted: true });
          if (r?.publicKey) labelConnected(r.publicKey.toString());
          return;
        }
      } catch {}
      try {
        if (window.solflare?.connect) {
          await window.solflare.connect();
          const pk = window.solflare.publicKey?.toString?.();
          if (pk) labelConnected(pk);
          return;
        }
      } catch {}
      try {
        if (window.backpack?.connect) {
          const res = await window.backpack.connect();
          const pk = (res?.publicKey||res)?.toString?.();
          if (pk) labelConnected(pk);
          return;
        }
      } catch {}
      // wallet-lite export’u varsa onu kullan
      if (typeof window.__zuzu_pk === "function") {
        const pk = window.__zuzu_pk();
        if (pk) labelConnected(pk);
      }
    }

    function labelConnected(pk) {
      if (!pk) return;
      const short = pk.slice(0, 4) + "..." + pk.slice(-4);
      const btn = $("#connectBtn");
      if (btn) btn.textContent = short;
      localStorage.setItem("zuzu_pk", pk);
    }

    // hash / query temizle & bağlanmayı dene
    const q = new URLSearchParams(location.search);
    if (q.has("errorCode") || q.has("phantom_encryption_public_key") || q.has("connected")) {
      // Görsel temiz dönüş için parametreleri temizle
      history.replaceState({}, "", location.pathname);
    }
    tryTrusted();
    window.addEventListener("focus", tryTrusted);
  }

  // ---- Satın alma butonları (script.js handleBuy çağırır) ----
  function setupBuyButtons() {
    ["buyW0","buyW1","buyW2","buyW3"].forEach((id)=>{
      const b = $("#"+id);
      on(b, "click", (e)=>{ e.preventDefault(); /* handleBuy script.js tarafında */ });
    });

    // payment selector default
    const paySel = $("#payWith");
    if (paySel && !paySel.children.length) {
      paySel.innerHTML = `<option value="USDT">USDT (SPL)</option><option value="SOL">SOL</option>`;
    }
  }

  // ---- Invite kutusunu dil değişince yeniden yaz ----
  function observeLangReapply() {
    // Dil değişince yeniden stringleri uygula
    document.addEventListener("zuzu_lang_changed", ()=>{
      const lang = localStorage.getItem("zuzu_lang") || "en";
      if (typeof applyLang === "function") applyLang(lang);
    });
  }

  // ---- INIT ----
  window.addEventListener("DOMContentLoaded", () => {
    setupLang();
    setupCountdownAndCosts();
    ensureNFTGrid();
    setupWallet();
    setupBuyButtons();
    observeLangReapply();
  });
})();
