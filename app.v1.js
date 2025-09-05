(function(){
  var CONFIG = {
    contractAddress: "0xF2bbbEcB417725813BF5E940d678793fACDa9729",
    collectionUrl: "https://thirdweb.com/team/enejomble35/Zuzu-Maskot-Drop-28b60a/contract/polygon/0xF2bbbEcB417725813BF5E940d678793fACDa9729/nfts",
    treasurySolana: "31Cjkx2PA5oMapNxxGAiZhuHDcvAyQ7hogqB8Hx6f1pW",
    launchAtISO: "2025-11-05T13:00:00+03:00", // TRT
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
  window.CONFIG = CONFIG;

  var I = {
    en:{nav_presale:"Pre-Sale",nav_stake:"Stake",nav_nft:"NFT Rewards",nav_roadmap:"Roadmap",nav_token:"Tokenomics",connect:"Connect Wallet",
      hero_badge:"Pre-Sale • Stake to Win NFT",hero_title:"ZUZU — Robotic Hedgehog 🦔⚡",
      hero_lead:"Stake and win <b>ZUZU Maskot NFT</b>. Limited supply, high <b>utility</b>.",
      cta_stake:"Start Staking",cta_nft:"NFT Rewards",collection_page:"Collection Page",contract:"Contract:",
      days:"DAYS",hours:"HOURS",mins:"MINUTES",secs:"SECONDS",
      presale_title:"Pre-Sale — Countdown",presale_lead:"Get ready for ZUZU pre-sale! <b>Limited allocation</b>, community price.",amount:"Amount (ZUZU)",
      w1:"Week 1 (Cheapest)",w2:"Week 2",w3:"Week 3",w4:"Week 4 (Last Chance)",cost:"Cost:",buy:"Buy",exchanges:"Supported Exchanges",
      stake_title:"Stake Pro — Lock, Earn, Get NFT ✨",stake_lead:"Lock your ZUZU, earn <b>APY + NFT BOOST</b>. Early stakers get badge & airdrop priority.",
      calc_title:"Earnings Calculator",amount2:"Amount (ZUZU)",lock:"Lock Period",nft_have:"Have NFT?",early:"Early Badge",calc_btn:"Calculate",
      ret:"Total Return",avg:"Monthly Avg",boost:"Total Boost",token_title:"Tokenomics (Visualized)",road_title:"Roadmap",
      road_lead:"Clear plan focused on community, staking, NFT drops, listings."},
    tr:{nav_presale:"Ön Satış",nav_stake:"Stake",nav_nft:"NFT Ödülleri",nav_roadmap:"Yol Haritası",nav_token:"Tokonomi",connect:"Cüzdan Bağla",
      hero_badge:"Ön Satış • Stake ile NFT Kazan",hero_title:"ZUZU — Geleceğin Robotic Kirpisi 🦔⚡",
      hero_lead:"Stake et ve <b>ZUZU Maskot NFT</b> kazan. Sınırlı arz, yüksek <b>utility</b>.",
      cta_stake:"Stake Etmeye Başla",cta_nft:"NFT Ödülleri",collection_page:"Koleksiyon Sayfası",contract:"Kontrat:",
      days:"GÜN",hours:"SAAT",mins:"DAKİKA",secs:"SANİYE",
      presale_title:"Ön Satış — Geri Sayım",presale_lead:"ZUZU ön satışına hazır ol! <b>Sınırlı tahsis</b>, topluluğa özel fiyat.",amount:"Miktar (ZUZU)",
      w1:"1. Hafta (En Ucuz)",w2:"2. Hafta",w3:"3. Hafta",w4:"4. Hafta (Son Fırsat)",cost:"Maliyet:",buy:"Satın Al",exchanges:"Desteklenen Borsalar",
      stake_title:"Stake Pro — Kilitle, Kazan, NFT Kap ✨",stake_lead:"ZUZU’larını kilitle, <b>APY + NFT BOOST</b> ile pasif gelir elde et. Erken stake edenler rozet & airdrop önceliği alır.",
      calc_title:"Kazanç Hesaplayıcı",amount2:"Miktar (ZUZU)",lock:"Kilit Süresi",nft_have:"Elinde NFT var mı?",early:"Erken Rozet",calc_btn:"Hesapla",
      ret:"Toplam Getiri",avg:"Aylık Ortalama",boost:"Toplam Boost",token_title:"Tokonomi (Görselleştirilmiş)",road_title:"Yol Haritası",
      road_lead:"Topluluk, staking, NFT drop’ları ve listelemelere odaklı plan."},
    fr:{nav_presale:"Pré-vente",nav_stake:"Stake",nav_nft:"Récompenses NFT",nav_roadmap:"Feuille de route",nav_token:"Tokenomics",connect:"Connecter le Wallet",
      hero_badge:"Pré-vente • Stake pour gagner un NFT",hero_title:"ZUZU — Hérisson Robotique 🦔⚡",
      hero_lead:"Stake et gagne un <b>NFT Mascotte ZUZU</b>. Offre limitée, forte <b>utilité</b>.",
      cta_stake:"Commencer le Stake",cta_nft:"Récompenses NFT",collection_page:"Page de la Collection",contract:"Contrat :",
      days:"JOURS",hours:"HEURES",mins:"MINUTES",secs:"SECONDES",
      presale_title:"Pré-vente — Compte à rebours",presale_lead:"Prépare-toi pour la pré-vente ZUZU ! <b>Allocation limitée</b>, prix communauté.",amount:"Montant (ZUZU)",
      w1:"Semaine 1 (Moins cher)",w2:"Semaine 2",w3:"Semaine 3",w4:"Semaine 4 (Dernière chance)",cost:"Coût :",buy:"Acheter",exchanges:"Bourses prises en charge"},
    es:{nav_presale:"Pre-venta",nav_stake:"Stake",nav_nft:"Recompensas NFT",nav_roadmap:"Hoja de ruta",nav_token:"Tokenomics",connect:"Conectar Billetera",
      hero_badge:"Pre-venta • Stake para ganar NFT",hero_title:"ZUZU — Erizo Robótico 🦔⚡",
      hero_lead:"Haz stake y gana <b>NFT Mascota ZUZU</b>. Suministro limitado, gran <b>utilidad</b>.",
      cta_stake:"Empezar Stake",cta_nft:"Recompensas NFT",collection_page:"Página de Colección",contract:"Contrato:",
      days:"DÍAS",hours:"HORAS",mins:"MINUTOS",secs:"SEGUNDOS",
      presale_title:"Pre-venta — Cuenta regresiva",presale_lead:"¡Prepárate para la pre-venta ZUZU! <b>Asignación limitada</b>, precio para la comunidad.",amount:"Cantidad (ZUZU)",
      w1:"Semana 1 (Más barata)",w2:"Semana 2",w3:"Semana 3",w4:"Semana 4 (Última oportunidad)",cost:"Costo:",buy:"Comprar",exchanges:"Exchanges compatibles"}
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

  var DAY=86400000, SALE_START=Date.now();
  var LAUNCH_AT=(function(){ var t=Date.parse(CONFIG.launchAtISO); return isNaN(t)?Date.now()+50*DAY:t; })();
  function tick(){
    try{
      var left=Math.max(0, LAUNCH_AT - Date.now());
      var d=Math.floor(left/DAY), h=Math.floor((left%DAY)/3600000), m=Math.floor((left%3600000)/60000), s=Math.floor((left%60000)/1000);
      function pad(n){n=String(n);return n.length<2?("0"+n):n;}
      var ids=["cdDays","cdHours","cdMins","cdSecs"], vals=[d,h,m,s];
      for(var i=0;i<4;i++){ var el=document.getElementById(ids[i]); if(el) el.textContent=pad(vals[i]); }
    }catch(e){}
  }
  function getActiveWeek(){ var days=Math.floor((Date.now()-SALE_START)/DAY); return days<7?0:days<14?1:days<21?2:3; }
  function updateActiveWeekUI(){
    var w=getActiveWeek();
    for(var i=0;i<4;i++){
      var b=document.getElementById("buyW"+i);
      if(!b) continue;
      if(i===w){ b.disabled=false; if((" "+b.className+" ").indexOf(" active-week ")<0) b.className+=" active-week"; }
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
  function renderNFTs(){
    try{
      var g=document.getElementById("nftGrid"); if(!g) return;
      var html="";
      for(var i=0;i<CONFIG.nfts.length;i++){
        var n=CONFIG.nfts[i], img="assets/images/mask/"+n.id+".png", link=CONFIG.collectionUrl+"?tokenId="+n.id;
        html+= '<div class="nft"><img src="'+img+'" alt="'+n.name+'" loading="lazy" style="aspect-ratio:1/1;object-fit:contain;background:#0f1a30;padding:8px;border-bottom:1px solid #1d2d50" onerror="this.style.display=\'none\'"><div class="meta"><div><b>'+n.name+'</b><div style="color:#9fb6e6;font-size:.9rem">Supply: '+n.supply.toLocaleString()+'</div></div><span class="tag">'+n.rarity+'</span></div><a class="z-btn z-btn-ghost" style="margin:0 10px 10px" href="'+link+'" target="_blank" rel="noopener">View ↗</a></div>';
      }
      g.innerHTML=html;
    }catch(e){}
  }
  function handleWeekClick(i){
    var qty=parseFloat(String((document.getElementById("buyAmount")||{}).value||"0").replace(/[^\d.]/g,""))||0;
    if(qty<=0) return alert("Enter a valid ZUZU amount.");
    if(i!==getActiveWeek()) return alert("This week is not active.");
    var cost=qty*CONFIG.weekPrices[i];
    var u=document.getElementById("usdtAmount"); if(u) u.value=cost.toFixed(2);
    var us=document.getElementById("btnBuyUSDT"); if(us){ us.className+=" pulse"; setTimeout(function(){ us.className=us.className.replace(" pulse",""); },1200); }
    var box=document.getElementById("solanaWalletBox"); if(box && box.scrollIntoView) box.scrollIntoView({behavior:"smooth",block:"center"});
  }
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
  window.__zuzuSetConnectLabel=function(t){ var b=document.getElementById("connectBtn"); if(b) b.textContent=t||"Connect Wallet"; };

  function boot(){
    try{
      var sel=document.getElementById("langSel");
      if(sel){ sel.addEventListener("change", function(){ applyLang(sel.value||"en"); }); }
      applyLang("en");
      tick(); setInterval(tick,1000);
      updateActiveWeekUI();
      var bAmt=document.getElementById("buyAmount"); if(bAmt) bAmt.addEventListener("input", updateCosts);
      updateCosts(); renderNFTs();
      var cb=document.getElementById("connectBtn");
      if(cb){ cb.addEventListener("click", function(){ if (typeof window.__zuzuSolanaConnect === "function") window.__zuzuSolanaConnect(); else alert("Loading Solana wallet… please wait a moment and try again."); }); }
      var ids=["buyW0","buyW1","buyW2","buyW3"];
      for(var i=0;i<ids.length;i++){ (function(ix){ var b=document.getElementById(ids[ix]); if(b) b.onclick=function(){handleWeekClick(ix);}; })(i); }
      referralInit();
      // kontrat/link
      var c=CONFIG.contractAddress, short=c.slice(0,6)+"..."+c.slice(-4);
      var cd=document.getElementById("contractDisplay"), cd2=document.getElementById("contractDisplay2");
      if(cd) cd.textContent=short; if(cd2) cd2.textContent=c;
      var t1=document.getElementById("thirdwebNFTRoute"), t2=document.getElementById("thirdwebNFTRoute2");
      if(t1) t1.href=CONFIG.collectionUrl; if(t2) t2.href=CONFIG.collectionUrl;
    }catch(e){}
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
