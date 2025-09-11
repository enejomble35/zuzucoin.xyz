/* =========================
   CONFIG
========================= */
const CONFIG = {
  // Countdown (persist)
  launchKey: "zuzu_launchAt",
  // 60 gün (5184000000 ms) -> bugünden 60 gün sonrası
  defaultLaunchISO: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),

  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100], // USDT
  nfts: Array.from({ length: 10 }).map((_, i) => ({
    id: i, name: `ZUZU #${i + 1}`, rarity: i % 5 === 0 ? 'Legendary' : (i % 2 ? 'Rare' : 'Epic')
  })),

  // Solana config
  cluster: "mainnet",
  treasury: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF", // ✅ senin gerçek hazine adresin
  // Ref / session keys
  LS_ADDR: "zuzu_connected_addr",
  LS_WALLET: "zuzu_connected_wallet",
  LS_LANG: "zuzu_lang"
};

/* =========================
   i18n (EN/TR/FR/PT/RU/ES)
========================= */
const I = {
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
      hero_lead:"Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high <b>utility</b>.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",
      amount:"Amount (ZUZU)",cost:"Cost:",buy:"Buy",exchanges:"Supported Exchanges",
      stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>.",
      token_title:"Tokenomics (Visualized)",road_title:"Roadmap"},
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",
      hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",
      amount:"Miktar (ZUZU)",cost:"Maliyet:",buy:"Satın Al",exchanges:"Desteklenen Borsalar",
      stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile kazan.",
      token_title:"Tokonomi (Görsel)",road_title:"Yol Haritası"}
};

/* =============== tiny dom helpers =============== */
const $ = (q, root=document) => root.querySelector(q);
const $$= (q, root=document) => [...root.querySelectorAll(q)];

/* =============== Lang UI =============== */
function applyLang(lang){
  localStorage.setItem(CONFIG.LS_LANG, lang);
  $("#langCode")?.textContent = lang.toUpperCase();
  $("#langFlag")?.setAttribute("src", `flags/${lang}.png`);
  document.querySelectorAll("[data-i]").forEach(el=>{
    const k=el.getAttribute("data-i");
    if(I[lang] && I[lang][k]) el.innerHTML=I[lang][k];
  });
}
(function initLang(){
  const saved = localStorage.getItem(CONFIG.LS_LANG) || "en";
  applyLang(saved);
  const langBtn  = $("#langBtn"), langMenu=$("#langMenu");
  if(langBtn && langMenu){
    langBtn.addEventListener("click", ()=>langMenu.classList.toggle("show"));
    $$(".lang-opt").forEach(b=>b.addEventListener("click", ()=>{
      applyLang(b.dataset.lang); langMenu.classList.remove("show");
    }));
    document.addEventListener("click", (e)=>{
      if(!langMenu.contains(e.target) && e.target!==langBtn) langMenu.classList.remove("show");
    });
  }
})();

/* =============== Countdown (60 gün) =============== */
function getLaunchAt(){
  let ts = localStorage.getItem(CONFIG.launchKey);
  if(!ts){
    ts = new Date(CONFIG.defaultLaunchISO).getTime().toString();
    localStorage.setItem(CONFIG.launchKey, ts);
  }
  return parseInt(ts,10);
}
function tick(){
  const left = Math.max(0, getLaunchAt() - Date.now());
  const d=Math.floor(left/86400000);
  const h=Math.floor((left%86400000)/3600000);
  const m=Math.floor((left%3600000)/60000);
  const s=Math.floor((left%60000)/1000);
  const pad=n=>n.toString().padStart(2,"0");
  $("#cdDays")?.textContent=pad(d);
  $("#cdHours")?.textContent=pad(h);
  $("#cdMins")?.textContent=pad(m);
  $("#cdSecs")?.textContent=pad(s);
}
tick(); setInterval(tick,1000);

/* =============== Presale fiyat / maliyet =============== */
function updateCosts(){
  const inp = $("#buyAmount");
  const qty = parseFloat((inp?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  CONFIG.weekPrices.forEach((p,i)=>{
    $("#p"+i)?.textContent = p.toFixed(4);
    $("#c"+i)?.textContent = (qty*p).toLocaleString(undefined,{maximumFractionDigits:2});
  });
}
$("#buyAmount")?.addEventListener("input", updateCosts);
updateCosts();

/* =============== NFT grid =============== */
(function renderNFTs(){
  const g=$("#nftGrid"); if(!g) return;
  g.innerHTML = CONFIG.nfts.map(n=>`
    <div class="nft">
      <img src="assets/images/mask/${n.id}.png" alt="${n.name}" loading="lazy"
           onerror="this.style.display='none'">
      <div class="meta"><b>${n.name}</b><span class="tag">${n.rarity}</span></div>
    </div>`).join("");
})();

/* =============== Invite link =============== */
(function refLink(){
  const url = new URL(location.href);
  if(url.searchParams.get("ref")) localStorage.setItem("zuzu_refAddr", url.searchParams.get("ref"));
  const addr = localStorage.getItem("zuzu_refAddr") || "";
  const out = $("#refLink"); const copyBtn = $("#copyRef");
  if(out){ out.value = `${location.origin}${location.pathname}?ref=${addr||"YOURCODE"}`; }
  copyBtn?.addEventListener("click", ()=>{ navigator.clipboard.writeText(out.value); alert("Copied!"); });
})();

/* =========================
   Wallet Connect (Phantom / Solflare / Backpack)
========================= */
const Wallets = {
  phantom:{
    key:'phantom', label:'Phantom', icon:'assets/images/wallets/phantom.png',
    has:()=>!!(window.solana && (window.solana.isPhantom || window.solana.isPhantomApp)),
    connect:async()=>{ const p=window.solana; const r=await p.connect({ onlyIfTrusted:false }); return (r?.publicKey||p.publicKey).toString(); },
    disconnect:async()=>{ try{ await window.solana.disconnect?.(); }catch{} },
    deeplink:(url)=>`https://phantom.app/ul/browse/${encodeURIComponent(url)}?network=${encodeURIComponent(CONFIG.cluster)}`
  },
  solflare:{
    key:'solflare', label:'Solflare', icon:'assets/images/wallets/solflare.png',
    has:()=>!!(window.solflare && (window.solflare.isSolflare || typeof window.solflare.connect==="function")),
    connect:async()=>{ const p=window.solflare; const r=await p.connect(); return (r?.publicKey||p.publicKey).toString(); },
    disconnect:async()=>{ try{ await window.solflare.disconnect?.(); }catch{} },
    deeplink:(url)=>`https://solflare.com/ul/v1/browse/${encodeURIComponent(url)}?network=${encodeURIComponent(CONFIG.cluster)}`
  },
  backpack:{
    key:'backpack', label:'Backpack', icon:'assets/images/wallets/backpack.png',
    has:()=>!!(window.backpack?.solana?.isBackpack || window.backpack?.isBackpack),
    connect:async()=>{ const p=window.backpack?.solana || window.backpack; const r=await p.connect(); return (r?.publicKey||p.publicKey).toString(); },
    disconnect:async()=>{ try{ await (window.backpack?.solana||window.backpack)?.disconnect?.(); }catch{} },
    deeplink:(url)=>`https://backpack.app/ul/browse/${encodeURIComponent(url)}?network=${encodeURIComponent(CONFIG.cluster)}`
  }
};

let CURRENT_ADDRESS = null;
let CURRENT_WALLET  = null;

function walletListHTML(){
  return Object.values(Wallets).map(w=>`
    <button class="wbtn" data-key="${w.key}">
      <img src="${w.icon}" alt="${w.label}" onerror="this.onerror=null;this.src='assets/images/wallets/${w.key}.svg'"><span>${w.label}</span>
    </button>`).join("");
}

(function initWalletModal(){
  const modal = $("#walletModal"), list = $("#wlist"), btnConnect = $("#connectBtn"), btnClose = $("#wmClose");
  if(!modal || !list || !btnConnect) return;
  list.innerHTML = walletListHTML();

  btnConnect.addEventListener("click", ()=>{
    const direct = Wallets.phantom.has() ? Wallets.phantom :
                   (Wallets.solflare.has() ? Wallets.solflare :
                   (Wallets.backpack.has() ? Wallets.backpack : null));
    if(direct){ connectFlow(direct.key); } else { modal.classList.add("show"); }
  });
  btnClose?.addEventListener("click", ()=>modal.classList.remove("show"));
  list.addEventListener("click", e=>{
    const btn=e.target.closest(".wbtn"); if(!btn) return;
    connectFlow(btn.dataset.key);
  });
})();

async function connectFlow(key){
  const impl = Wallets[key]; if(!impl) return;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if(!impl.has() && isMobile){ window.open(impl.deeplink(location.href), "_blank"); return; }
  try{
    const addr = await impl.connect();
    CURRENT_ADDRESS = addr; CURRENT_WALLET = key;
    localStorage.setItem(CONFIG.LS_ADDR, addr);
    localStorage.setItem(CONFIG.LS_WALLET, key);
    $("#connectBtn").textContent = `${addr.slice(0,6)}...${addr.slice(-4)}`;
    $("#walletModal").classList.remove("show");
    $("#refLink")?.setAttribute("value", `${location.origin}${location.pathname}?ref=${addr}`);
  }catch(e){ alert("Wallet connection rejected or failed."); }
}

/* =============== Satın alma =============== */
function activeWeek(){ return 0; }

["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
  $("#"+id)?.addEventListener("click", ()=>handleBuy(i));
});

function handleBuy(weekIdx){
  const qty = parseFloat(($("#buyAmount")?.value||"0").replace(/[^\d.]/g,""))||0;
  if(qty<=0){ alert("Geçerli miktar gir."); return; }
  if(weekIdx!==activeWeek()){ alert("Bu hafta aktif değil."); return; }
  if(!CURRENT_ADDRESS){ alert("Önce cüzdan bağla."); return; }

  const usdtCost = qty * CONFIG.weekPrices[weekIdx];
  const payWith = $("#payWith").value;

  if(payWith==="SOL"){
    const solAmount = (usdtCost * 0.01).toFixed(4); // örnek dönüşüm
    const deeplink = `https://phantom.app/ul/transfer?recipient=${encodeURIComponent(CONFIG.treasury)}&amount=${solAmount}&reference=${encodeURIComponent(CURRENT_ADDRESS)}&network=${encodeURIComponent(CONFIG.cluster)}`;
    window.open(deeplink, "_blank");
    alert(`Phantom açılacak (~${solAmount} SOL). Gerçek kur entegrasyonu eklenecek.`);
  }else{
    alert("USDT (Solana) transferi için SPL-Token işlem entegrasyonu eklenecek.");
  }
}

/* =============== küçük dokunuşlar =============== */
(function ensureTickerVisible(){
  const t=$("#exTrack"); if(t){ t.style.transform="translateX(0)"; setTimeout(()=>t.style.transform="", 60); }
})();
