// =============================
// Language Manager (lang.js)
// =============================

// Desteklenen diller
const SUPPORTED = ["en", "tr", "fr", "pt", "ru"];
const FALLBACK = "en";

// Tarayıcı dilini veya daha önce seçileni bul
function getInitialLang() {
  const saved = localStorage.getItem("lang");
  if (saved && SUPPORTED.includes(saved)) return saved;

  const nav = navigator.language.slice(0, 2).toLowerCase();
  if (SUPPORTED.includes(nav)) return nav;

  return FALLBACK;
}

// JSON sözlüğünü yükle
async function loadDict(lang) {
  const pick = SUPPORTED.includes(lang) ? lang : FALLBACK;
  try {
    const res = await fetch(`/lang/${pick}.json?v=1`);
    if (!res.ok) throw new Error("dict fetch error");
    return await res.json();
  } catch (e) {
    console.error("Dil dosyası yüklenemedi:", e);
    if (pick !== FALLBACK) {
      const res = await fetch(`/lang/${FALLBACK}.json?v=1`);
      return await res.json();
    }
    return {};
  }
}

// Çevirileri uygula
async function applyLang(lang) {
  const dict = await loadDict(lang);

  // data-i18n attribute'una sahip elementleri değiştir
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.innerText = dict[key];
    }
  });

  // seçilen dili kaydet
  localStorage.setItem("lang", lang);

  // seçili bayrağı işaretle
  document.querySelectorAll(".lang-flag").forEach(flag => {
    flag.classList.toggle("active", flag.dataset.lang === lang);
  });
}

// Dil seçme menüsünü hazırla
function setupLangSelector() {
  const container = document.getElementById("lang-select");
  if (!container) return;

  container.innerHTML = ""; // önce temizle

  SUPPORTED.forEach(code => {
    const img = document.createElement("img");
    img.src = `/flags/${code}.png`;
    img.alt = code;
    img.dataset.lang = code;
    img.className = "lang-flag";
    img.style.cursor = "pointer";
    img.style.width = "32px";
    img.style.height = "24px";
    img.style.margin = "0 5px";

    img.addEventListener("click", () => {
      applyLang(code);
    });

    container.appendChild(img);
  });
}

// İlk yükleme
document.addEventListener("DOMContentLoaded", () => {
  setupLangSelector();
  const initLang = getInitialLang();
  applyLang(initLang);
});
