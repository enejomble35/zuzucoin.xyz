/* =========================
   ZUZU — Global Config
========================= */
const CONFIG = {
  ownerSol: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF",
  contractAddress: "0xF2bbbEcB417725813BF5E940d678793fACDa9729",
  collectionUrl: "https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a/contract/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts",
  launchAt: Date.now() + 50 * 24 * 60 * 60 * 1000,
  saleStart: Date.now(),
  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100], // fiyat USDT
  // Tahmini kur: 1 SOL ≈ X USDT (ekranda "est." olarak gösterilir)
  fx: { sol_usdt: 150 },
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
   LANG (EN/TR/FR/ES/RU)
========================= */
const I = {
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
      hero_lead:"Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high <b>utility</b>.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",collection_page:"Collection Page",contract:"Contract:",
      days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",amount:"Amount (ZUZU)",
      w1:"Week 1 (Cheapest)",w2:"Week 2",w3:"Week 3",w4:"Week 4 (Last Chance)",cost:"Cost:",buy:"Buy",exchanges:"Supported Exchanges",
      stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>. Early stakers get badge & airdrop priority.",
      calc_title:"Earnings Calculator",amount2:"Amount (ZUZU)",lock:"Lock Period",nft_have:"Have NFT?",early:"Early Badge",calc_btn:"Calculate",
      ret:"Total Return",avg:"Monthly Avg",boost:"Total Boost",token_title:"Tokenomics (Visualized)",road_title:"Roadmap",
      road_lead:"Clear plan focused on community, staking, NFT drops, listings.",
      pay:"Payment", pay_sol:"SOL (native)", pay_usdt:"USDT (SPL)", est:"est.", invite:"Referrals"},
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",
      hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",collection_page:"Koleksiyon Sayfası",contract:"Kontrat:",
      days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",amount:"Miktar (ZUZU)",
      w1:"1. Hafta (En Ucuz)",w2:"2. Hafta",w3:"3. Hafta",w4:"4. Hafta (Son Fırsat)",cost:"Maliyet:",buy:"Satın Al",exchanges:"Desteklenen Borsalar",
      stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile pasif gelir elde et. Erken stake edenler rozet & airdrop önceliği alır.",
      calc_title:"Kazanç Hesaplayıcı",amount2:"Miktar (ZUZU)",lock:"Kilit Süresi",nft_have:"Elinde NFT var mı?",early:"Erken Rozet",calc_btn:"Hesapla",
      ret:"Toplam Getiri",avg:"Aylık Ortalama",boost:"Toplam Boost",token_title:"Tokonomi (Görselleştirilmiş)",road_title:"Yol Haritası",
      road_lead:"Topluluk, staking, NFT drop’ları ve listelemelere odaklı plan.",
      pay:"Ödeme", pay_sol:"SOL (native)", pay_usdt:"USDT (SPL)", est:"tah.", invite:"Davet"},
  fr:{/* …aynı anahtarlar… */ pay:"Paiement",pay_sol:"SOL (natif)",pay_usdt:"USDT (SPL)",est:"est.",invite:"Parrainages"},
  es:{/* … */ pay:"Pago",pay_sol:"SOL (nativo)",pay_usdt:"USDT (SPL)",est:"aprox.",invite:"Referidos"},
  ru:{nav_presale:"Предпродажа",nav_stake:"Стейкинг",nav_nft:"NFT Награды",nav_roadmap:"Дорожная карта",nav_token:"Токеномика",connect:"Подключить кошелёк",
      hero_badge:"Предпродажа • Стейкинг и выигрыш NFT",hero_title:"ZUZU — Роботический Ёж 🦔⚡",
      hero_lead:"Стейкай и получай <b>ZUZU Маскот NFT</b>. Ограниченная эмиссия, высокая <b>польза</b>.",
      cta_stake:"Начать стейкинг",cta_nft:"NFT Награды",collection_page:"Коллекция",contract:"Контракт:",
      days:"ДНИ",hours:"ЧАСЫ",mins:"МИНУТЫ",secs:"СЕКУНДЫ",
      presale_title:"Предпродажа — Обратный отсчёт",presale_lead:"Готовься к предпродаже ZUZU! <b>Ограниченная аллокация</b>, цена для комьюнити.",amount:"Количество (ZUZU)",
      w1:"Неделя 1 (дешевле)",w2:"Неделя 2",w3:"Неделя 3",w4:"Неделя 4 (последний шанс)",cost:"Стоимость:",buy:"Купить",exchanges:"Поддерживаемые биржи",
      stake_title:"Stake Pro — Блокируй, Зарабатывай, Получай NFT ✨",stake_lead:"Блокируй ZUZU, получай <b>APY + NFT BOOST</b>.",
      calc_title:"Калькулятор дохода",amount2:"Количество (ZUZU)",lock:"Период блокировки",nft_have:"Есть NFT?",early:"Ранний бейдж",calc_btn:"Рассчитать",
      ret:"Всего",avg:"В мес.",boost:"Буст",token_title:"Токеномика (визуально)",road_title:"Дорожная карта",road_lead:"Чёткий план.",
      pay:"Оплата",pay_sol:"SOL (натив.)",pay_usdt:"USDT (SPL)",est:"~",invite:"Рефералы"}
};

function applyLang(lang = "en") {
  document.querySelectorAll("[data-i]").forEach(el => {
    const k = el.getAttribute("data-i");
    if (I[lang] && I[lang][k]) el.innerHTML = I[lang][k];
  });
  const btn = document.getElementById("connectBtn");
  if (btn) btn.dataset.iLabel = I[lang]?.connect || "Connect Wallet";
}
(function initLang() {
  const sel = document.getElementById("langSel");
  if (!sel) return;
  sel.addEventListener("change", () => applyLang(sel.value));
  applyLang("en");
})();

/* =========================
   Countdown
========================= */
function tick() {
  const left = Math.max(0, CONFIG.launchAt - Date.now());
  const d = Math.floor(left / 86400000);
  const h = Math.floor((left % 86400000) / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  const pad = n => n.toString().padStart(2, "0");
  const ids = ["cdDays", "cdHours", "cdMins", "cdSecs"];
  [d, h, m, s].forEach((v, i) => {
    const el = document.getElementById(ids[i]);
    if (el && el.textContent !== pad(v)) el.textContent = pad(v);
  });
}
tick(); setInterval(tick, 1000);

/* =========================
   Active sale week
========================= */
function getActiveWeek() {
  const days = Math.floor((Date.now() - CONFIG.saleStart) / 86400000);
  if (days < 7) return 0;
  if (days < 14) return 1;
  if (days < 21) return 2;
  return 3;
}
function updateActiveWeekUI() {
  const w = getActiveWeek();
  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById("buyW" + i);
    if (!btn) continue;
    if (i === w) { btn.disabled = false; btn.classList.add("active-week"); }
    else { btn.disabled = true; btn.classList.remove("active-week"); }
  }
}
updateActiveWeekUI();

/* =========================
   Presale costs + payment (SOL/USDT)
========================= */
function updateCosts() {
  const qty = parseFloat((document.getElementById("buyAmount")?.value || "0").toString().replace(/[^\d.]/g, "")) || 0;
  CONFIG.weekPrices.forEach((p, i) => {
    const costUSDT = qty * p;
    const priceEl = document.getElementById("p" + i);
    const costEl = document.getElementById("c" + i);
    const paySel = document.getElementById("paySel" + i);
    const estEl = document.getElementById("cEst" + i);

    if (priceEl) priceEl.textContent = p.toFixed(4);
    if (costEl) costEl.textContent = (isFinite(costUSDT) ? costUSDT : 0).toLocaleString(undefined,{maximumFractionDigits:2});

    if (paySel && estEl) {
      const mode = paySel.value; // 'USDT' or 'SOL'
      if (mode === "SOL") {
        const solAmt = costUSDT / (CONFIG.fx.sol_usdt || 150);
        estEl.textContent = `(${I.en.est || "est."} ${solAmt.toFixed(4)} SOL)`;
      } else {
        estEl.textContent = "";
      }
    }
  });
}
document.getElementById("buyAmount")?.addEventListener("input", updateCosts);

/* payment selector for each week */
["0","1","2","3"].forEach(i=>{
  const s = document.getElementById("paySel"+i);
  s?.addEventListener("change", updateCosts);
});

updateCosts();

/* =========================
   Buy (demo; deeplink/SDK sonrası)
========================= */
async function handleBuy(weekIndex) {
  const qty = parseFloat((document.getElementById("buyAmount")?.value || "0").toString().replace(/[^\d.]/g, "")) || 0;
  if (qty <= 0) return alert("Enter a valid amount.");
  const active = getActiveWeek();
  if (weekIndex !== active) return alert("This week is not active.");

  const price = CONFIG.weekPrices[weekIndex];
  const costUSDT = qty * price;

  const payMode = document.getElementById("paySel"+weekIndex)?.value || "USDT"; // 'USDT' or 'SOL'
  const pk = (window.__zuzu_pubkey && window.__zuzu_pubkey()) || "—";

  if (payMode === "USDT") {
    alert(`Demo summary\nWallet: ${pk}\nAmount: ${qty} ZUZU\nPayment: USDT (SPL)\nEst. cost: ${costUSDT.toFixed(2)} USDT\n\nNot: gerçek on-chain transfer için SPL/Solana SDK ile işlem yazılacaktır.`);
  } else {
    const estSOL = costUSDT / (CONFIG.fx.sol_usdt || 150);
    alert(`Demo summary\nWallet: ${pk}\nAmount: ${qty} ZUZU\nPayment: SOL\nEst. cost: ${estSOL.toFixed(4)} SOL (${costUSDT.toFixed(2)} USDT)\n\nNot: gerçek on-chain transfer için Solana transferi eklenecektir.`);
  }
}
["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
  const b = document.getElementById(id);
  b?.addEventListener("click", ()=>handleBuy(i));
});

/* =========================
   NFT Grid render
========================= */
function renderNFTs(){
  const g = document.getElementById("nftGrid");
  if (!g) return;
  let html = "";
  CONFIG.nfts.forEach(n=>{
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
}
renderNFTs();

/* =========================
   Referral (invite link + counter)
========================= */
(function referrals(){
  const bar = document.getElementById("inviteBar");
  if(!bar) return;

  function refresh(){
    const pk = (window.__zuzu_pubkey && window.__zuzu_pubkey()) || "";
    const link = (window.__zuzu_invite && window.__zuzu_invite()) || "";
    const count = parseInt(localStorage.getItem("zuzu_ref_count")||"0",10)||0;

    bar.innerHTML = pk ? `
      <span class="z-chip" title="Your pubkey">${pk.slice(0,6)}...${pk.slice(-6)}</span>
      <button class="z-btn z-btn-ghost" id="copyInvite">${I.en.invite||"Referrals"}: Copy link</button>
      <span class="z-chip">Joined: <b>${count}</b></span>
    ` : `<span class="z-chip">Connect wallet to get your invite link</span>`;

    document.getElementById("copyInvite")?.addEventListener("click", async ()=>{
      try { await navigator.clipboard.writeText(link); alert("Invite link copied!"); } catch { alert(link); }
    });
  }

  // Ref geldi mi?
  try{
    const ref = localStorage.getItem("zuzu_ref_from");
    if (ref) {
      // Aynı kullanıcıyı tekrar saymamak için cookie benzeri bayrak
      if (!localStorage.getItem("zuzu_ref_joined_once")) {
        const n = parseInt(localStorage.getItem("zuzu_ref_count")||"0",10)||0;
        localStorage.setItem("zuzu_ref_count", String(n+1));
        localStorage.setItem("zuzu_ref_joined_once","1");
      }
    }
  }catch{}

  refresh();
  ["load","pageshow","focus","visibilitychange"].forEach(ev=>{
    window.addEventListener(ev, ()=>{ if(ev!=="visibilitychange"||!document.hidden) refresh(); }, {passive:true});
  });
})();

/* =========================
   Links + contract labels
========================= */
(function setupLinks(){
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
})();

/* ========= Public config to share with wallet ========= */
window.ZUZU_CONFIG = {
  tokenSymbol: "ZUZU",
  tokenDecimals: 9,
  presalePrice: 0.0050, // USDT
  ownerSol: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF"
};

/* ========= Page config & content ========= */
const CONFIG = {
  contractAddress: "0xF2bbbEcB417725813BF5E940d678793fACDa9729",
  collectionUrl: "https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a/contract/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts",
  launchAt: Date.now() + 49*24*60*60*1000 + 23*3600000 + 56*60000 + 50*1000, // örnek
  saleStart: Date.now(),
  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100],
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

/* ========= i18n ========= */
const I = {
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
      hero_lead:"Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high <b>utility</b>.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",collection_page:"Collection Page",contract:"Contract:",
      days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",amount:"Amount (ZUZU)",
      w1:"Week 1 (Cheapest)",w2:"Week 2",w3:"Week 3",w4:"Week 4 (Last Chance)",cost:"Cost:",buy:"Buy",exchanges:"Supported Exchanges",
      stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>. Early stakers get badge & airdrop priority.",
      calc_title:"Earnings Calculator",amount2:"Amount (ZUZU)",lock:"Lock Period",nft_have:"Have NFT?",early:"Early Badge",calc_btn:"Calculate",
      ret:"Total Return",avg:"Monthly Avg",boost:"Total Boost",token_title:"Tokenomics (Visualized)",road_title:"Roadmap",
      road_lead:"Clear plan focused on community, staking, NFT drops, listings."},
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",
      hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",collection_page:"Koleksiyon Sayfası",contract:"Kontrat:",
      days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",amount:"Miktar (ZUZU)",
      w1:"1. Hafta (En Ucuz)",w2:"2. Hafta",w3:"3. Hafta",w4:"4. Hafta (Son Fırsat)",cost:"Maliyet:",buy:"Satın Al",exchanges:"Desteklenen Borsalar",
      stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile pasif gelir elde et. Erken stake edenler rozet & airdrop önceliği alır.",
      calc_title:"Kazanç Hesaplayıcı",amount2:"Miktar (ZUZU)",lock:"Kilit Süresi",nft_have:"Elinde NFT var mı?",early:"Erken Rozet",calc_btn:"Hesapla",
      ret:"Toplam Getiri",avg:"Aylık Ortalama",boost:"Toplam Boost",token_title:"Tokonomi (Görselleştirilmiş)",road_title:"Yol Haritası",
      road_lead:"Topluluk, staking, NFT drop’ları ve listelemelere odaklı plan."},
  fr:{nav_presale:"Pré-vente",nav_stake:"Stake",nav_nft:"Récompenses NFT",nav_roadmap:"Feuille de route",nav_token:"Tokenomics",connect:"Connecter le Wallet",
      hero_badge:"Pré-vente • Stake pour gagner un NFT",hero_title:"ZUZU — Hérisson Robotique 🦔⚡",
      hero_lead:"Stake et gagne un <b>NFT Mascotte ZUZU</b>. Offre limitée, forte <b>utilité</b>.",
      cta_stake:"Commencer le Stake",cta_nft:"Récompenses NFT",collection_page:"Page de la Collection",contract:"Contrat :",
      days:"JOURS",hours:"HEURES",mins:"MINUTES",secs:"SECONDES",
      presale_title:"Pré-vente — Compte à rebours",presale_lead:"Prépare-toi pour la pré-vente ZUZU ! <b>Allocation limitée</b>, prix communauté.",amount:"Montant (ZUZU)",
      w1:"Semaine 1 (Moins cher)",w2:"Semaane 2",w3:"Semaine 3",w4:"Semaine 4 (Dernière chance)",cost:"Coût :",buy:"Acheter",exchanges:"Bourses prises en charge",
      stake_title:"Stake Pro — Verrouille, Gagne, Reçois un NFT ✨",stake_lead:"Verrouille ton ZUZU, gagne <b>APY + BOOST NFT</b>. Badge & airdrop prioritaires pour les premiers.",
      calc_title:"Calculateur de gains",amount2:"Montant (ZUZU)",lock:"Période de verrouillage",nft_have:"Tu as un NFT ?",early:"Badge précoce",calc_btn:"Calculer",
      ret:"Gain total",avg:"Moyenne mensuelle",boost:"Boost total",token_title:"Tokenomics (Visualisé)",road_title:"Feuille de route",
      road_lead:"Plan axé sur communauté, staking, drops NFT et listings."},
  es:{nav_presale:"Pre-venta",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Hoja de ruta",nav_token:"Tokenomics",connect:"Conectar Billetera",
      hero_badge:"Pre-venta • Stake para ganar NFT",hero_title:"ZUZU — Erizo Robótico 🦔⚡",
      hero_lead:"Haz stake y gana <b>NFT Mascota ZUZU</b>. Suministro limitado, gran <b>utilidad</b>.",
      cta_stake:"Empezar Stake",cta_nft:"Recompensas NFT",collection_page:"Página de Colección",contract:"Contrato:",
      days:"DÍAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",
      presale_title:"Pre-venta — Cuenta regresiva",presale_lead:"¡Prepárate para la pre-venta ZUZU! <b>Asignación limitada</b>, precio para la comunidad.",amount:"Cantidad (ZUZU)",
      w1:"Semana 1 (Más barata)",w2:"Semana 2",w3:"Semana 3",w4:"Semana 4 (Última oportunidad)",cost:"Costo:",buy:"Comprar",exchanges:"Exchanges compatibles",
      stake_title:"Stake Pro — Bloquea, Gana, Obtén NFT ✨",stake_lead:"Bloquea tu ZUZU, gana <b>APY + BOOST NFT</b>. Primeros obtienen insignia y prioridad de airdrop.",
      calc_title:"Calculadora de ganancias",amount2:"Cantidad (ZUZU)",lock:"Periodo de bloqueo",nft_have:"¿Tienes NFT?",early:"Insignia temprana",calc_btn:"Calcular",
      ret:"Retorno total",avg:"Promedio mensual",boost:"Impulso total",token_title:"Tokenomics (Visualizado)",road_title:"Hoja de ruta",
      road_lead:"Plan centrado en comunidad, staking, drops NFT y listados."},
  ru:{nav_presale:"Предпродажа",nav_stake:"Стейкинг",nav_nft:"NFT Награды",nav_roadmap:"Дорожная карта",nav_token:"Токеномика",connect:"Подключить кошелек",
      hero_badge:"Предпродажа • Стейкинг и выигрыш NFT",hero_title:"ZUZU — Роботизированный ёж 🦔⚡",
      hero_lead:"Делай стейкинг и получай <b>ZUZU Маскот NFT</b>. Ограниченная эмиссия, высокая <b>польза</b>.",
      cta_stake:"Начать стейкинг",cta_nft:"NFT Награды",collection_page:"Страница коллекции",contract:"Контракт:",
      days:"ДНИ",hours:"ЧАСЫ",mins:"МИНУТЫ",secs:"СЕКУНДЫ",
      presale_title:"Предпродажа — Обратный отсчет",presale_lead:"Готовься к предпродаже ZUZU! <b>Ограниченный лимит</b>, цена для сообщества.",amount:"Количество (ZUZU)",
      w1:"Неделя 1 (Дешевле всего)",w2:"Неделя 2",w3:"Неделя 3",w4:"Неделя 4 (Последний шанс)",cost:"Стоимость:",buy:"Купить",exchanges:"Поддерживаемые биржи",
      stake_title:"Stake Pro — Замок, Доход, NFT ✨",stake_lead:"Заморозь ZUZU и получай <b>APY + NFT BOOST</b>. Ранние — значок и приоритет airdrop.",
      calc_title:"Калькулятор дохода",amount2:"Количество (ZUZU)",lock:"Период блокировки",nft_have:"Есть NFT?",early:"Ранний значок",calc_btn:"Рассчитать",
      ret:"Итоговый доход",avg:"В среднем в месяц",boost:"Общий буст",token_title:"Токеномика (Визуально)",road_title:"Дорожная карта",
      road_lead:"Фокус на сообществе, стейкинге, NFT-дропах и листингах."}
};

const pad2=n=>n.toString().padStart(2,"0");
const num = v => {const n=parseFloat((v??"0").toString().replace(/[^\d.]/g,""));return Number.isFinite(n)?n:0;};
const activeWeek=()=>{const d=Math.floor((Date.now()-CONFIG.saleStart)/86400000);if(d<7)return 0;if(d<14)return 1;if(d<21)return 2;return 3;};

function applyLang(lang="en"){
  document.querySelectorAll("[data-i]").forEach(el=>{
    const k=el.getAttribute("data-i");
    if(I[lang] && I[lang][k]) el.innerHTML = I[lang][k];
  });
  const btn=document.getElementById("connectBtn");
  if(btn && (!window.__walletLabelSet || btn.dataset.reset==="1")){
    btn.textContent = I[lang].connect;
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
  /* Dil Dropdown */
  const wrap = document.getElementById("langWrap");
  const btn  = document.getElementById("langBtn");
  const flag = document.getElementById("langFlag");
  const menu = document.getElementById("langMenu");

  function setLang(lc){
    localStorage.setItem("zuzu_lang", lc);
    flag.src = `./flags/${lc}.png`;
    applyLang(lc);
  }
  setLang(localStorage.getItem("zuzu_lang") || "en");

  btn?.addEventListener("click", ()=>{
    const open = menu.classList.toggle("open");
    btn.setAttribute("aria-expanded", open?"true":"false");
  });
  menu?.querySelectorAll("[data-lang]").forEach(x=>{
    x.addEventListener("click", ()=>{
      setLang(x.dataset.lang);
      menu.classList.remove("open");
    });
  });
  document.addEventListener("click",(e)=>{ if(!wrap.contains(e.target)) menu.classList.remove("open"); });

  /* Sayaç */
  function tick(){
    const left = Math.max(0, CONFIG.launchAt - Date.now());
    const d = Math.floor(left/86400000),
          h = Math.floor((left%86400000)/3600000),
          m = Math.floor((left%3600000)/60000),
          s = Math.floor((left%60000)/1000);
    ["cdDays","cdHours","cdMins","cdSecs"].forEach((id,i)=>{
      const el=document.getElementById(id); if(el) el.textContent=pad2([d,h,m,s][i]);
    });
  } tick(); setInterval(tick,1000);

  /* Aktif hafta */
  (function paint(){
    const w=activeWeek();
    for(let i=0;i<4;i++){
      const b=document.getElementById("buyW"+i); if(!b) continue;
      if(i===w){ b.disabled=false; b.classList.add("active-week"); }
      else { b.disabled=true; b.classList.remove("active-week"); }
    }
  })();

  /* Maliyet */
  function recalc(){
    const qty = num(document.getElementById("buyAmount")?.value);
    CONFIG.weekPrices.forEach((p,i)=>{
      const cost=qty*p;
      const pe=document.getElementById("p"+i);
      const ce=document.getElementById("c"+i);
      if(pe) pe.textContent=p.toFixed(4);
      if(ce) ce.textContent=(isFinite(cost)?cost:0).toLocaleString();
    });
  }
  document.getElementById("buyAmount")?.addEventListener("input", recalc);
  recalc();

  /* NFT grid */
  (()=>{
    const g=document.getElementById("nftGrid"); if(!g) return;
    g.innerHTML = CONFIG.nfts.map(n=>`
      <div class="nft">
        <img src="assets/images/mask/${n.id}.png" alt="${n.name}" loading="lazy"
             style="aspect-ratio:1/1;object-fit:contain;background:#0f1a30;padding:8px;border-bottom:1px solid #1d2d50"
             onerror="this.style.display='none'">
        <div class="meta">
          <div>
            <b>${n.name}</b>
            <div style="color:#9fb6e6;font-size:.9rem">Supply: ${n.supply.toLocaleString()}</div>
          </div>
          <span class="tag">${n.rarity}</span>
        </div>
        <a class="z-btn z-btn-ghost" style="margin:0 10px 10px" href="${CONFIG.collectionUrl}?tokenId=${n.id}" target="_blank" rel="noopener">View ↗</a>
      </div>`).join("");
  })();

  /* Linkler */
  (()=>{
    const c=CONFIG.contractAddress, short=`${c.slice(0,6)}...${c.slice(-4)}`;
    const cd=document.getElementById("contractDisplay");
    const cd2=document.getElementById("contractDisplay2");
    if(cd) cd.textContent=short; if(cd2) cd2.textContent=c;
    const t1=document.getElementById("thirdwebNFTRoute");
    const t2=document.getElementById("thirdwebNFTRoute2");
    if(t1) t1.href=CONFIG.collectionUrl; if(t2) t2.href=CONFIG.collectionUrl;
  })();

  /* Wallet Aç */
  document.getElementById("connectBtn")?.addEventListener("click", ()=>{
    window.openWalletModal && window.openWalletModal();
  });

  /* Buy buttons → solana.v1.js içindeki fonksiyona gider */
  ["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
    const b=document.getElementById(id); if(!b) return;
    b.addEventListener("click", async ()=>{
      if(i!==activeWeek()){ alert("This week is not active."); return; }
      const qty = num(document.getElementById("buyAmount")?.value);
      const pay = document.getElementById("paySel")?.value || "SOL";
      if(qty<=0){ alert("Enter a valid amount."); return; }
      try{
        await window.solanaPresaleBuy({ quantity: qty, payment: pay, price: CONFIG.weekPrices[i] });
      }catch(e){ console.error(e); }
    });
  });

  /* ticker mobil fix */
  const tr=document.getElementById("exTrack");
  if(tr){ tr.style.willChange="transform"; tr.style.transform="translateX(0)"; setTimeout(()=>tr.style.transform="",50); }
});
