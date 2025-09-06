/* solana.v1.js — basit durum yayıncısı (mevcut bağlantı koduna ek) */
(function(){
  const listeners = [];
  function emit(payload){ listeners.forEach(fn=>{ try{fn(payload);}catch(e){} }); }

  // Dışarı aç
  window.ZUZU_SOL = {
    onStatus(fn){ if (typeof fn==="function") listeners.push(fn); },
    update(addr){
      const short = addr ? addr.slice(0,4)+"…"+addr.slice(-4) : "";
      emit({connected:!!addr, address:addr||null, short});
    }
  };

  // ÖRNEK: Mevcut bağlanınca burayı çağır:
  // window.ZUZU_SOL.update(publicKey.toBase58());
  // Kopunca:
  // window.ZUZU_SOL.update(null);
})();
