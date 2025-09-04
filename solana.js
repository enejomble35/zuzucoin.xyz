<!-- solana.js -->
<script>
(() => {
  // ===== Shortcuts =====
  const { Connection, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL, clusterApiUrl } = solanaWeb3;
  const spl = window.splToken;

  // ===== Config =====
  const RPC = clusterApiUrl('mainnet-beta'); // İstersen custom RPC'ye geçeriz
  const USDT_MINT = new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'); // USDT (SPL)
  const TREASURY  = new PublicKey((window.CONFIG?.treasurySolana) || '31Cjkx2PA5oMapNxxGAiZhuHDcvAyQ7hogqB8Hx6f1pW');

  const conn = new Connection(RPC, 'confirmed');

  // ===== UI =====
  const btnDisconnect = document.getElementById('btnDisconnect');
  const btnBuySOL = document.getElementById('btnBuySOL');
  const btnBuyUSDT = document.getElementById('btnBuyUSDT');
  const walletAddrEl = document.getElementById('walletAddr');
  const statusEl = document.getElementById('solanaStatus');
  const solAmountEl = document.getElementById('solAmount');
  const usdtAmountEl = document.getElementById('usdtAmount');

  // ===== State =====
  let adapter = null; // aktif wallet objesi
  let pubkey  = null; // kullanıcının public key'i (PublicKey)

  // ===== Helpers =====
  const setStatus = (msg) => { if(statusEl) statusEl.textContent = `Durum: ${msg}`; };
  const short = (s) => s.slice(0,4)+'...'+s.slice(-4);
  const setConnectedUI = (connected) => {
    if (btnDisconnect) btnDisconnect.disabled = !connected;
    if (btnBuySOL) btnBuySOL.disabled = !connected;
    if (btnBuyUSDT) btnBuyUSDT.disabled = !connected;
    if (walletAddrEl) walletAddrEl.textContent = connected && pubkey ? short(pubkey.toBase58()) : 'Not connected';
    if (connected && typeof window.__zuzuSetConnectLabel === 'function') {
      window.__zuzuSetConnectLabel(short(pubkey.toBase58()));
    }
  };

  const detectWallet = () => {
    // Phantom & Backpack çoğu zaman window.solana üzerinden gelir
    if (window.solana?.isPhantom || window.solana?.isBackpack) return window.solana;
    if (window.solflare?.isSolflare) return window.solflare;
    if (window.backpack?.solana) return window.backpack.solana;
    return null;
  };

  async function connect() {
    try{
      setStatus('Cüzdan aranıyor...');
      adapter = detectWallet();
      if(!adapter){
        setStatus('Cüzdan bulunamadı. Phantom / Solflare / Backpack yükleyin.');
        window.open('https://phantom.app/download', '_blank');
        return;
      }
      const res = await adapter.connect();
      pubkey = new PublicKey(res?.publicKey || adapter.publicKey);
      setConnectedUI(true);
      setStatus('Bağlandı');
    }catch(e){
      console.error(e);
      setStatus('Bağlantı iptal edildi');
    }
  }

  async function disconnect() {
    try { if(adapter?.disconnect) await adapter.disconnect(); } catch(_){}
    pubkey = null;
    setConnectedUI(false);
    setStatus('Bağlantı kesildi');
    if (typeof window.__zuzuSetConnectLabel === 'function') {
      window.__zuzuSetConnectLabel('Connect Wallet');
    }
  }

  // ===== Transfers =====
  async function sendSOL() {
    if(!pubkey) return setStatus('Önce cüzdan bağla');
    const amt = parseFloat(solAmountEl?.value || '0');
    if(!amt || amt <= 0) return setStatus('Geçerli SOL miktarı gir');

    try{
      setStatus('SOL işlemi hazırlanıyor...');
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: pubkey,
          toPubkey: TREASURY,
          lamports: BigInt(Math.floor(amt * LAMPORTS_PER_SOL))
        })
      );
      tx.feePayer = pubkey;
      tx.recentBlockhash = (await conn.getLatestBlockhash()).blockhash;

      const signed = await adapter.signTransaction(tx);
      const sig = await conn.sendRawTransaction(signed.serialize(), { skipPreflight:false, preflightCommitment:'confirmed' });
      await conn.confirmTransaction(sig, 'confirmed');
      setStatus(`Başarılı ✔ Tx: ${sig}`);
    }catch(e){
      console.error(e);
      setStatus('SOL transferi başarısız veya reddedildi');
    }
  }

  async function sendUSDT() {
    if(!pubkey) return setStatus('Önce cüzdan bağla');
    const amt = parseFloat(usdtAmountEl?.value || '0');
    if(!amt || amt <= 0) return setStatus('Geçerli USDT miktarı gir');

    try{
      setStatus('USDT işlemi hazırlanıyor...');
      const payer = pubkey;

      // Kullanıcının & alıcının ATA'ları
      const fromATA = await spl.getAssociatedTokenAddress(
        USDT_MINT, payer, false, spl.TOKEN_PROGRAM_ID, spl.ASSOCIATED_TOKEN_PROGRAM_ID
      );
      const toATA = await spl.getAssociatedTokenAddress(
        USDT_MINT, TREASURY, false, spl.TOKEN_PROGRAM_ID, spl.ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const ixs = [];
      // Alıcı ATA yoksa oluştur
      const toInfo = await conn.getAccountInfo(toATA);
      if(!toInfo){
        ixs.push(
          spl.createAssociatedTokenAccountInstruction(
            payer, toATA, TREASURY, USDT_MINT, spl.TOKEN_PROGRAM_ID, spl.ASSOCIATED_TOKEN_PROGRAM_ID
          )
        );
      }

      // USDT 6 decimals
      const amount = BigInt(Math.floor(amt * 1_000_000));
      ixs.push(
        spl.createTransferInstruction(
          fromATA, toATA, payer, amount, [], spl.TOKEN_PROGRAM_ID
        )
      );

      const tx = new Transaction().add(...ixs);
      tx.feePayer = payer;
      tx.recentBlockhash = (await conn.getLatestBlockhash()).blockhash;

      const signed = await adapter.signTransaction(tx);
      const sig = await conn.sendRawTransaction(signed.serialize(), { skipPreflight:false, preflightCommitment:'confirmed' });
      await conn.confirmTransaction(sig, 'confirmed');
      setStatus(`USDT gönderildi ✔ Tx: ${sig}`);
    }catch(e){
      console.error(e);
      setStatus('USDT transferi başarısız (cüzdanında USDT var mı?)');
    }
  }

  // ===== Wire UI =====
  if (btnDisconnect) btnDisconnect.onclick = disconnect;
  if (btnBuySOL) btnBuySOL.onclick = sendSOL;
  if (btnBuyUSDT) btnBuyUSDT.onclick = sendUSDT;

  // Global connect tetikleyici: script.js bunu çağırıyor
  window.__zuzuSolanaConnect = connect;

  // Sayfa yenilenmişse ve wallet kendi kendine bağlıysa
  document.addEventListener('DOMContentLoaded', async () => {
    try{
      adapter = detectWallet();
      // Bazı cüzdanlarda autoConnect flag'i vardır
      if(adapter?.isConnected || adapter?.connected){
        await connect();
      } else {
        setConnectedUI(false);
        setStatus('Hazır');
      }
      // Phantom olayları (isteğe bağlı)
      if (window.solana && !window.solana._zuzuBound) {
        try {
          window.solana.on?.('accountChanged', (pk) => {
            if(pk){
              pubkey = new PublicKey(pk);
              setConnectedUI(true);
              setStatus('Hesap değişti');
            } else {
              disconnect();
            }
          });
        } catch(_){}
        window.solana._zuzuBound = true;
      }
    }catch(_){}
  });
})();
</script>
