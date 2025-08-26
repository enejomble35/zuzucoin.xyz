// components/Gallery.js
import React from "react";
import {
  useContract,
  useNFTs,
  MediaRenderer,
} from "@thirdweb-dev/react";
import MintButton from "./MintButton";
import { ZUZU_COLLECTION_ADDRESS } from "../lib/constants";

export default function Gallery() {
  // Kontrata bağlan
  const {
    contract,
    isLoading: isLoadingContract,
    error: contractError,
  } = useContract(ZUZU_COLLECTION_ADDRESS);

  // NFT'leri çek
  const {
    data: nfts,
    isLoading: isLoadingNFTs,
    error: nftsError,
  } = useNFTs(contract);

  const isLoading = isLoadingContract || isLoadingNFTs;
  const error = contractError || nftsError;

  return (
    <div style={{ padding: 20, maxWidth: 1280, margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 28, color: "#fff" }}>
            ZUZU NFT Koleksiyonu
          </h1>
          <p style={{ margin: "6px 0 0", color: "#aaa", fontSize: 14 }}>
            Koleksiyondaki NFT'lerimiz aşağıda listelenir. Stake / Mystery Box entegrasyonu ile nadirlik ödülleri yakında burada!
          </p>
        </div>

        <div style={{ color: "#9aa0a6", fontSize: 12 }}>
          <div style={{ marginBottom: 4 }}>
            <span style={{ opacity: 0.8 }}>Contract: </span>
            <a
              href={`https://polygonscan.com/address/${ZUZU_COLLECTION_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#8ab4f8" }}
            >
              {ZUZU_COLLECTION_ADDRESS.slice(0, 6)}...
              {ZUZU_COLLECTION_ADDRESS.slice(-4)}
            </a>
          </div>
          <div>
            <span style={{ opacity: 0.8 }}>Toplam NFT: </span>
            {nfts?.length ?? "-"}
          </div>
        </div>
      </div>

      {/* Hata */}
      {error && (
        <div
          style={{
            padding: 12,
            borderRadius: 10,
            background: "#2a1b1b",
            color: "#ff6b6b",
            marginBottom: 16,
          }}
        >
          Hata: {error?.message || "Bilinmeyen hata"}
        </div>
      )}

      {/* Skeleton / Loading */}
      {isLoading && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #222",
                borderRadius: 12,
                padding: 12,
                background: "#0b0b0b",
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  borderRadius: 12,
                  background:
                    "linear-gradient(90deg, #111 25%, #1a1a1a 37%, #111 63%)",
                  backgroundSize: "400% 100%",
                  animation: "skeleton 1.4s ease infinite",
                }}
              />
              <div
                style={{
                  height: 12,
                  marginTop: 12,
                  width: "70%",
                  background: "#151515",
                  borderRadius: 6,
                }}
              />
              <div
                style={{
                  height: 10,
                  marginTop: 8,
                  width: "90%",
                  background: "#151515",
                  borderRadius: 6,
                }}
              />
              <style jsx>{`
                @keyframes skeleton {
                  0% {
                    background-position: 200% 0;
                  }
                  100% {
                    background-position: -200% 0;
                  }
                }
              `}</style>
            </div>
          ))}
        </div>
      )}

      {/* NFT Grid */}
      {!isLoading && nfts?.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
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
              <h2 style={{ marginTop: 10, fontSize: "1.1rem" }}>
                {nft.metadata.name}
              </h2>
              <p style={{ fontSize: 13, color: "#aaa", minHeight: 48 }}>
                {nft.metadata.description}
              </p>

              <MintButton tokenId={nft.metadata.id} />
            </div>
          ))}
        </div>
      )}

      {!isLoading && (!nfts || nfts.length === 0) && (
        <p style={{ color: "#aaa" }}>Henüz NFT bulunamadı.</p>
      )}
    </div>
  );
}
