// ==== CONFIG ====
const RECEIVER   = "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3";
const USDT       = "0x55d398326f99059fF775485246999027B3197955";
const DEC        = 18;
const TARGET_USD = 300000;
// BscScan key (opsiyonel, boş da kalabilir)
const BSC_API_KEY = "";

// ==== I18N ====
const I = {
  tr:{title:"YAPAY ZEKA <span class='orange'>MEME AJANI</span>", lead:"ZUZU; meme enerjisi + ciddi duruş. AI katmanı hype dalgalarını okur. Presale USDT(BEP20) doğrudan hazinede toplanır.", days:"Gün", hours:"Saat", mins:"Dakika", secs:"Saniye", presale:"Ön Satış", howmany:"Kaç ZUZU?", note:"Ödeme USDT (BEP20) ile direkt hazinedir. Gas için az miktar BNB gerekir."},
  en:{title:"AI-POWERED <span class='orange'>MEME AGENT</span>", lead:"ZUZU blends meme energy with a serious vibe. AI layer reads hype waves. Presale USDT(BEP20) goes straight to the treasury.", days:"Days", hours:"Hours", mins:"Mins", secs:"Secs", presale:"Presale", howmany:"How many ZUZU?", note:"Payment goes directly to the treasury. Small BNB gas is required."},
  pt:{title:"AGENTE DE MEME <span class='orange'>COM IA</span>", lead:"ZUZU combina energia meme e estilo sério. A camada de IA lê ondas de hype.", days:"Dias", hours:"Horas", mins:"Mins", secs:"Segs", presale:"Pré-venda", howmany:"Quantos ZUZU?", note:"Pagamento vai direto ao tesouro. Precisa um pouco de BNB para gas."},
  ru:{title:"АГЕНТ МЕМОВ <span class='orange'>НА ИИ</span>", lead:"ZUZU сочетает энергию мемов и строгий стиль. Слой ИИ читает хайп-волны.", days:"Дни", hours:"Часы", mins:"Мин", secs:"Сек", presale:"Пресейл", howmany:"Сколько ZUZU?", note:"Платеж прямо в казну. Нужна немного BNB для газа."},
  zh:{title:"AI 驱动的 <span class='orange'>MEME 代理</span>", lead:"ZUZU 结合 Meme 能量与严肃风格。AI 层读取热度浪潮。", days:"天", hours:"小时", mins:"分钟", secs:"秒", presale:"预售", howmany:"购买多少 ZUZU？", note:"付款直接进入金库。需要少量 BNB 作为 Gas。"},
  hi:{title:"AI-संचालित <span class='orange'>मीम एजेंट</span>", lead:"ZUZU मीम ऊर्जा और गंभीर स्टाइल। AI परत हाइप वेव पढ़ती है।", days:"दिन", hours:"घंटे", mins:"मिनट", secs:"सेक", presale:"प्रीसेल", howmany:"कितने ZUZU?", note:"भुगतान सीधे ट्रेज़री में। थोड़ा BNB गैस चाहिए।"},
};
function setLang(k){
  const t = I[k]||I.tr;
  q('#tTitle').innerHTML = t.title;
  q('#tLead').textContent = t.lead;
  q('#tDays').textContent = t.days;
  q('#tHours').textContent = t.hours;
  q('#tMins').textContent = t.mins;
  q('#tSecs').textContent = t.secs;
  q('#tPresale').textContent = t.presale;
  q('#tHowMany').textContent = t.howmany;
  q('#tNote').textContent = t.note;
}
q('#lang').addEventListener('change', e=>setLang(e.target.value)); setLang('tr');

// ==== UTIL ====
function q(s){return document.querySelector(s)}
function qa(s){return [...document.querySelectorAll(s)]}

// ==== Timer ====
const end = Date.now()+40*24*3600*1000;
setInterval(()=>{
  const remain = Math.max(0, end - Date.now())/1000|0;
  const d=(remain/86400)|0, h=(remain%86400/3600)|0, m=(remain%3600/60)|0, s=remain%60;
  q('#tday').textContent=d;
  q('#thour').textContent=String(h).padStart(2,'0');
  q('#tmin').textContent=String(m).padStart(2,'0');
  q('#tsec').textContent=String(s).padStart(2,'0');
}, 1000);

// ==== Presale calc ====
const stage = q('#stage'), amount = q('#amount'), priceTxt=q('#priceTxt'), totalTxt=q('#totalTxt');
function recalc(){const p=+stage.value||0, a=+amount.value||0; priceTxt.textContent=p.toFixed(6); totalTxt.textContent=(p*a).toFixed(6)}
;[stage,amount].forEach(el=>el.addEventListener('input',recalc)); recalc();
qa('.chip').forEach(b=>b.onclick=()=>{qa('.chip').forEach(x=>x.classList.remove('active')); b.classList.add('active'); amount.value=b.dataset.amt; recalc();});

// ==== Receiver + QR ====
q('#rcv').textContent = RECEIVER.slice(0,10)+"…"+RECEIVER.slice(-6);
q('#rcvShort').textContent = RECEIVER.slice(0,6)+"…"+RECEIVER.slice(-4);
q('#copy').onclick = ()=>navigator.clipboard.writeText(RECEIVER);
(function qr(){
  const c=q('#qr'),x=c.getContext('2d');x.fillStyle="#0b1118";x.fillRect(0,0,c.width,c.height);x.fillStyle="#fff";
  for(let i=0;i<11;i++)for(let j=0;j<11;j++){ if(((i*j+i*3+j)%7)==0) x.fillRect(i*10+7,j*10+7,8,8); }
})();

// ==== Connect + Buy ====
let ACCOUNT=null;
q('#connectBtn').onclick = async ()=>{
  if(!window.ethereum) return alert("MetaMask/TrustWallet gerekli.");
  const [acc] = await ethereum.request({method:'eth_requestAccounts'}); ACCOUNT=acc;
  try{ await ethereum.request({method:'wallet_switchEthereumChain', params:[{chainId:'0x38'}]}); }catch(e){
    if(e.code===4902){ await ethereum.request({method:'wallet_addEthereumChain',params:[{chainId:'0x38',chainName:'BSC',nativeCurrency:{name:'BNB',symbol:'BNB',decimals:18},rpcUrls:['https://bsc-dataseed.binance.org/'],blockExplorerUrls:['https://bscscan.com']}]}); }
  }
  q('#connectBtn').textContent = ACCOUNT.slice(0,6)+"…"+ACCOUNT.slice(-4);
};
q('#buyBtn').onclick = async ()=>{
  const total = +totalTxt.textContent;
  if(total<=0) return alert("Tutar 0 olamaz.");
  if(!window.ethereum) return alert("Cüzdan gerekli.");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const usdt = new ethers.Contract(USDT,["function transfer(address,uint256) returns (bool)"], signer);
  try{
    const tx = await usdt.transfer(RECEIVER, ethers.utils.parseUnits(String(total), DEC));
    alert("İşlem gönderildi: "+tx.hash+"\nOnay bekleyin…"); await tx.wait(1);
  }catch(e){ alert("İşlem iptal/hata: "+(e.message||e)); }
};

// ==== Raised (BscScan, opsiyonel) ====
async function fetchRaised(){
  if(!BSC_API_KEY) return;
  try{
    const url=`https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${USDT}&address=${RECEIVER}&tag=latest&apikey=${BSC_API_KEY}`;
    const r=await fetch(url); const j=await r.json();
    if(j.status!=="1") throw 0;
    const bal = Number(ethers.utils.formatUnits(j.result, DEC));
    const pct = Math.min(100, (bal/TARGET_USD)*100);
    q('#barFill').style.width = pct.toFixed(2)+"%";
    q('#raisedTxt').textContent = `$${Math.floor(bal).toLocaleString()} / $${TARGET_USD.toLocaleString()}`;
  }catch(e){}
}
fetchRaised(); setInterval(fetchRaised,15000);
