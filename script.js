/***** CONFIG *****/
const CFG = {
  NAME: "ZUZU",
  RECEIVER_BEP20: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3", // senin EVM adresin (BSC için de aynı)
  USDT: {
    address: "0x55d398326f99059fF775485246999027B3197955", // BSC-USDT (BEP20)
    decimals: 18
  },
  BSC: {
    chainId: 56,
    chainHex: "0x38",
    rpc: "https://bsc-dataseed.binance.org/",
    symbol: "BNB",
    name: "BNB Smart Chain",
    explorer: "https://bscscan.com"
  },
  STAGES: [
    { name:"Stage 1", price: 0.000002 },
    { name:"Stage 2", price: 0.000003 },
    { name:"Stage 3", price: 0.000004 },
    { name:"Stage 4", price: 0.000005 }
  ],
  END: "2025-09-30T21:00:00+03:00",
  SOCIALS:{
    twitter:"https://twitter.com/",
    telegram:"https://t.me/",
    discord:"https://discord.gg/"
  }
};

// i18n metinleri
const I18N = {
  tr:{ connect:"Cüzdan Bağla", hero_title:"ZUZU IS HERE", hero_sub:"The next great meme coin has landed",
       day:"Gün",hour:"Saat",min:"Dakika",sec:"Saniye", presale:"Ön Satış Aşaması",
       price:"Fiyat", total:"Toplam", buy:"USDT (BEP20) ile Satın Al",
       about_t:"Hakkında", token_t:"Tokenomics", road_t:"Yol Haritası",
       r1:"Q3 2025 — Presale, topluluk büyütme, audit başlangıcı",
       r2:"Q4 2025 — DEX listeleme, CEX başvuruları",
       r3:"Q1 2026 — CEX listelemeler (MEXC vb.), staking/utility",
       about:"ZUZU; meme maskot enerjisiyle, minimal & ciddi duruşu birlikte taşıyan, topluluk odaklı bir coin. Presale ödemeleri USDT (BEP20) ile akıllı sözleşmesiz, doğrudan projenin kasasına gider. CEX başvuruları presale bitiminde yapılır."
     },
  en:{ connect:"Connect Wallet", hero_title:"ZUZU IS HERE", hero_sub:"The next great meme coin has landed",
       day:"Days",hour:"Hours",min:"Minutes",sec:"Seconds", presale:"Presale Stage",
       price:"Price", total:"Total", buy:"Buy with USDT (BEP20)",
       about_t:"About", token_t:"Tokenomics", road_t:"Roadmap",
       r1:"Q3 2025 — Presale, community growth, audit start",
       r2:"Q4 2025 — DEX listing, CEX applications",
       r3:"Q1 2026 — CEX listings (MEXC etc.), staking/utility",
       about:"ZUZU blends meme energy with a minimal & serious look. Presale payments go directly to the treasury in USDT (BEP20). CEX applications after presale."
     },
  pt:{ connect:"Conectar Carteira", hero_title:"ZUZU CHEGOU", hero_sub:"A próxima grande meme coin",
       day:"Dias",hour:"Horas",min:"Minutos",sec:"Segundos", presale:"Fase da Pré-venda",
       price:"Preço", total:"Total", buy:"Comprar com USDT (BEP20)",
       about_t:"Sobre", token_t:"Tokenomics", road_t:"Roadmap",
       r1:"Q3 2025 — Pré-venda, comunidade, auditoria",
       r2:"Q4 2025 — Listagem DEX, aplicações CEX",
       r3:"Q1 2026 — Listagens CEX, staking/utilidade",
       about:"ZUZU combina energia de meme com um visual minimal e sério. Pagamentos vão direto ao tesouro em USDT (BEP20)."
     },
  ru:{ connect:"Подключить кошелёк", hero_title:"ZUZU ЗДЕСЬ", hero_sub:"Следующая топовая мем-монета",
       day:"Дни",hour:"Часы",min:"Мин",sec:"Сек", presale:"Этап пресейла",
       price:"Цена", total:"Итого", buy:"Купить за USDT (BEP20)",
       about_t:"О проекте", token_t:"Токеномика", road_t:"Дорожная карта",
       r1:"Q3 2025 — пресейл, рост сообщества, аудит",
       r2:"Q4 2025 — листинг DEX, заявки CEX",
       r3:"Q1 2026 — листинги CEX, стейкинг/утилити",
       about:"ZUZU сочетает энергию мема и минималистичный серьёзный стиль. Оплата USDT (BEP20) идёт прямо в казну."
     },
  zh:{ connect:"连接钱包", hero_title:"ZUZU 已到来", hero_sub:"下一款热门 Meme 代币",
       day:"天",hour:"小时",min:"分钟",sec:"秒", presale:"预售阶段",
       price:"价格", total:"合计", buy:"用 USDT (BEP20) 购买",
       about_t:"关于", token_t:"代币经济", road_t:"路线图",
       r1:"2025 Q3—预售、社区增长、审计启动",
       r2:"2025 Q4—DEX上线、CEX申请",
       r3:"2026 Q1—CEX上线、质押/用例",
       about:"ZUZU 结合meme能量与极简严肃风格。预售支付通过 USDT(BEP20) 直接进入金库。"
     },
  hi:{ connect:"वॉलेट कनेक्ट करें", hero_title:"ZUZU आ चुका है", hero_sub:"अगला बड़ा मीम कॉइन",
       day:"दिन",hour:"घंटे",min:"मिनट",sec:"सेकंड", presale:"प्रीसेल स्टेज",
       price:"कीमत", total:"कुल", buy:"USDT (BEP20) से खरीदें",
       about_t:"परिचय", token_t:"टोकनोमिक्स", road_t:"रोडमैप",
       r1:"Q3 2025 — प्रीसेल, समुदाय वृद्धि, ऑडिट",
       r2:"Q4 2025 — DEX लिस्टिंग, CEX आवेदन",
       r3:"Q1 2026 — CEX लिस्टिंग, स्टेकिंग/यूटिलिटी",
       about:"ZUZU मीम एनर्जी और मिनिमल/सीरियस स्टाइल का मिश्रण है। प्रीसेल भुगतान USDT (BEP20) से सीधे ट्रेज़री में जाते हैं।"
     }
};

/***** UI INIT *****/
const $ = s => document.querySelector(s);
$("#y").textContent = new Date().getFullYear();
$("#tw").href = CFG.SOCIALS.twitter;
$("#tg").href = CFG.SOCIALS.telegram;
$("#dc").href = CFG.SOCIALS.discord;

// Stage list
const stageSel = $("#stage");
CFG.STAGES.forEach((st,i)=>{
  const o = document.createElement("option");
  o.value = i; o.textContent = `${st.name} — ${st.price.toFixed(6)} USDT / ZUZU`;
  stageSel.appendChild(o);
});
let currentPrice = CFG.STAGES[0].price;

// Tokenomics bars
const TOKE = [
  {name:"Presale", pct:45},
  {name:"Liquidity", pct:25},
  {name:"Marketing", pct:15},
  {name:"Team", pct:10},
  {name:"Airdrop", pct:5}
];
const tWrap = $("#tokenomics");
TOKE.forEach(t=>{
  const row = document.createElement("div");
  row.className="bar";
  row.innerHTML = `<span>${t.name} <b>${t.pct}%</b></span><span style="flex:1"><i style="width:${t.pct}%"></i></span>`;
  tWrap.appendChild(row);
});

// Countdown
function tick(){
  const end = new Date(CFG.END).getTime();
  const now = Date.now();
  let diff = Math.max(0, end-now);
  const d = Math.floor(diff/86400000); diff%=86400000;
  const h = Math.floor(diff/3600000);   diff%=3600000;
  const m = Math.floor(diff/60000);     diff%=60000;
  const s = Math.floor(diff/1000);
  $("#d").textContent=d; $("#h").textContent=h; $("#m").textContent=m; $("#s").textContent=s;
}
setInterval(tick,1000); tick();

// price calc
const qty = $("#qty"), priceEl = $("#price"), totalEl = $("#total");
function recalc(){
  currentPrice = CFG.STAGES[parseInt(stageSel.value||0)].price;
  priceEl.textContent = currentPrice.toFixed(6);
  const q = Number(qty.value||0);
  totalEl.textContent = (q*currentPrice).toFixed(6);
}
stageSel.onchange = recalc; qty.oninput = recalc; recalc();

/***** WALLET + BUY *****/
let web3Modal, provider, ethersProvider, signer, userAddr;

async function ensureBSC(){
  const cid = await ethersProvider.getNetwork().then(n=>n.chainId);
  if(cid !== CFG.BSC.chainId){
    try{
      await provider.request({ method:'wallet_switchEthereumChain', params:[{chainId: CFG.BSC.chainHex}] });
    }catch(e){
      // add chain if missing
      await provider.request({ method:'wallet_addEthereumChain', params:[{
        chainId: CFG.BSC.chainHex, chainName: CFG.BSC.name,
        nativeCurrency:{name:"BNB",symbol:"BNB",decimals:18},
        rpcUrls:[CFG.BSC.rpc], blockExplorerUrls:[CFG.BSC.explorer]
      }]} );
    }
  }
}
async function connect() {
  const providerOptions = {
    walletconnect: {
      package: window.WalletConnectProvider.default,
      options: { rpc: { [CFG.BSC.chainId]: CFG.BSC.rpc } }
    }
  };
  web3Modal = new window.Web3Modal.default({ cacheProvider:false, providerOptions });
  provider = await web3Modal.connect();
  ethersProvider = new ethers.providers.Web3Provider(provider);
  signer = ethersProvider.getSigner();
  await ensureBSC();
  userAddr = await signer.getAddress();
  $("#btnConnect").innerText = userAddr.slice(0,6)+"..."+userAddr.slice(-4);
}

async function buy(){
  if(!signer){ alert(txt('needWallet')); return; }
  await ensureBSC();
  const q = Number(qty.value||0);
  if(q<=0){ alert(txt('enterQty')); return; }
  const cost = q * currentPrice;

  // USDT transfer (BEP20)
  const abi = ["function transfer(address to,uint256 amount) public returns (bool)","function decimals() view returns(uint8)"];
  const usdt = new ethers.Contract(CFG.USDT.address, abi, signer);
  const dec = await usdt.decimals().catch(()=>CFG.USDT.decimals);
  const amount = ethers.utils.parseUnits(cost.toString(), dec);

  try{
    const tx = await usdt.transfer(CFG.RECEIVER_BEP20, amount);
    $("#txinfo").textContent = `Tx: ${tx.hash}`;
    await tx.wait();
    $("#txinfo").textContent = `✅ Başarılı! Tx: ${tx.hash}`;
  }catch(e){
    console.error(e);
    alert(e?.message || "İşlem iptal edildi.");
  }
}

$("#btnConnect").onclick = connect;
$("#btnBuy").onclick = buy;

/***** LANG *****/
function txt(k){
  const lang = $("#lang").value || "tr";
  return (I18N[lang] && I18N[lang][k]) || (I18N.tr[k]||k);
}
function applyLang(){
  const lang = $("#lang").value || "tr";
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    el.textContent = I18N[lang][el.dataset.i18n] || el.textContent;
  });
}
$("#lang").onchange = applyLang; applyLang();

// Küçük UX: cache-bypass için
(function bustCache(){
  const v = Math.floor(Date.now()/3600000); // saatlik versiyon
  const l = document.querySelectorAll('link[rel="stylesheet"]');
  l.forEach(n=>{ n.href = n.href.split('?')[0] + '?v=' + v; });
})();
