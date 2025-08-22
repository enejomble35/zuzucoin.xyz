<script>
(() => {
  'use strict';

  /********************************************************
   * ZUZU Presale – Lottie + SVG Gallery Loader (v9.2)
   *******************************************************/

  const CFG = {
    // Asset kökü (relative). GitHub Pages / custom domain ikisinde de çalışır.
    base: 'assets/zuzu',
    // Galeride çıkacak karakter anahtarları
    keys: [
      'logo',
      'hero',
      'hacker',
      'warrior',
      'sorceress',
      'ranger',
      'berserker',
      'scientist',
      'rogue',
      'titan'
      // 'mini_bot'  // istersen aç
    ],
    i18n: {
      tr: {
        title: {
          logo: 'ZUZU Logo',
          hero: 'ZUZU Hero',
          hacker: 'ZUZU Hacker',
          warrior: 'ZUZU Warrior',
          sorceress: 'ZUZU Sorceress',
          ranger: 'ZUZU Ranger',
          berserker: 'ZUZU Berserker',
          scientist: 'ZUZU Scientist',
          rogue: 'ZUZU Rogue',
          titan: 'ZUZU Titan',
          mini_bot: 'ZUZU Mini-Bot'
        },
        sub: {
          logo: 'Temel maskot – glow',
          hero: 'Neon zırh + hatlar',
          hacker: 'Yüz tarama + sinyal',
          warrior: 'Kılıç parlaması',
          sorceress: 'Büyü küresi',
          ranger: 'Vizör + kayış',
          berserker: 'Kızgın aura',
          scientist: 'Devre hatları',
          rogue: 'Gizli bıçak',
          titan: 'Kalkan + pulse',
          mini_bot: 'Mini drone'
        }
      }
    }
  };

  // Basit yardımcılar
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const log = (...a) => console.log('%c[ZUZU]', 'color:#79ffe1', ...a);

  // Lottie mevcut değilse CDN’den ekle
  function ensureLottie() {
    return new Promise((resolve) => {
      if (window.lottie) return resolve(window.lottie);
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/lottie-web@5.12.2/build/player/lottie.min.js';
      s.onload = () => resolve(window.lottie);
      document.head.appendChild(s);
    });
  }

  /**
   * Belirtilen kapsayıcıya Lottie animasyonu yükler.
   * JSON bulunamazsa SVG fallback yapar.
   */
  async function loadCharacterAnimation(container, key, options = {}) {
    const jsonUrl = `${CFG.base}/lottie/zuzu_${key}.json`;
    const svgFallback = `${CFG.base}/svg/zuzu_${key}.svg`;

    try {
      const r = await fetch(jsonUrl, { cache: 'no-store' });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const animData = await r.json();
      await ensureLottie();

      container.innerHTML = ''; // temizle
      container.classList.add('zuzu-thumb');

      const anim = window.lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: options.loop ?? true,
        autoplay: options.autoplay ?? true,
        animationData: animData,
        name: `zuzu_${key}`
      });

      // Hover / visibility optimize
      container.addEventListener('mouseenter', () => anim.setDirection(1));
      container.addEventListener('mouseleave', () => anim.setDirection(1));
      return true;
    } catch (err) {
      // SVG fallback
      log(`Lottie bulunamadı (${key}) → SVG’ye düştüm`, err.message || err);
      container.innerHTML = '';
      const img = document.createElement('img');
      img.src = svgFallback;
      img.alt = key;
      img.loading = 'lazy';
      img.style.width = '84px';
      img.style.height = '84px';
      img.style.opacity = '.9';
      img.style.filter = 'drop-shadow(0 0 10px rgba(0,255,200,.25))';
      container.appendChild(img);
      return false;
    }
  }

  /**
   * Tek bir kart DOM’u üretir ve animasyonu başlatır.
   */
  async function mountCard(parent, key, title, sub) {
    const card = document.createElement('div');
    card.className = 'zuzu-card';
    card.innerHTML = `
      <div class="zuzu-card-body">
        <div class="zuzu-thumb" aria-hidden="true"></div>
        <div class="zuzu-text">
          <div class="zuzu-title">${title}</div>
          <div class="zuzu-sub">${sub}</div>
        </div>
      </div>
    `;
    parent.appendChild(card);

    const thumb = $('.zuzu-thumb', card);
    await loadCharacterAnimation(thumb, key);
  }

  /**
   * Galeriyi inşa eder. Hedef:
   *  - #zuzu-gallery varsa oraya
   *  - yoksa [data-gallery="zuzu"] 
   *  - hiçbiri yoksa section oluşturup body’ye basar
   */
  async function buildGallery() {
    let host = $('#zuzu-gallery') || $('[data-gallery="zuzu"]');
    if (!host) {
      host = document.createElement('div');
      host.id = 'zuzu-gallery';
      document.body.appendChild(host);
    }
    host.classList.add('zuzu-gallery');

    const lang = 'tr';
    const T = CFG.i18n[lang];

    for (const key of CFG.keys) {
      const title = T.title[key] ?? `ZUZU ${key}`;
      const sub = T.sub[key] ?? '';
      await mountCard(host, key, title, sub);
    }
  }

  /**
   * Hero alanını (üstte büyük görsel) başlatır.
   * `#heroLottie` bulunursa `hero` animasyonu yüklenir,
   * yoksa görmezden gelir.
   */
  async function initHero() {
    const hero = $('#heroLottie');
    if (!hero) return;
    hero.classList.add('zuzu-hero');
    await loadCharacterAnimation(hero, 'hero', { autoplay: true, loop: true });
  }

  /** Cüzdan bağlama butonu (stub) */
  function initWalletButton() {
    const btn = $(`[data-action="connect-wallet"], .wallet-connect, .btn-wallet, .connect-wallet, [data-connect="wallet"]`);
    if (!btn) return;
    btn.addEventListener('click', async () => {
      alert('Cüzdan bağlama (demo) – prod’da Web3 sağlayıcı eklenecek.');
    });
  }

  /** Borsa rozetleri ikonları (basit sınıf ekleme) */
  function fixExBadges() {
    $$('.ex-badge').forEach(b => {
      b.classList.add('is-on');
    });
  }

  /** Mini style – kartlar için temel stiller (gömülü) */
  function injectMiniStyle() {
    const css = `
      .zuzu-gallery{
        display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
        gap:14px;margin-top:12px
      }
      .zuzu-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);
        border-radius:14px;padding:10px;backdrop-filter:blur(3px)}
      .zuzu-card-body{display:flex;gap:10px;align-items:center}
      .zuzu-thumb{width:84px;height:84px;display:grid;place-items:center;
        background:radial-gradient(120px 120px at 50% 50%,rgba(0,255,200,.08),transparent 60%);
        border-radius:10px}
      .zuzu-text{display:flex;flex-direction:column;gap:2px}
      .zuzu-title{font-weight:700;color:#e6f5ff}
      .zuzu-sub{font-size:.9rem;color:#9fb4c7}
      .zuzu-hero{width:240px;height:240px;margin:auto;border-radius:16px;
        background:radial-gradient(240px 240px at 50% 50%,rgba(0,255,200,.05),transparent 60%)}
    `;
    const s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  // ---- Boot
  window.addEventListener('DOMContentLoaded', async () => {
    try {
      injectMiniStyle();
      await Promise.all([
        initHero(),
        buildGallery()
      ]);
      initWalletButton();
      fixExBadges();
      log('Maskot galerisi yüklendi ✔️');
    } catch (e) {
      console.error('[ZUZU] init error:', e);
    }
  });

})();
</script>
