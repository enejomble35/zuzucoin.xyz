/* =============================
   ZUZU CONFIG
============================= */
const CONFIG = {
  contractAddress:
    "0xF2bbbEcB417725813BF5E940d678793fACDa9729",
  collectionUrl:
    "https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a/contract/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts",
  // Şu andan itibaren ~17 gün 5 saat 10 dk sonrası:
  launchAt: Date.now() + 1000 * (60 * 60 * 24 * 17 + 60 * 60 * 5 + 60 * 10),

  // Ön satış hafta fiyatları (USDT)
  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100],

  // NFT vitrin (görseli assets/images/mask/{id}.png)
  nfts: [
    { id: 0, name: "ZUZU Hero",       supply: 200,  rarity: "Epic" },
    { id: 1, name: "ZUZU Rogue",      supply: 2500, rarity: "Rare" },
    { id: 2, name: "ZUZU Berserker",  supply: 800,  rarity: "Epic" },
    { id: 3, name: "ZUZU Hacker",     supply: 600,  rarity: "Rare" },
    { id: 4, name: "ZUZU Sorceress",  supply: 750,  rarity: "Epic" },
    { id: 5, name: "ZUZU Warrior",    supply: 900,  rarity: "Rare" },
    { id: 6, name: "ZUZU Maiden",     supply: 1100, rarity: "Rare" },
    { id: 7, name: "ZUZU Ranger",     supply: 1000, rarity: "Rare" },
    { id: 8, name: "ZUZU Scientist",  supply: 1100, rarity: "Epic" },
    { id: 9, name: "ZUZU Titan",      supply: 250,  rarity: "Legendary" },
  ],
};

/* =============================
   Helpers
============================= */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const safe = (fn) => { try { fn && fn(); } catch (_) {} }; // eleman yoksa sessiz geç

/* =============================
   Header / Linkler / Kontrat
============================= */
function setupContractLinks() {
  safe(() => ($("#contractDisplay").textContent = shortAddr(CONFIG.contractAddress)));
  safe(() => ($("#contractDisplay2").textContent = CONFIG.contractAddress));
  safe(() => ($("#contractLink").href = CONFIG.collectionUrl));
  safe(() => ($("#thirdwebNFTRoute").href = CONFIG.collectionUrl));
  safe(() => ($("#thirdwebNFTRoute2").href = CONFIG.collectionUrl));
}
function shortAddr(a) {
  if (!a) return "—";
  return a.slice(0, 6) + "..." + a.slice(-4);
}

/* =============================
   NFT Vitrini
============================= */
function renderNfts() {
  const grid = $("#nftGrid");
  if (!grid) return;

  grid.innerHTML = "";
  CONFIG.nfts.forEach((n) => {
    const card = document.createElement("div");
    card.className = "nft-card";
    card.innerHTML = `
      <div class="nft-media">
        <img src="assets/images/mask/${n.id}.png" alt="${n.name}"
             onerror="this.src='assets/images/mask/placeholder.png'">
      </div>
      <div class="nft-body">
        <div class="nft-title">${n.name}</div>
        <div class="nft-sub">
          <span>Arz: ${n.supply}</span>
          <span class="rarity ${n.rarity.toLowerCase()}">${n.rarity}</span>
        </div>
        <a class="nft-link" target="_blank" rel="noopener"
           href="${CONFIG.collectionUrl}?tokenId=${n.id}">
           Görüntüle ↗
        </a>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* =============================
   Geri Sayım
============================= */
function startCountdown() {
  const d = $("#cdDays"), h = $("#cdHours"), m = $("#cdMins"), s = $("#cdSecs");
  if (!d || !h || !m || !s) return;

  const tick = () => {
    const now = Date.now();
    let diff = CONFIG.launchAt - now;
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    d.textContent = String(days).padStart(2, "0");
    h.textContent = String(hours).padStart(2, "0");
    m.textContent = String(mins).padStart(2, "0");
    s.textContent = String(secs).padStart(2, "0");
  };

  tick();
  setInterval(tick, 1000);
}

/* =============================
   Ön Satış – Maliyet Hesabı
============================= */
function setupPresaleCalc() {
  const amount = $("#buyAmount");
  const costWeekEls = [$("#costW1"), $("#costW2"), $("#costW3"), $("#costW4")];
  const buyBtns = [$("#buyW1"), $("#buyW2"), $("#buyW3"), $("#buyW4")];

  if (!amount) return;

  const recalc = () => {
    const qty = parseFloat((amount.value || "0").toString().replace(/[^\d.]/g, "")) || 0;
    CONFIG.weekPrices.forEach((p, i) => {
      const c = (qty * p).toFixed(2);
      if (costWeekEls[i]) costWeekEls[i].textContent = `${c} USDT`;
    });
  };
  amount.addEventListener("input", recalc);
  recalc();

  // Butonlar şimdilik mock – kontrat canlıya geçince gerçek tx'e bağlanır
  buyBtns.forEach((btn, i) => {
    if (!btn) return;
    btn.addEventListener("click", () => {
      const qty = parseFloat((amount.value || "0").toString().replace(/[^\d.]/g, "")) || 0;
      if (!qty) return alert("Lütfen almak istediğin ZUZU miktarını yaz.");
      alert(
        `Hafta ${i + 1} ön satış: ${qty} ZUZU x ${CONFIG.weekPrices[i]} USDT\n` +
        `Toplam: ${(qty * CONFIG.weekPrices[i]).toFixed(2)} USDT\n\n` +
        "Kontrat canlı olduğunda buton gerçek alıma dönecek."
      );
    });
  });
}

/* =============================
   Staking Kazanç Hesaplayıcı
============================= */
function setupStakeCalculator() {
  const amountEl = $("#stakeAmount");
  if (!amountEl) return;

  const durationEl = $("#stakeDuration");
  const nftBoostEl = $("#nftBoost");
  const earlyBoostEl = $("#earlyBoost");
  const totalEl = $("#resultTotal");
  const monthEl = $("#resultMonthly");
  const boostEl = $("#resultBoost");
  const btn = $("#calcBtn");

  const apyMap = { 30: 12, 90: 24, 180: 40, 365: 65, 540: 85 };

  const calc = () => {
    const amount = parseFloat((amountEl.value || "0").toString().replace(/[^\d.]/g, "")) || 0;
    const days = parseInt(durationEl.value, 10);
    const baseApy = apyMap[days] || 0;
    const nftBoost = parseFloat(nftBoostEl.value || "0");
    const earlyBoost = parseFloat(earlyBoostEl.value || "0");
    const totalBoost = nftBoost + earlyBoost;

    // Basit yıllık yüzde -> gün sayısına göre oransal getiri
    const gross = amount * ((baseApy + totalBoost) / 100) * (days / 365);
    const monthly = gross / (days / 30);

    totalEl.textContent = `${comma(gross.toFixed(2))} ZUZU`;
    monthEl.textContent = `${comma(monthly.toFixed(2))} ZUZU`;
    boostEl.textContent = `+${totalBoost}%`;
  };

  btn.addEventListener("click", calc);
  calc();
}

function comma(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* =============================
   Borsa Logoları – Ticker
============================= */
function setupTicker() {
  const track = $("#exTrack");
  if (!track) return;

  // Sürekli akış için elemanları klonla
  const items = Array.from(track.children);
  items.forEach((li) => track.appendChild(li.cloneNode(true)));
}

/* =============================
   Cüzdan Bağlama
   (EVM/MetaMask, Phantom/Solana, TonConnect/TON)
============================= */
function setupWallets() {
  // MetaMask / EVM
  safe(() => {
    const evmBtn = $("#btnMetamask");
    if (!evmBtn) return;
    evmBtn.addEventListener("click", async () => {
      if (!window.ethereum) return alert("MetaMask bulunamadı.");
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        // Polygon 137 değilse teklif et
        if (chainId !== "0x89") {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x89" }],
            });
          } catch (e) {
            // Ağa ekleme
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [{
                chainId: "0x89",
                rpcUrls: ["https://polygon-rpc.com/"],
                chainName: "Polygon Mainnet",
                nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
                blockExplorerUrls: ["https://polygonscan.com/"],
              }],
            });
          }
        }
        notify("MetaMask bağlı!");
      } catch (e) {
        alert("Bağlanılamadı: " + (e?.message || e));
      }
    });
  });

  // Phantom / Solana
  safe(() => {
    const phBtn = $("#btnPhantom");
    if (!phBtn) return;
    phBtn.addEventListener("click", async () => {
      const provider = window?.phantom?.solana;
      if (!provider?.isPhantom) return window.open("https://phantom.app/", "_blank");
      try {
        await provider.connect();
        notify("Phantom cüzdan bağlandı!");
      } catch (e) {
        alert("Phantom bağlantısı başarısız: " + (e?.message || e));
      }
    });
  });

  // TonConnect / TON
  safe(() => {
    const tonBtn = $("#btnTon");
    if (!tonBtn) return;

    // CDN ile TonConnect UI yükleyebiliyorsan:
    // const connector = new TON_CONNECT_UI.TonConnectUI({ manifestUrl: '/tonconnect-manifest.json' });

    tonBtn.addEventListener("click", () => {
      // Basit fallback (manifest ve UI eklediğinde gerçek bağlama çalışır)
      window.open("https://tonkeeper.com/connect", "_blank");
      notify("TON bağlantısı için uygulama açıldı.");
    });
  });
}
function notify(msg) {
  console.log(msg);
  const n = document.createElement("div");
  n.className = "toast";
  n.textContent = msg;
  document.body.appendChild(n);
  setTimeout(() => n.classList.add("show"), 10);
  setTimeout(() => n.classList.remove("show"), 2500);
  setTimeout(() => n.remove(), 3000);
}

/* =============================
   DOM Ready
============================= */
document.addEventListener("DOMContentLoaded", () => {
  setupContractLinks();
  renderNfts();
  startCountdown();
  setupPresaleCalc();
  setupStakeCalculator();
  setupTicker();
  setupWallets();
});
