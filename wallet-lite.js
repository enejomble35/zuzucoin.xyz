// ===== Wallet chooser modal + deep-link helpers =====
(function(){
  const M = document.getElementById('walletModal');
  const open = ()=>M.classList.remove('hidden');
  const close = ()=>M.classList.add('hidden');

  function deepLinkFor(wallet){
    const redirect = encodeURIComponent(location.href);
    const ref = encodeURIComponent("zuzucoin.xyz");
    switch(wallet){
      case 'phantom':
        // universal link (hem iOS hem Android destekler)
        return `https://phantom.app/ul/browse/${redirect}?ref=${ref}`;
      case 'solflare':
        return `https://solflare.com/ul/v1/browse?url=${redirect}&ref=${ref}`;
      case 'backpack':
        return `https://www.backpack.app/ul/browse/${redirect}`;
      default: return null;
    }
  }

  // dışarı aç
  window.ZUZU_WALLET = {
    openChooser: open,
    closeChooser: close,
    openDeep(wallet){
      const url = deepLinkFor(wallet);
      if (url) location.href = url;
    }
  };

  // butonlar
  M.querySelectorAll('.wbtn[data-wallet]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const w = btn.dataset.wallet;
      // Eğer provider varsa direkt connect, yoksa deep link
      if (window.ZUZU_SOL && window.ZUZU_SOL.hasProvider(w)) {
        window.ZUZU_SOL.connect(w);
        close();
      } else {
        localStorage.setItem('zuzu_wallet_try', w);
        window.ZUZU_WALLET.openDeep(w);
      }
    });
  });
  document.getElementById('modalClose').addEventListener('click', close);
})();
