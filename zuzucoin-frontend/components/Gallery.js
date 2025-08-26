// components/Gallery.js
import React from "react";
import {
  useContract,
  useNFTs,
  MediaRenderer,
  ConnectWallet,
} from "@thirdweb-dev/react";
import MintButton from "./MintButton";
import { ZUZU_COLLECTION_ADDRESS } from "../lib/constants";

export default function Gallery() {
  const { contract, isLoading: isLoadingContract, error: contractError } =
    useContract(ZUZU_COLLECTION_ADDRESS);

  const {
    data: nfts,
    isLoading: isLoadingNFTs,
    error: nftsError,
  } = useNFTs(contract);

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
          <p style={{ margin: "6px 0 0", color: "#9aa0a6" }}>
            Koleksiyondaki NFT’lerimiz listelenir. Stake / Mystery Box entegrasyonu ile
            nadirlik ödülleri yakında burada!
          </p>
        </div>
        <ConnectWallet theme="dark" btnTitle="Cüzdan Bağla" />
      </div>

      {/* Info Bar */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 18,
          color: "#cfcfcf",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            background: "#111",
            border: "1px solid #222",
            padding: "8px 12px",
            borderRadius: 10,
          }}
        >
          Contract:{" "}
          <code style={{ color: "#7ab7ff" }}>{ZUZU_COLLECTION_ADDRESS}</code>
        </span>
        <span
          style={{
            background: "#111",
            border: "1px solid #222",
            padding: "8px 12px",
            borderRadius: 10,
          }}
        >
          Toplam NFT:{" "}
          <strong>{Array.isArray(nfts) ? nfts.length : "-"}</strong>
        </span>
      </div>

      {/* Hatalar */}
      {contractError && (
        <div
          style={{
            background: "#2c1b1b",
            color: "#ffb3b3",
            padding: 10,
            borderRadius: 10,
            border: "1px solid #633",
            marginBottom: 12,
          }}
        >
          Contract yüklenemedi: {contractError?.message}
        </div>
      )}
      {nftsError && (
        <div
          style={{
            background: "#2c1b1b",
            color: "#ffb3b3",
            padding: 10,
            borderRadius: 10,
            border: "1px solid #633",
            marginBottom: 12,
          }}
        >
          NFT verisi alınamadı: {nftsError?.message}
        </div>
      )}

      {/* Skeleton */}
      {(isLoadingContract || isLoadingNFTs) && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={`sk-${i}`}
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
                  borderRadius: 8,
                  background:
                    "linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)",
                  backgroundSize: "400% 100%",
                  animation: "shimmer 1.2s ease-in-out infinite",
                }}
              />
              <div
                style={{
                  marginTop: 10,
                  height: 18,
                  background: "#171717",
                  borderRadius: 6,
                }}
              />
              <div
                style={{
                  marginTop: 8,
                  height: 12,
                  background: "#151515",
                  borderRadius: 6,
                }}
              />
              <style>{`
                @keyframes shimmer {
                  0% { background-position: 200% 0; }
                  100% { background-position: -200% 0; }
                }
              `}</style>
            </div>
          ))}
        </div>
      )}

      {/* Grid */}
      {!isLoadingContract && !isLoadingNFTs && Array.isArray(nfts) && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {nfts.map((nft) => (
            <div
              key={nft?.metadata?.id}
              style={{
                border: "1px solid #222",
                borderRadius: 12,
                padding: 12,
                background:
                  "linear-gradient(180deg, rgba(15,15,15,1) 0%, rgba(10,10,10,1) 100%)",
                color: "#fff",
                textAlign: "center",
                transition: "transform .15s ease, box-shadow .15s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,.45)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <div style={{ borderRadius: 12, overflow: "hidden" }}>
                <MediaRenderer
                  src={nft?.metadata?.image}
                  alt={nft?.metadata?.name || "ZUZU NFT"}
                  style={{
                    width: "100%",
                    aspectRatio: "1/1",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>

              <h3 style={{ marginTop: 10, marginBottom: 6, fontSize: 18 }}>
                {nft?.metadata?.name || "ZUZU NFT"}
              </h3>

              <p
                style={{
                  fontSize: 13,
                  color: "#9aa0a6",
                  minHeight: 40,
                  margin: "0 0 8px",
                }}
              >
                {nft?.metadata?.description || "ZUZU koleksiyonu."}
              </p>

              <MintButton tokenId={nft?.metadata?.id} />
            </div>
          ))}
        </div>
      )}

      {/* Boş durum */}
      {!isLoadingContract && !isLoadingNFTs && (!nfts || nfts.length === 0) && (
        <div
          style={{
            background: "#111",
            border: "1px solid #222",
            padding: 16,
            borderRadius: 12,
            color: "#bbb",
            textAlign: "center",
          }}
        >
          Henüz görüntülenecek NFT bulunamadı.
        </div>
      )}
    </div>
  );
}
