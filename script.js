const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

let CFG, currentStage, unitPrice = 0, qty = 100000, raised = 0;

// --- Load config & init
(async function init(){
  CFG = await fetch('config.json?v='+Date.now()).then(r=>r.json());
  $('#receiver').value = CFG.PRESALE.receiver;
  $('#usdtAddr').textContent = short(CFG.ADDRESSES.USDT_BEP20);
  fillStages();
  setStage(0);
  $('#qty').value = qty;
  calc();

  makeQR(CFG.PRESALE.receiver);
  startCountdown(new Date(CFG.PRESALE.endDate));
  setHardcap(CFG.PRESALE.hardcapUsd);

  // events
  $('#stage').addEventListener('change', e=>{ setStage(e.target.selectedIndex); calc(); });
  $('#qty').addEventListener('input', ()=>{ qty = +$('#qty').value||0; calc(); });
  $$('.chip').forEach(c=>c.onclick=()=>{ qty=+c.dataset.q; $('#qty').value=qty; calc(); });
  $('#copy').onclick = ()=>{ navigator.clipboard.writeText($('#receiver').value); toast('Adres kopyalandı'); };

  $('#btnConnect').onclick = connectWallet;
  $('#btnBuy').onclick = buyUSDT;
})();

function fillStages(){
  const opt = CFG.PRESALE.stages.map(s=>`<option>${s.name} — ${s.priceUsdt.toFixed(6)} USDT / ZUZU</option>`).join('');
  $('#stage').innerHTML = opt;
}
function setStage(i){ currentStage=i; unitPrice = CFG.PRESALE.stages[i].priceUsdt; $('#uPrice').textContent = unitPrice.toFixed(6); }
function calc(){
  const tot = unitPrice * (qty||0);
  $('#total').textContent = (tot).toFixed(6);
}
function setHardcap(h){ $('#raisedTxt').textContent = `$${fmt(raised)} / $${fmt(h)}`; $('#bar').style.width = Math.min(100, (raised/h*100)) + '%'; }
function startCountdown(end){
  const dEl=$('#d'),hEl=$('#h'),mEl=$('#m'),sEl=$('#s');
  const t = ()=>{ const now=new Date(); let ms=end-now; if(ms<0) ms=0;
    const d=Math.floor(ms/86400000), h=Math.floor(ms%86400000/3600000),
          m=Math.floor(ms%3600000/60000), s=Math.floor(ms%60000/1000);
    dEl.textContent=pad(d); hEl.textContent=pad(h); mEl.textContent=pad(m); sEl.textContent=pad(s);
  }; t(); setInterval(t,1000);
}
function pad(n){return (n<10?'0':'')+n}
function fmt(n){return n.toLocaleString('en-US')}
function short(a){return a.slice(0,6)+'…'+a.slice(-4)}
function toast(t){console.log(t)}

// QR (Google Chart)
function makeQR(addr){
  const data = encodeURIComponent(`ethereum:${CFG.ADDRESSES.USDT_BEP20}/transfer?address=${CFG.PRESALE.receiver}`);
  $('#qr').innerHTML = `<img alt="qr" width="120" height="120" src="https://chart.googleapis.com/chart?cht=qr&chs=160x160&chl=${data}">`;
}

// ------- Wallet / Buy --------
let provider, signer, userAddr;

async function connectWallet(){
  if(!window.ethereum){ alert('MetaMask / TrustWallet gerekli.'); return; }
  try{
    await ethereum.request({method:'eth_requestAccounts'});
    // BSC’ye geç
    try{
      await ethereum.request({ method:'wallet_switchEthereumChain', params:[{ chainId:'0x38' }]});
    }catch(e){
      if(e.code===4902){
        await ethereum.request({method:'wallet_addEthereumChain', params:[{
          chainId:'0x38', chainName:'BNB Smart Chain', nativeCurrency:{name:'BNB',symbol:'BNB',decimals:18},
          rpcUrls:['https://bsc-dataseed.binance.org'], blockExplorerUrls:['https://bscscan.com']
        }]});
      } else throw e;
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    signer   = await provider.getSigner();
    userAddr = await signer.getAddress();
    $('#btnConnect').textContent = short(userAddr);
    toast('Cüzdan bağlandı');
  }catch(err){ console.error(err); alert('Bağlantı reddedildi.'); }
}

async function buyUSDT(){
  const amount = +$('#total').textContent;
  if(!amount || amount<=0){ alert('Miktar belirt.'); return; }

  if(!signer){ await connectWallet(); if(!signer) return; }

  try{
    const USDT = new ethers.Contract(
      CFG.ADDRESSES.USDT_BEP20,
      ["function transfer(address to,uint256 value) returns (bool)","function decimals() view returns (uint8)"],
      signer
    );
    const decimals = await USDT.decimals(); // 18
    const toWei = (val,dec=decimals)=> ethers.parseUnits(String(val), dec);
    const tx = await USDT.transfer(CFG.PRESALE.receiver, toWei(amount));
    $('#btnBuy').disabled = true; $('#btnBuy').textContent = 'Gönderiliyor…';
    await tx.wait();
    $('#btnBuy').disabled = false; $('#btnBuy').textContent = 'USDT (BEP20) ile Satın Al';
    alert('Ödeme başarıyla gönderildi. Teşekkürler!');
  }catch(e){
    console.error(e); alert('İşlem iptal edildi veya başarısız oldu.');
    $('#btnBuy').disabled = false; $('#btnBuy').textContent = 'USDT (BEP20) ile Satın Al';
  }
}
