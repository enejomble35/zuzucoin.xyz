/* App bootstrap – bağlanınca butonda adres göster */
(function(){
  function short(s){ return s ? s.slice(0,4)+"..."+s.slice(-4) : "Connect Wallet"; }
  window.addEventListener("load", ()=>{
    // Phantom dönüş/restore modülleri zaten kendi içinde çalışıyor
    const addr = localStorage.getItem("ph_addr_b58");
    const btn = document.getElementById("connectBtn");
    if (btn && addr){ btn.textContent = short(addr); btn.classList.add("connected"); btn.dataset.address = addr; }
  });
})();
