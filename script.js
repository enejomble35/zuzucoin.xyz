/* === Language packs (EN/TR/FR/RU/PL) === */
const I = window.I || {
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
      road_lead:"Clear plan focused on community, staking, NFT drops, listings.",
      invite_t:"Invite & Earn", invite_p:"Share your personal link. When friends buy, you both win extra ZUZU.", invite_btn:"Copy my invite link" },
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
      road_lead:"Topluluk, staking, NFT drop’ları ve listelemelere odaklı plan.",
      invite_t:"Davet Et & Kazan", invite_p:"Kişisel linkini paylaş. Arkadaşların aldıkça ikiniz de ekstra ZUZU kazanırsınız.", invite_btn:"Davet linkimi kopyala"},
  fr:{/* …diğer anahtarları İngilizceyle aynı tut */ invite_t:"Inviter & Gagner", invite_p:"Partagez votre lien personnel…", invite_btn:"Copier mon lien"},
  ru:{/* kısaltılmış */ invite_t:"Пригласи и заработай", invite_p:"Делись персональной ссылкой…", invite_btn:"Скопировать ссылку"},
  pl:{/* kısaltılmış */ invite_t:"Zaproś i Zarabiaj", invite_p:"Udostępnij swój link…", invite_btn:"Kopiuj mój link"}
};

function applyLang(lang){
  const pack = I[lang] || I.en;
  document.querySelectorAll("[data-i]").forEach(el=>{
    const k = el.getAttribute("data-i");
    if (pack[k]) el.innerHTML = pack[k];
  });
  // aktif bayrak işareti
  document.querySelectorAll(".lang-flag").forEach(f=>f.classList.toggle("active", f.dataset.lang===lang));
  localStorage.setItem("zuzu_lang", lang);
}

(function initLang(){
  // dropdown tıklaması
  document.getElementById("langMenu")?.addEventListener("click",(e)=>{
    const li = e.target.closest(".lang-flag");
    if(!li) return;
    applyLang(li.dataset.lang);
  });
  // ilk yükleme
  applyLang(localStorage.getItem("zuzu_lang") || "en");
})();

/* === Countdown === */
const CONFIG = window.CONFIG || {};
function tick(){
  const left = Math.max(0, (CONFIG.launchAt|| (Date.now()+50*864e5)) - Date.now());
  const d = Math.floor(left/864e5), h = Math.floor((left%864e5)/36e5), m = Math.floor((left%36e5)/6e4), s = Math.floor((left%6e4)/1e3);
  const pad = (n)=>String(n).padStart(2,"0");
  [["cdDays",d],["cdHours",h],["cdMins",m],["cdSecs",s]].forEach(([id,v])=>{
    const el = document.getElementById(id); if (el) el.textContent = pad(v);
  });
}
setInterval(tick,1000); tick();

/* === NFT grid (maskot görselleri) === */
(function renderNFTs(){
  const list = (CONFIG.nfts||[]); const g = document.getElementById("nftGrid"); if(!g) return;
  g.innerHTML = list.map(n=>`
    <div class="nft">
      <img src="assets/images/mask/${n.id}.png"
           onerror="this.src='assets/images/branding/zuzu-logo.png'"
           alt="${n.name}">
      <div class="meta"><div><b>${n.name}</b><div style="color:#9fb6e6">${n.rarity}</div></div><span class="tag">${n.supply.toLocaleString()}</span></div>
    </div>`).join("");
})();

/* === Invite / Referans === */
(function invite(){
  const box = document.getElementById("inviteBox"); if(!box) return;
  const code = localStorage.getItem("zuzu_ref") ||
               localStorage.getItem("zuzu_pk") ||   // cüzdan adresi varsa onu kullan
               (Math.random().toString(36).slice(2,8).toUpperCase());
  localStorage.setItem("zuzu_ref", code);

  const link = `${location.origin}${location.pathname}?ref=${encodeURIComponent(code)}`;
  const out  = document.getElementById("inviteLink");
  const btn  = document.getElementById("inviteCopy");
  out.value = link;
  btn.addEventListener("click", async ()=>{
    try{ await navigator.clipboard.writeText(link); btn.textContent = "Copied!"; setTimeout(()=>btn.textContent=I[(localStorage.getItem("zuzu_lang")||"en")].invite_btn,1200);}catch{}
  });

  // Birinin linkiyle geldiyse kaydet
  const qp = new URLSearchParams(location.search);
  const from = qp.get("ref");
  if (from) localStorage.setItem("zuzu_referred_by", from);
})();
