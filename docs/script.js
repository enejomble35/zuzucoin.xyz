/* ========= CONFIG ========= */
const CONFIG = {
  // DEVNET QuickNode RPC — senin verdiğin URL
  rpc: "https://silent-frequent-bird.solana-devnet.quiknode.pro/e0ed937fff5bf2985f977a6bdb352b9769d32af2/",
  cluster: "devnet",

  // Ödemeler bu hazine adresine
  treasury: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF",

  weekPrices: [0.0050, 0.0065, 0.0080, 0.0100],
  launchKey: "zuzu_launchAt",
  defaultCountdownDays: 60,

  LS_ADDR: "zuzu_connected_addr",
  LS_WALLET: "zuzu_connected_wallet",
  LS_LANG: "zuzu_lang"
};

/* ========= helpers ========= */
const $  = (q, r=document)=>r.querySelector(q);
const $$ = (q, r=document)=>[...r.querySelectorAll(q)];
const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

/* ========= Lang ========= */
const I = {
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
      hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",
      amount:"Miktar (ZUZU)",cost:"Maliyet:",buy:"Satın Al",exchanges:"Desteklenen Borsalar",
      stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile kazan.",
      token_title:"Tokonomi (Görsel)",road_title:"Yol Haritası"},
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
      hero_lead:"Stake and win <b>ZUZU Mascot NFT</b>.",cta_stake:"Start Staking",cta_nft:"NFT Rewards",
      days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>.",
      amount:"Amount (ZUZU)",cost:"Cost:",buy:"Buy",exchanges:"Supported Exchanges"}
};
function applyLang(lang){
  localStorage.setItem(CONFIG.LS_LANG, lang);
  $("#langFlag").src = `flags/${lang}.png`;
  $("#langCode").textContent = lang.toUpperCase();
  $$("[data-i]").forEach(el=>{
    const k=el.getAttribute("data-i");
    if(I[lang]?.[k]) el.innerHTML = I[lang][k];
  });
}
(function initLang(){
  const saved = localStorage.getItem(CONFIG.LS_LANG) || "tr";
  applyLang(saved);
  const btn=$("#langBtn"), menu=$("#langMenu");
  btn?.addEventListener("click",(e)=>{e.stopPropagation();menu.classList.toggle("show");});
  $$(".lang-opt").forEach(b=>b.addEventListener("click",(e)=>{e.stopPropagation();applyLang(b.dataset.lang);menu.classList.remove("show");}));
  document.addEventListener("click",(e)=>{ if(menu && !menu.contains(e.target) && e.target!==btn) menu.classList.remove("show"); });
})();

/* ========= Countdown ========= */
function getLaunchAt(){
  let ts = localStorage.getItem(CONFIG.launchKey);
  if(!ts){ ts = (Date.now() + CONFIG.defaultCountdownDays*24*3600*1000).toString(); localStorage.setItem(CONFIG.launchKey, ts); }
  return parseInt(ts,10);
}
function tick(){
  const left = Math.max(0, getLaunchAt() - Date.now());
  const d=Math.floor(left/86400000);
  const h=Math.floor((left%86400000)/3600000);
  const m=Math.floor((left%3600000)/60000);
  const s=Math.floor((left%60000)/1000);
  const pad=n=>n.toString().padStart(2,"0");
  $("#cdDays").textContent=pad(d); $("#cdHours").textContent=pad(h);
  $("#cdMins").textContent=pad(m); $("#cdSecs").textContent=pad(s);
}
tick(); setInterval(tick,1000);

/* ========= Price boxes ========= */
function updateCosts(){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  [0,1,2,3].forEach(i=>{
    const p = CONFIG.weekPrices[i];
    $("#p"+i).textContent = p.toFixed(4);
    $("#c"+i).textContent = (qty*p).toLocaleString(undefined,{maximumFractionDigits:2});
  });
}
$("#buyAmount")?.addEventListener("input", updateCosts); updateCosts();

/* ========= NFT grid ========= */
(function renderNFTs(){
  const g=$("#nftGrid"); if(!g) return;
  g.innerHTML = Array.from({length:10}).map((_,i)=>`
    <div class="nft">
      <img src="assets/images/mask/${i}.png?v=1" alt="ZUZU #${i+1}" loading="lazy"
           onerror="this.style.display='none'">
      <div class="meta"><b>ZUZU #${i+1}</b><span class="tag">${i%5===0?'Legendary':(i%2?'Rare':'Epic')}</span></div>
    </div>`).join("");
})();

/* ========= Wallets ========= */
const Wallets = {
  phantom:{
    key:'phantom', label:'Phantom', icon:'assets/images/wallets/phantom.png',
    has:()=>!!(window.phantom?.solana?.isPhantom || window.solana?.isPhantom || window.solana?.isPhantomApp),
    provider:()=>window.phantom?.solana || window.solana
  },
  solflare:{
    key:'solflare', label:'Solflare', icon:'assets/images/wallets/solflare.png',
    has:()=>!!(window.solflare?.isSolflare || typeof window.solflare?.connect==="function"),
    provider:()=>window.solflare
  }
};
let CURRENT_ADDRESS=null, CURRENT_WALLET=null;
function walletListHTML(){
  return Object.values(Wallets).map(w=>`
    <button class="wbtn" data-key="${w.key}">
      <img src="${w.icon}" alt="${w.label}" width="22" height="22">
      <span>${w.label}</span>
    </button>`).join("");
}
(function initWalletUI(){
  const modal=$("#walletModal"), list=$("#wlist");
  if(list) list.innerHTML = walletListHTML();

  function bindButtons(){
    [$("#connectBtn"), ...$$("[data-connect]")].filter(Boolean).forEach(btn=>{
      if(btn.dataset._bind) return; btn.dataset._bind="1";
      btn.addEventListener("click", ()=>{
        const direct = Wallets.phantom.has()?Wallets.phantom:(Wallets.solflare.has()?Wallets.solflare:null);
        if(direct) connectFlow(direct.key); else modal?.classList.add("show");
      });
    });
  }
  bindButtons();
  list?.addEventListener("click", e=>{
    const b=e.target.closest(".wbtn"); if(!b) return; connectFlow(b.dataset.key);
  });
  $("#wmClose")?.addEventListener("click", ()=>modal?.classList.remove("show"));
  modal?.addEventListener("click",(e)=>{ if(e.target===modal) modal.classList.remove("show"); });

  const savedAddr=localStorage.getItem(CONFIG.LS_ADDR);
  const savedWal =localStorage.getItem(CONFIG.LS_WALLET);
  if(savedAddr&&savedWal) onConnected(savedWal,savedAddr,{silent:true});
})();

async function connectFlow(key){
  const impl=Wallets[key]; if(!impl) return;
  try{
    const p=impl.provider(); if(!p){ alert(`${impl.label} eklentisi bulunamadı.`); return; }
    try{ await p.connect({onlyIfTrusted:true}); }catch(_){}
    const res = await p.connect();
    const pk = (res?.publicKey || p.publicKey).toString();
    onConnected(key, pk);
  }catch(e){ console.warn(e); alert("Bağlantı iptal / başarısız."); }
}

function onConnected(key, addr, opts={}){
  CURRENT_WALLET=key; CURRENT_ADDRESS=addr;
  localStorage.setItem(CONFIG.LS_WALLET,key);
  localStorage.setItem(CONFIG.LS_ADDR,addr);
  [$("#connectBtn"), ...$$("[data-connect]")].forEach(b=>{ if(b) b.textContent = `${addr.slice(0,6)}...${addr.slice(-4)}`; });
  const out=$("#refLink"); if(out) out.value=`${location.origin}${location.pathname}?ref=${addr}`;
  if(!opts.silent) console.log("Connected", key, addr);
}

/* ========= BUY – direct sign (site içi) ========= */
const LAMPORTS_PER_SOL = 1_000_000_000;
function activeWeek(){ return 0; }

["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
  $("#"+id)?.addEventListener("click", ()=>buyDirect(i));
});
["buyW0Pay","buyW1Pay","buyW2Pay","buyW3Pay"].forEach((id,i)=>{
  $("#"+id)?.addEventListener("click", ()=>buyViaSolanaPay(i));
});

async function buyDirect(weekIdx){
  if(!CURRENT_ADDRESS){ alert("Önce cüzdan bağla."); return; }
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  if(qty<=0){ alert("Geçerli miktar gir."); return; }

  // basit kur: USDT≈1$, SOL≈100$ varsayımı → 0.01 SOL
  const priceUSDT = CONFIG.weekPrices[weekIdx];
  const usdtCost = qty * priceUSDT;
  const solAmount = +(usdtCost * 0.01).toFixed(4);

  try{
    const connection = new solanaWeb3.Connection(CONFIG.rpc, "confirmed");
    const from = new solanaWeb3.PublicKey(CURRENT_ADDRESS);
    const to   = new solanaWeb3.PublicKey(CONFIG.treasury);

    const tx = new solanaWeb3.Transaction();
    tx.add(solanaWeb3.SystemProgram.transfer({
      fromPubkey: from,
      toPubkey: to,
      lamports: BigInt(Math.floor(solAmount * LAMPORTS_PER_SOL))
    }));

    const {blockhash, lastValidBlockHeight} = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = from;

    const provider = Wallets[CURRENT_WALLET].provider();
    const signed = await provider.signTransaction(tx);
    const sig = await connection.sendRawTransaction(signed.serialize(), {skipPreflight:false});
    await connection.confirmTransaction({signature:sig, blockhash, lastValidBlockHeight}, "confirmed");

    alert("Ödeme gönderildi.\nTx: "+sig);
    // istersen local receipt tut
    try{
      const key="zuzu_claim_rcpts"; const ls=JSON.parse(localStorage.getItem(key)||"[]");
      ls.push({amount:usdtCost, tx:sig, note:`Week ${weekIdx+1}`, t:Date.now()});
      localStorage.setItem(key, JSON.stringify(ls));
    }catch{}
  }catch(e){
    console.error(e);
    alert("İşlem iptal/başarısız: "+(e?.message||e));
  }
}

/* ========= BUY – Solana Pay (backend tx request) ========= */
function buyViaSolanaPay(weekIdx){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  if(qty<=0){ alert("Geçerli miktar gir."); return; }
  const priceUSDT = CONFIG.weekPrices[weekIdx];
  const usdtCost = qty * priceUSDT;
  const solAmount = +(usdtCost * 0.01).toFixed(4);

  // Backend endpoint'in URL'i:
  const api = `/api/tx?amount=${encodeURIComponent(solAmount)}&label=${encodeURIComponent('ZUZU Presale')}&message=${encodeURIComponent('ZUZU presale payment')}`;

  // Solana Pay "transactions request" linki:
  const link = `solana:${location.origin}${api}`;

  // mobilde cüzdanı açar; desktop'ta kopyalanabilir
  location.href = link;
}

/* ========= small polish ========= */
(function ensureTickerVisible(){
  const t=$("#exTrack"); if(!t) return;
  t.style.transform="translateX(0)"; setTimeout(()=>t.style.transform="", 60);
})();
