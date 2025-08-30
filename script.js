/* ===========================
   ZUZU — Front Logic (MetaMask + USDT)
   - TON tamamen KALDIRILDI
   - BSC / ETH / Polygon USDT transfer ile satın alma
   - Aktif hafta otomatik seçilir, diğerleri pasif
   - NFT grid kare içine sığar (contain)
   - 50 günlük geri sayım
=========================== */

// ====== CONFIG BRIDGE ======
const ADMIN_EVM = "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3"; // Senin alıcı cüzdanın
// Eğer index.html'de CONFIG yoksa, burada minimumu set edelim:
window.CONFIG = window.CONFIG || {};
CONFIG.contractAddress = CONFIG.contractAddress || "0xF2bbbEcB417725813BF5E940d678793fACDa9729";
CONFIG.collectionUrl  = CONFIG.collectionUrl  || "https://thirdweb.com/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts";
CONFIG.weekPrices     = CONFIG.weekPrices     || [0.0050, 0.0065, 0.0080, 0.0100];
CONFIG.nfts           = CONFIG.nfts || [
  {id:0,name:"ZUZU Hero",      rarity:"Epic",      supply:200},
  {id:1,name:"ZUZU Rogue",     rarity:"Rare",      supply:2500},
  {id:2,name:"ZUZU Berserker", rarity:"Epic",      supply:800},
  {id:3,name:"ZUZU Hacker",    rarity:"Rare",      supply:600},
  {id:4,name:"ZUZU Sorceress", rarity:"Epic",      supply:750},
  {id:5,name:"ZUZU Warrior",   rarity:"Rare",      supply:900},
  {id:6,name:"ZUZU Maiden",    rarity:"Rare",      supply:1100},
  {id:7,name:"ZUZU Ranger",    rarity:"Rare",      supply:1000},
  {id:8,name:"ZUZU Scientist", rarity:"Epic",      supply:1100},
  {id:9,name:"ZUZU Titan",     rarity:"Legendary", supply:250},
];

// Geri Sayım: 50 gün (şu andan itibaren)
CONFIG.launchAt = Date.now() + 50 * 24 * 60 * 60 * 1000;

// Satış haftaları (başlangıcı “şimdi” kabul edelim; 7 gün = 1 hafta)
const SALE_START_AT = Date.now(); // istersen sabit tarih koyabilirsin
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// USDT address & decimals by chain
const CHAINS = {
  // chainId: { name, usdt, decimals }
  1:   { name: "Ethereum", usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6  },
  56:  { name: "BNB Chain", usdt: "0x55d398326f99059fF775485246999027B3197955", decimals: 18 },
  137: { name: "Polygon",  usdt: "0xC2132D05D31c914a87C6611C10748AaCB9bC6C",   decimals: 6  },
};
const CHAIN_PARAMS = {
  1:   { chainId: "0x1"  },
  56:  { chainId: "0x38" },
  137: { chainId: "0x89" },
};

// ===== Helpers =====
const $ = (sel) => document.querySelector(sel);
const $all = (sel) => Array.from(document.querySelectorAll(sel));

function pad32(hexNo0x){
  return hexNo0x.padStart(64, '0');
}
function toHex(amountBN){
  return '0x' + amountBN.toString(16);
}
function toUnit(amount, decimals){
  // amount: number (float), decimals: int
  // returns BigInt
  const [intStr, decStrRaw] = amount.toString().split('.');
  const decStr = (decStrRaw || '').slice(0, decimals);
  const padded = decStr.padEnd(decimals, '0');
  return BigInt(intStr + padded);
}
function getActiveWeek(){
  const diff = Date.now() - SALE_START_AT;
  let w = Math.floor(diff / WEEK_MS);
  if (w < 0) w = 0;
  if (w > 3) w = 3;
  return w;
}
function formatNumber(x, digits=2){
  if (isNaN(x)) return "0";
  return Number(x).toLocaleString(undefined, {maximumFractionDigits:digits});
}

// ===== Countdown (50 gün) =====
function tickCountdown(){
  const left = Math.max(0, CONFIG.launchAt - Date.now());
  const d = Math.floor(left / 86400000);
  const h = Math.floor((left % 86400000) / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  const pad = (n)=> n.toString().padStart(2,'0');
  const ids = ["#cdDays", "#cdHours", "#cdMins", "#cdSecs"];
  const vals= [d,h,m,s].map(pad);
  ids.forEach((id,i)=>{ const el=$(id); if(el) el.textContent = vals[i]; });
}

// ===== Costs =====
function updateCosts(){
  const qtyEl = $("#buyAmount");
  if (!qtyEl) return;
  const qty = parseFloat(qtyEl.value || "0");
  CONFIG.weekPrices.forEach((p,i)=>{
    const cost = (qty * p) || 0;
    const priceEl = $("#p"+i), costEl = $("#c"+i);
    if(priceEl) priceEl.textContent = p.toFixed(4);
    if(costEl)  costEl.textContent = formatNumber(cost, 2);
  });
}

// ===== NFT Grid render (contain, square) =====
function renderNFTs(){
  const g = $("#nftGrid");
  if(!g) return;
  let html = "";
  CONFIG.nfts.forEach(n=>{
    const img = `assets/images/mask/${n.id}.png`;
    const link = `${CONFIG.collectionUrl}?tokenId=${n.id}`;
    html += `
    <div class="nft">
      <div class="nft-thumb" style="
        width:100%;
        aspect-ratio:1/1;
        background:#0b1330;
        display:flex;
        align-items:center;
        justify-content:center;
        border-bottom:1px solid #1d2d50;
      ">
        <img src="${img}" alt="${n.name}" loading="lazy"
             style="width:100%; height:100%; object-fit:contain;">
      </div>
      <div class="meta">
        <div>
          <b>${n.name}</b>
          <div style="color:#9fb6e6;font-size:.9rem">Supply: ${formatNumber(n.supply,0)}</div>
        </div>
        <span class="tag">${n.rarity}</span>
      </div>
      <a class="z-btn z-btn-ghost" style="margin:0 10px 10px" href="${link}" target="_blank" rel="noopener">View ↗</a>
    </div>`;
  });
  g.innerHTML = html;
}

// ===== Exchanges ticker fix (mobile visible) =====
function fixTicker(){
  const track = $("#exTrack");
  if (!track) return;
  // Track genişliğini otomatik uzat, sonsuz döngü için kopya öğeler zaten HTML’de var.
  track.style.willChange = 'transform';
  track.style.minWidth = '200%';
}

// ===== Wallet (MetaMask only) =====
let currentAccount = null;
let currentChainId = null;

async function connectMetaMask(){
  if(!window.ethereum){
    alert("MetaMask not detected. Please install MetaMask.");
    return;
  }
  try{
    const accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
    currentAccount = (accs && accs[0]) ? accs[0] : null;
    const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
    currentChainId = parseInt(chainIdHex, 16);
    const btn = $("#connectBtn");
    if(btn && currentAccount) btn.textContent = "MetaMask ✓";
    // Dinleyiciler
    window.ethereum.on('chainChanged', (cidHex)=>{
      currentChainId = parseInt(cidHex,16);
    });
    window.ethereum.on('accountsChanged', (accs)=>{
      currentAccount = (accs && accs[0]) ? accs[0] : null;
    });
  }catch(err){
    console.error(err);
    alert("MetaMask connection rejected.");
  }
}

async function ensureChain(targetChainId){
  if(currentChainId === targetChainId) return true;
  try{
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [ { chainId: CHAIN_PARAMS[targetChainId].chainId } ]
    });
    currentChainId = targetChainId;
    return true;
  }catch(err){
    console.warn("Chain switch error:", err);
    alert(`Please switch your MetaMask network to ${CHAINS[targetChainId].name} and try again.`);
    return false;
  }
}

// USDT transfer via MetaMask (ERC20 transfer)
async function usdtTransfer(chainId, to, usdtAmount){
  if(!window.ethereum || !currentAccount){
    await connectMetaMask();
  }
  if (!currentAccount) throw new Error("Wallet not connected");

  const c = CHAINS[chainId];
  if(!c) throw new Error("Unsupported chain");

  // transfer(address,uint256)
  const methodSig = "0xa9059cbb";
  const toPadded = pad32(to.replace(/^0x/, '').toLowerCase());
  const amt = toUnit(usdtAmount, c.decimals);
  const amtHex = pad32(amt.toString(16));

  const data = methodSig + toPadded + amtHex;

  const tx = {
    from: currentAccount,
    to: c.usdt,
    value: '0x0',
    data
  };
  const txHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [ tx ]
  });
  return txHash;
}

// Active week UI enable/disable
function updateWeekButtons(){
  const active = getActiveWeek();
  // Tüm buy butonlarını sırala:
  const cards = $all(".buybox");
  cards.forEach((card, idx)=>{
    const buyBtn = card.querySelector(".z-btn-primary");
    const ghost  = card.querySelector(".z-btn-ghost");
    const noteId = "wNote"+idx;
    if(!buyBtn) return;

    if(idx === active){
      buyBtn.disabled = false;
      buyBtn.textContent = (buyBtn.getAttribute("data-i") === "buy") ? "Buy" : "Buy";
      if(ghost) ghost.textContent = "Details";
      // Not
      let note = card.querySelector(`#${noteId}`);
      if(!note){
        note = document.createElement("div");
        note.id = noteId;
        note.style.marginTop = "6px";
        note.style.color = "#8fb7ff";
        note.style.fontSize = ".9rem";
        card.appendChild(note);
      }
      note.textContent = "Active week";
    } else {
      buyBtn.disabled = true;
      buyBtn.textContent = "Not active";
    }
  });
}

// Handle buy (auto choose chain = BSC > Polygon > ETH if available)
async function handleBuy(weekIdx){
  try{
    const qtyEl = $("#buyAmount");
    const qty = parseFloat(qtyEl?.value || "0");
    if(!qty || qty <= 0){
      alert("Please enter ZUZU amount.");
      return;
    }
    const price = CONFIG.weekPrices[weekIdx];
    const costUSDT = qty * price;

    // Zinciri otomatik belirle: Eğer kullanıcı BSC’deyse oradan yap;
    // değilse BSC’ye geçmeyi dener, olmazsa Polygon, o da olmazsa ETH.
    const preferred = [56, 137, 1];
    let ok = false, chosen = null;
    for (const cid of preferred){
      const good = await ensureChain(cid);
      if(good){ chosen = cid; ok = true; break; }
    }
    if(!ok || !chosen) {
      alert("Please switch to BNB Chain / Polygon / Ethereum and try again.");
      return;
    }

    // USDT transfer -> ADMIN_EVM
    const txHash = await usdtTransfer(chosen, ADMIN_EVM, costUSDT);
    alert("Transaction sent! TX: " + txHash + "\nAfter confirmation, you will be able to claim from the Claim page.");
    // Basit kayıt (localStorage) — ileride claim sayfası ile eşleştirilebilir
    const rec = {
      t: Date.now(),
      buyer: currentAccount,
      chainId: chosen,
      qty,
      price,
      costUSDT,
      week: weekIdx
    };
    const key = "zuzu_purchases";
    const all = JSON.parse(localStorage.getItem(key) || "[]");
    all.push(rec);
    localStorage.setItem(key, JSON.stringify(all));
  }catch(err){
    console.error(err);
    alert("Buy failed: " + (err?.message || "Unknown error"));
  }
}

// ===== INIT =====
function initLinksAndContract(){
  const cd = $("#contractDisplay");
  const cd2= $("#contractDisplay2");
  if(cd)  cd.textContent  = CONFIG.contractAddress.slice(0,6)+"..."+CONFIG.contractAddress.slice(-4);
  if(cd2) cd2.textContent = CONFIG.contractAddress;

  const l1 = $("#thirdwebNFTRoute");
  const l2 = $("#thirdwebNFTRoute2");
  if(l1) l1.href = CONFIG.collectionUrl;
  if(l2) l2.href = CONFIG.collectionUrl;
}

function bindEvents(){
  const btn = $("#connectBtn");
  if(btn){
    btn.addEventListener("click", connectMetaMask);
  }
  const buyButtons = $all(".buybox .z-btn-primary");
  buyButtons.forEach((b, idx)=>{
    b.addEventListener("click", ()=> handleBuy(idx));
  });

  const qtyEl = $("#buyAmount");
  if(qtyEl){
    qtyEl.addEventListener("input", updateCosts);
  }
}

function startTimers(){
  tickCountdown();
  setInterval(tickCountdown, 1000);
  // Haftalık durumu her 10 sn kontrol et (UI aktif/pasif)
  updateWeekButtons();
  setInterval(updateWeekButtons, 10000);
}

document.addEventListener("DOMContentLoaded", ()=>{
  initLinksAndContract();
  renderNFTs();
  fixTicker();
  updateCosts();
  updateWeekButtons();
  startTimers();
});
