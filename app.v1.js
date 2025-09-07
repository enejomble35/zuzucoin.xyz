/* ------------------------------------------------------
   ZUZU — App bootstrap (lang, countdown, buy)
------------------------------------------------------ */

// ---- Dil yükleyici (lang.js/<code>.json)
const SUPPORTED_LANGS = ["en", "tr", "fr", "es", "ru", "pl"];
async function loadLang(code) {
  let lang = SUPPORTED_LANGS.includes(code) ? code : "en";
  try {
    const res = await fetch(`lang.js/${lang}.json?ts=${Date.now()}`);
    const dict = await res.json();
    document.querySelectorAll("[data-i]").forEach((el) => {
      const k = el.getAttribute("data-i");
      if (dict[k]) el.innerHTML = dict[k];
    });
    localStorage.setItem("zuzu_lang", lang);
  } catch (e) {
    console.warn("lang load fail", e);
  }
}
function setupLangMenu() {
  const btn = document.getElementById("langBtn");
  const menu = document.getElementById("langMenu");
  if (!btn || !menu) return;
  btn.addEventListener("click", () => menu.classList.toggle("open"));
  menu.querySelectorAll("[data-lang]").forEach((it) =>
    it.addEventListener("click", () => {
      loadLang(it.dataset.lang);
      menu.classList.remove("open");
    })
  );
  const saved = localStorage.getItem("zuzu_lang") || "en";
  loadLang(saved);
}

// ---- Sayaç
function startCountdown(untilMs) {
  const ids = ["cdDays", "cdHours", "cdMins", "cdSecs"];
  function pad(n) { return n.toString().padStart(2, "0"); }
  function tick() {
    const left = Math.max(0, untilMs - Date.now());
    const d = Math.floor(left / 86400000);
    const h = Math.floor((left % 86400000) / 3600000);
    const m = Math.floor((left % 3600000) / 60000);
    const s = Math.floor((left % 60000) / 1000);
    [d, h, m, s].forEach((v, i) => {
      const el = document.getElementById(ids[i]);
      if (el) el.textContent = pad(v);
    });
  }
  tick();
  setInterval(tick, 1000);
}

// ---- Satın alma (SOL veya USDT)
function setupBuy() {
  const amountEl = document.getElementById("buyAmount");
  const methodEl = document.getElementById("payMethod"); // "SOL" | "USDT"
  const weekBtns = ["buyW0", "buyW1", "buyW2", "buyW3"].map((id, i) => ({
    el: document.getElementById(id),
    idx: i,
  }));

  async function handleBuy(idx) {
    const qty = parseFloat((amountEl?.value || "0").toString().replace(/[^\d.]/g, "")) || 0;
    if (qty <= 0) return alert("Enter a valid amount.");
    const prices = [0.0050, 0.0065, 0.0080, 0.0100]; // USDT per ZUZU
    const costUSDT = qty * prices[idx];

    try {
      let sig = "";
      if (methodEl?.value === "USDT") {
        sig = await window.ZUZU_SOL.payUSDT(costUSDT);
      } else {
        // SOL ile öderken: basit örnek 1 SOL ~ 100 USDT varsayımı ile çeviri oranını kendin düzenle
        const roughRate = 100; // !!! gerçek kur yerine backend/price feed bağla
        const solAmt = costUSDT / roughRate;
        sig = await window.ZUZU_SOL.paySOL(solAmt);
      }
      alert("Payment sent!\nTx Signature:\n" + sig + "\nYou can add receipt in Claim Portal.");
    } catch (e) {
      console.error(e);
      alert("Payment rejected or failed.");
    }
  }

  weekBtns.forEach(({ el, idx }) => el?.addEventListener("click", () => handleBuy(idx)));
}

// ---- Referral (basit link üretimi)
function setupReferral() {
  const refOut = document.getElementById("refLink");
  if (!refOut) return;
  // cüzdan bağlıysa adresi linke koy; yoksa random id
  const pk = (window.__zuzu_pk && window.__zuzu_pk()) || "";
  const id = pk ? pk : "guest-" + Math.random().toString(36).slice(2, 8);
  const url = new URL(location.href);
  url.searchParams.set("ref", id);
  refOut.value = url.toString();
}

window.addEventListener("DOMContentLoaded", () => {
  setupLangMenu();
  // 50 gün sayaç (index.html’deki CONFIG.launchAt aynı olmalı)
  const target = window.ZUZU_CONFIG?.launchAt || Date.now() + 50 * 86400000;
  startCountdown(target);
  setupBuy();
  setupReferral();
});
