/* ===========================
   ZUZU — Stake/NFT/Countdown
   =========================== */

// ---- Thirdweb kontrat bilgilerimiz ----
const THIRDWEB_CONTRACT_1155 = "0xF2bbbEcB417725813BF5E940d678793fACDa9729";
const THIRDWEB_COLLECTION_URL =
  "https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a/contract/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts";

// Sayfadaki bağlantıları set et
(function initThirdwebLinks(){
  const el = document.getElementById("contractLink");
  const el2 = document.getElementById("thirdwebNFTRoute");
  const el3 = document.getElementById("contractDisplay");
  if(el) el.href = THIRDWEB_COLLECTION_URL;
  if(el2) el2.href = THIRDWEB_COLLECTION_URL;
  if(el3) el3.textContent = THIRDWEB_CONTRACT_1155.slice(0,6)+"…"+THIRDWEB_CONTRACT_1155.slice(-4);
})();

// ---- NFT Grid (statik meta + Thirdweb’e link) ----
const ZUZU_NFTS = [
  { id:0,  name:"ZUZU Hero",       rarity:"Legendary", supply:200,  img:"assets/images/mask/0.png"  },
  { id:1,  name:"ZUZU Rogue",      rarity:"Epic",      supply:2500, img:"assets/images/mask/1.png"  },
  { id:2,  name:"ZUZU Berserker",  rarity:"Rare",      supply:800,  img:"assets/images/mask/2.png"  },
  { id:3,  name:"ZUZU Hacker",     rarity:"Rare",      supply:600,  img:"assets/images/mask/3.png"  },
  { id:4,  name:"ZUZU Sorceress",  rarity:"Epic",      supply:750,  img:"assets/images/mask/4.png"  },
  { id:5,  name:"ZUZU Warrior",    rarity:"Rare",      supply:900,  img:"assets/images/mask/5.png"  },
  { id:6,  name:"ZUZU Maiden",     rarity:"Epic",      supply:1100, img:"assets/images/mask/6.png"  },
  { id:7,  name:"ZUZU Ranger",     rarity:"Rare",      supply:1000, img:"assets/images/mask/7.png"  },
  { id:8,  name:"ZUZU Scientist",  rarity:"Epic",      supply:1100, img:"assets/images/mask/8.png"  },
  { id:9,  name:"ZUZU Titan",      rarity:"Legendary", supply:250,  img:"assets/images/mask/9.png"  }
];

function rarityBadge(r){
  const cls = r==="Legendary" ? "legend" : r==="Epic" ? "epic" : "rare";
  return `<span class="badge ${cls}">${r}</span>`;
}

function renderNFTGrid(){
  const grid = document.getElementById("nftGrid");
  if(!grid) return;
  grid.innerHTML = ZUZU_NFTS.map(nft=>{
    const link = `${THIRDWEB_COLLECTION_URL}?tokenId=${nft.id}`;
    return `
    <a class="nft-card" href="${link}" target="_blank" rel="noopener">
      <div class="media"><img src="${nft.img}" alt="${nft.name}"></div>
      <div class="meta">
        <h4>${nft.name}</h4>
        <p>Arz: <strong>${nft.supply}</strong></p>
      </div>
      <div class="foot">
        ${rarityBadge(nft.rarity)}
        <span class="ext">Görüntüle ↗</span>
      </div>
    </a>`;
  }).join("");
}
renderNFTGrid();

// ---- Stake Hesaplayıcı ----
const APR_BY_DAYS = {
  30:  12,
  90:  24,
  180: 40,
  365: 65,
  540: 85
};

function calcStake(){
  const amount   = parseFloat(document.getElementById('stakeAmount').value || "0");
  const days     = parseInt(document.getElementById('stakeDuration').value || "30", 10);
  const nftBoost = parseFloat(document.getElementById('nftBoost').value || "0");
  const early    = parseFloat(document.getElementById('earlyBoost').value || "0");

  if(isNaN(amount) || amount<=0){
    alert("Lütfen geçerli bir ZUZU miktarı girin.");
    return;
  }

  const baseAPR  = APR_BY_DAYS[days] || 0;
  const totalAPR = baseAPR * (1 + (nftBoost + early)/100);

  // Basit faiz yaklaşımı (stake süresi kadar oranlanır)
  const totalGain = amount * (totalAPR/100) * (days/365);
  const monthly   = totalGain / (days/30.417); // ortalama ay uzunluğu

  document.getElementById('resultTotal').textContent   = `${totalGain.toFixed(2)} ZUZU`;
  document.getElementById('resultMonthly').textContent = `${monthly.toFixed(2)} ZUZU`;
  document.getElementById('resultBoost').textContent   = `+${(nftBoost+early).toFixed(0)}%`;
}

const calcBtn = document.getElementById('calcBtn');
if(calcBtn) calcBtn.addEventListener('click', calcStake);

// ---- TRT Geri Sayım ----
// Tarihi değiştir: “YYYY-MM-DDTHH:mm:ss+03:00” (TRT)
const PRESALE_TARGET_TRT = "2025-09-15T21:00:00+03:00";

function startCountdown(){
  const dEl = document.getElementById("cdDays");
  const hEl = document.getElementById("cdHours");
  const mEl = document.getElementById("cdMins");
  const sEl = document.getElementById("cdSecs");
  if(!dEl) return;

  const target = new Date(PRESALE_TARGET_TRT).getTime();

  function tick(){
    const now = Date.now();
    let diff = Math.max(0, target - now);

    const days  = Math.floor(diff / (1000*60*60*24));
    diff       -= days*(1000*60*60*24);
    const hours = Math.floor(diff / (1000*60*60));
    diff       -= hours*(1000*60*60);
    const mins  = Math.floor(diff / (1000*60));
    diff       -= mins*(1000*60);
    const secs  = Math.floor(diff / 1000);

    dEl.textContent = String(days).padStart(2,'0');
    hEl.textContent = String(hours).padStart(2,'0');
    mEl.textContent = String(mins).padStart(2,'0');
    sEl.textContent = String(secs).padStart(2,'0');
  }
  tick();
  setInterval(tick, 1000);
}
startCountdown();
