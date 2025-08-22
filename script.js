// ===== Helpers =====
const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

const priceStages = [0.002000, 0.003000, 0.004000];

function fmt(n, d=6){ return Number(n).toFixed(d); }

// ===== Referans linki =====
(function initRef(){
  const base = location.origin + location.pathname;
  const ref = new URLSearchParams(location.search).get('ref') || 'share-this-link';
  $('#refLink').value = `${base}?ref=${ref}`;
  $('#copyRef').onclick = () => { navigator.clipboard.writeText($('#refLink').value); };
})();

// ===== Presale hesap =====
(function initPresale(){
  const stageSel = $('#stage'), qty = $('#qty'), priceLabel = $('#priceLabel'), totalLabel = $('#totalLabel');
  const chips = $$('.chip');

  const calc = () => {
    const s = stageSel.selectedIndex;
    const p = priceStages[s];
    const q = parseFloat(qty.value||0);
    priceLabel.textContent = p.toFixed(6);
    totalLabel.textContent = fmt(p*q);
  };
  stageSel.onchange = calc;
  qty.oninput = calc;
  chips.forEach(c=>c.onclick = ()=>{ qty.value = c.textContent.replace(/[kM]/g, m => m==='k'?'000': '000000'); calc(); });
  calc();
})();

// ===== Mini progress (fake demo) =====
(function demoRaised(){
  let raised = 0;
  setInterval(()=>{
    raised = Math.min(300000, raised + Math.floor(Math.random()*200));
    $('#raised').textContent = `$${raised.toLocaleString()}`;
    $('#raisedBar').style.width = (raised/300000*100)+'%';
  }, 2200);
})();

// ===== Tap to Earn Demo =====
(function tapInit(){
  let pts=0, mult=1.0;
  const ref = new URLSearchParams(location.search).get('ref');
  if(ref && ref !== 'share-this-link') mult = 1.2;
  $('#mult').textContent = mult.toFixed(1)+'x';
  $('#tapBtn').onclick = ()=>{
    pts += Math.floor(1*mult);
    $('#score').textContent = pts;
  };
})();

// ===== Staking Demo =====
(function stakeDemo(){
  const daysSel = $('#stakeDays'), amt = $('#stakeAmt'), apy = $('#apy'), est = $('#est');
  const recalc = ()=>{
    const d = parseInt(daysSel.value,10);
    const base = (d===30?0.12 : d===60?0.22 : 0.36); // 30/60/90 gün
    apy.textContent = Math.round(base*100)+'%';
    const val = (parseFloat(amt.value||0) * base * (d/365)).toFixed(2);
    est.textContent = val;
  };
  daysSel.onchange = recalc; amt.oninput = recalc; recalc();
})();

// ===== Copy receiver =====
$('#copyReceiver').onclick = ()=> navigator.clipboard.writeText($('#receiver').value);

// ===== Karakter tanımları (10 adet) =====
const CHARACTERS = [
  { key:'zuzu_logo',       name:'ZUZU Logo',        color:'#00E0FF' },
  { key:'zuzu_hero',       name:'ZUZU Hero',        color:'#00E6A0' },
  { key:'zuzu_hacker',     name:'ZUZU Hacker',      color:'#00B3FF' },
  { key:'zuzu_warrior',    name:'ZUZU Warrior',     color:'#FF6A00' },
  { key:'zuzu_sorceress',  name:'ZUZU Sorceress',   color:'#FF3B7D' },
  { key:'zuzu_ranger',     name:'ZUZU Ranger',      color:'#8FFF00' },
  { key:'zuzu_berserker',  name:'ZUZU Berserker',   color:'#FF2E2E' },
  { key:'zuzu_scientist',  name:'ZUZU Scientist',   color:'#7D7DFF' },
  { key:'zuzu_rogue',      name:'ZUZU Rogue',       color:'#55FFD0' },
  { key:'zuzu_titan',      name:'ZUZU Titan',       color:'#FFCC00' },
];

const LOTTIE_PATH = (k) => `assets/zuzu/lottie/${k}.json`;
const SVG_PATH    = (k) => `assets/zuzu/svg/${k}.svg`;

const lottiePlayers = new Map();

function mountLottie(container, key, color, autoplay=true, loop=true){
  // Lottie dosyasını yükle
  fetch(LOTTIE_PATH(key)).then(r=>{
    if(!r.ok) throw new Error('lottie not found');
    return r.json();
  }).then(data=>{
    // renk override (optional)
    try {
      const col = color || '#00E0FF';
      JSON.stringify(data).includes('#00E0FF'); // dokunarak JIT optimize engelle
      // basit bir replace: default renk #00E0FF -> col
      data = JSON.parse(JSON.stringify(data).replaceAll('#00E0FF', col));
    } catch(e){}

    const anim = lottie.loadAnimation({
      container,
      renderer:'svg',
      loop, autoplay,
      animationData: data
    });
    lottiePlayers.set(container.id, anim);
  }).catch(_=>{
    // fallback SVG
    container.innerHTML = `<img src="${SVG_PATH(key)}" alt="${key}" style="width:100%;height:100%;object-fit:contain;opacity:.95">`;
  });
}

// HERO render
document.addEventListener('DOMContentLoaded', ()=>{
  mountLottie($('#lottie_hero'), 'zuzu_hero', '#00E6A0', true, true);

  // Galeri kartları bas
  const grid = $('#charGrid');
  grid.innerHTML = CHARACTERS.map(ch=>`
    <div class="char-card">
      <div class="char-slot" id="slot_${ch.key}"></div>
      <div class="char-name">${ch.name}</div>
      <div class="char-ctrls">
        <button class="btn mini" data-act="play" data-target="slot_${ch.key}">Play</button>
        <button class="btn mini" data-act="pause" data-target="slot_${ch.key}">Pause</button>
        <button class="btn mini warn" data-gif="slot_${ch.key}">GIF</button>
      </div>
    </div>
  `).join('');

  // hepsini otomatik başlat
  CHARACTERS.forEach(ch=> mountLottie($('#slot_'+ch.key), ch.key, ch.color, true, true));
});

// play/pause kontrol
document.addEventListener('click', (e)=>{
  const btn = e.target.closest('button');
  if(!btn) return;

  if(btn.dataset.act){
    const id = btn.dataset.target;
    const anim = lottiePlayers.get(id);
    if(!anim) return;
    if(btn.dataset.act==='play') anim.play();
    if(btn.dataset.act==='pause') anim.pause();
  }

  // GIF export (beta) — Lottie canvas’tan yakalama yöntemi
  if(btn.dataset.gif){
    const id = btn.dataset.gif;
    const container = $('#'+id);
    const svg = container.querySelector('svg');
    if(!svg){ alert('Önce animasyon yüklensin'); return; }

    // hızlı hack: svg’yi dataURL png çevirip birkaç frame ile gifshot’a veriyoruz
    // (çok kaliteli değil ama hızlı bir ön-izleme için yeterli)
    const frames = [];
    const anim = lottiePlayers.get(id);
    if(!anim){ alert('Animasyon bulunamadı'); return; }

    const total = Math.min(30, Math.floor(anim.getDuration(true))); // 30 frame
    let i = 0;

    const cap = setInterval(()=>{
      const xml = new XMLSerializer().serializeToString(svg);
      const dataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(xml)));
      frames.push(dataUrl);
      i++;
      if(i>=total){
        clearInterval(cap);
        gifshot.createGIF({
          images: frames,
          gifWidth: 256,
          gifHeight: 256,
          interval: 0.08
        }, obj=>{
          if(!obj.error){
            const a = document.createElement('a');
            a.href = obj.image; a.download = id+'.gif'; a.click();
          } else {
            alert('GIF oluşturulamadı: '+obj.errorMsg);
          }
        });
      } else {
        anim.goToAndStop(Math.floor((anim.totalFrames/total)*i), true);
      }
    }, 80);
  }
});

// header butonları
document.addEventListener('click', (e)=>{
  const t = e.target.closest('.controls .btn, .char-ctrls .btn, .wallet-btn');
  if(!t) return;
  if(t.classList.contains('wallet-btn')){
    alert('Cüzdan bağlama entegrasyonu bir sonraki commit’te eklenecek (MetaMask/TrustWallet).');
  }
});
