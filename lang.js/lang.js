(function(){
  const dict = {
    en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",
      connect:"Connect Wallet",hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
      hero_lead:"Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high <b>utility</b>.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",
      amount:"Amount (ZUZU)",w1:"Week 1 (Cheapest)",w2:"Week 2",w3:"Week 3",w4:"Week 4 (Last Chance)",cost:"Cost:",
      collection_page:"Collection Page",contract:"Contract:",stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",
      stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>. Early stakers get badge & airdrop priority.",
      road_lead:"Clear plan focused on community, staking, NFT drops, listings.",
      inv_title:"Invite & Earn",inv_lead:"Share your link. When friends buy in pre-sale you both earn bonus.",copy:"Copy"},
    tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",
      connect:"Cüzdan Bağla",hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",
      hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazırlan! <b>Sınırlı tahsis</b>, topluluk fiyatı.",
      amount:"Miktar (ZUZU)",w1:"1. Hafta (En Ucuz)",w2:"2. Hafta",w3:"3. Hafta",w4:"4. Hafta (Son Şans)",cost:"Maliyet:",
      collection_page:"Koleksiyon Sayfası",contract:"Sözleşme:",stake_title:"Stake Pro — Kilitle, Kazan, NFT Al ✨",
      stake_lead:"ZUZU’yu kilitle, <b>APY + NFT BOOST</b> kazan. Early rozet ve airdrop önceliği.",
      road_lead:"Topluluk, staking, NFT ve listelemelere odaklı net plan.",
      inv_title:"Davet Et & Kazan",inv_lead:"Linkini paylaş. Arkadaşların ön satışta aldıkça ikiniz de bonus kazanırsınız.",copy:"Kopyala"},
    fr:{connect:"Connecter le wallet"}, es:{connect:"Conectar Wallet"},
    ru:{connect:"Подключить кошелек"}, pl:{connect:"Połącz portfel"}
  };

  function applyLang(code){
    const d = dict[code] || dict.en;
    document.querySelectorAll("[data-i]").forEach(el=>{
      const k = el.getAttribute("data-i"); if (d[k]) el.innerHTML = d[k];
    });
    const cb = document.getElementById("connectBtn"); if (cb && d.connect) cb.textContent = d.connect;
    localStorage.setItem("z_lang", code);
  }
  window.applyLang = applyLang;

  // dropdown bağla
  const flagBtn = document.getElementById("langBtn");
  const flagImg = document.getElementById("langFlag");
  const flagCode= document.getElementById("langCode");
  const menu    = document.getElementById("langMenu");
  function setFlag(code){
    const map={en:"en.png",tr:"tr.png",fr:"fr.png",es:"es.png",ru:"ru.png",pl:"pt.png"};
    if (flagImg) flagImg.src = "flags/"+(map[code]||"en.png");
    if (flagCode) flagCode.textContent = code.toUpperCase();
  }
  flagBtn?.addEventListener("click", ()=>menu?.classList.toggle("show"));
  document.addEventListener("click", e=>{ if(menu && !menu.contains(e.target) && !flagBtn.contains(e.target)) menu.classList.remove("show"); });
  document.querySelectorAll(".lang-flag").forEach(b=>{
    b.addEventListener("click", ()=>{
      const lang = b.dataset.lang || "en";
      setFlag(lang); applyLang(lang); menu?.classList.remove("show");
    });
  });

  // ilk yükleme
  const saved = localStorage.getItem("z_lang") || "en";
  setFlag(saved); applyLang(saved);
})();
