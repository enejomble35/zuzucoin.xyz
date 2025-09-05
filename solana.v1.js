/* ========= ZUZU – Solana config ========= */
const ZUZU = {
  // ÖRNEK: 5 Kasım 2025 13:00 (+03:00)
  launchAtISO: "2025-11-05T13:00:00+03:00",

  // KENDİ ADRESLERİNİ YAZ
  treasurySOL:  "8vxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // SOL alacak hesap
  treasuryUSDT: "8vxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // USDT (SPL) alacak hesap
  usdtMint:     "Es9vMFrzaCERz8iYhGMXfMV64N6V7kJphQ8usAqyx3Pf", // Mainnet USDT

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
    ["cdDays","cdHours","cdMins","cdSecs"].forEach((id,i)=>{
      const v=[d,h,m,s][i], el=document.getElementById(id);
      if(el) el.textContent = pad(v);
    });
  }
  tick(); setInterval(tick,1000);
})();

/* ========= EVM bloklarını gizle (eski yazılar bozulmadan) ========= */
(function(){
  const cards = document.querySelectorAll("#presale .card");
  cards.forEach(el=>{
    if (el.textContent && /MetaMask|Payments in USDT via MetaMask/i.test(el.textContent)){
      el.style.display="none";
    }
  });
})();

/* ========= Linkler / NFT / maliyet ========= */
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

  // Referral
  const refIn=document.getElementById("refInput");
  const refCopy=document.getElementById("refCopy");
  const refShare=document.getElementById("refShare");
  const rand=()=>crypto.getRandomValues(new Uint8Array(8)).reduce((a,b)=>a+("abcdefghijklmnopqrstuvwxyz0123456789")[b%36],"");
  const myRef=localStorage.getItem("zuzu_ref")||rand();
  localStorage.setItem("zuzu_ref", myRef);
  const u=new URL(location.href); u.searchParams.set("ref", myRef);
  if(refIn) refIn.value=u.toString();
  refCopy?.addEventListener("click",()=>{ navigator.clipboard.writeText(refIn.value); alert("Copied!"); });
  refShare?.addEventListener("click",()=>{ if(navigator.share) navigator.share({title:"Join ZUZU",url:refIn.value}); else alert("Share not supported"); });
})();

/* ========= Solana – ödeme ========= */
(async function(){
  const { Connection, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } = solanaWeb3;

  function assertWallet(){
    if (!window.__zuzuWallet || !window.__zuzuWallet.adapter) throw new Error("Wallet not connected");
    return window.__zuzuWallet.adapter;
  }

  async function paySOL(amountSOL){
    const adapter = assertWallet();
    const conn = new Connection("https://api.mainnet-beta.solana.com","confirmed");
    const from = adapter.publicKey;
    const to   = new PublicKey(ZUZU.treasurySOL);
    const tx = new Transaction().add(SystemProgram.transfer({
      fromPubkey: from, toPubkey: to, lamports: Math.floor(amountSOL*LAMPORTS_PER_SOL)
    }));
    tx.feePayer = from;
    const {blockhash,lastValidBlockHeight} = await conn.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    const {signature} = await adapter.signAndSendTransaction(tx);
    await conn.confirmTransaction({signature,blockhash,lastValidBlockHeight}, "confirmed");
    return signature;
  }

  async function payUSDT(amount){
    const adapter = assertWallet();
    const conn = new Connection("https://api.mainnet-beta.solana.com","confirmed");
    const mint = new PublicKey(ZUZU.usdtMint);
    const to   = new PublicKey(ZUZU.treasuryUSDT);

    const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
    const { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync, createAssociatedTokenAccountInstruction, createTransferInstruction } = splToken;

    const from = adapter.publicKey;
    const fromAta = getAssociatedTokenAddressSync(mint, from, false, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
    const toAta   = getAssociatedTokenAddressSync(mint, to,   false, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);

    const ix=[];
    const toInfo = await conn.getAccountInfo(toAta);
    if(!toInfo) ix.push(createAssociatedTokenAccountInstruction(from, toAta, to, mint, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID));
    ix.push(createTransferInstruction(fromAta, toAta, from, Math.round(amount*1e6), [], TOKEN_PROGRAM_ID));

    const tx = new Transaction().add(...ix);
    tx.feePayer = from;
    const {blockhash,lastValidBlockHeight} = await conn.getLatestBlockhash();
    tx.recentBlockhash = blockhash;

    const {signature} = await adapter.signAndSendTransaction(tx);
    await conn.confirmTransaction({signature,blockhash,lastValidBlockHeight}, "confirmed");
    return signature;
  }

  // UI butonları (üstteki Solana kutusu)
  document.getElementById("btnBuySOL")?.addEventListener("click", async ()=>{
    try{
      const amt=parseFloat((document.getElementById("paySOL")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
      if(amt<=0) return alert("Geçerli SOL miktarı gir.");
      const sig=await paySOL(amt);
      alert("Success!\nTx: "+sig);
    }catch(e){ console.error(e); alert("SOL gönderimi başarısız."); }
  });
  document.getElementById("btnBuyUSDT")?.addEventListener("click", async ()=>{
    try{
      const sig=await payUSDT(25); // örnek: sabit 25 USDT
      alert("Success!\nTx: "+sig);
    }catch(e){ console.error(e); alert("USDT gönderimi başarısız."); }
  });

  // Haftalık “Buy”’lar bilgi amaçlı
  ["buyW0","buyW1","buyW2","buyW3"].forEach(id=>{
    document.getElementById(id)?.addEventListener("click",()=>alert("Ödeme üstteki Solana kutusundan yapılır."));
  });
})();
