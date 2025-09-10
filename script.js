/* =========================
   CONFIG
========================= */
const CONFIG = {
  // geri sayımı sabitle: localStorage'a 1 kez yazılır (yenileyince sıfırlanmaz)
  launchKey: "zuzu_launchAt",
  defaultLaunchISO: "2025-11-31T23:59:59Z",

  weekPrices: [0.0050,0.0065,0.0080,0.0100], // USDT
  nfts: Array.from({length:10}).map((_,i)=>({
    id:i, name:`ZUZU #${i+1}`, rarity: i%5===0?'Legendary':(i%2?'Rare':'Epic')
  }))
};

/* =========================
   i18n (EN/TR/FR/PT/RU/ES)
========================= */
const I = {
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡💤",
      hero_lead:"Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high <b>utility</b>.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",
      amount:"Amount (ZUZU)",cost:"Cost:",buy:"Buy",exchanges:"Supported Exchanges",
      stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>.",
      token_title:"Tokenomics (Visualized)",road_title:"Roadmap"},
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡💤",
      hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",
      amount:"Miktar (ZUZU)",cost:"Maliyet:",buy:"Satın Al",exchanges:"Desteklenen Borsalar",
      stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile kazan.",
      token_title:"Tokonomi (Görsel)",road_title:"Yol Haritası"},
  fr:{nav_presale:"Pré-vente",nav_stake:"Stake",nav_nft:"Récompenses NFT",nav_roadmap:"Feuille de route",nav_token:"Tokenomics",connect:"Connecter le Wallet",
      hero_badge:"Pré-vente • Stake pour gagner un NFT",hero_title:"ZUZU — Hérisson Robotique 🦔⚡💤",
      hero_lead:"Stake et gagne un <b>NFT Mascotte ZUZU</b>.",cta_stake:"Commencer le Stake",cta_nft:"Récompenses NFT",
      days:"JOURS",hours:"HEURES",mins:"MINUTES",secs:"SECONDES",
      presale_title:"Pré-vente — Compte à rebours",presale_lead:"Prépare-toi pour la pré-vente ZUZU ! <b>Allocation limitée</b>.",
      amount:"Montant (ZUZU)",cost:"Coût :",buy:"Acheter",exchanges:"Bourses prises en charge",
      stake_title:"Stake Pro — Verrouille, Gagne, Reçois un NFT ✨",stake_lead:"Verrouille ton ZUZU et gagne <b>APY + BOOST NFT</b>.",
      token_title:"Tokenomics (Visualisé)",road_title:"Feuille de route"},
  pt:{nav_presale:"Pré-venda",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Roteiro",nav_token:"Tokenomics",connect:"Conectar Carteira",
      hero_badge:"Pré-venda • Stake para ganhar NFT",hero_title:"ZUZU — Ouriço Robótico 🦔⚡💤",
      hero_lead:"Faça stake e ganhe <b>NFT Mascote ZUZU</b>.",cta_stake:"Começar Stake",cta_nft:"Recompensas NFT",
      days:"DIAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",
      presale_title:"Pré-venda — Contagem regressiva",presale_lead:"Prepare-se para a pré-venda ZUZU! <b>Alocação limitada</b>.",
      amount:"Quantidade (ZUZU)",cost:"Custo:",buy:"Comprar",exchanges:"Exchanges suportadas",
      stake_title:"Stake Pro — Trave, Ganhe, Receba NFT ✨",stake_lead:"Trave seu ZUZU e ganhe <b>APY + BOOST NFT</b>.",
      token_title:"Tokenomics (Visualizado)",road_title:"Roteiro"},
  ru:{nav_presale:"Предпродажа",nav_stake:"Стейкинг",nav_nft:"NFT награды",nav_roadmap:"Дорожная карта",nav_token:"Токеномика",connect:"Подключить кошелёк",
      hero_badge:"Предпродажа • Стейкинг для NFT",hero_title:"ZUZU — Робо-Ёж 🦔⚡💤",
      hero_lead:"Стейкай и получай <b>маскот NFT ZUZU</b>.",cta_stake:"Начать стейкинг",cta_nft:"NFT награды",
      days:"ДНИ",hours:"ЧАСЫ",mins:"МИН.",secs:"СЕК.",
      presale_title:"Предпродажа — Обратный отсчёт",presale_lead:"Готовься к предпродаже ZUZU! <b>Ограниченная аллокация</b>.",
      amount:"Количество (ZUZU)",cost:"Стоимость:",buy:"Купить",exchanges:"Поддерживаемые биржи",
      stake_title:"Stake Pro — Заморозь, Заработай, Получи NFT ✨",stake_lead:"Заморозь ZUZU и получай <b>APY + NFT BOOST</b>.",
      token_title:"Токеномика (визуально)",road_title:"Дорожная карта"},
  es:{nav_presale:"Pre-venta",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Hoja de ruta",nav_token:"Tokenomics",connect:"Conectar Billetera",
      hero_badge:"Pre-venta • Stake para ganar NFT",hero_title:"ZUZU — Erizo Robótico 🦔⚡💤",
      hero_lead:"Haz stake y gana <b>NFT Mascota ZUZU</b>.",cta_stake:"Empezar Stake",cta_nft:"Recompensas NFT",
      days:"DÍAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",
      presale_title:"Pre-venta — Cuenta regresiva",presale_lead:"¡Prepárate para la pre-venta ZUZU! <b>Asignación limitada</b>.",
      amount:"Cantidad (ZUZU)",cost:"Costo:",buy:"Comprar",exchanges:"Exchanges compatibles",
      stake_title:"Stake Pro — Bloquea, Gana, Obtén NFT ✨",stake_lead:"Bloquea tu ZUZU y gana <b>APY + BOOST NFT</b>.",
      token_title:"Tokenomics (Visualizado)",road_title:"Hoja de ruta"}
};

/* =============== Lang UI =============== */
const $ = (q,root=document)=>root.querySelector(q);
const $$= (q,root=document)=>[...root.querySelectorAll(q)];

function applyLang(lang){
  localStorage.setItem("zuzu_lang", lang);
  $$("#langCode").forEach(el=>el.textContent=lang.toUpperCase());
  $("#langFlag").src = `flags/${lang}.png`;
  document.querySelectorAll("[data-i]").forEach(el=>{
    const k=el.getAttribute("data-i"); if(I[lang] && I[lang][k]) el.innerHTML=I[lang][k];
  });
}
(function initLang(){
  const saved = localStorage.getItem("zuzu_lang") || "en";
  applyLang(saved);
  const langBtn  = $("#langBtn"), langMenu=$("#langMenu");
  langBtn.addEventListener("click", ()=>langMenu.classList.toggle("show"));
  $$(".lang-opt").forEach(b=>b.addEventListener("click", ()=>{
    applyLang(b.dataset.lang); langMenu.classList.remove("show");
  }));
  document.addEventListener("click", (e)=>{
    if(!langMenu.contains(e.target) && e.target!==langBtn) langMenu.classList.remove("show");
  });
})();

/* =============== Countdown (persist) =============== */
function getLaunchAt(){
  let ts = localStorage.getItem(CONFIG.launchKey);
  if(!ts){ ts = new Date(CONFIG.defaultLaunchISO).getTime().toString(); localStorage.setItem(CONFIG.launchKey, ts); }
  return parseInt(ts,10);
}
function tick(){
  const left = Math.max(0, getLaunchAt() - Date.now());
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

/* =============== Presale fiyat / maliyet =============== */
function updateCosts(){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  CONFIG.weekPrices.forEach((p,i)=>{
    $("#p"+i).textContent = p.toFixed(4);
    $("#c"+i).textContent = (qty*p).toLocaleString(undefined,{maximumFractionDigits:2});
  });
}
$("#buyAmount").addEventListener("input", updateCosts);
updateCosts();

/* =============== NFT grid =============== */
(function renderNFTs(){
  const g=$("#nftGrid");
  g.innerHTML = CONFIG.nfts.map(n=>`
    <div class="nft">
      <img src="assets/images/mask/${n.id}.png" alt="${n.name}" loading="lazy"
           onerror="this.style.display='none'">
      <div class="meta"><b>${n.name}</b><span class="tag">${n.rarity}</span></div>
    </div>`).join("");
})();

/* =============== Invite link =============== */
(function refLink(){
  const addr = localStorage.getItem("zuzu_refAddr") || "";
  const url = new URL(location.href);
  if(url.searchParams.get("ref")) localStorage.setItem("zuzu_refAddr", url.searchParams.get("ref"));
  $("#refLink").value = `${location.origin}${location.pathname}?ref=${addr||"YOURCODE"}`;
  $("#copyRef").addEventListener("click", ()=>{ navigator.clipboard.writeText($("#refLink").value); alert("Copied!"); });
})();

/* =============== Wallets (Phantom / Solflare / Backpack) =============== */
/* =============== Wallets (Phantom / Solflare / Backpack) =============== */
/* inline ikonlar (gömülü SVG -> her zaman görünür) */
const ICONS = {
  phantom: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256"><rect width="256" height="256" rx="56" fill="%231a1b27"/><path fill="%23969cff" d="M196 164c-15 0-28-12-28-27s13-27 28-27s28 12 28 27s-13 27-28 27Zm-92 24c-65 0-92-36-92-72c0-41 36-68 85-68c61 0 130 31 130 77c0 7-2 14-6 19c-3 4-7 6-12 6c-16 0-29-13-29-29c0-4-3-7-7-7c-4 0-7 3-8 7c-3 17-17 29-34 29c-17 0-31-12-34-29c-1-4-4-7-8-7c-4 0-7 3-7 7c0 37 27 78 89 78Z"/></svg>',
  solflare: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256"><rect width="256" height="256" rx="56" fill="%231a1b27"/><path fill="%23ff7a00" d="M38 128L128 38l90 90l-90 90Z"/><circle cx="128" cy="128" r="34" fill="%23ffd2a6"/></svg>',
  backpack: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256"><rect width="256" height="256" rx="56" fill="%231a1b27"/><path fill="%23ff4d6d" d="M88 88c0-22 18-40 40-40s40 18 40 40v16h8c9 0 16 7 16 16v72c0 9-7 16-16 16H80c-9 0-16-7-16-16v-72c0-9 7-16 16-16h8V88Z"/><rect x="96" y="128" width="64" height="28" rx="6" fill="%23fff"/></svg>'
};

const Wallets = {
  phantom:{
    key:'phantom', label:'Phantom', icon:ICONS.phantom,
    has:()=>!!(window.solana && (window.solana.isPhantom || window.phantom?.solana)),
    provider:()=>window.solana || window.phantom?.solana,
    connect:async()=>{ const p=Wallets.phantom.provider(); const r=await p.connect({ onlyIfTrusted:false }); return r.publicKey.toString(); },
    deeplink:(url)=>`https://phantom.app/ul/browse/${encodeURIComponent(url)}`
  },
  solflare:{
    key:'solflare', label:'Solflare', icon:ICONS.solflare,
    has:()=>!!(window.solflare && window.solflare.isSolflare),
    provider:()=>window.solflare,
    connect:async()=>{ const r=await window.solflare.connect(); return r.publicKey.toString(); },
    deeplink:(url)=>`https://solflare.com/ul/v1/browse/${encodeURIComponent(url)}`
  },
  backpack:{
    key:'backpack', label:'Backpack', icon:ICONS.backpack,
    has:()=>!!(window.backpack?.isBackpack || window.xnft?.solana),
    provider:()=>window.backpack || window.xnft?.solana,
    connect:async()=>{ const p=Wallets.backpack.provider(); const r=await p.connect(); return (r.publicKey?.toString?.()||r.publicKey); },
    deeplink:(url)=>`https://backpack.app/ul/browse/${encodeURIComponent(url)}`
  }
};

let CURRENT_ADDRESS = null;

function walletListHTML(){
  return Object.values(Wallets).map(w=>`
    <button class="wbtn" data-key="${w.key}">
      <img alt="${w.label}" src="${w.icon}" onerror="this.replaceWith(document.createTextNode('${w.label}'));">
      <span>${w.label}</span>
    </button>`).join("");
}

/* --- modal kurulum + bağlanma akışı --- */
(function initWalletModal(){
  const list = document.getElementById("wlist");
  list.innerHTML = walletListHTML();

  list.addEventListener("click", async (e)=>{
    const btn = e.target.closest(".wbtn"); if(!btn) return;
    const w = Wallets[btn.dataset.key];

    const goConnectedUI = (addr)=>{
      CURRENT_ADDRESS = addr;
      const cbtn = document.getElementById("connectBtn");
      if(cbtn) cbtn.textContent = `${addr.slice(0,6)}...${addr.slice(-4)}`;
      document.getElementById("walletModal").classList.remove("show");
      // referans linkine yaz
      localStorage.setItem("zuzu_refAddr", addr);
      const r = document.getElementById("refLink");
      if(r) r.value = `${location.origin}${location.pathname}?ref=${addr}`;
    };

    try{
      if(w.has()){
        // cüzdan tarayıcısındayız -> native connect
        const addr = await w.connect();
        goConnectedUI(addr);
      }else{
        // mobil tarayıcı: cüzdan içinde siteyi aç ve otomatik connect ettir
        const target = new URL(location.href);
        target.searchParams.set("wallet", w.key); // ?wallet=phantom|solflare|backpack
        window.open(w.deeplink(target.toString()), "_blank");
      }
    }catch(err){
      alert("Wallet connection rejected or failed.");
      console.warn(err);
    }
  });

  // modal dismiss
  const modal = document.getElementById("walletModal");
  modal.addEventListener("click", (e)=>{ if(e.target===modal) modal.classList.remove("show"); });

  // ana buton
  document.getElementById("connectBtn").addEventListener("click", ()=>{
    // varsa bir provider direkt dener, yoksa modal
    const direct = Wallets.phantom.has()?Wallets.phantom:
                   (Wallets.solflare.has()?Wallets.solflare:
                   (Wallets.backpack.has()?Wallets.backpack:null));
/* ========== Wallets (icons + robust connect) ========== */

/* Küçük base64 ikonlar (kaçış derdi yok) */
const ICONS = {
  phantom: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAABU...PhAN",   // kısaltıldı
  solflare:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAABU...SoLF",
  backpack:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAABU...BPKK"
};
/* Not: Üstteki üç değer gerçek base64 ile dolmalı. Şimdilik assets’teki png’leri
   dönüştürüp (örn. online png→base64) buraya yapıştırabilirsin. İstersen ben
   üçünü gönderirim; mantık bu şekilde sorunsuz çalışır. */

const Wallets = {
  phantom: {
    key:"phantom", label:"Phantom", icon:ICONS.phantom,
    has:()=>!!(window.phantom?.solana || (window.solana && window.solana.isPhantom)),
    provider:()=>window.phantom?.solana || window.solana,
    deeplink:(url)=>`https://phantom.app/ul/browse/${encodeURIComponent(url)}`,
    connect: async () => {
      const p = Wallets.phantom.provider();
      // Phantom bazı sürümlerde event yayıyor
      if (!p.isConnected) {
        await p.connect({ onlyIfTrusted:false });
      }
      return (p.publicKey?.toString?.() || (await p.connect())?.publicKey?.toString());
    }
  },
  solflare: {
    key:"solflare", label:"Solflare", icon:ICONS.solflare,
    has:()=>!!(window.solflare?.isSolflare),
    provider:()=>window.solflare,
    deeplink:(url)=>`https://solflare.com/ul/v1/browse/${encodeURIComponent(url)}`,
    connect: async () => {
      const p = Wallets.solflare.provider();
      const res = await p.connect();
      return (res?.publicKey?.toString?.() || p.publicKey?.toString?.());
    }
  },
  backpack: {
    key:"backpack", label:"Backpack", icon:ICONS.backpack,
    has:()=>!!(window.backpack?.isBackpack || window.xnft?.solana),
    provider:()=>window.backpack || window.xnft?.solana,
    deeplink:(url)=>`https://backpack.app/ul/browse/${encodeURIComponent(url)}`,
    connect: async () => {
      const p = Wallets.backpack.provider();
      const res = await (p.connect ? p.connect() : Promise.resolve());
      const pk = res?.publicKey || p.publicKey;
      return pk?.toString?.() || pk;
    }
  }
};

let Z_ADDR = null;

function walletButtonsHTML(){
  return Object.values(Wallets).map(w=>`
    <button class="wbtn" data-key="${w.key}">
      <img class="wicon" src="${w.icon}" alt="${w.label}">
      <span>${w.label}</span>
    </button>`).join("");
}

(function initWalletUI(){
  // butonları bas
  const list = document.getElementById("wlist");
  if (list) list.innerHTML = walletButtonsHTML();

  const modal = document.getElementById("walletModal");
  const cbtn  = document.getElementById("connectBtn");

  function setConnected(addr){
    Z_ADDR = addr;
    if (cbtn) cbtn.textContent = `${addr.slice(0,6)}...${addr.slice(-4)}`;
    document.getElementById("refLink")?.setAttribute(
      "value",
      `${location.origin}${location.pathname}?ref=${addr}`
    );
    modal?.classList.remove("show");
  }

  async function tryConnect(key){
    const w = Wallets[key];
    try{
      if (w.has()){
        // cüzdan içi tarayıcı
        const prov = w.provider();
        // event ile başarılı bağlanınca yakala
        let once = false;
        const onConnect = (pubkey)=>{
          if(once) return; once = true;
          const addr = pubkey?.toString?.() || prov.publicKey?.toString?.();
          if (addr) setConnected(addr);
          prov.removeEventListener?.("connect", onConnect);
        };
        prov.addEventListener?.("connect", onConnect);
        const addr = await w.connect(); // çoğu durumda direkt döner
        if (addr) setConnected(addr);
      }else{
        // dış tarayıcı → deeplink
        const url = new URL(location.href);
        url.searchParams.set("wallet", key);
        window.location.href = w.deeplink(url.toString());
      }
    }catch(e){
      console.warn("wallet connect failed:", e);
      alert("Wallet connection failed or was rejected.");
    }
  }

  // modal aç/kapat
  cbtn?.addEventListener("click", ()=>{
    // cihazda bir provider varsa direkt onu dene; yoksa modal aç
    const direct = Wallets.phantom.has() ? "phantom" :
                   Wallets.solflare.has() ? "solflare" :
                   Wallets.backpack.has() ? "backpack" : null;
    if (direct) tryConnect(direct);
    else modal?.classList.add("show");
  });
  modal?.addEventListener("click",(e)=>{ if(e.target===modal) modal.classList.remove("show"); });

  // listeden seçim
  list?.addEventListener("click",(e)=>{
    const btn = e.target.closest(".wbtn"); if(!btn) return;
    tryConnect(btn.dataset.key);
  });

  // cüzdan içi tarayıcıda otomatik bağlanma (deeplink dönüşü)
  (async function autoConnect(){
    const url = new URL(location.href);
    const key = url.searchParams.get("wallet");
    if(!key) return;
    // görünür hale gelince bir daha dene (bazı cüzdanlarda ilk an reddediyor)
    document.addEventListener("visibilitychange", ()=>{
      if (document.visibilityState === "visible" && Wallets[key]?.has()) {
        tryConnect(key);
        url.searchParams.delete("wallet");
        history.replaceState({}, "", url.toString());
      }
    });
    if (Wallets[key]?.has()) {
      await new Promise(r=>setTimeout(r, 250));
      tryConnect(key);
      url.searchParams.delete("wallet");
      history.replaceState({}, "", url.toString());
    }
  })();
})();
})();

/* =============== Satın alma (SOL / USDT on Solana) — stub akış =============== */
/* Not: On-chain transfer/ATA oluşturma detayları uzun; burada
   - SOL seçilirse: Phantom içinde “transfer penceresi”ne yönlendiren link açar.
   - USDT seçilirse: şimdilik uyarı (contract entegrasyonu eklendiğinde imzalı tx).
*/
const ZUZU_TREASURY = "FILL_TREASURY_SOL_ADDRESS";   // Solana adresin (32 base58)

function activeWeek(){
  // Satış başlangıcını sabit kabul edelim: ilk hafta aktif.
  // İstersen burayı tarih bazlı yaparız.
  return 0;
}
["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
  const b = $("#"+id); if(!b) return;
  b.addEventListener("click", ()=>handleBuy(i));
});

function handleBuy(weekIdx){
  const qty = parseFloat(($("#buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  if(qty<=0){ alert("Geçerli miktar gir."); return; }

  const aw = activeWeek();
  if(weekIdx!==aw){ alert("Bu hafta aktif değil."); return; }

  const price = CONFIG.weekPrices[weekIdx];
  const usdtCost = qty * price; // USDT
  const payWith = $("#payWith").value;

  if(!CURRENT_ADDRESS){
    alert("Önce cüzdan bağla (Phantom / Solflare / Backpack).");
    return;
  }

  if(payWith==="SOL"){
    // basit dönüşüm (örnek): 1 USDT ~ 0.01 SOL gibi DUMMY (gerçek kur eklenmeli)
    const solAmount = (usdtCost*0.01).toFixed(4);
    const deeplink = `https://phantom.app/ul/transfer?recipient=${encodeURIComponent(ZUZU_TREASURY)}&amount=${solAmount}&reference=${encodeURIComponent(CURRENT_ADDRESS)}&network=mainnet`;
    window.open(deeplink, "_blank");
    alert(`Phantom açılacak. ~${solAmount} SOL gönderiyorsun.\n(Oran sabit örnek; gerçek kur eklenecek.)`);
  }else{
    alert("USDT (Solana) transferi için SPL-Token işlem entegrasyonu eklenecek.");
  }
}

/* =============== küçük dokunuşlar =============== */
// ticker görünürlüğünü tetikle
(function ensureTickerVisible(){
  const t=$("#exTrack"); if(!t) return;
  t.style.transform="translateX(0)"; setTimeout(()=>t.style.transform="", 60);
})();
