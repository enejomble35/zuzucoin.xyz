const I={
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
      hero_lead:"Stake and win <b>ZUZU Mascot NFT</b>. Limited supply, high <b>utility</b>.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",
      amount:"Amount (ZUZU)",cost:"Cost:",buy:"Buy",exchanges:"Supported Exchanges",
      stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>.",
      token_title:"Tokenomics (Visualized)"},
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Robotic Kirpi 🦔⚡",
      hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",
      amount:"Miktar (ZUZU)",cost:"Maliyet:",buy:"Satın Al",exchanges:"Desteklenen Borsalar",
      stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile kazan.",
      token_title:"Tokonomi (Görsel)"},
};
function applyLang(lang){
  try{localStorage.setItem("zuzu_lang",lang);}catch{}
  const dict=I[lang]||I.tr;
  document.querySelectorAll("[data-i]").forEach(el=>{
    const k=el.getAttribute("data-i"); if(dict[k]) el.innerHTML=dict[k];
  });
  const flag=document.getElementById("langFlag");
  const code=document.getElementById("langCode");
  if(flag) flag.src=`flags/${lang}.png`;
  if(code) code.textContent=lang.toUpperCase();
}
(function initLang(){
  const saved=(localStorage.getItem("zuzu_lang")||"tr").toLowerCase();
  applyLang(saved);
  const btn=document.getElementById("langBtn");
  const menu=document.getElementById("langMenu");
  btn?.addEventListener("click",(e)=>{e.stopPropagation();menu?.classList.toggle("show");});
  document.querySelectorAll(".lang-opt").forEach(b=>b.addEventListener("click",(e)=>{
    e.stopPropagation(); applyLang(b.dataset.lang); menu?.classList.remove("show");
  }));
  document.addEventListener("click",()=>menu?.classList.remove("show"));
})();
