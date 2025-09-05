(function(){
  function ensureLibs(cb){
    if (window.solanaWeb3 && (window.splToken || window.spl || window.spl_token)) return cb();
    setTimeout(cb, 600); // web3/spl defer ile geliyor
  }

  function init(){
    ensureLibs(function(){
      var web3=window.solanaWeb3, spl=window.splToken||window.spl||window.spl_token;
      if(!web3||!spl){ setTimeout(init,400); return; }

      var Connection=web3.Connection, PublicKey=web3.PublicKey, SystemProgram=web3.SystemProgram,
          Transaction=web3.Transaction, TransactionInstruction=web3.TransactionInstruction,
          LAMPORTS_PER_SOL=web3.LAMPORTS_PER_SOL, clusterApiUrl=web3.clusterApiUrl;

      var RPC=clusterApiUrl("mainnet-beta");
      var USDT_MINT=new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB");
      var TREASURY=new PublicKey((window.CONFIG&&window.CONFIG.treasurySolana)||"31Cjkx2PA5oMapNxxGAiZhuHDcvAyQ7hogqB8Hx6f1pW");
      var MEMO_PROGRAM_ID=new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
      var enc=new TextEncoder();
      var conn=new Connection(RPC,"confirmed");

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
        if(walletAddrEl) walletAddrEl.textContent=(on&&pubkey)? short(pubkey.toBase58()):"Not connected";
        if(typeof window.__zuzuSetConnectLabel==="function") window.__zuzuSetConnectLabel(on&&pubkey? short(pubkey.toBase58()):"Connect Wallet");
      }
      function detectWallet(){
        if (window.__zuzuWallet && window.__zuzuWallet.adapter) return window.__zuzuWallet.adapter;
        if (window.phantom && window.phantom.solana) return window.phantom.solana;
        if (window.solana && (window.solana.isPhantom||window.solana.isBackpack)) return window.solana;
        if (window.solflare && window.solflare.isSolflare) return window.solflare;
        if (window.backpack && window.backpack.solana) return window.backpack.solana;
        return null;
      }
      function memoIx(text){ return new TransactionInstruction({keys:[], programId:MEMO_PROGRAM_ID, data:enc.encode(text)}); }
      function refString(){ var r=localStorage.getItem("zuzu_ref"); return r?("ZUZU|ref:"+r):"ZUZU|ref:none"; }

      function connect(){
        adapter=detectWallet();
        if(!adapter){ setStatus("Cüzdan yok"); alert("Phantom / Solflare / Backpack kur."); return; }
        adapter.connect().then(function(res){
          var pk=(res&&res.publicKey)?res.publicKey:adapter.publicKey;
          pubkey=new PublicKey(pk);
          setConnectedUI(true); setStatus("Bağlandı");
          if (typeof window.__zuzuSetReferral==="function") window.__zuzuSetReferral(pubkey.toBase58());
        }).catch(function(){ setStatus("Bağlantı iptal"); });
      }
      function disconnect(){
        try{ if(adapter && adapter.disconnect) adapter.disconnect(); }catch(e){}
        pubkey=null; setConnectedUI(false); setStatus("Bağlantı kesildi");
      }
      function sendSOL(){
        if(!pubkey){ setStatus("Önce cüzdan bağla"); return; }
        var amt=parseFloat((solAmountEl&&solAmountEl.value)||"0"); if(!amt||amt<=0){ setStatus("Geçerli SOL miktarı gir"); return; }
        setStatus("SOL hazırlanıyor…");
        var lamports=Math.floor(amt*LAMPORTS_PER_SOL);
        var tx=new Transaction().add(SystemProgram.transfer({fromPubkey:pubkey,toPubkey:TREASURY,lamports:lamports}), memoIx(refString()));
        tx.feePayer=pubkey;
        conn.getLatestBlockhash().then(function(bh){
          tx.recentBlockhash=bh.blockhash;
          adapter.signTransaction(tx).then(function(signed){
            conn.sendRawTransaction(signed.serialize(),{skipPreflight:false,preflightCommitment:"confirmed"})
              .then(function(sig){ return conn.confirmTransaction(sig,"confirmed").then(function(){ setStatus("Başarılı ✔ Tx: "+sig); }); })
              .catch(function(){ setStatus("Gönderim hatası"); });
          });
        });
      }
      function sendUSDT(){
        if(!pubkey){ setStatus("Önce cüzdan bağla"); return; }
        var amt=parseFloat((usdtAmountEl&&usdtAmountEl.value)||"0"); if(!amt||amt<=0){ setStatus("Geçerli USDT gir"); return; }
        setStatus("USDT hazırlanıyor…");
        Promise.all([
          spl.getAssociatedTokenAddress(USDT_MINT, pubkey, false, spl.TOKEN_PROGRAM_ID, spl.ASSOCIATED_TOKEN_PROGRAM_ID),
          spl.getAssociatedTokenAddress(USDT_MINT, TREASURY, false, spl.TOKEN_PROGRAM_ID, spl.ASSOCIATED_TOKEN_PROGRAM_ID)
        ]).then(function(ad){
          var fromATA=ad[0], toATA=ad[1], ixs=[];
          conn.getAccountInfo(toATA).then(function(toInfo){
            if(!toInfo) ixs.push(spl.createAssociatedTokenAccountInstruction(pubkey,toATA,TREASURY,USDT_MINT,spl.TOKEN_PROGRAM_ID,spl.ASSOCIATED_TOKEN_PROGRAM_ID));
            conn.getAccountInfo(fromATA).then(function(fromInfo){
              if(!fromInfo) ixs.push(spl.createAssociatedTokenAccountInstruction(pubkey,fromATA,pubkey,USDT_MINT,spl.TOKEN_PROGRAM_ID,spl.ASSOCIATED_TOKEN_PROGRAM_ID));
              var amount=Math.floor(amt*1000000); // 6 dec
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
      }

      // bağla/düğmeler
      var cbtn=document.getElementById("connectBtn"); if(cbtn) cbtn.addEventListener("click", connect);
      if(btnDisconnect) btnDisconnect.addEventListener("click", disconnect);
      if(btnBuySOL) btnBuySOL.addEventListener("click", sendSOL);
      if(btnBuyUSDT) btnBuyUSDT.addEventListener("click", sendUSDT);

      setConnectedUI(false); setStatus("Hazır");
    });
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
