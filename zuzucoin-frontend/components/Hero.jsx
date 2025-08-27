export default function Hero(){
  return (
    <div className="hero">
      <h1>ZUZU: Eğlence + Kazanç + Topluluk</h1>
      <p className="muted">
        ZUZU; tap-to-earn, NFT, stake ve lansman airdrop’larıyla büyüyen,
        çok dilli küresel bir ekosistemdir. Hedef: hızla benimsenen,
        güçlü, eğlenceli bir web3 topluluğu.
      </p>
      <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:16,flexWrap:"wrap"}}>
        <a className="btn" href="/nft">NFT Koleksiyonunu Gör</a>
        <a className="btn outline" href="#roadmap">Geri Sayım & Dağıtımlar</a>
      </div>
    </div>
  );
}
