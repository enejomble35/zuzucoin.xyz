/* =========================================================
 * ZUZU — Front Script (Maskot Galerisi + Görsel Yükleyici)
 * Tüm yollar düzeltildi, SVG fallback eklendi, GIF butonu kaldırıldı
 * ========================================================= */

/* ------------------------ Konfig ------------------------ */
const ZUZU_MASKOTS = [
  {
    id: 'logo',
    name: 'ZUZU Logo',
    // Realistic klasörde logo yok, bilinçli olarak svg gösteriyoruz:
    img: null,
    svg: '/assets/zuzu/svg/zuzu_logo.svg',
    fx: 'glow'
  },
  {
    id: 'hero',
    name: 'ZUZU Hero',
    img: './assets/zuzu/realistic/hero.webp',
    svg: '/assets/zuzu/svg/zuzu_hero.svg',
    fx: 'aura'
  },
  {
    id: 'hacker',
    name: 'ZUZU Hacker',
    img: './assets/zuzu/realistic/hacker.webp',
    svg: '/assets/zuzu/svg/zuzu_hacker.svg',
    fx: 'scan'
  },
  {
    id: 'warrior',
    name: 'ZUZU Warrior',
    img: './assets/zuzu/realistic/warrior.webp',
    svg: '/assets/zuzu/svg/zuzu_warrior.svg',
    fx: 'slash'
  },
  {
    id: 'sorceress',
    name: 'ZUZU Sorceress',
    img: './assets/zuzu/realistic/sorceress.webp',
    svg: '/assets/zuzu/svg/zuzu_sorceress.svg',
    fx: 'orb'
  },
  {
    id: 'ranger',
    name: 'ZUZU Ranger',
    img: './assets/zuzu/realistic/ranger.webp',
    svg: '/assets/zuzu/svg/zuzu_warrior.svg', // yedek olarak warrior svg kullan
    fx: 'focus'
  },
  {
    id: 'berserker',
    name: 'ZUZU Berserker',
    img: './assets/zuzu/realistic/berserker.webp',
    svg: '/assets/zuzu/svg/zuzu_warrior.svg', // yedek
    fx: 'embers'
  },
  {
    id: 'scientist',
    name: 'ZUZU Scientist',
    img: './assets/zuzu/realistic/scientist.webp',
    svg: '/assets/zuzu/svg/zuzu_hacker.svg', // yedek
    fx: 'grid'
  },
  {
    id: 'rogue',
    name: 'ZUZU Rogue',
    img: './assets/zuzu/realistic/rogue.webp',
    svg: '/assets/zuzu/svg/zuzu_hacker.svg', // yedek
    fx: 'pulse'
  },
  {
    id: 'titan',
    name: 'ZUZU Titan',
    img: './assets/zuzu/realistic/titan.webp',
    svg: '/assets/zuzu/svg/zuzu_warrior.svg', // yedek
    fx: 'shield'
  }
];

/* --------------------- Yardımcılar ---------------------- */
function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return [...root.querySelectorAll(sel)]; }

function findMaskotElement(id) {
  // Farklı HTML düzenlerine uyum için birden fazla seçici:
  const selectors = [
    `[data-maskot="${id}"]`,
    `#maskot-${id}`,
    `#${id}`,
    `.maskot-${id}`,
    `.card-${id}`,
    `.zuzu-${id}`
  ];
  for (const s of selectors) {
    const el = qs(s);
    if (el) return el;
  }
  return null;
}

function setBackgroundImage(el, url, fallbackSvg) {
  if (!el) return;
  const img = new Image();
  img.onload = () => {
    el.style.backgroundImage = `url('${img.src}')`;
    el.classList.add('loaded');
  };
  img.onerror = () => {
    if (fallbackSvg) {
      el.style.backgroundImage = `url('${fallbackSvg}')`;
    }
    el.classList.add('loaded', 'fallback');
  };
  if (url) {
    img.src = url;
  } else {
    // hiç webp yoksa direkt svg
    el.style.backgroundImage = `url('${fallbackSvg}')`;
    el.classList.add('loaded', 'fallback');
  }
}

function attachFx(el, fxName) {
  if (!el) return;
  // CSS tarafında karşılığı olan sınıfları ekliyoruz
  // (ör: .fx-glow, .fx-scan, .fx-orb, .fx-grid ...)
  el.classList.add(`fx-${fxName}`);
}

/* Görsel container'ının içinde gerçek imaj tutmak için bir iç katman ekle */
function ensureImageLayer(el) {
  if (!el) return null;
  let layer = el.querySelector('.img');
  if (!layer) {
    layer = document.createElement('div');
    layer.className = 'img';
    el.appendChild(layer);
  }
  return layer;
}

/* Alt yazı (isim) sabitleme */
function setCaption(el, name) {
  if (!el) return;
  let cap = el.querySelector('.caption');
  if (!cap) {
    cap = document.createElement('div');
    cap.className = 'caption';
    el.appendChild(cap);
  }
  cap.textContent = name;
}

/* -------------------- Giriş Noktası --------------------- */
function initMaskotGallery() {
  ZUZU_MASKOTS.forEach(m => {
    const card = findMaskotElement(m.id);
    if (!card) return;

    card.setAttribute('data-id', m.id);
    card.setAttribute('aria-label', m.name);
    card.classList.add('zuzu-card');

    const imgLayer = ensureImageLayer(card);
    setBackgroundImage(imgLayer, m.img, m.svg);
    attachFx(card, m.fx);
    setCaption(card, m.name);

    // Eski kodlardan kalma "gif indir" vb. düğmeleri temizle:
    qsa('.gif-btn, .gif-download, .btn-gif, .gif-indir', card).forEach(b => b.remove());
  });

  // Görünümdeyken animasyon başlat (CSS'te .animate karşılığı olmalı)
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animate');
      }
    });
  }, { threshold: 0.2 });

  qsa('.zuzu-card').forEach(el => io.observe(el));
}

/* -------------------- Sayfa Hazır ----------------------- */
document.addEventListener('DOMContentLoaded', () => {
  try {
    initMaskotGallery();
  } catch (err) {
    console.error('ZUZU init error:', err);
  }
});

/* -------------------- Global (debug) -------------------- */
window.ZUZU = {
  MASKOTS: ZUZU_MASKOTS,
  reload: initMaskotGallery
};
