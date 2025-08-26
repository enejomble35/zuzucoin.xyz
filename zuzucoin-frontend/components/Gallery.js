// components/Gallery.js
import React from "react";
import {
  useContract,
  useNFTs,
  MediaRenderer,
} from "@thirdweb-dev/react";
import MintButton from "./MintButton";

const CONTRACT_ADDRESS = "0xFC1F2f35c20eBF86eBac74dBF6Aaf1dEa3bB277F";

export default function Gallery() {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data: nfts, isLoading, error } = useNFTs(contract);

  if (isLoading) return <p>Loading NFTs...</p>;
  if (error) return <p>Hata: {error?.message}</p>;
  if (!nfts || nfts.length === 0) return <p>Henüz NFT bulunamadı.</p>;

  return (
    <div style={{ padding: 20, maxWidth: 1280, margin: "0 auto" }}>
      <h1 style={{ color: "#fff" }}>ZUZU NFT Koleksiyonu</h1>
      <p style={{ color: "#aaa" }}>
        Koleksiyondaki NFT'lerimiz aşağıda listelenir. Stake / Mystery Box entegrasyonu ile nadirlik ödülleri yakında burada!
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
          marginTop: 20,
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
            <MediaRenderer
              src={nft?.metadata?.image}
              alt={nft?.metadata?.name || "ZUZU NFT"}
              style={{
                width: "100%",
                borderRadius: 12,
                aspectRatio: "1/1",
                objectFit: "cover",
              }}
            />
            <h2 style={{ marginTop: 10, fontSize: "1.2rem" }}>
              {nft.metadata.name}
            </h2>
            <p style={{ fontSize: "0.9rem", color: "#aaa", minHeight: 48 }}>
              {nft.metadata.description}
            </p>

            <MintButton tokenId={nft.metadata.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
