import { ConnectWallet } from "@thirdweb-dev/react";

export default function Header(){
  return (
    <div className="header">
      <div className="logo">
        <img src="/zuzu-logo.png" alt="ZUZU" />
        <div>
          <div style={{fontWeight:800,letterSpacing:.5}}>ZUZUCOIN</div>
          <div className="muted" style={{fontSize:12}}>Global Web3 • Tap-to-Earn • NFT</div>
        </div>
      </div>

      <div className="nav">
        <a href="/">Anasayfa</a>
        <a href="/nft">NFT</a>
        <a href="#roadmap">Yol Haritası</a>
        <a href="#tokenomics">Tokenomi</a>
        <a href="#community">Topluluk</a>
        <a href="#about">Hakkımızda</a>
      </div>

      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        {/* EVM (Metamask) */}
        <ConnectWallet
          theme="dark"
          btnTitle="Metamask"
          switchToActiveChain
          style={{ borderRadius: 12 }}
        />
        {/* TON & Solana placeholder (yakında) */}
        <a className="btn outline" href="#" onClick={(e)=>{e.preventDefault(); alert("TON ve Solana entegrasyonu çok yakında!");}}>TON</a>
        <a className="btn outline" href="#" onClick={(e)=>{e.preventDefault(); alert("Solana entegrasyonu çok yakında!");}}>Solana</a>
      </div>
    </div>
  );
}
