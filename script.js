const S = {
  cfg:null, provider:null, signer:null, account:null, stageIdx:0, price:0
};

const I18N = {
  TR:{about:"Hakkında",tokenomics:"Tokenomi",roadmap:"Yol Haritası",connect:"Cüzdan Bağla",aiagent:"YAPAY ZEKA",subtitle:"ZUZU; memetik enerjiyi <b>AI Meme Intelligence</b> ile birleştirir. Fonlar <b>non-custodial</b> hazinede tutulur.",refText:"Senin referans linkin:",copy:"Kopyala",days:"Gün",hours:"Saat",minutes:"Dakika",seconds:"Saniye",buyTitle:"$ZUZU Token Satın Al – Şimdi Ön Satışta!",stage:"Aşama",howMany:"Kaç ZUZU?",price:"Fiyat:",total:"Toplam:",buyUSDT:"Kripto ile Satın Al (USDT/BEP20)",gas:"Ödeme USDT (BEP20) ile yapılır. İşlem için az miktar BNB gerekir.",receiver:"Receiver",transparency:"Şeffaflık",adminPanel:"Satın alımlar on-chain receiver adresine kaydolur. <a href='admin.html' class='link'>Admin Panel →</a>"},
  EN:{about:"About",tokenomics:"Tokenomics",roadmap:"Roadmap",connect:"Connect",aiagent:"AI AGENT",subtitle:"ZUZU fuses memetic energy with <b>AI Meme Intelligence</b>. Funds remain <b>non-custodial</b> in treasury.",refText:"Your referral link:",copy:"Copy",days:"Days",hours:"Hours",minutes:"Minutes",seconds:"Seconds",buyTitle:"Buy $ZUZU – Presale Live!",stage:"Stage",howMany:"How many ZUZU?",price:"Price:",total:"Total:",buyUSDT:"Buy with USDT (BEP20)",gas:"Transaction requires small BNB gas.",receiver:"Receiver",transparency:"Transparency",adminPanel:"Purchases are recorded on-chain. <a href='admin.html' class='link'>Admin Panel →</a>"},
  PT:{about:"Sobre",tokenomics:"Tokenomics",roadmap:"Roteiro",connect:"Conectar"},
  RU:{about:"О проекте",tokenomics:"Токеномика",roadmap:"Дорожная карта",connect:"Подключить"},
  ZH:{about:"关于",tokenomics:"代币经济",roadmap:"路线图",connect:"连接钱包"},
  HI:{about:"बारे में",tokenomics:"टोकनोमिक्स",roadmap:"रोडमैप",connect:"वॉलेट जोड़ें"}
};

async function init(){
  S.cfg = await (await fetch('config.json?_=' + Date.now())).json();

  // dil menüsü
  const sel = document.getElementById('langSel');
  S.cfg.langs.forEach(l=>{ const o=document.createElement('option'); o.value=o.textContent=l; sel.appendChild(o);});
  sel.value = (new URLSearchParams(location.search).get('lang') || 'TR');
  applyLang(sel.value);
  sel.onchange = ()=>{ applyLang(sel.value); history.replaceState(null,'',setParam('lang',sel.value)); };

  // stage
  const stageSel = document.getElementById('stageSel');
  S.cfg.stages.forEach((st,i)=>{
    const o=document.createElement('option'); o.value=i; o.textContent=`${st.label} — ${st.price.toFixed(6)} USDT / ZUZU`; stageSel.appendChild(o);
  });
  stageSel.onchange=()=>{S.stageIdx=+stageSel.value; updatePrice();};
  stageSel.value=0; S.stageIdx=0; updatePrice();

  // chips
  document.querySelectorAll('.chip').forEach(b=> b.onclick=()=>{ document.getElementById('amount').value=b.dataset.amt; calc(); });

  // receiver + QR
  document.getElementById('recv').value=S.cfg.receiver;
  document.getElementById('recvShort').textContent = short(S.cfg.receiver);
  QRCode.toCanvas(document.getElementById('qr'), S.cfg.receiver, {width:160});

  // counts
  ['amount'].forEach(id=> document.getElementById(id).addEventListener('input',calc));
  calc();

  // cüzdan
  document.getElementById('connectBtn').onclick=connectWallet;
  document.getElementById('buyUsdt').onclick=buyUSDT;
  document.getElementById('copyRecv').onclick=()=>copyText(S.cfg.receiver);
  document.getElementById('copyRef').onclick=()=>copyText(document.getElementById('refLink').href);

  // countdown
  tickCountdown(new Date(S.cfg.presaleEndsAt).getTime()); setInterval(()=>tickCountdown(new Date(S.cfg.presaleEndsAt).getTime()),1000);

  // progress (admin ile gerçek zamanlı toplama bağlayacağız)
  document.getElementById('hardcap').textContent = S.cfg.hardcapUSDT.toLocaleString();
  updateRaisedDemo(0);

  // referral
  setupReferral();

  // Tap-to-earn demo
  setupTap();

  // stake demo
  setupStake();
}

function applyLang(code){
  const dict = I18N[code] || I18N.TR;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k = el.getAttribute('data-i18n');
    if(dict[k]) el.innerHTML = dict[k];
  });
}
function setParam(key,val){
  const u = new URL(location.href); u.searchParams.set(key,val); return u.toString();
}

function updatePrice(){ S.price = S.cfg.stages[S.stageIdx].price; document.getElementById('price').textContent=S.price.toFixed(6); calc(); }
function calc(){
  const amt = +document.getElementById('amount').value||0;
  const total = amt * S.price;
  document.getElementById('total').textContent = total.toFixed(6);
}

function short(a){ return a.slice(0,6)+'...'+a.slice(-4); }
async function copyText(t){ await navigator.clipboard.writeText(t); toast('Kopyalandı'); }
function toast(t){ console.log(t); }

async function connectWallet(){
  if(!window.ethereum){ alert('MetaMask/TrustWallet gerekli'); return;}
  S.provider = new ethers.providers.Web3Provider(window.ethereum);
  await S.provider.send('eth_requestAccounts', []);
  S.signer = S.provider.getSigner();
  S.account = await S.signer.getAddress();

  // BSC switch
  try{
    await window.ethereum.request({method:'wallet_switchEthereumChain', params:[{chainId:'0x'+S.cfg.chain.chainId.toString(16)}]});
  }catch(e){
    if(e.code===4902){
      await window.ethereum.request({method:'wallet_addEthereumChain', params:[{chainId:'0x'+S.cfg.chain.chainId.toString(16), chainName:'BSC', nativeCurrency:{name:'BNB',symbol:'BNB',decimals:18}, rpcUrls:[S.cfg.chain.rpc], blockExplorerUrls:['https://bscscan.com']}]});
    }
  }
  document.getElementById('connectBtn').textContent = short(S.account);
}

async function buyUSDT(){
  try{
      if(!S.signer) await connectWallet();
      const amt = +document.getElementById('amount').value||0;
      if(amt<=0) return alert('Miktar gir');
      const total = ethers.utils.parseUnits((amt * S.price).toFixed(S.cfg.usdt.decimals), S.cfg.usdt.decimals);

      // USDT contract
      const abi = ["function transfer(address to,uint256 value) returns (bool)"];
      const usdt = new ethers.Contract(S.cfg.usdt.bep20, abi, S.signer);
      const tx = await usdt.transfer(S.cfg.receiver, total);
      toast('Onay bekleniyor: '+tx.hash);
      await tx.wait();
      toast('Ödeme tamam!');

      // demo: progress bar ileri al
      updateRaisedDemo(parseFloat(document.getElementById('total').textContent));
  }catch(err){ console.error(err); alert('Hata: '+(err.message||err));}
}

function updateRaisedDemo(add){
  const current = parseFloat(document.getElementById('raised').textContent.replace(/,/g,'')) || 0;
  const next = Math.min(current + add, S.cfg.hardcapUSDT);
  document.getElementById('raised').textContent = next.toLocaleString();
  const pct = Math.min(100, (next / S.cfg.hardcapUSDT) * 100);
  document.getElementById('pbar').style.width = pct+'%';
}

function tickCountdown(endMs){
  const now = Date.now(); let d=0,h=0,m=0,s=0;
  let diff = Math.max(0, endMs - now);
  s = Math.floor(diff/1000)%60; m = Math.floor(diff/1000/60)%60; h = Math.floor(diff/1000/3600)%24; d = Math.floor(diff/1000/3600/24);
  ['d','h','m','s'].forEach(id=> document.getElementById(id).textContent = eval(id).toString().padStart(2,'0'));
}

function setupReferral(){
  const u = new URL(location.href);
  const ref = u.searchParams.get('ref');
  if(ref) localStorage.setItem('zuzu_ref', ref);
  const my = setParam('ref', 'share-this-link');
  const a = document.getElementById('refLink'); a.textContent = my; a.href=my;

  // multiplier
  const hasRef = !!(ref || localStorage.getItem('zuzu_ref'));
  window.__refMul = hasRef ? 1.2 : 1.0;
}

function setupTap(){
  const btn = document.getElementById('tapBtn'); const sc = document.getElementById('tapScore'); const mul = document.getElementById('tapMul');
  mul.textContent = window.__refMul+'x';
  let score = 0;
  btn.onclick=()=>{ score += 1 * window.__refMul; sc.textContent = Math.floor(score); btn.style.transform='scale(.98)'; setTimeout(()=>btn.style.transform='',80); };
}

function setupStake(){
  const calcBtn = document.getElementById('stakeCalc');
  calcBtn.onclick=()=>{
    const d = +document.getElementById('stakeDays').value;
    const amt = +document.getElementById('stakeAmt').value||0;
    const apy = (d===30?12:(d===60?22:36));
    const reward = amt * (apy/100) * (d/365);
    document.getElementById('stakeOut').textContent = `~${reward.toFixed(2)} ZUZU tahmini ödül (APY ${apy}%)`;
  }
}

window.addEventListener('load',init);
