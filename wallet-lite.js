<script>
(function(){
  const modal = document.getElementById('walletModal');
  const btn   = document.getElementById('connectBtn');
  const close = document.getElementById('wmClose');

  // --- Protect: modal kendiliğinden açılmasın
  function openModal(){
    if (!modal) return;
    modal.hidden = false;
    document.documentElement.style.overflow = 'hidden';
  }
  function closeModal(){
    if (!modal) return;
    modal.hidden = true;
    document.documentElement.style.overflow = '';
  }

  // Aç/kapat bağla
  btn && btn.addEventListener('click', openModal);
  close && close.addEventListener('click', closeModal);
  // Arka plana tıklayınca kapat
  modal && modal.addEventListener('click', (e)=>{
    if (e.target === modal) closeModal();
  });
  // ESC ile kapat
  window.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && !modal.hidden) closeModal();
  });

  // --- Deep link yardımcıları
  const SITE = encodeURIComponent(location.origin + location.pathname); // zuzucoin.xyz/…
  function openUrl(u){
    // iOS/Safari açılışını desteklemek için anchor yöntemi
    const a = document.createElement('a');
    a.href = u; a.rel = 'noopener'; a.target = '_self';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // Her buton için yönlendirme
  modal?.querySelectorAll('.wm-item').forEach(item=>{
    item.addEventListener('click', ()=>{
      const w = item.getAttribute('data-wallet');

      // Varsayılan: cüzdanın yerleşik tarayıcısında siteyi aç
      let url = null;

      if (w === 'phantom'){
        // Phantom deep link: https://phantom.app/ul/browse/<ENCODED_URL>
        url = `https://phantom.app/ul/browse/${SITE}`;
        // Bazı Android sürümlerinde custom scheme daha iyi çalışır:
        setTimeout(()=>{ openUrl(`phantom://browse/${SITE}`); }, 200);
      }
      else if (w === 'solflare'){
        // Solflare deep link: https://solflare.com/ul/v1/browse/<ENCODED_URL>
        url = `https://solflare.com/ul/v1/browse/${SITE}`;
      }
      else if (w === 'backpack'){
        // Backpack (Treasure/Backpack) varyasyonları
        url = `https://www.backpack.app/ul/browse/${SITE}`;
        setTimeout(()=>{ openUrl(`backpack://browse/${SITE}`); }, 200);
      }

      if (url) openUrl(url);

      // Masaüstünde cüzdan eklentisi yoksa bilgi ver
      if (!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)){
        // Masaüstünde: cüzdan eklentisini açamıyorsak yönlendirme yerine bilgi verelim
        alert('On mobile, this will open inside the wallet browser. On desktop, please open this site from your wallet (Phantom / Solflare / Backpack).');
      }

      // Modalı kapat
      closeModal();
    });
  });

  // Güvenlik: Başlangıçta modalı **kapat**
  if (modal) modal.hidden = true;
})();
</script>
