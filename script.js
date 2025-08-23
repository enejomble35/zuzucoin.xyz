/* ZUZU – Maskot Animasyonları + Tek Tık GIF İndirme  */
const MASKOTS = [
  { id:'logo',       name:'ZUZU Logo',      img:'/assets/zuzu/realistic/logo.webp',       fallback:'/assets/zuzu/svg/zuzu_logo.svg',      fx:'logo' },
  { id:'hero',       name:'ZUZU Hero',      img:'/assets/zuzu/realistic/hero.webp',       fx:'aura'    },
  { id:'hacker',     name:'ZUZU Hacker',    img:'/assets/zuzu/realistic/hacker.webp',     fx:'scan'    },
  { id:'warrior',    name:'ZUZU Warrior',   img:'/assets/zuzu/realistic/warrior.webp',    fx:'sword'   },
  { id:'sorceress',  name:'ZUZU Sorceress', img:'/assets/zuzu/realistic/sorceress.webp',  fx:'orb'     },
  { id:'ranger',     name:'ZUZU Ranger',    img:'/assets/zuzu/realistic/ranger.webp',     fx:'visor'   },
  { id:'berserker',  name:'ZUZU Berserker', img:'/assets/zuzu/realistic/berserker.webp',  fx:'embers'  },
  { id:'scientist',  name:'ZUZU Scientist', img:'/assets/zuzu/realistic/scientist.webp',  fx:'circuits'},
  { id:'rogue',      name:'ZUZU Rogue',     img:'/assets/zuzu/realistic/rogue.webp',      fx:'eyes'    },
  { id:'titan',      name:'ZUZU Titan',     img:'/assets/zuzu/realistic/titan.webp',      fx:'core'    },
];

const grid = document.getElementById('maskotGrid');

/* Kartları oluştur */
MASKOTS.forEach(m=>{
  const card = document.createElement('div');
  card.className = 'card';
  card.id = `card-${m.id}`;

  const img = document.createElement('div');
  img.className = 'img';
  img.style.backgroundImage = `url(.${m.img})`;
  img.onerror = () => { if (m.fallback) img.style.backgroundImage = `url(${m.fallback})`; };
  card.appendChild(img);

  // Efekt
  const fx = document.createElement('div');
  fx.className = 'fx';
  applyFX(fx, m.fx, m.id);   // aşağıdaki fonksiyon
  card.appendChild(fx);

  // Başlık
  const title = document.createElement('div');
  title.className = 'title';
  title.textContent = m.name;
  card.appendChild(title);

  // GIF indir butonu
  const btn = document.createElement('button');
  btn.className = 'gif-btn';
  btn.textContent = 'GIF indir';
  btn.addEventListener('click',()=> captureGif(card));
  card.appendChild(btn);

  grid.appendChild(card);
});

/* Efekt oluşturma */
function applyFX(root, type, id){
  if(type==='logo'){
    // merkezden yayılan nabız + yüz çizgisi parıltısı
    const pulse = document.createElement('div');
    Object.assign(pulse.style,{
      position:'absolute',left:'50%',top:'48%',width:'140px',height:'140px',
      transform:'translate(-50%,-50%)',borderRadius:'50%',
      background:'radial-gradient(circle,#25f4ee55 0%, #25f4ee22 40%, transparent 70%)',
      filter:'blur(4px)',animation:'pulse 2.2s ease-in-out infinite'
    });
    root.appendChild(pulse);
  }
  if(type==='aura'){
    const glow = document.createElement('div');
    Object.assign(glow.style,{
      position:'absolute',inset:'-10%',background:
      'radial-gradient(60% 60% at 50% 20%, #19ffd633 0,#0ff0 60%), radial-gradient(90% 80% at 50% 80%, #00e5ff22 0, transparent 70%)',
      mixBlendMode:'screen',animation:'float 6s ease-in-out infinite'
    });
    root.appendChild(glow);
  }
  if(type==='scan'){
    const bar = document.createElement('div');
    Object.assign(bar.style,{
      position:'absolute',left:'-40%',top:'44%',width:'180%',height:'6%',
      background:'linear-gradient(90deg, transparent, #7cfbff66, transparent)',
      filter:'blur(1px)',borderRadius:'6px',animation:'scan 1.9s linear infinite'
    });
    root.appendChild(bar);
  }
  if(type==='sword'){
    const glint = document.createElement('div');
    Object.assign(glint.style,{
      position:'absolute',right:'8%',top:'18%',width:'14%',height:'60%',
      background:'linear-gradient(90deg, transparent, #d2f9ff99, transparent)',
      filter:'blur(1px)',mixBlendMode:'screen',animation:'scan 1.7s linear infinite'
    });
    root.appendChild(glint);
  }
  if(type==='orb'){
    const orb = document.createElement('div');
    Object.assign(orb.style,{
      position:'absolute',left:'16%',bottom:'22%',width:'120px',height:'120px',
      transform:'translate(-50%,0)',borderRadius:'50%',
      background:'radial-gradient(circle, #39ffb999 0, #18ffc555 35%, transparent 70%)',
      filter:'blur(2px)',animation:'pulse 2.1s ease-in-out infinite'
    });
    root.appendChild(orb);

    // kıvılcım parçacıkları
    for(let i=0;i<14;i++){
      const p = document.createElement('div');
      const size = 3+Math.random()*5;
      Object.assign(p.style,{
        position:'absolute',left:`calc(16% - ${6+Math.random()*20}px)`,
        bottom:`${18+Math.random()*40}%`,
        width:`${size}px`,height:`${size}px`,borderRadius:'50%',
        background:'#7cfbff',opacity:'0',filter:'blur(.6px)',
        animation:`spark ${1.2+Math.random()*1.2}s linear ${Math.random()*1.2}s infinite`
      });
      root.appendChild(p);
    }
  }
  if(type==='visor'){
    const visor = document.createElement('div');
    Object.assign(visor.style,{
      position:'absolute',left:'22%',top:'28%',width:'56%',height:'18%',
      background:'linear-gradient(90deg, transparent, #9afcff66, transparent)',
      filter:'blur(1px)',mixBlendMode:'screen',animation:'scan 2.2s linear infinite'
    });
    root.appendChild(visor);
  }
  if(type==='embers'){
    for(let i=0;i<18;i++){
      const ember = document.createElement('div');
      const s = 2+Math.random()*4;
      Object.assign(ember.style,{
        position:'absolute',left:`${10+Math.random()*30}%`,bottom:`${8+Math.random()*50}%`,
        width:`${s}px`,height:`${s}px`,borderRadius:'50%',background:'#ff9b4a',
        boxShadow:'0 0 8px #ff9b4a',opacity:0.0,animation:`spark ${1.4+Math.random()}s linear ${Math.random()}s infinite`
      });
      root.appendChild(ember);
    }
  }
  if(type==='circuits'){
    const grid = document.createElement('div');
    Object.assign(grid.style,{
      position:'absolute',left:'6%',bottom:'10%',width:'88%',height:'30%',
      background:'repeating-linear-gradient(90deg, #47d1ff20 0 2px, transparent 2px 10px), repeating-linear-gradient(0deg, #47d1ff20 0 2px, transparent 2px 10px)',
      mixBlendMode:'screen',filter:'blur(.6px)',animation:'blink 3s linear infinite'
    });
    root.appendChild(grid);
  }
  if(type==='eyes'){
    const glow = document.createElement('div');
    Object.assign(glow.style,{
      position:'absolute',left:'38%',top:'33%',width:'24%',height:'12%',
      background:'radial-gradient(ellipse at 30% 50%, #ff3535 0, transparent 60%), radial-gradient(ellipse at 70% 50%, #ff3535 0, transparent 60%)',
      filter:'blur(1.2px)',mixBlendMode:'screen',animation:'blink 4s linear infinite'
    });
    root.appendChild(glow);
  }
  if(type==='core'){
    const pulse = document.createElement('div');
    Object.assign(pulse.style,{
      position:'absolute',left:'50%',top:'44%',width:'120px',height:'120px',
      transform:'translate(-50%,-50%)',borderRadius:'50%',
      background:'radial-gradient(circle,#60f2ff77 0,#36e2ff44 40%,transparent 70%)',
      filter:'blur(2px)',animation:'pulse 1.9s ease-in-out infinite'
    });
    root.appendChild(pulse);
  }
}

/* Kartı GIF olarak kaydet (3 saniye) */
function captureGif(cardEl){
  const frames = [];
  const durationMs = 3000;
  const step = 120; // ms
  const shots = Math.ceil(durationMs / step);

  let i = 0;
  const grab = () => {
    html2canvas(cardEl, {backgroundColor: null, scale: 1}).then(canvas=>{
      frames.push(canvas.toDataURL('image/png'));
      i++;
      if(i<shots){ setTimeout(grab, step); }
      else{
        gifshot.createGIF({
          images: frames,
          gifWidth: cardEl.clientWidth,
          gifHeight: cardEl.clientHeight,
          interval: step/1000,
          numFrames: frames.length,
          frameDuration: step/10,
          sampleInterval: 7,
          numWorkers: 2,
          progressCallback: p => { cardEl.querySelector('.gif-btn').textContent = `İşleniyor %${Math.round(p*100)}`; }
        }, obj=>{
          const btn = cardEl.querySelector('.gif-btn');
          if(!obj.error){
            const a = document.createElement('a');
            a.href = obj.image;
            a.download = (cardEl.querySelector('.title')?.textContent || 'ZUZU')+'.gif';
            a.click();
            btn.textContent = 'GIF indir';
          }else{
            alert('GIF oluşturulamadı: '+obj.errorMsg);
            btn.textContent = 'GIF indir';
          }
        });
      }
    });
  };
  grab();
}

/* Sahte cüzdan bağla (UI) – gerçek cüzdan entegrasyonu isterse eklerim */
document.getElementById('connectBtn').addEventListener('click', ()=>{
  const btn = document.getElementById('connectBtn');
  btn.textContent = 'Bağlandı';
  btn.style.background = '#143d2d';
  btn.style.borderColor = '#1f6049';
});
