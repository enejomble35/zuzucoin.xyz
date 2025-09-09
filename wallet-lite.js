/* Lightweight Solana wallet modal (Phantom, Solflare, Backpack)
   - Web + mobil: önce provider varsa direkt bağlanır, yoksa deeplink
   - Bağlanınca Connect Wallet butonunda kısa adres gösterir
   - Buy intent varsa cüzdan açıldıktan sonra açıklama alert’i verir (demo)
*/

(function(){
  const modal = $("#walletModal");
  const closeB = $("#wmClose");
  const bPh = $("#wPhantom"), bSf = $("#wSolflare"), bBp = $("#wBackpack");
  const connectBtn = $("#connectBtn");
  let pubkey = null;

  function show(){ modal.classList.add("show"); modal.setAttribute("aria-hidden","false"); }
  function hide(){ modal.classList.remove("show"); modal.setAttribute("aria-hidden","true"); }

  function setConnected(pk){
    pubkey = pk;
    window.__zuzu_pk = () => pk;
    if (connectBtn){
      connectBtn.textContent = pk.slice(0,4)+"…"+pk.slice(-4);
      connectBtn.classList.remove("btn-primary");
      connectBtn.classList.add("btn-ghost");
    }
    hide();
  }

  window.openWalletModal = show;
  closeB?.addEventListener("click", hide);
  modal?.querySelector(".wallet-backdrop")?.addEventListener("click", hide);

  // Otomatik: önceden bağlandıysa bağlan
  window.addEventListener("load", async ()=>{
    try{
      if (window.solana?.isPhantom){
        const res = await window.solana.connect({ onlyIfTrusted:true });
        if (res?.publicKey) return setConnected(res.publicKey.toString());
      }
    }catch(e){}
    // Diğer cüzdanlar sessiz geçilir
  });

  // Ortak bağlan
  async function connect(provider){
    try{
      const res = await provider.connect();
      const pk = (res?.publicKey?.toString?.()) || res?.publicKey || res;
      if (pk) return setConnected(String(pk));
    }catch(e){
      // mobil deeplink fallback
      deeplink(provider);
    }
  }

  // Deeplink’ler
  function deeplink(provider){
    const url = location.href.split('#')[0];
    if (provider?.isPhantom || provider?.phantom) {
      const link = "https://phantom.app/ul/v1/connect?" +
        "app_url="+encodeURIComponent("https://zuzucoin.xyz")+
        "&dapp_encryption_public_key=&cluster=solana"+
        "&redirect_link="+encodeURIComponent(url+"#connected");
      location.href = link;
      return;
    }
    if (provider?.solflare || provider?.isSolflare){
      const link = "https://solflare.com/ul/v1/connect?redirect_link="+encodeURIComponent(url+"#connected");
      location.href = link; return;
    }
    // Backpack
    const link = "https://backpack.app/ul/v1/connect?redirect_link="+encodeURIComponent(url+"#connected");
    location.href = link;
  }

  // Butonlar
  bPh?.addEventListener("click", ()=> {
    const p = window.solana || window.phantom?.solana || {};
    p.isPhantom = p.isPhantom || true;
    connect(p);
  });
  bSf?.addEventListener("click", ()=> {
    const p = window.solflare || {};
    p.isSolflare = true;
    connect(p);
  });
  bBp?.addEventListener("click", ()=> {
    const p = window.backpack || {};
    p.isBackpack = true;
    connect(p);
  });

  // Connect Wallet ana butonu
  connectBtn?.addEventListener("click", show);

  // Deeplink dönüşünde hash kontrol
  if (location.hash.includes("connected")) {
    // Çoğu cüzdan dönüşte provider’ı enjekte eder; kısa bir dene
    setTimeout(async ()=>{
      try{
        if (window.solana?.isPhantom){
          const r = await window.solana.connect({ onlyIfTrusted:true });
          if (r?.publicKey) return setConnected(r.publicKey.toString());
        }
      }catch(e){}
    }, 400);
  }

  // Demo satın alma yönlendirmesi
  window.addEventListener("hashchange", ()=>{ /* sessiz */ });
  window.addEventListener("focus", ()=>{
    // Kullanıcı cüzdandan geri döndüyse ve buy intent varsa — gerçek on-chain burada uygulanır
    if (window.__zuzu_buy_intent && pubkey){
      const {amount, pay} = window.__zuzu_buy_intent;
      alert(`Demo\n\nWallet: ${pubkey}\nAmount: ${amount} ZUZU\nPayment: ${pay}\n\nOn-chain transfer eklemek için SPL/Solana SDK ile işlem yazılmalı.`);
      window.__zuzu_buy_intent = null;
    }
  });
})();
