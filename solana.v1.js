// Basit SOL/USDT(SPL) demo işlemleri. Gerçek kontrat entegrasyonunda değiştirin.
window.ZUZU_SOL = (function(){
  let currentPK = null;
  function update(pk){ currentPK = pk; }

  async function buyTokens(qty, pay){
    if(!currentPK) return alert("Lütfen önce cüzdan bağlayın.");
    if(!qty || qty<=0) return alert("Miktar girin.");
    // Burada gerçek transfer/contract call yapılacak.
    // Demo:
    alert(`Sipariş alındı: ${qty} ZUZU • Ödeme: ${pay}\nCüzdan: ${currentPK}\nAlıcı: ${ZUZU_CONFIG.ownerSol}`);
  }

  return {update, buyTokens};
})();
