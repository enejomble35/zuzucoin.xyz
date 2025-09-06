window.I18N = (function(){
  const storeKey = "zuzu_lang";
  const langs = [
    {code:"tr", name:"Türkçe",    flag:"flags/tr.png"},
    {code:"en", name:"English",   flag:"flags/en.png"},
    {code:"fr", name:"Français",  flag:"flags/fr.png"},
    {code:"pt", name:"Português", flag:"flags/pt.png"},
    {code:"ru", name:"Русский",   flag:"flags/ru.png"},
  ];
  let dict = {}, current = localStorage.getItem(storeKey) || "tr";

  async function load(code){
    try{
      const r = await fetch(`lang/${code}.json?${Date.now()}`);
      dict = await r.json(); current = code; localStorage.setItem(storeKey, code);
      document.querySelectorAll("[data-i18n]").forEach(el=>{
        const k = el.getAttribute("data-i18n");
        if(dict[k]) el.innerHTML = dict[k];
      });
      const m = langs.find(l=>l.code===code);
      if(m){ const f=document.getElementById("langFlag"); const c=document.getElementById("langCode");
        if(f) f.src=m.flag; if(c) c.textContent=code.toUpperCase();
      }
    }catch(e){ console.error("Lang load", e); }
  }

  function buildMenu(){
    const drop=document.getElementById("langDrop"), btn=document.getElementById("langBtn");
    if(!drop||!btn) return;
    drop.innerHTML="";
    langs.forEach(l=>{
      const b=document.createElement("button");
      b.innerHTML=`<img src="${l.flag}" width="18" height="18"><span>${l.name}</span>`;
      b.onclick=()=>{ drop.style.display="none"; load(l.code); };
      drop.appendChild(b);
    });
    btn.onclick=()=> drop.style.display = drop.style.display==="block"?"none":"block";
    document.addEventListener("click",(e)=>{ if(!document.getElementById("langMenu").contains(e.target)) drop.style.display="none"; });
    load(current);
  }

  function t(key){ return dict[key] || key; } // küçük yardımcı

  return {load, buildMenu, t};
})();
