<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>MetaMask Connect Test</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <!-- Ethers -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.umd.min.js"
          integrity="sha512-57m0O+W20T+woYvD9w0t3NE0g1rY37v9m1m3xA7C6E1Hg7N6xJ9cptZ6NGe7R3IYyN7t+W3h1JpP+s3jo8d1yg=="
          crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <style>
    body{font-family:system-ui;background:#0b1426;color:#e8f1ff;display:grid;place-items:center;height:100vh;margin:0}
    .card{background:#111c33;border:1px solid #203458;border-radius:14px;padding:18px;min-width:320px}
    button{padding:.7rem 1rem;border-radius:10px;border:0;background:#6a8cff;color:#08101d;font-weight:800;cursor:pointer}
    .row{margin-top:10px}
    code{background:#0a1224;padding:4px 6px;border-radius:6px}
  </style>
</head>
<body>
<div class="card">
  <h3>MetaMask Connect Test</h3>
  <div class="row"><button id="btn">Connect Wallet</button></div>
  <div class="row">Account: <code id="acc">—</code></div>
  <div class="row">Chain: <code id="chain">—</code></div>
  <div class="row"><button id="toBsc">Switch to BSC</button> <button id="toPoly">Polygon</button></div>
</div>

<script>
let provider, signer;

async function ensure(){
  if(!window.ethereum){
    alert("MetaMask not found.\nDesktop: Chrome + MetaMask ext\nMobile: MetaMask in-app browser ile aç.");
    throw new Error("no metamask");
  }
  provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  signer   = provider.getSigner();
  return provider;
}

async function connect(){
  try{
    await ensure();
    const accounts = await provider.send("eth_requestAccounts", []);
    const net      = await provider.getNetwork();
    document.getElementById("acc").textContent   = accounts[0] ? `${accounts[0].slice(0,6)}...${accounts[0].slice(-4)}` : "—";
    document.getElementById("chain").textContent = net.chainId;
    // dinleyiciler
    if(!window.ethereum._bound){
      window.ethereum.on("accountsChanged",(a)=>{
        document.getElementById("acc").textContent = a[0] ? `${a[0].slice(0,6)}...${a[0].slice(-4)}` : "—";
      });
      window.ethereum.on("chainChanged", async ()=>{
        const n = await provider.getNetwork();
        document.getElementById("chain").textContent = n.chainId;
      });
      window.ethereum._bound = true;
    }
  }catch(e){
    console.error(e);
    alert("Connect rejected veya hata. Tarayıcı/uzantı/https kontrol et.");
  }
}

async function switchTo(hex, params){
  try{
    await ensure();
    await window.ethereum.request({ method:"wallet_switchEthereumChain", params:[{chainId:hex}] });
  }catch(e){
    if(e && e.code===4902 && params){
      await window.ethereum.request({ method:"wallet_addEthereumChain", params:[params] });
    }else{
      console.warn(e); alert("Switch/add chain rejected.");
    }
  }
}

document.getElementById("btn").addEventListener("click", connect);

document.getElementById("toBsc").addEventListener("click", ()=>switchTo("0x38",{
  chainId:"0x38", chainName:"BNB Smart Chain", nativeCurrency:{name:"BNB",symbol:"BNB",decimals:18},
  rpcUrls:["https://bsc-dataseed.binance.org"], blockExplorerUrls:["https://bscscan.com"]
}));
document.getElementById("toPoly").addEventListener("click", ()=>switchTo("0x89",{
  chainId:"0x89", chainName:"Polygon Mainnet", nativeCurrency:{name:"MATIC",symbol:"MATIC",decimals:18},
  rpcUrls:["https://polygon-rpc.com"], blockExplorerUrls:["https://polygonscan.com"]
}));
</script>
</body>
</html>
/* =========================
   LİNKLER + KONTRAT
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

/* =========================
   MetaMask – Connect & Buy
========================= */
let provider, signer, currentAccount = null;

async function ensureProvider(){
  if (!window.ethereum) {
    alert("MetaMask not found. Please install MetaMask.\nDesktop: Chrome + MetaMask extension\nMobile: MetaMask in-app browser ile aç.");
    throw new Error("No MetaMask");
  }
  provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  signer   = provider.getSigner();
  return provider;
}

async function connectWallet(){
  try{
    await ensureProvider();
    const accounts = await provider.send("eth_requestAccounts", []);
    currentAccount = accounts[0] || null;
    const btn = document.getElementById("connectBtn");
    if (btn) btn.textContent = currentAccount ? `${currentAccount.slice(0,6)}...${currentAccount.slice(-4)}` : "Connect Wallet";

    // Dinleyiciler (tek sefer bağla)
    if (window.ethereum && !window.ethereum._zuzuBound) {
      window.ethereum.on("accountsChanged", (accs)=>{
        currentAccount = accs && accs.length ? accs[0] : null;
        const b = document.getElementById("connectBtn");
        if (b) b.textContent = currentAccount ? `${currentAccount.slice(0,6)}...${currentAccount.slice(-4)}` : "Connect Wallet";
      });
      window.ethereum.on("chainChanged", async ()=>{
        // Sayfayı yenilemek yerine sadece yazıyı güncelleyelim
        try{
          const net = await provider.getNetwork();
          console.log("Chain now:", net.chainId);
        }catch(e){ console.warn(e); }
      });
      window.ethereum._zuzuBound = true;
    }
  }catch(e){
    console.error(e);
    alert("User rejected or MetaMask error.");
  }
}

async function switchNetwork(targetId){
  await ensureProvider();
  const meta = CHAINS[targetId];
  if (!meta) throw new Error("Unsupported network");
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: meta.hex }]
    });
  } catch(err){
    // 4902: chain eklemek lazım
    if (err && err.code === 4902 && meta.params) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [meta.params]
      });
    } else {
      throw err;
    }
  }
}

function getSelectedChainId(){
  const sel = document.getElementById("networkSel");
  const v = parseInt(sel?.value||"56",10);
  return (v===1||v===56||v===137) ? v : 56;
}

async function connectIfNeeded(){
  if (!currentAccount) await connectWallet();
}

const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

async function usdtTransfer(chainId, to, amountFloat){
  await ensureProvider();
  await connectIfNeeded();

  // Ağ uygun mu? değilse switch yap
  const net = await provider.getNetwork();
  if (net.chainId !== chainId) {
    await switchNetwork(chainId);
  }
  const meta = CHAINS[chainId];
  const token = new ethers.Contract(meta.usdt, ERC20_ABI, provider).connect(signer);

  const dec = meta.usdtDecimals;
  const amtStr = Number.isFinite(amountFloat) ? amountFloat.toFixed(dec > 6 ? 6 : dec) : "0";
  const amount = ethers.utils.parseUnits(amtStr, dec);

  const bal = await token.balanceOf(currentAccount);
  if (bal.lt(amount)) {
    alert("Insufficient USDT balance.");
    throw new Error("Low balance");
  }

  const tx = await token.transfer(CONFIG.ownerAddress, amount);
  await tx.wait();
  return tx.hash;
}

async function handleBuy(weekIndex){
  try {
    const qty = parseFloat((document.getElementById("buyAmount")?.value||"0").toString().replace(/[^\d.]/g,"")) || 0;
    if (qty <= 0) { alert("Enter a valid amount."); return; }

    const days = Math.floor((Date.now() - CONFIG.saleStart) / 86400000);
    const active = (days < 7) ? 0 : (days < 14) ? 1 : (days < 21) ? 2 : 3;
    if (weekIndex !== active) { alert("This week is not active."); return; }

    const price = CONFIG.weekPrices[weekIndex]; // USDT
    const cost  = qty * price;

    const chainId = getSelectedChainId();
    const txHash = await usdtTransfer(chainId, CONFIG.ownerAddress, cost);

    alert(`Purchase successful!\nTX: ${txHash}\nYou can claim later from Claim Portal.`);
  } catch(e){
    console.error(e);
    alert("Transaction failed or rejected.");
  }
}

document.getElementById("connectBtn")?.addEventListener("click", connectWallet);
document.getElementById("networkSel")?.addEventListener("change", async ()=>{
  try { await switchNetwork(getSelectedChainId()); } catch(e){ console.warn(e); }
});

["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
  const b = document.getElementById(id);
  if (b) b.addEventListener("click", ()=>handleBuy(i));
});

/* =========================
   NFT Grid render (contain)
========================= */
(function renderNFTs(){
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
})();

/* =========================
   Countdown (SABİT TARİH) — RESET DÜZELTME
========================= */
// Refresh’te sıfırlanmasın diye sabit tarih kullan:
CONFIG.launchAt = Date.parse('2025-10-30T21:00:00Z');

function tick(){
  const left = Math.max(0, CONFIG.launchAt - Date.now());
  const d = Math.floor(left / 86400000);
  const h = Math.floor((left % 86400000) / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  const pad = n=>n.toString().padStart(2,"0");
  const ids = ["cdDays","cdHours","cdMins","cdSecs"];
  [d,h,m,s].forEach((v,i)=>{
    const el = document.getElementById(ids[i]);
    if (el && el.textContent !== pad(v)) el.textContent = pad(v);
  });
}
tick(); setInterval(tick, 1000);

/* =========================
   Maliyet hesap (tüm haftalar)
========================= */
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
document.getElementById("buyAmount")?.addEventListener("input", updateCosts);
updateCosts();
