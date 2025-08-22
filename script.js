/* ZUZU — Script V3 (Realistic Covers + Built-in Lottie)
   - Kapaklar: assets/zuzu/realistic/*.svg
   - Lottie JSON kullanmıyoruz. lottie-web'e inline data veriyoruz.
   - Maskot kartları otomatik bağlanır.
*/

(function () {
  // ---- Helpers ------------------------------------------------------------
  const $  = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // ---- Kapak dosyaları (SVG) ---------------------------------------------
  const COVERS = {
    logo:      'assets/zuzu/realistic/logo.svg',
    hero:      'assets/zuzu/realistic/hero.svg',
    hacker:    'assets/zuzu/realistic/hacker.svg',
    warrior:   'assets/zuzu/realistic/warrior.svg',
    sorceress: 'assets/zuzu/realistic/sorceress.svg',
    ranger:    'assets/zuzu/realistic/ranger.svg',
    berserker: 'assets/zuzu/realistic/berserker.svg',
    scientist: 'assets/zuzu/realistic/scientist.svg',
    rogue:     'assets/zuzu/realistic/rogue.svg',
    titan:     'assets/zuzu/realistic/titan.svg'
  };

  // ---- Lottie üretici (inline data) --------------------------------------
  // Basit ama şık bir glow/pulse/scan animasyonu. Renk ve yoğunluk parametreli.
  function makeLottieData({ color = '#00ffd0', bg = 'transparent', radius = 48, pulse = 28, speed = 1 }) {
    // Küçük bir glow + iki dairesel stroke + hafif scan çizgisi
    return {
      v: "5.7.4",
      fr: 30 * speed,
      ip: 0,
      op: 90,
      w: 192,
      h: 192,
      nm: "zuzu_glow",
      ddd: 0,
      assets: [],
      layers: [
        // Arkaplan
        {
          ddd: 0, ind: 1, ty: 4, nm: "bg",
          sr: 1, ks:{o:{a:0,k:100},r:{a:0,k:0},p:{a:0,k:[96,96,0]},a:{a:0,k:[0,0,0]},s:{a:0,k:[100,100,100]}},
          shapes:[{ty:"rc",d:1,s:{a:0,k:[192,192]},p:{a:0,k:[0,0]},r:{a:0,k:24},nm:"rect"},
                  {ty:"fl",c:{a:0,k:bg==="transparent"?[0,0,0,0]:hexToRgba01(bg)},o:{a:0,k:100},r:1,nm:"fill"}],
          ao:0
        },
        // Büyük yumuşak glow
        {
          ddd: 0, ind: 2, ty: 4, nm: "big_glow",
          ks:{o:{a:1,k:[{t:0,s:40},{t:45,s:80},{t:90,s:40}]},r:{a:0,k:0},p:{a:0,k:[96,96,0]},a:{a:0,k:[0,0,0]},s:{a:0,k:[100,100,100]}},
          shapes:[
            {ty:"el",p:{a:0,k:[0,0]},s:{a:0,k:[radius*2,radius*2]},nm:"circle"},
            {ty:"fl",c:{a:0,k:hexToRgba01(color)},o:{a:0,k:100},r:1,nm:"fill"},
            {ty:"bl",bm:0, o:{a:0,k:40}, r:{a:0,k:40}, nm:"blur"} // (AE blur yok; ama çoğu player fake eder)
          ],
          ao:0
        },
        // İnce neon halka 1
        {
          ddd: 0, ind: 3, ty: 4, nm: "ring1",
          ks:{o:{a:1,k:[{t:0,s:60},{t:45,s:20},{t:90,s:60}]},r:{a:0,k:0},p:{a:0,k:[96,96,0]},a:{a:0,k:[0,0,0]},s:{a:0,k:[100,100,100]}},
          shapes:[
            {ty:"el",p:{a:0,k:[0,0]},s:{a:0,k:[(radius*1.5)*2,(radius*1.5)*2]},nm:"circle"},
            {ty:"st",c:{a:0,k:hexToRgba01(color)},o:{a:0,k:100},w:{a:0,k:2},lc:2,lj:2,nm:"stroke"},
            {ty:"tr",p:{a:0,k:[0,0]},a:{a:0,k:[0,0]},s:{a:0,k:[100,100]},r:{a:1,k:[{t:0,s:0},{t:90,s:360}]},o:{a:0,k:100},sk:{a:0,k:0},sa:{a:0,k:0}}
          ],
          ao:0
        },
        // İnce neon halka 2
        {
          ddd: 0, ind: 4, ty: 4, nm: "ring2",
          ks:{o:{a:1,k:[{t:0,s:50},{t:45,s:15},{t:90,s:50}]},r:{a:0,k:0},p:{a:0,k:[96,96,0]},a:{a:0,k:[0,0,0]},s:{a:0,k:[100,100,100]}},
          shapes:[
            {ty:"el",p:{a:0,k:[0,0]},s:{a:0,k:[(radius*0.9)*2,(radius*0.9)*2]},nm:"circle"},
            {ty:"st",c:{a:0,k:hexToRgba01(color)},o:{a:0,k:100},w:{a:0,k:1.4},lc:2,lj:2,nm:"stroke"},
            {ty:"tr",p:{a:0,k:[0,0]},a:{a:0,k:[0,0]},s:{a:0,k:[100,100]},r:{a:1,k:[{t:0,s:360},{t:90,s:0}]},o:{a:0,k:100},sk:{a:0,k:0},sa:{a:0,k:0}}
          ],
          ao:0
        },
        // Hafif scan çizgisi
        {
          ddd: 0, ind: 5, ty: 4, nm: "scan",
          ks:{o:{a:0,k:35},r:{a:0,k:0},p:{a:1,k:[{t:0,s:[-40,96,0]},{t:90,s:[232,96,0]}]},a:{a:0,k:[0,0,0]},s:{a:0,k:[100,100,100]}},
          shapes:[
            {ty:"rc",d:1,s:{a:0,k:[pulse,4]},p:{a:0,k:[0,0]},r:{a:0,k:2},nm:"rect"},
            {ty:"fl",c:{a:0,k:hexToRgba01(color)},o:{a:0,k:100},r:1,nm:"fill"}
          ],
          ao:0
        }
      ]
    };
  }

  function hexToRgba01(hex) {
    // "#00ffd0" => [0,1,0.82,1] approx
    const c = hex.replace('#','');
    const n = parseInt(c,16);
    const r = (n>>16)&255, g = (n>>8)&255, b = n&255;
    return [r/255,g/255,b/255,1];
  }

  // ---- Maskot Grid Bağlama ------------------------------------------------
  // Kartlarınızda şu data attr. olmalı:  data-char="hacker" (vb.)
  // .maskot-card -> .maskot-cover (img) + .maskot-anim (div)
  function mountMascots() {
    const cards = $$('.maskot-card');
    if (!cards.length) return;

    cards.forEach((card) => {
      const key = (card.getAttribute('data-char') || '').toLowerCase().trim();
      const cover = $('.maskot-cover', card);
      const animBox = $('.maskot-anim', card);

      // 1) Kapak
      const src = COVERS[key] || COVERS.logo;
      if (cover) cover.setAttribute('src', src);

      // 2) Lottie (inline, dosya yok)
      if (animBox) {
        const palette = {
          logo:'#00ffd0', hero:'#00ffd0', hacker:'#00ffd0', warrior:'#ffb24d',
          sorceress:'#a0ffe6', ranger:'#7fdaff', berserker:'#ff657a',
          scientist:'#7af3ff', rogue:'#c3ffd9', titan:'#ffd37a'
        };
        const color = palette[key] || '#00ffd0';
        const data = makeLottieData({ color, speed: 1, radius: 52, pulse: 34 });
        // eslint-disable-next-line no-undef
        lottie.loadAnimation({
          container: animBox,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: data
        });
      }
    });
  }

  // ---- Borsa Logoları (fallback) ------------------------------------------
  function mountExchanges() {
    const ex = ['MEXC','Gate.io','BitMart','BingX','Bybit','KuCoin','OKX'];
    const box = $('#exchanges');
    if (!box) return;
    box.innerHTML = ex.map(n=>`<span class="tag">${n}</span>`).join('');
  }

  // ---- Wallet butonu (demo) -----------------------------------------------
  function initWallet() {
    const btn = $('#connectBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      alert('Cüzdan bağlama (demo): Gerçek bağlantı için web3 provider ekleyeceğiz.');
    });
  }

  // ---- Ready ---------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    mountExchanges();
    initWallet();
    mountMascots();
  });
})();
