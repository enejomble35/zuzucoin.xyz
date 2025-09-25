/* ======================= CONFIG ======================= */
const CONFIG = {
  // Global countdown: 23 Nov 2025 10:00 UTC
  COUNTDOWN_KEY: "zuzu_countdown_fixed",
  targetUTC: Date.UTC(2025, 10, 23, 10, 0, 0),

  // Week prices (W1..W4)
  PRICES: [0.040, 0.060, 0.080, 0.100],

  // Polygon Mainnet
  CHAIN: {
    chainId: "0x89",
    chainName: "Polygon Mainnet",
    rpcUrls: ["https://polygon-rpc.com","https://rpc.ankr.com/polygon"],
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    blockExplorerUrls: ["https://polygonscan.com"]
  },

  // Satınalma modu
  SALE: {
    mode: "wallet", // "wallet" (doğrudan cüzdana gönder) | "contract" (presale kontratına çağrı)
    recipient: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3", // MATIC/USDT toplanacak cüzdan
    contract:  "0xfEe7dd881255EE85b7D6FeAF778e10988486AFc2" // presale/claim kontratı (varsa)
  },

  // Opsiyonel otomatik claim: kontrat selector'unuz varsa açın
  CLAIM: {
    enabled: false,                  // kontrat üstünden claim çağırmak için true yapın
    contract: "0xfEe7dd881255EE85b7D6FeAF778e10988486AFc2",
    selector_claim: "",              // ör: "0x12345678" (claim())
    selector_claim_for: ""           // ör: "0x90abcdef" (claim(address))
  },

  // EIP-712/191 imza + backend bildirimi için opsiyonel webhook
  WEBHOOK: "", // ör: "https://api.sizin-domain.com/zuzu/purchase"

  // Resmi Polygon USDT
  USDT: "0xC2132D05D31c914a87C6611C10748AaCB3fAaCb",

  MIN_ZUZU: 500,

  LS_LANG: "zuzu_lang",
  LS_ADDR: "zuzu_evm_addr",
  LS_REF:  "zuzu_refAddr"
};

const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent||"");
const $  = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];

/* ======================= UTILS ======================= */
function scanLink(tx){ return `${CONFIG.CHAIN.blockExplorerUrls[0]}/tx/${tx}`; }
function showToast({title, msg, ok=false, link=null}){
  const wrap = $("#toasts") || (()=>{ const d=document.createElement("div"); d.id="toasts"; d.className="toasts"; document.body.appendChild(d); return d; })();
  const el = document.createElement("div");
  el.className = "toast " + (ok?"ok":"err");
  el.innerHTML = `<span class="ticon">${ok?"✅":"⚠️"}</span><b>${title}</b><div>${msg}${link?`<br><a href="${link}" target="_blank" rel="noopener">Polygonscan</a>`:""}</div>`;
  wrap.appendChild(el);
  setTimeout(()=>{ el.style.opacity="0"; el.style.transform="translateY(6px)"; setTimeout(()=>el.remove(),350); }, 7000);
}
function parseAmount(x){ return parseFloat((x||"0").toString().replace(/[^\d.]/g,""))||0; }
function pad32(hex){ return hex.replace(/^0x/,"").padStart(64,"0"); }
function addr(arg){ return pad32(arg.toLowerCase()); }
function uint(val){ return pad32("0x"+BigInt(val).toString(16)); }
// ERC20 transfer(address,uint256)
function encodeTransfer(to, amount){ return "0xa9059cbb"+addr(to)+uint(amount); }
// ERC20 approve(address,uint256)
function encodeApprove(spender, amount){ return "0x095ea7b3"+addr(spender)+uint(amount); }

/* ======================= i18n ======================= */
const I = {
  tr:{nav_about:"Hakkımızda",nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",nav_sim:"Stake Simulator ↗",nav_claim:"Claim Portal ↗",buy_cta:"Buy $ZUZU",connect:"Cüzdan Bağla",hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",buy_now:"Hemen Satın Al",pay_note:"Ödemeler MetaMask (Polygon) ile yapılır. Mobilde MetaMask dApp ile otomatik açılır.",exchanges:"Desteklenen Borsalar",ex_soon:"Yakında listelenecek",invite_title:"Davet Et & Kazan",invite_lead:"Her başarılı satın alım için davet edene <b>250 ZUZU</b> bonus verilir. Paylaş:",copy:"Kopyala",invite_note:"Not: Bonus dağıtımı backend doğrulaması ile yapılır.",stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile kazan.",nft_title:"ZUZU Maskot NFT Ödülleri 🎁",nft_lead:"Stake edenler koleksiyondan nadir NFT’ler kazanır.",token_title:"Tokonomi (Görsel)",token_supply:"Toplam Arz: 500,000,000 ZUZU",lg_comm:"Topluluk — %35",lg_liq:"Likidite — %20",lg_team:"Ekip (12 ay kilit) — %15",lg_tres:"Hazine — %10",lg_stake:"Staking Ödülleri — %15",lg_prtn:"Partnerler — %5",week1:"Hafta 1",week2:"Hafta 2",week3:"Hafta 3",week4:"Hafta 4",listing_note:"Borsa Listelemesi: 23 Nov 10:00 UTC",l_30:"30 gün kilit",l_90:"90 gün kilit",l_180:"180 gün kilit",l_early:"Erken çekiliş",tier_bronze:"Bronze",tier_silver:"Silver",tier_gold:"Gold",rm_phase0:"Hazırlık",rm_p0d:"Whitepaper v1, web v2, akıllı sözleşme geliştirme & güvenlik denetimi başlatma.",rm_phase1:"Ön Satış & Listeleme",rm_p1d:"Presale (4 faz), topluluk kampanyaları, 23 Nov 10:00 UTC ilk CEX listemesi, staking beta.",rm_phase2:"Ürün",rm_p2d:"NFT mint & ödüller, referral v2, ikinci CEX, DEX likidite artırımı.",rm_phase3:"Büyüme & Yönetişim",rm_p3d:"Mobil cüzdan entegrasyonları, partnerlikler, snapshot tabanlı yönetişim oylamaları."},
  en:{nav_about:"About",nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",nav_sim:"Stake Simulator ↗",nav_claim:"Claim Portal ↗",buy_cta:"Buy $ZUZU",connect:"Connect Wallet",hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",hero_lead:"Stake and win <b>ZUZU Mascot NFT</b>. Limited supply, high <b>utility</b>.",cta_stake:"Start Staking",cta_nft:"NFT Rewards",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",buy_now:"Buy Now",pay_note:"Payments via MetaMask (Polygon). On mobile, opens in MetaMask dApp.",exchanges:"Supported Exchanges",ex_soon:"Will Be Listed Soon",invite_title:"Invite & Earn",invite_lead:"Earn <b>250 ZUZU</b> per successful purchase via your link.",copy:"Copy",invite_note:"Note: Bonuses are confirmed via backend.",stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>.",nft_title:"ZUZU Mascot NFT Rewards 🎁",nft_lead:"Stakers win rare NFTs from the collection.",token_title:"Tokenomics (Visualized)",token_supply:"Total Supply: 500,000,000 ZUZU",lg_comm:"Community — 35%",lg_liq:"Liquidity — 20%",lg_team:"Team (12m lock) — 15%",lg_tres:"Treasury — 10%",lg_stake:"Staking Rewards — 15%",lg_prtn:"Partners — 5%",week1:"Week 1",week2:"Week 2",week3:"Week 3",week4:"Week 4",listing_note:"Exchange Listing: 23 Nov 10:00 UTC",rm_phase0:"Preparation",rm_p0d:"Whitepaper v1, website v2, contract dev & start audit.",rm_phase1:"Presale & Listing",rm_p1d:"4-phase presale, community campaigns, first CEX listing at 23 Nov 10:00 UTC, staking beta.",rm_phase2:"Product",rm_p2d:"NFT mint & rewards, referral v2, second CEX, deeper DEX liquidity.",rm_phase3:"Growth & Governance",rm_p3d:"Mobile wallet integrations, partnerships, snapshot-based governance votes."},
  fr:{connect:"Connecter",buy_now:"Acheter",ex_soon:"Bientôt listé"}
};

function applyLang(lang){
  localStorage.setItem(CONFIG.LS_LANG, lang);
  document.documentElement.setAttribute("lang", lang);
  $("#langCode")?.replaceChildren(document.createTextNode(lang.toUpperCase()));
  $("#langFlag")?.setAttribute("src", `flags/${lang}.png`);
  $("#langCode2")?.replaceChildren(document.createTextNode(lang.toUpperCase()));
  $("#langFlag2")?.setAttribute("src", `flags/${lang}.png`);
  $$("[data-i]").forEach(el=>{
    const k=el.getAttribute("data-i");
    if(I[lang]?.[k]) el.innerHTML = I[lang][k];
  });
}
(function initLang(){
  const saved = localStorage.getItem(CONFIG.LS_LANG) || "tr";
  applyLang(saved);
  function wire(btnId, menuId){
    const btn=$(btnId), menu=$(menuId);
    btn?.addEventListener("click",(e)=>{
      e.stopPropagation(); menu?.classList.toggle("show");
      btn.setAttribute("aria-expanded", menu?.classList.contains("show") ? "true":"false");
    });
    menu?.addEventListener("click",(e)=>{
      const b=e.target.closest(".lang-opt"); if(!b) return;
      applyLang(b.dataset.lang); menu.classList.remove("show");
      btn?.setAttribute("aria-expanded","false");
    });
    document.addEventListener("click",(e)=>{
      if(!menu?.contains(e.target) && e.target!==btn) menu?.classList.remove("show");
    });
  }
  wire("#langBtn","#langMenu"); wire("#langBtn2","#langMenu2");
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

/* Referral: URL ?ref=... yakala */
(function refLink(){
  const url = new URL(location.href);
  if(url.searchParams.get("ref")) localStorage.setItem(CONFIG.LS_REF, url.searchParams.get("ref"));
  const code = localStorage.getItem(CONFIG.LS_REF) || "YOURCODE";
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

/* ============ SATIN ALMA (MATIC & USDT) ============ */
function currentPrice(){
  const start = getTarget();
  const weekMs = 15*24*3600*1000;
  let idx = 0;
  if(Date.now() >= start){ idx = Math.min(3, Math.floor((Date.now()-start)/weekMs)); }
  return {idx, price: CONFIG.PRICES[idx]};
}

async function buy(){
  if(!EVM_ADDR){ await connect(); if(!EVM_ADDR) return; }

  const qty = parseAmount($("#buyAmount")?.value);
  if(qty < CONFIG.MIN_ZUZU){
    showToast({title:"Minimum tutar", msg:`En az ${CONFIG.MIN_ZUZU} ZUZU satın alınabilir.`, ok:false});
    return;
  }

  const {idx, price} = currentPrice();
  const pay = $("#payWith")?.value || "MATIC";

  try{
    let txHash;
    if(CONFIG.SALE.mode === "wallet" && CONFIG.SALE.recipient.startsWith("0x")){
      if(pay === "MATIC"){
        const valueWei = "0x" + BigInt(Math.floor(qty * price * 1e18)).toString(16);
        txHash = await ethereum.request({
          method:"eth_sendTransaction",
          params:[{ from:EVM_ADDR, to:CONFIG.SALE.recipient, value:valueWei }]
        });
      }else{
        // USDT transfer to recipient
        const amount = BigInt(Math.floor(qty * price * 1e6)); // USDT 6 decimals
        txHash = await ethereum.request({ method:"eth_sendTransaction", params:[{
          from:EVM_ADDR, to:CONFIG.USDT, data: encodeTransfer(CONFIG.SALE.recipient, amount)
        }]} );
      }
    }else if(CONFIG.SALE.mode === "contract" && CONFIG.SALE.contract.startsWith("0x")){
      // Burada presale kontratına özel methodlarınızı ekleyebilirsiniz.
      showToast({title:"Yapılandırma gerekli", msg:"Presale kontrat çağrısı için ABI/selector ekleyin.", ok:false});
      return;
    }else{
      showToast({title:"Adres eksik", msg:"Satın alma yapılandırması eksik. Lütfen CONFIG.SALE adreslerini kontrol edin.", ok:false});
      return;
    }

    // Başarılı gönderim — toast + Polygonscan
    showToast({title:"İşlem gönderildi", msg:`Week ${idx+1} • ${qty.toLocaleString()} ZUZU`, ok:true, link:scanLink(txHash)});

    // Referral & webhook kaydı
    const ref = localStorage.getItem(CONFIG.LS_REF)||"";
    const record = { ts:Date.now(), chain:"polygon", pay, qty, price, txHash, ref, buyer:EVM_ADDR };
    const hist = JSON.parse(localStorage.getItem("zuzu_purchases")||"[]"); hist.push(record);
    localStorage.setItem("zuzu_purchases", JSON.stringify(hist));
    if(CONFIG.WEBHOOK){
      try{ fetch(CONFIG.WEBHOOK,{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify(record)}); }catch(_){}
    }

    // Opsiyonel: otomatik claim İMZASI (backend için)
    try{ await signClaimIntent({qty, price, ref, txHash}); }catch(_){}

    // Opsiyonel: kontrat üstünden otomatik claim
    try{ await tryAutoClaim(); }catch(_){}

  }catch(err){
    console.error(err);
    const m = (err && (err.data?.message || err.message)) || "Bilinmeyen hata";
    let friendly = m;
    if(/User denied|Rejected|User rejected/i.test(m)) friendly = "İşlem kullanıcı tarafından iptal edildi.";
    else if(/insufficient funds/i.test(m)) friendly = "Bakiyeniz yetersiz görünüyor.";
    else if(/invalid address|to address/i.test(m)) friendly = "Geçersiz hedef adres. Lütfen alıcı adresini kontrol edin.";
    else if(/gas/i.test(m)) friendly = "Gas ayarları/ücreti nedeniyle başarısız olmuş olabilir.";
    showToast({title:"İşlem hatası", msg:friendly, ok:false});
  }
}

/* Otomatik claim için kontrat çağrısı (selector doluysa) */
async function tryAutoClaim(){
  if(!CONFIG.CLAIM.enabled) return;
  const to = CONFIG.CLAIM.contract;
  if(!to || !to.startsWith("0x")) return;

  const data = CONFIG.CLAIM.selector_claim || "";
  const dataFor = CONFIG.CLAIM.selector_claim_for ? (CONFIG.CLAIM.selector_claim_for + addr(EVM_ADDR)) : "";

  const payload = data || dataFor;
  if(!payload){ return; }

  const tx = await ethereum.request({
    method:"eth_sendTransaction",
    params:[{ from:EVM_ADDR, to, data: payload }]
  });
  showToast({title:"Claim gönderildi", msg:"Claim işlemi ağa gönderildi.", ok:true, link:scanLink(tx)});
}

/* Backend’e gönderilecek imza (claim intent) */
async function signClaimIntent({qty, price, ref, txHash}){
  if(!CONFIG.WEBHOOK) return; // sadece backend varsa gerekli
  const message = `ZUZU Claim Intent:\naddress:${EVM_ADDR}\nqty:${qty}\nprice:${price}\nref:${ref}\ntx:${txHash}`;
  const sig = await ethereum.request({
    method:"personal_sign",
    params:[ message, EVM_ADDR ]
  });
  try{
    fetch(CONFIG.WEBHOOK, {method:"POST", headers:{'Content-Type':'application/json'},
      body: JSON.stringify({type:"claim_intent", address:EVM_ADDR, qty, price, ref, txHash, sig})
    });
  }catch(_){}
}

/* Bind */
$("#buyBtn")?.addEventListener("click", buy);

/* ticker nudge */
(function ensureTickerVisible(){
  const t=document.querySelector(".ticker__track"); if(!t) return;
  t.style.transform="translateX(0)"; setTimeout(()=>t.style.transform="", 60);
})();
