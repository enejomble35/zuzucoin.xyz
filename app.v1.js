/* App boot */
window.addEventListener("DOMContentLoaded", ()=>{
  // yıl
  const y = document.getElementById("yearSpan"); if(y) y.textContent = new Date().getFullYear();

  // dil (localStorage)
  const savedLang = localStorage.getItem("z_lang") || "en";
  window.applyLang?.(savedLang);
  document.getElementById("langCode").textContent = savedLang.toUpperCase();
  const flagMap = {en:'en.png',tr:'tr.png',fr:'fr.png',es:'es.png',ru:'ru.png',pl:'pt.png'};
  document.getElementById("langFlag").src = "flags/"+(flagMap[savedLang]||"en.png");
  document.querySelectorAll(".lang-flag").forEach(b=>b.addEventListener("click",()=>localStorage.setItem("z_lang", b.dataset.lang)));

  // Referral
  const myId = localStorage.getItem("zuzu_ref") || (Math.random().toString(36).slice(2,10));
  localStorage.setItem("zuzu_ref", myId);
  const ref = new URL(location.href);
  ref.searchParams.set("ref", myId);
  const refInput = document.getElementById("refLink");
  if(refInput) refInput.value = ref.toString();
  document.getElementById("copyRef")?.addEventListener("click", ()=>{
    refInput.select(); document.execCommand("copy"); alert("Copied!");
  });

  // Eğer wallet içi browser #connect paramıyla açıldıysa wallet-lite otomatik bağlayacak.
});
