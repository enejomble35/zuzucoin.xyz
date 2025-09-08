/* =========================
   ZUZU — Global Config
========================= */
const CONFIG = {
  // SABİT LAUNCH TARİHİ (UTC) — yenileyince sıfırlanmaz
  launchAt: Date.parse('2025-11-30T00:00:00Z'),
  // presale başlangıcı (UTC)
  saleStart: Date.parse('2025-09-01T00:00:00Z'),
  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100],

  contractAddress: "0xF2bbbEcB417725813BF5E940d678793fACDa9729",
  collectionUrl:
    "https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a/contract/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts",

  nfts: [
    { id:0, name:"ZUZU Hero",      rarity:"Epic",      supply:200 },
    { id:1, name:"ZUZU Rogue",     rarity:"Rare",      supply:2500 },
    { id:2, name:"ZUZU Berserker", rarity:"Epic",      supply:800 },
    { id:3, name:"ZUZU Hacker",    rarity:"Rare",      supply:600 },
    { id:4, name:"ZUZU Sorceress", rarity:"Epic",      supply:750 },
    { id:5, name:"ZUZU Warrior",   rarity:"Rare",      supply:900 },
    { id:6, name:"ZUZU Maiden",    rarity:"Rare",      supply:1100 },
    { id:7, name:"ZUZU Ranger",    rarity:"Rare",      supply:1000 },
    { id:8, name:"ZUZU Scientist", rarity:"Epic",      supply:1100 },
    { id:9, name:"ZUZU Titan",     rarity:"Legendary", supply:250 }
  ]
};

/* =========================
   Diller (EN/TR/FR/ES/RU/PL)
========================= */
const I = {
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
      hero_lead:"Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high <b>utility</b>.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",
      amount:"Amount (ZUZU)",w1:"Week 1 (Cheapest)",w2:"Week 2",w3:"Week 3",w4:"Week 4 (Last Chance)",cost:"Cost:",buy:"Buy",
      exchanges:"Supported Exchanges",stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",
      stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>. Early stakers get badge & airdrop priority.",
      calc_title:"Earnings Calculator",amount2:"Amount (ZUZU)",lock:"Lock Period",nft_have:"Have NFT?",early:"Early Badge",
      calc_btn:"Calculate",ret:"Total Return",avg:"Monthly Avg",boost:"Total Boost",token_title:"Tokenomics (Visualized)"},
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",
      hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",
      amount:"Miktar (ZUZU)",w1:"1. Hafta (En Ucuz)",w2:"2. Hafta",w3:"3. Hafta",w4:"4. Hafta (Son Fırsat)",cost:"Maliyet:",buy:"Satın Al",
      exchanges:"Desteklenen Borsalar",stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",
      stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile pasif gelir elde et. Erken stake edenler rozet & airdrop önceliği alır.",
      calc_title:"Kazanç Hesaplayıcı",amount2:"Miktar (ZUZU)",lock:"Kilit Süresi",nft_have:"Elinde NFT var mı?",early:"Erken Rozet",
      calc_btn:"Hesapla",ret:"Toplam Getiri",avg:"Aylık Ortalama",boost:"Toplam Boost",token_title:"Tokonomi (Görselleştirilmiş)"},
  fr:{nav_presale:"Pré-vente",nav_stake:"Stake",nav_nft:"Récompenses NFT",nav_roadmap:"Feuille de route",nav_token:"Tokenomics",connect:"Connecter le Wallet",
      hero_badge:"Pré-vente • Stake pour gagner un NFT",hero_title:"ZUZU — Hérisson Robotique 🦔⚡",
      hero_lead:"Stake et gagne un <b>NFT Mascotte ZUZU</b>. Offre limitée, forte <b>utilité</b>.",
      cta_stake:"Commencer le Stake",cta_nft:"Récompenses NFT",days:"JOURS",hours:"HEURES",mins:"MINUTES",secs:"SECONDES",
      presale_title:"Pré-vente — Compte à rebours",presale_lead:"Prépare-toi ! <b>Allocation limitée</b>, prix communauté.",amount:"Montant (ZUZU)",
      w1:"Semaine 1 (Moins cher)",w2:"Semaine 2",w3:"Semaine 3",w4:"Semaine 4 (Dernière chance)",cost:"Coût :",buy:"Acheter",
      exchanges:"Bourses",stake_title:"Stake Pro — Verrouille, Gagne, Reçois un NFT ✨",
      stake_lead:"Verrouille ton ZUZU, gagne <b>APY + BOOST NFT</b>. Badge & airdrop prioritaire.",
      calc_title:"Calculateur de gains",amount2:"Montant (ZUZU)",lock:"Période",nft_have:"Tu as un NFT ?",early:"Badge précoce",
      calc_btn:"Calculer",ret:"Gain total",avg:"Moyenne mensuelle",boost:"Boost total",token_title:"Tokenomics (Visualisé)"},
  es:{nav_presale:"Pre-venta",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Hoja de ruta",nav_token:"Tokenomics",connect:"Conectar Billetera",
      hero_badge:"Pre-venta • Stake para ganar NFT",hero_title:"ZUZU — Erizo Robótico 🦔⚡",
      hero_lead:"Haz stake y gana <b>NFT Mascota ZUZU</b>. Suministro limitado, gran <b>utilidad</b>.",
      cta_stake:"Empezar Stake",cta_nft:"Recompensas NFT",days:"DÍAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",
      presale_title:"Pre-venta — Cuenta regresiva",presale_lead:"¡Prepárate! <b>Asignación limitada</b>, precio comunidad.",amount:"Cantidad (ZUZU)",
      w1:"Semana 1 (Más barata)",w2:"Semana 2",w3:"Semana 3",w4:"Semana 4 (Última oportunidad)",cost:"Costo:",buy:"Comprar",
      exchanges:"Exchanges",stake_title:"Stake Pro — Bloquea, Gana, Obtén NFT ✨",
      stake_lead:"Bloquea tu ZUZU y gana <b>APY + BOOST NFT</b>.",calc_title:"Calculadora de ganancias",amount2:"Cantidad (ZUZU)",
      lock:"Periodo de bloqueo",nft_have:"¿Tienes NFT?",early:"Insignia temprana",calc_btn:"Calcular",ret:"Retorno total",avg:"Promedio mensual",boost:"Impulso total",
      token_title:"Tokenomics (Visualizado)"},
  ru:{nav_presale:"Предпродажа",nav_stake:"Стейкинг",nav_nft:"NFT Награды",nav_roadmap:"Дорожная карта",nav_token:"Токеномика",connect:"Подключить кошелёк",
      hero_badge:"Предпродажа • Стейкни и выиграй NFT",hero_title:"ZUZU — Роботизированный Ёж 🦔⚡",
      hero_lead:"Стейкай и выиграй <b>NFT ZUZU</b>. Ограниченная эмиссия, высокая <b>польза</b>.",
      cta_stake:"Начать стейкинг",cta_nft:"NFT Награды",days:"ДНИ",hours:"ЧАСЫ",mins:"МИНУТЫ",secs:"СЕКУНДЫ",
      presale_title:"Предпродажа — Обратный отсчёт",presale_lead:"Готовься! <b>Ограниченная аллокация</b>.",amount:"Количество (ZUZU)",
      w1:"Неделя 1 (Дешевле)",w2:"Неделя 2",w3:"Неделя 3",w4:"Неделя 4 (Последний шанс)",cost:"Стоимость:",buy:"Купить",
      exchanges:"Биржи",stake_title:"Stake Pro — Заблокируй, Заработай, Получи NFT ✨",
      stake_lead:"Блокируй ZUZU и получай <b>APY + NFT BOOST</b>.",calc_title:"Калькулятор дохода",amount2:"Количество (ZUZU)",lock:"Период блокировки",
      nft_have:"Есть NFT?",early:"Ранняя нашивка",calc_btn:"Рассчитать",ret:"Итоговый доход",avg:"В месяц",boost:"Бонус",token_title:"Токеномика (Визуально)"},
  pl:{nav_presale:"Przedsprzedaż",nav_stake:"Stake",nav_nft:"Nagrody NFT",nav_roadmap:"Mapa drogowa",nav_token:"Tokenomika",connect:"Połącz portfel",
      hero_badge:"Przedsprzedaż • Stake aby wygrać NFT",hero_title:"ZUZU — Robotyczny Jeż 🦔⚡",
      hero_lead:"Stake’uj i wygrywaj <b>Maskotkę NFT ZUZU</b>.",cta_stake:"Zacznij stake’ować",cta_nft:"Nagrody NFT",
      days:"DNI",hours:"GODZ",mins:"MIN",secs:"SEK",presale_title:"Przedsprzedaż — Odliczanie",presale_lead:"<b>Ograniczona alokacja</b>.",
      amount:"Ilość (ZUZU)",w1:"Tydzień 1",w2:"Tydzień 2",w3:"Tydzień 3",w4:"Tydzień 4",cost:"Koszt:",buy:"Kup",
      exchanges:"Wspierane giełdy",stake_title:"Stake Pro — Zablokuj, Zarabiaj, Odbierz NFT ✨",
      stake_lead:"Zablokuj ZUZU i zarabiaj <b>APY + NFT BOOST</b>.",calc_title:"Kalkulator zysków",amount2:"Ilość (ZUZU)",lock:"Okres blokady",
      nft_have:"Masz NFT?",early:"Wczesna odznaka",calc_btn:"Oblicz",ret:"Suma zwrotu",avg:"Miesięcznie",boost:"Łączny boost",token_title:"Tokenomika (wizualizacja)"}
};
const LANGS = [
  {code:'en',name:'EN',flag:'flags/en.png'},
  {code:'tr',name:'TR',flag:'flags/tr.png'},
  {code:'fr',name:'FR',flag:'flags/fr.png'},
  {code:'es',name:'ES',flag:'flags/es.png'},
  {code:'ru',name:'RU',flag:'flags/ru.png'},
  {code:'pl',name:'PL',flag:'flags/pt.png'} // elinde pl.png yoksa pt.png kullanılıyor
];

function applyLang(lang="en"){
  document.querySelectorAll("[data-i]").forEach(el=>{
    const k = el.getAttribute("data-i");
    if (I[lang] && I[lang][k]) el.innerHTML = I[lang][k];
  });
  const b = document.getElementById("connectBtn");
  if (b && I[lang]?.connect) b.textContent = I[lang].connect;
}
function buildLangMenu(){
  const saved = localStorage.getItem("zuzu_lang") || "en";
  const panel = document.getElementById("langPanel");
  const btnImg = document.getElementById("langBtnImg");
  const btnTxt = document.getElementById("langBtnText");
  if (!panel || !btnImg || !btnTxt) return;
  panel.innerHTML = LANGS.map(l=>`
    <div class="lang-item" data-lang="${l.code}">
      <img src="${l.flag}" alt="${l.name}"><span>${l.name}</span>
    </div>`).join("");
  const current = LANGS.find(l=>l.code===saved) || LANGS[0];
  btnImg.src = current.flag; btnTxt.textContent = current.name;
  document.getElementById("langBtn").onclick = ()=>{
    panel.classList.toggle("show");
    panel.setAttribute("aria-hidden", panel.classList.contains("show") ? "false":"true");
  };
  panel.onclick = (e)=>{
    const item = e.target.closest(".lang-item"); if(!item) return;
    const code = item.dataset.lang;
    const sel = LANGS.find(l=>l.code===code);
    localStorage.setItem("zuzu_lang", code);
    btnImg.src = sel.flag; btnTxt.textContent = sel.name;
    applyLang(code);
    panel.classList.remove("show");
  };
  document.addEventListener("click",(e)=>{
    if (!panel.contains(e.target) && !document.getElementById("langBtn").contains(e.target)){
      panel.classList.remove("show");
    }
  });
}

/* ===== COUNTDOWN (Sabit tarih) ===== */
function tick(){
  const left = Math.max(0, CONFIG.launchAt - Date.now());
  const d = Math.floor(left / 86400000);
  const h = Math.floor((left % 86400000) / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  const pad = n=>String(n).padStart(2,"0");
  const ids = ["cdDays","cdHours","cdMins","cdSecs"];
  [d,h,m,s].forEach((v,i)=>{ const el=document.getElementById(ids[i]); if(el) el.textContent=pad(v); });
}

/* ===== Presale aktif hafta & maliyet ===== */
function getActiveWeek(){
  const days = Math.floor((Date.now() - CONFIG.saleStart) / 86400000);
  if (days < 7)  return 0;
  if (days < 14) return 1;
  if (days < 21) return 2;
  return 3;
}
function updateActiveWeekUI(){
  const w = getActiveWeek();
  for(let i=0;i<4;i++){
    const btn = document.getElementById("buyW"+i); if(!btn) continue;
    if (i === w) { btn.disabled=false; btn.classList.add("active-week"); }
    else { btn.disabled=true; btn.classList.remove("active-week"); }
  }
}
function updateCosts(){
  const qty = parseFloat((document.getElementById("buyAmount")?.value||"0").toString().replace(/[^\d.]/g,"")) || 0;
  CONFIG.weekPrices.forEach((p,i)=>{
    const cost = qty * p;
    const priceEl = document.getElementById("p"+i);
    const costEl  = document.getElementById("c"+i);
    if (priceEl) priceEl.textContent = p.toFixed(4);
    if (costEl)  costEl.textContent  = (isFinite(cost)?cost:0).toLocaleString();
  });
}

/* ===== NFT GRID ===== */
(function renderNFTs(){
  const g = document.getElementById("nftGrid");
  if (!g) return;
  g.innerHTML = CONFIG.nfts.map(n=>`
    <div class="nft">
      <img src="assets/images/mask/${n.id}.png"
           onerror="this.onerror=null;this.src='assets/images/branding/zuzu-logo.png'"
           alt="${n.name}">
      <div class="meta">
        <div><b>${n.name}</b><div style="color:#9fb6e6;font-size:.9rem">${n.rarity}</div></div>
        <span class="tag">${n.supply.toLocaleString()}</span>
      </div>
      <a class="z-btn z-btn-ghost" style="margin:0 10px 10px" href="${CONFIG.collectionUrl}?tokenId=${n.id}" target="_blank" rel="noopener">View ↗</a>
    </div>`).join("");
})();

/* ===== INIT ===== */
window.addEventListener("DOMContentLoaded", ()=>{
  buildLangMenu();
  applyLang(localStorage.getItem("zuzu_lang")||"en");
  tick(); updateActiveWeekUI(); updateCosts();
  setInterval(tick, 1000);
  document.getElementById("buyAmount")?.addEventListener("input", updateCosts);

  // link & kontrat göstergeleri
  const c = CONFIG.contractAddress;
  const short = `${c.slice(0,6)}...${c.slice(-4)}`;
  const cd = document.getElementById("contractDisplay");
  const cd2 = document.getElementById("contractDisplay2");
  if (cd)  cd.textContent = short;
  if (cd2) cd2.textContent = c;
  const t1 = document.getElementById("thirdwebNFTRoute");
  const t2 = document.getElementById("thirdwebNFTRoute2");
  if (t1) t1.href = CONFIG.collectionUrl;
  if (t2) t2.href = CONFIG.collectionUrl;
});
