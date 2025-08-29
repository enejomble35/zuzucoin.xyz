/* ================================
   I18N – Çoklu dil (varsayılan EN)
   HTML'de data-i18n="key" olanları çevirir.
================================== */
function initI18n(){
  const dict = {
    en: {
      heroTitle: "ZUZU — Robotic Hedgehog",
      heroSub: "Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high utility.",
      btnNft: "NFT Rewards",
      btnCollection: "Collection Page",
      contract: "Contract",
      days: "DAYS", hours: "HOURS", minutes: "MINUTES", seconds: "SECONDS",
      supportedEx: "Supported Exchanges",
      willBeListed: "Will be listed soon",
      tokenomics: "Tokenomics (Visualized)",
      tokenomicsDesc: "Fair distribution, sustainable reward economy & reserve plan.",
      legCommunity:"Community", legLiquidity:"Liquidity", legTeam:"Team", legTreasury:"Treasury", legStaking:"Staking Rewards", legPartners:"Advisors/Partners"
    },
    tr: {
      heroTitle: "ZUZU — Geleceğin Robotic Kirpisi",
      heroSub: "Stake et ve <b>ZUZU Maskot NFT</b>'lerini kazan. Sınırlı arz, yüksek utility.",
      btnNft: "NFT Ödülleri",
      btnCollection: "Koleksiyon Sayfası",
      contract: "Kontrat",
      days: "GÜN", hours: "SAAT", minutes:"DAKİKA", seconds:"SANİYE",
      supportedEx: "Desteklenen Borsalar",
      willBeListed: "Yakında listelenecek",
      tokenomics: "Tokonomi (Görselleştirilmiş)",
      tokenomicsDesc: "Adil dağıtım, sürdürülebilir ödül ekonomisi ve rezerv planı.",
      legCommunity:"Topluluk", legLiquidity:"Likidite", legTeam:"Ekip", legTreasury:"Hazine", legStaking:"Staking Ödülleri", legPartners:"Danışman/Partner"
    },
    ru: { heroTitle:"ZUZU — Роботический ёж", heroSub:"Стейк и выигрывай <b>маскот NFT ZUZU</b>. Ограниченная эмиссия, высокая полезность.", btnNft:"NFT Награды", btnCollection:"Страница коллекции", contract:"Контракт", days:"ДНИ", hours:"ЧАСЫ", minutes:"МИНУТЫ", seconds:"СЕКУНДЫ", supportedEx:"Поддерживаемые биржи", willBeListed:"Скоро будет листинг", tokenomics:"Токеномика (визуально)", tokenomicsDesc:"Справедливое распределение, устойчивая экономика вознаграждений и резерв.", legCommunity:"Сообщество", legLiquidity:"Ликвидность", legTeam:"Команда", legTreasury:"Казна", legStaking:"Награды стейкинга", legPartners:"Советники/Партнеры" },
    hi: { heroTitle:"ZUZU — रोबोटिक हेजहॉग", heroSub:"स्टेक करें और <b>ZUZU मास्कॉट NFT</b> जीतें। सीमित सप्लाई, उच्च यूटिलिटी।", btnNft:"NFT रिवार्ड्स", btnCollection:"कलेक्शन पेज", contract:"कॉन्ट्रैक्ट", days:"दिन", hours:"घंटे", minutes:"मिनट", seconds:"सेकंड", supportedEx:"समर्थित एक्सचेंज", willBeListed:"जल्द सूचीबद्ध होगा", tokenomics:"टोकनॉमिक्स (दृश्य)", tokenomicsDesc:"न्यायसंगत वितरण, टिकाऊ रिवार्ड अर्थव्यवस्था और रिज़र्व योजना।", legCommunity:"कम्युनिटी", legLiquidity:"लिक्विडिटी", legTeam:"टीम", legTreasury:"ट्रेज़री", legStaking:"स्टेकिंग रिवार्ड्स", legPartners:"एडवाइज़र्स/पार्टनर्स" },
    zh: { heroTitle:"ZUZU — 机械刺猬", heroSub:"质押并赢取 <b>ZUZU 吉祥物 NFT</b>。供给有限，实用性高。", btnNft:"NFT 奖励", btnCollection:"收藏页面", contract:"合约", days:"天", hours:"小时", minutes:"分钟", seconds:"秒", supportedEx:"支持的交易所", willBeListed:"即将上线", tokenomics:"代币经济（可视化）", tokenomicsDesc:"公平分配、可持续奖励经济与储备计划。", legCommunity:"社区", legLiquidity:"流动性", legTeam:"团队", legTreasury:"金库", legStaking:"质押奖励", legPartners:"顾问/合作伙伴" },
    es: { heroTitle:"ZUZU — Erizo Robótico", heroSub:"Haz stake y gana <b>NFT Mascota ZUZU</b>. Suministro limitado, gran utilidad.", btnNft:"Recompensas NFT", btnCollection:"Página de Colección", contract:"Contrato", days:"DÍAS", hours:"HORAS", minutes:"MINUTOS", seconds:"SEGUNDOS", supportedEx:"Exchanges Soportados", willBeListed:"Se listará pronto", tokenomics:"Tokenomics (Visualizado)", tokenomicsDesc:"Distribución justa, economía de recompensas sostenible y plan de reserva.", legCommunity:"Comunidad", legLiquidity:"Liquidez", legTeam:"Equipo", legTreasury:"Tesorería", legStaking:"Recompensas de Staking", legPartners:"Asesores/Socios" },
    pt: { heroTitle:"ZUZU — Ouriço Robótico", heroSub:"Faça stake e ganhe <b>NFT Mascote ZUZU</b>. Oferta limitada, alta utilidade.", btnNft:"Recompensas NFT", btnCollection:"Página da Coleção", contract:"Contrato", days:"DIAS", hours:"HORAS", minutes:"MINUTOS", seconds:"SEGUNDOS", supportedEx:"Exchanges Suportadas", willBeListed:"Será listado em breve", tokenomics:"Tokenomics (Visualizado)", tokenomicsDesc:"Distribuição justa, economia de recompensas sustentável e plano de reserva.", legCommunity:"Comunidade", legLiquidity:"Liquidez", legTeam:"Equipe", legTreasury:"Tesouraria", legStaking:"Recompensas de Staking", legPartners:"Conselheiros/Parceiros" }
  };

  const select = document.getElementById("langSelect");
  if (!select) return;

  // Varsayılan EN
  const apply = (lng="en")=>{
    const table = dict[lng] || dict.en;
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const key = el.getAttribute("data-i18n");
      if (table[key]) el.innerHTML = table[key];
    });
    // sayac label’ları güncellendiğinde görünüm bozulmasın
  };

  select.addEventListener("change", ()=>apply(select.value));
  apply("en"); // ilk açılış İngilizce
}

/* ================================
   TOKENOMICS – donut çizimi (canvas)
================================== */
function drawTokenomics(){
  const c = document.getElementById("tokenomicsChart");
  if (!c) return;
  const ctx = c.getContext("2d");
  const W = c.width, H = c.height;
  const cx = W/2 - 10, cy = H/2 + 6, r = 110, inner = 70;

  // Dilimler: %’ler ve renkler örnek görselle uyumlu
  const parts = [
    { p:35, color:"#8c76ff" }, // community
    { p:20, color:"#1fd4e7" }, // liquidity
    { p:15, color:"#7bff9b" }, // team
    { p:10, color:"#ffb648" }, // treasury
    { p:15, color:"#d77cff" }, // staking
    { p:5,  color:"#ff6a6a" }, // partners
  ];
  ctx.clearRect(0,0,W,H);

  // dış gölge
  ctx.beginPath();
  ctx.arc(cx,cy,r+16,0,Math.PI*2);
  ctx.fillStyle="rgba(0,0,0,.18)";
  ctx.fill();

  // donut
  let start = -Math.PI/2;
  parts.forEach(seg=>{
    const ang = (seg.p/100)*Math.PI*2;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,r,start,start+ang);
    ctx.closePath();
    ctx.fillStyle=seg.color;
    ctx.fill();
    start+=ang;
  });

  // iç delik
  ctx.beginPath();
  ctx.arc(cx,cy,inner,0,Math.PI*2);
  ctx.fillStyle="#0e1522";
  ctx.fill();

  // orta metin
  ctx.fillStyle="#cfe0ff";
  ctx.font="700 18px Inter, system-ui";
  ctx.textAlign="center";
  ctx.fillText("Total Supply", cx, cy-6);
  ctx.font="800 22px Inter, system-ui";
  ctx.fillText("1,000,000,000", cx, cy+22);
}
