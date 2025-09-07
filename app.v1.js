/* =========================
   APP INIT
========================= */
window.addEventListener("DOMContentLoaded", ()=>{
  console.log("ZUZUCOIN dApp initialized ✅");

  // Dil seçenekleri
  applyLang("en");
  document.querySelectorAll(".lang-flag").forEach(el=>{
    el.addEventListener("click", ()=>{
      const lang = el.dataset.lang;
      applyLang(lang);
    });
  });

  // NFT grid render tekrar
  if(document.getElementById("nftGrid")) renderNFTs();

  // Sayaç çalıştır
  setInterval(tick, 1000);
});
