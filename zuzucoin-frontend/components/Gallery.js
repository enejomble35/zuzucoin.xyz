import { useContract, useNFTs } from "@thirdweb-dev/react";
import { ZUZU_COLLECTION_ADDRESS } from "../lib/constants";

export default function Gallery() {
  const { contract } = useContract(ZUZU_COLLECTION_ADDRESS);
  const { data: nfts, isLoading, error } = useNFTs(contract);

  if (isLoading) return <p>Loading NFTs...</p>;
  if (error) return <p>Hata: {error?.message}</p>;
  if (!nfts?.length) return <p>Henüz NFT bulunamadı.</p>;

  return (
    <div className="grid" style={{
      display: "grid",
      gap: "20px",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))"
    }}>
      {nfts.map((nft) => (
        <div key={nft?.metadata?.id} style={{
          border: "1px solid #222",
          borderRadius: 12,
          padding: 12,
          background: "#0b0b0b"
        }}>
          <img
            src={nft?.metadata?.image}
            alt={nft?.metadata?.name}
            style={{ width: "100%", height: 240, objectFit: "cover", borderRadius: 8 }}
          />
          <h3 style={{ marginTop: 10, fontWeight: 700 }}>{nft?.metadata?.name}</h3>
          <p style={{ fontSize: 14, opacity: 0.8 }}>{nft?.metadata?.description}</p>
        </div>
      ))}
    </div>
  );
}
