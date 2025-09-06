/* app.v1.js — görsel ve sayaç başlangıcı */

const CONFIG = {
  // ISO örnek: 2025-11-05T13:00:00+03:00
  launchAtISO: "2025-11-05T13:00:00+03:00",
};

(function initHeroImage(){
  const el = document.getElementById("zuzuLogo");
  if (!el) return;
  const candidates = [
    "assets/images/branding/zuzu-hero.png",
    "assets/images/branding/zuzu-logo.png",
    "assets/images/branding/logo.png",
    "assets/images/zuzu.webp",
    "assets/images/zuzu.jpg"
  ];
  let i=0;
  function tryNext(){ if (i>=candidates.length) return; el.src=candidates[i++]; el.onerror=tryNext; }
  tryNext();
})();

(function countdown(){
  const target = Date.parse(CONFIG.launchAtISO);
  if (!isFinite(target)) return;
  const ids = ["cdDays","cdHours","cdMins","cdSecs"];
  function pad(n){return n.toString().padStart(2,"0");}
  function tick(){
    const left = Math.max(0, target - Date.now());
    const d = Math.floor(left/86400000);
    const h = Math.floor((left%86400000)/3600000);
    const m = Math.floor((left%3600000)/60000);
    const s = Math.floor((left%60000)/1000);
    [d,h,m,s].forEach((v,i)=>{
      const el = document.getElementById(ids[i]); if (el) el.textContent = pad(v);
    });
  }
  tick(); setInterval(tick,1000);
})();

/* Connect butonu metin güncellemesi — sadece var ise */
(function wireConnectButton(){
  const btn = document.getElementById("connectBtn");
  if (!btn) return;
  // solana.v1.js içinde window.ZUZU_SOL.onStatus(fn) çağırılacak
  if (window.ZUZU_SOL && window.ZUZU_SOL.onStatus){
    window.ZUZU_SOL.onStatus(({connected,short})=>{
      btn.textContent = connected ? short : (document.documentElement.lang==="en"?"Connect Wallet":"Cüzdan Bağla");
    });
  }
})();
