// components/Gallery.js
import { useContract, useNFTs } from "@thirdweb-dev/react";
import MintButton from "./MintButton";

// ADRESİ BURAYA GÖMDÜM
const ZUZU_COLLECTION_ADDRESS = "0xFC1F2f35c20eBF86eBac74dBF6Aaf1dEa3bB277F";

export default function Gallery() {
  const { contract } = useContract(ZUZU_COLLECTION_ADDRESS);
  const { data: nfts, isLoading, error } = useNFTs(contract);

  if (isLoading) return <p>Loading NFTs...</p>;
  if (error) return <p>Hata: {error?.message}</p>;
  if (!nfts || nfts.length === 0) return <p>Henüz NFT bulunamadı.</p>;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 16,
        padding: 20,
      }}
    >
      {nfts.map((nft) => (
        <div
          key={nft.metadata.id}
          style={{
            border: "1px solid #222",
            borderRadius: 12,
            padding: 12,
            background: "#0b0b0b",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <img
            src={nft.metadata.image}
            alt={nft.metadata.name}
            style={{ width: "100%", borderRadius: 8 }}
          />
          <h2 style={{ marginTop: 10, fontSize: "1.2rem" }}>
            {nft.metadata.name}
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#aaa", minHeight: 48 }}>
            {nft.metadata.description}
          </p>

          {/* Mint / Buy butonu */}
          <MintButton tokenId={nft?.metadata?.id} />
        </div>
      ))}
    </div>
  );
}
