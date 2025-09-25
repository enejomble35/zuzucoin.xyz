/* ======================= CONFIG ======================= */
const CONFIG = {
  // Hedef: 23 Nov 2025 10:00 UTC (global)
  COUNTDOWN_KEY: "zuzu_countdown_fixed",
  targetUTC: Date.UTC(2025, 10, 23, 10, 0, 0),

  PRICES: [0.040, 0.060, 0.080, 0.100],

  // Polygon Mainnet
  CHAIN: {
    chainId: "0x89",
    chainName: "Polygon Mainnet",
    rpcUrls: ["https://polygon-rpc.com","https://rpc.ankr.com/polygon"],
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    blockExplorerUrls: ["https://polygonscan.com"]
  },

  // SATIN ALMA
  SALE: {
    // wallet: MATIC/USDT doğrudan alıcı cüzdana gider (hemen çalışır)
    // contract: presale kontratı çağrılır (buyWithMatic / buyWithUSDT)
    mode: "wallet",
    recipient: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3",
    contract:  "0xfEe7dd881255EE85b7D6FeAF778e10988486AFc2",
  },

  // Resmi USDT (Polygon) adresi
  USDT: "0xC2132D05D31c914a87C6611C10748AaCB3fAaCb",

  // Opsiyonel: claim fonksiyonu bilgisi (kontratta varsa otomatik çağırır)
  CLAIM: {
    enabled: true,
    // claim() -> 0x4e71d92d keccak4 selector'u varsayılan değildir;
    // çoğu projede argsız "claim()" olur: aşağıdaki selector onu temsil eder.
    selector: "0x4e71d92d", // keccak("claim()").slice(0,10) örnek – farklıysa bildir, değiştiririz
    contract: "0xfEe7dd881255EE85b7D6FeAF778e10988486AFc2"
  },

  LS_LANG: "zuzu_lang",
  LS_ADDR: "zuzu_evm_addr"
};

const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent||"");
const $  = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];

/* ======================= i18n ======================= */
const I = {
  tr:{nav_about:"Hakkımızda",nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",nav_sim:"Stake Simulator ↗",nav_claim:"Claim Portal ↗",buy_cta:"Buy $ZUZU",connect:"Cüzdan Bağla",hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",buy_now:"Hemen Satın Al",pay_note:"Ödemeler MetaMask (Polygon) ile yapılır. Mobilde MetaMask dApp ile otomatik açılır.",exchanges:"Desteklenen Borsalar",ex_soon:"Yakında listelenecek",invite_title:"Davet Et & Kazan",invite_lead:"Her başarılı satın alım için davet edene <b>250 ZUZU</b> bonus verilir. Paylaş:",copy:"Kopyala",invite_note:"Not: Bonus dağıtımı backend doğrulaması ile yapılır.",stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile kazan.",nft_title:"ZUZU Maskot NFT Ödülleri 🎁",nft_lead:"Stake edenler koleksiyondan nadir NFT’ler kazanır.",token_title:"Tokonomi (Görsel)",token_supply:"Toplam Arz: 500,000,000 ZUZU",lg_comm:"Topluluk — %35",lg_liq:"Likidite — %20",lg_team:"Ekip (12 ay kilit) — %15",lg_tres:"Hazine — %10",lg_stake:"Staking Ödülleri — %15",lg_prtn:"Partnerler — %5",week1:"Hafta 1",week2:"Hafta 2",week3:"Hafta 3",week4:"Hafta 4",listing_note:"Borsa Listelemesi: 23 Nov 10:00 UTC",l_30:"30 gün kilit",l_90:"90 gün kilit",l_180:"180 gün kilit",l_early:"Erken çekiliş",tier_bronze:"Bronze",tier_silver:"Silver",tier_gold:"Gold",rm_phase0:"Hazırlık",rm_p0d:"Whitepaper v1, web v2, akıllı sözleşme geliştirme & güvenlik denetimi başlatma.",rm_phase1:"Ön Satış & Listeleme",rm_p1d:"Presale (4 faz), topluluk kampanyaları, 23 Nov 10:00 UTC ilk CEX listemesi, staking beta.",rm_phase2:"Ürün",rm_p2d:"NFT mint & ödüller, referral v2, ikinci CEX, DEX likidite artırımı.",rm_phase3:"Büyüme & Yönetişim",rm_p3d:"Mobil cüzdan entegrasyonları, partnerlikler, snapshot tabanlı yönetişim oylamaları."},
  en:{nav_about:"About",nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",nav_sim:"Stake Simulator ↗",nav_claim:"Claim Portal ↗",buy_cta:"Buy $ZUZU",connect:"Connect Wallet",hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",hero_lead:"Stake and win <b>ZUZU Mascot NFT</b>. Limited supply, high <b>utility</b>.",cta_stake:"Start Staking",cta_nft:"NFT Rewards",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",buy_now:"Buy Now",pay_note:"Payments via MetaMask (Polygon). On mobile, opens in MetaMask dApp.",exchanges:"Supported Exchanges",ex_soon:"Will Be Listed Soon",invite_title:"Invite & Earn",invite_lead:"Earn <b>250 ZUZU</b> per successful purchase via your link.",copy:"Copy",invite_note:"Note: Bonuses are confirmed via backend.",stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>.",nft_title:"ZUZU Mascot NFT Rewards 🎁",nft_lead:"Stakers win rare NFTs from the collection.",token_title:"Tokenomics (Visualized)",token_supply:"Total Supply: 500,000,000 ZUZU",lg_comm:"Community — 35%",lg_liq:"Liquidity — 20%",lg_team:"Team (12m lock) — 15%",lg_tres:"Treasury — 10%",lg_stake:"Staking Rewards — 15%",lg_prtn:"Partners — 5%",week1:"Week 1",week2:"Week 2",week3:"Week 3",week4:"Week 4",listing_note:"Exchange Listing: 23 Nov 10:00 UTC",rm_phase0:"Preparation",rm_p0d:"Whitepaper v1, website v2, contract dev & start audit.",rm_phase1:"Presale & Listing",rm_p1d:"4-phase presale, community campaigns, first CEX listing at 23 Nov 10:00 UTC, staking beta.",rm_phase2:"Product",rm_p2d:"NFT mint & rewards, referral v2, second CEX, deeper DEX liquidity.",rm_phase3:"Growth & Governance",rm_p3d:"Mobile wallet integrations, partnerships, snapshot-based governance votes."},
  fr:{nav_about:"À propos",nav_presale:"Pré-vente",nav_stake:"Stake",nav_nft:"Récompenses NFT",nav_roadmap:"Feuille de route",nav_token:"Tokenomics",buy_cta:"Buy $ZUZU",connect:"Connecter",days:"JOURS",hours:"HEURES",mins:"MINUTES",secs:"SECONDES",presale_title:"Pré-vente — Compte à rebours",presale_lead:"Allocation limitée.",buy_now:"Acheter",exchanges:"Bourses prises en charge",ex_soon:"Bientôt listé",listing_note:"Cotation : 23 Nov 10:00 UTC"},
  pt:{nav_about:"Sobre",nav_presale:"Pré-venda",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Roteiro",nav_token:"Tokenomics",connect:"Conectar",buy_now:"Comprar agora",exchanges:"Exchanges Suportadas",ex_soon:"Será listado em breve",listing_note:"Listagem: 23 Nov 10:00 UTC"},
  ru:{nav_about:"О нас",nav_presale:"Предпродажа",nav_stake:"Стейкинг",nav_nft:"NFT награды",nav_roadmap:"Дорожная карта",nav_token:"Токеномика",connect:"Подключить",buy_now:"Купить",exchanges:"Поддерживаемые биржи",ex_soon:"Скоро листинг",listing_note:"Листинг: 23 Nov 10:00 UTC"},
  es:{nav_about:"Acerca",nav_presale:"Pre-venta",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Hoja de ruta",nav_token:"Tokenomics",connect:"Conectar",buy_now:"Comprar ahora",exchanges:"Exchanges compatibles",ex_soon:"Próximamente",listing_note:"Listado: 23 Nov 10:00 UTC"}
};

/* dil uygula (stabil) */
function applyLang(lang){
  if(!I[lang]) lang = "tr";
  localStorage.setItem(CONFIG.LS_LANG, lang);
  document.documentElement.setAttribute("lang", lang);
  const setBtn = (idCode,idFlag)=>{ 
    $(idCode)?.replaceChildren(document.createTextNode(lang.toUpperCase()));
    $(idFlag)?.setAttribute("src", `flags/${lang}.png`);
  };
  setBtn("#langCode","#langFlag");
  setBtn("#langCode2","#langFlag2");

  $$("[data-i]").forEach(el=>{
    const k=el.getAttribute("data-i");
    const v = I[lang]?.[k];
    if(typeof v === "string") el.innerHTML = v;
  });
}
(function initLang(){
  const saved = localStorage.getItem(CONFIG.LS_LANG) || "tr";
  applyLang(saved);
  function wire(btnSel, menuSel){
    const btn=$(btnSel), menu=$(menuSel);
    btn?.addEventListener("click",(e)=>{
      e.preventDefault(); e.stopPropagation();
      // Diğer tüm menüleri kapat
      $$(".lang-menu").forEach(m=>m!==menu && m.classList.remove("show"));
      menu?.classList.toggle("show");
      btn.setAttribute("aria-expanded", menu?.classList.contains("show") ? "true":"false");
    });
    menu?.addEventListener("click",(e)=>{
      const b=e.target.closest(".lang-opt"); if(!b) return;
      applyLang(b.dataset.lang);
      menu.classList.remove("show");
      btn?.setAttribute("aria-expanded","false");
    });
  }
  wire("#langBtn","#langMenu"); 
  wire("#langBtn2","#langMenu2");

  document.addEventListener("click",()=> $$(".lang-menu").forEach(m=>m.classList.remove("show")));
})();

/* Drawer */
(function(){
  const d=$("#drawer"), open=$("#menuBtn"), close=$("#drawerClose");
  open?.addEventListener("click",()=>{ d?.classList.add("show"); d?.removeAttribute("hidden"); });
  close?.addEventListener("click",()=>d?.classList.remove("show"));
  d?.addEventListener("click",(e)=>{ if(e.target===d) d.classList.remove("show"); });
})();

/* Countdown */
function getTarget(){
  let ts = Number(localStorage.getItem(CONFIG.COUNTDOWN_KEY)||0);
  if(!ts){ ts = CONFIG.targetUTC; localStorage.setItem(CONFIG.COUNTDOWN_KEY, String(ts)); }
  return ts;
}
function tick(){
  const left = Math.max(0, getTarget() - Date.now());
  const d=Math.floor(left/86400000);
  const h=Math.floor((left%86400000)/3600000);
  const m=Math.floor((left%3600000)/60000);
  const s=Math.floor((left%60000)/1000);
  const pad=n=>n.toString().padStart(2,"0");
  $("#cdDays")?.replaceChildren(document.createTextNode(pad(d)));
  $("#cdHours")?.replaceChildren(document.createTextNode(pad(h)));
  $("#cdMins")?.replaceChildren(document.createTextNode(pad(m)));
  $("#cdSecs")?.replaceChildren(document.createTextNode(pad(s)));
}
tick(); setInterval(tick,1000);

/* NFT grid */
(function renderNFTs(){
  const g=$("#nftGrid"); if(!g) return;
  g.innerHTML = Array.from({length:10}).map((_,i)=>`
    <div class="nft">
      <img src="assets/images/mask/${i}.png" alt="ZUZU #${i+1}" loading="lazy"
           onerror="this.style.display='none'">
      <div class="meta"><b>ZUZU #${i+1}</b><span class="tag">${i%5===0?'Legendary':(i%2?'Rare':'Epic')}</span></div>
    </div>`).join("");
})();

/* Referans linki + paylaşım */
(function refLink(){
  const url = new URL(location.href);
  if(url.searchParams.get("ref")) localStorage.setItem("zuzu_refAddr", url.searchParams.get("ref"));
  const code = localStorage.getItem("zuzu_refAddr") || "YOURCODE";
  const out = $("#refLink");
  if(out){ out.value = `${location.origin}${location.pathname}?ref=${code}`; }
  $("#copyRef")?.addEventListener("click", ()=>{
    navigator.clipboard.writeText(out.value);
    const lang = localStorage.getItem(CONFIG.LS_LANG)||"tr";
    alert(I[lang]?.copy || "Copied");
  });
  $("#shareWA")?.setAttribute("href", `https://wa.me/?text=${encodeURIComponent("250 ZUZU bonus için davet linkim: "+(out?.value||""))}`);
  $("#shareTG")?.setAttribute("href", `https://t.me/share/url?url=${encodeURIComponent(out?.value||"")}&text=${encodeURIComponent("250 ZUZU bonus!")}`);
})();

/* Wallet (MetaMask + Polygon) */
let EVM_ADDR = localStorage.getItem(CONFIG.LS_ADDR) || null;
if(EVM_ADDR){ $("#btnConnect").textContent = `${EVM_ADDR.slice(0,6)}...${EVM_ADDR.slice(-4)}`; }

async function ensureMetamask(){
  if(window.ethereum) return true;
  if(IS_MOBILE){
    location.href = `https://metamask.app.link/dapp/${location.host}${location.pathname}`;
  }else{
    window.open("https://metamask.io/download/", "_blank");
  }
  alert("MetaMask bulunamadı. Yükleme/dApp sayfası açılıyor.");
  return false;
}
async function connect(){
  if(!(await ensureMetamask())) return;
  try{
    const chainId = await ethereum.request({ method:"eth_chainId" });
    if(chainId !== CONFIG.CHAIN.chainId){
      try{
        await ethereum.request({ method:"wallet_switchEthereumChain", params:[{ chainId: CONFIG.CHAIN.chainId }] });
      }catch(e){
        await ethereum.request({ method:"wallet_addEthereumChain", params:[CONFIG.CHAIN] });
      }
    }
    const accs = await ethereum.request({ method:"eth_requestAccounts" });
    EVM_ADDR = accs[0];
    localStorage.setItem(CONFIG.LS_ADDR,EVM_ADDR);
    $("#btnConnect").textContent = `${EVM_ADDR.slice(0,6)}...${EVM_ADDR.slice(-4)}`;
  }catch(e){
    console.error(e); alert("Cüzdan bağlantısı reddedildi veya başarısız.");
  }
}
$("#btnConnect")?.addEventListener("click", connect);

/* ======= Satın Alma ======= */
function pad32(hex){ return hex.replace(/^0x/,"").padStart(64,"0"); }
function addr(arg){ return pad32(arg.toLowerCase()); }
function uint(val){ return pad32("0x"+BigInt(val).toString(16)); }
function encodeTransfer(to, amount){ return "0xa9059cbb"+addr(to)+uint(amount); } // ERC20 transfer
function encodeApprove(spender, amount){ return "0x095ea7b3"+addr(spender)+uint(amount); } // approve

async function waitReceipt(txHash, timeoutMs=180000){
  const t0 = Date.now();
  while(Date.now()-t0 < timeoutMs){
    const rec = await ethereum.request({ method:"eth_getTransactionReceipt", params:[txHash] });
    if(rec && rec.blockNumber) return rec;
    await new Promise(r=>setTimeout(r, 3000));
  }
  throw new Error("İşlem zaman aşımı");
}

async function tryAutoClaim(){
  if(!CONFIG.CLAIM.enabled) return;
  try{
    const to = CONFIG.CLAIM.contract;
    if(!/^0x[a-fA-F0-9]{40}$/.test(to)) return;
    await ethereum.request({ 
      method:"eth_sendTransaction", 
      params:[{ from:EVM_ADDR, to, data: CONFIG.CLAIM.selector }] 
    });
    alert("Claim çağrısı gönderildi. Gerekirse Claim Portal’dan da talep edebilirsin.");
  }catch(e){
    console.warn("Claim çağrısı başarısız:", e?.message||e);
    // Sessiz geç; kullanıcıyı claim.html'e yönlendir
    setTimeout(()=>location.href="claim.html", 1200);
  }
}

async function buy(){
  if(!EVM_ADDR){ await connect(); if(!EVM_ADDR) return; }

  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  if(qty<=0){ alert("Geçerli miktar gir."); return; }

  const start = getTarget();
  const weekMs = 15*24*3600*1000;
  let idx = 0;
  if(Date.now() >= start){ idx = Math.min(3, Math.floor((Date.now()-start)/weekMs)); }
  const price = CONFIG.PRICES[idx];

  const pay = $("#payWith")?.value || "MATIC";
  const isAddr = a=>/^0x[a-fA-F0-9]{40}$/.test(a);

  try{
    let txHash;
    if(CONFIG.SALE.mode === "wallet" && isAddr(CONFIG.SALE.recipient)){
      if(pay === "MATIC"){
        const valueWei = "0x" + BigInt(Math.floor(qty * price * 1e18)).toString(16);
        txHash = await ethereum.request({
          method:"eth_sendTransaction",
          params:[{ from:EVM_ADDR, to:CONFIG.SALE.recipient, value:valueWei }]
        });
      }else{
        const amount = BigInt(Math.floor(qty * price * 1e6)); // USDT 6 decimals
        txHash = await ethereum.request({ method:"eth_sendTransaction", params:[{
          from:EVM_ADDR, to:CONFIG.USDT, data: encodeTransfer(CONFIG.SALE.recipient, amount)
        }]} );
      }
    }else if(CONFIG.SALE.mode === "contract" && isAddr(CONFIG.SALE.contract)){
      // Presale kontratı yolu — imzalar farklıysa haber ver, güncellerim
      if(pay === "MATIC"){
        const valueWei = "0x" + BigInt(Math.floor(qty * price * 1e18)).toString(16);
        // buyWithMatic() selector (örnek): 0x2b69f4b6 – farklıysa bildir
        txHash = await ethereum.request({
          method:"eth_sendTransaction",
          params:[{ from:EVM_ADDR, to:CONFIG.SALE.contract, value:valueWei, data:"0x2b69f4b6" }]
        });
      }else{
        const amount = BigInt(Math.floor(qty * price * 1e6));
        // approve
        await ethereum.request({ method:"eth_sendTransaction", params:[{
          from:EVM_ADDR, to:CONFIG.USDT, data: encodeApprove(CONFIG.SALE.contract, amount)
        }]} );
        // buyWithUSDT(address,uint256) selector örnek: 0x4ee2cd7e + args
        const data = "0x4ee2cd7e"+addr(CONFIG.USDT)+uint(amount);
        txHash = await ethereum.request({ method:"eth_sendTransaction", params:[{
          from:EVM_ADDR, to:CONFIG.SALE.contract, data
        }]} );
      }
    }else{
      alert("Satın alma yapılandırması eksik/hatalı. Lütfen sayfayı yenileyin.");
      return;
    }

    // Onay bekle + otomatik claim
    await waitReceipt(txHash);
    await tryAutoClaim();

    alert("Satın alma tamamlandı. İşlem: "+txHash);
  }catch(err){
    console.error(err);
    alert("İşlem reddedildi veya başarısız: " + (err?.message||""));
  }
}

$("#buyBtn")?.addEventListener("click", buy);

/* ticker nudge */
(function ensureTickerVisible(){
  const t=document.querySelector(".ticker__track"); if(!t) return;
  t.style.transform="translateX(0)"; setTimeout(()=>t.style.transform="", 60);
})();
