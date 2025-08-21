// ====== Helpers ======
const $ = (q, el=document)=>el.querySelector(q);
const $$ = (q, el=document)=>Array.from(el.querySelectorAll(q));
const fmt = (n, d=6)=>Number(n||0).toLocaleString(undefined,{minimumFractionDigits:d,maximumFractionDigits:d});

let CFG=null, provider, signer, account, currentStage=0, lang='tr', motionOK=true;

// i18n
const I18N = {
  tr:{connect:'Cüzdan Bağla',hero_sub:'Bir sonraki büyük meme coini iniş yaptı',days:'Gün',hours:'Saat',minutes:'Dakika',seconds:'Saniye',presale_title:'Ön Satış Aşaması',stage:'Aşama',how_many:'Kaç ZUZU?',price:'Fiyat',total:'Toplam',buy_usdt:'USDT (BEP20) ile Satın Al',help1:'Ödeme USDT (BEP20) ile doğrudan proje kasasına gider. Gas için az miktar BNB gerekir.',dest_addr:'Ödeme Alıcı Adresi',copy:'Kopyala',about:'Hakkında',about_text:'ZUZU; meme maskot enerjisiyle minimal ve ciddi duruşu birleştiren topluluk coinidir. Presale USDT (BEP20) ile direkt kasaya gider. CEX başvuruları presale bitiminde.'},
  en:{connect:'Connect Wallet',hero_sub:'The next great meme coin has landed',days:'Days',hours:'Hours',minutes:'Minutes',seconds:'Seconds',presale_title:'Presale',stage:'Stage',how_many:'How many ZUZU?',price:'Price',total:'Total',buy_usdt:'Buy with USDT (BEP20)',help1:'Payment goes directly to the project treasury (BEP20). Small BNB for gas required.',dest_addr:'Receiving Address',copy:'Copy',about:'About',about_text:'ZUZU blends meme energy with a minimal & serious vibe. Presale payments go to treasury in USDT (BEP20). CEX listings will be applied post-presale.'},
  pt:{connect:'Conectar Carteira',hero_sub:'A próxima grande meme coin chegou',days:'Dias',hours:'Horas',minutes:'Minutos',seconds:'Segundos',presale_title:'Pré-venda',stage:'Etapa',how_many:'Quantos ZUZU?',price:'Preço',total:'Total',buy_usdt:'Comprar com USDT (BEP20)',help1:'O pagamento vai direto ao tesouro do projeto (BEP20). Precisa um pouco de BNB para taxas.',dest_addr:'Endereço de Recebimento',copy:'Copiar',about:'Sobre',about_text:'ZUZU combina energia de meme com visual minimalista & sério.'},
  ru:{connect:'Подключить кошелек',hero_sub:'Новая великая мем-монета приземлилась',days:'Дней',hours:'Часов',minutes:'Минут',seconds:'Секунд',presale_title:'Предпродажа',stage:'Этап',how_many:'Сколько ZUZU?',price:'Цена',total:'Итого',buy_usdt:'Купить USDT (BEP20)',help1:'Платёж идёт напрямую в казну проекта (BEP20). Нужна небольшая сумма BNB на газ.',dest_addr:'Адрес получателя',copy:'Копировать',about:'О проекте',about_text:'ZUZU сочетает энергию мемов с минималистичным стилем.'},
  zh:{connect:'连接钱包',hero_sub:'下一款伟大的梗币已降临',days:'天',hours:'时',minutes:'分',seconds:'秒',presale_title:'预售',stage:'阶段',how_many:'购买多少 ZUZU？',price:'价格',total:'总计',buy_usdt:'用 USDT (BEP20) 购买',help1:'付款直接进入项目金库 (BEP20)。需要少量 BNB 作为 gas。',dest_addr:'收款地址',copy:'复制',about:'关于',about_text:'ZUZU 将梗文化与极简但严肃的风格结合。'},
  hi:{connect:'वॉलेट कनेक्ट करें',hero_sub:'अगला बड़ा मीम कॉइन आ चुका है',days:'दिन',hours:'घंटे',minutes:'मिनट',seconds:'सेकंड',presale_title:'प्रीसेल',stage:'चरण',how_many:'कितना ZUZU?',price:'कीमत',total:'कुल',buy_usdt:'USDT (BEP20) से खरीदें',help1:'पेमेंट सीधे प्रोजेक्ट ट्रेज़री (BEP20) में जाता है। गैस के लिए थोड़ा BNB चाहिए।',dest_addr:'रिसीविंग एड्रेस',copy:'कॉपी',about:'परिचय',about_text:'ZUZU मीम ऊर्जा को मिनिमल और गंभीर स्टाइल के साथ जोड़ता है।'}
};

function applyLang(lc){lang = lc; $$("[data-i18n]").forEach(el=>{const k=el.dataset.i18n; if(I18N[lc][k]) el.textContent=I18N[lc][k];}); $('#btnConnect').textContent=I18N[lc].connect; $('#btnBuy').textContent=I18N[lc].buy_usdt;}
async function loadConfig(){const r=await fetch('config.json?'+Date.now()); CFG=await r.json();}

// ====== Countdown ======
function runCountdown(endISO){
  const end = new Date(endISO).getTime();
  const tick=()=>{
    const now=Date.now(); let s=Math.max(0,Math.floor((end-now)/1000));
    const d=Math.floor(s/86400); s%=86400; const h=Math.floor(s/3600); s%=3600; const m=Math.floor(s/60); s%=60;
    $('#d').textContent=d; $('#h').textContent=h; $('#m').textContent=m; $('#s').textContent=s;
  }; tick(); setInterval(tick,1000);
}

// ====== UI ======
function fillBasics(){
  $('#year').textContent = new Date().getFullYear();
  $('#tw').href=CFG.PROJECT.twitter; $('#tg').href=CFG.PROJECT.telegram; $('#dc').href=CFG.PROJECT.discord;
  $('#receiver').textContent = CFG.PRESALE.receiver;

  // Languages
  const langSel=$('#lang'); langSel.innerHTML=''; [['tr','TR'],['en','EN'],['pt','PT'],['ru','RU'],['zh','中文'],['hi','HI']]
   .forEach(([v,t])=>{const o=document.createElement('option');o.value=v;o.textContent=t;langSel.appendChild(o);});
  langSel.value='tr';
}

function buildStages(){
  const sel=$('#stage'); sel.innerHTML='';
  CFG.PRESALE.stages.forEach((st,i)=>{const o=document.createElement('option');o.value=i;o.textContent=`${st.name} — ${st.priceUsdt} USDT / ZUZU`; sel.appendChild(o);});
  currentStage=0; sel.value=0; $('#price').textContent=CFG.PRESALE.stages[0].priceUsdt.toFixed(6);
}

function updateCalc(){
  const z=Number($('#amount').value||0);
  const p=CFG.PRESALE.stages[currentStage].priceUsdt;
  $('#total').textContent = fmt(z*p,6);
}

// ====== Wallet / Buy ======
async function connect(){
  if(!window.ethereum) return alert('MetaMask / TrustWallet gerekli.');
  provider = new ethers.providers.Web3Provider(window.ethereum,'any');
  await provider.send('eth_requestAccounts',[]); signer=provider.getSigner(); account=await signer.getAddress();
  const net=await provider.getNetwork();
  if(net.chainId!==56){
    try{await provider.send('wallet_switchEthereumChain',[{chainId:'0x38'}]);}
    catch(e){ if(e.code===4902){ await provider.send('wallet_addEthereumChain',[{chainId:'0x38',chainName:'BNB Smart Chain',nativeCurrency:{name:'BNB',symbol:'BNB',decimals:18},rpcUrls:['https://bsc-dataseed.binance.org/'],blockExplorerUrls:['https://bscscan.com']}]); } }
  }
  $('#btnConnect').textContent = account.slice(0,6)+'…'+account.slice(-4);
  $('#btnConnect').classList.add('ok');
}

async function buy(){
  const z=Number($('#amount').value||0); if(!z) return alert('Miktar gir.');
  if(!window.ethereum) return alert('MetaMask / TrustWallet gerekli.');
  if(!provider) await connect();
  const price = CFG.PRESALE.stages[currentStage].priceUsdt;
  const amountUsdt = z * price;
  const erc20Abi=["function transfer(address to,uint256 amount) returns (bool)"];
  const usdt = new ethers.Contract(CFG.PRESALE.usdtToken, erc20Abi, signer);
  const wei = ethers.utils.parseUnits(amountUsdt.toFixed(18),18);
  try{ const tx=await usdt.transfer(CFG.PRESALE.receiver, wei); alert('İşlem gönderildi.\nTx: '+tx.hash); }catch(e){ console.error(e); alert('İşlem iptal edildi veya hata oluştu.'); }
}

// ====== QR (basit metin) ======
function makeQR(text){
  const c=$('#qr'); const ctx=c.getContext('2d');
  ctx.fillStyle='#081022'; ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle='#7fd4ff'; ctx.font='bold 12px monospace';
  const lines=text.match(/.{1,16}/g)||[text]; lines.slice(0,8).forEach((ln,i)=>ctx.fillText(ln,6,16+i*15));
}

// ====== Parallax + maskot ======
function parallaxInit(){
  if(!motionOK) return;
  const layers=$$('[data-depth]');
  const onMove=(x,y)=>{
    const cx=window.innerWidth/2, cy=window.innerHeight/2;
    const dx=(x-cx)/cx, dy=(y-cy)/cy;
    layers.forEach(el=>{
      const d=parseFloat(el.dataset.depth||0.05);
      el.style.transform=`translate3d(${dx*d*-30}px, ${dy*d*-30}px, 0)`;
    });
    // Göz takip
    const box=$('#zuzu').getBoundingClientRect();
    const mx=x-box.left, my=y-box.top;
    const centerX=box.width/2, centerY=box.height/2;
    const vx=(mx-centerX)/centerX, vy=(my-centerY)/centerY;
    const r=6; // pupil radius shift
    $('#pupL').setAttribute('cx', 100 + r*vx);
    $('#pupL').setAttribute('cy', 120 + r*vy);
    $('#pupR').setAttribute('cx', 160 + r*vx);
    $('#pupR').setAttribute('cy', 120 + r*vy);
  };
  window.addEventListener('mousemove', e=>onMove(e.clientX,e.clientY), {passive:true});
  window.addEventListener('touchmove', e=>{
    const t=e.touches[0]; if(t) onMove(t.clientX,t.clientY);
  }, {passive:true});
}

// Yıldızlar
function starsInit(){
  const c=$('#stars'); const ctx=c.getContext('2d');
  let w,h,stars=[];
  function resize(){w=c.width=window.innerWidth; h=c.height=window.innerHeight; stars=Array.from({length:Math.min(220,Math.floor(w*h/8000))},()=>({x:Math.random()*w,y:Math.random()*h,s:Math.random()*1.2+0.2,sp:Math.random()*0.3+0.05}));}
  function draw(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle='#ffffff';
    stars.forEach(st=>{ctx.globalAlpha=st.s; ctx.fillRect(st.x,st.y,1.2,1.2); st.y+=st.sp; if(st.y>h){st.y=0; st.x=Math.random()*w;}});
    requestAnimationFrame(draw);
  }
  resize(); draw(); window.addEventListener('resize',resize);
}

// ====== Events ======
document.addEventListener('DOMContentLoaded', async ()=>{
  // motion reduce
  try{ motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(_){}
  await loadConfig();
  fillBasics(); buildStages(); updateCalc(); runCountdown(CFG.PRESALE.endDate); makeQR(CFG.PRESALE.receiver);
  // Lang
  $('#lang').addEventListener('change',e=>applyLang(e.target.value)); applyLang('tr');
  // Inputs
  $('#stage').addEventListener('change',e=>{currentStage=+e.target.value; $('#price').textContent=CFG.PRESALE.stages[currentStage].priceUsdt.toFixed(6); updateCalc();});
  $('#amount').addEventListener('input',updateCalc);
  $('#btnConnect').addEventListener('click',connect);
  $('#btnBuy').addEventListener('click',buy);
  $('#copyAddr').addEventListener('click',()=>{navigator.clipboard.writeText(CFG.PRESALE.receiver); const b=$('#copyAddr'); b.textContent=I18N[lang].copy+' ✓'; setTimeout(()=>b.textContent=I18N[lang].copy,1200);});

  // Parallax + yıldızlar
  parallaxInit(); starsInit();
});
