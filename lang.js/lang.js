/* =========================================================
   ZUZU — i18n (EN/TR/FR/RU/PL)
   Küresel fonksiyonlar: window.ZI, applyLang(lang), currentLang()
========================================================= */
window.ZI = {
  en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
      hero_lead:"Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high <b>utility</b>.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",collection_page:"Collection Page",contract:"Contract:",
      days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",
      amount:"Amount (ZUZU)", w1:"Week 1 (Cheapest)", w2:"Week 2", w3:"Week 3", w4:"Week 4 (Last Chance)",
      cost:"Cost:", buy:"Buy", exchanges:"Supported Exchanges",
      pay:"Payment", pay_sol:"SOL (native)", pay_usdt:"USDT (SPL)", est:"est.",
      stake_title:"Stake Pro — Lock, Earn, Get NFT ✨", stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>. Early stakers get badge & airdrop priority.",
      calc_title:"Earnings Calculator", amount2:"Amount (ZUZU)", lock:"Lock Period",
      nft_have:"Have NFT?", early:"Early Badge", calc_btn:"Calculate",
      ret:"Total Return", avg:"Monthly Avg", boost:"Total Boost",
      token_title:"Tokenomics (Visualized)", road_title:"Roadmap",
      road_lead:"Clear plan focused on community, staking, NFT drops, listings.",
      invite_bar:"Connect wallet to get your invite link", invite_btn:"Referrals: Copy link",
      invite_copied:"Invite link copied!",
      will_list:"Will Be Listed Soon",
      claim_connect:"Connect Wallet", claim_title:"Claim Portal",
      claim_note:"Receipts will be matched to this wallet. When TGE opens you can claim vested tokens here.",
      network:"Network", network_sol:"Solana", network_usdt:"Solana (USDT)",
  },
  tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",
      hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",collection_page:"Koleksiyon Sayfası",contract:"Kontrat:",
      days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",
      amount:"Miktar (ZUZU)", w1:"1. Hafta (En Ucuz)", w2:"2. Hafta", w3:"3. Hafta", w4:"4. Hafta (Son Fırsat)",
      cost:"Maliyet:", buy:"Satın Al", exchanges:"Desteklenen Borsalar",
      pay:"Ödeme", pay_sol:"SOL (native)", pay_usdt:"USDT (SPL)", est:"tah.",
      stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨", stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile pasif gelir elde et.",
      calc_title:"Kazanç Hesaplayıcı", amount2:"Miktar (ZUZU)", lock:"Kilit Süresi",
      nft_have:"Elinde NFT var mı?", early:"Erken Rozet", calc_btn:"Hesapla",
      ret:"Toplam Getiri", avg:"Aylık Ortalama", boost:"Toplam Boost",
      token_title:"Tokonomi (Görselleştirilmiş)", road_title:"Yol Haritası",
      road_lead:"Topluluk, staking, NFT drop’ları ve listelemelere odaklı plan.",
      invite_bar:"Davet linkin için cüzdan bağla", invite_btn:"Davet: Linki Kopyala",
      invite_copied:"Davet linki kopyalandı!",
      will_list:"Yakında listelenecek",
      claim_connect:"Cüzdan Bağla", claim_title:"Claim Portal",
      claim_note:"Ön satış fişleri bu cüzdana eşleşir. TGE açıldığında hak edişini buradan talep edebilirsin.",
      network:"Ağ", network_sol:"Solana", network_usdt:"Solana (USDT)",
  },
  fr:{/* kısaltılmış — ana anahtarlar */ ...window.ZI?.en, connect:"Connecter le Wallet"},
  ru:{/* kısaltılmış */ ...window.ZI?.en, connect:"Подключить кошелёк"},
  pl:{/* kısaltılmış */ ...window.ZI?.en, connect:"Połącz portfel"}
};

function currentLang(){
  try{ return localStorage.getItem("zuzu_lang") || "en"; }catch{ return "en"; }
}
function applyLang(lang){
  if(!window.ZI[lang]) lang="en";
  try{ localStorage.setItem("zuzu_lang",lang);}catch{}
  document.querySelectorAll("[data-i]").forEach(el=>{
    const k = el.getAttribute("data-i");
    if (window.ZI[lang] && window.ZI[lang][k]) el.innerHTML = window.ZI[lang][k];
  });
  const btn = document.getElementById("connectBtn");
  if(btn){ btn.dataset.iLabel = window.ZI[lang].connect; if(!btn.classList.contains("connected")) btn.textContent = window.ZI[lang].connect; }
}
window.applyLang = applyLang;
window.currentLang = currentLang;
