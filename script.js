/* ================================
   ZUZU CONFIG
================================== */
const CONFIG = {
  contractAddress: "0xF2bbbEcB417725813BF5E940d678793fACDa9729",
  collectionUrl:
    "https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a/contract/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts",
  // Geri sayım (örn. 15 gün sonrasına)
  launchAt: Date.now() + 1000 * 60 * 60 * 24 * 17 + 1000 * 60 * 90, // 17 gün 1.5 saat

  // Ön satış hafta fiyatları (USDT)
  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100],

  // NFT vitrin (görseller assets/images/mask/N.png’dan alınır)
  nfts: [
    { id: 0,  name: "ZUZU Hero",      supply: 200,  rarity: "Epic" },
    { id: 1,  name: "ZUZU Rogue",     supply: 2500, rarity: "Rare" },
    { id: 2,  name: "ZUZU Berserker", supply: 800,  rarity: "Epic" },
    { id: 3,  name: "ZUZU Hacker",    supply: 600,  rarity: "Rare" },
    { id: 4,  name: "ZUZU Sorceress", supply: 750,  rarity: "Epic" },
    { id: 5,  name: "ZUZU Warrior",   supply: 900,  rarity: "Rare" },
    { id: 6,  name: "ZUZU Maiden",    supply: 1100, rarity: "Rare" },
    { id: 7,  name: "ZUZU Ranger",    supply: 1000, rarity: "Rare" },
    { id: 8,  name: "ZUZU Scientist", supply: 1100, rarity: "Epic" },
    { id: 9,  name: "ZUZU Titan",     supply: 250,  rarity: "Legendary" },
  ],
};

/* ================================
   HELPERS
================================== */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const fmt = (x, d = 2) => Number(x).toLocaleString("en-US", { maximumFractionDigits: d });

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
function setHref(id, href) {
  const el = document.getElementById(id);
  if (el && href) el.href = href;
}
function comma(x) {
  try { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  catch { return x; }
}

/* ================================
   INIT
================================== */
document.addEventListener("DOMContentLoaded", () => {
  // Kontrat görüntü / link
  const short = (addr) => addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "—";
  setText("contractDisplay", short(CONFIG.contractAddress));
  setText("contractDisplay2", short(CONFIG.contractAddress));
  setHref("contractLink", CONFIG.collectionUrl);
  const thr1 = $("#thirdwebNFTRoute");
  const thr2 = $("#thirdwebNFTRoute2");
  if (thr1) thr1.href = CONFIG.collectionUrl;
  if (thr2) thr2.href = CONFIG.collectionUrl;

  setupCountdown();
  setupStakeCalculator();
  setupNftGrid();
  setupTicker();
  setupPresalePricing();
  setupWalletConnect();

  // NFT kartları tıklanınca koleksiyon sayfasına gitme
  document.addEventListener("click", (e) => {
    const view = e.target.closest("[data-view-token]");
    if (view) {
      const id = view.getAttribute("data-view-token");
      const url = CONFIG.collectionUrl + "?tokenId=" + encodeURIComponent(id);
      window.open(url, "_blank");
    }
  });
});

/* ================================
   COUNTDOWN
================================== */
function setupCountdown() {
  const ids = { d: "cdDays", h: "cdHours", m: "cdMins", s: "cdSecs" };
  const els = {
    d: document.getElementById(ids.d),
    h: document.getElementById(ids.h),
    m: document.getElementById(ids.m),
    s: document.getElementById(ids.s),
  };

  if (!els.d || !els.h || !els.m || !els.s) return; // sayfada yoksa atla

  const tick = () => {
    const now = Date.now();
    let left = Math.max(0, CONFIG.launchAt - now);

    const sec = Math.floor(left / 1000);
    const d = Math.floor(sec / 86400);
    const h = Math.floor((sec % 86400) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    els.d.textContent = String(d).padStart(2, "0");
    els.h.textContent = String(h).padStart(2, "0");
    els.m.textContent = String(m).padStart(2, "0");
    els.s.textContent = String(s).padStart(2, "0");
  };

  tick();
  setInterval(tick, 1000);
}

/* ================================
   NFT GRID (vitrin)
================================== */
function setupNftGrid() {
  const wrap = document.getElementById("nftGrid");
  if (!wrap) return;

  wrap.innerHTML = "";
  CONFIG.nfts.forEach((n) => {
    const imgSrc = `assets/images/mask/${n.id}.png`;
    const card = document.createElement("div");
    card.className = "nft-item";
    card.innerHTML = `
      <div class="nft-thumb">
        <img src="${imgSrc}" alt="${n.name}" loading="lazy" />
      </div>
      <div class="nft-body">
        <div class="nft-title">${n.name}</div>
        <div class="nft-meta">
          <span class="badge ${n.rarity.toLowerCase()}">${n.rarity}</span>
          <span class="supply">Arz: ${comma(n.supply)}</span>
        </div>
        <div class="nft-actions">
          <button class="z-btn z-btn-ghost" data-view-token="${n.id}">Görüntüle ↗</button>
        </div>
      </div>
    `;
    // görsel hata yakalama
    const img = card.querySelector("img");
    img.addEventListener("error", () => {
      img.src =
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='280'>
             <rect width='100%' height='100%' fill='#0f172a'/>
             <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
                   fill='#64748b' font-family='Inter' font-size='16'>
                Görsel bulunamadı
             </text>
           </svg>`
        );
    });
    wrap.appendChild(card);
  });
}

/* ================================
   STAKE CALCULATOR
================================== */
function setupStakeCalculator() {
  const amount = $("#stakeAmount");
  if (!amount) return;
  const duration = $("#stakeDuration");
  const nft = $("#nftBoost");
  const early = $("#earlyBoost");
  const total = $("#resultTotal");
  const monthly = $("#resultMonthly");
  const boost = $("#resultBoost");
  const apy = { 30: 12, 90: 24, 180: 40, 365: 65, 540: 85 };

  const calc = () => {
    const a = parseFloat((amount.value || "0").toString().replace(/[^\d.]/g, "")) || 0;
    const d = parseInt(duration.value, 10);
    const base = apy[d] || 0;
    const nb = parseFloat(nft.value || "0");
    const eb = parseFloat(early.value || "0");
    const tb = nb + eb;

    const gross = a * ((base + tb) / 100) * (d / 365);
    const m = gross / (d / 30);

    total.textContent = comma(gross.toFixed(2)) + " ZUZU";
    monthly.textContent = comma(m.toFixed(2)) + " ZUZU";
    boost.textContent = "+" + tb + "%";
  };

  $("#calcBtn")?.addEventListener("click", calc);
  calc();
}

/* ================================
   EXCHANGES TICKER (marquee)
================================== */
function setupTicker() {
  const track = document.getElementById("exTrack");
  if (!track) return;

  // içerik kopyalayıp sonsuz akış veriyoruz
  const clone = track.cloneNode(true);
  track.parentElement.appendChild(clone);

  // animasyonu JS ile: translateX’i sürekli sola kaydır
  let offset = 0;
  const step = () => {
    offset -= 0.6; // hız
    track.style.transform = `translateX(${offset}px)`;
    clone.style.transform = `translateX(${offset + track.scrollWidth}px)`;
    if (Math.abs(offset) > track.scrollWidth) offset = 0;
    requestAnimationFrame(step);
  };
  step();

  // hover’da durdur
  const host = track.parentElement;
  let paused = false;
  const raf = (f) => requestAnimationFrame(f);
  let reqId;
  const play = () => {
    if (paused) return;
    reqId = raf(step);
  };
  host.addEventListener("mouseenter", () => {
    paused = true;
    cancelAnimationFrame(reqId);
  });
  host.addEventListener("mouseleave", () => {
    paused = false;
    play();
  });
}

/* ================================
   PRESALE – Week cards: cost update & fake buy
================================== */
function setupPresalePricing() {
  const amount = document.getElementById("preAmount");
  const priceEls = $$("[data-price-week]");
  const costEls = $$("[data-cost-week]");
  const buyBtns = $$("[data-buy-week]");

  // sayfada ilgili bölüm yoksa atla
  if (!amount && priceEls.length === 0 && costEls.length === 0) return;

  // Fiyat rozetlerini doldur
  priceEls.forEach((el) => {
    const i = Number(el.getAttribute("data-price-week"));
    el.textContent = `1 ZUZU = ${CONFIG.weekPrices[i].toFixed(4)} USDT`;
  });

  const recalc = () => {
    const qty = parseFloat((amount?.value || "0").toString().replace(/[^\d.]/g, "")) || 0;
    costEls.forEach((el) => {
      const i = Number(el.getAttribute("data-cost-week"));
      const cost = qty * CONFIG.weekPrices[i];
      el.textContent = (isFinite(cost) ? fmt(cost, 4) : "0") + " USDT";
    });
  };
  amount?.addEventListener("input", recalc);
  recalc();

  buyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const w = Number(btn.getAttribute("data-buy-week"));
      const qty = parseFloat((amount?.value || "0").toString().replace(/[^\d.]/g, "")) || 0;
      if (!qty || qty <= 0) {
        alert("Lütfen almak istediğiniz ZUZU miktarını yazın.");
        return;
      }
      const cost = qty * CONFIG.weekPrices[w];
      alert(
        `Ön izleme:\nHafta ${w + 1}\nMiktar: ${comma(qty)} ZUZU\nMaliyet: ${fmt(cost, 4)} USDT\n\n(Not: Canlı satış kontratı aktif olunca buton gerçek işlemi gönderecek.)`
      );
    });
  });
}

/* ================================
   WALLET CONNECT (basic)
   - MetaMask (EVM) – window.ethereum
   - TON – tonkeeper deeplink fallback
   - Phantom (Solana) – window.solana || store link
================================== */
function setupWalletConnect() {
  const btn = document.getElementById("connectWallet");
  if (!btn) return;

  let connected = false;
  let address = "";

  const short = (a) => a ? a.slice(0, 6) + "..." + a.slice(-4) : "";

  async function connectMetaMask() {
    try {
      if (!window.ethereum) {
        window.open("https://metamask.io/download/", "_blank");
        return;
      }
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      address = accounts[0];
      connected = true;
      btn.textContent = "MetaMask: " + short(address);
    } catch (e) {
      console.warn(e);
      alert("MetaMask bağlantısı iptal edildi veya başarısız.");
    }
  }

  function connectTON() {
    // Basit tonkeeper deeplink
    const url = "https://tonkeeper.com/";
    window.open(url, "_blank");
  }

  async function connectPhantom() {
    try {
      const provider = window.solana;
      if (!provider || !provider.isPhantom) {
        window.open("https://phantom.app/download", "_blank");
        return;
      }
      const resp = await provider.connect();
      address = resp.publicKey.toString();
      connected = true;
      btn.textContent = "Phantom: " + short(address);
    } catch (e) {
      console.warn(e);
      alert("Phantom bağlantısı iptal edildi veya başarısız.");
    }
  }

  // Basit seçim menüsü
  btn.addEventListener("click", () => {
    const modal = document.createElement("div");
    modal.className = "z-modal";
    modal.innerHTML = `
      <div class="z-modal__backdrop"></div>
      <div class="z-modal__panel">
        <div class="z-modal__head">
          <div class="z-modal__title">Cüzdan Bağla</div>
          <button class="z-modal__close">✕</button>
        </div>
        <div class="z-wallets">
          <button class="z-btn z-btn-primary" id="wMetamask">MetaMask (EVM)</button>
          <button class="z-btn z-btn-primary" id="wPhantom">Phantom (Solana)</button>
          <button class="z-btn z-btn-primary" id="wTon">TON (Tonkeeper)</button>
        </div>
        <small class="muted">Yüklenmediyse, “Download” sayfası açılır.</small>
      </div>
    `;
    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelector(".z-modal__backdrop").addEventListener("click", close);
    modal.querySelector(".z-modal__close").addEventListener("click", close);

    modal.querySelector("#wMetamask").addEventListener("click", async () => {
      await connectMetaMask(); close();
    });
    modal.querySelector("#wPhantom").addEventListener("click", async () => {
      await connectPhantom(); close();
    });
    modal.querySelector("#wTon").addEventListener("click", () => {
      connectTON(); close();
    });
  });
}

/* ================================
   UTILS – Global error guard (optional)
================================== */
window.addEventListener("error", (e) => {
  // Konsolda sessiz hatalar yerine uyarı
  // console.warn("JS error:", e.message);
});
/* ================================
   I18N – Çoklu dil (varsayılan EN)
   HTML'de data-i18n="key" olanları çevirir.
================================== */
function initI18n(){
  const dict = {
    en: {
      heroTitle: "ZUZU — Robotic Hedgehog",
      heroSub: "Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high utility.",
      btnNft: "NFT Rewards",
      btnCollection: "Collection Page",
      contract: "Contract",
      days: "DAYS", hours: "HOURS", minutes: "MINUTES", seconds: "SECONDS",
      supportedEx: "Supported Exchanges",
      willBeListed: "Will be listed soon",
      tokenomics: "Tokenomics (Visualized)",
      tokenomicsDesc: "Fair distribution, sustainable reward economy & reserve plan.",
      legCommunity:"Community", legLiquidity:"Liquidity", legTeam:"Team", legTreasury:"Treasury", legStaking:"Staking Rewards", legPartners:"Advisors/Partners"
    },
    tr: {
      heroTitle: "ZUZU — Geleceğin Robotic Kirpisi",
      heroSub: "Stake et ve <b>ZUZU Maskot NFT</b>'lerini kazan. Sınırlı arz, yüksek utility.",
      btnNft: "NFT Ödülleri",
      btnCollection: "Koleksiyon Sayfası",
      contract: "Kontrat",
      days: "GÜN", hours: "SAAT", minutes:"DAKİKA", seconds:"SANİYE",
      supportedEx: "Desteklenen Borsalar",
      willBeListed: "Yakında listelenecek",
      tokenomics: "Tokonomi (Görselleştirilmiş)",
      tokenomicsDesc: "Adil dağıtım, sürdürülebilir ödül ekonomisi ve rezerv planı.",
      legCommunity:"Topluluk", legLiquidity:"Likidite", legTeam:"Ekip", legTreasury:"Hazine", legStaking:"Staking Ödülleri", legPartners:"Danışman/Partner"
    },
    ru: { heroTitle:"ZUZU — Роботический ёж", heroSub:"Стейк и выигрывай <b>маскот NFT ZUZU</b>. Ограниченная эмиссия, высокая полезность.", btnNft:"NFT Награды", btnCollection:"Страница коллекции", contract:"Контракт", days:"ДНИ", hours:"ЧАСЫ", minutes:"МИНУТЫ", seconds:"СЕКУНДЫ", supportedEx:"Поддерживаемые биржи", willBeListed:"Скоро будет листинг", tokenomics:"Токеномика (визуально)", tokenomicsDesc:"Справедливое распределение, устойчивая экономика вознаграждений и резерв.", legCommunity:"Сообщество", legLiquidity:"Ликвидность", legTeam:"Команда", legTreasury:"Казна", legStaking:"Награды стейкинга", legPartners:"Советники/Партнеры" },
    hi: { heroTitle:"ZUZU — रोबोटिक हेजहॉग", heroSub:"स्टेक करें और <b>ZUZU मास्कॉट NFT</b> जीतें। सीमित सप्लाई, उच्च यूटिलिटी।", btnNft:"NFT रिवार्ड्स", btnCollection:"कलेक्शन पेज", contract:"कॉन्ट्रैक्ट", days:"दिन", hours:"घंटे", minutes:"मिनट", seconds:"सेकंड", supportedEx:"समर्थित एक्सचेंज", willBeListed:"जल्द सूचीबद्ध होगा", tokenomics:"टोकनॉमिक्स (दृश्य)", tokenomicsDesc:"न्यायसंगत वितरण, टिकाऊ रिवार्ड अर्थव्यवस्था और रिज़र्व योजना।", legCommunity:"कम्युनिटी", legLiquidity:"लिक्विडिटी", legTeam:"टीम", legTreasury:"ट्रेज़री", legStaking:"स्टेकिंग रिवार्ड्स", legPartners:"एडवाइज़र्स/पार्टनर्स" },
    zh: { heroTitle:"ZUZU — 机械刺猬", heroSub:"质押并赢取 <b>ZUZU 吉祥物 NFT</b>。供给有限，实用性高。", btnNft:"NFT 奖励", btnCollection:"收藏页面", contract:"合约", days:"天", hours:"小时", minutes:"分钟", seconds:"秒", supportedEx:"支持的交易所", willBeListed:"即将上线", tokenomics:"代币经济（可视化）", tokenomicsDesc:"公平分配、可持续奖励经济与储备计划。", legCommunity:"社区", legLiquidity:"流动性", legTeam:"团队", legTreasury:"金库", legStaking:"质押奖励", legPartners:"顾问/合作伙伴" },
    es: { heroTitle:"ZUZU — Erizo Robótico", heroSub:"Haz stake y gana <b>NFT Mascota ZUZU</b>. Suministro limitado, gran utilidad.", btnNft:"Recompensas NFT", btnCollection:"Página de Colección", contract:"Contrato", days:"DÍAS", hours:"HORAS", minutes:"MINUTOS", seconds:"SEGUNDOS", supportedEx:"Exchanges Soportados", willBeListed:"Se listará pronto", tokenomics:"Tokenomics (Visualizado)", tokenomicsDesc:"Distribución justa, economía de recompensas sostenible y plan de reserva.", legCommunity:"Comunidad", legLiquidity:"Liquidez", legTeam:"Equipo", legTreasury:"Tesorería", legStaking:"Recompensas de Staking", legPartners:"Asesores/Socios" },
    pt: { heroTitle:"ZUZU — Ouriço Robótico", heroSub:"Faça stake e ganhe <b>NFT Mascote ZUZU</b>. Oferta limitada, alta utilidade.", btnNft:"Recompensas NFT", btnCollection:"Página da Coleção", contract:"Contrato", days:"DIAS", hours:"HORAS", minutes:"MINUTOS", seconds:"SEGUNDOS", supportedEx:"Exchanges Suportadas", willBeListed:"Será listado em breve", tokenomics:"Tokenomics (Visualizado)", tokenomicsDesc:"Distribuição justa, economia de recompensas sustentável e plano de reserva.", legCommunity:"Comunidade", legLiquidity:"Liquidez", legTeam:"Equipe", legTreasury:"Tesouraria", legStaking:"Recompensas de Staking", legPartners:"Conselheiros/Parceiros" }
  };

  const select = document.getElementById("langSelect");
  if (!select) return;

  // Varsayılan EN
  const apply = (lng="en")=>{
    const table = dict[lng] || dict.en;
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const key = el.getAttribute("data-i18n");
      if (table[key]) el.innerHTML = table[key];
    });
    // sayac label’ları güncellendiğinde görünüm bozulmasın
  };

  select.addEventListener("change", ()=>apply(select.value));
  apply("en"); // ilk açılış İngilizce
}

/* ================================
   TOKENOMICS – donut çizimi (canvas)
================================== */
function drawTokenomics(){
  const c = document.getElementById("tokenomicsChart");
  if (!c) return;
  const ctx = c.getContext("2d");
  const W = c.width, H = c.height;
  const cx = W/2 - 10, cy = H/2 + 6, r = 110, inner = 70;

  // Dilimler: %’ler ve renkler örnek görselle uyumlu
  const parts = [
    { p:35, color:"#8c76ff" }, // community
    { p:20, color:"#1fd4e7" }, // liquidity
    { p:15, color:"#7bff9b" }, // team
    { p:10, color:"#ffb648" }, // treasury
    { p:15, color:"#d77cff" }, // staking
    { p:5,  color:"#ff6a6a" }, // partners
  ];
  ctx.clearRect(0,0,W,H);

  // dış gölge
  ctx.beginPath();
  ctx.arc(cx,cy,r+16,0,Math.PI*2);
  ctx.fillStyle="rgba(0,0,0,.18)";
  ctx.fill();

  // donut
  let start = -Math.PI/2;
  parts.forEach(seg=>{
    const ang = (seg.p/100)*Math.PI*2;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,r,start,start+ang);
    ctx.closePath();
    ctx.fillStyle=seg.color;
    ctx.fill();
    start+=ang;
  });

  // iç delik
  ctx.beginPath();
  ctx.arc(cx,cy,inner,0,Math.PI*2);
  ctx.fillStyle="#0e1522";
  ctx.fill();

  // orta metin
  ctx.fillStyle="#cfe0ff";
  ctx.font="700 18px Inter, system-ui";
  ctx.textAlign="center";
  ctx.fillText("Total Supply", cx, cy-6);
  ctx.font="800 22px Inter, system-ui";
  ctx.fillText("1,000,000,000", cx, cy+22);
}
