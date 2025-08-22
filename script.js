// V9.3 – Lottie + Fallback garanti
const lottieInstances = [];

function loadLottie(container, jsonPath, fallbackImg){
  fetch(jsonPath)
    .then(res => {
      if(!res.ok) throw new Error("not-found");
      return res.json();
    })
    .then(data => {
      // fallback gizle
      if (fallbackImg) fallbackImg.style.opacity = "0";
      const anim = lottie.loadAnimation({
        container,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: data
      });
      lottieInstances.push(anim);
    })
    .catch(err => {
      console.warn("Lottie yüklenemedi:", jsonPath, err);
      // fallback göster
      if (fallbackImg) fallbackImg.style.opacity = "1";
    });
}

function initLotties(){
  const holders = document.querySelectorAll(".lottie-holder");
  if(!("IntersectionObserver" in window)){
    holders.forEach(h=>{
      loadLottie(h, h.dataset.lottie, h.querySelector(".svg-fallback"));
    });
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        if(el.dataset.loaded) return;
        el.dataset.loaded = "1";
        loadLottie(el, el.dataset.lottie, el.querySelector(".svg-fallback"));
        io.unobserve(el);
      }
    });
  }, {rootMargin:"200px 0px"});
  holders.forEach(h=>io.observe(h));
}

document.addEventListener("DOMContentLoaded", initLotties);
