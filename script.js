// ---- Config yükle ----------------------------------------------------------
let CFG = {
  receiver: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3",   // senin adresin
  usdt:     "0x55d398326f99059fF775485246999027B3197955",  // BSC USDT
  targetUSD: 300000,
  // Stage fiyatları (USDT / ZUZU)
  stages: [
    { name: "Stage 1 — 0.002000 USDT / ZUZU", price: 0.002 },
    { name: "Stage 2 — 0.003000 USDT / ZUZU", price: 0.003 },
    { name: "Stage 3 — 0.004000 USDT / ZUZU", price: 0.004 },
    { name: "Stage 4 — 0.005000 USDT / ZUZU", price: 0.005 }
  ],
  // BscScan API (opsiyonel; boş kalırsa local değer)
  bscscanKey: ""  // istersen anahtarını gir
};

const $ = s => document.querySelector(s);

// ---- UI init ---------------------------------------------------------------
window.addEventListener('DOMContentLoaded', init);

async function init(){
  // Lottie
  try{
    if(window.lottie){
      window.lottie.loadAnimation({
        container: document.getElementById('lottie'),
        renderer:'svg', loop:true, autoplay:true,
        path:'https://assets5.lottiefiles.com/private_files/lf30_2kzn2x.json'
      });
    }
  }catch(e){console.warn(e)}

  // Stage listesi
  const st = $('#stage');
  CFG.stages.forEach((x,i)=>{
    const o = document.createElement('option');
    o.value = i; o.textContent = x.name;
    st.appendChild(o);
  });

  // Receiver/QR/Target
  $('#rcv').value = CFG.receiver;
  $('#qr').src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(CFG.receiver)}`;
  $('#target').textContent = CFG.targetUSD.toLocaleString();

  // Eventler
  document.querySelectorAll('.chip').forEach(ch=>ch.addEventListener('click',()=>{$('#amount').value = ch.dataset.amt; calc();}));
  $('#amount').addEventListener('input', calc);
  $('#stage').addEventListener('change', calc);
  $('#btnCopyRcv').addEventListener('click',()=>copy($('#rcv').value));
  $('#btnCopyRef').addEventListener('click',()=>copy($('#refLink').href));
  $('#btnBuy').addEventListener('click', buyUSDT);
  $('#btnConnect').addEventListener('click', connect);

  // Lang
  $('#lang').addEventListener('change', setLang);
  setLang();

  // Countdown 40 gün
  const end = Date.now() + 40*24*60*60*1000;
  setInterval(()=>{ tick(end); },1000); tick(end);

  // Referans link
  buildRefLink();

  // Tap-to-earn
  initTap();

  // Staking UI
  $('#stakeDays').addEventListener('change', updateApy);
  updateApy();

  // Raised
  raised();
  calc();
}

function setLang(){
  const v = $('#lang').value;
  const tr = {
    hTitle:'<span class="neon-orange">YAPAY ZEKA</span> MEME AJANI',
    hDesc:'ZUZU; memetik enerjiyi <b>AI Meme Intelligence</b> ile birleştirir. Fonlar <b>non-custodial</b> hazinede tutulur.',
    stgLbl:'Aşama', howmanyLbl:'Kaç ZUZU?', buyTitle:'$ZUZU Token Satın Al – Şimdi Ön Satışta!'
  };
  const en = {
    hTitle:'<span class="neon-orange">AI-POWERED</span> MEME AGENT',
    hDesc:'ZUZU merges memetic energy with <b>AI Meme Intelligence</b>. Funds are kept in a <b>non-custodial</b> treasury.',
    stgLbl:'Stage', howmanyLbl:'How many ZUZU?', buyTitle:'Buy $ZUZU Token – Presale Live!'
  };
  const t = v==='en'?en:tr;
  $('#hTitle').innerHTML = t.hTitle;
  $('#hDesc').innerHTML = t.hDesc;
  $('#stgLbl').textContent = t.stgLbl;
  $('#howmanyLbl').textContent = t.howmanyLbl;
  $('#buyTitle').textContent = t.buyTitle;
}

function tick(end){
  let r = Math.max(0, end - Date.now());
  let s = Math.floor(r/1000);
  let d = Math.floor(s/86400); s-=d*86400;
  let h = Math.floor(s/3600); s-=h*3600;
  let m = Math.floor(s/60); s-=m*60;
  $('#cdD').textContent=d; $('#cdH').textContent=h; $('#cdM').textContent=m; $('#cdS').textContent=s;
}

function calc(){
  const st = CFG.stages[+$('#stage').value||0];
  const amt = Math.max(0, +$('#amount').value||0);
  const total = (st.price * amt);
  $('#priceLine').textContent = st.price.toFixed(6) + ' USDT / ZUZU';
  $('#totalLine').textContent = total.toFixed(6) + ' USDT';
}

function copy(t){ navigator.clipboard.writeText(t).then(()=>alert('Kopyalandı')); }

function buildRefLink(){
  const cur = new URL(location.href);
  const ref = cur.searchParams.get('ref') || 'share-this-link';
  const me = `${location.origin}/?ref=${encodeURIComponent(ref)}`;
  const a = $('#refLink'); a.textContent = me; a.href = me;
}

function initTap(){
  const urlRef = new URL(location.href).searchParams.get('ref');
  const mult = urlRef && urlRef!=='share-this-link' ? 1.2 : 1;
  $('#mult').textContent = mult+'x';
  let score = +(localStorage.getItem('zuzu_score')||0);
  $('#score').textContent = Math.floor(score);
  $('#btnTap').addEventListener('click',()=>{
    score += 1*mult; localStorage.setItem('zuzu_score',score);
    $('#score').textContent = Math.floor(score);
  });
}

function updateApy(){
  const d = +$('#stakeDays').value;
  const apy = d===30?12 : d===60?22 : 36;
  $('#apy').textContent = apy+'%';
}

// ---- Raised / BscScan ------------------------------------------------------
async function raised(){
  let sum = 0;
  try{
    if(CFG.bscscanKey){
      // Receiver’a gelen USDT transferlerini toplar
      const url = `https://api.bscscan.com/api?module=account&action=tokentx&address=${CFG.receiver}&contractaddress=${CFG.usdt}&page=1&offset=200&sort=desc&apikey=${CFG.bscscanKey}`;
      const r = await fetch(url); const j = await r.json();
      if(j.status==='1'){
        // Yalnızca gelen (to == receiver)
        for(const tx of j.result){
          if(tx.to.toLowerCase()===CFG.receiver.toLowerCase()){
            const val = Number(tx.value)/1e18; // USDT 18 decimals on BSC
            sum += val;
          }
        }
      }
    }
  }catch(e){ console.warn('BscScan yok/yanıt yok, local 0 kullanılacak'); }
  $('#raised').textContent = sum.toLocaleString(undefined,{maximumFractionDigits:2});
  const p = Math.min(100, (sum/CFG.targetUSD)*100);
  $('#bar').style.width = p+'%';
}

// ---- Wallet / USDT Transfer -------------------------------------------------
async function connect(){
  if(!window.ethereum){ alert('MetaMask/TrustWallet gerekli. Uygulama içi tarayıcıdan aç.'); return; }
  const chainId = '0x38'; // BSC
  const cur = await ethereum.request({method:'eth_chainId'});
  if(cur!==chainId){
    try{
      await ethereum.request({method:'wallet_switchEthereumChain', params:[{chainId}]});
    }catch(e){
      try{
        await ethereum.request({method:'wallet_addEthereumChain', params:[{
          chainId, chainName:'BNB Smart Chain', nativeCurrency:{name:'BNB',symbol:'BNB',decimals:18},
          rpcUrls:['https://bsc-dataseed1.binance.org'], blockExplorerUrls:['https://bscscan.com']
        }]});
      }catch(err){ console.error(err); alert('BSC ağı eklenemedi.'); return; }
    }
  }
  const accs = await ethereum.request({method:'eth_requestAccounts'});
  const a = accs[0];
  $('#btnConnect').textContent = a.slice(0,6)+'…'+a.slice(-4);

  // referans linki adres ile üret
  const u = new URL(location.origin);
  u.searchParams.set('ref', a);
  $('#refLink').href = u.toString();
  $('#refLink').textContent = u.toString();
}

async function buyUSDT(){
  if(!window.ethereum) return alert('Cüzdan bulunamadı.');
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const st = CFG.stages[+$('#stage').value||0];
  const amountZUZU = Math.max(0, +$('#amount').value||0);
  const totalUSDT = st.price * amountZUZU;

  if(totalUSDT<=0) return alert('Miktar gir.');
  const usdt = new ethers.Contract(
    CFG.usdt,
    ["function transfer(address to,uint256 value) returns (bool)","function decimals() view returns(uint8)"],
    signer
  );
  const dec = await usdt.decimals();
  const val = ethers.utils.parseUnits(totalUSDT.toFixed(dec), dec);

  try{
    const tx = await usdt.transfer(CFG.receiver, val);
    alert('İşlem gönderildi: '+tx.hash);
  }catch(e){
    console.error(e); alert('İşlem iptal/hata.');
  }
}
