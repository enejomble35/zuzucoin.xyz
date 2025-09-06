// Wallet chooser + deep-link
(function(){
  const modal = document.getElementById('walletModal');
  const open  = ()=>modal.classList.remove('hidden');
  const close = ()=>modal.classList.add('hidden');

  function deep(wallet){
    const redirect = encodeURIComponent(location.href);
    switch(wallet){
      case 'phantom':  return `https://phantom.app/ul/browse/${redirect}?ref=zuzucoin.xyz`;
      case 'solflare': return `https://solflare.com/ul/v1/browse?url=${redirect}&ref=zuzucoin.xyz`;
      case 'backpack': return `https://www.backpack.app/ul/browse/${redirect}`;
      default: return null;
    }
  }

  window.ZUZU_WALLET = {
    openChooser: open, closeChooser: close,
    openDeep(wallet){ const url=deep(wallet); if(url) location.href=url; }
  };

  modal.querySelectorAll('.wbtn[data-wallet]').forEach(b=>{
    b.addEventListener('click', ()=>{
      const w=b.dataset.wallet;
      if (window.ZUZU_SOL && window.ZUZU_SOL.hasProvider(w)) {
        window.ZUZU_SOL.connect(w); close();
      } else {
        localStorage.setItem('zuzu_wallet_try', w);
        window.ZUZU_WALLET.openDeep(w);
      }
    });
  });
  document.getElementById('modalClose').addEventListener('click', close);

  document.getElementById('connectBtn')?.addEventListener('click', open);
  document.getElementById('btnSolConnect')?.addEventListener('click', open);
})();
