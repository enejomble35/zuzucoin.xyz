// ====== Basit Konfig ======
let CFG;

async function loadConfig(){
  try{
    const r = await fetch('config.json?_=' + Date.now());
    CFG = await r.json();
  }catch(e){
    // Yedek (fetch çalışmazsa)
    CFG = {
      PROJECT:{name:"ZUZU",tagline:"ZUZU is watching. And pumping.",symbol:"ZUZU",decimals:18,siteUrl:"https://www.zuzucoin.xyz"},
      PRESALE:{
        receiver:"0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3",
        networkName:"Ethereum", chainId:1,
        stages:[
          {name:"Stage 1", priceEth:0.0000020},
          {name:"Stage 2", priceEth:0.0000030},
          {name:"Stage 3", priceEth:0.0000040},
          {name:"Stage 4", priceEth:0.0000050}
        ],
        endDate:"2025-09-30T21:00:00+03:00"
      },
      ADDRESSES:{ETH:"0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3",SOL:"",TON:""},
      SOCIALS:{twitter:"https://twitter.com/",telegram:"https://t.me/memedsener",discord:"https://discord.com/"}
    };
  }
}

function qs(s){return document.querySelector(s)}
function qsa(s){return [...document.querySelectorAll(s)]}

function initUI(){
  // Receiver / socials
  qs('#receiver').textContent = CFG.PRESALE.receiver;
  qs('#tw').href = CFG.SOCIALS.twitter;
  qs('#tg').href = CFG.SOCIALS.telegram;
  qs('#dc').href = CFG.SOCIALS.discord;
  qs('#y').textContent = new Date().getFullYear();
  qs('#priceLabel').textContent = 'Fiyat: -';

  // Stages
  const sel = qs('#stageSelect');
  CFG.PRESALE.stages.forEach((st, i)=>{
    const o = document.createElement('option');
    o.value = i; o.textContent = `${st.name} — ${st.priceEth} ETH / ZUZU`;
    sel.appendChild(o);
  });
  sel.addEventListener('change', updateTotal);
  qs('#amount').addEventListener('input', updateTotal);

  // Sayaç
  startCountdown(new Date(CFG.PRESALE.endDate));
  updateTotal();

  // Kopyala
  qs('#copy-rec').addEventListener('click', ()=>{
    navigator.clipboard.writeText(CFG.PRESALE.receiver);
    qs('#copy-rec').textContent='Kopyalandı ✓';
    setTimeout(()=>qs('#copy-rec').textContent='Kopyala',1200);
  });

  // Cüzdan bağla / satın al
  qs('#btn-connect').addEventListener('click', connectWallet);
  qs('#btn-buy').addEventListener('click', buyWithETH);
}

function updateTotal(){
  const i = Number(qs('#stageSelect').value || 0);
  const price = CFG.PRESALE.stages[i].priceEth;
  const amount = Number(qs('#amount').value || 0);
  const total = price * amount;
  qs('#priceLabel').textContent = `Fiyat: ${price} ETH / ZUZU`;
  qs('#totalEth').textContent = `Toplam (ETH): ${total.toFixed(8)}`;
}

let provider, signer, account;

async function connectWallet(){
  if(!window.ethereum){ alert('MetaMask/TrustWallet gerekli.'); return; }
  try{
    const accs = await window.ethereum.request({method:'eth_requestAccounts'});
    account = accs[0];
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();

    const net = await provider.getNetwork();
    if(net.chainId !== CFG.PRESALE.chainId){
      qs('#netHint').textContent = `Ağ: Ethereum Mainnet kullanın. (Mevcut chainId: ${net.chainId})`;
      qs('#netHint').style.color = '#ffb74d';
    }else{
      qs('#netHint').textContent = 'Ağ uygun.';
      qs('#netHint').style.color = '#16c784';
    }
    qs('#btn-connect').textContent = account.slice(0,6)+'…'+account.slice(-4);
  }catch(err){
    console.error(err);
    alert('Cüzdan bağlantısı reddedildi.');
  }
}

async function buyWithETH(){
  if(!provider){ await connectWallet(); if(!provider) return; }
  const i = Number(qs('#stageSelect').value || 0);
  const price = CFG.PRESALE.stages[i].priceEth;
  const amount = Number(qs('#amount').value || 0);
  if(amount<=0){ alert('Miktar gir.'); return; }

  const totalEth = price * amount;
  const valueWei = ethers.utils.parseEther(totalEth.toString());

  try{
    const tx = await signer.sendTransaction({
      to: CFG.PRESALE.receiver,
      value: valueWei
    });
    alert('İşlem gönderildi: '+tx.hash);
  }catch(e){
    console.error(e);
    alert('İşlem iptal edildi ya da hata oluştu.');
  }
}

function startCountdown(target){
  function tick(){
    const now = new Date();
    const diff = target - now;
    let d=0,h=0,m=0,s=0;
    if(diff>0){
      d = Math.floor(diff/86400000);
      h = Math.floor((diff%86400000)/3600000);
      m = Math.floor((diff%3600000)/60000);
      s = Math.floor((diff%60000)/1000);
    }
    qs('#d').textContent = String(d).padStart(2,'0');
    qs('#h').textContent = String(h).padStart(2,'0');
    qs('#m').textContent = String(m).padStart(2,'0');
    qs('#s').textContent = String(s).padStart(2,'0');
  }
  tick(); setInterval(tick,1000);
}

// Başlat
loadConfig().then(initUI);
