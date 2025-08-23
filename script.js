/* =========================================================
 * ZUZU — Maskot Galerisi (Güvenli Sürüm)
 * Sadece galeri içinde çalışır, diğer DOM'a dokunmaz.
 * ========================================================= */

(function () {
  // ---- 1) Veri Seti
  const MASKOTS = [
    { id:'logo',      title:'ZUZU Logo',      webp:null,                                   svg:'/assets/zuzu/svg/zuzu_logo.svg'      },
    { id:'hero',      title:'ZUZU Hero',      webp:'/assets/zuzu/realistic/hero.webp',     svg:'/assets/zuzu/svg/zuzu_hero.svg'      },
    { id:'hacker',    title:'ZUZU Hacker',    webp:'/assets/zuzu/realistic/hacker.webp',   svg:'/assets/zuzu/svg/zuzu_hacker.svg'    },
    { id:'warrior',   title:'ZUZU Warrior',   webp:'/assets/zuzu/realistic/warrior.webp',  svg:'/assets/zuzu/svg/zuzu_warrior.svg'   },
    { id:'sorceress', title:'ZUZU Sorceress', webp:'/assets/zuzu/realistic/sorceress.webp',svg:'/assets/zuzu/svg/zuzu_sorceress.svg' },
    { id:'ranger',    title:'ZUZU Ranger',    webp:'/assets/zuzu/realistic/ranger.webp',   svg:'/assets/zuzu/svg/zuzu_warrior.svg'   },
    { id:'berserker', title:'ZUZU Berserker', webp:'/assets/zuzu/realistic/berserker.webp',svg:'/assets/zuzu/svg/zuzu_warrior.svg'   },
    { id:'scientist', title:'ZUZU Scientist', webp:'/assets/zuzu/realistic/scientist.webp',svg:'/assets/zuzu/svg/zuzu_hacker.svg'    },
    { id:'rogue',     title:'ZUZU Rogue',     webp:'/assets/zuzu/realistic/rogue.webp',    svg:'/assets/zuzu/svg/zuzu_hacker.svg'    },
    { id:'titan',     title:'ZUZU Titan',     webp:'/assets/zuzu/realistic/titan.webp',    svg:'/assets/zuzu/svg/zuzu_warrior.svg'   }
  ];

  // ---- 2) Yardımcılar
  const qs  = (s, r=document) => r.querySelector(s);
  const qsa = (s, r=document) => Array.from(r.querySelectorAll(s));

  function loadImage(url) {
    return new Promise((resolve, reject) => {
      if (!url) return reject('no-url');
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject(url);
      img.src = url + '?v=' + Date.now(); // cache kır
    });
  }

  // ---- 3) Sadece galeri alanını bul/yarat
  function findOrCreateGallery() {
    // Önce veri-attribute ile arayalım
    let container = qs('[data-maskot-grid]');
    if (container) return container;

    // Başlığı "ZUZU Maskot Galerisi" olan bölümün içindeki ana kutuyu bul
    const allSections = qsa('section, .section, .container, .wrap, .card');
    for (const sec of allSections) {
      const h = qs('h2, h3, .title, .section-title', sec);
      if (h && /zuzu\s+maskot\s+galerisi/i.test(h.textContent || '')) {
        // İçinde grid varsa onu kullan; yoksa biz oluştururuz
        container = qs('.zuzu-maskot-grid, .maskot-grid, .grid', sec);
        if (!container) {
          container = document.createElement('div');
          container.className = 'zuzu-maskot-grid';
          sec.appendChild(container);
        }
        break;
      }
    }

    // Hâlâ yoksa; sayfada büyük container bul ve ekle
    if (!container) {
      const fallbackZone = qs('#app, main, .container, .content, body');
      container = document.createElement('div');
      container.className = 'zuzu-maskot-grid';
      fallbackZone.appendChild(container);
    }

    container.setAttribute('data-maskot-grid', '1');
    return container;
  }

  // ---- 4) Sadece galeri içinde temizlik
  function purgeGallery(container) {
    // Galeri içindeki lottie/canvas/svg; sadece burada kaldır
    qsa('canvas, svg, .lottie, [data-lottie]', container).forEach(n => n.remove());
    // "GIF indir" yazıları
    qsa('button, a, span, div', container).forEach(n => {
      const t = (n.textContent || '').toLowerCase();
      if (t.includes('gif indir') || (t.includes('gif') && t.includes('indir'))) n.remove();
    });
  }

  // ---- 5) Kart oluşturucu
  function buildCard(mask) {
    const card = document.createElement('div');
    card.className = 'z-card';
    card.setAttribute('data-id', mask.id);

    const img = document.createElement('div');
    img.className = 'z-img';

    const title = document.createElement('div');
    title.className = 'z-caption';
    title.textContent = mask.title;

    card.appendChild(img);
    card.appendChild(title);

    // Görseli yükle (webp -> svg fallback)
    if (mask.webp) {
      loadImage(mask.webp).then(() => {
        img.style.backgroundImage = `url('${mask.webp}')`;
      }).catch(() => {
        img.style.backgroundImage = `url('${mask.svg}')`;
      });
    } else {
      img.style.backgroundImage = `url('${mask.svg}')`;
    }

    return card;
  }

  // ---- 6) CSS'yi enjekte et (yalnızca gerekli minimum)
  function injectStyles() {
    if (qs('#zuzu-grid-style')) return;
    const css = `
      [data-maskot-grid].zuzu-maskot-grid {
        display:grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap:14px;
        margin-top:10px;
      }
      .z-card {
        position:relative;
        height: 160px;
        border-radius: 14px;
        overflow: hidden;
        background:#0b1521;
        box-shadow: inset 0 0 0 1px rgba(255,255,255,0.03);
      }
      .z-card .z-img{
        position:absolute; inset:0;
        background-size:cover; background-position:center;
        filter: saturate(1.08) contrast(1.03);
        opacity:0; transform: scale(1.02);
        transition: opacity .35s ease, transform .45s ease;
      }
      .z-card.appear .z-img{ opacity:1; transform: scale(1); }
      .z-card .z-caption{
        position:absolute; left:12px; bottom:10px;
        color:#cfe9ff; font-weight:700; font-size:13px;
        text-shadow:0 1px 6px rgba(0,0,0,.55);
        z-index:3;
      }
    `;
    const style = document.createElement('style');
    style.id = 'zuzu-grid-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ---- 7) Lazy görünüm
  function lazyShow(container) {
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('appear');
          io.unobserve(e.target);
        }
      });
    }, {threshold:0.15});
    qsa('.z-card', container).forEach(c => io.observe(c));
  }

  // ---- 8) Başlat
  function init() {
    try {
      injectStyles();
      const grid = findOrCreateGallery();
      purgeGallery(grid);

      // Eğer grid boşsa doldur; doluysa kaldırıp yeniden kur (sadece grid içinde)
      grid.innerHTML = '';
      MASKOTS.forEach(m => grid.appendChild(buildCard(m)));

      lazyShow(grid);
      console.log('%cZUZU','color:#66f;', 'Maskot galerisi yüklendi.');
    } catch (e) {
      console.error('ZUZU init error:', e);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
  window.ZUZU = { init };
})();
