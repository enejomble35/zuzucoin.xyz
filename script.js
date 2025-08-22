<script>
(() => {
  'use strict';

  /* ---- ZUZU Lottie Loader v9.4 (slot mode) ---- */

  // Bu sırayla dizinleri dener (senin repo yapını otomatik bulur):
  const BASES = ['assets/zuzu', 'zuzu'];

  const $  = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];

  function ensureLottie(){
    return new Promise(res=>{
      if (window.lottie) return res(window.lottie);
      const s=document.createElement('script');
      s.src='https://cdn.jsdelivr.net/npm/lottie-web@5.12.2/build/player/lottie.min.js';
      s.onload=()=>res(window.lottie);
      document.head.appendChild(s);
    });
  }

  async function fetchJson(rel){
    for (const b of BASES){
      const url=`${b}/${rel}`;
      try{
        const r=await fetch(url,{cache:'no-store'});
        if(r.ok) return {ok:true,url,json:await r.json()};
      }catch(_){}
    }
    return {ok:false};
  }

  async function resolveSvg(rel){
    for (const b of BASES){
      const url=`${b}/${rel}`;
      try{
        const r=await fetch(url,{method:'HEAD',cache:'no-store'});
        if(r.ok) return {ok:true,url};
      }catch(_){}
    }
    return {ok:false};
  }

  async function loadIntoSlot(slot,key){
    const j = await fetchJson(`lottie/zuzu_${key}.json`);
    if (j.ok){
      await ensureLottie();
      slot.innerHTML='';
      slot.classList.add('zuzuslot');
      window.lottie.loadAnimation({
        container: slot,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: j.json,
        name: `zuzu_${key}`
      });
      return;
    }
    // JSON yoksa SVG fallback
    const s = await resolveSvg(`svg/zuzu_${key}.svg`);
    slot.innerHTML='';
    if(s.ok){
      const img=new Image();
      img.src=s.url; img.alt=key; img.loading='lazy';
      img.style.width='80px'; img.style.height='80px';
      img.style.filter='drop-shadow(0 0 10px rgba(0,255,200,.25))';
      slot.appendChild(img);
      return;
    }
    // İkisi de yoksa uyarı
    slot.innerHTML='<div class="z-missing">Missing</div>';
  }

  function injectStyle(){
    const css=`
      .z-slot{
        width:86px;height:86px;border-radius:12px;
        display:grid;place-items:center;
        background:radial-gradient(120px 120px at 50% 50%,rgba(0,255,200,.08),transparent 60%);
        overflow:hidden
      }
      .z-missing{
        width:86px;height:86px;border-radius:12px;
        display:grid;place-items:center;
        border:1px dashed rgba(255,100,100,.5);
        color:#ff8686;font:600 12px/1.2 system-ui
      }
    `;
    const s=document.createElement('style'); s.textContent=css; document.head.appendChild(s);
  }

  window.addEventListener('DOMContentLoaded', async ()=>{
    injectStyle();
    const slots = $$('.z-slot');
    if (!slots.length) {
      console.warn('[ZUZU] z-slot bulunamadı. Her kartın içine <div class="z-slot" data-zuzu="logo"> ekle.');
      return;
    }
    await Promise.all(slots.map(sl=>{
      const key=(sl.dataset.zuzu||'').trim().toLowerCase();
      return key ? loadIntoSlot(sl,key) : null;
    }));
    console.log('[ZUZU] Maskot slotları yüklendi ✔️');
  });
})();
</script>
