/* =========================
   Config + NFT list + Countdown
========================= */
const CONFIG = {
  launchAt: Date.now() + 50*24*60*60*1000,           // 50 gün geri sayım
  nfts: Array.from({length:10}).map((_,i)=>({
    id:i, name:`ZUZU #${i+1}`, rarity: i%3===0?'Epic':(i%5===0?'Legendary':'Rare')
  }))
};

/* i18n */
const I = {
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",
      connect:"Connect Wallet",hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡💤",
      hero_lead:"Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high <b>utility</b>.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",
      amount:"Amount (ZUZU)",buy:"Buy Now",stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",
      stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>.",token_title:"Tokenomics",road_title:"Roadmap"},
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",
      connect:"Cüzdan Bağla",hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡💤",
      hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",
      amount:"Miktar (ZUZU)",buy:"Satın Al",stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",
      stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile pasif gelir elde et.",token_title:"Tokonomi",road_title:"Yol Haritası"},
  fr:{nav_presale:"Pré-vente",nav_stake:"Stake",nav_nft:"Récompenses NFT",nav_roadmap:"Feuille de route",nav_token:"Tokenomics",
      connect:"Connecter le Wallet",hero_badge:"Pré-vente • Stake pour gagner un NFT",hero_title:"ZUZU — Hérisson Robotique 🦔⚡💤",
      hero_lead:"Stake et gagne un <b>NFT Mascotte ZUZU</b>.",cta_stake:"Commencer le Stake",cta_nft:"Récompenses NFT",
      days:"JOURS",hours:"HEURES",mins:"MINUTES",secs:"SECONDES",presale_title:"Pré-vente — Compte à rebours",
      presale_lead:"Prépare-toi pour la pré-vente ZUZU !",amount:"Montant (ZUZU)",buy:"Acheter",stake_title:"Stake Pro — Verrouille, Gagne, Reçois un NFT ✨",
      stake_lead:"Verrouille ton ZUZU, gagne <b>APY + BOOST NFT</b>.",token_title:"Tokenomics",road_title:"Feuille de route"},
  es:{nav_presale:"Pre-venta",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Hoja de ruta",nav_token:"Tokenomics",
      connect:"Conectar Billetera",hero_badge:"Pre-venta • Stake para ganar NFT",hero_title:"ZUZU — Erizo Robótico 🦔⚡💤",
      hero_lead:"Haz stake y gana un <b>NFT Mascota ZUZU</b>.",cta_stake:"Empezar Stake",cta_nft:"Recompensas NFT",
      days:"DÍAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",presale_title:"Pre-venta — Cuenta regresiva",
      presale_lead:"¡Prepárate para la pre-venta ZUZU!",amount:"Cantidad (ZUZU)",buy:"Comprar",stake_title:"Stake Pro — Bloquea, Gana, Obtén NFT ✨",
      stake_lead:"Bloquea tu ZUZU, gana <b>APY + BOOST NFT</b>.",token_title:"Tokenomics",road_title:"Hoja de ruta"}
};

/* Lang */
function applyLang(lang="en"){
  document.querySelectorAll("[data-i]").forEach(el=>{
    const k=el.getAttribute("data-i");
    if(I[lang] && I[lang][k]) el.innerHTML = I[lang][k];
  });
}
(function initLang(){
  const sel=document.getElementById("langSel");
  if(!sel) return;
  sel.addEventListener("change", ()=>applyLang(sel.value));
  applyLang("en");
})();

/* Countdown */
function tick(){
  const left=Math.max(0, CONFIG.launchAt - Date.now());
  const d=Math.floor(left/86400000);
  const h=Math.floor((left%86400000)/3600000);
  const m=Math.floor((left%3600000)/60000);
  const s=Math.floor((left%60000)/1000);
  const pad=n=>n.toString().padStart(2,"0");
  [["cdDays",d],["cdHours",h],["cdMins",m],["cdSecs",s]].forEach(([id,val])=>{
    const el=document.getElementById(id); if(el) el.textContent=pad(val);
  });
}
tick(); setInterval(tick,1000);

/* NFT grid render */
(function renderNFTs(){
  const g=document.getElementById("nftGrid"); if(!g) return;
  g.innerHTML = CONFIG.nfts.map(n=>{
    const img=`assets/images/mask/${n.id}.png`;
    return `
    <div class="nft">
      <img src="${img}" alt="${n.name}" loading="lazy" onerror="this.style.display='none'">
      <div class="meta">
        <b>${n.name}</b>
        <span class="tag">${n.rarity}</span>
      </div>
    </div>`;
  }).join("");
})();

/* =========================
   Wallet Connect (Phantom / Solflare / Backpack)
   - Eğer provider var ise (in-app browser), direkt connect.
   - Yoksa seçim modalı ve mobil deep-link ile cüzdana yönlendir.
========================= */
const Wallets = {
  phantom: {
    key:'phantom',
    label:'Phantom',
    icon:'assets/images/wallets/phantom.png',
    has:()=>!!(window.solana && window.solana.isPhantom),
    connect:async()=>{ const resp=await window.solana.connect({onlyIfTrusted:false}); return resp.publicKey.toString(); },
    deeplink:(url)=>`https://phantom.app/ul/browse/${encodeURIComponent(url)}`
  },
  solflare: {
    key:'solflare',
    label:'Solflare',
    icon:'assets/images/wallets/solflare.png',
    has:()=>!!(window.solflare && window.solflare.isSolflare),
    connect:async()=>{ const resp=await window.solflare.connect(); return resp.publicKey.toString(); },
    deeplink:(url)=>`https://solflare.com/ul/v1/browse/${encodeURIComponent(url)}`
  },
  backpack: {
    key:'backpack',
    label:'Backpack',
    icon:'assets/images/wallets/backpack.png',
    has:()=>!!(window.backpack && window.backpack.isBackpack),
    connect:async()=>{ const resp=await window.backpack.connect(); return resp.publicKey.toString(); },
    // universal link pek stabil değil, tarayıcıda açmayı dener:
    deeplink:(url)=>`https://backpack.app/ul/browse/${encodeURIComponent(url)}`
  }
};

let CURRENT_ADDRESS = null;

/* Modal DOM */
function ensureModal(){
  let m=document.getElementById("walletModal");
  if(m) return m;
  m=document.createElement("div");
  m.className="modal"; m.id="walletModal";
  m.innerHTML=`
    <div class="sheet">
      <h3>Connect Wallet</h3>
      <div class="wlist" id="wlist"></div>
      <p style="color:#8aa2c9;margin:.8rem 0 0;font-size:.9rem">
        On mobile, the site opens inside the wallet. Approve <b>zuzucoin.xyz</b>, then you’ll return here automatically.
      </p>
    </div>`;
  document.body.appendChild(m);
  return m;
}

function showWalletChooser(){
  const modal=ensureModal(); modal.classList.add("show");
  const list=modal.querySelector("#wlist"); list.innerHTML="";
  Object.values(Wallets).forEach(w=>{
    const btn=document.createElement("button");
    btn.className="wbtn";
    btn.innerHTML=`<img src="${w.icon}" alt=""><span>${w.label}</span>`;
    btn.onclick=()=>connectSelected(w);
    list.appendChild(btn);
  });
  modal.addEventListener("click",(e)=>{ if(e.target===modal) modal.classList.remove("show"); });
}

/* Connect flow */
async function connectSelected(w){
  const modal=document.getElementById("walletModal");
  try{
    if(w.has()){
      const addr=await w.connect();
      CURRENT_ADDRESS=addr;
      updateConnectBtn(addr);
      if(modal) modal.classList.remove("show");
    }else{
      // Deep-link: mobilde cüzdan içinde site açar
      const url=location.href;
      window.open(w.deeplink(url), "_blank");
    }
  }catch(e){
    alert("Wallet connection rejected or failed.");
    console.warn(e);
  }
}

function updateConnectBtn(addr){
  const b=document.getElementById("connectBtn");
  if(!b) return;
  if(addr){ b.textContent=`${addr.slice(0,6)}...${addr.slice(-4)}`; }
  else { b.textContent=I.en.connect; }
}

/* Button bindings */
document.getElementById("connectBtn")?.addEventListener("click",()=>{
  // Eğer herhangi bir provider varsa önce onu kullanmayı dene
  if(Wallets.phantom.has() || Wallets.solflare.has() || Wallets.backpack.has()){
    const first = Wallets.phantom.has() ? Wallets.phantom :
                  Wallets.solflare.has() ? Wallets.solflare :
                  Wallets.backpack;
    connectSelected(first);
  }else{
    showWalletChooser();
  }
});

/* Dummy buy (işlem entegrasyonu yok, cüzdan adresi yoksa uyarı) */
document.getElementById("buyBtn")?.addEventListener("click",()=>{
  const amt = parseFloat((document.getElementById("buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  if(!CURRENT_ADDRESS){ alert("Önce cüzdan bağla (Phantom / Solflare / Backpack)."); return; }
  if(amt<=0){ alert("Geçerli miktar gir."); return; }
  alert(`Sipariş hazırlandı.\nMiktar: ${amt} ZUZU\nAdres: ${CURRENT_ADDRESS}\n\n(Ödeme entegrasyonu için on-chain kontratı bağlayacağız.)`);
});
