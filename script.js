let CONFIG = null;
let provider, signer, userAddress = null;

const el = s => document.querySelector(s);
const els = s => document.querySelectorAll(s);

async function loadConfig() {
  CONFIG = await fetch('./config.json').then(r=>r.json());
  // Brand & socials
  el('#brand').textContent = CONFIG.PROJECT.name;
  el('#brandText').textContent = CONFIG.PROJECT.name;
  el('#tw').href = CONFIG.SOCIALS.twitter;
  el('#tg').href = CONFIG.SOCIALS.telegram;
  el('#dc').href = CONFIG.SOCIALS.discord;

  // Exchanges
  const ex = el('#exList');
  CONFIG.UI.exchanges.forEach(x=>{
    const b=document.createElement('span');
    b.className='exch'; b.textContent=x; ex.appendChild(b);
  });

  // Tokenomics
  const tb = el('#tokBars');
  CONFIG.UI.tokenomics.forEach(t=>{
    const row = document.createElement('div');
    row.className='bar';
    row.innerHTML = `<div style="width:110px">${t.label}</div>
    <div class="line"><div class="fill" style="width:${t.value}%"></div></div>
    <div style="width:48px;text-align:right">${t.value}%</div>`;
    tb.appendChild(row);
  });

  // Stage select
  const st = el('#stage');
  CONFIG.PRESALE.stages.forEach((s,i)=>{
    const o = document.createElement('option');
    o.value = i; o.textContent = `${s.name} — ${s.priceUsdt.toFixed(6)} USDT / ZUZU`;
    st.appendChild(o);
  });

  // Receiver & alt addrs
  el('#receiver').textContent = CONFIG.PRESALE.receiverBSC;
  el('#solA').textContent = CONFIG.ADDRESSES.SOL;
  el('#tonA').textContent = CONFIG.ADDRESSES.TON;

  // Unit price
  updatePrice();
  el('#amount').addEventListener('input', updateTotal);
  el('#stage').addEventListener('change', updatePrice);

  // Countdown
  startCountdown(new Date(CONFIG.PRESALE.endDate).getTime());

  // Copy
  el('#copyRecv').onclick = () => {
    navigator.clipboard.writeText(CONFIG.PRESALE.receiverBSC);
  };

  // i18n init
  initI18n();
}

function currentStage() {
  const idx = parseInt(el('#stage').value || 0);
  return CONFIG.PRESALE.stages[idx];
}
function updatePrice() {
  el('#unitPrice').textContent = currentStage().priceUsdt.toFixed(6);
  updateTotal();
}
function updateTotal() {
  const amt = Number(el('#amount').value || 0);
  const total = amt * currentStage().priceUsdt;
  el('#total').textContent = total.toFixed(6);
}

function startCountdown(end) {
  function tick(){
    const now = Date.now();
    let t = Math.max(0, Math.floor((end - now)/1000));
    const d = Math.floor(t/86400); t -= d*86400;
    const h = Math.floor(t/3600);  t -= h*3600;
    const m = Math.floor(t/60);    t -= m*60;
    const s = t;
    el('#d').textContent = d; el('#h').textContent=h; el('#m').textContent=m; el('#s').textContent=s;
  }
  tick(); setInterval(tick,1000);
}

async function connect() {
  if(!window.ethereum){ alert(getText('needWallet')); return; }
  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts",[]);
  signer = provider.getSigner();
  userAddress = await signer.getAddress();

  // Switch to BSC (56)
  const chainIdHex = '0x38';
  const net = await provider.getNetwork();
  if(net.chainId !== 56){
    try{
      await window.ethereum.request({ method:'wallet_switchEthereumChain', params:[{ chainId: chainIdHex }] });
      alert(getText('switched'));
    }catch(e){
      if(e.code === 4902){
        await window.ethereum.request({
          method:'wallet_addEthereumChain',
          params:[{
            chainId: chainIdHex,
            chainName:'Binance Smart Chain',
            nativeCurrency:{ name:'BNB', symbol:'BNB', decimals:18 },
            rpcUrls:['https://bsc-dataseed.binance.org/'],
            blockExplorerUrls:['https://bscscan.com/']
          }]
        });
      }else{
        alert(getText('wrongNet')); return;
      }
    }
  }
  el('#btnConnect').textContent = userAddress.slice(0,6)+'...'+userAddress.slice(-4);
}

async function buy() {
  try{
    if(!provider){ await connect(); if(!provider) return; }
    const amountZ = Number(el('#amount').value || 0);
    if(!amountZ || amountZ < CONFIG.PRESALE.minBuy){ 
      return alert(`Min: ${CONFIG.PRESALE.minBuy} ZUZU`);
    }
    const net = await provider.getNetwork();
    if(net.chainId !== 56){ alert(getText('wrongNet')); return; }

    const price = currentStage().priceUsdt;
    const totalUSDT = ethers.utils.parseUnits((amountZ*price).toFixed(18), 18);

    const usdtAbi = [
      "function balanceOf(address) view returns (uint256)",
      "function allowance(address,address) view returns (uint256)",
      "function approve(address spender,uint256 value) returns (bool)",
      "function transfer(address to,uint256 value) returns (bool)"
    ];
    const usdt = new ethers.Contract(CONFIG.PRESALE.usdtAddress, usdtAbi, signer);

    // YOL 1: Doğrudan transfer (cüzdandan receiver'a USDT)
    const tx = await usdt.transfer(CONFIG.PRESALE.receiverBSC, totalUSDT);
    await tx.wait();
    alert(getText('buySuccess'));
  }catch(err){
    console.error(err);
    alert(err.message || 'Error');
  }
}

function initI18n() {
  const y = new Date().getFullYear();
  el('#y').textContent = y;

  const langSel = el('#lang');
  const saved = localStorage.getItem('lang') || 'tr';
  langSel.value = saved;
  applyLang(saved);

  langSel.onchange = e => {
    localStorage.setItem('lang', e.target.value);
    applyLang(e.target.value);
  };
}
function getText(key){
  const lang = localStorage.getItem('lang') || 'tr';
  const pack = CONFIG.I18N[lang] || CONFIG.I18N.en;
  return (pack[key]) ? pack[key] : (CONFIG.I18N.en[key] || key);
}
function applyLang(lang) {
  let pack = CONFIG.I18N[lang];
  if(pack && pack.inherit) pack = { ...CONFIG.I18N[pack.inherit], ...pack };
  if(!pack) pack = CONFIG.I18N.en;

  document.querySelectorAll('[data-i18n]').forEach(n=>{
    const k = n.getAttribute('data-i18n');
    if(pack[k]) n.textContent = pack[k];
  });
}

document.addEventListener('DOMContentLoaded', async ()=>{
  await loadConfig();
  el('#btnConnect').addEventListener('click', connect);
  el('#btnBuy').addEventListener('click', buy);
});
