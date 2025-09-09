/* ZUZU — UI core (dil, sayaç, NFT grid, buy/ref link) */

// ----- Dil -----
(function(){
  const saved = localStorage.getItem("zuzu_lang") || "en";
  window.addEventListener("DOMContentLoaded", ()=>{
    applyLang(saved);

    const langBtn = document.getElementById("langBtn");
    const langMenu = document.getElementById("langMenu");
    langBtn?.addEventListener("click", ()=>{
      langMenu?.classList.toggle("show");
    });
    document.querySelectorAll(".lang-opt").forEach(b=>{
      b.addEventListener("click", ()=>{
        const l = b.dataset.lang; applyLang(l);
        langMenu?.classList.remove("show");
      });
    });

    // ödeme modu açılır
    const payBtn = document.getElementById("paySelect");
    const payMenu = document.getElementById("payMenu");
    payBtn?.addEventListener("click", ()=>payMenu?.classList.toggle("show"));
    document.querySelectorAll(".pay-opt").forEach(p=>{
      p.addEventListener("click", ()=>{
        payBtn.dataset.mode = p.dataset.mode;
        payBtn.textContent = p.textContent;
        payMenu?.classList.remove("show");
      });
    });

    // ref link
    const ref = new URL(location.href);
    const myRef = ref.origin + ref.pathname + "?ref=" + encodeURIComponent(getMyRef());
    const refInput = document.getElementById("refLink");
    if(refInput) refInput.value = myRef;
    document.getElementById("copyRef")?.addEventListener("click", ()=>{
      navigator.clipboard.writeText(myRef);
    });

    // NFT grid
    renderNFTs();

    // sayaç
    tick(); setInterval(tick, 1000);

    // satın al
    document.getElementById("buyNow")?.addEventListener("click", handleBuy);
  });
})();

function getMyRef(){
  // cüzdan bağlandığında wallet-lite.js setConnected çağırır, yoksa rastgele id
  return window.__zuzu_pk?.() || (localStorage.getItem("zuzu_id") || localStorage.setItem("zuzu_id", "u"+Math.random().toString(36).slice(2)), localStorage.getItem("zuzu_id"));
}

// ----- Sayaç (sabit bir son tarih) -----
const SALE_END = Date.parse("2025-12-31T23:59:59Z"); // değiştirilebilir
function tick(){
  const left = Math.max(0, SALE_END - Date.now());
  const d = Math.floor(left / 86400000);
  const h = Math.floor((left % 86400000) / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  const P = n => String(n).padStart(2,"0");
  const ids = ["cdDays","cdHours","cdMins","cdSecs"];
  [d,h,m,s].forEach((v,i)=>{
    const el = document.getElementById(ids[i]); if(el) el.textContent = P(v);
  });
}

// ----- NFT grid (örnek) -----
function renderNFTs(){
  const list = [
    {id:1,name:"ZUZU Hero",rarity:"Epic",img:"assets/images/mask/0.png"},
    {id:2,name:"ZUZU Rogue",rarity:"Rare",img:"assets/images/mask/1.png"},
    {id:3,name:"ZUZU Hacker",rarity:"Rare",img:"assets/images/mask/2.png"},
    {id:4,name:"ZUZU Sorceress",rarity:"Epic",img:"assets/images/mask/3.png"},
    {id:5,name:"ZUZU Warrior",rarity:"Rare",img:"assets/images/mask/4.png"},
  ];
  const grid = document.getElementById("nftGrid");
  if(!grid) return;
  grid.innerHTML = list.map(n=>`
    <div class="nft-card">
      <img src="${n.img}" alt="${n.name}" />
      <div class="cap"><span>#${n.id} ${n.name}</span><b>${n.rarity}</b></div>
    </div>`).join("");
}

// ----- Buy flow (demo: yönlendirme) -----
function handleBuy(){
  const amt = Number(document.getElementById("buyAmount")?.value||0);
  const mode = document.getElementById("paySelect")?.dataset.mode || "SOL";
  if(!amt || amt<=0) return alert("Amount?");
  // gerçek SPL işlemi için on-chain kod eklenmeli.
  alert(`Redirecting to wallet...\nAmount: ${amt} ZUZU\nPay: ${mode}`);
  // wallet-lite.js içindeki bağlanma zaten modal üzerinden çalışır.
}
