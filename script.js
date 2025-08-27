/*************************
 *  Z U Z U   P R E S A L E
 *************************/
const RECEIVERS = {
  evm: "0x69014a76Ee25c8B73dAe9044dfcAd7356fe74bC3",
  tron: "TP...REPLACED", // Tron base58 değilse otomatik alırız, aşağıda tronReceiverFromEvm()
  ton: "UQD5Pkyp_l_O3907ri0WeLAY7fBVa-twb9nUnQ38Q1MinTND",
  sol: "31Cjkx2PA5oMapNxxGAiZhuHDcvAyQ7hogqB8Hx6f1pW"
};
// Not: TRON için EVM adresinin TRON karşılığı farklıdır. Direkt TRON adresi kullanacağız.
// Eğer TRON için farklı bir adres istiyorsan buraya TRON (T...) adresini yaz:
RECEIVERS.tron = "TS7S3V1..."; // yoksa TronLink ekranında seçtiririz. İstemezsen bu satırı sil.

/* EVM ağ bilgileri */
const EVM_NETWORKS = {
  bsc: {
    chainIdHex: "0x38",
    name: "BNB Smart Chain",
    rpcUrls: ["https://bsc-dataseed.binance.org"],
    nativeSymbol: "BNB",
    usdt: "0x55d398326f99059fF775485246999027B3197955" // 18 decimals
  },
  polygon: {
    chainIdHex: "0x89",
    name: "Polygon",
    rpcUrls: ["https://polygon-rpc.com"],
    nativeSymbol: "MATIC",
    usdt: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F" // 6 decimals
  },
  arbitrum: {
    chainIdHex: "0xa4b1",
    name: "Arbitrum One",
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    nativeSymbol: "ETH",
    usdt: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9" // 6 decimals
  }
};

/* UI elemanları */
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalText  = document.getElementById('modalText');
const modalClose = document.getElementById('modalClose');

const buyModal   = document.getElementById('buyModal');
const buyChain   = document.getElementById('buyChain');
const buyToken   = document.getElementById('buyToken');
const buyAmount  = document.getElementById('buyAmount');
const buyInfo    = document.getElementById('buyInfo');
const buyConfirm = document.getElementById('buyConfirm');
const buyCancel  = document.getElementById('buyCancel');

const btnWallet  = document.getElementById('btnWallet');
const walletMenu = document.getElementById('walletMenu');

function showModal(t, html){ modalTitle.textContent=t; modalText.innerHTML=html; modal.style.display='flex'; }
modalClose?.addEventListener('click', ()=> modal.style.display='none');
document.addEventListener('click',(e)=>{ if(modal.style.display==='flex' && e.target===modal) modal.style.display='none'; });

/* Cüzdan menüsü */
btnWallet?.addEventListener('click', ()=> walletMenu.style.display = walletMenu.style.display==='block' ? 'none' : 'block');
document.addEventListener('click',(e)=>{ if(!walletMenu.contains(e.target) && !btnWallet.contains(e.target)) walletMenu.style.display='none'; });

walletMenu?.addEventListener('click',(e)=>{
  if(!e.target.matches('button')) return;
  walletMenu.style.display='none';
  const t=e.target.getAttribute('data-wallet');
  if(t==='evm') connectEVM('bsc');        // default BSC
  if(t==='solana') connectSolana();
  if(t==='ton') connectTON();
});

/* --------- COUNTDOWN / GALLERY (aynı kalsın) --------- */
const CONFIG = { countdownTarget: '2025-09-01T21:00:00+03:00' };
const targetDate=new Date(CONFIG.countdownTarget);
function pad(n){return n.toString().padStart(2,'0');}
function tick(){
  const now=new Date(); let diff=Math.max(0,targetDate-now);
  const d=Math.floor(diff/86400000); diff-=d*86400000;
  const h=Math.floor(diff/3600000);  diff-=h*3600000;
  const m=Math.floor(diff/60000);    diff-=m*60000;
  const s=Math.floor(diff/1000);
  document.getElementById('cdDays').textContent=pad(d);
  document.getElementById('cdHours').textContent=pad(h);
  document.getElementById('cdMinutes').textContent=pad(m);
  document.getElementById('cdSeconds').textContent=pad(s);
}
setInterval(tick,1000); tick();

const maskNames=["Titan","Hacker","Maiden","Scientist","Berserker","Sorceress","Rogue","Warrior","Ranger","Hero"];
(function(){
  const g=document.getElementById('maskGrid'); if(!g) return;
  for(let i=0;i<10;i++){
    const box=document.createElement('div'); box.className='mask-item';
    box.innerHTML=`<figure class="mask-card"><img src="assets/images/masks/${i}.png" alt="${maskNames[i]}"><figcaption>${maskNames[i]}</figcaption></figure>`;
    g.appendChild(box);
  }
})();

/* --------- BUY FLOW: Buton -> modal --------- */
document.querySelectorAll('.buy').forEach(btn=>{
  btn.addEventListener('click',()=>{
    // Karttaki USDT fiyatını inputa geç
    const priceText = btn.closest('.tier').querySelector('.price').textContent; // "0.0008 USDT"
    const amt = Number((priceText||'0').replace(/[^\d.]/g,''));
    buyAmount.value = amt || 0.0008;
    buyInfo.textContent = '';
    buyModal.style.display='flex';
  })
});

buyCancel?.addEventListener('click',()=> buyModal.style.display='none');

/* --------- BUY CONFIRM --------- */
buyConfirm?.addEventListener('click', async ()=>{
  const chain = buyChain.value;     // bsc | polygon | arbitrum | tron | solana | ton
  const token = buyToken.value;     // usdt | native
  const amount = Number(buyAmount.value||0);
  if(!amount || amount<=0){ buyInfo.textContent='Geçerli bir miktar gir.'; return; }

  try{
    if(chain==='bsc' || chain==='polygon' || chain==='arbitrum'){
      await evmPay(chain, token, amount);
    }else if(chain==='tron'){
      await tronPay(token, amount);
    }else if(chain==='solana'){
      await solPay(amount);
    }else if(chain==='ton'){
      await tonPay(amount);
    }
    buyInfo.textContent='İşlem gönderildi, cüzdanında onayla.';
  }catch(err){
    console.error(err);
    buyInfo.textContent='Hata: '+(err?.message||err);
  }
});

/* ===================== EVM (MetaMask) ===================== */
async function connectEVM(pref='bsc'){
  if(!window.ethereum){ showModal('MetaMask','MetaMask bulunamadı.'); return; }
  const net = EVM_NETWORKS[pref];
  try{
    const current = await window.ethereum.request({method:'eth_chainId'});
    if(current!==net.chainIdHex){
      try{
        await window.ethereum.request({method:'wallet_switchEthereumChain', params:[{chainId:net.chainIdHex}]});
      }catch(switchErr){
        await window.ethereum.request({method:'wallet_addEthereumChain', params:[{
          chainId: net.chainIdHex, chainName: net.name, rpcUrls: net.rpcUrls, nativeCurrency: {name: net.nativeSymbol, symbol: net.nativeSymbol, decimals: 18}
        }]});
      }
    }
    const accs = await window.ethereum.request({method:'eth_requestAccounts'});
    showModal('MetaMask',`Bağlandı: <code>${accs[0]}</code> (${net.name})`);
  }catch(e){ console.error(e); showModal('MetaMask','Bağlantı hatası.'); }
}

const ERC20_ABI = [
  {"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"type":"function"},
  {"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"type":"function"}
];

async function evmPay(chainKey, payToken, amountUSDT){
  if(!window.ethereum) throw new Error('MetaMask yok.');
  const net = EVM_NETWORKS[chainKey];

  // Gerekli ağa geç
  await connectEVM(chainKey);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer   = provider.getSigner();
  const from     = await signer.getAddress();

  if(payToken==='native'){
    // Native coin gönder (BNB/MATIC/ETH)
    const valueWei = ethers.utils.parseEther(String(amountUSDT)); // USDT değerini native eşitleyerek (kampanya mantığına göre)
    const tx = await signer.sendTransaction({to: RECEIVERS.evm, value: valueWei});
    showModal(net.name+' • Native', `Gönderildi: <a target="_blank" href="#">Tx</a> <code>${tx.hash}</code>`);
    return;
  }

  // USDT transfer
  const usdt = new ethers.Contract(net.usdt, ERC20_ABI, signer);
  const decimals = await usdt.decimals(); // 6 veya 18
  const units = ethers.utils.parseUnits(String(amountUSDT), decimals);
  const tx = await usdt.transfer(RECEIVERS.evm, units);
  showModal(net.name+' • USDT', `Gönderildi: <code>${tx.hash}</code>`);
}

/* ===================== TRON (TronLink) ===================== */
async function tronPay(payToken, amountUSDT){
  if(!window.tronWeb || !window.tronWeb.ready) throw new Error('TronLink bulunamadı.');
  const tronWeb = window.tronWeb;
  const from = tronWeb.defaultAddress.base58;

  const to = RECEIVERS.tron && RECEIVERS.tron.startsWith('T') ? RECEIVERS.tron : tronWeb.address.fromHex(RECEIVERS.evm.replace(/^0x/,''));
  if(payToken==='native'){
    const sun = tronWeb.toSun(amountUSDT); // 1 TRX ≈ 1 USDT değil, ama isteğe göre native gönderim.
    const tx = await tronWeb.trx.sendTransaction(to, sun);
    showModal('TRON • TRX', `Gönderildi: <code>${tx.txid||''}</code>`);
    return;
  }
  // USDT TRC20
  const USDT_TRON = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
  const contract = await tronWeb.contract().at(USDT_TRON);
  const amount = Math.round(amountUSDT * 1e6); // 6 decimals
  const tx = await contract.transfer(to, amount).send();
  showModal('TRON • USDT', `Gönderildi: <code>${tx}</code>`);
}

/* ===================== SOLANA (Phantom) ===================== */
async function connectSolana(){
  const ph = window.solana;
  if(!ph || !ph.isPhantom){ showModal('Solana','Phantom bulunamadı.'); return; }
  const r = await ph.connect();
  showModal('Solana',`Bağlandı: <code>${r.publicKey.toString()}</code>`);
}

async function solPay(amountUSDT){
  const ph = window.solana;
  if(!ph || !ph.isPhantom) throw new Error('Phantom yok.');
  await ph.connect();
  const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');
  const from = ph.publicKey;
  const to = new solanaWeb3.PublicKey(RECEIVERS.sol);
  // Native SOL gönderimi (USDT değil). İstersen SPL-USDT adresini ekleyip token transferi de kurarız.
  const lamports = Math.floor(amountUSDT * 1e9 * 0.01); // örnek: 1% oranında SOL karşılığı; presale kuralına göre ayarlayabiliriz.
  const tx = new solanaWeb3.Transaction().add(
    solanaWeb3.SystemProgram.transfer({fromPubkey: from, toPubkey: to, lamports})
  );
  const sig = await ph.signAndSendTransaction(tx);
  showModal('Solana • SOL', `Gönderildi: <code>${sig.signature}</code>`);
}

/* ===================== TON (TonConnect) ===================== */
let tonUI;
async function connectTON(){
  if(!tonUI){
    tonUI = new TonConnectUI.TonConnectUI({ manifestUrl: 'https://zuzucoin.xyz/tonconnect-manifest.json' });
  }
  const conn = await tonUI.connectWallet();
  showModal('TON', `Bağlandı: <code>${conn?.account?.address || ''}</code>`);
}

async function tonPay(amountUSDT){
  if(!tonUI){
    tonUI = new TonConnectUI.TonConnectUI({ manifestUrl: 'https://zuzucoin.xyz/tonconnect-manifest.json' });
  }
  const toAddr = RECEIVERS.ton; // TON adresin
  // 1 TON ≠ 1 USDT. Presale kurallarına göre çevrim yapmadık; raw TON gönderimi.
  const nano = String(Math.floor(amountUSDT * 1e9 * 0.01)); // örnek: 1% TON karşılığı
  const tx = {
    validUntil: Math.floor(Date.now()/1000) + 300,
    messages: [{address: toAddr, amount: nano}]
  };
  const r = await tonUI.sendTransaction(tx);
  showModal('TON • TON', `Gönderildi: <code>${JSON.stringify(r)}</code>`);
}
