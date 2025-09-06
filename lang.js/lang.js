/* lang/lang.js */
(function () {
  const SUPPORTED = ["tr","en","fr","pt","ru"];
  const NAMES = { tr:"Türkçe", en:"English", fr:"Français", pt:"Português", ru:"Русский" };
  const FLAGS = { tr:"assets/flags/tr.png", en:"assets/flags/en.png", fr:"assets/flags/fr.png", pt:"assets/flags/pt.png", ru:"assets/flags/ru.png" };

  let cur = (localStorage.getItem("zuzu_lang") || navigator.language || "tr").slice(0,2).toLowerCase();
  if (!SUPPORTED.includes(cur)) cur = "tr";

  const cache = {};
  const $bar = document.getElementById("lang-select");

  // bayrakları çiz
  if ($bar) {
    $bar.classList.add("lang-flags");
    $bar.innerHTML = SUPPORTED.map(c => `
      <button class="flag-btn" data-lang="${c}" title="${NAMES[c]}">
        <img src="${FLAGS[c]}" alt="${c}">
      </button>`).join("");
    $bar.addEventListener("click",(e)=>{
      const btn=e.target.closest(".flag-btn"); if(!btn) return;
      setLang(btn.dataset.lang);
    });
  }

  async function load(code){
    if(cache[code]) return cache[code];
    const res = await fetch(`lang/${code}.json?v=1`, {cache:"no-store"});
    cache[code] = await res.json();
    return cache[code];
  }

  function apply(dict){
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const k=el.getAttribute("data-i18n");
      if(dict[k]) el.innerHTML = dict[k];
    });
    document.documentElement.lang = cur;
  }

  async function setLang(code){
    if(!SUPPORTED.includes(code)) return;
    cur = code; localStorage.setItem("zuzu_lang", code);
    apply(await load(code));
  }

  window.ZUZU_I18N = { setLang, get lang(){return cur;} };
  setLang(cur);
})();
