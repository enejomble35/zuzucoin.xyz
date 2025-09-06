/* =========================
   Solana Connect — Desktop: eklenti
   Mobile: Phantom Deeplink v1 (geri dönüşle bağlanır)
========================= */
const { Connection, clusterApiUrl, PublicKey, Transaction } = solanaWeb3;
const bs58 = window.bs58;

/* ---------- Global UI refs ---------- */
const $btnConnect = document.getElementById("btnConnect");
const $btnDisconnect = document.getElementById("btnDisconnect");
const $status = document.getElementById("statusTxt");
const $walletTxt = document.getElementById("walletTxt");

/* ---------- State ---------- */
let SOL_CONN = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
let CONNECTED_PUBKEY = null;

/* ---------- Helpers ---------- */
function setStatus(msg){ if($status) $status.textContent = msg; }
function setWallet(pkStr){
  CONNECTED_PUBKEY = pkStr ? new PublicKey(pkStr) : null;
  if($walletTxt) $walletTxt.textContent = pkStr ? (pkStr.slice(0,6)+"..."+pkStr.slice(-4)) : "Not connected";
  if($btnDisconnect) $btnDisconnect.disabled = !pkStr;
}

/* ---------- Desktop connect (extension) ---------- */
async function connectDesktop(){
  const p = window?.solana;
  if(!p || (!p.isPhantom && !p.isBackpack && !p.isSolflare)){
    // eklenti yok → mobile akışını deneriz
    return false;
  }
  try{
    const res = await p.connect({ onlyIfTrusted:false });
    setWallet(res.publicKey.toString());
    setStatus("Bağlandı");
    document.getElementById("connectBtn")?.classList.add("z-connected");
    return true;
  }catch(e){
    console.warn(e);
    setStatus("Bağlantı reddedildi");
    return false;
  }
}

/* ---------- Phantom Deeplink v1 (mobile) ---------- */
/* Kaynak: https://docs.phantom.app/integrating/deeplinks-ios-and-android/establishing-a-connection */
function phantomDeepLinkConnect(){
  const appUrl = location.origin;
  const redirect = location.origin + location.pathname + "?phantom_callback=1";
  // Ephemeral keypair
  const eph = nacl.box.keyPair();
  const dappPubkeyB58 = bs58.encode(eph.publicKey);
  // state'i sakla (private key)
  localStorage.setItem("zuzu_phantom_eph", bs58.encode(eph.secretKey));

  const url = new URL("https://phantom.app/ul/v1/connect");
  url.searchParams.set("app_url", appUrl);
  url.searchParams.set("dapp_encryption_public_key", dappPubkeyB58);
  url.searchParams.set("cluster", "mainnet-beta");
  url.searchParams.set("redirect_link", redirect);

  // mobilde uygulamaya at
  window.location.href = url.toString();
}

/* Geri dönüşü yakala ve publicKey’i çıkar */
function handlePhantomCallbackIfAny(){
  const qp = new URLSearchParams(window.location.search);
  if(!qp.get("phantom_callback")) return;

  const encPubKeyB58 = qp.get("phantom_encryption_public_key");
  const nonceB58 = qp.get("nonce");
  const dataB58 = qp.get("data");
  const error = qp.get("errorCode");

  if(error){
    setStatus("Bağlantı iptal edildi");
    // temizle
    qp.delete("phantom_callback"); qp.delete("errorCode");
    history.replaceState({}, "", location.pathname);
    return;
  }

  try{
    const ephSk = bs58.decode(localStorage.getItem("zuzu_phantom_eph")||"");
    const walletPub = bs58.decode(encPubKeyB58);
    const sharedSecret = nacl.box.before(walletPub, ephSk);
    const decrypted = nacl.box.open.after(
      bs58.decode(dataB58),
      bs58.decode(nonceB58),
      sharedSecret
    );
    const payload = JSON.parse(new TextDecoder().decode(decrypted));
    // payload.public_key → base58
    const pk = payload.public_key;
    setWallet(pk);
    setStatus("Bağlandı (Phantom mobile)");
  }catch(e){
    console.error("Phantom callback parse error", e);
    setStatus("Bağlantı hatası");
  }finally{
    // URL'i temizle
    const clean = location.pathname;
    history.replaceState({}, "", clean);
    localStorage.removeItem("zuzu_phantom_eph");
  }
}

/* ---------- Disconnect ---------- */
function disconnectAll(){
  try{ window?.solana?.disconnect?.(); }catch(_){}
  setWallet(null);
  setStatus("Hazır (cüzdan bekleniyor)");
}

/* ---------- Bindings ---------- */
$btnConnect?.addEventListener("click", async ()=>{
  setStatus("Bağlanılıyor…");
  // 1) Masaüstü eklentisi varsa doğrudan bağla
  const ok = await connectDesktop();
  if(ok) return;
  // 2) Mobil — Phantom deeplink v1 ile (onay → geri dönüş)
  phantomDeepLinkConnect();
});

$btnDisconnect?.addEventListener("click", disconnectAll);

/* ---------- Sayfa açılışında callback kontrol ---------- */
handlePhantomCallbackIfAny();

/* ---------- Basit satın al (ileride tamamlanacak) ----------
   Not: SPL-USDT ile ödeme & SOL ile ödeme akışları ayrı imzalar ister.
   Bağlantı akışı tamam; ödeme için signAndSendTransaction
   extension tarafında yapılacaktır.
----------------------------------------------------------- */
