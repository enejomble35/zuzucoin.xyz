/* ZUZU — Realistic Gallery Loader
 * v1.3 — tek parça, butonsuz, hata dayanıklı
 * enejomble35 — 2025
 */

// ---------- Yapılandırma ----------
const CHARACTERS = [
  { key: "logo",      title: "ZUZU Logo",      file: "logo.webp",       optional: true }, // Varsa
  { key: "hero",      title: "ZUZU Hero",      file: "hero.webp" },
  { key: "ranger",    title: "ZUZU Ranger",    file: "ranger.webp" },
  { key: "warrior",   title: "ZUZU Warrior",   file: "warrior.webp" },
  { key: "hacker",    title: "ZUZU Hacker",    file: "hacker.webp" },
  { key: "rogue",     title: "ZUZU Rogue",     file: "rogue.webp" },
  { key: "titan",     title: "ZUZU Titan",     file: "titan.webp" },
  { key: "sorceress", title: "ZUZU Sorceress", file: "sorceress.webp" },
  { key: "berserker", title: "ZUZU Berserker", file: "berserker.webp" },
  { key: "scientist", title: "ZUZU Scientist", file: "scientist.webp" },
  { key: "maiden",    title: "ZUZU Maiden",    file: "maiden.webp", optional: true } // İstersen
];

// Kaynak klasör (domain kökü)
const REALISTIC_BASE = "/assets/zuzu/realistic/";

// ---------- Yardımcılar ----------
function $(sel, root = document) { return root.querySelector(sel); }
function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

function getGalleryRoot() {
  return $("#zuzu-gallery") || $("#gallery-grid") || $("#mascot-grid") || $(".gallery-grid");
}

function preload(imgUrl) {
  return new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(imgUrl);
    i.onerror = (err) => reject(err);
    i.src = imgUrl;
  });
}

// ---------- Kart Oluşturucu ----------
function createCard(item) {
  const card = el("div", "zuzu-card");
  const inner = el("div", "zuzu-card-inner");
  const img = el("img", "zuzu-img");
  img.alt = item.title;
  img.loading = "lazy";
  img.decoding = "async";
  img.src = REALISTIC_BASE + item.file;

  const cap = el("div", "zuzu-cap", `<span>${item.title}</span>`);

  inner.appendChild(img);
  inner.appendChild(cap);
  card.appendChild(inner);

  // Modal açılsın
  card.addEventListener("click", () => openModal(item.title, img.src));

  // Hata yakalama — görsel yoksa placeholder
  img.onerror = () => {
    card.classList.add("zuzu-error");
    inner.innerHTML = `
      <div class="zuzu-fallback">
        <div class="dot"></div><div class="dot"></div><div class="dot"></div>
      </div>
      <div class="zuzu-cap"><span>${item.title} (missing)</span></div>
    `;
    console.warn("[ZUZU] Görsel bulunamadı:", item.file);
  };

  return card;
}

// ---------- Modal ----------
let modal, modalImg, modalTitle, modalClose;
function ensureModal() {
  if ($("#zuzu-modal")) return;
  modal = el("div", "zuzu-modal");
  modal.id = "zuzu-modal";
  modal.innerHTML = `
    <div class="zuzu-modal-backdrop"></div>
    <div class="zuzu-modal-box">
      <button class="zuzu-modal-close" aria-label="Close">✕</button>
      <img class="zuzu-modal-img" alt="">
      <div class="zuzu-modal-title"></div>
    </div>
  `;
  document.body.appendChild(modal);
  modalImg = $(".zuzu-modal-img", modal);
  modalTitle = $(".zuzu-modal-title", modal);
  modalClose = $(".zuzu-modal-close", modal);

  modal.addEventListener("click", (e) => {
    if (e.target.classList.contains("zuzu-modal-backdrop") || e.target === modalClose)
      modal.classList.remove("show");
  });
}

function openModal(title, src) {
  ensureModal();
  modalImg.src = src;
  modalTitle.textContent = title;
  $("#zuzu-modal").classList.add("show");
}

// ---------- Galeriyi Bas ----------
async function buildGallery() {
  const root = getGalleryRoot();
  if (!root) {
    console.error("[ZUZU] Galeri kökü bulunamadı. Lütfen HTML’de id='zuzu-gallery' ekleyin.");
    return;
  }

  // İlk boşalt
  root.innerHTML = "";

  // Grid sınıfını ekle, yoksa stil uygulanmıyor
  root.classList.add("zuzu-grid");

  // Logo ve Maiden opsiyonel; dosya yoksa atmıyoruz
  const tasks = CHARACTERS.map(async (it) => {
    const url = REALISTIC_BASE + it.file;

    try {
      await preload(url);
      root.appendChild(createCard(it));
    } catch (e) {
      if (!it.optional) {
        // Zorunlu olanlar hata olsa bile fallback’li kart basılsın
        const c = createCard(it);
        $(".zuzu-img", c).remove(); // fallback için temizle
        c.querySelector(".zuzu-card-inner").innerHTML = `
          <div class="zuzu-fallback">
            <div class="dot"></div><div class="dot"></div><div class="dot"></div>
          </div>
          <div class="zuzu-cap"><span>${it.title} (missing)</span></div>
        `;
        root.appendChild(c);
      } else {
        console.warn("[ZUZU] Opsiyonel görsel yok atlandı:", it.file);
      }
    }
  });

  await Promise.allSettled(tasks);
  console.log("[ZUZU] Galeri yüklendi:", root.children.length, "öğe");
}

// ---------- Başlat ----------
document.addEventListener("DOMContentLoaded", buildGallery);

// ---------- Minimum CSS (kritik stiller, sayfaya enjekte) ----------
(function injectCriticalCSS() {
  const css = `
  .zuzu-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}
  .zuzu-card{background:#0e1625;border-radius:14px;overflow:hidden;box-shadow:0 0 0 1px rgba(255,255,255,.04) inset;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease}
  .zuzu-card:hover{transform:translateY(-2px);box-shadow:0 6px 14px rgba(0,0,0,.35),0 0 0 1px rgba(79,209,197,.18) inset}
  .zuzu-card-inner{position:relative;aspect-ratio:16/11;display:flex;align-items:flex-end;justify-content:center;background:radial-gradient(120% 120% at 50% 0%,rgba(79,209,197,.12),rgba(0,0,0,.5))}
  .zuzu-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:drop-shadow(0 0 10px rgba(79,209,197,.18))}
  .zuzu-card:hover .zuzu-img{filter:drop-shadow(0 0 16px rgba(79,209,197,.28))}
  .zuzu-cap{position:relative;z-index:2;width:100%;background:linear-gradient(180deg,transparent,rgba(0,0,0,.75));padding:12px 14px}
  .zuzu-cap span{font-size:14px;color:#d6e6f0;letter-spacing:.3px}
  .zuzu-error{outline:1px dashed rgba(255,105,105,.35)}
  .zuzu-fallback{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:10px}
  .zuzu-fallback .dot{width:10px;height:10px;border-radius:50%;background:#4fd1c5;opacity:.5;animation:bubble 1.2s infinite ease-in-out}
  .zuzu-fallback .dot:nth-child(2){animation-delay:.15s}.zuzu-fallback .dot:nth-child(3){animation-delay:.3s}
  @keyframes bubble{0%,80%,100%{transform:scale(.6)}40%{transform:scale(1)}}

  /* Modal */
  .zuzu-modal{position:fixed;inset:0;display:none;z-index:9999}
  .zuzu-modal.show{display:block}
  .zuzu-modal-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.65);backdrop-filter:blur(2px)}
  .zuzu-modal-box{position:absolute;inset:auto;left:50%;top:50%;transform:translate(-50%,-50%);max-width:min(92vw,1100px);width:92vw;background:#0b1320;border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.55);padding:14px}
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
