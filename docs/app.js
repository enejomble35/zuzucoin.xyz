/* ======================= CONFIG ======================= */
const CONFIG = {
  // Global countdown: 23 Nov 2025 10:00 UTC
  COUNTDOWN_KEY: "zuzu_countdown_fixed",
  targetUTC: Date.UTC(2025, 10, 23, 10, 0, 0),

  // Week prices (W1..W4)
  PRICES: [0.040, 0.060, 0.080, 0.100],

  // Polygon Mainnet
  CHAIN: {
    chainId: "0x89",
    chainName: "Polygon Mainnet",
    rpcUrls: ["https://polygon-rpc.com","https://rpc.ankr.com/polygon"],
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    blockExplorerUrls: ["https://polygonscan.com"]
  },

  // Satınalma modu — USDT için approve+buyWithUSDT akışı (contract)
  SALE: {
    mode: "contract", // "contract" tercih edildi
    recipient: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3", // MATIC için wallet fallback
    contract:  "0xfEe7dd881255EE85b7D6FeAF778e10988486AFc2" // presale/claim kontratı
  },

  // Optional otomatik claim
  CLAIM: {
    enabled: false,
    contract: "0xfEe7dd881255EE85b7D6FeAF778e10988486AFc2",
    selector_claim: "",       // ör: "0x12345678" => claim()
    selector_claim_for: ""    // ör: "0x90abcdef" => claim(address)
  },

  // Optional backend webhook (satın alma/claim intent loglamak için)
  WEBHOOK: "",

  // Resmi Polygon USDT
  USDT: "0xC2132D05D31c914a87C6611C10748AaCB3fAaCb",

  // Token UI (watchAsset)
  TOKEN: {
    address: "0xfEe7dd881255EE85b7D6FeAF778e10988486AFc2",
    symbol: "ZUZU",
    decimals: 18,
    image: location.origin + "/assets/images/branding/logo.png"
  },

  MIN_ZUZU: 500,

  LS_LANG: "zuzu_lang",
  LS_ADDR: "zuzu_evm_addr",
  LS_REF:  "zuzu_refAddr"
};

const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent||"");
const $  = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];

/* ======================= UTILS ======================= */
function scanLink(tx){ return `${CONFIG.CHAIN.blockExplorerUrls[0]}/tx/${tx}`; }
function scanAddr(addr){ return `${CONFIG.CHAIN.blockExplorerUrls[0]}/address/${addr}`; }

function showToast({title, msg, ok=false, link=null}){
  const wrap = $("#toasts") || (()=>{ const d=document.createElement("div"); d.id="toasts"; d.className="toasts"; document.body.appendChild(d); return d; })();
  const el = document.createElement("div");
  el.className = "toast " + (ok?"ok":"err");
  el.innerHTML = `<span class="ticon">${ok?"✅":"⚠️"}</span><b>${title}</b><div>${msg}${link?`<br><a href="${link}" target="_blank" rel="noopener">Polygonscan</a>`:""}</div>`;
  wrap.appendChild(el);
  setTimeout(()=>{ el.style.opacity="0"; el.style.transform="translateY(6px)"; setTimeout(()=>el.remove(),350); }, 7000);
}
function parseAmount(x){ return parseFloat((x||"0").toString().replace(/[^\d.]/g,""))||0; }
function pad32(hex){ return hex.replace(/^0x/,"").padStart(64,"0"); }
function addr(arg){ return pad32(arg.toLowerCase()); }
function uint(val){ return pad32("0x"+BigInt(val).toString(16)); }

// ERC20 transfer(address,uint256)
function encodeTransfer(to, amount){ return "0xa9059cbb"+addr(to)+uint(amount); }
// ERC20 approve(address,uint256)
function encodeApprove(spender, amount){ return "0x095ea7b3"+addr(spender)+uint(amount); }

// Presale muhtemel selector’ları (ikisini de deneriz)
const SELECTORS = {
  buyWithUSDT_addr_amount: "0x4ee2cd7e", // buyWithUSDT(address,uint256)
  buyWithUSDT_amount:      "0xb3f98adc", // buyWithUSDT(uint256)  (yaygın alternatif; gerekirse değiştirin)
  buyWithMatic:            "0x2b69f4b6"  // buyWithMatic()
};
function enc_buyWithUSDT_addr_amount(token, amount){ return SELECTORS.buyWithUSDT_addr_amount + addr(token) + uint(amount); }
function enc_buyWithUSDT_amount(amount){ return SELECTORS.buyWithUSDT_amount + uint(amount); }

/* ======================= i18n ======================= */
const I = {
  en:{nav_about:"About",nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",nav_sim:"Stake Simulator ↗",nav_claim:"Claim Portal ↗",buy_cta:"Buy $ZUZU",connect:"Connect Wallet",hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",hero_lead:"Stake and win <b>ZUZU Mascot NFT</b>. Limited supply, high <b>utility</b>.",cta_stake:"Start Staking",cta_nft:"NFT Rewards",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",buy_now:"Buy Now",pay_note:"Payments via MetaMask (Polygon). On mobile, opens in MetaMask dApp.",exchanges:"Supported Exchanges",ex_soon:"Will Be Listed Soon",invite_title:"Invite & Earn",invite_lead:"Earn <b>250 ZUZU</b> per successful purchase via your link.",copy:"Copy",invite_note:"Note: Bonuses are confirmed via backend.",stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, <b>APY + NFT BOOST</b>.",nft_title:"ZUZU Mascot NFT Rewards 🎁",nft_lead:"Stakers win rare NFTs from the collection.",token_title:"Tokenomics (Visualized)",token_supply:"Total Supply: 500,000,000 ZUZU",lg_comm:"Community — 35%",lg_liq:"Liquidity — 20%",lg_team:"Team (12m lock) — 15%",lg_tres:"Treasury — 10%",lg_stake:"Staking Rewards — 15%",lg_prtn:"Partners — 5%",week1:"Week 1",week2:"Week 2",week3:"Week 3",week4:"Week 4",listing_note:"Exchange Listing: 23 Nov 10:00 UTC",l_30:"30-day lock",l_90:"90-day lock",l_180:"180-day lock",l_early:"Early drawings",tier_bronze:"Bronze",tier_silver:"Silver",tier_gold:"Gold",rm_phase0:"Preparation",rm_p0d:"Whitepaper v1, website v2, contract dev & start audit.",rm_phase1:"Presale & Listing",rm_p1d:"4-phase presale, community campaigns, 23 Nov 10:00 UTC first CEX listing, staking beta.",rm_phase2:"Product",rm_p2d:"NFT mint & rewards, referral v2, second CEX, deeper DEX liquidity.",rm_phase3:"Growth & Governance",rm_p3d:"Mobile wallet integrations, partnerships, snapshot-based governance votes."},
  tr:{nav_about:"Hakkımızda",nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",nav_sim:"Stake Simulator ↗",nav_claim:"Claim Portal ↗",buy_cta:"Buy $ZUZU",connect:"Cüzdan Bağla",hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",buy_now:"Hemen Satın Al",pay_note:"Ödemeler MetaMask (Polygon) ile yapılır. Mobilde MetaMask dApp ile otomatik açılır.",exchanges:"Desteklenen Borsalar",ex_soon:"Yakında listelenecek",invite_title:"Davet Et & Kazan",invite_lead:"Her başarılı satın alım için davet edene <b>250 ZUZU</b> bonus verilir. Paylaş:",copy:"Kopyala",invite_note:"Not: Bonus dağıtımı backend doğrulaması ile yapılır.",stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile kazan.",nft_title:"ZUZU Maskot NFT Ödülleri 🎁",nft_lead:"Stake edenler koleksiyondan nadir NFT’ler kazanır.",token_title:"Tokonomi (Görsel)",token_supply:"Toplam Arz: 500,000,000 ZUZU",lg_comm:"Topluluk — %35",lg_liq:"Likidite — %20",lg_team:"Ekip (12 ay kilit) — %15",lg_tres:"Hazine — %10",lg_stake:"Staking Ödülleri — %15",lg_prtn:"Partnerler — %5",week1:"Hafta 1",week2:"Hafta 2",week3:"Hafta 3",week4:"Hafta 4",listing_note:"Borsa Listelemesi: 23 Nov 10:00 UTC",l_30:"30 gün kilit",l_90:"90 gün kilit",l_180:"180 gün kilit",l_early:"Erken çekiliş",tier_bronze:"Bronze",tier_silver:"Silver",tier_gold:"Gold",rm_phase0:"Hazırlık",rm_p0d:"Whitepaper v1, web v2, akıllı sözleşme geliştirme & güvenlik denetimi başlatma.",rm_phase1:"Ön Satış & Listeleme",rm_p1d:"Presale (4 faz), topluluk kampanyaları, 23 Nov 10:00 UTC ilk CEX listemesi, staking beta.",rm_phase2:"Ürün",rm_p2d:"NFT mint & ödüller, referral v2, ikinci CEX, DEX likidite artırımı.",rm_phase3:"Büyüme & Yönetişim",rm_p3d:"Mobil cüzdan entegrasyonları, partnerlikler, snapshot tabanlı yönetişim oylamaları."},
  fr:{nav_about:"À propos",nav_presale:"Prévente",nav_stake:"Staking",nav_nft:"Récompenses NFT",nav_roadmap:"Feuille de route",nav_token:"Tokenomics",nav_sim:"Simulateur de Staking ↗",nav_claim:"Portail de Claim ↗",buy_cta:"Acheter $ZUZU",connect:"Connecter le Wallet",hero_badge:"Prévente • Staker pour gagner un NFT",hero_title:"ZUZU — Hérisson Robotique 🦔⚡",hero_lead:"Stake et gagne un <b>NFT Mascotte ZUZU</b>. Offre limitée, grande <b>utilité</b>.",cta_stake:"Commencer le Staking",cta_nft:"Récompenses NFT",days:"JOURS",hours:"HEURES",mins:"MINUTES",secs:"SECONDES",presale_title:"Prévente — Compte à rebours",presale_lead:"Préparez-vous pour la prévente ZUZU ! <b>Allocation limitée</b>, prix communauté.",buy_now:"Acheter",pay_note:"Paiements via MetaMask (Polygon). Sur mobile, s’ouvre dans dApp MetaMask.",exchanges:"Bourses prises en charge",ex_soon:"Bientôt listé",invite_title:"Inviter & Gagner",invite_lead:"Gagnez <b>250 ZUZU</b> par achat réussi via votre lien.",copy:"Copier",invite_note:"Remarque : bonus confirmés via backend.",stake_title:"Stake Pro — Verrouiller, Gagner, Obtenir un NFT ✨",stake_lead:"Verrouillez vos ZUZU, <b>APY + BONUS NFT</b>.",nft_title:"Récompenses NFT Mascotte ZUZU 🎁",nft_lead:"Les stakers gagnent des NFTs rares.",token_title:"Tokenomics (Visuel)",token_supply:"Offre Totale : 500,000,000 ZUZU",lg_comm:"Communauté — 35%",lg_liq:"Liquidité — 20%",lg_team:"Équipe (verrou 12m) — 15%",lg_tres:"Trésorerie — 10%",lg_stake:"Récompenses de Staking — 15%",lg_prtn:"Partenaires — 5%",week1:"Semaine 1",week2:"Semaine 2",week3:"Semaine 3",week4:"Semaine 4",listing_note:"Listing : 23 Nov 10:00 UTC",l_30:"Verrou 30j",l_90:"Verrou 90j",l_180:"Verrou 180j",l_early:"Tirages anticipés",tier_bronze:"Bronze",tier_silver:"Argent",tier_gold:"Or",rm_phase0:"Préparation",rm_p0d:"Livre blanc v1, site v2, dev contrat & début d’audit.",rm_phase1:"Prévente & Listing",rm_p1d:"Prévente en 4 phases, campagnes, 1er CEX 23 Nov 10:00 UTC, staking bêta.",rm_phase2:"Produit",rm_p2d:"Mint NFT & récompenses, referral v2, 2e CEX, plus de liquidité DEX.",rm_phase3:"Croissance & Gouvernance",rm_p3d:"Intégrations wallet mobile, partenariats, votes governance snapshot."},
  pt:{nav_about:"Sobre",nav_presale:"Pré-venda",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Roteiro",nav_token:"Tokenomics",nav_sim:"Simulador de Stake ↗",nav_claim:"Portal de Claim ↗",buy_cta:"Comprar $ZUZU",connect:"Conectar Carteira",hero_badge:"Pré-venda • Faça stake para ganhar NFT",hero_title:"ZUZU — O Ouriço Robótico 🦔⚡",hero_lead:"Faça stake e ganhe <b>NFT Mascote ZUZU</b>. Oferta limitada, alta <b>utilidade</b>.",cta_stake:"Começar Stake",cta_nft:"Recompensas NFT",days:"DIAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",presale_title:"Pré-venda — Contagem regressiva",presale_lead:"Prepare-se para a pré-venda ZUZU! <b>Atribuição limitada</b>, preço da comunidade.",buy_now:"Comprar",pay_note:"Pagamentos via MetaMask (Polygon). No mobile, abre no dApp MetaMask.",exchanges:"Exchanges Suportadas",ex_soon:"Será listado em breve",invite_title:"Indique & Ganhe",invite_lead:"Ganhe <b>250 ZUZU</b> por compra bem-sucedida pelo seu link.",copy:"Copiar",invite_note:"Obs: bônus confirmados pelo backend.",stake_title:"Stake Pro — Trave, Ganhe, Leve NFT ✨",stake_lead:"Trave seu ZUZU, <b>APY + BOOST NFT</b>.",nft_title:"Recompensas NFT ZUZU 🎁",nft_lead:"Stakers ganham NFTs raros da coleção.",token_title:"Tokenomics (Visual)",token_supply:"Oferta Total: 500.000.000 ZUZU",lg_comm:"Comunidade — 35%",lg_liq:"Liquidez — 20%",lg_team:"Equipe (lock 12m) — 15%",lg_tres:"Tesouraria — 10%",lg_stake:"Recompensas de Stake — 15%",lg_prtn:"Parceiros — 5%",week1:"Semana 1",week2:"Semana 2",week3:"Semana 3",week4:"Semana 4",listing_note:"Listagem: 23 Nov 10:00 UTC",l_30:"Lock 30d",l_90:"Lock 90d",l_180:"Lock 180d",l_early:"Sorteios antecipados",tier_bronze:"Bronze",tier_silver:"Prata",tier_gold:"Ouro",rm_phase0:"Preparação",rm_p0d:"Whitepaper v1, site v2, dev contrato & início de auditoria.",rm_phase1:"Pré-venda & Listagem",rm_p1d:"4 fases, campanhas, 1º CEX 23 Nov 10:00 UTC, staking beta.",rm_phase2:"Produto",rm_p2d:"Mint NFT & recompensas, referral v2, 2º CEX, mais liquidez DEX.",rm_phase3:"Crescimento & Governança",rm_p3d:"Integrações mobile, parcerias, votos via snapshot."},
  ru:{nav_about:"О нас",nav_presale:"Предпродажа",nav_stake:"Стейкинг",nav_nft:"NFT-награды",nav_roadmap:"Дорожная карта",nav_token:"Токеномика",nav_sim:"Симулятор стейкинга ↗",nav_claim:"Портал клейма ↗",buy_cta:"Купить $ZUZU",connect:"Подключить кошелёк",hero_badge:"Предпродажа • Стейк — получай NFT",hero_title:"ZUZU — Роботизированный ёж 🦔⚡",hero_lead:"Стейкай и получай <b>NFT-талисман ZUZU</b>. Ограниченный выпуск, высокая <b>полезность</b>.",cta_stake:"Начать стейкинг",cta_nft:"NFT-награды",days:"ДНИ",hours:"ЧАСЫ",mins:"МИНУТЫ",secs:"СЕКУНДЫ",presale_title:"Предпродажа — обратный отсчёт",presale_lead:"Готовьтесь к предпродаже ZUZU! <b>Огр. аллокация</b>, цена для сообщества.",buy_now:"Купить",pay_note:"Оплата через MetaMask (Polygon). На мобильных откроется dApp.",exchanges:"Поддерживаемые биржи",ex_soon:"Скоро листинг",invite_title:"Приглашай и зарабатывай",invite_lead:"Получай <b>250 ZUZU</b> за каждую покупку по твоей ссылке.",copy:"Копировать",invite_note:"Бонусы подтверждаются бекендом.",stake_title:"Stake Pro — Заморозь, Заработай, Получи NFT ✨",stake_lead:"Заморозь ZUZU, <b>APY + NFT BOOST</b>.",nft_title:"NFT-награды талисмана ZUZU 🎁",nft_lead:"Стейкеры получают редкие NFT.",token_title:"Токеномика (визуально)",token_supply:"Общее предложение: 500,000,000 ZUZU",lg_comm:"Сообщество — 35%",lg_liq:"Ликвидность — 20%",lg_team:"Команда (лок 12м) — 15%",lg_tres:"Казна — 10%",lg_stake:"Награды за стейкинг — 15%",lg_prtn:"Партнёры — 5%",week1:"Неделя 1",week2:"Неделя 2",week3:"Неделя 3",week4:"Неделя 4",listing_note:"Листинг: 23 Nov 10:00 UTC",l_30:"Лок 30д",l_90:"Лок 90д",l_180:"Лок 180д",l_early:"Ранние розыгрыши",tier_bronze:"Бронза",tier_silver:"Серебро",tier_gold:"Золото",rm_phase0:"Подготовка",rm_p0d:"Whitepaper v1, сайт v2, разработка контракта и старт аудита.",rm_phase1:"Предпродажа и листинг",rm_p1d:"4 фазы, кампании, первый CEX 23 Nov 10:00 UTC, бета стейкинга.",rm_phase2:"Продукт",rm_p2d:"NFT-мят и награды, реферал v2, второй CEX, больше ликвидности DEX.",rm_phase3:"Рост и управление",rm_p3d:"Мобильные кошельки, партнёрства, голосования snapshot."},
  es:{nav_about:"Acerca de",nav_presale:"Preventa",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Hoja de ruta",nav_token:"Tokenomics",nav_sim:"Simulador de Stake ↗",nav_claim:"Portal de Claim ↗",buy_cta:"Comprar $ZUZU",connect:"Conectar Wallet",hero_badge:"Preventa • Haz stake para ganar NFT",hero_title:"ZUZU — Erizo Robótico 🦔⚡",hero_lead:"Haz stake y gana <b>NFT Mascota ZUZU</b>. Suministro limitado, gran <b>utilidad</b>.",cta_stake:"Empezar Stake",cta_nft:"Recompensas NFT",days:"DÍAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",presale_title:"Preventa — Cuenta regresiva",presale_lead:"¡Prepárate para la preventa de ZUZU! <b>Asignación limitada</b>, precio de comunidad.",buy_now:"Comprar",pay_note:"Pagos vía MetaMask (Polygon). En móvil, abre en dApp MetaMask.",exchanges:"Exchanges compatibles",ex_soon:"Se listará pronto",invite_title:"Invita y Gana",invite_lead:"Gana <b>250 ZUZU</b> por compra exitosa con tu enlace.",copy:"Copiar",invite_note:"Nota: bonos confirmados por backend.",stake_title:"Stake Pro — Bloquea, Gana, Consigue NFT ✨",stake_lead:"Bloquea tus ZUZU, <b>APY + NFT BOOST</b>.",nft_title:"Recompensas NFT Mascota ZUZU 🎁",nft_lead:"Los stakers ganan NFTs raros.",token_title:"Tokenomics (Visualizado)",token_supply:"Suministro Total: 500,000,000 ZUZU",lg_comm:"Comunidad — 35%",lg_liq:"Liquidez — 20%",lg_team:"Equipo (lock 12m) — 15%",lg_tres:"Tesorería — 10%",lg_stake:"Recompensas de Stake — 15%",lg_prtn:"Socios — 5%",week1:"Semana 1",week2:"Semana 2",week3:"Semana 3",week4:"Semana 4",listing_note:"Listado: 23 Nov 10:00 UTC",l_30:"Lock 30d",l_90:"Lock 90d",l_180:"Lock 180d",l_early:"Sorteos tempranos",tier_bronze:"Bronce",tier_silver:"Plata",tier_gold:"Oro",rm_phase0:"Preparación",rm_p0d:"Whitepaper v1, web v2, dev contrato y arranque de auditoría.",rm_phase1:"Preventa & Listado",rm_p1d:"4 fases, campañas, primer CEX 23 Nov 10:00 UTC, beta de staking.",rm_phase2:"Producto",rm_p2d:"Mint NFT y recompensas, referral v2, segundo CEX, más liquidez DEX.",rm_phase3:"Crecimiento & Gobernanza",rm_p3d:"Integraciones móviles, alianzas, votaciones por snapshot."}
};

/* dil uygula */
function applyLang(lang){
  localStorage.setItem(CONFIG.LS_LANG, lang);
  document.documentElement.setAttribute("lang", lang);
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
  const saved = localStorage.getItem(CONFIG.LS_LANG) || "en"; // ilk açılış EN
  applyLang(saved);
  function wire(btnId, menuId){
    const btn=$(btnId), menu=$(menuId);
    btn?.addEventListener("click",(e)=>{
      e.stopPropagation(); menu?.classList.toggle("show");
      btn.setAttribute("aria-expanded", menu?.classList.contains("show") ? "true":"false");
    });
    menu?.addEventListener("click",(e)=>{
      const b=e.target.closest(".lang-opt"); if(!b) return;
      applyLang(b.dataset.lang); menu.classList.remove("show");
      btn?.setAttribute("aria-expanded","false");
    });
    document.addEventListener("click",(e)=>{
      if(!menu?.contains(e.target) && e.target!==btn) menu?.classList.remove("show");
    });
  }
  wire("#langBtn","#langMenu"); wire("#langBtn2","#langMenu2");
})();

/* Drawer */
(function(){
  const d=$("#drawer"), open=$("#menuBtn"), close=$("#drawerClose");
  open?.addEventListener("click",()=>{ d?.classList.add("show"); d?.removeAttribute("hidden"); });
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

/* NFT grid */
(function renderNFTs(){
  const g=$("#nftGrid"); if(!g) return;
  g.innerHTML = Array.from({length:10}).map((_,i)=>`
    <div class="nft">
      <img src="assets/images/mask/${i}.png" alt="ZUZU #${i+1}" loading="lazy"
           onerror="this.style.display='none'">
      <div class="meta"><b>ZUZU #${i+1}</b><span class="tag">${i%5===0?'Legendary':(i%2?'Rare':'Epic')}</span></div>
    </div>`).join("");
})();

/* Referral: URL ?ref=... yakala */
(function refLink(){
  const url = new URL(location.href);
  if(url.searchParams.get("ref")) localStorage.setItem(CONFIG.LS_REF, url.searchParams.get("ref"));
  const code = localStorage.getItem(CONFIG.LS_REF) || "YOURCODE";
  const out = $("#refLink");
  if(out){ out.value = `${location.origin}${location.pathname}?ref=${code}`; }
  $("#copyRef")?.addEventListener("click", ()=>{
    navigator.clipboard.writeText(out.value);
    const lang = localStorage.getItem(CONFIG.LS_LANG)||"en";
    alert(I[lang]?.copy || "Copied");
  });
  $("#shareWA")?.setAttribute("href", `https://wa.me/?text=${encodeURIComponent("250 ZUZU bonus: "+(out?.value||""))}`);
  $("#shareTG")?.setAttribute("href", `https://t.me/share/url?url=${encodeURIComponent(out?.value||"")}&text=${encodeURIComponent("250 ZUZU bonus!")}`);
})();

/* Wallet (MetaMask + Polygon) */
let EVM_ADDR = localStorage.getItem(CONFIG.LS_ADDR) || null;
if(EVM_ADDR){ $("#btnConnect").textContent = `${EVM_ADDR.slice(0,6)}...${EVM_ADDR.slice(-4)}`; }

async function ensureMetamask(){
  if(window.ethereum) return true;
  if(IS_MOBILE){
    location.href = `https://metamask.app.link/dapp/${location.host}${location.pathname}`;
  }else{
    window.open("https://metamask.io/download/", "_blank");
  }
  alert("MetaMask not found. Opening install/dApp page.");
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
    console.error(e); alert("Wallet connect rejected or failed.");
  }
}
$("#btnConnect")?.addEventListener("click", connect);

/* UI: kontrat metni & butonlar */
(function contractUI(){
  $("#copyContract")?.addEventListener("click", ()=>{
    navigator.clipboard.writeText(CONFIG.SALE.contract);
    showToast({title:"Copied", msg:"Contract address copied.", ok:true});
  });
  $("#scanContract")?.setAttribute("href", scanAddr(CONFIG.SALE.contract));
  $("#addToken")?.addEventListener("click", async ()=>{
    if(!window.ethereum) return;
    try{
      const added = await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: CONFIG.TOKEN
        }
      });
      if(added) showToast({title:"Added", msg:"$ZUZU added to MetaMask.", ok:true});
    }catch(e){
      showToast({title:"Failed", msg:"Could not add token.", ok:false});
    }
  });
  const txt=$("#zuzuContractText"); if(txt) txt.textContent = CONFIG.SALE.contract;
})();

/* ============ SATIN ALMA (MATIC & USDT) ============ */
function currentPrice(){
  const start = getTarget();
  const weekMs = 15*24*3600*1000;
  let idx = 0;
  if(Date.now() >= start){ idx = Math.min(3, Math.floor((Date.now()-start)/weekMs)); }
  return {idx, price: CONFIG.PRICES[idx]};
}

/* adres doğrulama (hataları erkenden yakalamak için) */
function isAddr(x){ return /^0x[0-9a-fA-F]{40}$/.test(x||""); }

async function buy(){
  if(!EVM_ADDR){ await connect(); if(!EVM_ADDR) return; }

  const qty = parseAmount($("#buyAmount")?.value);
  if(qty < CONFIG.MIN_ZUZU){
    showToast({title:"Minimum amount", msg:`Minimum ${CONFIG.MIN_ZUZU} ZUZU.`, ok:false});
    return;
  }

  const {idx, price} = currentPrice();
  const pay = $("#payWith")?.value || "MATIC";

  try{
    let txHash;

    if(pay === "MATIC"){
      // MATIC — cüzdana gönderim (wallet) veya kontrata buyWithMatic
      const valueWei = "0x" + BigInt(Math.floor(qty * price * 1e18)).toString(16);
      if(CONFIG.SALE.mode === "contract" && isAddr(CONFIG.SALE.contract)){
        txHash = await ethereum.request({
          method:"eth_sendTransaction",
          params:[{ from:EVM_ADDR, to:CONFIG.SALE.contract, value:valueWei, data: SELECTORS.buyWithMatic }]
        });
      }else{
        txHash = await ethereum.request({
          method:"eth_sendTransaction",
          params:[{ from:EVM_ADDR, to:CONFIG.SALE.recipient, value:valueWei }]
        });
      }
    }else{
      // USDT — *** approve -> buyWithUSDT(...) *** (primary)
      const amount = BigInt(Math.floor(qty * price * 1e6)); // USDT 6 decimals

      if(CONFIG.SALE.mode === "contract" && isAddr(CONFIG.SALE.contract)){
        // 1) approve(contract, amount)
        await ethereum.request({
          method:"eth_sendTransaction",
          params:[{ from:EVM_ADDR, to:CONFIG.USDT, data: encodeApprove(CONFIG.SALE.contract, amount) }]
        });

        // 2) buyWithUSDT(...) — önce (address,uint256), sonra (uint256) deneriz
        try{
          txHash = await ethereum.request({
            method:"eth_sendTransaction",
            params:[{ from:EVM_ADDR, to:CONFIG.SALE.contract, data: enc_buyWithUSDT_addr_amount(CONFIG.USDT, amount) }]
          });
        }catch(_e1){
          try{
            txHash = await ethereum.request({
              method:"eth_sendTransaction",
              params:[{ from:EVM_ADDR, to:CONFIG.SALE.contract, data: enc_buyWithUSDT_amount(amount) }]
            });
          }catch(_e2){
            // 3) Fallback — en azından kontrata USDT transfer (off-chain doğrulama için)
            txHash = await ethereum.request({
              method:"eth_sendTransaction",
              params:[{ from:EVM_ADDR, to:CONFIG.USDT, data: encodeTransfer(CONFIG.SALE.contract, amount) }]
            });
          }
        }
      }else{
        // wallet modu — doğrudan USDT recipient’a transfer
        txHash = await ethereum.request({
          method:"eth_sendTransaction",
          params:[{ from:EVM_ADDR, to:CONFIG.USDT, data: encodeTransfer(CONFIG.SALE.recipient, amount) }]
        });
      }
    }

    // Başarılı gönderim — toast + Polygonscan
    showToast({title:"Transaction sent", msg:`W${idx+1} • ${qty.toLocaleString()} ZUZU`, ok:true, link:scanLink(txHash)});

    // Referral & webhook kaydı
    const ref = localStorage.getItem(CONFIG.LS_REF)||"";
    const record = { ts:Date.now(), chain:"polygon", pay, qty, price, txHash, ref, buyer:EVM_ADDR };
    const hist = JSON.parse(localStorage.getItem("zuzu_purchases")||"[]"); hist.push(record);
    localStorage.setItem("zuzu_purchases", JSON.stringify(hist));
    if(CONFIG.WEBHOOK){
      try{ fetch(CONFIG.WEBHOOK,{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify(record)}); }catch(_){}
    }

    // Opsiyonel: otomatik claim İMZASI (backend)
    try{ await signClaimIntent({qty, price, ref, txHash}); }catch(_){}

    // Opsiyonel: kontrat üstünden otomatik claim
    try{ await tryAutoClaim(); }catch(_){}

  }catch(err){
    console.error(err);
    const m = (err && (err.data?.message || err.message)) || "Unknown error";
    let friendly = m;
    if(/User denied|Rejected|User rejected/i.test(m)) friendly = "User rejected the transaction.";
    else if(/insufficient funds/i.test(m)) friendly = "Insufficient funds.";
    else if(/invalid address|to address/i.test(m)) friendly = "Invalid destination address.";
    else if(/execution reverted/i.test(m)) friendly = "Contract reverted. Amount/phase limits?";
    else if(/nonce/i.test(m)) friendly = "Nonce issue. Try again.";
    showToast({title:"Transaction error", msg:friendly, ok:false});
  }
}

/* Otomatik claim için kontrat çağrısı */
async function tryAutoClaim(){
  if(!CONFIG.CLAIM.enabled) return;
  const to = CONFIG.CLAIM.contract;
  if(!to || !to.startsWith("0x")) return;

  const data = CONFIG.CLAIM.selector_claim || "";
  const dataFor = CONFIG.CLAIM.selector_claim_for ? (CONFIG.CLAIM.selector_claim_for + addr(EVM_ADDR)) : "";

  const payload = data || dataFor;
  if(!payload){ return; }

  const tx = await ethereum.request({
    method:"eth_sendTransaction",
    params:[{ from:EVM_ADDR, to, data: payload }]
  });
  showToast({title:"Claim sent", msg:"Claim tx submitted.", ok:true, link:scanLink(tx)});
}

/* Backend’e gönderilecek imza (claim intent) */
async function signClaimIntent({qty, price, ref, txHash}){
  if(!CONFIG.WEBHOOK) return; // sadece backend varsa gerekli
  const message = `ZUZU Claim Intent:\naddress:${EVM_ADDR}\nqty:${qty}\nprice:${price}\nref:${ref}\ntx:${txHash}`;
  const sig = await ethereum.request({
    method:"personal_sign",
    params:[ message, EVM_ADDR ]
  });
  try{
    fetch(CONFIG.WEBHOOK, {method:"POST", headers:{'Content-Type':'application/json'},
      body: JSON.stringify({type:"claim_intent", address:EVM_ADDR, qty, price, ref, txHash, sig})
    });
  }catch(_){}
}

/* Bind */
$("#buyBtn")?.addEventListener("click", buy);

/* ticker nudge */
(function ensureTickerVisible(){
  const t=document.querySelector(".ticker__track"); if(!t) return;
  t.style.transform="translateX(0)"; setTimeout(()=>t.style.transform="", 60);
})();
