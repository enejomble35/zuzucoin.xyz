/***** CONFIG *****/
const RECEIVER = "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3"; // senin cüzdan
const USDT_BEP20 = "0x55d398326f99059fF775485246999027B3197955"; // BSC USDT
const BSC_PARAMS = {
  chainId: "0x38", chainName: "BNB Smart Chain",
  rpcUrls: ["https://bsc-dataseed.binance.org/"],
  nativeCurrency: { name:"BNB", symbol:"BNB", decimals:18 },
  blockExplorerUrls: ["https://bscscan.com"]
};
// İsteğe bağlı gerçek toplam için BscScan anahtarı (yoksa mock işler)
const BSCSCAN_KEY = ""; // istersen buraya anahtarını gir
/******************/

// UI refs
const p = document.getElementById("p");
const t = document.getElementById("t");
const qty = document.getElementById("qty");
const stageSel = document.getElementById("stageSel");
const buyBtn = document.getElementById("buyBtn");
const connectBtn = document.getElementById("connectBtn");
const receiverInput = document.getElementById("receiver");
const copyRecv = document.getElementById("copyRecv");
const receiverShort = document.getElementById("receiverShort");
const raisedTxt = document.getElementById("raisedTxt");
const raisedBar = document.getElementById("raisedBar");
const qrCanvas = document.getElementById("qr");
const chips = document.querySelectorAll(".chip");
const refLink = document.getElementById("refLink");
const copyRef = document.getElementById("copyRef");
const langSel = document.getElementById("langSel");

// set receiver + QR
receiverInput.value = RECEIVER;
receiverShort.textContent = RECEIVER.slice(0,6)+"…"+RECEIVER.slice(-4);
QRCode.toCanvas(qrCanvas, RECEIVER, {margin:1, width:220, color:{dark:"#0ef", light:"#0b1226"}}, ()=>{});

// price compute
function recompute(){
  const price = parseFloat(stageSel.value);
  const q = parseInt(qty.value||0,10);
  p.textContent = price.toFixed(6);
  t.textContent = (price*q).toFixed(6);
}
recompute();
stageSel.onchange = recompute; qty.oninput = recompute;
chips.forEach(c=>c.onclick=()=>{ qty.value = c.dataset.q; recompute(); });

// countdown (40 gün demo)
const endAt = Date.now() + 40*24*3600*1000;
const d=document.getElementById("d"), h=document.getElementById("h"), m=document.getElementById("m"), s=document.getElementById("s");
setInterval(()=>{
  const left = Math.max(0, endAt-Date.now());
  const dd = Math.floor(left/86400000);
  const hh = Math.floor((left%86400000)/3600000);
  const mm = Math.floor((left%3600000)/60000);
  const ss = Math.floor((left%60000)/1000);
  d.textContent=String(dd).padStart(2,"0");
  h.textContent=String(hh).padStart(2,"0");
  m.textContent=String(mm).padStart(2,"0");
  s.textContent=String(ss).padStart(2,"0");
},1000);

// tokenomics donut
new Chart(document.getElementById("donut"),{
  type:"doughnut",
  data:{labels:["Presale","Liquidity","Marketing","Team","Airdrop"],
    datasets:[{data:[45,25,15,10,5],
      backgroundColor:["#16ffbd","#5cf3ff","#7a7dff","#ffb366","#fd5d86"],
      borderWidth:0}]},
  options:{cutout:"70%"}
});

// REF system
const url = new URL(location.href);
const fromRef = url.searchParams.get("ref");
if(fromRef && /^0x[a-fA-F0-9]{40}$/.test(fromRef)) localStorage.setItem("zuzu_ref", fromRef);
function buildRefLink(account=""){ 
  const base = location.origin + location.pathname;
  const target = account||"YOUR_WALLET";
  refLink.value = `${base}?ref=${target}`;
}
copyRef.onclick = ()=>{ navigator.clipboard.writeText(refLink.value); copyRef.textContent="Kopyalandı"; setTimeout(()=>copyRef.textContent="Linki Kopyala",1200) }

// Raised (BscScan veya mock)
async function fetchRaised(){
  try{
    if(!BSCSCAN_KEY) throw new Error("no-key");
    const url = `https://api.bscscan.com/api?module=account&action=tokentx&address=${RECEIVER}&contractaddress=${USDT_BEP20}&sort=asc&apikey=${BSCSCAN_KEY}`;
    const r = await fetch(url); const j = await r.json();
    let sum=0n;
    if(j.status==="1"){
      j.result.forEach(tx=>{ if(tx.to.toLowerCase()===RECEIVER.toLowerCase()) sum+=BigInt(tx.value) });
    }
    const raised = Number(sum)/1e18;
    updateRaised(raised);
  }catch(e){
    // mock – yerinde dursun
    updateRaised(0);
  }
}
function updateRaised(v){
  raisedTxt.textContent = "$"+v.toLocaleString(undefined,{maximumFractionDigits:2});
  const perc = Math.min(100, v/300000*100);
  raisedBar.style.width = perc+"%";
}
fetchRaised();

// WALLET connect using Web3Modal
let provider, signer, userAddress=null;
const web3Modal = new window.Web3Modal.default({
  cacheProvider: false,
  providerOptions: {
    walletconnect: {
      package: window.WalletConnectProvider.default,
      options:{ rpc:{56:"https://bsc-dataseed.binance.org/"} }
    }
  }
});

connectBtn.onclick = async ()=>{
  try{
    const extProvider = await web3Modal.connect();
    provider = new ethers.providers.Web3Provider(extProvider);
    signer = provider.getSigner();
    // switch / add BSC
    const current = await provider.getNetwork();
    if(current.chainId!==56){
      await provider.provider.request({method:"wallet_addEthereumChain", params:[BSC_PARAMS]});
    }
    userAddress = await signer.getAddress();
    connectBtn.textContent = userAddress.slice(0,6)+"…"+userAddress.slice(-4);
    buildRefLink(userAddress);
  }catch(err){
    console.error(err);
  }
};

// COPY receiver
copyRecv.onclick = ()=>{ navigator.clipboard.writeText(RECEIVER); copyRecv.textContent="Kopyalandı"; setTimeout(()=>copyRecv.textContent="Kopyala",1000); }

// BUY
buyBtn.onclick = async ()=>{
  if(!signer){ alert("Önce cüzdan bağla."); return }
  const price = parseFloat(stageSel.value);
  const q = parseInt(qty.value||0,10);
  const usdtAmount = ethers.utils.parseUnits((price*q).toString(), 18);

  const contract = new ethers.Contract(USDT_BEP20, [
    "function transfer(address to, uint value) public returns (bool)"
  ], signer);

  try{
    buyBtn.disabled=true; buyBtn.textContent="Onay bekleniyor…";
    const tx = await contract.transfer(RECEIVER, usdtAmount);
    buyBtn.textContent="Gönderiliyor…";
    await tx.wait();
    buyBtn.textContent="USDT (BEP20) ile Satın Al";
    buyBtn.disabled=false;
    alert("Ödeme alındı! İşlem hash:\n"+tx.hash);
  }catch(e){
    console.error(e);
    buyBtn.disabled=false; buyBtn.textContent="USDT (BEP20) ile Satın Al";
    alert("İşlem iptal edildi / hata oluştu.");
  }
};

// LANG (TR/EN/PT/RU/ZH/HI – kısa örnek)
const i18n = {
  tr:{about:"Hakkında", tokenomics:"Tokenomi", roadmap:"Yol Haritası", connect:"Cüzdan Bağla",
      nextbig:"Bir sonraki büyük meme coini iniş yaptı", days:"Gün", hours:"Saat", minutes:"Dakika", seconds:"Saniye",
      presale:"Ön Satış Paneli", stage:"Aşama", howmany:"Kaç ZUZU?", price:"Fiyat:", total:"Toplam:",
      buyusdt:"USDT (BEP20) ile Satın Al", buycard:"Kart ile Satın Al (yakında)",
      gas:"Ödeme USDT (BEP20) ile doğrudan proje kasasına gider. Gas için az miktar BNB gerekir.",
      receiver:"Ödeme Alıcı Adresi", copy:"Kopyala"},
  en:{about:"About", tokenomics:"Tokenomics", roadmap:"Roadmap", connect:"Connect Wallet",
      nextbig:"The next great meme coin has landed", days:"Days", hours:"Hours", minutes:"Minutes", seconds:"Seconds",
      presale:"Presale Panel", stage:"Stage", howmany:"How many ZUZU?", price:"Price:", total:"Total:",
      buyusdt:"Buy with USDT (BEP20)", buycard:"Buy with Card (soon)",
      gas:"Payment goes directly to the treasury. A little BNB is required for gas.",
      receiver:"Receiver Address", copy:"Copy"},
  pt:{about:"Sobre", tokenomics:"Tokenomics", roadmap:"Roteiro", connect:"Conectar Carteira", nextbig:"A próxima grande meme coin chegou",
      days:"Dias",hours:"Horas",minutes:"Min",seconds:"Seg", presale:"Painel de Pré-venda", stage:"Estágio",
      howmany:"Quantos ZUZU?", price:"Preço:", total:"Total:", buyusdt:"Comprar com USDT (BEP20)", buycard:"Comprar com Cartão (em breve)",
      gas:"Pagamento vai direto ao tesouro. Precisa de um pouco de BNB para gas.", receiver:"Endereço do Recebedor", copy:"Copiar"},
  ru:{about:"О нас", tokenomics:"Токеномика", roadmap:"Дорожная карта", connect:"Подключить кошелёк", nextbig:"Новая мем-монета уже тут",
      days:"Дни",hours:"Часы",minutes:"Мин",seconds:"Сек", presale:"Панель пресейла", stage:"Этап",
      howmany:"Сколько ZUZU?", price:"Цена:", total:"Итого:", buyusdt:"Купить за USDT (BEP20)", buycard:"Купить картой (скоро)",
      gas:"Платёж идёт напрямую в казну. Нужна немного BNB на газ.", receiver:"Адрес получателя", copy:"Копировать"},
  zh:{about:"关于", tokenomics:"代币经济", roadmap:"路线图", connect:"连接钱包", nextbig:"下一款强势 Meme 币已到来",
      days:"天",hours:"时",minutes:"分",seconds:"秒", presale:"预售面板", stage:"阶段",
      howmany:"购买数量", price:"价格:", total:"总计:", buyusdt:"用 USDT (BEP20) 购买", buycard:"银行卡购买（即将上线）",
      gas:"付款直接进入金库，需要少量 BNB 作为 gas。", receiver:"收款地址", copy:"复制"},
  hi:{about:"परिचय", tokenomics:"टोकनोमिक्स", roadmap:"रोडमैप", connect:"वॉलेट कनेक्ट", nextbig:"अगला बड़ा मीम कॉइन आ चुका है",
      days:"दिन",hours:"घंटे",minutes:"मिनट",seconds:"सेकंड", presale:"प्रीसेल पैनल", stage:"स्टेज",
      howmany:"कितने ZUZU?", price:"कीमत:", total:"कुल:", buyusdt:"USDT (BEP20) से खरीदें", buycard:"कार्ड से खरीदें (जल्द)",
      gas:"भुगतान सीधे ट्रेज़री में जाता है। गैस के लिए थोड़ा BNB चाहिए।", receiver:"रिसीवर पता", copy:"कॉपी"}
};
function applyLang(lc){
  const dict = i18n[lc]||i18n.tr;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const k = el.getAttribute("data-i18n");
    if(dict[k]) el.textContent = dict[k];
  });
}
langSel.onchange = ()=>applyLang(langSel.value);
applyLang("tr");
// build default ref link
buildRefLink();

/* END */
