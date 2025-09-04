// === solana.js (DIŞ JS DOSYASI — script tag YOK) ===
(function(){
  // Kütüphaneler gelmeden basılırsa nazik uyarı
  window.__zuzuSolanaConnect = function(){
    alert('Loading Solana wallet… please wait a moment and try again.');
  };

  function initWhenReady(){
    const web3 = window.solanaWeb3;
    const spl  = window.splToken;
    if(!web3 || !spl){
      // henüz CDN’ler gelmemiş, birazdan tekrar dene
      return setTimeout(initWhenReady, 200);
    }

    const { Connection, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL, clusterApiUrl } = web3;

    // ===== Config =====
    const RPC = clusterApiUrl('mainnet-beta');
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
    let adapter = null;
    let pubkey  = null;

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
      if (!connected && typeof window.__zuzuSetConnectLabel === 'function') {
        window.__zuzuSetConnectLabel('Connect Wallet');
      }
    };

    const detectWallet = () => {
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
          setStatus('Cüzdan bulunamadı. Phantom / Solflare / Backpack kur.');
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
    }

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

        const fromATA = await spl.getAssociatedTokenAddress(
          USDT_MINT, payer, false, spl.TOKEN_PROGRAM_ID, spl.ASSOCIATED_TOKEN_PROGRAM_ID
        );
        const toATA = await spl.getAssociatedTokenAddress(
          USDT_MINT, TREASURY, false, spl.TOKEN_PROGRAM_ID, spl.ASSOCIATED_TOKEN_PROGRAM_ID
        );

        const ixs = [];
        const toInfo = await conn.getAccountInfo(toATA);
        if(!toInfo){
          ixs.push(
            spl.createAssociatedTokenAccountInstruction(
              payer, toATA, TREASURY, USDT_MINT, spl.TOKEN_PROGRAM_ID, spl.ASSOCIATED_TOKEN_PROGRAM_ID
            )
          );
        }

        const amount = BigInt(Math.floor(amt * 1_000_000)); // USDT 6 decimals
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
        setStatus('USDT transferi başarısız (cüzdanda USDT var mı?)');
      }
    }

    // UI bağla
    if (btnDisconnect) btnDisconnect.onclick = disconnect;
    if (btnBuySOL) btnBuySOL.onclick = sendSOL;
    if (btnBuyUSDT) btnBuyUSDT.onclick = sendUSDT;

    // Global connect tetikleyici (script.js burayı çağırıyor)
    window.__zuzuSolanaConnect = connect;

    // Auto-connect ve accountChanged
    document.addEventListener('DOMContentLoaded', async () => {
      try{
        const w = detectWallet();
        if(w?.isConnected || w?.connected){
          adapter = w;
          await connect();
        } else {
          setConnectedUI(false);
          setStatus('Hazır');
        }
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

    console.log('[ZUZU] Solana init OK');
  }

  // DOM hazır olduğunda başlat
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initWhenReady);
  } else {
    initWhenReady();
  }
})();
