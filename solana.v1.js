(function(){
  // Kütüphaneler gelene kadar tıklama boşa gitmesin
  window.__zuzuSolanaConnect = function(){ alert("Loading Solana wallet… please wait a moment and try again."); };

  function ensureLibs(cb){
    function ok(){ cb(); }
    if (window.solanaWeb3 && (window.splToken || window.spl || window.spl_token)) return ok();
    setTimeout(ok, 600); // index.html zaten yükleyecek, kısa bekle
  }

  function init(){
    ensureLibs(function(){
      var web3 = window.solanaWeb3;
      var spl  = window.splToken || window.spl || window.spl_token;
      if(!web3 || !spl){ setTimeout(init,400); return; }

      var Connection=web3.Connection, PublicKey=web3.PublicKey, SystemProgram=web3.SystemProgram,
          Transaction=web3.Transaction, TransactionInstruction=web3.TransactionInstruction,
          LAMPORTS_PER_SOL=web3.LAMPORTS_PER_SOL, clusterApiUrl=web3.clusterApiUrl;

      var RPC = clusterApiUrl("mainnet-beta");
      var USDT_MINT = new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB");
      var TREASURY  = new PublicKey((window.CONFIG&&window.CONFIG.treasurySolana)||"31Cjkx2PA5oMapNxxGAiZhuHDcvAyQ7hogqB8Hx6f1pW");
      var MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
      var enc = new TextEncoder();
      var conn = new Connection(RPC, "confirmed");

      var btnDisconnect=document.getElementById("btnDisconnect");
      var btnBuySOL=document.getElementById("btnBuySOL");
      var btnBuyUSDT=document.getElementById("btnBuyUSDT");
      var walletAddrEl=document.getElementById("walletAddr");
      var statusEl=document.getElementById("solanaStatus");
      var solAmountEl=document.getElementById("solAmount");
      var usdtAmountEl=document.getElementById("usdtAmount");

      var adapter=null, pubkey=null;

      function setStatus(t){ if(statusEl) statusEl.textContent="Durum: "+t; }
      function short(s){ return s.slice(0,4)+"..."+s.slice(-4); }
      function setConnectedUI(on){
        if(btnDisconnect) btnDisconnect.disabled=!on;
        if(btnBuySOL) btnBuySOL.disabled=!on;
        if(btnBuyUSDT) btnBuyUSDT.disabled=!on;
        if(walletAddrEl) walletAddrEl.textContent = (on&&pubkey)? short(pubkey.toBase58()):"Not connected";
        if(typeof window.__zuzuSetConnectLabel==="function") window.__zuzuSetConnectLabel(on&&pubkey? short(pubkey.toBase58()):"Connect Wallet");
      }
      function detectWallet(){
        if (window.phantom && window.phantom.solana) return window.phantom.solana;
        if (window.solana && (window.solana.isPhantom || window.solana.isBackpack)) return window.solana;
        if (window.solflare && window.solflare.isSolflare) return window.solflare;
        if (window.backpack && window.backpack.solana) return window.backpack.solana;
        return null;
      }
      function memoIx(text){ return new TransactionInstruction({keys:[], programId:MEMO_PROGRAM_ID, data:enc.encode(text)}); }
      function refString(){ var r=localStorage.getItem("zuzu_ref"); return r?("ZUZU|ref:"+r):"ZUZU|ref:none"; }

      function connect(){
        try{
          setStatus("Cüzdan aranıyor…");
          adapter = detectWallet();
          if(!adapter){ setStatus("Cüzdan bulunamadı. Phantom / Solflare / Backpack kur."); window.open("https://phantom.app/download","_blank"); return; }
          adapter.connect().then(function(res){
            var pk = (res && res.publicKey) ? res.publicKey : adapter.publicKey;
            pubkey = new PublicKey(pk);
            setConnectedUI(true); setStatus("Bağlandı");
            if (typeof window.__zuzuSetReferral==="function") window.__zuzuSetReferral(pubkey.toBase58());
          }).catch(function(){ setStatus("Bağlantı iptal edildi"); });
        }catch(e){ setStatus("Hata"); }
      }
      function disconnect(){
        try{ if(adapter && adapter.disconnect) adapter.disconnect(); }catch(e){}
        pubkey=null; setConnectedUI(false); setStatus("Bağlantı kesildi");
      }
      function sendSOL(){
        if(!pubkey) return setStatus("Önce cüzdan bağla");
        var amt=parseFloat((solAmountEl&&solAmountEl.value)||"0"); if(!amt||amt<=0) return setStatus("Geçerli SOL miktarı gir");
        try{
          setStatus("SOL işlemi hazırlanıyor…");
          var lamports = Math.floor(amt * LAMPORTS_PER_SOL);
          var tx = new Transaction().add(
            SystemProgram.transfer({fromPubkey:pubkey,toPubkey:TREASURY,lamports:lamports}),
            memoIx(refString())
          );
          tx.feePayer=pubkey;
          conn.getLatestBlockhash().then(function(bh){
            tx.recentBlockhash=bh.blockhash;
            adapter.signTransaction(tx).then(function(signed){
              conn.sendRawTransaction(signed.serialize(),{skipPreflight:false,preflightCommitment:"confirmed"})
              .then(function(sig){ return conn.confirmTransaction(sig,"confirmed").then(function(){ setStatus("Başarılı ✔ Tx: "+sig); }); })
              .catch(function(){ setStatus("Gönderim başarısız"); });
            });
          });
        }catch(e){ setStatus("SOL transfer hatası"); }
      }
      function sendUSDT(){
        if(!pubkey) return setStatus("Önce cüzdan bağla");
        var amt=parseFloat((usdtAmountEl&&usdtAmountEl.value)||"0"); if(!amt||amt<=0) return setStatus("Geçerli USDT miktarı gir");
        try{
          setStatus("USDT işlemi hazırlanıyor…");
          Promise.all([
            spl.getAssociatedTokenAddress(USDT_MINT, pubkey, false, spl.TOKEN_PROGRAM_ID, spl.ASSOCIATED_TOKEN_PROGRAM_ID),
            spl.getAssociatedTokenAddress(USDT_MINT, TREASURY, false, spl.TOKEN_PROGRAM_ID, spl.ASSOCIATED_TOKEN_PROGRAM_ID)
          ]).then(function(ad){
            var fromATA=ad[0], toATA=ad[1], ixs=[];
            conn.getAccountInfo(toATA).then(function(toInfo){
              if(!toInfo) ixs.push(spl.createAssociatedTokenAccountInstruction(pubkey,toATA,TREASURY,USDT_MINT,spl.TOKEN_PROGRAM_ID,spl.ASSOCIATED_TOKEN_PROGRAM_ID));
              conn.getAccountInfo(fromATA).then(function(fromInfo){
                if(!fromInfo) ixs.push(spl.createAssociatedTokenAccountInstruction(pubkey,fromATA,pubkey,USDT_MINT,spl.TOKEN_PROGRAM_ID,spl.ASSOCIATED_TOKEN_PROGRAM_ID));
                var amount = Math.floor(amt * 1000000); // 6 decimals
                ixs.push(spl.createTransferInstruction(fromATA,toATA,pubkey,amount,[],spl.TOKEN_PROGRAM_ID));
                ixs.push(memoIx(refString()));
                var tx=new Transaction(); for(var i=0;i<ixs.length;i++) tx.add(ixs[i]);
                tx.feePayer=pubkey;
                conn.getLatestBlockhash().then(function(bh){
                  tx.recentBlockhash=bh.blockhash;
                  adapter.signTransaction(tx).then(function(signed){
                    conn.sendRawTransaction(signed.serialize(),{skipPreflight:false,preflightCommitment:"confirmed"})
                    .then(function(sig){ return conn.confirmTransaction(sig,"confirmed").then(function(){ setStatus("USDT gönderildi ✔ Tx: "+sig); }); })
                    .catch(function(){ setStatus("USDT gönderim hatası"); });
                  });
                });
              });
            });
          });
        }catch(e){ setStatus("USDT transfer hatası"); }
      }

      var d=document;
      var b1=d.getElementById("btnDisconnect"); if(b1) b1.addEventListener("click",disconnect);
      var b2=d.getElementById("btnBuySOL"); if(b2) b2.addEventListener("click",sendSOL);
      var b3=d.getElementById("btnBuyUSDT"); if(b3) b3.addEventListener("click",sendUSDT);

      window.__zuzuSolanaConnect = connect;
      setConnectedUI(false); setStatus("Hazır");
    });
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
