/* =========================
   Solana Connect + Satın Al (SOL)
   Desktop: eklenti ile bağlanır ve işlem imzalatır.
   Mobile: Phantom deeplink v1 — onaydan sonra tarayıcıya geri döner.
========================= */
const { Connection, PublicKey, SystemProgram, LAMPORTS_PER_SOL } = solanaWeb3;
const bs58 = window.bs58;

const $btnConnect = document.getElementById("btnConnect");
const $btnDisconnect = document.getElementById("btnDisconnect");
const $status = document.getElementById("statusTxt");
const $walletTxt = document.getElementById("walletTxt");

let RPC = new Connection("https://api.mainnet-beta.solana.com","confirmed");
let CURRENT_PUBKEY = null;

/* ---------- helpers ---------- */
function setStatus(t){ if($status) $status.textContent=t; }
function setWallet(pk){
  CURRENT_PUBKEY = pk ? new PublicKey(pk) : null;
  $walletTxt.textContent = pk ? (pk.slice(0,6)+"..."+pk.slice(-4)) : "Not connected";
  $btnDisconnect.disabled = !pk;
  // buy butonlarını aç/kapat
  document.querySelectorAll(".buyBtn").forEach(b=> b.disabled = !pk);
}

/* ---------- desktop extension connect ---------- */
async function connectDesktop(){
  const w=window.solana;
  if(!w || (!w.isPhantom && !w.isSolflare && !w.isBackpack)) return false;
  try{
    const res = await w.connect({ onlyIfTrusted:false });
    setWallet(res.publicKey.toString());
    setStatus("Bağlandı");
    return true;
  }catch(e){ console.warn(e); setStatus("Bağlantı reddedildi"); return false; }
}

/* ---------- phantom deeplink connect (mobile) ---------- */
function phantomDeepLinkConnect(){
  const appUrl = location.origin;
  const redirect = location.origin + location.pathname + "?phantom_callback=1";
  const eph = nacl.box.keyPair();
  const ephPubB58 = bs58.encode(eph.publicKey);
  localStorage.setItem("zuzu_phantom_eph", bs58.encode(eph.secretKey));

  const url = new URL("https://phantom.app/ul/v1/connect");
  url.searchParams.set("app_url", appUrl);
  url.searchParams.set("dapp_encryption_public_key", ephPubB58);
  url.searchParams.set("cluster","mainnet-beta");
  url.searchParams.set("redirect_link", redirect);
  window.location.href = url.toString();
}

function handlePhantomCallbackIfAny(){
  const q=new URLSearchParams(location.search);
  if(!q.get("phantom_callback")) return;
  const encB58=q.get("phantom_encryption_public_key");
  const nonceB58=q.get("nonce");
  const dataB58=q.get("data");
  const err=q.get("errorCode");
  if(err){ setStatus("Bağlantı iptal edildi"); history.replaceState({}, "", location.pathname); return; }

  try{
    const ephSk=bs58.decode(localStorage.getItem("zuzu_phantom_eph")||"");
    const walletPub=bs58.decode(encB58);
    const shared=nacl.box.before(walletPub, ephSk);
    const decrypted=nacl.box.open.after(
      bs58.decode(dataB58), bs58.decode(nonceB58), shared
    );
    const payload=JSON.parse(new TextDecoder().decode(decrypted));
    const pk=payload.public_key;
    setWallet(pk);
    setStatus("Bağlandı (Phantom mobile)");
  }catch(e){ console.error(e); setStatus("Bağlantı hatası"); }
  finally{
    history.replaceState({}, "", location.pathname);
    localStorage.removeItem("zuzu_phantom_eph");
  }
}

/* ---------- disconnect ---------- */
function disconnectAll(){ try{window?.solana?.disconnect?.();}catch(_){} setWallet(null); setStatus("Hazır (cüzdan bekleniyor)"); }

/* ---------- buy with SOL (both desktop + mobile-injected) ---------- */
async function buyWithSOL(week){
  if(!CURRENT_PUBKEY){ alert("Önce cüzdan bağla."); return; }
  const qty = parseFloat((document.getElementById("buyAmount")?.value||"0").toString().replace(/[^\d.]/g,""))||0;
  if(qty<=0){ alert("Geçerli miktar gir."); return; }

  // USDT fiyatını SOL'a çevir
  const usdtPrice = ZUZU_CONFIG.weekPrices[week];
  const solPerUsdt = ZUZU_CONFIG.usdToSol;
  const paySol = qty * usdtPrice * solPerUsdt;

  const lamports = Math.floor(paySol * LAMPORTS_PER_SOL);
  const ix = SystemProgram.transfer({
    fromPubkey: CURRENT_PUBKEY,
    toPubkey: new PublicKey(ZUZU_CONFIG.ownerSol),
    lamports
  });

  const tx = new solanaWeb3.Transaction().add(ix);
  tx.feePayer = CURRENT_PUBKEY;
  tx.recentBlockhash = (await RPC.getLatestBlockhash()).blockhash;

  const provider = window.solana;
  if(provider && (provider.isPhantom || provider.isSolflare || provider.isBackpack)){
    try{
      const { signature } = await provider.signAndSendTransaction(tx);
      setStatus("Satın alım gönderildi: "+signature.slice(0,10)+"…");
      alert("Satın alım gönderildi.\nTX: "+signature);
    }catch(e){
      console.error(e); alert("İşlem iptal edildi veya hata oluştu.");
    }
  }else{
    alert("Mobil tarayıcıda işlem imzalama için cüzdanın içinden açman gerekir.");
  }
}

/* ---------- events ---------- */
$btnConnect?.addEventListener("click", async ()=>{
  setStatus("Bağlanılıyor…");
  const ok = await connectDesktop();
  if(ok) return;
  phantomDeepLinkConnect();
});
$btnDisconnect?.addEventListener("click", disconnectAll);

// Buy buttons
document.querySelectorAll(".buyBtn").forEach(btn=>{
  btn.addEventListener("click", ()=> buyWithSOL(parseInt(btn.dataset.week,10)||0));
});

// handle phantom callback on load
handlePhantomCallbackIfAny();
