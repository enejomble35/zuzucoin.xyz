// CONFIG
const CONFIG = {
  countdownTarget: '2025-09-01T21:00:00+03:00',
  presaleDemo: true,
  evm: {
    chainIdHex: '0x61',
    rpc: 'https://bsc-testnet.publicnode.com',
    contract: '',
    abi: [{ "inputs":[{"internalType":"uint8","name":"tier","type":"uint8"}], "name":"buy", "outputs":[], "stateMutability":"payable", "type":"function" }]
  }
};

window.addEventListener('load', ()=>{ const p=document.getElementById('preloader'); if(p) p.style.display='none'; });

// Wallet menu + modal
const btnWallet=document.getElementById('btnWallet');
const walletMenu=document.getElementById('walletMenu');
const modal=document.getElementById('modal');
const modalTitle=document.getElementById('modalTitle');
const modalText=document.getElementById('modalText');
document.getElementById('modalClose')?.addEventListener('click',()=>modal.style.display='none');
btnWallet?.addEventListener('click',()=>walletMenu.style.display = walletMenu.style.display==='block'?'none':'block');
document.addEventListener('click',(e)=>{ if(!walletMenu.contains(e.target)&&!btnWallet.contains(e.target)) walletMenu.style.display='none'; });
function showModal(t,x){ modalTitle.textContent=t; modalText.innerHTML=x; modal.style.display='flex'; }

// EVM
async function connectEVM(){
  if(!window.ethereum){ showModal('MetaMask','MetaMask yüklü değil.'); return; }
  try{
    const want=CONFIG.evm.chainIdHex;
    const curr=await window.ethereum.request({method:'eth_chainId'});
    if(curr!==want){
      try{ await window.ethereum.request({method:'wallet_switchEthereumChain',params:[{chainId:want}]}); }
      catch{ await window.ethereum.request({method:'wallet_addEthereumChain',params:[{chainId:want,rpcUrls:[CONFIG.evm.rpc],chainName:'ZUZU Chain',nativeCurrency:{name:'Test',symbol:'TST',decimals:18}}]}); }
    }
    const accs=await window.ethereum.request({method:'eth_requestAccounts'});
    const provider=new ethers.providers.Web3Provider(window.ethereum);
    const signer=provider.getSigner();
    window.zuzu={provider,signer,address:accs[0]};
    showModal('MetaMask',`Bağlandı: <code>${accs[0]}</code>`);
  }catch(e){ console.error(e); showModal('MetaMask','Bağlantı hatası'); }
}

// Solana
async function connectSolana(){
  const ph=window.solana;
  if(!ph||!ph.isPhantom){ showModal('Solana','Phantom bulunamadı.'); return; }
  try{
    const r=await ph.connect(); window.zuzuSol={provider:ph,address:r.publicKey.toString()};
    showModal('Solana',`Bağlandı: <code>${r.publicKey.toString()}</code>`);
  }catch(e){ console.error(e); showModal('Solana','Bağlantı hatası'); }
}

// TON
let tonUI;
async function connectTON(){
  try{
    if(!tonUI){
      tonUI=new TonConnectUI.TonConnectUI({ manifestUrl:'https://zuzucoin.xyz/tonconnect-manifest.json' });
    }
    const conn=await tonUI.connectWallet();
    const address=conn?.account?.address || '(adres)';
    window.zuzuTon={address,conn};
    showModal('TON',`Bağlandı: <code>${address}</code>`);
  }catch(e){ console.error(e); showModal('TON','Bağlantı hatası'); }
}

// Wallet menu events
walletMenu?.addEventListener('click',(e)=>{
  if(!e.target.matches('button')) return;
  walletMenu.style.display='none';
  const t=e.target.getAttribute('data-wallet');
  if(t==='evm') connectEVM();
  if(t==='solana') connectSolana();
  if(t==='ton') connectTON();
});

// Countdown
const targetDate=new Date(CONFIG.countdownTarget);
function pad(n){ return n.toString().padStart(2,'0'); }
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

// Presale (demo)
function buyTier(tier, price){ 
  if(CONFIG.presaleDemo){ showModal('Ön Satış (DEMO)',`Tier ${tier}, Fiyat ${price}`); return; }
  // Gerçek kontrat için burada tx göndeririz (adres/ABI verince ekliyorum)
}
document.querySelectorAll('.buy').forEach(b=>b.addEventListener('click',()=>{
  const t=parseInt(b.closest('.tier').dataset.tier,10);
  const p=b.closest('.tier').querySelector('.price').textContent;
  buyTier(t,p);
}));

// Gallery
const maskNames=["Titan","Hacker","Maiden","Scientist","Berserker","Sorceress","Rogue","Warrior","Ranger","Hero"];
(function(){
  const g=document.getElementById('maskGrid'); if(!g) return;
  for(let i=0;i<10;i++){
    const box=document.createElement('div'); box.className='mask-item';
    box.innerHTML=`<figure class="mask-card"><img src="assets/images/masks/${i}.png" alt="${maskNames[i]}"><figcaption>${maskNames[i]}</figcaption></figure>`;
    g.appendChild(box);
  }
})();
