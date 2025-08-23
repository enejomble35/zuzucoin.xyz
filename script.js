/********************************
 * ZUZU – v15 (local-first fetch-blob + 10 mask + logo fallback)
 ********************************/

// ====== EXCHANGES (logo yoksa sadece isim rozet) ======
const EXCHANGES = [
  { key:'mexc',   name:'MEXC'   },
  { key:'gateio', name:'Gate.io'},
  { key:'bitmart',name:'BitMart'},
  { key:'bybit',  name:'Bybit'  },
  { key:'kucoin', name:'KuCoin' },
  { key:'okx',    name:'OKX'    },
];

async function buildExchangeRow(){
  const row = document.getElementById('exchanges');
  row.innerHTML = '';
  for (const e of EXCHANGES){
    const wrap = document.createElement('div');
    wrap.className = 'ex-item';
    row.appendChild(wrap);
    const url = `/assets/exchanges/${e.key}.svg?v=${Date.now()}`;
    try{
      const r = await fetch(url, {cache:'no-store'});
      if(!r.ok) throw 0;
      const img = document.createElement('img');
      img.className = 'ex-logo';
      img.alt = e.name;
      img.src = url;
      wrap.appendChild(img);
    }catch{
      const name = document.createElement('div');
      name.className = 'ex-name';
      name.textContent = e.name;
      wrap.appendChild(name);
    }
  }
}

// ====== SOURCES – önce yerel, sonra CDN ======
const SOURCES = {
  webp: [
    "/assets/zuzu/realistic/",
    "https://cdn.jsdelivr.net/gh/enejomble35/zuzucoin.xyz@main/assets/zuzu/realistic/",
    "https://raw.githubusercontent.com/enejomble35/zuzucoin.xyz/main/assets/zuzu/realistic/"
  ],
  lottie: [
    "/zuzu/lottie/",
    "https://cdn.jsdelivr.net/gh/enejomble35/zuzucoin.xyz@main/zuzu/lottie/",
    "https://raw.githubusercontent.com/enejomble35/zuzucoin.xyz/main/zuzu/lottie/"
  ]
};

// ====== 10 MASKOT ======
const ZUZU = [
  { key:"hero",      title:"ZUZU Hero"      },
  { key:"ranger",    title:"ZUZU Ranger"    },
  { key:"warrior",   title:"ZUZU Warrior"   },
  { key:"hacker",    title:"ZUZU Hacker"    },
  { key:"rogue",     title:"ZUZU Rogue"     },
  { key:"titan",     title:"ZUZU Titan"     },
  { key:"sorceress", title:"ZUZU Sorceress" },
  { key:"berserker", title:"ZUZU Berserker" },
  { key:"scientist", title:"ZUZU Scientist" },
  { key:"maiden",    title:"ZUZU Maiden"    }  // 10. kart
];

// 'sorceress' ile aynı görsellerin kullanılabilmesi için alias
const FILE_ALIAS = { sorceress:["sorceress","maiden"], maiden:["maiden","sorceress"] };

function candidates(key, ext){
  const names = FILE_ALIAS[key] || [key];
  const bases = (ext==="json") ? SOURCES.lottie : SOURCES.webp;
  const list=[];
  names.forEach(n=> bases.forEach(b=> list.push(b + (ext==="json" ? `zuzu_${n}.json` : `${n}.webp`))));
  return list;
}

// ====== FETCH→BLOB (görseli kesin göster) ======
async function setImageByFetch(img, urls){
  for(const u of urls){
    const url = u + (u.startsWith('http')?`?v=${Date.now()}`:'');
    try{
      const r = await fetch(url, {cache:'no-store', mode:'cors'});
      if(!r.ok) continue;
      const blob = await r.blob();
      img.src = URL.createObjectURL(blob);
      return true;
    }catch(_){}
  }
  return false;
}

// Lottie için fallback
function loadLottieFallback(container, key, ok, fail){
  const urls = candidates(key,"json");
  let i=0, killed=false;
  const tryNext=()=>{
    if(i>=urls.length){ fail(); return; }
    const url = urls[i] + (urls[i].startsWith('http')?`?v=${Date.now()}`:'');
    i++;
    fetch(url,{cache:'no-store'})
      .then(r=> r.ok ? r.json() : Promise.reject())
      .then(json=>{
        if(killed) return;
        const anim = lottie.loadAnimation({container, renderer:"svg", loop:true, autoplay:true, animationData:json});
        ok(anim);
      })
      .catch(tryNext);
  };
  tryNext();
  return ()=>{ killed=true; };
}

// ====== GALERİ ======
function buildGallery(){
  const grid = document.getElementById("zuzu-gallery");
  grid.innerHTML = "";

  ZUZU.forEach(({key,title})=>{
    const card = document.createElement("div");
    card.className = "card";
    const h = document.createElement("h3"); h.textContent = title;
    const anim = document.createElement("div"); anim.className = "animBox";
    card.append(h,anim);
    grid.appendChild(card);

    let lottieOk = false;
    loadLottieFallback(anim, key, ()=>{ lottieOk=true; }, async ()=>{
      // Lottie yoksa WEBP'yi fetch-blob ile yükle
      const img = document.createElement("img");
      img.className = "thumb"; img.alt = title;
      anim.appendChild(img);

      const ok = await setImageByFetch(img, candidates(key,"webp"));
      if(!ok){
        const b = document.createElement("div");
        b.className = "badge-error";
        b.textContent = "görsel/animasyon bulunamadı";
        card.appendChild(b);

        const dbg = document.createElement("small");
        dbg.style.display="block"; dbg.style.margin="6px 6px 0 6px"; dbg.style.color="#7da9ff";
        dbg.textContent = "Denedi: " + candidates(key,"json").concat(candidates(key,"webp")).join(" | ");
        card.appendChild(dbg);
      }
    });

    // Sessiz fail güvenliği
    setTimeout(async ()=>{
      if(!lottieOk && anim.children.length===0){
        const img = document.createElement("img");
        img.className="thumb"; img.alt=title; anim.appendChild(img);
        await setImageByFetch(img, candidates(key,"webp"));
      }
    }, 2200);
  });
}

// ====== Sayaç ======
async function initCountdown(){
  try{
    const conf = await fetch("/config.json?"+Date.now()).then(r=>r.json());
    const start = new Date(conf.presaleStart).getTime();
    const end   = new Date(conf.presaleEnd).getTime();
    const box = document.getElementById("cd");
    const bar = document.getElementById("cd-bar");
    function tick(){
      const now = Date.now();
      const total=end-start, done=Math.max(0,Math.min(total,now-start)), left=Math.max(0,end-now);
      const d=Math.floor(left/86400000),h=Math.floor((left%86400000)/3600000),
            m=Math.floor((left%3600000)/60000),s=Math.floor((left%60000)/1000);
      box.textContent = `${d}g ${h}s ${m}d ${s}sn`;
      bar.style.width = `${(done/total)*100}%`;
      if(left<=0){ box.textContent="Ön satış bitti"; bar.style.width="100%"; }
    }
    tick(); setInterval(tick,1000);
  }catch(e){ console.warn("countdown:",e); }
}

// ====== Chart ======
async function initChart(){
  try{
    const conf = await fetch("/config.json?"+Date.now()).then(r=>r.json());
    const ctx = document.getElementById('tokenChart').getContext('2d');
    new Chart(ctx,{
      type:'doughnut',
      data:{
        labels:['Presale','Liquidity','Marketing','Team','Airdrop'],
        datasets:[{
          data:conf.tokenomics,
          backgroundColor:['#24e0b6','#31c4ff','#ffd166','#a78bfa','#ff8fab'],
          borderColor:'#0e1522', borderWidth:2
        }]
      },
      options:{plugins:{legend:{display:false}},cutout:'60%'}
    });
  }catch(e){ console.warn("chart:",e); }
}

// ====== Modal / Wallet ======
const modal = document.getElementById("wallet-modal");
document.getElementById("btn-wallet").onclick = ()=> modal.classList.remove("hidden");
document.getElementById("closeModal").onclick = ()=> modal.classList.add("hidden");
function setAddr(t){ const el=document.getElementById("addrBox"); el && (el.textContent=t); }

document.getElementById("evmConnect").onclick = async ()=>{
  try{
    if(!window.ethereum){ alert("Tarayıcı cüzdanı yok"); return; }
    const accs = await window.ethereum.request({method:'eth_requestAccounts'});
    setAddr("EVM: "+accs[0]);
  }catch(e){ alert(e.message); }
};
document.getElementById("solConnect").onclick = async ()=>{
  try{
    const p=window.solana; if(!p||!p.isPhantom){ alert("Phantom yok"); return; }
    const r=await p.connect(); setAddr("Solana: "+r.publicKey.toString());
  }catch(e){ alert(e.message); }
};
let tonUi;
window.addEventListener('load',()=>{
  try{ tonUi = new TON_CONNECT_UI.TonConnectUI({ manifestUrl: location.origin+'/tonconnect-manifest.json' }); }catch(_){}
});
document.getElementById("tonConnect").onclick = async ()=>{
  try{ if(!tonUi){ alert("TonConnect yüklenmedi"); return; }
    await tonUi.openModal(); setAddr("TON: "+(tonUi.account?.address||"Bağlı değil"));
  }catch(e){ alert(e.message); }
};

// ====== Başlat ======
window.addEventListener('DOMContentLoaded', ()=>{
  buildExchangeRow();
  buildGallery();
  initCountdown();
  initChart();
});
