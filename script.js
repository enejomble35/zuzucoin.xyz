/************  AYARLAR  ************/
const PRICE_PER_ZUZU = 0.002;     // Stage-1
const USE_INLINE = true;          // true = dosyasız; false = assets/zuzu/lottie/*.json
const VERSION = 'v10.2';          // cache-bust
/***********************************/

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// presale hesap
function updateTotals(){
  const v = parseFloat($('#inpZuzu').value || '0');
  $('#pUnit').textContent = PRICE_PER_ZUZU.toFixed(6);
  $('#pTotal').textContent = (v*PRICE_PER_ZUZU).toFixed(6);
}
$('#inpZuzu').addEventListener('input', updateTotals);
$$('.pill').forEach(b => b.onclick = () => { $('#inpZuzu').value = b.dataset.v; updateTotals(); });
updateTotals();

// kopyala
$('#copy').onclick = () => {
  navigator.clipboard.writeText($('#receiver').value);
  $('#copy').textContent = 'Kopyalandı';
  setTimeout(()=>$('#copy').textContent='Kopyala',1200);
};

// LOTTIE BASE (inline) — göz kırpma + ağız hareketi + glow
function baseLottieJSON(hex='#00E0FF'){
  // hex örn '#00E0FF', stroke için turuncu sabit
  const C = hex;
  return {
    v:"5.7.4", fr:30, ip:0, op:180, w:512, h:512, nm:"zuzu_base", ddd:0, assets:[],
    layers:[
      {ddd:0,ind:1,ty:4,nm:"glow",
        ks:{o:{a:1,k:[{t:0,s:[55]},{t:180,s:[35]}]},
            r:{a:0,k:0}, p:{a:0,k:[256,256,0]}, a:{a:0,k:[0,0,0]},
            s:{a:1,k:[{t:0,s:[100,100,100]},{t:90,s:[108,108,100]},{t:180,s:[100,100,100]}]}},
        shapes:[
          {ty:"el",p:{a:0,k:[0,0]},s:{a:0,k:[380,380]}},
          {ty:"fl",c:{a:0,k:hexToRGBA(C)},o:{a:0,k:20},r:1}
        ]},
      {ddd:0,ind:2,ty:4,nm:"face",
        ks:{o:{a:0,k:100},r:{a:0,k:0},p:{a:0,k:[256,256,0]},a:{a:0,k:[0,0,0]},s:{a:0,k:[100,100,100]}},
        shapes:[
          {ty:"el",p:{a:0,k:[0,0]},s:{a:0,k:[300,300]}},
          {ty:"fl",c:{a:0,k:[0.035,0.07,0.11,1]},o:{a:0,k:100},r:1}
        ]},
      // horns
      horn(196,146,C), horn(316,146,C),
      // eyes
      eye(216,256,C,0), eye(296,256,C,90),
      // mouth (stroke turuncu)
      {ddd:0,ind:7,ty:4,nm:"mouth",
        ks:{o:{a:0,k:100},r:{a:0,k:0},p:{a:1,k:[{t:0,s:[256,316,0]},{t:90,s:[256,308,0]},{t:180,s:[256,316,0]}]},
            a:{a:0,k:[0,0,0]}, s:{a:0,k:[100,100,100]}},
        shapes:[
          {ty:"sh",ks:{a:0,k:{i:[[0,0],[0,0],[0,0]],o:[[0,0],[0,0],[0,0]],v:[[-70,0],[0,24],[70,0]],c:false}}},
          {ty:"st",c:{a:0,k:[1,0.35,0,1]},o:{a:0,k:100},w:{a:0,k:18},lc:2,lj:2}
        ]}
    ]
  };
  function horn(x,y,color){
    return {ddd:0,ind:3,ty:4,nm:"horn",
      ks:{o:{a:0,k:100},r:{a:0,k:0},p:{a:0,k:[x,y,0]},a:{a:0,k:[0,0,0]},s:{a:0,k:[100,100,100]}},
      shapes:[
        {ty:"sh",ks:{a:0,k:{i:[[0,0],[0,0],[0,0]],o:[[0,0],[0,0],[0,0]],v:[[-40,30],[0,-60],[40,30]],c:true}}},
        {ty:"fl",c:{a:0,k:hexToRGBA(color)},o:{a:0,k:100}}
      ]};
  }
  function eye(x,y,color,blinkAt){
    return {ddd:0,ind:5,ty:4,nm:"eye",
      ks:{o:{a:1,k:[{t:blinkAt,s:[100]},{t:blinkAt+5,s:[0]},{t:blinkAt+10,s:[100]}]},
          r:{a:0,k:0},p:{a:0,k:[x,y,0]},a:{a:0,k:[0,0,0]},s:{a:0,k:[100,100,100]}},
      shapes:[{ty:"el",p:{a:0,k:[0,0]},s:{a:0,k:[42,42]}},{ty:"fl",c:{a:0,k:hexToRGBA(color)},o:{a:0,k:100},r:1}]
    };
  }
  function hexToRGBA(h){ // '#00E0FF' -> [0,0.878,1,1]
    const n = h.replace('#',''); const r = parseInt(n.slice(0,2),16)/255;
    const g = parseInt(n.slice(2,4),16)/255; const b = parseInt(n.slice(4,6),16)/255;
    return [r,g,b,1];
  }
}

// Karakter tablosu (10 adet)
const CHARS = [
  { id:'char-logo',      color:'#00E0FF' },
  { id:'char-hero',      color:'#00FFD0' },
  { id:'char-hacker',    color:'#1AF5FF' },
  { id:'char-warrior',   color:'#A4FF45' },
  { id:'char-sorceress', color:'#F69AFF' },
  { id:'char-ranger',    color:'#19F57D' },
  { id:'char-berserker', color:'#FF7A1A' },
  { id:'char-scientist', color:'#66E3FF' },
  { id:'char-rogue',     color:'#8AF5C6' },
  { id:'char-titan',     color:'#00B8FF' }
];

// Inline mod: direkt animationData ile yükle
function mountInline(containerId, color){
  const el = document.getElementById(containerId);
  if(!el) return;
  const data = baseLottieJSON(color);
  lottie.loadAnimation({
    container: el, renderer:'svg', loop:true, autoplay:true,
    rendererSettings:{preserveAspectRatio:'xMidYMid meet'},
    animationData: data
  });
}

// File mod (ileride istersen)
function mountFromFile(containerId, key, color){
  const el = document.getElementById(containerId);
  const url = `assets/zuzu/lottie/${key}.json?${VERSION}`;
  fetch(url).then(r=>{
    if(!r.ok) throw new Error('404 '+url);
    return r.json();
  }).then(json=>{
    // Renk hatlarını değiştir
    let s = JSON.stringify(json);
    s = s.replace(/#00E0FF/gi, color);
    const data = JSON.parse(s);
    lottie.loadAnimation({ container:el, renderer:'svg', loop:true, autoplay:true, animationData:data });
  }).catch(err=>{
    console.warn('Lottie yok, inline fallback', err);
    mountInline(containerId, color);
  });
}

// Tüm karakterleri yükle
function boot(){
  // hero anim
  mountInline('anim-hero', '#00E0FF');

  CHARS.forEach((c,i)=>{
    if (USE_INLINE) mountInline(c.id, c.color);
    else {
      const key = c.id.replace('char-','zuzu_'); // char-hero -> zuzu_hero.json
      mountFromFile(c.id, key, c.color);
    }
  });
}
document.addEventListener('DOMContentLoaded', boot);
