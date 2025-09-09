/* Phantom Deep-Link Connect (mobile) */
(function () {
  const bs58 = window.bs58, nacl = window.nacl;
  if (!bs58 || !nacl) { console.warn("deps missing"); return; }

  const LS = {
    DAPP_SK: "ph_dapp_sk_b58",
    SESSION: "ph_session_b58",
    ADDR: "ph_addr_b58",
  };
  function short(pk){ return pk.slice(0,4)+"..."+pk.slice(-4); }
  function setConnected(addr){
    try{ localStorage.setItem(LS.ADDR, addr); }catch{}
    const btn = document.getElementById("connectBtn");
    if (btn){ btn.textContent = short(addr); btn.classList.add("connected"); btn.dataset.address = addr; }
    document.querySelector(".wallet-modal")?.remove();
  }

  function openConnect() {
    const kp = nacl.box.keyPair();
    const dappPkB58 = bs58.encode(kp.publicKey);
    const dappSkB58 = bs58.encode(kp.secretKey);
    try{ localStorage.setItem(LS.DAPP_SK, dappSkB58); }catch{}

    const appUrl = "https://zuzucoin.xyz";
    const redirect = window.location.href.split('#')[0].split('?')[0];
    const url =
      "https://phantom.app/ul/v1/connect" +
      "?app_url=" + encodeURIComponent(appUrl) +
      "&dapp_encryption_public_key=" + encodeURIComponent(dappPkB58) +
      "&redirect_link=" + encodeURIComponent(redirect) +
      "&cluster=mainnet-beta";

    const a = document.createElement("a"); a.href = url; a.rel="noopener"; document.body.appendChild(a); a.click(); a.remove();
  }

  function handleReturn() {
    const q = new URLSearchParams(location.search);
    const epk = q.get("phantom_encryption_public_key");
    const data = q.get("data");
    const nonce = q.get("nonce");
    const err = q.get("errorCode");
    if (err){ history.replaceState({}, "", location.pathname); return; }
    if (!epk || !data || !nonce) return;
    try{
      const dappSkB58 = localStorage.getItem(LS.DAPP_SK);
      if (!dappSkB58) throw new Error("missing dapp sk");
      const shared = nacl.box.before(bs58.decode(epk), bs58.decode(dappSkB58));
      const dec = nacl.box.open.after(bs58.decode(data), bs58.decode(nonce), shared);
      if (!dec) throw new Error("decrypt fail");
      const payload = JSON.parse(new TextDecoder().decode(dec)); // { public_key, session }
      try{ localStorage.setItem(LS.SESSION, payload.session); }catch{}
      setConnected(payload.public_key);
    }catch(e){
      console.warn("phantom parse fail", e);
      alert("Wallet script couldn’t be loaded. Please refresh.");
    }finally{
      history.replaceState({}, "", location.pathname);
      try{ localStorage.removeItem(LS.DAPP_SK); }catch{}
    }
  }

  function restore(){
    const addr = localStorage.getItem(LS.ADDR);
    if (addr) setConnected(addr);
  }

  window.ZUZU_PHANTOM = { openConnect, restore, handleReturn };
  window.addEventListener("load", ()=>{ handleReturn(); restore(); });
  document.addEventListener("visibilitychange", ()=>{ if (document.visibilityState==="visible") restore(); });
})();
