// ====== UTIL ======
const $ = (q, el=document)=>el.querySelector(q);
const $$ = (q, el=document)=>Array.from(el.querySelectorAll(q));
const fmt = (n, d=6)=>Number(n||0).toLocaleString(undefined,{minimumFractionDigits:d,maximumFractionDigits:d});

let CFG = null;
let provider, signer, account;
let currentStage = 0;
let lang = 'tr';

const I18N = {
  tr: {
    connect:'Cüzdan Bağla', hero_sub:'Bir sonraki büyük meme coini iniş yaptı',
    days:'Gün',hours:'Saat',minutes:'Dakika',seconds:'Saniye',
    presale_title:'Ön Satış Aşaması', stage:'Aşama', how_many:'Kaç ZUZU?',
    price:'Fiyat', total:'Toplam', buy_usdt:'USDT (BEP20) ile Satın Al',
    help1:'Ödeme USDT (BEP20) ile direkt proje kasasına gider. Gas için az miktar BNB gerekir.',
    dest_addr:'Ödeme Alıcı Adresi', copy:'Kopyala', about:'Hakkında',
    about_text:'ZUZU; meme maskot enerjisiyle minimal ve ciddi duruşu birleştiren topluluk coinidir. Presale USDT (BEP20) ile direkt kasaya gider. CEX başvuruları presale bitiminde.'
  },
  en: {
    connect:'Connect Wallet', hero_sub:'The next great meme coin has landed',
    days:'Days',hours:'Hours',minutes:'Minutes',seconds:'Seconds',
    presale_title:'Presale', stage:'Stage', how_many:'How many ZUZU?',
    price:'Price', total:'Total', buy_usdt:'Buy with USDT (BEP20)',
    help1:'Payment goes directly to the project treasury (BEP20). Small BNB for gas required.',
    dest_addr:'Receiving Address', copy:'Copy', about:'About',
    about_text:'ZUZU blends meme energy with a minimal & serious vibe. Presale payments go to treasury in USDT (BEP20). CEX listings will be applied post-presale.'
  },
  pt: { connect:'Conectar Carteira', hero_sub:'A próxima grande meme coin chegou',
    days:'Dias',hours:'Horas',minutes:'Minutos',seconds:'Segundos',
    presale_title:'Pré-venda', stage:'Etapa', how_many:'Quantos ZUZU?',
    price:'Preço', total:'Total', buy_usdt:'Comprar com USDT (BEP20)',
    help1:'O pagamento vai direto ao tesouro do projeto (BEP20). Precisa um pouco de BNB para taxas.',
    dest_addr:'Endereço de Recebimento', copy:'Copiar', about:'Sobre',
    about_text:'ZUZU combina energia de meme com um visual minimalista & sério. Pagamentos em USDT (BEP20).'
  },
  ru: { connect:'Подключить кошелек', hero_sub:'Новая великая мем-монета приземлилась',
    days:'Дней',hours:'Часов',minutes:'Минут',seconds:'Секунд',
    presale_title:'Предпродажа', stage:'Этап', how_many:'Сколько ZUZU?',
    price:'Цена', total:'Итого', buy_usdt:'Купить USDT (BEP20)',
    help1:'Платёж идёт напрямую в казну проекта (BEP20). Нужна небольшая сумма BNB на газ.',
    dest_addr:'Адрес получателя', copy:'Копировать', about:'О проекте',
    about_text:'ZUZU сочетает энергию мемов с минималистичным и серьёзным стилем.'
  },
  zh: { connect:'连接钱包', hero_sub:'下一款伟大的梗币已降临',
    days:'天',hours:'时',minutes:'分',seconds:'秒',
    presale_title:'预售', stage:'阶段', how_many:'购买多少 ZUZU？',
    price:'价格', total:'总计', buy_usdt:'用 USDT (BEP20) 购买',
    help1:'付款直接进入项目金库 (BEP20)。需要少量 BNB 作为 gas。',
    dest_addr:'收款地址', copy:'复制', about:'关于',
    about_text:'ZUZU 将梗文化与极简但严肃的风格结合。'
  },
  hi: { connect:'वॉलेट कनेक्ट करें', hero_sub:'अगला बड़ा मीम कॉइन आ चुका है',
    days:'दिन',hours:'घंटे',minutes:'मिनट',seconds:'सेकंड',
    presale_title:'प्रीसेल', stage:'चरण', how_many:'कितना ZUZU?',
    price:'कीमत', total:'कुल', buy_usdt:'USDT (BEP20) से खरीदें',
    help1:'पेमेंट सीधे प्रोजेक्ट ट्रेज़री (BEP20) में जाता है। गैस के लिए थोड़ा BNB चाहिए।',
    dest_addr:'रिसीविंग एड्रेस', copy:'कॉपी', about:'परिचय',
    about_text:'ZUZU मीम ऊर्जा को मिनिमल और गंभीर लुक के साथ जोड़ता है।'
  }
};

function applyLang(lc){
  lang = lc;
  $$("[data-i18n]").forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if (I18N[lc] && I18N[lc][key]) el.textContent = I18N[lc][key];
  });
  $('#btnConnect').textContent = I18N[lc].connect;
  $('#btnBuy').textContent = I18N[lc].buy_usdt;
}

async function loadConfig(){
  try{
    const r = await fetch('config.json?'+Date.now());
    CFG = await r.json();
  }catch(e){
    console.error('config load fail', e);
  }
}

// ====== COUNTDOWN ======
function runCountdown(endISO){
  const end = new Date(endISO).getTime();
  const tick = ()=>{
    const now = Date.now();
    let s = Math.max(0, Math.floor((end - now)/1000));
    const d = Math.floor(s/86400); s%=86400;
    const h = Math.floor(s/3600); s%=3600;
    const m = Math.floor(s/60); s%=60;
    $('#d').textContent = d; $('#h').textContent = h; $('#m').textContent = m; $('#s').textContent = s;
  };
  tick(); setInterval(tick, 1000);
}

// ====== UI BUILD ======
function buildStages(){
  const sel = $('#stage');
  sel.innerHTML = '';
  CFG.PRESALE.stages.forEach((st, i)=>{
    const o = document.createElement('option');
    o.value = i;
    o.textContent = `${st.name} — ${st.priceUsdt} USDT / ZUZU`;
    sel.appendChild(o);
  });
  currentStage = 0;
  sel.value = 0;
  $('#price').textContent = CFG.PRESALE.stages[0].priceUsdt.toFixed(6);
}

function updateCalc(){
  const z = Number($('#amount').value||0);
  const p = CFG.PRESALE.stages[currentStage].priceUsdt;
  const total = z * p;
  $('#total').textContent = fmt(total,6);
}

function fillBasics(){
  $('#receiver').textContent = CFG.PRESALE.receiver;
  $('#year').textContent = new Date().getFullYear();
  $('#tw').href = CFG.PROJECT.twitter;
  $('#tg').href = CFG.PROJECT.telegram;
  $('#dc').href = CFG.PROJECT.discord;

  // Lang options
  const langSel = $('#lang');
  langSel.innerHTML = '';
  [['tr','TR'],['en','EN'],['pt','PT'],['ru','RU'],['zh','中文'],['hi','HI']].forEach(([v,t])=>{
    const o = document.createElement('option'); o.value=v; o.textContent=t; langSel.appendChild(o);
  });
  langSel.value = 'tr';
}

function makeQR(text){
  // Basit QR (mini) – harici libs kullanmadan
  // Burada QR yerine sadece adresi büyük puntolu yazı gibi çiziyoruz; istersen gerçek QR lib ekleyebiliriz.
  const c = $('#qr'); const ctx = c.getContext('2d');
  ctx.fillStyle='#0b1223'; ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle='#6ecbff'; ctx.font='bold 12px monospace';
  const lines = text.match(/.{1,16}/g) || [text];
  lines.slice(0,8).forEach((ln,i)=>ctx.fillText(ln,6,16+i*15));
}

// ====== WALLET / BUY ======
async function connect(){
  if(!window.ethereum){
    alert('MetaMask / TrustWallet gerekli.');
    return;
  }
  provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  await provider.send('eth_requestAccounts',[]);
  signer = provider.getSigner();
  account = await signer.getAddress();

  // BSC kontrol & switch
  const net = await provider.getNetwork();
  if(net.chainId !== 56){
    try{
      await provider.send('wallet_switchEthereumChain', [{ chainId: '0x38' }]);
    }catch(e){
      // ağ ekle
      if(e.code === 4902){
        await provider.send('wallet_addEthereumChain',[{
          chainId:'0x38',
          chainName:'BNB Smart Chain',
          nativeCurrency:{name:'BNB',symbol:'BNB',decimals:18},
          rpcUrls:['https://bsc-dataseed.binance.org/'],
          blockExplorerUrls:['https://bscscan.com']
        }]);
      }else{
        console.warn(e);
      }
    }
  }

  $('#btnConnect').classList.add('ok');
  $('#btnConnect').textContent = account.slice(0,6)+'…'+account.slice(-4);
}

async function buy(){
  const z = Number($('#amount').value||0);
  if(!z || z<=0) return alert('Miktar gir.');
  if(!window.ethereum) return alert('MetaMask / TrustWallet gerekli.');

  const p = CFG.PRESALE.stages[currentStage].priceUsdt;
  const usdtAmount = z * p; // float
  const usdtWei = ethers.utils.parseUnits(usdtAmount.toFixed(18), 18);

  if(!provider) await connect();
  const erc20Abi = ["function transfer(address to,uint256 amount) returns (bool)"];
  const usdt = new ethers.Contract(CFG.PRESALE.usdtToken, erc20Abi, signer);

  try{
    const tx = await usdt.transfer(CFG.PRESALE.receiver, usdtWei);
    alert('İşlem gönderildi.\nTx: '+tx.hash+'\nBscScan ile izleyebilirsin.');
  }catch(e){
    console.error(e);
    alert('İşlem iptal edildi veya hata oluştu.');
  }
}

// ====== EVENTS ======
document.addEventListener('DOMContentLoaded', async ()=>{
  await loadConfig();
  fillBasics();
  applyLang('tr');
  buildStages();
  updateCalc();
  runCountdown(CFG.PRESALE.endDate);
  makeQR(CFG.PRESALE.receiver);

  // events
  $('#lang').addEventListener('change', e=>applyLang(e.target.value));
  $('#stage').addEventListener('change', e=>{currentStage=Number(e.target.value); $('#price').textContent = CFG.PRESALE.stages[currentStage].priceUsdt.toFixed(6); updateCalc();});
  $('#amount').addEventListener('input', updateCalc);
  $('#btnConnect').addEventListener('click', connect);
  $('#btnBuy').addEventListener('click', buy);
  $('#copyAddr').addEventListener('click', ()=>{
    navigator.clipboard.writeText(CFG.PRESALE.receiver);
    $('#copyAddr').textContent = 'Kopyalandı';
    setTimeout(()=>$('#copyAddr').textContent = I18N[lang].copy, 1200);
  });
});
