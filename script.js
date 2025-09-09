/* ZUZU — site logic (counter + nft grid + stake + referral + buy UI) */
(function(){
  const $  = s=>document.querySelector(s);
  const $$ = s=>Array.from(document.querySelectorAll(s));

  // Sabit satış başlangıcı – Sıfırlanma olmasın diye sabit tarih
  const CONFIG = {
    saleStart: "2025-11-30T15:00:00Z",     // TGE/Presale start (UTC)
    priceUSDT: [0.0050,0.0065,0.0080,0.0100], // haftalara göre
    weeks: 4,
    nftImages: Array.from({length:10}, (_,i)=>`assets/images/mask/${i+1}.png`)
  };

  // Sayaç
  function tick(){
    const start = new Date(CONFIG.saleStart).getTime();
    const now = Date.now();
    const left = Math.max(0, start - now);
    const d = Math.floor(left/864e5);
    const h = Math.floor(left%864e5/36e5);
    const m = Math.floor(left%36e5/6e4);
    const s = Math.floor(left%6e4/1e3);
    const pad = n => String(n).padStart(2,"0");
    const ids = ["cdDays","cdHours","cdMins","cdSecs"];
    [d,h,m,s].forEach((v,i)=>{ const el = document.getElementById(ids[i]); if(el) el.textContent = pad(v); });
  }
  tick(); setInterval(tick,1000);

  // Aktif hafta & fiyat
  function activeWeek(){
    const start = new Date(CONFIG.saleStart).getTime();
    const passed = Math.floor((Date.now()-start)/864e5);
    if(passed < 7) return 0; if(passed<14) return 1; if(passed<21) return 2; return 3;
  }
  function currentPrice(){
    return CONFIG.priceUSDT[Math.min(activeWeek(), CONFIG.weeks-1)];
  }
  const unitPriceEl = $("#unitPrice"); if(unitPriceEl) unitPriceEl.textContent = currentPrice().toFixed(4);

  // Satın alma tahmini maliyet
  function updateCost(){
    const amt = parseFloat($("#buyAmount")?.value||"0");
    const pay = $("#paySelect")?.value||"USDT";
    const price = currentPrice();
    const cost = amt*price;
    $("#estCost").textContent = amt>0 ? `Est. cost: ${cost.toFixed(2)} ${pay}` : "";
  }
  $("#buyAmount")?.addEventListener("input", updateCost);
  $("#paySelect")?.addEventListener("change", updateCost);
  updateCost();

  // Satın al (on-chain entegrasyon yerine wallet-lite deeplink akışı kullanılıyor)
  $("#buyBtn")?.addEventListener("click", ()=>{
    const amt = parseFloat($("#buyAmount")?.value||"0");
    if(!amt || amt<10) return alert("Enter amount (min 10 ZUZU).");
    const pay = $("#paySelect")?.value || "USDT";
    const price = currentPrice();
    const est = (amt*price).toFixed(2);
    alert(`Redirecting to wallet...\nAmount: ${amt} ZUZU\nPayment: ${pay}\nEst: ${est} ${pay}\n\nApprove zuzucoin.xyz inside your wallet, you will be redirected back here.`);
    // Asıl transfer/tx imzası mobil cüzdan içindeki Dapp webview'de gerçekleşecek.
    document.getElementById("connectBtn")?.click(); // önce bağlanma modali
  });

  // Contract link (placeholder)
  $("#viewContract")?.addEventListener("click", ()=> window.open("https://solscan.io", "_blank"));

  // NFT grid
  function renderNFTs(){
    const cont = $("#nftGrid"); if(!cont) return;
    cont.innerHTML = "";
    CONFIG.nftImages.forEach((src,i)=>{
      const card = document.createElement("div");
      card.className = "nft";
      card.innerHTML = `
        <img src="${src}" alt="ZUZU #${i+1}">
        <div class="meta">
          <span>#${i+1}</span>
          <span class="tag">Maskot</span>
        </div>`;
      cont.appendChild(card);
    });
  }
  renderNFTs();

  // Stake tiers (dummy UI)
  function renderStake(){
    const g = $("#stakeGrid"); if(!g) return;
    const tiers = [
      {d:30, apy:"12%"},
      {d:90, apy:"28%"},
      {d:180, apy:"45%"},
      {d:365, apy:"70%"},
      {d:540, apy:"85%"},
    ];
    g.innerHTML = "";
    tiers.forEach(t=>{
      const el = document.createElement("div");
      el.className = "stake-card";
      el.innerHTML = `
        <div class="tier gold">${t.d} days</div>
        <div class="stat"><div class="label">Base APY</div><b>${t.apy}</b></div>
        <button class="z-btn z-btn-primary" style="margin-top:8px">Stake ${t.d}</button>`;
      g.appendChild(el);
    });
  }
  renderStake();

  // Referral
  function ensureRef(){
    const my = localStorage.getItem("zuzu_ref") || (Math.random().toString(36).slice(2,10));
    localStorage.setItem("zuzu_ref", my);
    const base = location.origin + location.pathname;
    const url = `${base}?ref=${my}`;
    const inp = $("#refLink"); if(inp){ inp.value = url; }
  }
  ensureRef();
  $("#copyRef")?.addEventListener("click", ()=>{
    const v = $("#refLink")?.value||"";
    navigator.clipboard.writeText(v).then(()=> alert("Copied!")).catch(()=>{});
  });

  // Eğer bir başkasının ref linkiyle geldiyse kaydet
  const q = new URLSearchParams(location.search);
  if(q.get("ref")) localStorage.setItem("zuzu_ref_source", q.get("ref"));
})();
