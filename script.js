<script>
(() => {
  'use strict';

  /****************************************************
   * ZUZU Presale – Lottie/SVG Loader (v9.3 auto-path)
   ****************************************************/

  const CFG = {
    // Denenecek kök dizinler (sırayla)
    baseCandidates: [
      'assets/zuzu',    // önce burası
      'zuzu'            // olmazsa burası
    ],
    keys: [
      'logo','hero','hacker','warrior','sorceress',
      'ranger','berserker','scientist','rogue','titan'
      // 'mini_bot' // istersen aç
    ],
    i18n: {
      tr: {
        title: {
          logo:'ZUZU Logo', hero:'ZUZU Hero', hacker:'ZUZU Hacker',
          warrior:'ZUZU Warrior', sorceress:'ZUZU Sorceress',
          ranger:'ZUZU Ranger', berserker:'ZUZU Berserker',
          scientist:'ZUZU Scientist', rogue:'ZUZU Rogue', titan:'ZUZU Titan',
          mini_bot:'ZUZU Mini-Bot'
        },
        sub: {
          logo:'Temel maskot – glow', hero:'Neon zırh + hatlar',
          hacker:'Yüz tarama + sinyal', warrior:'Kılıç parlaması',
          sorceress:'Büyü küresi', ranger:'Vizör + kayış',
          berserker:'Kızgın aura', scientist:'Devre hatları',
          rogue:'Gizli bıçak', titan:'Kalkan + pulse',
          mini_bot:'Mini drone'
        }
      }
    }
  };

  const $  = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
  const log = (...a)=>console.log('%c[ZUZU]','color:#79ffe1',...a);

  /* Lottie yoksa CDN’den getir */
  function ensureLottie() {
    return new Promise((resolve)=>{
      if (window.lottie) return resolve(window.lottie);
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/lottie-web@5.12.2/build/player/lottie.min.js';
      s.onload = ()=>resolve(window.lottie);
      document.head.appendChild(s);
    });
  }

  /* Verilen relatif path için sırayla kökleri dene → başarılı url+json döndür */
  async function fetchJsonFromCandidates(rel) {
    for (const base of CFG.baseCandidates) {
      const url = `${base}/${rel}`;
      try {
        const r = await fetch(url, { cache:'no-store' });
        if (r.ok) {
          const json = await r.json();
          return { ok:true, json, usedBase: base, url };
        }
      } catch(_) { /* devam */ }
    }
    return { ok:false };
  }
  /* SVG fallback için var olan url’i bul */
  async function resolveSvgFromCandidates(rel) {
    for (const base of CFG.baseCandidates) {
      const url = `${base}/${rel}`;
      try {
        const r = await fetch(url, { method:'HEAD', cache:'no-store' });
        if (r.ok) return { ok:true, url };
      } catch(_) { /* devam */ }
    }
    return { ok:false };
  }

  /* Bir kapsayıcıya animasyonu yükle. JSON fail → SVG fallback */
  async function loadCharacterAnimation(container, key, opt={}) {
    const jsonRel = `lottie/zuzu_${key}.json`;
    const svgRel  = `svg/zuzu_${key}.svg`;

    // 1) JSON dene (assets/zuzu → zuzu)
    const j = await fetchJsonFromCandidates(jsonRel);
    if (j.ok) {
      await ensureLottie();
      container.innerHTML = '';
      container.classList.add('zuzu-thumb');
      const anim = window.lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: opt.loop ?? true,
        autoplay: opt.autoplay ?? true,
        animationData: j.json,
        name: `zuzu_${key}`
      });
      container.dataset.src = j.url;
      return true;
    }

    // 2) SVG fallback
    const s = await resolveSvgFromCandidates(svgRel);
    container.innerHTML = '';
    if (s.ok) {
      const img = document.createElement('img');
      img.src = s.url;
      img.alt = key;
      img.loading = 'lazy';
      img.style.width = '84px';
      img.style.height = '84px';
      img.style.opacity = '.95';
      img.style.filter = 'drop-shadow(0 0 10px rgba(0,255,200,.25))';
      container.appendChild(img);
      container.dataset.src = s.url;
      log(`JSON yok (${key}) → SVG gösterildi`);
      return false;
    } else {
      // 3) İkisi de yok → uyarı
      const warn = document.createElement('div');
      warn.textContent = 'Missing';
      warn.className = 'zuzu-missing';
      container.appendChild(warn);
      log(`Ne JSON ne SVG bulundu: ${key}`);
      return false;
    }
  }

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

  async function buildGallery() {
    let host = $('#zuzu-gallery') || $('[data-gallery="zuzu"]');
    if (!host) {
      host = document.createElement('div');
      host.id = 'zuzu-gallery';
      document.body.appendChild(host);
    }
    host.classList.add('zuzu-gallery');

    const T = CFG.i18n.tr;
    for (const key of CFG.keys) {
      await mountCard(host, key, T.title[key] || key, T.sub[key] || '');
    }
  }

  async function initHero() {
    const hero = $('#heroLottie');
    if (!hero) return;
    hero.classList.add('zuzu-hero');
    await loadCharacterAnimation(hero, 'hero', { autoplay:true, loop:true });
  }

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
        border-radius:10px;overflow:hidden}
      .zuzu-text{display:flex;flex-direction:column;gap:2px}
      .zuzu-title{font-weight:700;color:#e6f5ff}
      .zuzu-sub{font-size:.9rem;color:#9fb4c7}
      .zuzu-hero{width:240px;height:240px;margin:auto;border-radius:16px;
        background:radial-gradient(240px 240px at 50% 50%,rgba(0,255,200,.05),transparent 60%);overflow:hidden}
      .zuzu-missing{width:84px;height:84px;display:grid;place-items:center;
        color:#ff6b6b;background:rgba(255,0,0,.08);border:1px dashed rgba(255,0,0,.35);border-radius:10px;font-size:12px}
    `;
    const s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  window.addEventListener('DOMContentLoaded', async () => {
    try{
      injectMiniStyle();
      await Promise.all([initHero(), buildGallery()]);
      log('Maskot galerisi yüklendi ✔️ (auto-path)');
    }catch(e){
      console.error('[ZUZU] init error:', e);
    }
  });
})();
</script>
