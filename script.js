/* =========================================================
 * ZUZU Front Script — Realistic Maskot Görüntüleyici
 * - Realistic WEBP yükler, SVG fallback
 * - Kart içindeki lottie/canvas/svg katmanlarını kaldırır
 * - "GIF indir" metinlerini yok eder
 * - Seçici esnek: farklı HTML yapılara uyumlu
 * ========================================================= */

const MASKOTS = [
  { id:'logo',      name:'ZUZU Logo',      webp:null,                                  svg:'/assets/zuzu/svg/zuzu_logo.svg',     fx:'glow'   },
  { id:'hero',      name:'ZUZU Hero',      webp:'/assets/zuzu/realistic/hero.webp',    svg:'/assets/zuzu/svg/zuzu_hero.svg',     fx:'aura'   },
  { id:'hacker',    name:'ZUZU Hacker',    webp:'/assets/zuzu/realistic/hacker.webp',  svg:'/assets/zuzu/svg/zuzu_hacker.svg',   fx:'scan'   },
  { id:'warrior',   name:'ZUZU Warrior',   webp:'/assets/zuzu/realistic/warrior.webp', svg:'/assets/zuzu/svg/zuzu_warrior.svg',  fx:'slash'  },
  { id:'sorceress', name:'ZUZU Sorceress', webp:'/assets/zuzu/realistic/sorceress.webp',svg:'/assets/zuzu/svg/zuzu_sorceress.svg',fx:'orb'    },
  { id:'ranger',    name:'ZUZU Ranger',    webp:'/assets/zuzu/realistic/ranger.webp',  svg:'/assets/zuzu/svg/zuzu_warrior.svg',  fx:'focus'  },
  { id:'berserker', name:'ZUZU Berserker', webp:'/assets/zuzu/realistic/berserker.webp',svg:'/assets/zuzu/svg/zuzu_warrior.svg', fx:'embers' },
  { id:'scientist', name:'ZUZU Scientist', webp:'/assets/zuzu/realistic/scientist.webp',svg:'/assets/zuzu/svg/zuzu_hacker.svg',  fx:'grid'   },
  { id:'rogue',     name:'ZUZU Rogue',     webp:'/assets/zuzu/realistic/rogue.webp',   svg:'/assets/zuzu/svg/zuzu_hacker.svg',   fx:'pulse'  },
  { id:'titan',     name:'ZUZU Titan',     webp:'/assets/zuzu/realistic/titan.webp',   svg:'/assets/zuzu/svg/zuzu_warrior.svg',  fx:'shield' }
];

// ---- Yardımcılar
const qs  = (s, r=document)=>r.querySelector(s);
const qsa = (s, r=document)=>[...r.querySelectorAll(s)];

// Kartları olası tüm seçicilerle yakala
function collectCards() {
  const selectors = [
    '.maskot-card', '.zuzu-maskot-card', '.maskot .card', '.maskot-grid .card',
    '.zuzu-maskots .card', '.gallery-maskots .card', '.cards .card', '.grid .card',
    '.maskots .item', '.maskot-grid .item', '.z-grid .cell', '.z-card', '.card'
  ];
  let cards = [];
  selectors.some(sel => {
    const arr = qsa(sel);
    if (arr.length >= 10) { cards = arr; return true; }
    return false;
  });
  if (!cards.length) cards = qsa('.card'); // son çare
  return cards;
}

// Kartın başlığından kimlik üret (ZUZU Hero -> hero)
function idFromTitle(text='') {
  const t = (text || '').toLowerCase().trim();
  for (const m of MASKOTS) {
    const key = m.name.toLowerCase().replace('zuzu','').trim();
    if (t.includes(key)) return m.id;
  }
  return null;
}

// Kart içinde lottie/canvas/svg vs’leri kaldır
function purgeOverlays(card) {
  if (!card) return;
  const junkSel = [
    '.lottie', '.lottie-animation', '[data-lottie]', '.lottie-container',
    'canvas', 'svg'
  ].join(',');
  qsa(junkSel, card).forEach(node => {
    // Sadece kartın kendi overlaylerini kaldır; ikon/badge ise dokunma:
    if (node.closest('.caption') || node.closest('.badge')) return;
    node.remove();
  });

  // "GIF indir" metinli buton/link/rozetleri yok et
  qsa('button, a, span, div', card).forEach(n => {
    const txt = (n.textContent || '').toLowerCase();
    if (txt.includes('gif indir') || txt.includes('gif') && txt.includes('indir')) {
      n.remove();
    }
  });
}

// Görsel katmanı oluştur + inline style (üstte ve tam kapla)
function ensureImageLayer(card) {
  let layer = qs('.img', card);
  if (!layer) {
    layer = document.createElement('div');
    layer.className = 'img';
    card.appendChild(layer);
  }
  // Kartı konumlandır
  card.style.position   = card.style.position || 'relative';
  card.style.overflow   = 'hidden';

  // Görsel katmanı üstte
  Object.assign(layer.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: '2',
    borderRadius: 'inherit',
    opacity: '1'
  });

  // Caption (isim) — en üste
  let cap = qs('.caption', card);
  if (!cap) {
    cap = document.createElement('div');
    cap.className = 'caption';
    card.appendChild(cap);
  }
  Object.assign(cap.style, {
    position:'absolute', left:'10px', bottom:'10px', zIndex:'3',
    color:'#cfe9ff', fontWeight:'700', fontSize:'13px',
    letterSpacing:'0.3px', textShadow:'0 1px 6px rgba(0,0,0,.6)'
  });

  return layer;
}

// Resim yükle; başarısızsa svg fallback
function setBackground(el, webp, svg) {
  if (!el) return;
  if (!webp) {
    el.style.backgroundImage = `url('${svg}')`;
    return;
  }
  const img = new Image();
  img.onload = () => { el.style.backgroundImage = `url('${webp}')`; };
  img.onerror = () => { el.style.backgroundImage = `url('${svg}')`; };
  img.src = webp + `?v=${Date.now()}`; // cache kır
}

// Etkiler (opsiyonel — CSS tarafında sınıfları varsa)
function attachFx(card, fx) {
  if (!fx) return;
  card.classList.add(`fx-${fx}`);
}

// Başlat
function initZuzu() {
  // Üst açıklama satırındaki "GIF indir ..." gibi küçük notları da temizle
  qsa('small, .hint, .mini-hint, .note').forEach(n => {
    const t = (n.textContent||'').toLowerCase();
    if (t.includes('gif indir')) n.remove();
  });

  const cards = collectCards();
  if (!cards.length) return;

  // Kartları başlıklarına göre eşleştir; olmazsa sıralı dağıt
  const used = new Set();
  cards.forEach(card => {
    purgeOverlays(card);

    // Caption/title nerede olursa olsun yakala
    let titleNode =
      qs('.title, .name, .caption, .label, .card-title, .maskot-title', card) || card;
    const id = idFromTitle(titleNode.textContent);

    let mask = MASKOTS.find(m => m.id === id) || null;
    if (!mask) {
      // sıralı atama (kalanlardan)
      mask = MASKOTS.find(m => !used.has(m.id));
    }
    if (!mask) return;

    used.add(mask.id);

    const layer = ensureImageLayer(card);
    setBackground(layer, mask.webp, mask.svg);
    attachFx(card, mask.fx);

    // caption yaz
    let cap = qs('.caption', card);
    if (cap) cap.textContent = mask.name;
  });

  // Görünür olunca animasyon tetikle (varsa)
  const io = new IntersectionObserver(es => {
    es.forEach(e => e.isIntersecting && e.target.classList.add('animate'));
  }, { threshold: 0.2 });
  cards.forEach(c => io.observe(c));
}

document.addEventListener('DOMContentLoaded', initZuzu);
window.ZUZU = { reload: initZuzu, MASKOTS };
