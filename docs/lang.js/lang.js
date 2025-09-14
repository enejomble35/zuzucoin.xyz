const I = {
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",
      hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",
      amount:"Miktar (ZUZU)",cost:"Maliyet:",buy:"Satın Al",exchanges:"Desteklenen Borsalar",
      stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile kazan.",
      token_title:"Tokonomi (Görsel)"},
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
      hero_lead:"Stake and win <b>ZUZU Mascot NFT</b>. Limited supply, high <b>utility</b>.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>.",
      amount:"Amount (ZUZU)",cost:"Cost:",buy:"Buy",exchanges:"Supported Exchanges",
      stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>.",
      token_title:"Tokenomics (Visualized)"}
};

(function initLang(){
  const LS_KEY="zuzu_lang";
  const saved = localStorage.getItem(LS_KEY) || "tr";
  applyLang(saved);

  const langBtn=document.getElementById("langBtn");
  const langMenu=document.getElementById("langMenu");

  langBtn?.addEventListener("click",(e)=>{e.stopPropagation();langMenu?.classList.toggle("show");});
  document.querySelectorAll(".lang-opt").forEach(b=>b.addEventListener("click",(e)=>{
    e.stopPropagation(); const l=b.dataset.lang; applyLang(l); localStorage.setItem(LS_KEY,l); langMenu?.classList.remove("show");
  }));
  document.addEventListener("click",(e)=>{ if(langMenu && !langMenu.contains(e.target) && e.target!==langBtn) langMenu.classList.remove("show"); });

  function applyLang(lang){
    const flag=document.getElementById("langFlag");
    const code=document.getElementById("langCode");
    if(flag) flag.src=`flags/${lang}.png`;
    if(code) code.textContent=lang.toUpperCase();
    document.querySelectorAll("[data-i]").forEach(el=>{
      const k=el.getAttribute("data-i");
      if(I[lang] && I[lang][k]) el.innerHTML=I[lang][k];
    });
  }
})();
