/* ================================================
   Countdown Timer (50 gün sonrası)
================================================ */
(function () {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 50);

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance < 0) return;

    document.getElementById("cdDays").textContent = Math.floor(distance / (1000 * 60 * 60 * 24));
    document.getElementById("cdHours").textContent = Math.floor((distance / (1000 * 60 * 60)) % 24);
    document.getElementById("cdMins").textContent = Math.floor((distance / (1000 * 60)) % 60);
    document.getElementById("cdSecs").textContent = Math.floor((distance / 1000) % 60);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

/* ================================================
   MetaMask - Connect & Buy
================================================ */
let provider, signer, currentAccount = null;

async function ensureProvider() {
  if (!window.ethereum) {
    alert("MetaMask not detected. Please install MetaMask.");
    throw new Error("No MetaMask");
  }
  provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider;
}

async function connectWallet() {
  await ensureProvider();
  const accounts = await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  currentAccount = accounts[0];

  const btn = document.getElementById("connectBtn");
  if (btn && currentAccount) {
    btn.textContent = `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}`;
  }
}

// Dinleyiciler
if (window.ethereum) {
  window.ethereum.on("accountsChanged", (accs) => {
    if (accs && accs.length > 0) {
      currentAccount = accs[0];
      const b = document.getElementById("connectBtn");
      if (b) b.textContent = `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}`;
    }
  });

  window.ethereum.on("chainChanged", () => window.location.reload());
}

/* ================================================
   Ağ ID ve Parametreler
================================================ */
const CHAINS = {
  1: { hex: "0x1", symbol: "ETH" },
  56: { hex: "0x38", symbol: "BNB" },
  137: { hex: "0x89", symbol: "MATIC" },
};

async function switchNetwork(targetId) {
  await ensureProvider();
  const meta = CHAINS[targetId];
  if (!meta) throw new Error("Unsupported chain");

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: meta.hex }],
    });
  } catch (err) {
    if (err.code === 4902) {
      alert("Add this network manually in MetaMask.");
    } else {
      console.error(err);
    }
  }
}

/* ================================================
   Satın Alma Fonksiyonu
================================================ */
const prices = [0.0050, 0.0065, 0.0080, 0.0100]; // USDT fiyatları

async function buyTokens(weekIndex) {
  await ensureProvider();
  if (!currentAccount) await connectWallet();

  const amount = parseFloat(document.getElementById("buyAmount").value);
  if (!amount || amount <= 0) return alert("Enter a valid amount");

  const price = prices[weekIndex];
  const costUSDT = amount * price;

  // Seçilen ağ
  const netSel = document.getElementById("networkSel").value;
  await switchNetwork(parseInt(netSel));

  // Burada backend / smart contract integration gerekir
  alert(`Buy request: ${amount} ZUZU for ${costUSDT} USDT on network ${netSel}`);
}

/* ================================================
   Buton Eventleri
================================================ */
document.getElementById("connectBtn").addEventListener("click", connectWallet);
document.getElementById("buyW0").addEventListener("click", () => buyTokens(0));
document.getElementById("buyW1").addEventListener("click", () => buyTokens(1));
document.getElementById("buyW2").addEventListener("click", () => buyTokens(2));
document.getElementById("buyW3").addEventListener("click", () => buyTokens(3));

/* ================================================
   Dil Seçici
================================================ */
const langSel = document.getElementById("langSel");
if (langSel) {
  langSel.addEventListener("change", (e) => {
    alert("Language changed to: " + e.target.value);
  });
}
