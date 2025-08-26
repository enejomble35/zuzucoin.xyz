import Link from 'next/link';

export default function Home() {
  return (
    <main style={{minHeight:'100vh', background:'#0b0d12', color:'#fff'}}>
      <div style={{maxWidth:980, margin:'0 auto', padding:'60px 20px', textAlign:'center'}}>
        <img src="/zuzu-logo.png" alt="ZUZU" width="96" height="96" />
        <h1 style={{fontSize:36, marginTop:20}}>ZUZU Coin</h1>
        <p style={{opacity:.8, marginTop:10}}>Tap-to-Earn • NFT • Staking • TON & Polygon</p>

        <div style={{marginTop:40}}>
          <Link href="/nft" style={{
            background:'#8d5cff', padding:'14px 24px', borderRadius:10,
            display:'inline-block', color:'#fff', fontWeight:700
          }}>
            NFT Koleksiyonunu Gör
          </Link>
        </div>
      </div>
    </main>
  );
}
