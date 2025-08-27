import { useState } from "react";

export default function Chest(){
  const [opened, setOpened] = useState(false);
  const [reward, setReward] = useState(null);

  const openChest = ()=>{
    setOpened(true);
    const roll = Math.random();
    let r = { title:"Teşekkürler!", prize:"5 ZUZU Puan", color:"#9db2ce" };
    if(roll > .98) r = { title:"Efsane!", prize:"500 ZUZU Puan", color:"#ff6289" };
    else if(roll > .9) r = { title:"Nadir!", prize:"100 ZUZU Puan", color:"#8a5bff" };
    else if(roll > .7) r = { title:"Güzel!", prize:"25 ZUZU Puan", color:"#00d3ff" };
    setReward(r);
  };

  return (
    <div className="section">
      <h2>Günlük Sandık</h2>
      <div className="card" style={{textAlign:"center"}}>
        {!opened ? (
          <>
            <p className="muted">Günde bir kez ücretsiz sandık aç!</p>
            <button className="btn" onClick={openChest}>Sandığı Aç</button>
          </>
        ) : (
          <>
            <div style={{fontSize:22, fontWeight:800, color:reward?.color}}>{reward?.title}</div>
            <div style={{marginTop:6}}>{reward?.prize}</div>
            <div className="muted" style={{marginTop:10}}>Puanlar yakında profilinize eklenecek.</div>
          </>
        )}
      </div>
    </div>
  );
}
