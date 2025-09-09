// i18n store
const I18N = {
  en:{
    "hero.kicker":"Pre-Sale • Stake to Win NFT",
    "hero.title":"Robotic Hedgehog",
    "hero.lead":"Stake and win ZUZU Maskot NFT. Limited supply, high utility.",
    "cta.startStaking":"Start Staking",
    "cta.nftRewards":"NFT Rewards",
    "time.days":"DAYS","time.hours":"HOURS","time.minutes":"MINUTES","time.seconds":"SECONDS",
    "buy.title":"Buy ZUZU","buy.rate":"1 ZUZU = 0.0050 USDT","buy.paySol":"Pay with SOL","buy.buyNow":"Buy Now",
    "invite.title":"Invite & Earn","invite.lead":"Share your link. Each purchase via your link earns bonus ZUZU."
  },
  tr:{
    "hero.kicker":"Ön Satış • Stake ile NFT Kazan",
    "hero.title":"Geleceğin Robotik Kirpisi",
    "hero.lead":"Stake et ve ZUZU Maskot NFT kazan. Sınırlı arz, yüksek fayda.",
    "cta.startStaking":"Stake Etmeye Başla",
    "cta.nftRewards":"NFT Ödülleri",
    "time.days":"GÜN","time.hours":"SAAT","time.minutes":"DAKİKA","time.seconds":"SANİYE",
    "buy.title":"ZUZU Satın Al","buy.rate":"1 ZUZU = 0.0050 USDT","buy.paySol":"SOL ile Öde","buy.buyNow":"Şimdi Al",
    "invite.title":"Davet Et & Kazan","invite.lead":"Linkini paylaş. Linkin üzerinden yapılan her alış, bonus ZUZU kazandırır."
  },
  fr:{}, es:{}, ru:{}, pl:{}
};

// apply language
window.applyLang = function(lang){
  const d = I18N[lang] && Object.keys(I18N[lang]).length ? I18N[lang] : I18N.en;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const k = el.dataset.i18n; if(d[k]) el.textContent = d[k];
  });
  const flag=document.getElementById("langFlag"), code=document.getElementById("langCode");
  if(flag) flag.src=`flags/${lang}.png`;
  if(code) code.textContent=(lang||"EN").toUpperCase();
  localStorage.setItem("zuzu_lang", lang);
};
