/* ======================= CONFIG ======================= */
const CONFIG = {
  // 23 Kasım 2025 Pazar 13:00 TR (UTC+3) => 10:00 UTC
  COUNTDOWN_KEY: "zuzu_countdown_fixed",
  targetUTC: Date.UTC(2025, 10, 23, 10, 0, 0),

  PRICES: [0.040, 0.060, 0.080, 0.100],

  CHAIN: {
    chainId: "0x89",
    chainName: "Polygon Mainnet",
    rpcUrls: ["https://polygon-rpc.com","https://rpc.ankr.com/polygon"],
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    blockExplorerUrls: ["https://polygonscan.com"]
  },

  LS_LANG: "zuzu_lang",
  LS_ADDR: "zuzu_evm_addr"
};

const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent||"");
const $  = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];

/* ======================= i18n ======================= */
const I = {
  tr:{nav_about:"Hakkımızda",nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",nav_sim:"Stake Simulator ↗",nav_claim:"Claim Portal ↗",buy_cta:"Buy $ZUZU",connect:"Cüzdan Bağla",hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",buy_now:"Hemen Satın Al",pay_note:"Ödemeler MetaMask (Polygon) ile yapılır. Mobilde MetaMask dApp ile otomatik açılır.",exchanges:"Desteklenen Borsalar",ex_soon:"Yakında listelenecek",invite_title:"Davet Et & Kazan",invite_lead:"Her başarılı satın alım için davet edene <b>250 ZUZU</b> bonus verilir. Paylaş:",copy:"Kopyala",invite_note:"Not: Bonus dağıtımı backend doğrulaması ile yapılır.",stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile kazan.",nft_title:"ZUZU Maskot NFT Ödülleri 🎁",nft_lead:"Stake edenler koleksiyondan nadir NFT’ler kazanır.",token_title:"Tokonomi (Görsel)",token_supply:"Toplam Arz: 500,000,000 ZUZU",lg_comm:"Topluluk — %35",lg_liq:"Likidite — %20",lg_team:"Ekip (12 ay kilit) — %15",lg_tres:"Hazine — %10",lg_stake:"Staking Ödülleri — %15",lg_prtn:"Partnerler — %5",week1:"Hafta 1",week2:"Hafta 2",week3:"Hafta 3",week4:"Hafta 4",list_note:"Borsa Listelemesi: 23 Kasım Pazar 13:00 (TR)",l_30:"30 gün kilit",l_90:"90 gün kilit",l_180:"180 gün kilit",l_early:"Erken çekiliş",tier_bronze:"Bronze",tier_silver:"Silver",tier_gold:"Gold",rm_launch:"Lansman",rm_prod:"Ürün",rm_grow:"Büyüme",rm_expand:"Genişleme",rm_l1:"Presale, CEX listeleri, NFT airdrop.",rm_l2:"Staking UI 2.0, DEX listeleri.",rm_l3:"Partnerlikler, mobil cüzdan entegrasyonları.",rm_l4:"Marketplace, DAO özellikleri."},
  en:{nav_about:"About",nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",nav_sim:"Stake Simulator ↗",nav_claim:"Claim Portal ↗",buy_cta:"Buy $ZUZU",connect:"Connect Wallet",hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",hero_lead:"Stake and win <b>ZUZU Mascot NFT</b>. Limited supply, high <b>utility</b>.",cta_stake:"Start Staking",cta_nft:"NFT Rewards",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",buy_now:"Buy Now",pay_note:"Payments via MetaMask (Polygon). On mobile, opens in MetaMask dApp.",exchanges:"Supported Exchanges",ex_soon:"Will Be Listed Soon",invite_title:"Invite & Earn",invite_lead:"Earn <b>250 ZUZU</b> per successful purchase via your link.",copy:"Copy",invite_note:"Note: Bonuses are confirmed via backend.",stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>.",nft_title:"ZUZU Mascot NFT Rewards 🎁",nft_lead:"Stakers win rare NFTs from the collection.",token_title:"Tokenomics (Visualized)",token_supply:"Total Supply: 500,000,000 ZUZU",lg_comm:"Community — 35%",lg_liq:"Liquidity — 20%",lg_team:"Team (12m lock) — 15%",lg_tres:"Treasury — 10%",lg_stake:"Staking Rewards — 15%",lg_prtn:"Partners — 5%",week1:"Week 1",week2:"Week 2",week3:"Week 3",week4:"Week 4",listing_note:"Exchange Listing: Sun, Nov 23, 13:00 (TR)",l_30:"30d lock",l_90:"90d lock",l_180:"180d lock",l_early:"Early unlock",tier_bronze:"Bronze",tier_silver:"Silver",tier_gold:"Gold",rm_launch:"Launch",rm_prod:"Product",rm_grow:"Growth",rm_expand:"Expansion",rm_l1:"Presale, CEX listings, NFT airdrop.",rm_l2:"Staking UI 2.0, DEX listings.",rm_l3:"Partnerships, mobile wallet integrations.",rm_l4:"Marketplace, DAO features."},
  fr:{nav_about:"À propos",nav_presale:"Pré-vente",nav_stake:"Stake",nav_nft:"Récompenses NFT",nav_roadmap:"Feuille de route",nav_token:"Tokenomics",nav_sim:"Simulateur de Stake ↗",nav_claim:"Portail de Claim ↗",buy_cta:"Buy $ZUZU",connect:"Connecter",hero_badge:"Pré-vente • Stake pour gagner un NFT",hero_title:"ZUZU — Hérisson Robotique 🦔⚡",hero_lead:"Stake et gagne un <b>NFT Mascotte ZUZU</b>. Offre limitée, haute <b>utilité</b>.",days:"JOURS",hours:"HEURES",mins:"MINUTES",secs:"SECONDES",presale_title:"Pré-vente — Compte à rebours",presale_lead:"Prépare-toi pour la pré-vente ZUZU ! <b>Allocation limitée</b>.",buy_now:"Acheter",exchanges:"Bourses prises en charge",ex_soon:"Bientôt listé",invite_title:"Inviter & Gagner",invite_lead:"Gagne <b>250 ZUZU</b> par achat réussi.",copy:"Copier",stake_title:"Stake Pro — Verrouille, Gagne, Reçois un NFT ✨",nft_title:"Récompenses NFT Mascotte ZUZU 🎁",token_title:"Tokenomics (Visuel)",token_supply:"Offre totale : 500 000 000 ZUZU",lg_comm:"Communauté — 35%",lg_liq:"Liquidité — 20%",lg_team:"Équipe (12m lock) — 15%",lg_tres:"Trésor — 10%",lg_stake:"Récompenses de staking — 15%",lg_prtn:"Partenaires — 5%",week1:"Semaine 1",week2:"Semaine 2",week3:"Semaine 3",week4:"Semaine 4",listing_note:"Coté en bourse : Dim 23 Nov, 13:00 (TR)"},
  pt:{nav_about:"Sobre",nav_presale:"Pré-venda",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Roteiro",nav_token:"Tokenomics",buy_cta:"Buy $ZUZU",connect:"Conectar",hero_badge:"Pré-venda • Stake para ganhar NFT",hero_title:"ZUZU — Ouriço Robótico 🦔⚡",hero_lead:"Faça stake e ganhe o <b>NFT Mascote ZUZU</b>.",days:"DIAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",exchanges:"Exchanges Suportadas",ex_soon:"Será listado em breve",presale_title:"Pré-venda — Contagem regressiva",presale_lead:"Prepare-se! <b>Alocação limitada</b>.",buy_now:"Comprar agora",invite_title:"Indique & Ganhe",invite_lead:"Ganhe <b>250 ZUZU</b> por compra.",copy:"Copiar",stake_title:"Stake Pro — Trave, Ganhe, Leve NFT ✨",nft_title:"Recompensas NFT Mascote ZUZU 🎁",token_title:"Tokenomics (Visual)",token_supply:"Oferta Total: 500.000.000 ZUZU",lg_comm:"Comunidade — 35%",lg_liq:"Liquidez — 20%",lg_team:"Equipe (12m lock) — 15%",lg_tres:"Tesouraria — 10%",lg_stake:"Recompensas de Staking — 15%",lg_prtn:"Parceiros — 5%",week1:"Semana 1",week2:"Semana 2",week3:"Semana 3",week4:"Semana 4",listing_note:"Listagem: 23 Nov, 13:00 (TR)"},
  ru:{nav_about:"О нас",nav_presale:"Предпродажа",nav_stake:"Стейкинг",nav_nft:"NFT награды",nav_roadmap:"Дорожная карта",nav_token:"Токеномика",buy_cta:"Buy $ZUZU",connect:"Подключить",hero_badge:"Предпродажа • Стейкни и получи NFT",hero_title:"ZUZU — Роботический Ёж 🦔⚡",hero_lead:"Стейк и выиграй <b>NFT талисмана ZUZU</b>.",days:"ДНИ",hours:"ЧАСЫ",mins:"МИНУТЫ",secs:"СЕКУНДЫ",presale_title:"Предпродажа — Обратный отсчёт",presale_lead:"Готовься! <b>Ограниченная аллокация</b>.",buy_now:"Купить",exchanges:"Поддерживаемые биржи",ex_soon:"Скоро листинг",invite_title:"Приглашай и зарабатывай",invite_lead:"<b>250 ZUZU</b> за успешную покупку.",copy:"Копировать",stake_title:"Stake Pro — Замок, Доход, NFT ✨",nft_title:"Награды NFT талисмана ZUZU 🎁",token_title:"Токеномика (Визуализация)",token_supply:"Общее предложение: 500,000,000 ZUZU",lg_comm:"Сообщество — 35%",lg_liq:"Ликвидность — 20%",lg_team:"Команда (lock 12м) — 15%",lg_tres:"Казна — 10%",lg_stake:"Награды за стейкинг — 15%",lg_prtn:"Партнёры — 5%",week1:"Неделя 1",week2:"Неделя 2",week3:"Неделя 3",week4:"Неделя 4",listing_note:"Листинг: 23 ноя, 13:00 (TR)"},
  es:{nav_about:"Acerca",nav_presale:"Pre-venta",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Hoja de ruta",nav_token:"Tokenomics",buy_cta:"Buy $ZUZU",connect:"Conectar",hero_badge:"Pre-venta • Stake para ganar NFT",hero_title:"ZUZU — Erizo Robótico 🦔⚡",hero_lead:"Haz stake y gana <b>NFT Mascota ZUZU</b>.",days:"DÍAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",presale_title:"Pre-venta — Cuenta regresiva",presale_lead:"¡Prepárate! <b>Asignación limitada</b>.",buy_now:"Comprar ahora",exchanges:"Exchanges compatibles",ex_soon:"Próximamente",invite_title:"Invita y Gana",invite_lead:"Gana <b>250 ZUZU</b> por compra.",copy:"Copiar",stake_title:"Stake Pro — Bloquea, Gana, NFT ✨",nft_title:"Recompensas NFT Mascota ZUZU 🎁",token_title:"Tokenomics (Visual)",token_supply:"Suministro Total: 500.000.000 ZUZU",lg_comm:"Comunidad — 35%",lg_liq:"Liquidez — 20%",lg_team:"Equipo (12m lock) — 15%",lg_tres:"Tesorería — 10%",lg_stake:"Recompensas de staking — 15%",lg_prtn:"Socios — 5%",week1:"Semana 1",week2:"Semana 2",week3:"Semana 3",week4:"Semana 4",listing_note:"Listado: 23 Nov, 13:00 (TR)"}
};

function applyLang(lang){
  localStorage.setItem(CONFIG.LS_LANG, lang);
  document.documentElement.setAttribute("lang", lang);

  // Buton/ikon bayrak
  $("#langCode")?.replaceChildren(document.createTextNode(lang.toUpperCase()));
  $("#langFlag")?.setAttribute("src", `flags/${lang}.png`);
  $("#langCode2")?.replaceChildren(document.createTextNode(lang.toUpperCase()));
  $("#langFlag2")?.setAttribute("src", `flags/${lang}.png`);

  // data-i içeren tüm metinler
  $$("[data-i]").forEach(el=>{
    const k=el.getAttribute("data-i");
    if(I[lang]?.[k]) el.innerHTML = I[lang][k];
  });

  // select / option gibi data-i olmayan alanlar
  // (şimdilik ödeme seçenekleri sabit kaldı; istersen çevrilebilir)
}

(function initLang(){
  const saved = localStorage.getItem(CONFIG.LS_LANG) || "tr";
  applyLang(saved);

  function wire(btnId, menuId){
    const btn=$(btnId), menu=$(menuId);
    btn?.addEventListener("click",(e)=>{
      e.stopPropagation();
      menu?.classList.toggle("show");
      btn.setAttribute("aria-expanded", menu?.classList.contains("show") ? "true":"false");
    });
    menu?.addEventListener("click",(e)=>{
      const b=e.target.closest(".lang-opt");
      if(!b) return;
      applyLang(b.dataset.lang);
      menu.classList.remove("show");
      btn?.setAttribute("aria-expanded","false");
    });
    document.addEventListener("click",(e)=>{
      if(!menu?.contains(e.target) && e.target!==btn) menu?.classList.remove("show");
    });
  }
  wire("#langBtn","#langMenu");
  wire("#langBtn2","#langMenu2");
})();

/* Drawer */
(function(){
  const d=$("#drawer"), open=$("#menuBtn"), close=$("#drawerClose");
  open?.addEventListener("click",()=>{
    d?.classList.add("show"); d?.removeAttribute("hidden");
  });
  close?.addEventListener("click",()=>d?.classList.remove("show"));
  d?.addEventListener("click",(e)=>{ if(e.target===d) d.classList.remove("show"); });
})();

/* Countdown */
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

/* NFT grid (10 adet) */
(function renderNFTs(){
  const g=$("#nftGrid"); if(!g) return;
  g.innerHTML = Array.from({length:10}).map((_,i)=>`
    <div class="nft">
      <img src="assets/images/mask/${i}.png" alt="ZUZU #${i+1}" loading="lazy"
           onerror="this.style.display='none'">
      <div class="meta"><b>ZUZU #${i+1}</b><span class="tag">${i%5===0?'Legendary':(i%2?'Rare':'Epic')}</span></div>
    </div>`).join("");
})();

/* Referans linki + paylaşım */
(function refLink(){
  const url = new URL(location.href);
  if(url.searchParams.get("ref")) localStorage.setItem("zuzu_refAddr", url.searchParams.get("ref"));
  const code = localStorage.getItem("zuzu_refAddr") || "YOURCODE";
  const out = $("#refLink");
  if(out){ out.value = `${location.origin}${location.pathname}?ref=${code}`; }
  $("#copyRef")?.addEventListener("click", ()=>{
    navigator.clipboard.writeText(out.value);
    const lang = localStorage.getItem(CONFIG.LS_LANG)||"tr";
    alert(I[lang]?.copy || "Copied");
  });
  $("#shareWA")?.setAttribute("href", `https://wa.me/?text=${encodeURIComponent("250 ZUZU bonus için davet linkim: "+(out?.value||""))}`);
  $("#shareTG")?.setAttribute("href", `https://t.me/share/url?url=${encodeURIComponent(out?.value||"")}&text=${encodeURIComponent("250 ZUZU bonus!")}`);
})();

/* Wallet */
let EVM_ADDR = localStorage.getItem(CONFIG.LS_ADDR) || null;
if(EVM_ADDR){
  $("#btnConnect").textContent = `${EVM_ADDR.slice(0,6)}...${EVM_ADDR.slice(-4)}`;
}
async function ensureMetamask(){
  if(window.ethereum) return true;
  if(IS_MOBILE){
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
        await ethereum.request({ method:"wallet_addEthereumChain", params:[CONFIG.CAIN] });
      }
    }
    const accs = await ethereum.request({ method:"eth_requestAccounts" });
    EVM_ADDR = accs[0];
    localStorage.setItem(CONFIG.LS_ADDR,EVM_ADDR);
    $("#btnConnect").textContent = `${EVM_ADDR.slice(0,6)}...${EVM_ADDR.slice(-4)}`;
  }catch(e){
    console.error(e);
    alert("Cüzdan bağlantısı reddedildi veya başarısız.");
  }
}
$("#btnConnect")?.addEventListener("click", connect);

/* Buy Now (mock) */
$("#buyBtn")?.addEventListener("click", async ()=>{
  if(!EVM_ADDR){ await connect(); if(!EVM_ADDR) return; }
  const start = getTarget();
  const weekMs = 15*24*3600*1000;
  let idx = 0;
  if(Date.now() >= start){ idx = Math.min(3, Math.floor((Date.now()-start)/weekMs)); }

  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  if(qty<=0){ alert("Geçerli miktar gir."); return; }

  const price = CONFIG.PRICES[idx];
  const costUSDT = qty * price;
  alert(`Week ${idx+1} • ${qty.toLocaleString()} ZUZU → ${costUSDT.toFixed(2)} USDT\n\n(Ödeme akışı backend ile bağlanacak.)`);
});

/* ticker nudge */
(function ensureTickerVisible(){
  const t=document.querySelector(".ticker__track"); if(!t) return;
  t.style.transform="translateX(0)"; setTimeout(()=>t.style.transform="", 60);
})();
