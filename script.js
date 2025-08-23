<script>
(function () {
  "use strict";

  /* ------------------------------
   * 1) KURULUM / AYAR
   * ------------------------------ */

  // Görsellerin kök dizini (web sitenin kökünden erişim)
  // Dosyaların konumu: /assets/zuzu/realistic/*.webp
  const BASE = "./assets/zuzu/realistic/";

  // Galeride göstereceğimiz karakterler
  const CHARACTERS = [
    { key: "hero",       title: "ZUZU Hero",       file: "hero.webp" },
    { key: "ranger",     title: "ZUZU Ranger",     file: "ranger.webp" },
    { key: "warrior",    title: "ZUZU Warrior",    file: "warrior.webp" },
    { key: "hacker",     title: "ZUZU Hacker",     file: "hacker.webp" },
    { key: "rogue",      title: "ZUZU Rogue",      file: "rogue.webp" },
    { key: "titan",      title: "ZUZU Titan",      file: "titan.webp" },
    { key: "sorceress",  title: "ZUZU Sorceress",  file: "sorceress.webp" },
    { key: "berserker",  title: "ZUZU Berserker",  file: "berserker.webp" },
    { key: "scientist",  title: "ZUZU Scientist",  file: "scientist.webp" },
  ];

  // Maskot galerisi için kullanılabilecek muhtemel hedefler:
  const SELECTORS = [
    "#zuzu-gallery",          // varsa direkt
    ".zuzu-gallery",
    ".maskot-grid",
    ".maskot-gallery",
    "#gallery",
  ];

  /* ------------------------------
   * 2) CSS'İ OTOMATİK ENJEKTE ET
   * ------------------------------ */
  const css = `
  /* ZUZU – Realistic Maskot Galerisi (auto-injected) */
  .zuzu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 14px;
  }
  .zuzu-card {
    position: relative;
    aspect-ratio: 16/10;
    border-radius: 14px;
    overflow: hidden;
    background: #0d1320;
    box-shadow: 0 10px 22px rgba(0,0,0,0.35);
    transform: translateY(6px);
    opacity: 0;
    transition: opacity .5s ease, transform .5s ease, box-shadow .4s ease;
  }
  .zuzu-card.show {
    opacity: 1;
    transform: translateY(0);
  }
  .zuzu-img {
    position: absolute; inset: 0;
    background-size: cover;
    background-position: center;
    filter: brightness(.92) saturate(1.05);
    transition: transform .6s ease, filter .6s ease;
  }
  .zuzu-card:hover .zuzu-img,
  .zuzu-card:focus .zuzu-img {
    transform: scale(1.06);
    filter: brightness(1) saturate(1.1);
  }
  .zuzu-glow {
    position: absolute; inset: 0;
    background: radial-gradient(120px 120px at 75% 75%, rgba(0,255,255,0.15), transparent 65%),
                radial-gradient(180px 180px at 25% 25%, rgba(0,180,255,0.12), transparent 70%);
    mix-blend-mode: screen;
    animation: zuzuPulse 3s ease-in-out infinite;
    pointer-events: none;
  }
  @keyframes zuzuPulse {
    0%, 100% { opacity: .5; }
    50% { opacity: .9; }
  }
  .zuzu-name {
    position: absolute; left: 12px; bottom: 10px;
    padding: 6px 10px;
    color: #eaf7ff;
    font-weight: 800;
    letter-spacing: .4px;
    font-size: 14px;
    border-radius: 8px;
    background: linear-gradient(120deg, rgba(0,0,0,.55), rgba(0,0,0,.25));
    border: 1px solid rgba(255,255,255,.07);
    backdrop-filter: blur(4px);
    text-shadow: 0 1px 0 rgba(0,0,0,.6);
  }

  /* Modal */
  .zuzu-modal {
    position: fixed; inset: 0; z-index: 9999;
    display: none; align-items: center; justify-content: center;
    background: rgba(0,0,0,.75);
    backdrop-filter: blur(2px);
  }
  .zuzu-modal.show { display:flex; }
  .zuzu-modal-imgwrap {
    position: relative;
    max-width: 92vw; max-height: 86vh;
    border-radius: 16px; overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,.6);
    animation: modalIn .35s ease;
  }
  @keyframes modalIn {
    from { transform: scale(.94); opacity: .6; }
    to   { transform: scale(1);    opacity: 1;  }
  }
  .zuzu-modal-img {
    display:block; max-width:100%; max-height:86vh;
    object-fit: contain; background:#0b111b;
  }
  .zuzu-modal-close {
    position:absolute; top:8px; right:8px;
    background: rgba(0,0,0,.6); color:#dff9ff;
    font-weight:800; border:none; border-radius:10px;
    padding:6px 10px; cursor:pointer;
    transition: background .2s ease;
  }
  .zuzu-modal-close:hover { background: rgba(0,0,0,.8); }
  `;

  const styleEl = document.createElement("style");
  styleEl.innerHTML = css;
  document.head.appendChild(styleEl);

  /* ------------------------------
   * 3) HEDEF BÖLÜMÜ BUL / OLUŞTUR
   * ------------------------------ */
  function findOrCreateGalleryMount() {
    for (const sel of SELECTORS) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    // Yoksa, "ZUZU Maskot Galerisi" başlığının altına oluştur
    const allH2 = [...document.querySelectorAll("h2, h3")];
    const anchor = allH2.find(h =>
      /maskot/i.test(h.textContent || "")
      || /gallery/i.test(h.textContent || "")
    );
    const mount = document.createElement("div");
    mount.id = "zuzu-gallery";
    mount.style.marginTop = "12px";
    if (anchor && anchor.parentElement) {
      anchor.parentElement.appendChild(mount);
    } else {
      document.body.appendChild(mount);
    }
    return mount;
  }

  const mountEl = findOrCreateGalleryMount();

  // Eski Lottie/SVG placeholder’ları temizle
  // (galeri alanında .lottie, .lottie-container, svg vb. bulursa kaldırır)
  function cleanPlaceholders(root) {
    const bad = root.querySelectorAll(".lottie, .lottie-container, svg, canvas");
    bad.forEach(el => el.remove());
  }
  cleanPlaceholders(mountEl);

  /* ------------------------------
   * 4) GALERİYİ RENDER ET
   * ------------------------------ */
  function renderGallery() {
    // Grid'i oluştur
    const grid = document.createElement("div");
    grid.className = "zuzu-grid";
    mountEl.innerHTML = ""; // tamamen yenile
    mountEl.appendChild(grid);

    // IntersectionObserver (fade-in)
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("show");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });

    // Kartları ekle
    CHARACTERS.forEach(ch => {
      const url = BASE + ch.file;

      const card = document.createElement("div");
      card.className = "zuzu-card";
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", ch.title);

      const img = document.createElement("div");
      img.className = "zuzu-img";
      img.style.backgroundImage = `url('${url}')`;
      img.dataset.src = url;

      // yumuşak parıltı
      const glow = document.createElement("div");
      glow.className = "zuzu-glow";

      const name = document.createElement("div");
      name.className = "zuzu-name";
      name.textContent = ch.title;

      // Fallback: resim yüklenmezse arka planı gradient yap
      const probe = new Image();
      probe.onload = () => { /* OK */ };
      probe.onerror = () => {
        img.style.backgroundImage =
          "radial-gradient(120px 120px at 70% 70%, rgba(0,255,255,.15), transparent 60%), linear-gradient(180deg,#0f172a,#0b1320)";
      };
      probe.src = url;

      // Modal tetikleyici
      function open() { openModal(url, ch.title); }
      card.addEventListener("click", open);
      card.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); open(); }
      });

      card.appendChild(img);
      card.appendChild(glow);
      card.appendChild(name);
      grid.appendChild(card);
      io.observe(card);
    });
  }

  /* ------------------------------
   * 5) MODAL (Büyüt – Tek tık)
   * ------------------------------ */
  let modalEl = null;
  function ensureModal() {
    if (modalEl) return modalEl;
    modalEl = document.createElement("div");
    modalEl.className = "zuzu-modal";
    modalEl.innerHTML = `
      <div class="zuzu-modal-imgwrap">
        <button class="zuzu-modal-close" aria-label="Kapat">✕</button>
        <img class="zuzu-modal-img" alt="ZUZU">
      </div>
    `;
    document.body.appendChild(modalEl);
    modalEl.addEventListener("click", (e) => {
      if (e.target === modalEl) modalEl.classList.remove("show");
    });
    modalEl.querySelector(".zuzu-modal-close").addEventListener("click", () => {
      modalEl.classList.remove("show");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") modalEl.classList.remove("show");
    });
    return modalEl;
  }
  function openModal(src, title) {
    const m = ensureModal();
    const img = m.querySelector(".zuzu-modal-img");
    img.src = src;
    img.alt = title;
    m.classList.add("show");
  }

  /* ------------------------------
   * 6) ÇALIŞTIR
   * ------------------------------ */
  document.addEventListener("DOMContentLoaded", renderGallery);

})();
</script>
