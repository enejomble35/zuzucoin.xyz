export default function Home() {
  return (
    <main className="container">
      <div className="logo">
        <img src="/zuzu-logo.png" alt="ZUZU" width="36" height="36" />
        <span>ZUZUCOIN</span>
      </div>

      <nav className="nav">
        <a href="/">Ana Sayfa</a>
        <a href="/nft">NFT</a>
      </nav>

      <h1 style={{marginTop:20}}>Merhaba Kral 👑</h1>
      <p>Önce stabil deploy alalım. Sonra NFT + Mint + Geri Sayım + Tokenomics ekranlarını ekleyeceğim.</p>

      <footer className="footer">© {new Date().getFullYear()} ZUZUCOIN – All rights reserved.</footer>
    </main>
  );
}
