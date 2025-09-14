const I = {
  fr:{nav_presale:"Pré-vente",nav_stake:"Stake",nav_nft:"Récompenses NFT",nav_roadmap:"Feuille de route",nav_token:"Tokenomics",connect:"Connecter le Wallet",
      hero_badge:"Pré-vente • Stake pour gagner un NFT",hero_title:"ZUZU — Hérisson Robotique 🦔⚡",
      hero_lead:"Stake et gagne un <b>NFT Mascotte ZUZU</b>. Offre limitée, forte <b>utilité</b>.",
      cta_stake:"Commencer le Stake",cta_nft:"Récompenses NFT",
      days:"JOURS",hours:"HEURES",mins:"MINUTES",secs:"SECONDES",
      presale_title:"Pré-vente — Compte à rebours",presale_lead:"Prépare-toi ! <b>Allocation limitée</b> à prix communauté.",
      amount:"Montant (ZUZU)",cost:"Coût :",buy:"Acheter",exchanges:"Bourses prises en charge",
      stake_title:"Stake Pro — Verrouille, Gagne, Reçois un NFT ✨",stake_lead:"Verrouille ton ZUZU, gagne <b>APY + BOOST NFT</b>.",
      token_title:"Tokenomics (Visualisé)"},
  pt:{nav_presale:"Pré-venda",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Roteiro",nav_token:"Tokenomics",connect:"Conectar Carteira",
      hero_badge:"Pré-venda • Stake para ganhar NFT",hero_title:"ZUZU — Ouriço Robótico 🦔⚡",
      hero_lead:"Faça stake e ganhe um <b>NFT Mascote ZUZU</b>. Oferta limitada, alta <b>utilidade</b>.",
      cta_stake:"Começar Stake",cta_nft:"Recompensas NFT",
      days:"DIAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",
      presale_title:"Pré-venda — Contagem regressiva",presale_lead:"Prepare-se! <b>Alocação limitada</b> com preço da comunidade.",
      amount:"Quantidade (ZUZU)",cost:"Custo:",buy:"Comprar",exchanges:"Exchanges suportadas",
      stake_title:"Stake Pro — Trave, Ganhe, Receba NFT ✨",stake_lead:"Trave seu ZUZU e ganhe <b>APY + BOOST NFT</b>.",
      token_title:"Tokenomics (Visualizado)"},
  es:{nav_presale:"Pre-venta",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Hoja de ruta",nav_token:"Tokenomics",connect:"Conectar Billetera",
      hero_badge:"Pre-venta • Stake para ganar un NFT",hero_title:"ZUZU — Erizo Robótico 🦔⚡",
      hero_lead:"Haz stake y gana un <b>NFT Mascota ZUZU</b>. Oferta limitada, alta <b>utilidad</b>.",
      cta_stake:"Empezar Stake",cta_nft:"Recompensas NFT",
      days:"DÍAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",
      presale_title:"Pre-venta — Cuenta regresiva",presale_lead:"¡Prepárate! <b>Asignación limitada</b> a precio comunidad.",
      amount:"Cantidad (ZUZU)",cost:"Costo:",buy:"Comprar",exchanges:"Exchanges compatibles",
      stake_title:"Stake Pro — Bloquea, Gana, Obtén NFT ✨",stake_lead:"Bloquea tu ZUZU y gana <b>APY + BOOST NFT</b>.",
      token_title:"Tokenomics (Visualizado)"},
  ru:{nav_presale:"Предпродажа",nav_stake:"Стейкинг",nav_nft:"NFT награды",nav_roadmap:"Дорожная карта",nav_token:"Токеномика",connect:"Подключить кошелёк",
      hero_badge:"Предпродажа • Стейкинг для NFT",hero_title:"ZUZU — Робо-Ёж 🦔⚡",
      hero_lead:"Стейкай и получай <b>маскот NFT ZUZU</b>. Ограниченное предложение, высокая <b>полезность</b>.",
      cta_stake:"Начать стейкинг",cta_nft:"NFT награды",
      days:"ДНИ",hours:"ЧАСЫ",mins:"МИНУТЫ",secs:"СЕКУНДЫ",
      presale_title:"Предпродажа — Обратный отсчёт",presale_lead:"Готовься! <b>Ограниченная аллокация</b> по цене сообщества.",
      amount:"Количество (ZUZU)",cost:"Стоимость:",buy:"Купить",exchanges:"Поддерживаемые биржи",
      stake_title:"Stake Pro — Заморозь, Заработай, Получи NFT ✨",stake_lead:"Заморозь ZUZU и получай <b>APY + NFT BOOST</b>.",
      token_title:"Токеномика (визуально)"}
};

(function initLang(){
  const LS="zuzu_lang";
  const saved=localStorage.getItem(LS)||"fr"; // varsayılan FR
  apply(saved);

  const langBtn=document.getElementById("langBtn");
  const langMenu=document.getElementById("langMenu");
  langBtn?.addEventListener("click",e=>{e.stopPropagation();langMenu?.classList.toggle("show");});
  document.addEventListener("click",e=>{if(!langMenu?.contains(e.target))langMenu?.classList.remove("show");});
  document.querySelectorAll(".lang-opt").forEach(b=>b.addEventListener("click",()=>{
    const l=b.dataset.lang; apply(l); localStorage.setItem(LS,l); langMenu?.classList.remove("show");
  }));

  function apply(lang){
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
