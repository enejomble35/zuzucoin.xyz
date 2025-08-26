// zuzucoin-frontend/components/Gallery.jsx
"use client";
import React from "react";
import {
  useContract,
  useNFTs,
  MediaRenderer,
} from "@thirdweb-dev/react";
import MintButton from "./MintButton";
import { ZUZU_COLLECTION_ADDRESS } from "../lib/constants";

function CardSkeleton() {
  return (
    <div
      style={{
        border: "1px solid #222",
        borderRadius: 12,
        padding: 12,
        background: "#0b0b0b",
      }}
    >
      <div style={{ width: "100%", aspectRatio: "1/1", background: "#141414", borderRadius: 8 }} />
      <div style={{ height: 8, background: "#141414", marginTop: 10, borderRadius: 4 }} />
      <div style={{ height: 8, background: "#141414", marginTop: 6, borderRadius: 4, width: "80%" }} />
      <div style={{ height: 38, marginTop: 12, background: "#1a1a1a", borderRadius: 10 }} />
    </div>
  );
}

export default function Gallery() {
  const { contract, isLoading: isLoadingContract, error: contractError } =
    useContract(ZUZU_COLLECTION_ADDRESS);

  const {
    data: nfts,
    isLoading: isLoadingNFTs,
    error: nftsError,
  } = useNFTs(contract, { count: 24 });

  if (contractError) {
    return <p style={{ color: "#ff6b6b" }}>Kontrat hatası: {contractError?.message}</p>;
  }

  const loading = isLoadingContract || isLoadingNFTs;

  return (
    <section style={{ padding: 20, maxWidth: 1280, margin: "0 auto" }}>
      {/* Small info strip */}
      <div
        style={{
          marginBottom: 16,
          padding: "8px 10px",
          border: "1px solid #222",
          borderRadius: 10,
          background: "#0f0f0f",
          color: "#bbb",
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span>
          Contract:{" "}
          <b style={{ color: "#1fa2ff" }}>
            {ZUZU_COLLECTION_ADDRESS.slice(0, 6)}…{ZUZU_COLLECTION_ADDRESS.slice(-4)}
          </b>
        </span>
        <span>•</span>
        <span>Toplam NFT: {nfts?.length ?? "-"}</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {loading &&
          Array.from({ length: 9 }).map((_, i) => <CardSkeleton key={`s-${i}`} />)}

        {!loading && nfts?.length === 0 && (
          <p style={{ color: "#999" }}>Henüz NFT bulunamadı.</p>
        )}

        {!loading &&
          nfts?.map((nft) => (
            <div
              key={nft?.metadata?.id || nft?.metadata?.uri}
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
              <h3 style={{ marginTop: 10, fontSize: 18 }}>
                {nft?.metadata?.name || "ZUZU NFT"}
              </h3>
              <p style={{ fontSize: 13, color: "#aaa", minHeight: 38 }}>
                {nft?.metadata?.description || ""}
              </p>
              <MintButton tokenId={nft?.metadata?.id} />
            </div>
          ))}
      </div>
    </section>
  );
}
