/* =========================
   CONFIG
========================= */
const CONFIG = {
  // Sabit: 23 Kasım 2025 Pazar 13:00 (TR)
  LAUNCH_ISO: "2025-11-23T13:00:00+03:00",

  WEEK_DAYS: 15,
  weekPrices: [0.040, 0.060, 0.080, 0.100],

  POLYGON_CHAINID: "0x89",
  USDT: "0xC2132D05D31c914a87C6611C10748AEb04B58e8F", // Polygon USDT (6)
  TREASURY: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3",

  LS_LANG: "zuzu_lang",
  LS_REF_SELF: "zuzu_ref_self",
  LS_REF_COUNT: "zuzu_ref_count"
};

/* =========================
   i18n (TR+EN ana; diğerleri hazır)
========================= */
const I = {
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",
      hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",
      stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile kazan.",
      token_title:"Tokonomi (Görsel)",road_title:"Yol Haritası"},
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
      hero_lead:"Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high <b>utility</b>.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",
      stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>.",
      token_title:"Tokenomics (Visualized)",road_title:"Roadmap"}
};
const $  = (q, r=document)=>r.querySelector(q);
const $$ = (q, r=document)=>[...r.querySelectorAll(q)];

/* Lang */
function applyLang(lang){
  localStorage.setItem(CONFIG.LS_LANG, lang);
  $("#langCode").textContent = lang.toUpperCase();
  $("#langFlag").src = `flags/${lang}.png`;
  $$("[data-i]").forEach(el=>{
    const k=el.getAttribute("data-i"); if(I[lang]?.[k]) el.innerHTML = I[lang][k];
  });
}
(function initLang(){
  const saved = localStorage.getItem(CONFIG.LS_LANG) || "tr";
  applyLang(saved);
  const langBtn=$("#langBtn"), menu=$("#langMenu");
  langBtn.addEventListener("click",(e)=>{ e.stopPropagation(); menu.classList.toggle("show"); });
  $$(".lang-opt").forEach(b=>b.addEventListener("click",(e)=>{ e.stopPropagation(); applyLang(b.dataset.lang); menu.classList.remove("show"); }));
  document.addEventListener("click",(e)=>{ if(!menu.contains(e.target) && e.target!==langBtn) menu.classList.remove("show"); });
})();

/* ===== Countdown (sabit) ===== */
const LAUNCH = Date.parse(CONFIG.LAUNCH_ISO);
function tick(){
  const left = Math.max(0, LAUNCH - Date.now());
  const d=Math.floor(left/86400000);
  const h=Math.floor((left%86400000)/3600000);
  const m=Math.floor((left%3600000)/60000);
  const s=Math.floor((left%60000)/1000);
  const pad=n=>n.toString().padStart(2,"0");
  $("#cdDays").textContent=pad(d);
  $("#cdHours").textContent=pad(h);
  $("#cdMins").textContent=pad(m);
  $("#cdSecs").textContent=pad(s);
}
tick(); setInterval(tick,1000);

/* ===== Presale tarihleri (4×15 gün) ===== */
const START = LAUNCH - (60*24*3600*1000);
const W1_START = START;
const W2_START = W1_START + CONFIG.WEEK_DAYS*86400000;
const W3_START = W2_START + CONFIG.WEEK_DAYS*86400000;
const W4_START = W3_START + CONFIG.WEEK_DAYS*86400000;
const W_END    = LAUNCH;

function fmtRange(a,b){
  const A=new Date(a), B=new Date(b-86400000);
  const f=(d)=>d.toLocaleDateString('tr-TR',{day:'2-digit',month:'short'});
  return `${f(A)} — ${f(B)}`;
}
$("#w1d").textContent = fmtRange(W1_START, W2_START);
$("#w2d").textContent = fmtRange(W2_START, W3_START);
$("#w3d").textContent = fmtRange(W3_START, W4_START);
$("#w4d").textContent = fmtRange(W4_START, W_END);

function activeWeekIndex(now=Date.now()){
  if(now>=W1_START && now<W2_START) return 0;
  if(now>=W2_START && now<W3_START) return 1;
  if(now>=W3_START && now<W4_START) return 2;
  if(now>=W4_START && now<=W_END)   return 3;
  return -1;
}
function highlightWeek(){
  const idx = activeWeekIndex();
  ["wk1","wk2","wk3","wk4"].forEach((id,i)=>$("#"+id).classList.toggle("active", i===idx));
  $("#activeW").textContent = idx>=0?`W${idx+1}`:"—";
}
highlightWeek(); setInterval(highlightWeek,60000);

/* Maliyet */
function updateCost(){
  const qty = parseFloat(($("#buyAmount").value||"0").toString().replace(/[^\d.]/g,""))||0;
  const idx = Math.max(0, activeWeekIndex());
  const price = CONFIG.weekPrices[idx];
  $("#costUSDT").textContent = (qty*price).toLocaleString(undefined,{maximumFractionDigits:2});
}
$("#buyAmount").addEventListener("input", updateCost); updateCost();

/* ===== Invite & Earn (frontend demo) ===== */
(function referralsInit(){
  const url = new URL(location.href);
  const incoming = url.searchParams.get("ref");
  if(incoming){
    const key = `${CONFIG.LS_REF_COUNT}:${incoming}`;
    const prev = parseInt(localStorage.getItem(key)||"0",10);
    localStorage.setItem(key,String(prev+1));
  }
  // kendi kodu (adres yoksa random)
  let selfCode = localStorage.getItem(CONFIG.LS_REF_SELF);
  if(!selfCode){
    selfCode = (Math.random().toString(36).slice(2,8)+Date.now().toString(36).slice(-4)).toUpperCase();
    localStorage.setItem(CONFIG.LS_REF_SELF,selfCode);
  }
  $("#refLink").value = `${location.origin}${location.pathname}?ref=${selfCode}`;
  $("#copyRef").addEventListener("click", ()=>{ navigator.clipboard.writeText($("#refLink").value); alert("Kopyalandı"); });
  const myCount = parseInt(localStorage.getItem(`${CONFIG.LS_REF_COUNT}:${selfCode}`)||"0",10);
  $("#refCount").textContent = myCount;
  $("#refBonus").textContent = (myCount*250).toLocaleString();
})();

/* ===== NFT grid (10 adet) ===== */
(function renderNFTs(){
  const g=$("#nftGrid");
  g.innerHTML = Array.from({length:10}).map((_,i)=>`
    <div class="nft">
      <img src="assets/images/mask/${i}.png" alt="ZUZU #${i+1}" loading="lazy"
           onerror="this.style.display='none'">
      <div class="meta"><b>ZUZU #${i+1}</b><span class="tag">${i%5===0?'Legendary':(i%2?'Rare':'Epic')}</span></div>
    </div>`).join("");
})();

/* =========================
   Wallet (MetaMask / Polygon)
========================= */
let provider, signer, userAddress;

function hasMM(){ return typeof window.ethereum!=="undefined"; }
function dappDeepLink(){
  // mobilde MetaMask yoksa uygulama içinde siteyi aç
  const host = location.host; // zuzucoin.xyz
  return `https://metamask.app.link/dapp/${host}/`;
}

async function ensurePolygon(){
  const chainId = await provider.send("eth_chainId",[]);
  if(chainId !== CONFIG.POLYGON_CHAINID){
    try{
      await provider.send("wallet_switchEthereumChain",[ { chainId: CONFIG.POLYGON_CHAINID } ]);
    }catch(e){
      await provider.send("wallet_addEthereumChain",[{
        chainId: CONFIG.POLYGON_CHAINID,
        chainName: "Polygon Mainnet",
        rpcUrls: ["https://polygon-rpc.com"],
        nativeCurrency: { name:"MATIC", symbol:"MATIC", decimals:18 },
        blockExplorerUrls: ["https://polygonscan.com"]
      }]);
    }
  }
}

async function connectWallet(){
  if(!hasMM()){
    // otomatik MetaMask deep link
    location.href = dappDeepLink();
    return;
  }
  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts",[]);
  await ensurePolygon();
  signer = provider.getSigner();
  userAddress = await signer.getAddress();
  $("#connectBtn").textContent = `${userAddress.slice(0,6)}...${userAddress.slice(-4)}`;
  $("#disconnectBtn").style.display="inline-flex";

  // ref linki adresinle güncelle
  localStorage.setItem(CONFIG.LS_REF_SELF, userAddress);
  $("#refLink").value = `${location.origin}${location.pathname}?ref=${userAddress}`;
}
$("#connectBtn").addEventListener("click", connectWallet);
$("#disconnectBtn").addEventListener("click", ()=>{
  provider=null; signer=null; userAddress=null;
  $("#connectBtn").textContent = I[(localStorage.getItem(CONFIG.LS_LANG)||"tr")].connect || "Cüzdan Bağla";
  $("#disconnectBtn").style.display="none";
});

/* BUY */
async function buyNow(){
  const qty = parseFloat(($("#buyAmount").value||"0").toString().replace(/[^\d.]/g,""))||0;
  const pay = $("#payWith").value || "USDT";
  const idx = activeWeekIndex();
  if(idx<0){ alert("Presale henüz aktif değil."); return; }
  if(!qty || qty<=0){ alert("Geçerli miktar gir."); return; }
  if(!userAddress){ await connectWallet(); if(!userAddress) return; }

  const price = CONFIG.weekPrices[idx];
  const usdtCost = qty * price;

  await ensurePolygon();

  if(pay==="MATIC"){
    // basit dönüşüm varsayımı: 1 MATIC ≈ 0.5 USDT (backend yoksa)
    const valueWei = ethers.utils.parseEther((usdtCost/0.5).toFixed(6));
    const tx = await signer.sendTransaction({ to: CONFIG.TREASURY, value: valueWei });
    alert("MATIC gönderildi. TX: "+tx.hash);
  }else{
    // USDT transfer
    const usdtAbi = ["function transfer(address to,uint256 amount) returns (bool)","function decimals() view returns (uint8)"];
    const usdt = new ethers.Contract(CONFIG.USDT, usdtAbi, signer);
    const decimals = await usdt.decimals(); // 6
    const amt = ethers.utils.parseUnits(usdtCost.toFixed(decimals), decimals);
    const t = await usdt.transfer(CONFIG.TREASURY, amt);
    alert("USDT gönderildi. TX: "+t.hash);
  }
}
$("#buyNow").addEventListener("click", buyNow);
