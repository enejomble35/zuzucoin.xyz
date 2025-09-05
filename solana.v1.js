/* ========= ZUZU – Solana config ========= */
const ZUZU = {
  // Satış açılış tarihi (ör. 5 Kasım 2025 13:00 +03:00)
  launchAtISO: "2025-11-05T13:00:00+03:00",

  // Ödeme toplayacağın SOL adresi
  treasurySOL: "8vxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // <-- kendi SOL adresin

  // USDT (SPL) mint ve alıcı (aynı adresi kullanabilirsin)
  usdtMint: "Es9vMFrzaCERz8iYhGMXfMV64N6V7kJphQ8usAqyx3Pf", // mainnet USDT
  treasuryUSDT: "8vxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",  // <-- kendi USDT alan hesabın (SPL)
  priceByWeek: [0.0050,0.0065,0.0080,0.0100],
  collectionUrl: "https://thirdweb.com/",
  contractAddress: "0xF2bbbEcB417725813BF5E940d678793fACDa9729"
};

/* ========= Countdown (sabit tarih) ========= */
(function(){
  const target = new Date(ZUZU.launchAtISO).getTime();
  function tick(){
    const left = Math.max(0, target - Date.now());
    const d = Math.floor(left/86400000);
    const h = Math.floor((left%86400000)/3600000);
    const m = Math.floor((left%3600000)/60000);
    const s = Math.floor((left%60000)/1000);
    const pad = n=>n.toString().padStart(2,"0");
    const ids=["cdDays","cdHours","cdMins","cdSecs"];
    [d,h,m,s].forEach((v,i)=>{const el=document.getElementById(ids[i]); if(el) el.textContent=pad(v);});
  }
  tick(); setInterval(tick,1000);
})();

/* ========= UI küçük bağlayıcılar ========= */
(function(){
  const c = ZUZU.contractAddress;
  const cd = document.getElementById("contractDisplay");
  const cd2= document.getElementById("contractDisplay2");
  if(cd)  cd.textContent = `${c.slice(0,6)}...${c.slice(-4)}`;
  if(cd2) cd2.textContent = c;

  const t1=document.getElementById("thirdwebNFTRoute");
  const t2=document.getElementById("thirdwebNFTRoute2");
  if(t1) t1.href=ZUZU.collectionUrl;
  if(t2) t2.href=ZUZU.collectionUrl;

  // Week maliyetleri
  function updateCosts(){
    const qty=parseFloat((document.getElementById("buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
    ZUZU.priceByWeek.forEach((p,i)=>{
      const priceEl=document.getElementById("p"+i);
      const costEl=document.getElementById("c"+i);
      if(priceEl) priceEl.textContent=p.toFixed(4);
      if(costEl)  costEl.textContent=(qty*p).toLocaleString();
    });
  }
  document.getElementById("buyAmount")?.addEventListener("input",updateCosts);
  updateCosts();

  // referral link
  const refIn=document.getElementById("refInput");
  const refCopy=document.getElementById("refCopy");
  const refShare=document.getElementById("refShare");
  const myRef = (localStorage.getItem("zuzu_ref") || crypto.getRandomValues(new Uint8Array(8)).reduce((a,b)=>a+("abcdefghijklmnopqrstuvwxyz0123456789")[b%36],""));
  localStorage.setItem("zuzu_ref", myRef);
  const url = new URL(location.href);
  url.searchParams.set("ref", myRef);
  if(refIn) refIn.value = url.toString();
  refCopy?.addEventListener("click",()=>{ navigator.clipboard.writeText(refIn.value); alert("Copied!"); });
  refShare?.addEventListener("click",()=>{ if(navigator.share) navigator.share({title:"Join ZUZU",url:refIn.value}); else alert("Share not supported"); });
})();

/* ========= Solana – connect & buy ========= */
(async function(){
  const { Connection, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } = solanaWeb3;

  let adapter=null, publicKey=null;

  function needWallet(){
    const ua=navigator.userAgent||"";
    const inWallet=/Phantom|Solflare|Backpack/i.test(ua);
    return !inWallet;
  }

  function assertAdapter(){
    if (!window.__zuzuWallet || !window.__zuzuWallet.adapter) throw new Error("Wallet not connected");
    adapter = window.__zuzuWallet.adapter;
    publicKey = adapter.publicKey;
  }

  async function makeSolPayment(amountSOL){
    assertAdapter();
    const conn = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
    const tx = new Transaction().add(SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey:   new PublicKey(ZUZU.treasurySOL),
      lamports: Math.floor(amountSOL * LAMPORTS_PER_SOL)
    }));
    tx.feePayer = publicKey;
    const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    const signed = await adapter.signAndSendTransaction(tx);
    await conn.confirmTransaction({signature:signed.signature, blockhash, lastValidBlockHeight}, "confirmed");
    return signed.signature;
  }

  async function makeUsdtPayment(amountUSDT){
    assertAdapter();
    const conn = new Connection("https://api.mainnet-beta.solana.com","confirmed");
    const mint = new PublicKey(ZUZU.usdtMint);
    const to   = new PublicKey(ZUZU.treasuryUSDT);

    // SPL Token transfer (basit IIFE build’lerinde helper fonk yok; raw instruction)
    const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
    const { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync, createAssociatedTokenAccountInstruction, createTransferInstruction } = splToken;

    const fromAta = getAssociatedTokenAddressSync(mint, publicKey, false, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
    const toAta   = getAssociatedTokenAddressSync(mint, to,        false, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);

    const ix = [];
    const toInfo = await conn.getAccountInfo(toAta);
    if(!toInfo){
      ix.push(createAssociatedTokenAccountInstruction(publicKey, toAta, to, mint, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID));
    }
    const amount = BigInt(Math.round(amountUSDT * 1e6)); // USDT 6 decimals
    ix.push(createTransferInstruction(fromAta, toAta, publicKey, Number(amount), [], TOKEN_PROGRAM_ID));

    const tx = new Transaction().add(...ix);
    tx.feePayer = publicKey;
    const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash();
    tx.recentBlockhash = blockhash;

    const signed = await adapter.signAndSendTransaction(tx);
    await conn.confirmTransaction({signature:signed.signature, blockhash, lastValidBlockHeight}, "confirmed");
    return signed.signature;
  }

  // UI EVENTS
  document.getElementById("btnBuySOL")?.addEventListener("click", async ()=>{
    try{
      if (needWallet()) { alert("Lütfen Phantom / Solflare / Backpack içinden açın ve bağlanın."); return; }
      const amt = parseFloat((document.getElementById("paySOL")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
      if (amt<=0) return alert("Geçerli SOL miktarı gir.");
      const sig = await makeSolPayment(amt);
      alert("Success!\nTx: "+sig);
    }catch(e){ console.error(e); alert("Transaction failed."); }
  });

  document.getElementById("btnBuyUSDT")?.addEventListener("click", async ()=>{
    try{
      if (needWallet()) { alert("Lütfen Phantom / Solflare / Backpack içinden açın ve bağlanın."); return; }
      // basit örnek: 25 USDT gönder
      const sig = await makeUsdtPayment(25);
      alert("Success!\nTx: "+sig);
    }catch(e){ console.error(e); alert("USDT transfer failed."); }
  });

  // Hafta butonları sadece bilgi amaçlı (Solana ödeme yukarıdan)
  ["buyW0","buyW1","buyW2","buyW3"].forEach((id,i)=>{
    document.getElementById(id)?.addEventListener("click", ()=>alert("Ödeme üstteki Solana kutusundan yapılır."));
  });
})();
