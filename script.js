/* ZUZU Realistic Gallery – v2.4
 * Kendi konteynerini kurar, yol otomatik çözülür, cache-bust + fallback yapar.
 * enejomble35 — 2025-08-11
 */
(function () {
  const DEBUG = true; // sorun olursa konsola özet düşer

  // ---- 1) Yapılandırma ----
  const BASE_LOCAL = "/assets/zuzu/realistic/";
  const BASE_RAW = "https://raw.githubusercontent.com/enejomble35/zuzucoin.xyz/main/assets/zuzu/realistic/";
  const VERSION = "v2408111255"; // cache-bust için

  const ITEMS = [
    { key: "hero",      title: "ZUZU Hero",      file: "hero.webp" },
    { key: "ranger",    title: "ZUZU Ranger",    file: "ranger.webp" },
    { key: "warrior",   title: "ZUZU Warrior",   file: "warrior.webp" },
    { key: "hacker",    title: "ZUZU Hacker",    file: "hacker.webp" },
    { key: "rogue",     title: "ZUZU Rogue",     file: "rogue.webp" },
    { key: "titan",     title: "ZUZU Titan",     file: "titan.webp" },
    { key: "sorceress", title: "ZUZU Sorceress", file: "sorceress.webp" },
    { key: "berserker", title: "ZUZU Berserker", file: "berserker.webp" },
    { key: "scientist", title: "ZUZU Scientist", file: "scientist.webp" },
    // { key: "maiden",    title: "ZUZU Maiden",    file: "maiden.webp", optional:true },
  ];

  // ---- 2) Yardımcılar ----
  const $ = (s, r = document) => r.querySelector(s);
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h) e.innerHTML = h; return e; };
  const once = (fn) => { let d = false; return (...a) => { if (!d) { d = true; fn(...a); } }; };

  function preload(url) {
    return new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(url);
      i.onerror = (e) => rej(e);
      i.src = url;
    });
  }

  function pickSource(file) {
    // 1) site içi, 2) github raw fallback
    const local = BASE_LOCAL + file + "?" + VERSION;
    const raw   = BASE_RAW   + file + "?" + VERSION;
    return preload(local).then(() => local).catch(() => raw);
  }

  function findOrCreateGalleryRoot() {
    // Var olanlardan birini bul; hiçbiri yoksa başlığı yakalayıp altına kur
    let root = $("#zuzu-gallery") || $("#gallery-grid") || $("#mascot-grid") || $(".gallery-grid");
    if (root) return root;

    // Başlık metnini bularak altında alan aç
    const headings = Array.from(document.querySelectorAll("h2,h3,h4"));
    let anchor = headings.find(h => /maskot|galeri/i.test(h.textContent || ""));
    if (!anchor) {
      // Bölüm kartını ara
      anchor = Array.from(document.querySelectorAll("section,div"))
        .find(n => /ZUZU\s*Maskot\s*Galerisi/i.test(n.textContent || ""));
    }
    if (!anchor) anchor = $("main") || $("body");

    root = el("div");
    root.id = "zuzu-gallery";
    anchor.parentNode.insertBefore(root, anchor.nextSibling);
    return root;
  }

  // ---- 3) Kart ve Modal ----
  function card(item, src) {
    const c = el("div", "zuzu-card");
    const inner = el("div", "zuzu-card-inner");
    const img = el("img", "zuzu-img");
    img.src = src;
    img.alt = item.title;
    img.loading = "lazy";
    img.decoding = "async";
    const cap = el("div", "zuzu-cap", `<span>${item.title}</span>`);
    inner.append(img, cap);
    c.appendChild(inner);
    c.addEventListener("click", () => openModal(item.title, src));
    img.onerror = () => {
      c.classList.add("zuzu-error");
      inner.innerHTML = `
        <div class="zuzu-fallback"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
        <div class="zuzu-cap"><span>${item.title} (missing)</span></div>
      `;
    };
    return c;
  }

  let modalEl, modalImg, modalTitle;
  const ensureModal = once(() => {
    modalEl = el("div", "zuzu-modal"); modalEl.id = "zuzu-modal";
    modalEl.innerHTML = `
      <div class="zuzu-modal-backdrop"></div>
      <div class="zuzu-modal-box">
        <button class="zuzu-modal-close" aria-label="Close">✕</button>
        <img class="zuzu-modal-img" alt="">
        <div class="zuzu-modal-title"></div>
      </div>`;
    document.body.appendChild(modalEl);
    modalImg = $(".zuzu-modal-img", modalEl);
    modalTitle = $(".zuzu-modal-title", modalEl);
    modalEl.addEventListener("click", e => {
      if (e.target.classList.contains("zuzu-modal-backdrop") || e.target.classList.contains("zuzu-modal-close"))
        modalEl.classList.remove("show");
    });
  });

  function openModal(title, src) {
    ensureModal();
    modalImg.src = src;
    modalTitle.textContent = title;
    modalEl.classList.add("show");
  }

  // ---- 4) CSS (kritik stiller enjekte) ----
  (function injectCSS() {
    const css = `
    .zuzu-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;margin-top:10px}
    .zuzu-card{background:#0e1625;border-radius:14px;overflow:hidden;box-shadow:0 0 0 1px rgba(255,255,255,.04) inset;cursor:pointer;transition:transform .18s ease,box-shadow .18s ease}
    .zuzu-card:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,.35),0 0 0 1px rgba(79,209,197,.18) inset}
    .zuzu-card-inner{position:relative;aspect-ratio:16/11;display:flex;align-items:flex-end;justify-content:center;background:radial-gradient(120% 120% at 50% 0%,rgba(79,209,197,.12),rgba(0,0,0,.55))}
    .zuzu-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:drop-shadow(0 0 10px rgba(79,209,197,.18))}
    .zuzu-cap{position:relative;z-index:2;width:100%;background:linear-gradient(180deg,transparent,rgba(0,0,0,.75));padding:12px 14px}
    .zuzu-cap span{font-size:14px;color:#d6e6f0;letter-spacing:.3px}
    .zuzu-error{outline:1px dashed rgba(255,105,105,.35)}
    .zuzu-fallback{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:10px}
    .zuzu-fallback .dot{width:10px;height:10px;border-radius:50%;background:#4fd1c5;opacity:.5;animation:bubble 1.2s infinite ease-in-out}
    .zuzu-fallback .dot:nth-child(2){animation-delay:.15s}.zuzu-fallback .dot:nth-child(3){animation-delay:.3s}
    @keyframes bubble{0%,80%,100%{transform:scale(.6)}40%{transform:scale(1)}}
    .zuzu-modal{position:fixed;inset:0;display:none;z-index:9999}
    .zuzu-modal.show{display:block}
    .zuzu-modal-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.65);backdrop-filter:blur(2px)}
    .zuzu-modal-box{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);max-width:min(92vw,1100px);width:92vw;background:#0b1320;border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.55);padding:14px}
    .zuzu-modal-img{width:100%;height:auto;border-radius:10px;display:block}
    .zuzu-modal-title{margin-top:10px;color:#d6e6f0;text-align:center;font-weight:600}
    .zuzu-modal-close{position:absolute;right:10px;top:10px;background:rgba(255,255,255,.06);border:0;color:#fff;width:34px;height:34px;border-radius:8px;cursor:pointer}
    .zuzu-modal-close:hover{background:rgba(255,255,255,.12)}
    `;
    const tag = document.createElement("style");
    tag.id = "zuzu-critical-css";
    tag.textContent = css;
    document.head.appendChild(tag);
  })();

  // ---- 5) Başlat ----
  async function init() {
    const root = findOrCreateGalleryRoot();
    root.classList.add("zuzu-grid");
    root.innerHTML = ""; // boşalt

    // Her görsel için kaynak seç + kart bas
    const results = await Promise.allSettled(ITEMS.map(async it => {
      try {
        const src = await pickSource(it.file);
        root.appendChild(card(it, src));
        return { ok: true, file: it.file, src };
      } catch (e) {
        // Opsiyonel değilse yine de fallback’li kart bas
        const c = el("div", "zuzu-card zuzu-error");
        c.innerHTML = `
          <div class="zuzu-card-inner">
            <div class="zuzu-fallback"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
            <div class="zuzu-cap"><span>${it.title} (missing)</span></div>
          </div>`;
        root.appendChild(c);
        return { ok: false, file: it.file, error: e?.message || e };
      }
    }));

    if (DEBUG) console.log("[ZUZU] gallery results:", results);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
