/* ==============================
   ZUZU v3 Presale Config
   ============================== */
const CONFIG = {
  PROJECT: {
    name: "ZUZU",
    tagline: "AI-Powered Meme Intelligence",
    socials: {
      twitter: "https://twitter.com/",
      telegram: "https://t.me/",
      discord: "https://discord.gg/"
    },
    // Lottie maske – istersen kendi JSON linkini koy
    lottieUrl: "https://assets3.lottiefiles.com/packages/lf20_touohxv0.json"
  },

  PRESALE: {
    // USDT (BEP20) gönderecekleri adres (EVM: ETH/BSC aynı adresi kullanır)
    receiver: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3",
    chainId: 56, // BSC
    goalUSD: 1000000,       // hedef
    raisedUSD: 220000,      // başlangıç (görsel bar için)
    // Stage (haftalara göre fiyat)
    stages: [
      { name: "Stage 1", price: 0.002 },
      { name: "Stage 2", price: 0.003 },
      { name: "Stage 3", price: 0.004 },
      { name: "Stage 4", price: 0.005 }
    ],
    // Sayaç bitiş tarihi (TRT). Gerekirse güncelle.
    endDate: "2025-09-30T21:00:00+03:00",
  }
};

/* ==============================
   Çoklu Dil
   ============================== */
const I18N = {
  tr: {
    nav_about:"Hakkında", nav_token:"Tokenomics", nav_roadmap:"Yol Haritası", connect:"Cüzdan Bağla",
    hero_title:"ZUZU IS HERE", hero_sub:"Bir sonraki büyük meme coini iniş yaptı",
    d:"Gün", h:"Saat", m:"Dakika", s:"Saniye",
    sale_title:"Ön Satış Aşaması", stage:"Aşama", howmany:"Kaç ZUZU?",
    price:"Fiyat:", total:"Toplam:", buy_btn:"USDT (BEP20) ile Satın Al",
    note:"Ödeme USDT (BEP20) ile doğrudan proje kasasına gider. Gas için az miktar BNB gerekir.",
    receiver_title:"Ödeme Alıcı Adresi", copy:"Kopyala",
    audit1:"Sözleşme: USDT (BEP20)", audit2:"Transfer →", audit3:"Non-custodial, direkt kasaya",
    trans_title:"Şeffaflık", trans_desc:"Receiver olarak zincire kaydolur. Admin Panel üzerinden son işlemleri görebilirsin.",
    raised_title:"Toplanan", ai_text:"ZUZU; AI davranış modellemeleri ve topluluk sinyallerini birleştirir. Meme ivmesini veriyle besler.",
    about_title:"Hakkında", about_text:"ZUZU; meme maskot enerjisiyle minimal ve ciddi duruşu birleştirir. Presale ödemeleri USDT (BEP20) ile direkt kasaya gider. CEX başvuruları presale bitiminde.",
    token_title:"Tokenomics",
    modal_title:"Cüzdan Uyarısı", close:"Kapat"
  },
  en: {
    nav_about:"About", nav_token:"Tokenomics", nav_roadmap:"Roadmap", connect:"Connect Wallet",
    hero_title:"ZUZU IS HERE", hero_sub:"The next great meme coin has landed",
    d:"Day", h:"Hour", m:"Minute", s:"Second",
    sale_title:"Presale Stage", stage:"Stage", howmany:"How many ZUZU?",
    price:"Price:", total:"Total:", buy_btn:"Buy with USDT (BEP20)",
    note:"Payment goes directly to treasury wallet. Small BNB needed for gas.",
    receiver_title:"Receiver Address", copy:"Copy",
    audit1:"Contract: USDT (BEP20)", audit2:"Transfer →", audit3:"Non-custodial, direct to treasury",
    trans_title:"Transparency", trans_desc:"Recorded on-chain as receiver. You can view latest logs on Admin Panel.",
    raised_title:"Raised", ai_text:"ZUZU blends AI behavior modeling with community signals. Smart meme momentum.",
    about_title:"About", about_text:"ZUZU merges meme energy with a minimal & serious stance. Presale in USDT (BEP20).",
    token_title:"Tokenomics",
    modal_title:"Wallet Notice", close:"Close"
  },
  pt:{nav_about:"Sobre",nav_token:"Tokenomics",nav_roadmap:"Roteiro",connect:"Conectar Carteira",
      hero_title:"ZUZU CHEGOU",hero_sub:"A próxima grande meme coin chegou",
      d:"Dia",h:"Hora",m:"Minuto",s:"Segundo",sale_title:"Fase da Pré-venda",stage:"Fase",howmany:"Quantos ZUZU?",
      price:"Preço:",total:"Total:",buy_btn:"Comprar com USDT (BEP20)",
      note:"Pagamento vai direto ao cofre. Necessário um pouco de BNB para gas.",
      receiver_title:"Endereço do Recebedor",copy:"Copiar",
      audit1:"Contrato: USDT (BEP20)",audit2:"Transferência →",audit3:"Não custodial, direto ao cofre",
      trans_title:"Transparência",trans_desc:"Gravado on-chain como receiver.",
      raised_title:"Arrecadado",ai_text:"ZUZU combina IA e sinais da comunidade.",
      about_title:"Sobre",about_text:"ZUZU une energia meme com postura séria.",
      token_title:"Tokenomics", modal_title:"Aviso", close:"Fechar"},
  ru:{nav_about:"О проекте",nav_token:"Токеномика",nav_roadmap:"Дорожная карта",connect:"Подключить",
      hero_title:"ZUZU ЗДЕСЬ",hero_sub:"Следующая крупная мем-монета уже тут",
      d:"День",h:"Час",m:"Минута",s:"Секунда",sale_title:"Этап пресейла",stage:"Этап",howmany:"Сколько ZUZU?",
      price:"Цена:",total:"Итого:",buy_btn:"Купить за USDT (BEP20)",
      note:"Платеж идёт напрямую в казну. Требуется немного BNB для газа.",
      receiver_title:"Адрес получателя",copy:"Копировать",
      audit1:"Контракт: USDT (BEP20)",audit2:"Перевод →",audit3:"Без хранения, напрямую",
      trans_title:"Прозрачность",trans_desc:"Запись в сети как получатель.",
      raised_title:"Собрано",ai_text:"ZUZU сочетает ИИ и сигналы сообщества.",
      about_title:"О проекте",about_text:"ZUZU объединяет энергию мемов и серьезность.",
      token_title:"Токеномика", modal_title:"Уведомление", close:"Закрыть"},
  zh:{nav_about:"关于",nav_token:"代币经济",nav_roadmap:"路线图",connect:"连接钱包",
      hero_title:"ZUZU 到来",hero_sub:"下一款伟大的 Meme 币已降临",
      d:"天",h:"时",m:"分",s:"秒",sale_title:"预售阶段",stage:"阶段",howmany:"购买多少 ZUZU？",
      price:"价格:",total:"合计:",buy_btn:"用 USDT (BEP20) 购买",
      note:"付款直接进入金库钱包。需要少量 BNB 作为 Gas。",
      receiver_title:"收款地址",copy:"复制",
      audit1:"合约: USDT (BEP20)",audit2:"转账 →",audit3:"非托管，直接入金库",
      trans_title:"透明度",trans_desc:"链上记录收款人。",
      raised_title:"已筹集",ai_text:"ZUZU 融合 AI 行为建模与社区信号。",
      about_title:"关于",about_text:"ZUZU 将 Meme 能量与极简严肃相结合。",
      token_title:"代币经济", modal_title:"提示", close:"关闭"},
  hi:{nav_about:"के बारे में",nav_token:"टोकनोमिक्स",nav_roadmap:"रोडमैप",connect:"वॉलेट कनेक्ट",
      hero_title:"ZUZU आ गया",hero_sub:"अगला बड़ा मीम कॉइन उतर चुका है",
      d:"दिन",h:"घंटे",m:"मिनट",s:"सेकंड",sale_title:"प्रीसेल चरण",stage:"चरण",howmany:"कितने ZUZU?",
      price:"कीमत:",total:"कुल:",buy_btn:"USDT (BEP20) से खरीदें",
      note:"भुगतान सीधे ट्रेज़री वॉलेट में जाएगा। गैस के लिए थोड़ा BNB चाहिए।",
      receiver_title:"रिसीवर एड्रेस",copy:"कॉपी",
      audit1:"कॉन्ट्रैक्ट: USDT (BEP20)",audit2:"ट्रांसफर →",audit3:"नॉन-कस्टोडियल, डायरेक्ट",
      trans_title:"पारदर्शिता",trans_desc:"ऑन-चेन रिकॉर्ड होगा।",
      raised_title:"जुटाई गई राशि",ai_text:"ZUZU AI और समुदाय संकेतों को जोड़ता है।",
      about_title:"के बारे में",about_text:"ZUZU मीम ऊर्जा और गंभीर रुख का मिश्रण है।",
      token_title:"टोकनोमिक्स", modal_title:"वॉलेट सूचना", close:"बंद करें"}
};

const $ = (q)=>document.querySelector(q);
const $$ = (q)=>document.querySelectorAll(q);

let currentLang = localStorage.getItem('zuzu_lang') || 'tr';

/* ========== UI INIT ========== */
window.addEventListener('DOMContentLoaded', () => {
  // Lottie maskot
  try {
    lottie.loadAnimation({
      container: document.getElementById('zuzuLottie'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: CONFIG.PROJECT.lottieUrl
    });
  } catch(e){}

  // Stage select
  const st = CONFIG.PRESALE.stages;
  const stageSel = $('#stage');
  st.forEach((s,i)=>{
    const o = document.createElement('option');
    o.value = i;
    o.textContent = `${s.name} — ${s.price.toFixed(6)} USDT / ZUZU`;
    stageSel.appendChild(o);
  });

  // Receiver address + short + QR
  $('#receiverAddr').value = CONFIG.PRESALE.receiver;
  $('#addrShort').textContent = shortAddr(CONFIG.PRESALE.receiver);
  makeQR(CONFIG.PRESALE.receiver, 0);

  // Dil
  $('#lang').value = currentLang;
  applyLang(currentLang);

  // Sayaç
  tickCountdown();

  // Fiyat hesap
  updatePrice();

  // Progress
  refreshProgress();

  // Sosyaller
  $('#tw').href = CONFIG.PROJECT.socials.twitter;
  $('#tg').href = CONFIG.PROJECT.socials.telegram;
  $('#dc').href = CONFIG.PROJECT.socials.discord;

  // Yıl
  $('#year').textContent = new Date().getFullYear();

  // Events
  $('#lang').addEventListener('change', (e)=>{
    currentLang = e.target.value;
    localStorage.setItem('zuzu_lang', currentLang);
    applyLang(currentLang);
  });

  $('#stage').addEventListener('change', updatePrice);
  $('#qty').addEventListener('input', updatePrice);
  $$('.chip').forEach(c => c.addEventListener('click', ()=>{
    $('#qty').value = c.dataset.amt; updatePrice();
  }));

  $('#btnCopy').addEventListener('click', ()=>{
    navigator.clipboard.writeText(CONFIG.PRESALE.receiver);
    toast(`✔ ${tr('copy')} ✓`);
  });

  $('#btnBuy').addEventListener('click', onBuy);
  $('#btnConnect').addEventListener('click', tryConnect);

  $('#modalClose').addEventListener('click', closeModal);
});

/* ========== I18N ========== */
function tr(key){
  return (I18N[currentLang] && I18N[currentLang][key]) || (I18N['en'][key] || key);
}
function applyLang(lang){
  $$('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    el.textContent = tr(k);
  });
}

/* ========== COUNTDOWN ========== */
function tickCountdown(){
  const end = new Date(CONFIG.PRESALE.endDate).getTime();
  function step(){
    const now = Date.now();
    let diff = Math.max(0, end - now);
    const d = Math.floor(diff / (1000*60*60*24)); diff -= d*86400000;
    const h = Math.floor(diff / (1000*60*60)); diff -= h*3600000;
    const m = Math.floor(diff / (1000*60)); diff -= m*60000;
    const s = Math.floor(diff / 1000);
    $('#d').textContent = d; $('#h').textContent = h; $('#m').textContent = m; $('#s').textContent = s;
    requestAnimationFrame(step);
  }
  step();
}

/* ========== PRICE ========== */
function updatePrice(){
  const st = CONFIG.PRESALE.stages[$('#stage').value || 0];
  const qty = parseFloat($('#qty').value || 0);
  const total = (qty * st.price) || 0;
  $('#uprice').textContent = st.price.toFixed(6);
  $('#total').textContent  = total.toFixed(6);
  makeQR(CONFIG.PRESALE.receiver, total);
}

/* ========== QR ========== */
let qr;
function makeQR(address, amount){
  const el = $('#qrcode'); el.innerHTML = "";
  const txt = `USDT (BEP20) → ${address}${amount>0?` | ${amount.toFixed(6)} USDT`:''}`;
  $('#qrInfo').textContent = txt;
  qr = new QRCode(el, {
    text: address,
    width: 160, height: 160, colorDark: "#ffffff", colorLight: "#0b1220"
  });
}

/* ========== PROGRESS ========== */
function refreshProgress(){
  const g = CONFIG.PRESALE.goalUSD;
  const r = CONFIG.PRESALE.raisedUSD;
  const pct = Math.min(100, (r/g)*100);
  $('#goal').textContent   = fmt(g);
  $('#raised').textContent = fmt(r);
  $('#pct').textContent    = `${pct.toFixed(1)}%`;
  $('#bar').style.width    = `${pct}%`;
}
function fmt(n){ return n.toLocaleString('en-US',{maximumFractionDigits:0}); }

/* ========== WALLET CONNECT (basic) ========== */
async function tryConnect(){
  if(!window.ethereum){
    openModal(`${tr('modal_title')}: MetaMask / TrustWallet gerekli.`);
    return;
  }
  try{
    await ethereum.request({method:'eth_requestAccounts'});
    // BSC ağına geç
    await ethereum.request({
      method:'wallet_switchEthereumChain',
      params:[{ chainId: '0x38' }] // 56
    }).catch(async (e)=>{
      if(e.code===4902){
        await ethereum.request({
          method:'wallet_addEthereumChain',
          params:[{ chainId:'0x38', chainName:'BNB Smart Chain',
            nativeCurrency:{name:'BNB',symbol:'BNB',decimals:18},
            rpcUrls:['https://bsc-dataseed.binance.org/'], blockExplorerUrls:['https://bscscan.com']}]
        });
      }
    });
    toast('✔ Connected');
  }catch(e){
    console.log(e);
    openModal('Bağlantı reddedildi veya desteklenmiyor.');
  }
}

/* ========== BUY (Token transfer için yönlendirme) ========== */
function onBuy(){
  const total = parseFloat($('#total').textContent) || 0;
  if(total <= 0){
    openModal('Miktar 0 olamaz.');
    return;
  }
  // Not: USDT (BEP20) kontrat çağrısı için backend/ABI gerekir.
  // Statik sitede kullanıcıyı "adrese USDT gönder" moduna yönlendiriyoruz:
  const addr = CONFIG.PRESALE.receiver;
  openModal(`Cüzdanınızdan <b>${total.toFixed(6)} USDT (BEP20)</b> tutarını aşağıdaki adrese gönderin:<br/><br/><b>${addr}</b><br/><br/>Gas için az miktar BNB gerekir.`);

  // QR güncelle
  makeQR(addr, total);
}

/* ========== Helpers ========== */
function shortAddr(a){ return a.slice(0,6)+'…'+a.slice(-4); }
function toast(t){
  const m = $('#modal'); const b = $('.modal-body'); $('#modalText').innerHTML = t; m.classList.remove('hidden');
  setTimeout(()=>{ m.classList.add('hidden'); }, 1600);
}
function openModal(html){ $('#modalText').innerHTML = html; $('#modal').classList.remove('hidden'); }
function closeModal(){ $('#modal').classList.add('hidden'); }

// Admin link dummy
$('#adminLink')?.addEventListener('click', (e)=>{ e.preventDefault(); openModal('Admin Panel yakında. Zincir okumaları bu bölüme gelecek.'); });
