/* =========================
   SOL/USDT (SPL) purchase helpers
   - Phantom / Solflare / Backpack
   - web3.js yoksa otomatik yükler
========================= */
(function(){
  function loadWeb3(cb){
    if (window.solanaWeb3) return cb();
    const s = document.createElement("script");
    s.src = "https://unpkg.com/@solana/web3.js@1.95.3/lib/index.iife.min.js";
    s.onload = cb; s.onerror = ()=>console.warn("web3 load fail");
    document.head.appendChild(s);
  }
  loadWeb3(init);

  function init(){
    const web3 = window.solanaWeb3; if(!web3){ console.warn("no web3"); return; }

    const OWNER = new web3.PublicKey(window.CONFIG.ownerSol);
    const USDT_MINT = new web3.PublicKey(window.CONFIG.usdtMint);
    const TOKEN_PROGRAM_ID = new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
    const ASSOCIATED_TOKEN_PROGRAM_ID = new web3.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
    const USDT_DECIMALS = 6;
    const USDT_PER_SOL = 150; // varsayım; istersen güncelle

    function provider(){
      if (window.solana?.isPhantom) return window.solana;
      if (window.solflare?.signAndSendTransaction) return window.solflare;
      if (window.backpack?.signAndSendTransaction) return window.backpack;
      return null;
    }
    async function connectIfNeeded(){
      const p = provider(); if(!p){ alert("Wallet not found"); return null; }
      try{ if(!p.publicKey) await p.connect(); }catch(e){ console.warn(e); return null; }
      return p;
    }

    async function findATA(owner, mint){
      const [ata] = await web3.PublicKey.findProgramAddress(
        [owner.toBuffer(), new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA").toBuffer(), mint.toBuffer()],
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      return ata;
    }
    function createATAInstr(payer, ata, owner, mint){
      return new web3.TransactionInstruction({
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
        keys: [
          { pubkey: payer, isSigner:true,  isWritable:true  },
          { pubkey: ata,   isSigner:false, isWritable:true  },
          { pubkey: owner, isSigner:false, isWritable:false },
          { pubkey: mint,  isSigner:false, isWritable:false },
          { pubkey: web3.SystemProgram.programId, isSigner:false, isWritable:false },
          { pubkey: TOKEN_PROGRAM_ID,            isSigner:false, isWritable:false },
          { pubkey: web3.SYSVAR_RENT_PUBKEY,     isSigner:false, isWritable:false },
        ],
        data: new Uint8Array([])
      });
    }
    function createTransferCheckedInstr(source, mint, dest, owner, amountUi, decimals){
      const amount = BigInt(Math.round(amountUi * 10**decimals));
      const data = new Uint8Array(1+8+1);
      data[0]=12; let x=amount; for(let i=0;i<8;i++){ data[1+i]=Number(x&0xffn); x>>=8n; } data[9]=decimals;
      return new web3.TransactionInstruction({
        programId: TOKEN_PROGRAM_ID,
        keys:[
          {pubkey:source,isSigner:false,isWritable:true},
          {pubkey:mint,isSigner:false,isWritable:false},
          {pubkey:dest,isSigner:false,isWritable:true},
          {pubkey:owner,isSigner:true,isWritable:false},
        ],
        data
      });
    }

    async function buySOL(costUSDT){
      const p = await connectIfNeeded(); if(!p) return false;
      const conn = new web3.Connection("https://api.mainnet-beta.solana.com");
      const solAmount = costUSDT / USDT_PER_SOL;
      const tx = new web3.Transaction().add(web3.SystemProgram.transfer({
        fromPubkey: p.publicKey, toPubkey: OWNER, lamports: Math.round(solAmount*web3.LAMPORTS_PER_SOL)
      }));
      tx.feePayer = p.publicKey;
      tx.recentBlockhash = (await conn.getLatestBlockhash()).blockhash;
      const { signature } = await p.signAndSendTransaction(tx);
      console.log("SOL tx:", signature);
      return true;
    }

    async function buyUSDT(costUSDT){
      const p = await connectIfNeeded(); if(!p) return false;
      const conn = new web3.Connection("https://api.mainnet-beta.solana.com");
      const from = p.publicKey;

      const srcATA = await findATA(from, USDT_MINT);
      const dstATA = await findATA(OWNER, USDT_MINT);

      const ixs = [];
      const dstInfo = await conn.getAccountInfo(dstATA);
      if (!dstInfo) ixs.push(createATAInstr(from, dstATA, OWNER, USDT_MINT));

      const srcInfo = await conn.getAccountInfo(srcATA);
      if (!srcInfo) { alert("Your wallet has no USDT account."); return false; }

      ixs.push(createTransferCheckedInstr(srcATA, USDT_MINT, dstATA, from, costUSDT, USDT_DECIMALS));

      const tx = new web3.Transaction().add(...ixs);
      tx.feePayer = from;
      tx.recentBlockhash = (await conn.getLatestBlockhash()).blockhash;

      const { signature } = await p.signAndSendTransaction(tx);
      console.log("USDT tx:", signature);
      return true;
    }

    window.__zuzu_buySOL  = buySOL;
    window.__zuzu_buyUSDT = buyUSDT;
  }
})();
