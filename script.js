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
