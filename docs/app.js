/* =======================
   CONFIG
======================= */
const CONFIG = {
  // Sayaç hedefi: 23 Kasım 2025 13:00 TR (Türkiye UTC+3 sabit)
  COUNTDOWN_KEY: "zuzu_countdown_fixed",
  // 13:00 TR = 10:00 UTC
  targetUTC: Date.UTC(2025, 10, 23, 10, 0, 0),

  PRICES: [0.040, 0.060, 0.080, 0.100],

  // Polygon Mainnet
  CHAIN: {
    chainId: "0x89",
    chainName: "Polygon Mainnet",
    rpcUrls: ["https://polygon-rpc.com", "https://rpc.ankr.com/polygon"],
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    blockExplorerUrls: ["https://polygonscan.com"]
  },

  LS_LANG: "zuzu_lang",
  LS_ADDR: "zuzu_evm_addr"
};

const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent||"");
const $  = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];

/* =======================
   i18n
======================= */
const I = {
  tr:{nav_about:"Hakkımızda",nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",
      hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",
      stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile kazan.",
      token_title:"Tokonomi (Görsel)",exchanges:"Desteklenen Borsalar"},
  en:{nav_about:"About",nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
      hero_lead:"Stake and win <b>ZUZU Mascot NFT</b>. Limited supply, high <b>utility</b>.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",
      stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>.",
      token_title:"Tokenomics (Visualized)",exchanges:"Supported Exchanges"},
  fr:{nav_about:"À propos",nav_presale:"Pré-vente",nav_stake:"Stake",nav_nft:"Récompenses NFT",nav_roadmap:"Feuille de route",nav_token:"Tokenomics",connect:"Connecter"},
  pt:{nav_about:"Sobre",nav_presale:"Pré-venda",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Roteiro",nav_token:"Tokenomics",connect:"Conectar"},
  ru:{nav_about:"О нас",nav_presale:"Предпродажа",nav_stake:"Стейкинг",nav_nft:"NFT награды",nav_roadmap:"Дорожная карта",nav_token:"Токеномика",connect:"Подключить"},
  es:{nav_about:"Acerca",nav_presale:"Pre-venta",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Hoja de ruta",nav_token:"Tokenomics",connect:"Conectar"}
};

function applyLang(lang){
  localStorage.setItem(CONFIG.LS_LANG, lang);
  $("#langCode")?.replaceChildren(document.createTextNode(lang.toUpperCase()));
  $("#langFlag")?.setAttribute("src", `flags/${lang}.png`);
  $("#langCode2")?.replaceChildren(document.createTextNode(lang.toUpperCase()));
  $("#langFlag2")?.setAttribute("src", `flags/${lang}.png`);
  $$("[data-i]").forEach(el=>{
    const k=el.getAttribute("data-i");
    if(I[lang]?.[k]) el.innerHTML = I[lang][k];
  });
}
(function initLang(){
  const saved = localStorage.getItem(CONFIG.LS_LANG) || "tr";
  applyLang(saved);
  function wire(btnId, menuId){
    const btn=$(btnId), menu=$(menuId);
    btn?.addEventListener("click",(e)=>{e.stopPropagation();menu?.classList.toggle("show");});
    menu?.addEventListener("click",(e)=>{
      const b=e.target.closest(".lang-opt"); if(!b) return;
      applyLang(b.dataset.lang); menu.classList.remove("show");
    });
    document.addEventListener("click",(e)=>{ if(!menu?.contains(e.target)) menu?.classList.remove("show"); });
  }
  wire("#langBtn","#langMenu");
  wire("#langBtn2","#langMenu2");
})();

/* ========== Drawer ========== */
(function(){
  const d=$("#drawer"), open=$("#menuBtn"), close=$("#drawerClose");
  open?.addEventListener("click",()=>d?.classList.add("show"));
  close?.addEventListener("click",()=>d?.classList.remove("show"));
  d?.addEventListener("click",(e)=>{ if(e.target===d) d.classList.remove("show"); });
})();

/* ========== Countdown (sabit) ========== */
function getTarget(){
  let ts = Number(localStorage.getItem(CONFIG.COUNTDOWN_KEY)||0);
  if(!ts){ ts = CONFIG.targetUTC; localStorage.setItem(CONFIG.COUNTDOWN_KEY, String(ts)); }
  return ts;
}
function tick(){
  const left = Math.max(0, getTarget() - Date.now());
  const d=Math.floor(left/86400000);
  const h=Math.floor((left%86400000)/3600000);
  const m=Math.floor((left%3600000)/60000);
  const s=Math.floor((left%60000)/1000);
  const pad=n=>n.toString().padStart(2,"0");
  $("#cdDays")?.replaceChildren(document.createTextNode(pad(d)));
  $("#cdHours")?.replaceChildren(document.createTextNode(pad(h)));
  $("#cdMins")?.replaceChildren(document.createTextNode(pad(m)));
  $("#cdSecs")?.replaceChildren(document.createTextNode(pad(s)));
}
tick(); setInterval(tick,1000);

/* ========== NFT grid (10 adet) ========== */
(function renderNFTs(){
  const g=$("#nftGrid"); if(!g) return;
  g.innerHTML = Array.from({length:10}).map((_,i)=>`
    <div class="nft">
      <img src="assets/images/mask/${i}.png" alt="ZUZU #${i+1}" loading="lazy"
           onerror="this.style.display='none'">
      <div class="meta"><b>ZUZU #${i+1}</b><span class="tag">${i%5===0?'Legendary':(i%2?'Rare':'Epic')}</span></div>
    </div>`).join("");
})();

/* ========== Referans linki + paylaşım ========== */
(function refLink(){
  const url = new URL(location.href);
  if(url.searchParams.get("ref")) localStorage.setItem("zuzu_refAddr", url.searchParams.get("ref"));
  const code = localStorage.getItem("zuzu_refAddr") || "YOURCODE";
  const out = $("#refLink");
  if(out){ out.value = `${location.origin}${location.pathname}?ref=${code}`; }
  $("#copyRef")?.addEventListener("click", ()=>{ navigator.clipboard.writeText(out.value); alert("Kopyalandı!"); });
  $("#shareWA")?.setAttribute("href", `https://wa.me/?text=${encodeURIComponent("250 ZUZU bonus için davet linkim: "+out.value)}`);
  $("#shareTG")?.setAttribute("href", `https://t.me/share/url?url=${encodeURIComponent(out.value)}&text=${encodeURIComponent("250 ZUZU bonus!")}`);
})();

/* ========== Wallet (MetaMask + Polygon) ========== */
let EVM_ADDR = localStorage.getItem(CONFIG.LS_ADDR) || null;
if(EVM_ADDR){ $("#btnConnect").textContent = `${EVM_ADDR.slice(0,6)}...${EVM_ADDR.slice(-4)}`; }

async function ensureMetamask(){
  if(window.ethereum) return true;
  if(IS_MOBILE){
    // MetaMask mobil dApp deep link
    location.href = `https://metamask.app.link/dapp/${location.host}${location.pathname}`;
  }else{
    window.open("https://metamask.io/download/", "_blank");
  }
  alert("MetaMask bulunamadı. Yükleme/dApp sayfası açılıyor.");
  return false;
}
async function connect(){
  if(!(await ensureMetamask())) return;
  try{
    const chainId = await ethereum.request({ method:"eth_chainId" });
    if(chainId !== CONFIG.CHAIN.chainId){
      try{
        await ethereum.request({ method:"wallet_switchEthereumChain", params:[{ chainId: CONFIG.CHAIN.chainId }] });
      }catch(e){
        await ethereum.request({ method:"wallet_addEthereumChain", params:[CONFIG.CHAIN] });
      }
    }
    const accs = await ethereum.request({ method:"eth_requestAccounts" });
    EVM_ADDR = accs[0];
    localStorage.setItem(CONFIG.LS_ADDR,EVM_ADDR);
    $("#btnConnect").textContent = `${EVM_ADDR.slice(0,6)}...${EVM_ADDR.slice(-4)}`;
  }catch(e){
    console.error(e); alert("Cüzdan bağlantısı reddedildi veya başarısız.");
  }
}
$("#btnConnect")?.addEventListener("click", connect);

/* ========== Buy Now (haftaya göre fiyat) ========== */
$("#buyBtn")?.addEventListener("click", async ()=>{
  if(!EVM_ADDR){ await connect(); if(!EVM_ADDR) return; }

  // 4 hafta x 15 gün
  const start = getTarget(); // sayaç bitişi = presale başlangıcıysa, istersen değiştir
  const weekMs = 15*24*3600*1000;
  let idx = 0;
  if(Date.now() >= start){ idx = Math.min(3, Math.floor((Date.now()-start)/weekMs)); }

  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  if(qty<=0){ alert("Geçerli miktar gir."); return; }

  const price = CONFIG.PRICES[idx];
  const costUSDT = qty * price;
  alert(`Week ${idx+1} • ${qty.toLocaleString()} ZUZU → ${costUSDT.toFixed(2)} USDT\n\n(Ödeme akışı backend ile bağlanacak.)`);
});

/* ========== Mobil çekmece davranışı ========== */
(function ensureTickerVisible(){
  const t=document.querySelector(".ticker__track"); if(!t) return;
  t.style.transform="translateX(0)"; setTimeout(()=>t.style.transform="", 60);
})();
