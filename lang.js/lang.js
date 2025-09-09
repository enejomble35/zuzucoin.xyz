/* ZUZU — i18n minimal */
(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  // Metinler
  const T = {
    en:{
      "nav.presale":"Pre-Sale","nav.stake":"Stake","nav.rewards":"NFT Rewards","nav.roadmap":"Roadmap","nav.tokenomics":"Tokenomics","nav.sim":"Stake Simulator ↗","nav.connect":"Connect Wallet",
      "hero.chip":"Pre-Sale • Stake to Win NFT","hero.lead":"Stake and win ZUZU Maskot NFT. Limited supply, high utility.",
      "timer.days":"DAYS","timer.hours":"HOURS","timer.mins":"MINUTES","timer.secs":"SECONDS",
      "cta.stake":"Start Staking","cta.rewards":"NFT Rewards",
      "buy.title":"Buy ZUZU","buy.buy":"Buy Now",
      "ref.title":"Invite & Earn","ref.desc":"Share your link. Each purchase via your link earns bonus ZUZU.","ref.copy":"Copy",
      "nft.chip":"Mascot Collection","nft.title":"ZUZU Mascot NFTs","nft.lead":"Stake to win rare ZUZU Mascots.",
      "stake.title":"Stake — Pro Lock & Earn","stake.lead":"Choose a lock tier and earn APY + NFT boost.",
      "tok.title":"Tokenomics","road.title":"Roadmap","road.lead":"Clear plan focused on community, staking, NFT drops, listings.",
      "ex.note":"Incoming listings (TBA)"
    },
    tr:{
      "nav.presale":"Ön Satış","nav.stake":"Stake","nav.rewards":"NFT Ödülleri","nav.roadmap":"Yol Haritası","nav.tokenomics":"Tokonomi","nav.sim":"Stake Simülatörü ↗","nav.connect":"Cüzdan Bağla",
      "hero.chip":"Ön Satış • Stake ile NFT Kazan","hero.lead":"Stake et ve ZUZU Maskot NFT kazan. Sınırlı arz, yüksek fayda.",
      "timer.days":"GÜN","timer.hours":"SAAT","timer.mins":"DAKİKA","timer.secs":"SANİYE",
      "cta.stake":"Stake Etmeye Başla","cta.rewards":"NFT Ödülleri",
      "buy.title":"ZUZU Satın Al","buy.buy":"Satın Al",
      "ref.title":"Davet Et & Kazan","ref.desc":"Bağlantını paylaş. Senin linkinle yapılan her satın alma için bonus ZUZU kazanırsın.","ref.copy":"Kopyala",
      "nft.chip":"Maskot Koleksiyonu","nft.title":"ZUZU Maskot NFT’leri","nft.lead":"Nadir ZUZU Maskotlarını kazanmak için stake et.",
      "stake.title":"Stake — Pro Kilit & Kazanç","stake.lead":"Bir kilit seviyesi seç ve APY + NFT bonusu kazan.",
      "tok.title":"Tokonomi","road.title":"Yol Haritası","road.lead":"Topluluk, staking, NFT dağıtımları ve listelemelere odaklı net plan.",
      "ex.note":"Yakında listelenecek (TBA)"
    },
    fr:{ "nav.presale":"Pré-vente","nav.stake":"Stake","nav.rewards":"Récompenses NFT","nav.roadmap":"Feuille de route","nav.tokenomics":"Tokenomics","nav.sim":"Simulateur ↗","nav.connect":"Connecter",
      "hero.chip":"Pré-vente • Stake pour gagner NFT","hero.lead":"Stake et gagne le NFT Mascotte ZUZU.",
      "timer.days":"JOURS","timer.hours":"HEURES","timer.mins":"MINUTES","timer.secs":"SECONDES",
      "cta.stake":"Commencer le stake","cta.rewards":"Récompenses NFT",
      "buy.title":"Acheter ZUZU","buy.buy":"Acheter",
      "ref.title":"Inviter & Gagner","ref.desc":"Partage ton lien. Chaque achat via ton lien gagne des ZUZU bonus.","ref.copy":"Copier",
      "nft.chip":"Collection Mascotte","nft.title":"NFTs Mascotte ZUZU","nft.lead":"Stake pour gagner des mascottes rares.",
      "stake.title":"Stake — Verrou Pro & Gains","stake.lead":"Choisis un verrou et gagne APY + bonus NFT.",
      "tok.title":"Tokenomics","road.title":"Feuille de route","road.lead":"Plan clair axé communauté, staking, NFTs, listings.",
      "ex.note":"Listings à venir (TBA)"
    },
    es:{ /* kısaltılmış – EN metinleri yeterli değilse genişletirsin */ ...T.en, "nav.connect":"Conectar Billetera"},
    ru:{ ...T.en, "nav.connect":"Подключить кошелёк"},
    pl:{ ...T.en, "nav.connect":"Połącz portfel"}
  };

  const FLAGS = { en:"flags/en.png", tr:"flags/tr.png", fr:"flags/fr.png", es:"flags/es.png", ru:"flags/ru.png", pl:"flags/pt.png" };

  function setText(node, key){
    const lang = localStorage.getItem("zuzu_lang") || "en";
    const dict = T[lang] || T.en;
    if(key && dict[key]) node.textContent = dict[key];
  }

  window.applyLang = function(lang){
    if(!(lang in T)) lang = "en";
    localStorage.setItem("zuzu_lang", lang);
    // bayrak ve kod
    const f = FLAGS[lang] || FLAGS.en;
    const flagImg = document.getElementById("langFlag");
    const codeEl  = document.getElementById("langCode");
    if(flagImg) flagImg.src = f;
    if(codeEl)  codeEl.textContent = lang.toUpperCase();

    // data-i18n tüm öğeler
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      setText(el, el.getAttribute("data-i18n"));
    });
  };

  // UI – menü tıklarını bağla
  window.addEventListener("DOMContentLoaded", ()=>{
    const btn = $("#langBtn"), menu = $("#langMenu");
    btn?.addEventListener("click", ()=> menu?.classList.toggle("show"));
    $$(".lang-flag").forEach(el=>{
      el.addEventListener("click", ()=>{
        applyLang(el.dataset.lang);
        menu?.classList.remove("show");
      });
    });
    // ilk yükleme
    applyLang(localStorage.getItem("zuzu_lang") || "en");
  });
})();
