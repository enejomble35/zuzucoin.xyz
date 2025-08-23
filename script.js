// --- Ayarlar / Kaynaklar ---
const CDN_WEBP = "https://cdn.jsdelivr.net/gh/enejomble35/zuzucoin.xyz@main/assets/zuzu/realistic/";
const CDN_LOTTIE = "https://cdn.jsdelivr.net/gh/enejomble35/zuzucoin.xyz@main/zuzu/lottie/";

// Maskot listesi (sıra ve isimler)
const ZUZU = [
  { key:"hero",      title:"ZUZU Hero"      },
  { key:"ranger",    title:"ZUZU Ranger"    },
  { key:"warrior",   title:"ZUZU Warrior"   },
  { key:"hacker",    title:"ZUZU Hacker"    },
  { key:"rogue",     title:"ZUZU Rogue"     },
  { key:"titan",     title:"ZUZU Titan"     },
  { key:"sorceress", title:"ZUZU Sorceress" },
  { key:"berserker", title:"ZUZU Berserker" },
  { key:"scientist", title:"ZUZU Scientist" }
];

// --- Galeri oluştur ---
function buildGallery(){
  const grid = document.getElementById("zuzu-gallery");
  grid.innerHTML = "";
  ZUZU.forEach(({key, title})=>{
    const card = document.createElement("div");
    card.className = "card";

    const h = document.createElement("h3");
    h.textContent = title;

    // Lottie Container
    const animBox = document.createElement("div");
    animBox.className = "animBox";
    animBox.id = `anim-${key}`;

    // alt yazı / footer
    const foot = document.createElement("div");
    foot.className = "footer-row";
    foot.innerHTML = `<span class="pill">${title.split(" ")[1]}</span>`;

    card.appendChild(h);
    card.appendChild(animBox);
    card.appendChild(foot);
    grid.appendChild(card);

    // Lottie'yi yükle, hata olursa webp'ye düş
    const lottieUrl = `${CDN_LOTTIE}zuzu_${key}.json`;
    const anim = lottie.loadAnimation({
      container: animBox,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: lottieUrl
    });
    anim.addEventListener("data_failed", ()=> fallbackToImage(animBox, key, title));
    anim.addEventListener("error", ()=> fallbackToImage(animBox, key, title));
    // bazı dosyalarda sessiz 404 olursa 2 sn sonunda fallback
    setTimeout(()=>{
      if(!anim.totalFrames || anim.totalFrames===0){
        try{ anim.destroy(); }catch(_){}
        fallbackToImage(animBox, key, title);
      }
    }, 2000);
  });
}

function fallbackToImage(container, key, title){
  container.innerHTML = "";
  const img = document.createElement("img");
  img.className = "thumb";
  img.alt = title;
  img.loading = "lazy";
  const url = `${CDN_WEBP}${key}.webp?${Date.now()}`;
  img.src = url;
  container.appendChild(img);

  img.onerror = ()=>{
    const badge = document.createElement("div");
    badge.className = "badge-error";
    badge.innerHTML = `görsel yüklenemedi <span class="copy-url">kopyala</span>`;
    badge.querySelector(".copy-url").onclick = ()=> navigator.clipboard.writeText(url);
    container.parentElement.appendChild(badge);
    console.warn("GÖRSEL YÜKLENEMEDİ:", url);
  };
}

// --- Sayaç / Progress ---
async function initCountdown(){
  const conf = await fetch("config.json?"+Date.now()).then(r=>r.json());
  const start = new Date(conf.presaleStart).getTime();
  const end   = new Date(conf.presaleEnd).getTime();

  const cdBox = document.getElementById("cd");
  const cdBar = document.getElementById("cd-bar");

  function tick(){
    const now = Date.now();
    const total = end - start;
    const done  = Math.max(0, Math.min(total, now - start));
    const left  = Math.max(0, end - now);

    const d = Math.floor(left/86400000);
    const h = Math.floor((left%86400000)/3600000);
    const m = Math.floor((left%3600000)/60000);
    const s = Math.floor((left%60000)/1000);

    cdBox.textContent = `${d}g ${h}s ${m}d ${s}sn`;
    cdBar.style.width = `${(done/total)*100}%`;
    if(left<=0){ cdBox.textContent = "Ön satış bitti"; }
  }
  tick();
  setInterval(tick, 1000);
}

// --- Tokenomi Chart ---
async function initChart(){
  const conf = await fetch("config.json?"+Date.now()).then(r=>r.json());
  const ctx  = document.getElementById('tokenChart').getContext('2d');
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
    options:{
      plugins:{legend:{display:false}},
      cutout:'60%'
    }
  });
}

// --- Cüzdan Modal aç/kapat ---
const modal = document.getElementById("wallet-modal");
document.getElementById("btn-wallet").onclick = ()=> modal.classList.remove("hidden");
document.getElementById("closeModal").onclick = ()=> modal.classList.add("hidden");

// Bağlı adres yazma yardımcı
function setAddr(text){ document.getElementById("addrBox").textContent = text; }

// EVM (MetaMask / OKX / Bitget)
document.getElementById("evmConnect").onclick = async ()=>{
  try{
    if(!window.ethereum){ alert("Tarayıcı cüzdanı bulunamadı (MetaMask/OKX/Bitget)."); return; }
    const accts = await window.ethereum.request({ method:"eth_requestAccounts" });
    const addr = accts[0];
    setAddr("EVM: "+addr);
  }catch(e){ alert("EVM bağlantı hatası: "+e.message); }
};

// Solana (Phantom)
document.getElementById("solConnect").onclick = async ()=>{
  try{
    const provider = window.solana;
    if(!provider || !provider.isPhantom){ alert("Phantom bulunamadı."); return; }
    const resp = await provider.connect();
    setAddr("Solana: "+resp.publicKey.toString());
  }catch(e){ alert("Solana bağlantı hatası: "+e.message); }
};

// TON (TonConnect)
let tonUi;
window.addEventListener('load', ()=>{
  try{
    tonUi = new TON_CONNECT_UI.TonConnectUI({
      manifestUrl: location.origin + "/tonconnect-manifest.json"
    });
  }catch(_){}
});
document.getElementById("tonConnect").onclick = async ()=>{
  try{
    if(!tonUi){ alert("TonConnect yüklenemedi."); return; }
    await tonUi.openModal(); // kullanıcı cüzdan seçer
    const acc = tonUi.account?.address || "Bağlı değil";
    setAddr("TON: "+acc);
  }catch(e){ alert("TON bağlantı hatası: "+e.message); }
};

// --- Başlat ---
window.addEventListener('DOMContentLoaded', ()=>{
  buildGallery();
  initCountdown();
  initChart();
});
