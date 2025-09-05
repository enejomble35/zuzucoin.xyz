// solana.js — dış JS (script tag yok)
(function(){
  // Kütüphaneler gelmeden tıklanırsa uyarı
  window.__zuzuSolanaConnect = function(){
    alert('Loading Solana wallet… please wait a moment and try again.');
  };

  // Fallback: global adları otomatik bul
  function resolveSplGlobal(){
    return window.splToken || window.spl || window.spl_token || null;
  }

  // Dinamik yükleme (yine de index.html’de zaten var)
  function loadScript(src){ return new Promise((res,rej)=>{ const s=document.createElement('script'); s.src=src; s.async=true; s.onload=res; s.onerror=()=>rej(new Error('load fail '+src)); document.head.appendChild(s); }); }
  async function ensureLibs(){
    if (window.solanaWeb3 && resolveSplGlobal()) return;
    // web3.js
    if (!window.solanaWeb3){
      try{ await loadScript('https://cdn.jsdelivr.net/npm/@solana/web3.js@1.95.3/lib/index.iife.min.js'); }
      catch{ try{ await loadScript('https://unpkg.com/@solana/web3.js@1.95.3/lib/index.iife.min.js'); }catch{} }
    }
    // spl-token
    if (!resolveSplGlobal()){
      try{ await loadScript('https://cdn.jsdelivr.net/npm/@solana/spl-token@0.4.6/lib/index.iife.min.js'); }
      catch{ try{ await loadScript('https://unpkg.com/@solana/spl-token@0.4.6/lib/index.iife.min.js'); }catch{} }
    }
  }

  async function init(){
    await ensureLibs();

    const web3 = window.solanaWeb3;
    const spl  = resolveSplGlobal();
    if(!web3 || !spl){ setTimeout(init, 400); return; }

    const { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction, LAMPORTS_PER_SOL, clusterApiUrl } = web3;
    const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');
    const enc = new TextEncoder();

    // Config
    const RPC = clusterApiUrl('mainnet-beta');
    const USDT_MINT = new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB');
    const TREASURY  = new PublicKey((window.CONFIG?.treasurySolana) || '31Cjkx2PA5oMapNxxGAiZhuHDcvAyQ7hogqB8Hx6f1pW');
    const conn = new Connection(RPC, 'confirmed');

    // UI
    const btnDisconnect = document.getElementById('btnDisconnect');
    const btnBuySOL = document.getElementById('btnBuySOL');
    const btnBuyUSDT = document.getElementById('btnBuyUSDT');
    const walletAddrEl = document.getElementById('walletAddr');
    const statusEl = document.getElementById('solanaStatus');
    const solAmountEl = document.getElementById('solAmount');
    const usdtAmountEl = document.getElementById('usdtAmount');

    // State
    let adapter = null;
    let pubkey  = null;

    // Helpers
    const setStatus = (msg)=>{ if(statusEl) statusEl.textContent=`Durum: ${msg}`; };
    const short=(s)=>s.slice(0,4)+'...'+s.slice(-4);
    const setConnectedUI = (connected)=>{
      if (btnDisconnect) btnDisconnect.disabled = !connected;
      if (btnBuySOL) btnBuySOL.disabled = !connected;
      if (btnBuyUSDT) btnBuyUSDT.disabled = !connected;
      if (walletAddrEl) walletAddrEl.textContent = connected && pubkey ? short(pubkey.toBase58()) : 'Not connected';
      if (connected && typeof window.__zuzuSetConnectLabel === 'function') window.__zuzuSetConnectLabel(short(pubkey.toBase58()));
      if (!connected && typeof window.__zuzuSetConnectLabel === 'function') window.__zuzuSetConnectLabel('Connect Wallet');
    };
    const detectWallet = ()=>{
      if (window.phantom?.solana) return window.phantom.solana;
      if (window.solana?.isPhantom || window.solana?.isBackpack) return window.solana;
      if (window.solflare?.isSolflare) return window.solflare;
      if (window.backpack?.solana) return window.backpack.solana;
      return null;
    };
    const memoIx = (text)=> new TransactionInstruction({ keys:[], programId: MEMO_PROGRAM_ID, data: (new TextEncoder()).encode(text) });
    const refString = ()=>{
      const r = localStorage.getItem('zuzu_ref');
      return r ? `ZUZU|ref:${r}` : 'ZUZU|ref:none';
    };

    async function connect(){
      try{
        setStatus('Cüzdan aranıyor…');
        adapter = detectWallet();
        if(!adapter){
          setStatus('Cüzdan bulunamadı. Phantom / Solflare / Backpack kur.');
          window.open('https://phantom.app/download', '_blank'); return;
        }
        const res = await adapter.connect();
        pubkey = new PublicKey(res?.publicKey || adapter.publicKey);
        setConnectedUI(true);
        setStatus('Bağlandı');
        if (typeof window.__zuzuSetReferral === 'function') window.__zuzuSetReferral(pubkey.toBase58());
      }catch(e){ console.error(e); setStatus('Bağlantı iptal edildi'); }
    }
    async function disconnect(){
      try{ if(adapter?.disconnect) await adapter.disconnect(); }catch{}
      pubkey=null; setConnectedUI(false); setStatus('Bağlantı kesildi');
    }
    async function sendSOL(){
      if(!pubkey) return setStatus('Önce cüzdan bağla');
      const amt=parseFloat(solAmountEl?.value||'0'); if(!amt||amt<=0) return setStatus('Geçerli SOL miktarı gir');
      try{
        setStatus('SOL işlemi hazırlanıyor…');
        const tx=new Transaction().add(
          SystemProgram.transfer({ fromPubkey: pubkey, toPubkey: TREASURY, lamports: BigInt(Math.floor(amt * LAMPORTS_PER_SOL)) }),
          memoIx(refString())
        );
        tx.feePayer=pubkey; tx.recentBlockhash=(await conn.getLatestBlockhash()).blockhash;
        const signed=await adapter.signTransaction(tx);
        const sig=await conn.sendRawTransaction(signed.serialize(),{skipPreflight:false,preflightCommitment:'confirmed'});
        await conn.confirmTransaction(sig,'confirmed');
        setStatus(`Başarılı ✔ Tx: ${sig}`);
      }catch(e){ console.error(e); setStatus('SOL transferi başarısız veya reddedildi'); }
    }
    async function sendUSDT(){
      if(!pubkey) return setStatus('Önce cüzdan bağla');
      const amt=parseFloat(usdtAmountEl?.value||'0'); if(!amt||amt<=0) return setStatus('Geçerli USDT miktarı gir');
      try{
        setStatus('USDT işlemi hazırlanıyor…');
        const payer=pubkey;
        const fromATA = await spl.getAssociatedTokenAddress(USDT_MINT, payer, false, spl.TOKEN_PROGRAM_ID, spl.ASSOCIATED_TOKEN_PROGRAM_ID);
        const toATA   = await spl.getAssociatedTokenAddress(USDT_MINT, TREASURY, false, spl.TOKEN_PROGRAM_ID, spl.ASSOCIATED_TOKEN_PROGRAM_ID);

        const ixs=[];
        if(!await conn.getAccountInfo(toATA)){
          ixs.push(spl.createAssociatedTokenAccountInstruction(payer, toATA, TREASURY, USDT_MINT, spl.TOKEN_PROGRAM_ID, spl.ASSOCIATED_TOKEN_PROGRAM_ID));
        }
        if(!await conn.getAccountInfo(fromATA)){
          ixs.push(spl.createAssociatedTokenAccountInstruction(payer, fromATA, payer, USDT_MINT, spl.TOKEN_PROGRAM_ID, spl.ASSOCIATED_TOKEN_PROGRAM_ID));
        }
        const amount = BigInt(Math.floor(amt * 1_000_000)); // USDT 6 decimals
        ixs.push(spl.createTransferInstruction(fromATA, toATA, payer, amount, [], spl.TOKEN_PROGRAM_ID));
        ixs.push(memoIx(refString()));

        const tx=new Transaction().add(...ixs);
        tx.feePayer=payer; tx.recentBlockhash=(await conn.getLatestBlockhash()).blockhash;
        const signed=await adapter.signTransaction(tx);
        const sig=await conn.sendRawTransaction(signed.serialize(),{skipPreflight:false,preflightCommitment:'confirmed'});
        await conn.confirmTransaction(sig,'confirmed');
        setStatus(`USDT gönderildi ✔ Tx: ${sig}`);
      }catch(e){ console.error(e); setStatus('USDT transferi başarısız (cüzdanda USDT var mı?)'); }
    }

    // UI bağla
    document.getElementById('btnDisconnect')?.addEventListener('click', disconnect);
    document.getElementById('btnBuySOL')?.addEventListener('click', sendSOL);
    document.getElementById('btnBuyUSDT')?.addEventListener('click', sendUSDT);

    // Global connect
    window.__zuzuSolanaConnect = connect;

    // Account change
    const w = detectWallet();
    if (w && !w._zuzuBound && w.on){
      try{
        w.on('accountChanged', (pk)=>{
          if(pk){
            pubkey = new PublicKey(pk);
            setConnectedUI(true);
            setStatus('Hesap değişti');
            if (typeof window.__zuzuSetReferral === 'function') window.__zuzuSetReferral(pubkey.toBase58());
          }else{
            disconnect();
          }
        });
        w._zuzuBound=true;
      }catch{}
    }

    setConnectedUI(false);
    setStatus('Hazır');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
