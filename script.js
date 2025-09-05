(function(){
  // ------- CONFIG -------
  var CONFIG = {
    contractAddress: "0xF2bbbEcB417725813BF5E940d678793fACDa9729",
    collectionUrl: "https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a/contract/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts",
    treasurySolana: "31Cjkx2PA5oMapNxxGAiZhuHDcvAyQ7hogqB8Hx6f1pW",
    // ✅ Hedef tarih (Türkiye saati): 5 Kasım 2025 13:00
    launchAtISO: "2025-11-05T13:00:00+03:00",
    weekPrices: [0.0050,0.0065,0.0080,0.0100],
    nfts: [
      {id:0,name:"ZUZU Hero",rarity:"Epic",supply:200},
      {id:1,name:"ZUZU Rogue",rarity:"Rare",supply:2500},
      {id:2,name:"ZUZU Berserker",rarity:"Epic",supply:800},
      {id:3,name:"ZUZU Hacker",rarity:"Rare",supply:600},
      {id:4,name:"ZUZU Sorceress",rarity:"Epic",supply:750},
      {id:5,name:"ZUZU Warrior",rarity:"Rare",supply:900},
      {id:6,name:"ZUZU Maiden",rarity:"Rare",supply:1100},
      {id:7,name:"ZUZU Ranger",rarity:"Rare",supply:1000},
      {id:8,name:"ZUZU Scientist",rarity:"Epic",supply:1100},
      {id:9,name:"ZUZU Titan",rarity:"Legendary",supply:250}
    ]
  };
  window.CONFIG = CONFIG; // solana.js kullanıyor

  // ------- i18n (sadece en->tr anahtarları) -------
  var I = {
    en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
      hero_lead:"Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high <b>utility</b>.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",collection_page:"Collection Page",contract:"Contract:",
      days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",amount:"Amount (ZUZU)",
      w1:"Week 1 (Cheapest)",w2:"Week 2",w3:"Week 3",w4:"Week 4 (Last Chance)",cost:"Cost:",buy:"Buy",exchanges:"Supported Exchanges"},
    tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",
      hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",collection_page:"Koleksiyon Sayfası",contract:"Kontrat:",
      days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",amount:"Miktar (ZUZU)",
      w1:"1. Hafta (En Ucuz)",w2:"2. Hafta",w3:"3. Hafta",w4:"4. Hafta (Son Fırsat)",cost:"Maliyet:",buy:"Satın Al",exchanges:"Desteklenen Borsalar"}
  };
  function applyLang(lang){
    try{
      var nodes=document.querySelectorAll("[data-i]");
      for(var i=0;i<nodes.length;i++){
        var k=nodes[i].getAttribute("data-i");
        if(I[lang]&&I[lang][k]) nodes[i].innerHTML=I[lang][k];
      }
    }catch(e){}
  }

  // ------- Countdown (ES5) -------
  var DAY=86400000;
  var LAUNCH_AT=(function(){
    try{
      // launchAtISO varsa localStorage'ı yok say
      return new Date(CONFIG.launchAtISO).getTime();
    }catch(e){ return Date.now()+50*DAY; }
  })();
  function tick(){
    try{
      var left=Math.max(0, LAUNCH_AT - Date.now());
      var d=Math.floor(left/DAY);
      var h=Math.floor((left%DAY)/3600000);
      var m=Math.floor((left%3600000)/60000);
      var s=Math.floor((left%60000)/1000);
      function pad(n){ n=String(n); return n.length<2?("0"+n):n; }
      var ids=["cdDays","cdHours","cdMins","cdSecs"], vals=[d,h,m,s];
      for(var i=0;i<4;i++){ var el=document.getElementById(ids[i]); if(el) el.textContent=pad(vals[i]); }
    }catch(e){}
  }

  // ------- Presale aktif hafta & maliyet -------
  var SALE_START = Date.now(); // ilk deploy anı
  function getActiveWeek(){
    var days=Math.floor((Date.now()-SALE_START)/DAY);
    return days<7?0:days<14?1:days<21?2:3;
  }
  function updateActiveWeekUI(){
    var w=getActiveWeek();
    for(var i=0;i<4;i++){
      var b=document.getElementById("buyW"+i);
      if(!b) continue;
      if(i===w){ b.disabled=false; b.className+=" active-week"; }
      else { b.disabled=true; b.className=b.className.replace(" active-week",""); }
    }
  }
  function updateCosts(){
    try{
      var inp=document.getElementById("buyAmount");
      var qty = inp ? parseFloat(String(inp.value).replace(/[^\d.]/g,""))||0 : 0;
      for(var i=0;i<CONFIG.weekPrices.length;i++){
        var p=CONFIG.weekPrices[i], cost=qty*p;
        var pe=document.getElementById("p"+i), ce=document.getElementById("c"+i);
        if(pe) pe.textContent=p.toFixed(4);
        if(ce) ce.textContent=isFinite(cost)?cost.toLocaleString():0;
      }
    }catch(e){}
  }

  // ------- NFT Grid -------
  function renderNFTs(){
    try{
      var g=document.getElementById("nftGrid"); if(!g) return;
      var html="";
      for(var i=0;i<CONFIG.nfts.length;i++){
        var n=CONFIG.nfts[i];
        var img="assets/images/mask/"+n.id+".png";
        var link=CONFIG.collectionUrl+"?tokenId="+n.id;
        html+= '<div class="nft">'
          + '<img src="'+img+'" alt="'+n.name+'" loading="lazy" '
          + 'style="aspect-ratio:1/1;object-fit:contain;background:#0f1a30;padding:8px;border-bottom:1px solid #1d2d50" '
          + 'onerror="this.style.display=\'none\'">'
          + '<div class="meta"><div><b>'+n.name+'</b>'
          + '<div style="color:#9fb6e6;font-size:.9rem">Supply: '+n.supply.toLocaleString()+'</div>'
          + '</div><span class="tag">'+n.rarity+'</span></div>'
          + '<a class="z-btn z-btn-ghost" style="margin:0 10px 10px" href="'+link+'" target="_blank" rel="noopener">View ↗</a>'
          + '</div>';
      }
      g.innerHTML=html;
    }catch(e){}
  }

  // ------- Haftalık buy → USDT alanını doldur -------
  function handleWeekClick(i){
    var qty=parseFloat(String((document.getElementById("buyAmount")||{}).value||"0").replace(/[^\d.]/g,""))||0;
    if(qty<=0) return alert("Enter a valid ZUZU amount.");
    if(i!==getActiveWeek()) return alert("This week is not active.");
    var cost=qty*CONFIG.weekPrices[i];
    var u=document.getElementById("usdtAmount"); if(u) u.value=cost.toFixed(2);
    var us=document.getElementById("btnBuyUSDT"); if(us){ us.className+=" pulse"; setTimeout(function(){ us.className=us.className.replace(" pulse",""); },1200); }
    var box=document.getElementById("solanaWalletBox"); if(box && box.scrollIntoView) box.scrollIntoView({behavior:"smooth",block:"center"});
  }

  // ------- Referral -------
  function referralInit(){
    try{
      var u=new URL(window.location.href); var ref=u.searchParams.get("ref");
      if(ref) localStorage.setItem("zuzu_ref", ref);
      var who=localStorage.getItem("zuzu_ref");
      var note=document.getElementById("refYouWereInvited");
      if(note && who){ note.style.display="block"; note.textContent="Invited by: "+who.slice(0,4)+"..."+who.slice(-4); }
    }catch(e){}
  }
  window.__zuzuSetReferral=function(addr){
    var input=document.getElementById("refLink"); if(!input) return;
    var base=location.origin+location.pathname;
    input.value=base+"?ref="+encodeURIComponent(addr);
  };
  window.__zuzuSetConnectLabel=function(t){ var b=document.getElementById("connectBtn"); if(b&&t) b.textContent=t; };

  // ------- Boot -------
  function boot(){
    try{
      // dil
      var sel=document.getElementById("langSel");
      if(sel){ sel.addEventListener("change", function(){ applyLang(sel.value||"en"); }); }
      applyLang("en");

      // sayaç
      tick(); setInterval(tick,1000);

      // aktif hafta & maliyet
      updateActiveWeekUI();
      var buyAmount=document.getElementById("buyAmount");
      if(buyAmount) buyAmount.addEventListener("input", updateCosts);
      updateCosts();

      // nft
      renderNFTs();

      // connect butonu
      var cb=document.getElementById("connectBtn");
      if(cb){ cb.addEventListener("click", function(){ 
        if (typeof window.__zuzuSolanaConnect === "function") window.__zuzuSolanaConnect();
        else alert("Loading Solana wallet… please wait a moment and try again.");
      }); }

      // haftalık buy
      var ids=["buyW0","buyW1","buyW2","buyW3"];
      for(var i=0;i<ids.length;i++){ (function(ix){ var b=document.getElementById(ids[ix]); if(b) b.onclick=function(){handleWeekClick(ix);}; })(i); }

      // EVM kutusunu gizle
      var ns=document.getElementById("networkSel");
      if(ns && ns.closest){ var card=ns.closest(".card"); if(card) card.style.display="none"; }

      referralInit();
    }catch(e){}
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
