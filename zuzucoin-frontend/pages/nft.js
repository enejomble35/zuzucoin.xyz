import ThirdwebProviderWrapper from "../components/ThirdwebProviderWrapper";
import NFTCard from "../components/NFTCard";
import Head from "next/head";

export default function NFTPage() {
  const tokenIds = Array.from({ length: 10 }, (_, i) => i); // 0..9

  return (
    <ThirdwebProviderWrapper>
      <Head>
        <title>ZUZU • NFT Mint</title>
      </Head>
      <main className="wrap">
        <h1>🚀 ZUZU NFT Mint</h1>
        <div className="grid">
          {tokenIds.map((id) => (
            <NFTCard key={id} tokenId={id} />
          ))}
        </div>
      </main>
      <style jsx>{`
        .wrap { padding: 24px; max-width: 1100px; margin: 0 auto; }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }
        h1 { margin-bottom: 16px; }
      `}</style>
    </ThirdwebProviderWrapper>
  );
}
