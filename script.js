/* ZUZU core: dil, sayaç, sekmeler, ref link, NFT grid, satın alma stub */
function $(id){return document.getElementById(id)};function $all(s){return [...document.querySelectorAll(s)]}
function toggle(el){el?.classList.toggle("show")}function hide(el){el?.classList.remove("show")}
function setText(id,t){const el=$(id); if(el) el.textContent=t}

// --- Countdown target (persist) ---
(function persistSaleEnd(){
  const url=new URL(location.href);
  const override=url.searchParams.get("saleEnd"); // ISO string optional
  if(override){ localStorage.setItem("zuzu_sale_end", String(Date.parse(override))); }
  if(!localStorage.getItem("zuzu_sale_end")){
    const plus50d = Date.now()+50*24*60*60*1000;
    localStorage.setItem("zuzu_sale_end", String(plus50d));
  }
})();

const WEEKS=[{name:"Week 1",price:0.0050},{name:"Week 2",price:0.0055},{name:"Week 3",price:0.0060},{name:"Week 4",price:0.0065}];

window.addEventListener("DOMContentLoaded",()=>{
  // Lang
  applyLang(localStorage.getItem("zuzu_lang")||"en");
  const langBtn=$("langBtn"),langMenu=$("langMenu");
  langBtn?.addEventListener("click",()=>toggle(langMenu));
  $all(".lang-opt").forEach(b=>b.addEventListener("click",()=>{applyLang(b.dataset.lang);hide(langMenu)}));

  // Pay mode
  const payBtn=$("paySelect"),payMenu=$("payMenu");
  payBtn?.addEventListener("click",()=>toggle(payMenu));
  $all(".pay-opt").forEach(p=>p.addEventListener("click",()=>{payBtn.dataset.mode=p.dataset.mode;payBtn.textContent=p.textContent;hide(payMenu)}));

  // Week tabs
  let currentWeek=0; const tabs=$all(".buy-tabs .tab"), note=$("priceNote");
  const upd=()=>note&&(note.textContent=`${WEEKS[currentWeek].name} • ${WEEKS[currentWeek].price.toFixed(4)} USDT`);
  tabs.forEach(t=>t.addEventListener("click",()=>{tabs.forEach(x=>x.classList.remove("active"));t.classList.add("active");currentWeek=+t.dataset.week;upd()})); upd();

  // Referral link
  setRefLink(); document.addEventListener("zuzu:walletConnected", setRefLink);
  $("copyRef")?.addEventListener("click",()=>{const v=$("refLink")?.value||""; if(!v) return; navigator.clipboard.writeText(v).then(()=>alert("Copied")); });

  // NFT grid
  renderNFTs();

  // Countdown
  tick(); setInterval(tick,1000);

  // Buy (stub)
  $("buyNow")?.addEventListener("click",()=>{
    const amt=Number($("buyAmount")?.value||0); if(!amt) return alert("Amount?");
    const mode=$("paySelect")?.dataset.mode||"SOL";
    const pk=window.__zuzu_pk?.();
    if(!pk){ $("connectBtn")?.click(); return; }
    alert(`Redirecting to wallet…\nAmount: ${amt} ZUZU\nPay: ${mode}\n(${WEEKS[currentWeek].name})`);
  });
});

function tick(){
  const end=Number(localStorage.getItem("zuzu_sale_end")||0);
  const left=Math.max(0,end-Date.now());
  const d=Math.floor(left/86400000),h=Math.floor((left%86400000)/3600000),
        m=Math.floor((left%3600000)/60000),s=Math.floor((left%60000)/1000);
  const P=n=>String(n).padStart(2,"0");
  setText("cdDays",P(d)); setText("cdHours",P(h)); setText("cdMins",P(m)); setText("cdSecs",P(s));
}

function renderNFTs(){
  const list=[
    {id:1,name:"ZUZU Hero",rarity:"Epic",img:"assets/images/mask/0.png"},
    {id:2,name:"ZUZU Rogue",rarity:"Rare",img:"assets/images/mask/1.png"},
    {id:3,name:"ZUZU Hacker",rarity:"Rare",img:"assets/images/mask/2.png"},
    {id:4,name:"ZUZU Sorceress",rarity:"Epic",img:"assets/images/mask/3.png"},
    {id:5,name:"ZUZU Warrior",rarity:"Rare",img:"assets/images/mask/4.png"}
  ];
  const grid=$("nftGrid"); if(!grid) return;
  grid.innerHTML=list.map(n=>`<div class="nft-card"><img src="${n.img}" alt="${n.name}"><div class="cap"><span>#${n.id} ${n.name}</span><b>${n.rarity}</b></div></div>`).join("");
}

function setRefLink(){
  const base=location.origin+location.pathname;
  const anon=localStorage.getItem("zuzu_id")||("u"+Math.random().toString(36).slice(2));
  localStorage.setItem("zuzu_id",anon);
  const ref=window.__zuzu_pk?.()||anon;
  const link=`${base}?ref=${encodeURIComponent(ref)}`;
  const inp=$("refLink"); if(inp) inp.value=link;
}
