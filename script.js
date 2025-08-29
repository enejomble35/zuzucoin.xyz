/* ======= Geri Sayım (tarihi kendine göre ayarla) ======= */
const PRESALE_END = new Date("2025-10-01T21:00:00Z").getTime(); // örnek bitiş
function tickCountdown(){
  const now = Date.now();
  const left = Math.max(0, PRESALE_END - now);
  const d = Math.floor(left/86400000);
  const h = Math.floor((left%86400000)/3600000);
  const m = Math.floor((left%3600000)/60000);
  const s = Math.floor((left%60000)/1000);
  document.getElementById('cdDays').textContent = String(d).padStart(2,'0');
  document.getElementById('cdHours').textContent= String(h).padStart(2,'0');
  document.getElementById('cdMins').textContent = String(m).padStart(2,'0');
  document.getElementById('cdSecs').textContent = String(s).padStart(2,'0');
}
tickCountdown(); setInterval(tickCountdown, 1000);

/* ======= Haftalar (aktif/pasif) – tarih aralığına göre yönet ======= */
// Şimdilik 1. hafta aktif, diğerleri devre dışı:
(function setWeeks(){
  const w2 = document.getElementById('w2');
  const w3 = document.getElementById('w3');
  const w4 = document.getElementById('w4');
  w2.classList.add('disabled'); w3.classList.add('disabled'); w4.classList.add('disabled');
})();

/* ======= NFT Grid – 5x2 düzen (10 maskot) ======= */
const MASKS = [
  {file:"0.png", name:"ZUZU Hero"},
  {file:"1.png", name:"ZUZU Ranger"},
  {file:"2.png", name:"ZUZU Warrior"},
  {file:"3.png", name:"ZUZU Hacker"},
  {file:"4.png", name:"ZUZU Rogue"},
  {file:"5.png", name:"ZUZU Titan"},
  {file:"6.png", name:"ZUZU Sorceress"},
  {file:"7.png", name:"ZUZU Berserker"},
  {file:"8.png", name:"ZUZU Scientist"},
  {file:"9.png", name:"ZUZU Maiden"}
];

function buildNFTs(){
  const grid = document.getElementById('nftGrid');
  grid.innerHTML = "";
  MASKS.forEach(m=>{
    const card = document.createElement('div');
    card.className = "nft";
    card.innerHTML = `
      <img class="cover" src="assets/images/masks/${m.file}" alt="${m.name}">
      <div class="meta">
        <h3>${m.name}</h3>
        <div class="tag">Stake ödülü • Koleksiyon parçası</div>
      </div>
    `;
    grid.appendChild(card);
  });
}
buildNFTs();
