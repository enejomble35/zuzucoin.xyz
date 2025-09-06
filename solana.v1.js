/* Basit satın alma akışı: SOL veya USDT(SPL) gönderir */
window.ZUZU_SOL = (function(){

  const web3 = window.solanaWeb3;
  const owner = new web3.PublicKey(ZUZU_CONFIG.ownerSol);
  let provider = null;     // wallet provider
  let pubkey   = null;     // bağlanan adres

  // dışarıdan UI güncelle
  function update(pkStr){
    pubkey = pkStr ? new web3.PublicKey(pkStr) : null;
    provider = window.phantom?.solana || window.solana || window.backpack?.solana || window.solflare || null;
  }

  async function ensure(){
    if(!provider) throw new Error("Cüzdan yok");
    if(!pubkey){
      // bağlanmamışsa bağlat
      const r = await provider.connect(); // Phantom/Solflare/Backpack prompt
      pubkey = r.publicKey || new web3.PublicKey(r); 
    }
    return true;
  }

  // SOL transferi
  async function paySOL(solAmount){
    await ensure();
    const connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"), "confirmed");
    const tx = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: pubkey,
        toPubkey: owner,
        lamports: Math.round(solAmount * web3.LAMPORTS_PER_SOL),
      })
    );
    tx.feePayer = pubkey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    const signed = await provider.signTransaction(tx);
    const sig = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(sig, "confirmed");
    alert("Ödeme tamam: "+sig);
    return sig;
  }

  // USDT (SPL) transferi — mainnet USDT mint:
  const USDT_MINT = new web3.PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoBkfCiq1i3Lw6j4vQh"); // (SPL USDT)
  async function paySPL_USDT(usdtAmount){
    await ensure();
    const connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"), "confirmed");
    const token = new window.splToken.Token(connection, USDT_MINT, window.splToken.TOKEN_PROGRAM_ID, pubkey);
    const fromAta = await token.getOrCreateAssociatedAccountInfo(pubkey);
    const toAta   = await token.getOrCreateAssociatedAccountInfo(owner);
    const tx = new web3.Transaction().add(
      window.splToken.Token.createTransferInstruction(
        window.splToken.TOKEN_PROGRAM_ID,
        fromAta.address,
        toAta.address,
        pubkey,
        [],
        Math.round(usdtAmount * 1e6) // USDT 6 decimals
      )
    );
    tx.feePayer = pubkey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    const signed = await provider.signTransaction(tx);
    const sig = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(sig, "confirmed");
    alert("USDT gönderildi: "+sig);
    return sig;
  }

  // Basit “Satın Al” — miktar(ZUZU) ve payment tipine göre bedel hesabı (örnek)
  function pricePerZUZU(week){
    if(week===1) return 0.0050;
    if(week===2) return 0.0065;
    if(week===3) return 0.0080;
    return 0.0100;
  }

  async function buyTokens(amountZUZU, payType){
    if(!amountZUZU || amountZUZU<=0) return alert("Miktar girin.");
    // hangi karttan geldiyse haftayı yakalamak için fiyatları fixed tutuyoruz:
    const week = 1; // basit: istersen buton data-week ile değiştir
    const usdtCost = amountZUZU * pricePerZUZU(week);

    if(payType==="SOL"){
      // market oranını sabit alalım (örnek: 1 SOL = 170 USDT). İstersen güncelleyebilirsin.
      const SOL_USDT = 170;
      const needSOL = usdtCost / SOL_USDT;
      return paySOL(needSOL);
    }else{
      return paySPL_USDT(usdtCost);
    }
  }

  return {update, buyTokens};
})();
