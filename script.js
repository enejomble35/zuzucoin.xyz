/**
 * ZUZU maskot galerisini güvenli şekilde oluşturur.
 * 1) /assets/zuzu/realistic/<key>.webp -> varsa bunu kullanır
 * 2) /assets/zuzu/realistic/<key>.png -> varsa png fallback
 * 3) /assets/zuzu/svg/zuzu_<key>.svg  -> kesin fallback (svg klasörün var)
 * Her adım HEAD ile test edilir, 200 değilse bir sonrakine geçilir.
 */

const CDN_BUST = `v=${Date.now().toString().slice(-6)}`; // cache kırıcı

// Kartlar
const ZUZU_ITEMS = [
  { key: "hero",      title: "ZUZU Hero" },
  { key: "ranger",    title: "ZUZU Ranger" },
  { key: "warrior",   title: "ZUZU Warrior" },
  { key: "hacker",    title: "ZUZU Hacker" },
  { key: "rogue",     title: "ZUZU Rogue" },
  { key: "titan",     title: "ZUZU Titan" },
  { key: "sorceress", title: "ZUZU Sorceress" },
  { key: "berserker", title: "ZUZU Berserker" },
  { key: "scientist", title: "ZUZU Scientist" },
];

// Yol üretici (sırasıyla denenecek)
const candidates = (key) => ([
  `/assets/zuzu/realistic/${key}.webp?${CDN_BUST}`,
  `/assets/zuzu/realistic/${key}.png?${CDN_BUST}`,
  `/assets/zuzu/svg/zuzu_${key}.svg?${CDN_BUST}`
]);

// URL var mı? -> HEAD ile test
async function urlExists(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
    return res.ok;
  } catch (e) { return false; }
}

// Uygun kaynak çöz
async function resolveSource(key) {
  const list = candidates(key);
  for (const u of list) {
    if (await urlExists(u)) return u;
  }
  return null;
}

// Kart HTML
function createCard({ title }) {
  const el = document.createElement('div');
  el.className = 'zuzu-card';
  el.innerHTML = `
    <img class="zuzu-thumb" src="" alt="${title}" loading="lazy" />
    <div class="zuzu-info">
      <div class="zuzu-title">${title.includes('ZUZU') ? title : `<span class="glow">ZUZU</span> ${title}`}</div>
      <span class="badge chip-loading">yükleniyor…</span>
    </div>
  `;
  return el;
}

// DOM’a bas
async function renderGallery() {
  const root = document.getElementById('zuzu-gallery');
  if (!root) return;

  root.innerHTML = ""; // temizle

  for (const item of ZUZU_ITEMS) {
    const card = createCard(item);
    const img = card.querySelector('.zuzu-thumb');
    const badge = card.querySelector('.badge');

    // kaynağı çöz
    const src = await resolveSource(item.key);
    if (src) {
      img.src = src;
      img.addEventListener('load', () => {
        badge.textContent = 'hazır';
        badge.className = 'badge chip-ok';
      });
      img.addEventListener('error', () => {
        badge.textContent = 'görsel yüklenemedi';
        badge.className = 'badge chip-missing';
      });
    } else {
      // hiçbir kaynak bulunamadı
      img.remove();
      const fallback = document.createElement('div');
      fallback.style = `
         height:260px;display:flex;align-items:center;justify-content:center;
         background:radial-gradient(120px 80px at 50% 30%, #0f2230, #0b141b);
         color:#ffb3b3;font-weight:700;letter-spacing:.3px;border-bottom:1px solid #1a2d3e`;
      fallback.textContent = 'missing';
      card.prepend(fallback);

      badge.textContent = 'dosya yok';
      badge.className = 'badge chip-missing';
    }
    root.appendChild(card);
  }
}

// Başlat
document.addEventListener('DOMContentLoaded', renderGallery);
