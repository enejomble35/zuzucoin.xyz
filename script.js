/* =========================
   ZUZU – Global Config
   (wallet-lite.js de burayı okur)
========================= */
window.ZUZU_CONFIG = {
  tokenSymbol: "ZUZU",
  tokenDecimals: 9,
  presalePrice: 0.0050, // başlangıç hafta fiyatı
  // Sol ödemelerinin gideceği adres:
  ownerSol: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF"
};

/* =========================
   Site Config (içerik)
========================= */
const CONFIG = {
  contractAddress: "0xF2bbbEcB417725813BF5E940d678793fACDa9729",
  collectionUrl:
    "https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a/contract/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts",

  // Sayaç: 50 gün
  launchAt: Date.now() + 50 * 24 * 60 * 60 * 1000,

  // Haftalar & USDT eşdeğer fiyatlar (bilgilendirme amaçlı UI)
  saleStart: Date.now(),
  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100],

  // NFT grid
  nfts: [
    { id: 0, name: "ZUZU Hero", rarity: "Epic", supply: 200 },
    { id: 1, name: "ZUZU Rogue", rarity: "Rare", supply: 2500 },
    { id: 2, name: "ZUZU Berserker", rarity: "Epic", supply: 800 },
    { id: 3, name: "ZUZU Hacker", rarity: "Rare", supply: 600 },
    { id: 4, name: "ZUZU Sorceress", rarity: "Epic", supply: 750 },
    { id: 5, name: "ZUZU Warrior", rarity: "Rare", supply: 900 },
    { id: 6, name: "ZUZU Maiden", rarity: "Rare", supply: 1100 },
    { id: 7, name: "ZUZU Ranger", rarity: "Rare", supply: 1000 },
    { id: 8, name: "ZUZU Scientist", rarity: "Epic", supply: 1100 },
    { id: 9, name: "ZUZU Titan", rarity: "Legendary", supply: 250 }
  ]
};

/* =========================
   Çoklu Dil – EN/TR/FR/ES/RU
========================= */
const I = {
  en: {
    nav_presale: "Pre-Sale",
    nav_stake: "Stake",
    nav_nft: "NFT Rewards",
    nav_roadmap: "Roadmap",
    nav_token: "Tokenomics",
    connect: "Connect Wallet",

    hero_badge: "Pre-Sale • Stake to Win NFT",
    hero_title: "ZUZU — Robotic Hedgehog 🦔⚡",
    hero_lead:
      "Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high <b>utility</b>.",
    cta_stake: "Start Staking",
    cta_nft: "NFT Rewards",
    collection_page: "Collection Page",
    contract: "Contract:",

    days: "DAYS",
    hours: "HOURS",
    mins: "MINUTES",
    secs: "SECONDS",

    presale_title: "Pre-Sale — Countdown",
    presale_lead:
      "Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",
    amount: "Amount (ZUZU)",

    w1: "Week 1 (Cheapest)",
    w2: "Week 2",
    w3: "Week 3",
    w4: "Week 4 (Last Chance)",
    cost: "Cost:",
    buy: "Buy",
    exchanges: "Supported Exchanges",

    stake_title: "Stake Pro — Lock, Earn, Get NFT ✨",
    stake_lead:
      "Lock your ZUZU, earn <b>APY + NFT BOOST</b>. Early stakers get badge & airdrop priority.",

    calc_title: "Earnings Calculator",
    amount2: "Amount (ZUZU)",
    lock: "Lock Period",
    nft_have: "Have NFT?",
    early: "Early Badge",
    calc_btn: "Calculate",
    ret: "Total Return",
    avg: "Monthly Avg",
    boost: "Total Boost",

    token_title: "Tokenomics (Visualized)",
    road_title: "Roadmap",
    road_lead:
      "Clear plan focused on community, staking, NFT drops, listings."
  },

  tr: {
    nav_presale: "Ön Satış",
    nav_stake: "Stake",
    nav_nft: "NFT Ödülleri",
    nav_roadmap: "Yol Haritası",
    nav_token: "Tokonomi",
    connect: "Cüzdan Bağla",

    hero_badge: "Ön Satış • Stake ile NFT Kazan",
    hero_title: "ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",
    hero_lead:
      "Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
    cta_stake: "Stake Etmeye Başla",
    cta_nft: "NFT Ödülleri",
    collection_page: "Koleksiyon Sayfası",
    contract: "Kontrat:",

    days: "GÜN",
    hours: "SAAT",
    mins: "DAKİKA",
    secs: "SANİYE",

    presale_title: "Ön Satış — Geri Sayım",
    presale_lead:
      "ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",
    amount: "Miktar (ZUZU)",

    w1: "1. Hafta (En Ucuz)",
    w2: "2. Hafta",
    w3: "3. Hafta",
    w4: "4. Hafta (Son Fırsat)",
    cost: "Maliyet:",
    buy: "Satın Al",
    exchanges: "Desteklenen Borsalar",

    stake_title: "Stake Pro — Kilitle, Kazan, NFT Kap ✨",
    stake_lead:
      "ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile pasif gelir elde et. Erken stake edenler rozet & airdrop önceliği alır.",

    calc_title: "Kazanç Hesaplayıcı",
    amount2: "Miktar (ZUZU)",
    lock: "Kilit Süresi",
    nft_have: "Elinde NFT var mı?",
    early: "Erken Rozet",
    calc_btn: "Hesapla",
    ret: "Toplam Getiri",
    avg: "Aylık Ortalama",
    boost: "Toplam Boost",

    token_title: "Tokonomi (Görselleştirilmiş)",
    road_title: "Yol Haritası",
    road_lead:
      "Topluluk, staking, NFT drop’ları ve listelemelere odaklı plan."
  },

  fr: {
    nav_presale: "Pré-vente",
    nav_stake: "Stake",
    nav_nft: "Récompenses NFT",
    nav_roadmap: "Feuille de route",
    nav_token: "Tokenomics",
    connect: "Connecter le Wallet",

    hero_badge: "Pré-vente • Stake pour gagner un NFT",
    hero_title: "ZUZU — Hérisson Robotique 🦔⚡",
    hero_lead:
      "Stake et gagne un <b>NFT Mascotte ZUZU</b>. Offre limitée, forte <b>utilité</b>.",
    cta_stake: "Commencer le Stake",
    cta_nft: "Récompenses NFT",
    collection_page: "Page de la Collection",
    contract: "Contrat :",

    days: "JOURS",
    hours: "HEURES",
    mins: "MINUTES",
    secs: "SECONDES",

    presale_title: "Pré-vente — Compte à rebours",
    presale_lead:
      "Prépare-toi pour la pré-vente ZUZU ! <b>Allocation limitée</b>, prix communauté.",
    amount: "Montant (ZUZU)",

    w1: "Semaine 1 (Moins cher)",
    w2: "Semaine 2",
    w3: "Semaine 3",
    w4: "Semaine 4 (Dernière chance)",
    cost: "Coût :",
    buy: "Acheter",
    exchanges: "Bourses prises en charge",

    stake_title: "Stake Pro — Verrouille, Gagne, Reçois un NFT ✨",
    stake_lead:
      "Verrouille ton ZUZU, gagne <b>APY + BOOST NFT</b>. Badge & airdrop prioritaires pour les premiers.",

    calc_title: "Calculateur de gains",
    amount2: "Montant (ZUZU)",
    lock: "Période de verrouillage",
    nft_have: "Tu as un NFT ?",
    early: "Badge précoce",
    calc_btn: "Calculer",
    ret: "Gain total",
    avg: "Moyenne mensuelle",
    boost: "Boost total",

    token_title: "Tokenomics (Visualisé)",
    road_title: "Feuille de route",
    road_lead:
      "Plan axé sur communauté, staking, drops NFT et listings."
  },

  es: {
    nav_presale: "Pre-venta",
    nav_stake: "Stake",
    nav_nft: "Recompensas NFT",
    nav_roadmap: "Hoja de ruta",
    nav_token: "Tokenomics",
    connect: "Conectar Billetera",

    hero_badge: "Pre-venta • Stake para ganar NFT",
    hero_title: "ZUZU — Erizo Robótico 🦔⚡",
    hero_lead:
      "Haz stake y gana <b>NFT Mascota ZUZU</b>. Suministro limitado, gran <b>utilidad</b>.",
    cta_stake: "Empezar Stake",
    cta_nft: "Recompensas NFT",
    collection_page: "Página de Colección",
    contract: "Contrato:",

    days: "DÍAS",
    hours: "HORAS",
    mins: "MINUTOS",
    secs: "SEGUNDOS",

    presale_title: "Pre-venta — Cuenta regresiva",
    presale_lead:
      "¡Prepárate para la pre-venta ZUZU! <b>Asignación limitada</b>, precio para la comunidad.",
    amount: "Cantidad (ZUZU)",

    w1: "Semana 1 (Más barata)",
    w2: "Semana 2",
    w3: "Semana 3",
    w4: "Semana 4 (Última oportunidad)",
    cost: "Costo:",
    buy: "Comprar",
    exchanges: "Exchanges compatibles",

    stake_title: "Stake Pro — Bloquea, Gana, Obtén NFT ✨",
    stake_lead:
      "Bloquea tu ZUZU, gana <b>APY + BOOST NFT</b>. Primeros obtienen insignia y prioridad de airdrop.",

    calc_title: "Calculadora de ganancias",
    amount2: "Cantidad (ZUZU)",
    lock: "Periodo de bloqueo",
    nft_have: "¿Tienes NFT?",
    early: "Insignia temprana",
    calc_btn: "Calcular",
    ret: "Retorno total",
    avg: "Promedio mensual",
    boost: "Impulso total",

    token_title: "Tokenomics (Visualizado)",
    road_title: "Hoja de ruta",
    road_lead:
      "Plan centrado en comunidad, staking, drops NFT y listados."
  },

  ru: {
    nav_presale: "Предпродажа",
    nav_stake: "Стейкинг",
    nav_nft: "Награды NFT",
    nav_roadmap: "Дорожная карта",
    nav_token: "Токеномика",
    connect: "Подключить кошелёк",

    hero_badge: "Предпродажа • Стейкни и получи NFT",
    hero_title: "ZUZU — Роботизированный Ёж 🦔⚡",
    hero_lead:
      "Стейкни и получай <b>маскот-NFT ZUZU</b>. Ограниченный выпуск, высокая <b>польза</b>.",
    cta_stake: "Начать стейкинг",
    cta_nft: "Награды NFT",
    collection_page: "Страница коллекции",
    contract: "Контракт:",

    days: "ДНИ",
    hours: "ЧАСЫ",
    mins: "МИНУТЫ",
    secs: "СЕКУНДЫ",

    presale_title: "Предпродажа — Обратный отсчёт",
    presale_lead:
      "Готовься к предпродаже ZUZU! <b>Ограниченная аллокация</b>, цена для комьюнити.",
    amount: "Количество (ZUZU)",

    w1: "Неделя 1 (дешевле всего)",
    w2: "Неделя 2",
    w3: "Неделя 3",
    w4: "Неделя 4 (последний шанс)",
    cost: "Стоимость:",
    buy: "Купить",
    exchanges: "Поддерживаемые биржи",

    stake_title: "Stake Pro — Заморозь, Заработай, Получи NFT ✨",
    stake_lead:
      "Заморозь свои ZUZU, зарабатывай <b>APY + NFT BOOST</b>. Ранним — значок и приоритет airdrop.",

    calc_title: "Калькулятор дохода",
    amount2: "Количество (ZUZU)",
    lock: "Период блокировки",
    nft_have: "Есть NFT?",
    early: "Ранний значок",
    calc_btn: "Рассчитать",
    ret: "Итоговый доход",
    avg: "Среднемес.",
    boost: "Итоговый буст",

    token_title: "Токеномика (визуализация)",
    road_title: "Дорожная карта",
    road_lead:
      "Чёткий план: комьюнити, стейкинг, дропы NFT, листинги."
  }
};

function applyLang(lang = "en") {
  document.querySelectorAll("[data-i]").forEach((el) => {
    const k = el.getAttribute("data-i");
    if (I[lang] && I[lang][k]) el.innerHTML = I[lang][k];
  });
}

/* =========================
   Helpers
========================= */
function getActiveWeek() {
  const days = Math.floor((Date.now() - CONFIG.saleStart) / 86400000);
  if (days < 7) return 0;
  if (days < 14) return 1;
  if (days < 21) return 2;
  return 3;
}

function safeNum(v) {
  const n = parseFloat((v ?? "0").toString().replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/* =========================
   DOM Bağlantıları (DOMContentLoaded)
========================= */
document.addEventListener("DOMContentLoaded", () => {
  /* ---- Dil seçimi + bayraklar ---- */
  const langSel = document.getElementById("langSel");
  if (langSel) {
    langSel.addEventListener("change", () => applyLang(langSel.value));
    applyLang(langSel.value || "en");
  } else {
    applyLang("en");
  }

  /* ---- Sayaç ---- */
  function tick() {
    const left = Math.max(0, CONFIG.launchAt - Date.now());
    const d = Math.floor(left / 86400000);
    const h = Math.floor((left % 86400000) / 3600000);
    const m = Math.floor((left % 3600000) / 60000);
    const s = Math.floor((left % 60000) / 1000);
    const pad = (n) => n.toString().padStart(2, "0");
    const ids = ["cdDays", "cdHours", "cdMins", "cdSecs"];
    [d, h, m, s].forEach((v, i) => {
      const el = document.getElementById(ids[i]);
      if (el && el.textContent !== pad(v)) el.textContent = pad(v);
    });
  }
  tick();
  setInterval(tick, 1000);

  /* ---- Aktif hafta butonları ---- */
  function updateActiveWeekUI() {
    const w = getActiveWeek();
    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById("buyW" + i);
      if (!btn) continue;
      if (i === w) {
        btn.disabled = false;
        btn.classList.add("active-week");
      } else {
        btn.disabled = true;
        btn.classList.remove("active-week");
      }
    }
  }
  updateActiveWeekUI();

  /* ---- Maliyet hesapları ---- */
  function updateCosts() {
    const qty = safeNum(document.getElementById("buyAmount")?.value);
    CONFIG.weekPrices.forEach((p, i) => {
      const cost = qty * p;
      const priceEl = document.getElementById("p" + i);
      const costEl = document.getElementById("c" + i);
      if (priceEl) priceEl.textContent = p.toFixed(4);
      if (costEl) costEl.textContent = (isFinite(cost) ? cost : 0).toLocaleString();
    });
  }
  document.getElementById("buyAmount")?.addEventListener("input", updateCosts);
  updateCosts();

  /* ---- NFT Grid ---- */
  (function renderNFTs() {
    const g = document.getElementById("nftGrid");
    if (!g) return;
    let html = "";
    CONFIG.nfts.forEach((n) => {
      const img = `assets/images/mask/${n.id}.png`;
      const link = `${CONFIG.collectionUrl}?tokenId=${n.id}`;
      html += `
        <div class="nft">
          <img src="${img}" alt="${n.name}" loading="lazy"
               style="aspect-ratio:1/1;object-fit:contain;background:#0f1a30;padding:8px;border-bottom:1px solid #1d2d50"
               onerror="this.style.display='none'">
          <div class="meta">
            <div>
              <b>${n.name}</b>
              <div style="color:#9fb6e6;font-size:.9rem">Supply: ${n.supply.toLocaleString()}</div>
            </div>
            <span class="tag">${n.rarity}</span>
          </div>
          <a class="z-btn z-btn-ghost" style="margin:0 10px 10px" href="${link}" target="_blank" rel="noopener">View ↗</a>
        </div>`;
    });
    g.innerHTML = html;
  })();

  /* ---- Stake Hesaplayıcı ---- */
  (function setupCalc() {
    const amount = document.getElementById("stakeAmount");
    const duration = document.getElementById("stakeDuration");
    const nft = document.getElementById("nftBoost");
    const early = document.getElementById("earlyBoost");
    const total = document.getElementById("resultTotal");
    const monthly = document.getElementById("resultMonthly");
    const boost = document.getElementById("resultBoost");
    if (!amount || !duration || !nft || !early || !total || !monthly || !boost)
      return;

    const apy = { 30: 12, 90: 24, 180: 40, 365: 65, 540: 85 };
    const calc = () => {
      const a = safeNum(amount.value);
      const d = parseInt(duration.value, 10) || 0;
      const base = apy[d] || 0;
      const nb = parseFloat(nft.value || "0"),
        eb = parseFloat(early.value || "0");
      const tb = nb + eb;
      const gross = a * ((base + tb) / 100) * (d / 365);
      const m = d > 0 ? gross / (d / 30) : 0;
      total.textContent = gross.toFixed(2) + " ZUZU";
      monthly.textContent = m.toFixed(2) + " ZUZU";
      boost.textContent = "+" + tb + "%";
    };
    document.getElementById("calcBtn")?.addEventListener("click", calc);
    calc();
  })();

  /* ---- Linkler & Kontrat ---- */
  (function setupLinks() {
    const c = CONFIG.contractAddress;
    const short = `${c.slice(0, 6)}...${c.slice(-4)}`;
    const cd = document.getElementById("contractDisplay");
    const cd2 = document.getElementById("contractDisplay2");
    if (cd) cd.textContent = short;
    if (cd2) cd2.textContent = c;

    const t1 = document.getElementById("thirdwebNFTRoute");
    const t2 = document.getElementById("thirdwebNFTRoute2");
    if (t1) t1.href = CONFIG.collectionUrl;
    if (t2) t2.href = CONFIG.collectionUrl;
  })();

  /* ---- Solana Cüzdan Bağlantısı (wallet-lite.js) ---- */
  const connectBtn = document.getElementById("connectBtn");
  if (connectBtn) {
    connectBtn.addEventListener("click", () => {
      if (typeof window.openWalletModal === "function") {
        // modalı aç (Phantom / Solflare / Backpack)
        window.openWalletModal();
      } else {
        alert("Wallet module not loaded. Please refresh the page.");
      }
    });
  }

  /* ---- Satın Alma butonları (Sol/SPL- USDT mantığı wallet-lite.js içinde) ---- */
  ["buyW0", "buyW1", "buyW2", "buyW3"].forEach((id, i) => {
    const b = document.getElementById(id);
    if (!b) return;
    b.addEventListener("click", async () => {
      // Aktif hafta kontrolü (UI)
      const active = getActiveWeek();
      if (i !== active) {
        alert("This week is not active.");
        return;
      }

      const qty = safeNum(document.getElementById("buyAmount")?.value);
      if (qty <= 0) {
        alert("Enter a valid amount.");
        return;
      }

      // satın alma çağrısını wallet-lite.js’e delege et
      if (typeof window.solanaPresaleBuy === "function") {
        try {
          await window.solanaPresaleBuy({
            quantity: qty,
            usdtPrice: CONFIG.weekPrices[i] // referans bilgi
          });
        } catch (e) {
          console.error(e);
          alert("Transaction failed or cancelled.");
        }
      } else {
        alert("Wallet module not loaded. Please refresh the page.");
      }
    });
  });

  /* ---- Exchanges ticker görünürlüğü (mobil fix) ---- */
  (function ensureTickerVisible() {
    const track = document.getElementById("exTrack");
    if (!track) return;
    track.style.willChange = "transform";
    track.style.transform = "translateX(0)";
    setTimeout(() => {
      track.style.transform = "";
    }, 50);
  })();
});
