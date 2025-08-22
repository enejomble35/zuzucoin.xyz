// ====== CONFIG LOAD ======
let CFG = {};
async function loadConfig(){
  const r = await fetch('config.json?ts='+Date.now());
  CFG = await r.json();
}
const qs = (s, p=document)=>p.querySelector(s);
const qsa = (s, p=document)=>[...p.querySelectorAll(s)];
function $(id){ return document.getElementById(id); }

// ====== I18N ======
const I18N = {
  TR:{
    connect:"Cüzdan Bağla", heroTitle1:"YAPAY ZEKA", heroTitle2:"MEME AJANI",
    tagline:"ZUZU; meme enerjisini <b>AI Meme Intelligence</b> ile birleştirir. Presale fonları <b>non-custodial</b> hazinede tutulur.",
    days:"Gün",hours:"Saat",mins:"Dakika",secs:"Saniye",
    yourRef:"Senin referans linkin:", copy:"Kopyala",
    buyTitle:"$ZUZU Token Satın Al – Şimdi Ön Satışta!",
    stage:"Aşama", howMany:"Kaç ZUZU?", price:"Fiyat:", total:"Toplam:",
    buyCard:"Kart ile Satın Al", buyCrypto:"Kripto ile Satın Al (USDT/BEP20)",
    hint:"Ödeme USDT (BEP20) ile yapılır. Gas için az miktar BNB gerekir.",
    receiver:"Receiver", raised:"Toplanan",
    aud1:"Sözleşme: USDT (BEP20)", aud2:"Transfer → receiver", aud3:"Non-custodial, direkt kasaya",
    tapTitle:"Tap-to-Earn", tapDesc:"Dokundukça puan kazan. Referans varsa x1.2 çarpan eklenir.",
    score:"Puan:", mult:"Çarpan:", tap:"TAP!",
    stakeTitle:"Staking (Demo)", stake:"Stake Et (Demo)", tokenomics:"Tokenomik", roadmap:"Yol Haritası"
  },
  EN:{
    connect:"Connect Wallet", heroTitle1:"AI-POWERED", heroTitle2:"MEME AGENT",
    tagline:"ZUZU fuses meme energy with <b>AI Meme Intelligence</b>. Presale funds are kept in <b>non-custodial</b> treasury.",
    days:"Days",hours:"Hours",mins:"Minutes",secs:"Seconds",
    yourRef:"Your referral link:", copy:"Copy",
    buyTitle:"Buy $ZUZU — Presale Live!",
    stage:"Stage", howMany:"How many ZUZU?", price:"Price:", total:"Total:",
    buyCard:"Buy with Card", buyCrypto:"Buy with Crypto (USDT/BEP20)",
    hint:"Pay with USDT (BEP20). You’ll need a little BNB for gas.",
    receiver:"Receiver", raised:"Raised",
    aud1:"Contract: USDT (BEP20)", aud2:"Transfer → receiver", aud3:"Non-custodial, direct to treasury",
    tapTitle:"Tap-to-Earn", tapDesc:"Tap to earn points. If you have a referral, 1.2x multiplier.",
    score:"Score:", mult:"Multiplier:", tap:"TAP!",
    stakeTitle:"Staking (Demo)", stake:"Stake (Demo)", tokenomics:"Tokenomics", roadmap:"Roadmap"
  },
  PT:{ connect:"Conectar Carteira", heroTitle1:"AGENTE", heroTitle2:"MEME IA", tagline:"ZUZU combina energia meme com <b>IA</b>. Fundos em <b>custódia própria</b>." ,
       days:"Dias",hours:"Horas",mins:"Minutos",secs:"Segundos", yourRef:"Seu link:", copy:"Copiar",
       buyTitle:"Compre $ZUZU — Pré-venda", stage:"Estágio", howMany:"Quantos ZUZU?", price:"Preço:", total:"Total:",
       buyCard:"Comprar com Cartão", buyCrypto:"Comprar com Cripto (USDT/BEP20)", hint:"Pague com USDT (BEP20).",
       receiver:"Recebedor", raised:"Arrecadado", aud1:"Contrato: USDT", aud2:"Transferência → recebedor", aud3:"Não-custodial",
       tapTitle:"Tap-to-Earn", tapDesc:"Toque para ganhar pontos.", score:"Pontos:", mult:"Multiplicador:", tap:"TAP!",
       stakeTitle:"Staking (Demo)", stake:"Stake (Demo)", tokenomics:"Tokenômica", roadmap:"Roteiro"
  },
  RU:{ connect:"Подключить кошелёк", heroTitle1:"ИИ", heroTitle2:"МЕМ-АГЕНТ", tagline:"ZUZU объединяет мем-энергию с <b>ИИ</b>. Средства в <b>некастодиальном</b> хранилище.",
       days:"Дни", hours:"Часы", mins:"Минуты", secs:"Секунды", yourRef:"Ваша реф-ссылка:", copy:"Копировать",
       buyTitle:"Купить $ZUZU — Пресейл", stage:"Этап", howMany:"Сколько ZUZU?", price:"Цена:", total:"Итого:",
       buyCard:"Купить картой", buyCrypto:"Купить криптой (USDT/BEP20)", hint:"Оплата USDT (BEP20).",
       receiver:"Получатель", raised:"Собрано", aud1:"Контракт: USDT", aud2:"Перевод → получатель", aud3:"Некостодиальный",
       tapTitle:"Tap-to-Earn", tapDesc:"Нажимай, чтобы зарабатывать очки.", score:"Очки:", mult:"Множитель:", tap:"TAP!",
       stakeTitle:"Стейкинг (Демо)", stake:"Стейк (Демо)", tokenomics:"Токеномика", roadmap:"Дорожная карта"
  },
  ZH:{ connect:"连接钱包", heroTitle1:"AI", heroTitle2:"梗智能", tagline:"ZUZU 将梗文化与 <b>AI</b> 结合。预售资金 <b>非托管</b> 保存。",
       days:"天",hours:"时",mins:"分",secs:"秒", yourRef:"你的邀请链接:", copy:"复制",
       buyTitle:"购买 $ZUZU — 预售进行中", stage:"阶段", howMany:"数量", price:"单价:", total:"合计:",
       buyCard:"银行卡购买", buyCrypto:"加密购买 (USDT/BEP20)", hint:"使用 USDT (BEP20) 支付。",
       receiver:"收款地址", raised:"已筹集", aud1:"合约：USDT", aud2:"转账 → 收款", aud3:"非托管",
       tapTitle:"Tap-to-Earn", tapDesc:"点击赚积分，有邀请加成 1.2x。", score:"积分:", mult:"倍数:", tap:"TAP!",
       stakeTitle:"质押 (演示)", stake:"质押 (演示)", tokenomics:"代币经济", roadmap:"路线图"
  },
  HI:{ connect:"वॉलेट कनेक्ट", heroTitle1:"एआई", heroTitle2:"मीम एजेंट", tagline:"ZUZU, मीम ऊर्जा को <b>AI</b> से जोड़ता है। फंड <b>नॉन-कस्टोडियल</b> ट्रेज़री में।",
       days:"दिन",hours:"घंटे",mins:"मिनट",secs:"सेकंड", yourRef:"आपकी रेफरल लिंक:", copy:"कॉपी",
       buyTitle:"$ZUZU खरीदें — प्रीसेल लाइव", stage:"स्टेज", howMany:"कितने ZUZU?", price:"कीमत:", total:"कुल:",
       buyCard:"कार्ड से खरीदें", buyCrypto:"क्रिप्टो से खरीदें (USDT/BEP20)", hint:"USDT (BEP20) से भुगतान करें।",
       receiver:"रिसीवर", raised:"उगाही", aud1:"कॉन्ट्रैक्ट: USDT", aud2:"ट्रांसफर → रिसीवर", aud3:"नॉन-कस्टोडियल",
       tapTitle:"Tap-to-Earn", tapDesc:"टैप कर के अंक कमाएं। रेफरल हो तो 1.2x।", score:"स्कोर:", mult:"मल्टिप्लायर:", tap:"TAP!",
       stakeTitle:"स्टैकिंग (डेमो)", stake:"स्टेक (डेमो)", tokenomics:"टोकनॉमिक्स", roadmap:"रोडमैप"
  }
};

function applyI18n(lang){
  const dict = I18N[lang] || I18N[CFG.defaultLang];
  qsa('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(dict[key]) el.innerHTML = dict[key];
  });
  $('langSelect').value = lang;
}

function initLang(){
  const sel = $('langSelect');
  sel.innerHTML = CFG.languages.map(l=>`<option value="${l}">${l}</option>`).join('');
  const urlL = new URLSearchParams(location.search).get('lang');
  applyI18n(urlL || CFG.defaultLang);
  sel.onchange = e => {
    applyI18n(e.target.value);
    const u = new URL(location.href); u.searchParams.set('lang', e.target.value); history.replaceState({}, '', u);
  };
}

// ====== COUNTDOWN ======
let targetDate;
function initCountdown(){
  targetDate = new Date(CFG.countdownTo);
  const tick = ()=>{
    const now = new Date();
    let s = Math.max(0, Math.floor((targetDate-now)/1000));
    const d = Math.floor(s/86400); s%=86400;
    const h = Math.floor(s/3600); s%=3600;
    const m = Math.floor(s/60); s%=60;
    $('dd').textContent = String(d).padStart(2,'0');
    $('hh').textContent = String(h).padStart(2,'0');
    $('mm').textContent = String(m).padStart(2,'0');
    $('ss').textContent = String(s).padStart(2,'0');
    requestAnimationFrame(tick);
  };
  tick();
}

// ====== REFERRAL ======
function initReferral(){
  const u = new URL(location.href);
  const ref = u.searchParams.get('ref') || 'share-this-link';
  const base = `${location.origin}${location.pathname}`;
  const link = `${base}?ref=${encodeURIComponent(ref)}`;
  $('refLink').textContent = link;
  $('refLink').href = link;
  $('copyRef').onclick = ()=>{ navigator.clipboard.writeText(link); toast('Copied!'); };
  // multiplier
  window.__tapMult = ref ? 1.2 : 1.0;
  $('tapMult').textContent = `${__tapMult.toFixed(1)}x`;
}

// ====== STAGES & PRICE ======
let currentPrice = 0;
function initStages(){
  const sel = $('stage');
  sel.innerHTML = CFG.stages.map((s,i)=>`<option value="${i}">${s.name}</option>`).join('');
  sel.onchange = updatePrice;
  // quick chips
  qsa('.mini').forEach(b=> b.onclick = ()=>{ $('qty').value = b.dataset.amt; updateTotal(); });
  $('qty').oninput = updateTotal;
  updatePrice();
}
function updatePrice(){
  const st = CFG.stages[ $('stage').value || 0 ];
  currentPrice = st.price;
  $('unitPrice').textContent = currentPrice.toFixed(6);
  updateTotal();
}
function updateTotal(){
  const q = parseFloat($('qty').value || '0');
  const t = q * currentPrice;
  $('totalUSDT').textContent = t.toFixed(6);
}

// ====== RECEIVER + QR ======
function initReceiver(){
  $('receiver').value = CFG.receiver;
  $('copyAddr').onclick = ()=> navigator.clipboard.writeText(CFG.receiver);
  // simple qr
  drawQR('qr', CFG.receiver);
}
function drawQR(id, text){
  // super basic QR (placeholder): draw pattern fallback
  const c = $(id), ctx = c.getContext('2d');
  ctx.fillStyle='#0f1320'; ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle='#27ff8a'; 
  for(let y=0;y<18;y++){
    for(let x=0;x<18;x++){
      if(((x*y + x + y) % 7)===0) ctx.fillRect(10+x*9, 10+y*9, 7, 7);
    }
  }
  // center dot to resemble QR
  ctx.fillStyle='#0f1320'; ctx.fillRect(80,80,20,20);
}

// ====== TAP-TO-EARN ======
function initTap(){
  let score = 0;
  $('tapBtn').onclick = ()=>{
    score += Math.round(10* (window.__tapMult || 1));
    $('tapScore').textContent = score;
    // flash glow
    $('tapBtn').style.transform='scale(.98)';
    setTimeout(()=>$('tapBtn').style.transform='',80);
  };
}

// ====== STAKE (demo) ======
function initStake(){
  $('stakeBtn').onclick = ()=>{
    const d = parseInt($('stakeDays').value,10);
    const amt = parseFloat($('stakeAmt').value||'0');
    if(!amt) return toast('Miktar gir');
    const apy = d===30?12: (d===60?22:36);
    $('stakeInfo').textContent = `~${apy}% APY (demo hesap) • Stake edilen: ${amt.toLocaleString()} ZUZU`;
    toast('Stake kaydı (demo) oluşturuldu');
  };
}

// ====== RAISED (BscScan) ======
async function updateRaised(){
  $('targetTxt').textContent = CFG.targetUSD.toLocaleString();
  if(!CFG.bscscanApiKey){ $('raisedTxt').textContent = '0'; setBar(0); return; }

  try{
    const api = `https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=${CFG.usdtContract}&address=${CFG.receiver}&page=1&offset=100&sort=asc&apikey=${CFG.bscscanApiKey}`;
    const r = await fetch(api); const j = await r.json();
    let sum = 0;
    if(j.status==='1'){
      for(const tx of j.result){
        if(tx.to && tx.to.toLowerCase()===CFG.receiver.toLowerCase()){
          sum += Number(tx.value) / 1e18; // USDT on BSC has 18 on API
        }
      }
    }
    $('raisedTxt').textContent = '$'+sum.toFixed(2);
    const pct = Math.min(100, (sum / CFG.targetUSD) * 100);
    setBar(pct);
  }catch(e){
    console.log('bscscan error', e);
  }
}
function setBar(p){ $('barInner').style.width = p+'%'; }

// ====== WALLET ======
async function connect(){
  if(!window.ethereum){ toast('MetaMask / TrustWallet gerekli'); return; }
  const cid = await ethereum.request({ method:'eth_chainId' });
  if(parseInt(cid,16)!==CFG.chainId){
    try{
      await ethereum.request({ method:'wallet_switchEthereumChain', params:[{ chainId:'0x'+CFG.chainId.toString(16)}]});
    }catch(e){ toast('BSC ağına geçemedik'); }
  }
  const accs = await ethereum.request({ method:'eth_requestAccounts' });
  if(accs && accs[0]){ $('connectBtn').textContent = accs[0].slice(0,6)+'…'+accs[0].slice(-4); toast('Cüzdan bağlandı'); }
}

// ====== BUY BTNS (placeholder) ======
$('buyCard')?.addEventListener('click', ()=> toast('Kart ile satın alma yakında (3rd-party)'));
$('buyCrypto')?.addEventListener('click', ()=> toast('Kripto ile satın alma: Adrese USDT (BEP20) gönderin'));

// ====== TOAST ======
let tmo;
function toast(msg){
  let el = qs('.toast');
  if(!el){ el = document.createElement('div'); el.className='toast'; document.body.appendChild(el); }
  el.textContent = msg; el.style.opacity='1';
  clearTimeout(tmo); tmo=setTimeout(()=>el.style.opacity='0', 1800);
}

// ====== INIT ======
window.addEventListener('DOMContentLoaded', async ()=>{
  await loadConfig();
  initLang();
  initCountdown();
  initReferral();
  initStages();
  initReceiver();
  initTap();
  initStake();
  updateRaised();

  $('connectBtn').onclick = connect;
});

// tiny style for toast
const st = document.createElement('style'); st.textContent=`
.toast{position:fixed; left:50%; transform:translateX(-50%); bottom:24px; background:#0f1320; color:#e9eef7; border:1px solid #2a3241; padding:10px 14px; border-radius:10px; opacity:0; transition:.25s; z-index:999}
`; document.head.appendChild(st);
