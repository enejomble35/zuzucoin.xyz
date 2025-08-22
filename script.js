// cache-bust versiyon
const VERSION = 'v10.1';
const LOTTIE_PATH = (k) => `assets/zuzu/lottie/${k}.json?${VERSION}`;
const SVG_PATH    = (k) => `assets/zuzu/svg/${k}.svg`;

function mountLottie(container, key, color, autoplay=true, loop=true){
  fetch(LOTTIE_PATH(key)).then(r=>{
    if(!r.ok) throw new Error(`404: ${LOTTIE_PATH(key)}`);
    return r.json();
  }).then(data=>{
    try {
      const col = color || '#00E0FF';
      data = JSON.parse(JSON.stringify(data).replaceAll('#00E0FF', col));
    } catch(e){}
    const anim = lottie.loadAnimation({
      container, renderer:'svg', loop, autoplay,
      rendererSettings:{ preserveAspectRatio:'xMidYMid meet' },
      animationData: data
    });
    lottiePlayers.set(container.id, anim);
  }).catch(err=>{
    console.warn('Lottie load fail:', key, err);
    container.innerHTML = `<img src="${SVG_PATH(key)}" alt="${key}" style="width:100%;height:100%;object-fit:contain;opacity:.95">`;
  });
}
