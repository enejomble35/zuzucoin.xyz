import { useEffect, useState } from 'react';
import { ThirdwebProvider, useContract, ConnectWallet } from "@thirdweb-dev/react";
import { Polygon } from "@thirdweb-dev/chains";

function NFTGrid() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // public/metadata içindeki tüm .json dosyalarını listele (basit yöntem)
    async function load() {
      // manual liste (dosya sistemi kısıtlı olduğu için basit tutuyoruz)
      const total = 10; // sende kaç adet varsa burayı arttır
      const arr = [];
      for (let i=1;i<=total;i++){
        const meta = await fetch(`/metadata/${i}.json`).then(r=>r.json()).catch(()=>null);
        if(meta) arr.push({ id:i, ...meta, image:`/nft/${i}.png` });
      }
      setItems(arr);
    }
    load();
  }, []);

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  return (
    <div style={{maxWidth:1100, margin:'0 auto', padding:'20px'}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', margin:'20px 0'}}>
        <h2>ZUZU NFT Koleksiyonu</h2>
        <ConnectWallet theme="dark" btnTitle="Cüzdan Bağla" />
      </div>
      <p style={{opacity:.7, marginBottom:20}}>Sözleşme: {contractAddress}</p>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:16}}>
        {items.map(nft => (
          <div key={nft.id} style={{background:'#151822', padding:12, borderRadius:12}}>
            <img src={nft.image} alt={nft.name || `ZUZU #${nft.id}`} style={{width:'100%', borderRadius:8}} />
            <div style={{marginTop:8, fontWeight:700}}>{nft.name || `ZUZU #${nft.id}`}</div>
            <div style={{opacity:.6, fontSize:13}}>{nft.description || 'ZUZU NFT'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NFTPage(){
  return (
    <ThirdwebProvider activeChain={Polygon}>
      <main style={{minHeight:'100vh', background:'#0b0d12', color:'#fff'}}>
        <NFTGrid />
      </main>
    </ThirdwebProvider>
  );
}
