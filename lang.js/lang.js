/* lang/lang.js — TR/EN/FR/PT/RU bayraklı; null güvenli */
(function () {
  const SUPPORTED = ["tr","en","fr","pt","ru"];
  const NAMES = { tr:"Türkçe", en:"English", fr:"Français", pt:"Português", ru:"Русский" };
  const FLAGS = {
    tr:"assets/flags/tr.png",
    en:"assets/flags/en.png",
    fr:"assets/flags/fr.png",
    pt:"assets/flags/pt.png",
    ru:"assets/flags/ru.png"
  };

  // Eski i18n ile çakışmayı önle
  try { if (window.applyLang) window.applyLang = function(){}; } catch(e){}

  let cur = (localStorage.getItem("zuzu_lang") || navigator.language || "tr").slice(0,2).toLowerCase();
  if (!SUPPORTED.includes(cur)) cur = "tr";
  const cache = {};

  async function load(code){
    if (cache[code]) return cache[code];
    const r = await fetch(`lang/${code}.json?v=2`, {cache:"no-store"});
    cache[code] = await r.json();
    return cache[code];
  }

  function apply(dict){
    const nodes = document.querySelectorAll ? document.querySelectorAll("[data-i18n]") : [];
    nodes.forEach(el=>{
      const k = el.getAttribute("data-i18n");
      if (dict && dict[k]) el.innerHTML = dict[k];
    });
    document.documentElement.lang = cur;
  }

  async function setLang(code){
    if (!SUPPORTED.includes(code)) return;
    cur = code; localStorage.setItem("zuzu_lang", code);
    apply(await load(code));
  }

  function mountFlags(){
    const bar = document.getElementById("lang-select");
    if (!bar) return;
    bar.className = "lang-flags";
    bar.innerHTML = SUPPORTED.map(c =>
      `<button class="flag-btn" data-lang="${c}" title="${NAMES[c]}">
         <img src="${FLAGS[c]}" alt="${c}">
       </button>`).join("");
    bar.addEventListener("click", e=>{
      const btn = e.target.closest(".flag-btn"); if (btn) setLang(btn.dataset.lang);
    });
  }

  function ready(fn){ document.readyState!=="loading" ? fn() : document.addEventListener("DOMContentLoaded",fn); }
  ready(async ()=>{ mountFlags(); await setLang(cur); });

  window.ZUZU_I18N = { setLang, get lang(){return cur;} };
})();
