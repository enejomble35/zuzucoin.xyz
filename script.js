// V7 – ZUZU Adam Ordusu
// Renk paleti
const PALETTE = [
  {accent:'#28ff8c', name:'Neon Green'},
  {accent:'#57a4ff', name:'Neon Blue'},
  {accent:'#ff7a1a', name:'Neon Orange'},
  {accent:'#ff4570', name:'Neon Red'}
];

// Template yakala
const TPL = document.getElementById('zuzu-template');

// Tek bir ZUZU oluştur (SVG template klonla)
function makeZuzu({size='md', accent='#28ff8c'} = {}){
  const frag = TPL.content.cloneNode(true);
  const svg = frag.querySelector('svg');
  if(size==='sm') svg.classList.add('sm');
  if(size==='xs') svg.classList.add('xs');
  if(size==='lg') svg.classList.add('lg');
  svg.style.setProperty('--accent', accent);
  return svg;
}

// HERO – tek büyük ZUZU
(function heroInit(){
  const holder = document.getElementById('zuzu-hero');
  const hero = makeZuzu({size:'lg', accent:'#57a4ff'}); // Neon Blue
  holder.appendChild(hero);
})();

// PARADE – grid’e 12 farklı ZUZU bas
(function paradeInit(){
  const grid = document.getElementById('zuzu-parade-grid');
  const total = 12;
  for(let i=0; i<total; i++){
    const color = PALETTE[i % PALETTE.length];
    const card = document.createElement('div');
    card.className = 'zuzu-card';
    const z = makeZuzu({size: (i%3===0 ? 'lg' : i%3===1 ? 'sm' : 'md'), accent: color.accent});
    const label = document.createElement('div');
    label.className = 'zuzu-label';
    label.textContent = color.name;
    card.append(z, label);
    grid.appendChild(card);
  }
})();

// ARENA – kayan bantta 8 ZUZU, iki kez kopyala (sonsuz geçit)
(function arenaInit(){
  const track = document.getElementById('zuzu-marquee-track');
  const makeRow = () => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '26px';
    for(let i=0;i<8;i++){
      const color = PALETTE[(i + Math.floor(Math.random()*PALETTE.length)) % PALETTE.length];
      const z = makeZuzu({size: (i%2 ? 'sm' : 'md'), accent: color.accent});
      row.appendChild(z);
    }
    return row;
  };
  track.appendChild(makeRow());
  track.appendChild(makeRow()); // iki sıra => kayarken kesintisiz görünür
})();
