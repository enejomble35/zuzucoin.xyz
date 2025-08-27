import { NFT_COUNT } from "../lib/constants";

export default function Gallery(){
  const items = Array.from({length: NFT_COUNT}, (_,i)=>({
    id: i,
    name: `ZUZU #${i}`,
    image: `/nft/${i}.png`
  }));
  return (
    <div className="grid">
      {items.map(nft=>(
        <div key={nft.id} className="card">
          <img src={nft.image} alt={nft.name}/>
          <div className="meta"><b>{nft.name}</b> • #{nft.id}</div>
        </div>
      ))}
    </div>
  );
}
