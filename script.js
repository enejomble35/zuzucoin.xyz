/* ===========================
   ZUZU – Main Script (FULL)
   =========================== */

/* ---- CONFIG ---- */
const CONFIG = {
  // Thirdweb koleksiyonun:
  contractAddress: "0xF2bbbEcB417725813BF5E940d678793fACDa9729",
  collectionUrl:
    "https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a/contract/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts",

  // Ön satış başlangıcı (geri sayım için):
  launchAt: Date.now() + 1000 * 60 * 60 * 24 * 17 + 1000 * 60 * 90,

  // Haftalara göre fiyatlar (USDT)
  weekPrices: [0.005, 0.0065, 0.008, 0.01],

  // NFT maskotları (grid için)
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
    { id: 9, name: "ZUZU Titan", rarity: "Legendary", supply: 250 },
  ],

  // Hesap adreslerin (görüntülemek için)
  wallets: {
    evm: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3", // BNB/ETH/ARB
    ton: "UQD5Pkyp_l_O3907ri0WeLAY7fBVa-twb9nUnQ38Q1MinTND",
    sol: "31Cjkx2PA5oMapNxxGAiZhuHDcvAyQ7hogqB8Hx6f1pW",
  },

  // USDT sözleşme adresleri (bilgi amaçlı / ileri entegrasyon için)
  usdt: {
    ethereum: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // 6 decimals
    bsc: "0x55d398326f99059fF775485246999027B3197955", // 18 decimals
    arbitrum: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9", // 6 decimals
  },

  // TON manifest dosyan (kendi domaininden)
  tonManifestUrl: "/tonconnect-manifest.json",
};

/* ---- UTILITIES ---- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const pad2 = (n) => n.toString().padStart(2, "0");

/* ---- I18N (index.html’de zaten var ise dokunma) ----
   Burada sadece data-i olanları güncellemek için fonksiyon var.
*/
function applyLang(lang) {
  try {
    const I = window.I18N_TABLE || null; // index.html içinde varsa
    if (!I || !I[lang]) return;
    document.querySelectorAll("[data-i]").forEach((el) => {
      const k = el.getAttribute("data-i");
      if (I[lang][k]) el.innerHTML = I[lang][k];
    });
  } catch (e) {}
}
(function initLang() {
  const sel = $("#langSel");
  if (!sel) return;
  sel.addEventListener("change", () => applyLang(sel.value));
  applyLang("en");
})();

/* ---- Contract & Links ---- */
(function initLinks() {
  const c1 = $("#contractDisplay");
  const c2 = $("#contractDisplay2");
  const l1 = $("#thirdwebNFTRoute");
  const l2 = $("#thirdwebNFTRoute2");
  if (c1) c1.textContent = CONFIG.contractAddress.slice(0, 6) + "..." + CONFIG.contractAddress.slice(-4);
  if (c2) c2.textContent = CONFIG.contractAddress;
  if (l1) l1.href = CONFIG.collectionUrl;
  if (l2) l2.href = CONFIG.collectionUrl;
})();

/* ---- Countdown ---- */
(function initCountdown() {
  const ids = ["cdDays", "cdHours", "cdMins", "cdSecs"];
  function tick() {
    const left = Math.max(0, CONFIG.launchAt - Date.now());
    const d = Math.floor(left / 864e5);
    const h = Math.floor((left % 864e5) / 36e5);
    const m = Math.floor((left % 36e5) / 6e4);
    const s = Math.floor((left % 6e4) / 1e3);
    const arr = [d, h, m, s];
    arr.forEach((v, i) => {
      const el = $("#" + ids[i]);
      if (el) el.textContent = pad2(v);
    });
  }
  tick();
  setInterval(tick, 1000);
})();

/* ---- Pre-Sale Price & Costs ---- */
(function initCosts() {
  const input = $("#buyAmount");
  if (!input) return;
  function update() {
    const qty = parseFloat(input.value || "0") || 0;
    CONFIG.weekPrices.forEach((p, i) => {
      const cost = qty * p;
      const pe = $("#p" + i);
      const ce = $("#c" + i);
      if (pe) pe.textContent = p.toFixed(4);
      if (ce) ce.textContent = cost.toLocaleString();
    });
  }
  input.addEventListener("input", update);
  update();
})();

/* ---- Active Week (Buy) ---- */
(function initActiveWeek() {
  // launchAt -> Week0 bitimine kadar 1. hafta; sonraki 7 gün 2. hafta, vs.
  const now = Date.now();
  const msWeek = 7 * 24 * 60 * 60 * 1000;

  function currentWeekIndex() {
    if (now < CONFIG.launchAt) return 0; // Öncesi: 1. hafta göster
    const delta = now - CONFIG.launchAt;
    const w = Math.floor(delta / msWeek);
    return Math.min(Math.max(w, 0), 3);
  }

  const w = currentWeekIndex();
  const buyBoxes = $$(".presale-grid .buybox");
  buyBoxes.forEach((box, idx) => {
    const btn = box.querySelector(".z-btn.z-btn-primary");
    if (!btn) return;
    if (idx === w) {
      btn.disabled = false;
      btn.textContent = (btn.getAttribute("data-i") === "buy" ? "Buy" : btn.textContent) + " ✓";
      box.style.outline = "1px solid #3b4fa0";
    } else {
      btn.disabled = true;
      btn.title = "This week is not active";
      box.style.opacity = 0.7;
    }
  });
})();

/* ---- NFT Grid Render + Image fit fix ---- */
(function renderNFTs() {
  const g = $("#nftGrid");
  if (!g) return;
  let html = "";
  CONFIG.nfts.forEach((n) => {
    const img = `assets/images/mask/${n.id}.png`;
    const link = `${CONFIG.collectionUrl}?tokenId=${n.id}`;
    html += `
      <div class="nft">
        <img src="${img}" alt="${n.name}" loading="lazy">
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

  // --- Maskot görsellerini kareye sığdır (baş/ayak kesilmesin)
  g.querySelectorAll("img").forEach((im) => {
    im.style.width = "100%";
    im.style.aspectRatio = "1/1";
    im.style.objectFit = "contain";
    im.style.objectPosition = "center";
    im.style.background = "#0b1327";
    im.style.padding = "8px";
    im.style.display = "block";
  });
})();

/* ---- Calculator ---- */
(function setupCalc() {
  const amount = $("#stakeAmount");
  const duration = $("#stakeDuration");
  const nft = $("#nftBoost");
  const early = $("#earlyBoost");
  const total = $("#resultTotal");
  const monthly = $("#resultMonthly");
  const boost = $("#resultBoost");
  if (!amount || !duration || !nft || !early) return;

  const apy = { 30: 12, 90: 24, 180: 40, 365: 65, 540: 85 };
  function calc() {
    const a = parseFloat((amount.value || "0").toString().replace(/[^\d.]/g, "")) || 0;
    const d = parseInt(duration.value, 10) || 0;
    const base = apy[d] || 0;
    const nb = parseFloat(nft.value || "0");
    const eb = parseFloat(early.value || "0");
    const tb = nb + eb;
    const gross = a * ((base + tb) / 100) * (d / 365);
    const m = gross / (d / 30);
    total.textContent = `${gross.toFixed(2)} ZUZU`;
    monthly.textContent = `${m.toFixed(2)} ZUZU`;
    boost.textContent = `+${tb}%`;
  }
  const btn = $("#calcBtn");
  if (btn) btn.addEventListener("click", calc);
  calc();
})();

/* ---- Exchanges Ticker – mobile görünürlük fix ---- */
(function fixTicker() {
  const track = $("#exTrack");
  if (!track) return;
  // İçeriği iki kez çoğalt ki sürekli akış olsun
  track.innerHTML = track.innerHTML + track.innerHTML;

  // Mobilde yükseklik ve img boyutu biraz büyüt
  const mq = window.matchMedia("(max-width: 640px)");
  function apply() {
    const imgs = track.querySelectorAll("img");
    imgs.forEach((im) => {
      im.style.height = mq.matches ? "58px" : "46px";
      im.style.display = "inline-block";
      im.style.opacity = "0.98";
    });
    const wrapper = track.closest(".ticker");
    if (wrapper) {
      wrapper.style.height = mq.matches ? "82px" : "72px";
      wrapper.style.overflow = "hidden";
      wrapper.style.display = "block";
      wrapper.style.visibility = "visible";
    }
  }
  apply();
  mq.addEventListener("change", apply);
})();

/* ---- Wallet Connects ---- */
let state = {
  wallet: null, // 'metamask' | 'phantom' | 'ton'
  evmAccount: null,
  solAccount: null,
  tonConnected: false,
};

const connectBtn = $("#connectBtn");
let tonUi;
try {
  tonUi = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: CONFIG.tonManifestUrl, // kendi domainin
  });
} catch (e) {
  console.warn("TON UI init failed:", e);
}

async function tryConnectMetaMask() {
  if (!window.ethereum) throw new Error("MetaMask not found");
  const accts = await window.ethereum.request({ method: "eth_requestAccounts" });
  if (!accts || !accts.length) throw new Error("No account");
  state.wallet = "metamask";
  state.evmAccount = accts[0];
  connectBtn.textContent = "MetaMask ✓";
  return accts[0];
}

async function tryConnectPhantom() {
  if (!(window.solana && window.solana.isPhantom)) throw new Error("Phantom not found");
  const resp = await window.solana.connect();
  if (!resp || !resp.publicKey) throw new Error("No solana account");
  state.wallet = "phantom";
  state.solAccount = resp.publicKey.toString();
  connectBtn.textContent = "Phantom ✓";
  return state.solAccount;
}

async function tryConnectTON() {
  if (!tonUi) throw new Error("TON UI not ready");
  await tonUi.openModal(); // mobilde Telegram Wallet açılır
  state.wallet = "ton";
  state.tonConnected = true;
  connectBtn.textContent = "TON ✓";
  return true;
}

if (connectBtn) {
  connectBtn.addEventListener("click", async () => {
    // Önce MetaMask dener, olmazsa Phantom, en son TON
    try {
      await tryConnectMetaMask();
      return;
    } catch (e) {}
    try {
      await tryConnectPhantom();
      return;
    } catch (e) {}
    try {
      await tryConnectTON();
      return;
    } catch (e) {}
    alert("No wallet detected. Please install MetaMask, Phantom or TON Wallet.");
  });
}

/* ---- BUY buttons: bir tepki ver + hangi hafta aktifse o buton enabled ----
   Not: Gerçek akıllı sözleşme entegrasyonu için bu fonksiyonları presale sözleşmene bağlayacağız.
   Şimdilik kullanıcıya net tepki veriyor (modal / alert) ve fiyatı gösteriyor.
*/
(function wireBuyButtons() {
  const boxes = $$(".presale-grid .buybox");
  const amountEl = $("#buyAmount");
  if (!boxes.length || !amountEl) return;

  boxes.forEach((box, idx) => {
    const btn = box.querySelector(".z-btn.z-btn-primary");
    if (!btn) return;

    btn.addEventListener("click", async () => {
      if (btn.disabled) return;

      const qty = parseFloat(amountEl.value || "0") || 0;
      const price = CONFIG.weekPrices[idx];
      const cost = qty * price;

      // Basit akış: Cüzdan bağlı mı?
      if (!state.wallet) {
        try {
          await tryConnectMetaMask();
        } catch (e1) {
          try {
            await tryConnectPhantom();
          } catch (e2) {
            try {
              await tryConnectTON();
            } catch (e3) {
              alert("Connect a wallet first.");
              return;
            }
          }
        }
      }

      // Şimdilik kullanıcıya satın alma özetini gösterelim (kontrat hazır olduğunda burada tx yaparız)
      const msg =
        `Week ${idx + 1} • 1 ZUZU = ${price.toFixed(4)} USDT\n` +
        `Amount: ${qty.toLocaleString()} ZUZU\n` +
        `Cost: ${cost.toLocaleString()} USDT\n\n` +
        `Wallet: ${state.wallet === "metamask" ? state.evmAccount : (state.wallet === "phantom" ? state.solAccount : "TON")}\n\n` +
        `Presale contract will be attached. For whitelist: @memedsener`;

      alert(msg);
    });
  });
})();

/* ---- Tiny: bazı tarayıcı cache’leri için görsel preflight ---- */
(function preflightImages() {
  const imgs = $$("img[loading='lazy']");
  imgs.forEach((im) => {
    im.addEventListener("error", () => {
      im.style.display = "none";
    });
  });
})();
