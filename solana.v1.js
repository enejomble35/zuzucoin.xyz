window.ZUZU_SOL = (function(){
  let currentPK = null;
  function update(pk){ currentPK = pk; }

  async function buyTokens(qty, pay){
    if(!currentPK) return alert("Lütfen önce cüzdan bağlayın.");
    if(!qty || qty<=0) return alert("Miktar girin.");
    alert(`Sipariş alındı:\n${qty} ZUZU • Ödeme: ${pay}\nCüzdan: ${currentPK}\nAlıcı: ${ZUZU_CONFIG.ownerSol}`);
  }
  return {update, buyTokens};
})();
