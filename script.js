(()=>{

  // ================== Sabitler ==================
  const THIRDWEB_CONTRACT_1155 =
    "0xF2bbbEcB417725813BF5E940d678793fACDa9729";

  const THIRDWEB_COLLECTION_URL =
    "https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a/contract/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts";

  // Link/kontrat gösterimi
  const a1 = document.getElementById("thirdwebNFTRoute");
  const a2 = document.getElementById("thirdwebNFTRoute2");
  const a3 = document.getElementById("contractLink");
  const cd = document.getElementById("contractDisplay");
  const cd2 = document.getElementById("contractDisplay2");
  if(a1) a1.href = THIRDWEB_COLLECTION_URL;
  if(a2) a2.href = THIRDWEB_COLLECTION_URL;
  if(a3) a3.href = THIRDWEB_COLLECTION_URL;
  const short = (addr)=> addr.slice(0,6)+"…"+addr.slice(-4);
  if(cd)  cd.textContent  = short(THIRDWEB_CONTRACT_1155);
  if(cd2) cd2.textContent = short(THIRDWEB_CONTRACT_1155);

  // ================== NFT Grid ==================
  // Görsel yolları: assets/images/mask/{id}.png
  const ZUZU_NFTS = [
    { id:0,  name:"ZUZU Hero",       supply:200,  rarity:"Epic",      img:"assets/images/mask/0.png" },
    { id:1,  name:"ZUZU Rogue",      supply:2500, rarity:"Rare",      img:"assets/images/mask/1.png" },
    { id:2,  name:"ZUZU Berserker",  supply:800,  rarity:"Epic",      img:"assets/images/mask/2.png" },
    { id:3,  name:"ZUZU Hacker",     supply:600,  rarity:"Rare",      img:"assets/images/mask/3.png" },
    { id:4,  name:"ZUZU Sorceress",  supply:750,  rarity:"Epic",      img:"assets/images/mask/4.png" },
    { id:5,  name:"ZUZU Warrior",    supply:900,  rarity:"Rare",      img:"assets/images/mask/5.png" },
    { id:6,  name:"ZUZU Maiden",     supply:1100, rarity:"Rare",      img:"assets/images/mask/6.png" },
    { id:7,  name:"ZUZU Ranger",     supply:1000, rarity:"Rare",      img:"assets/images/mask/7.png" },
    { id:8,  name:"ZUZU Scientist",  supply:1100, rarity:"Epic",      img:"assets/images/mask/8.png" },
    { id:9,  name:"ZUZU Titan",      supply:250,  rarity:"Legendary", img:"assets/images/mask/9.png" },
  ];

  function rarityBadge(r){
    const c = r==="Legendary" ? "legend" : r==="Epic" ? "epic" : "rare";
    return `<span class="badge ${c}">${r}</span>`;
  }

  function renderNFTGrid(){
    const grid = document.getElementById("nftGrid");
    if(!grid) return;
    grid.innerHTML = ZUZU_NFTS.map(nft=>{
      const route = `${THIRDWEB_COLLECTION_URL}?tokenId=${nft.id}`;
      return `
        <a class="nft-card" href="${route}" target="_blank" rel="noopener">
          <div class="media"><img src="${nft.img}" alt="${nft.name}"></div>
          <div class="meta">
            <h4>${nft.name}</h4>
            <p>Arz: <strong>${nft.supply}</strong></p>
          </div>
          <div class="foot">${rarityBadge(nft.rarity)}<span class="ext">Görüntüle ↗</span></div>
        </a>`;
    }).join("");
  }
  renderNFTGrid();

  // ================== Hesaplayıcı ==================
  const APR_BY_DAYS = {30:12, 90:24, 180:40, 365:65, 540:85};

  function calcStake(){
    const amount   = parseFloat(document.getElementById('stakeAmount')?.value || "0");
    const days     = parseInt(document.getElementById('stakeDuration')?.value || "30", 10);
    const nftBoost = parseFloat(document.getElementById('nftBoost')?.value || "0");
    const early    = parseFloat(document.getElementById('earlyBoost')?.value || "0");

    if(isNaN(amount) || amount<=0){ alert("Lütfen geçerli bir ZUZU miktarı girin."); return; }

    const baseAPR  = APR_BY_DAYS[days] || 0;
    const totalAPR = baseAPR * (1 + (nftBoost + early)/100);

    const totalGain = amount * (totalAPR/100) * (days/365);
    const monthly   = totalGain / (days/30.417);

    document.getElementById('resultTotal').textContent   = `${totalGain.toFixed(2)} ZUZU`;
    document.getElementById('resultMonthly').textContent = `${monthly.toFixed(2)} ZUZU`;
    document.getElementById('resultBoost').textContent   = `+${(nftBoost+early).toFixed(0)}%`;
  }

  document.getElementById('calcBtn')?.addEventListener('click', calcStake);

  // ================== Geri Sayım (TRT) ==================
  // Türkiye saati 15 Eylül 2025 21:00
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
      const days  = Math.floor(diff / (1000*60*60*24)); diff -= days*(1000*60*60*24);
      const hours = Math.floor(diff / (1000*60*60));    diff -= hours*(1000*60*60);
      const mins  = Math.floor(diff / (1000*60));       diff -= mins*(1000*60);
      const secs  = Math.floor(diff / 1000);

      dEl.textContent = String(days).padStart(2,'0');
      hEl.textContent = String(hours).padStart(2,'0');
      mEl.textContent = String(mins).padStart(2,'0');
      sEl.textContent = String(secs).padStart(2,'0');
    }

    tick(); setInterval(tick, 1000);
  }
  startCountdown();

})();
