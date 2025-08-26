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
  const { contract, isLoading: loadingContract, error: contractError } =
    useContract(ZUZU_COLLECTION_ADDRESS);

  const {
    data: nfts,
    isLoading: loadingNFTs,
    error: nftsError,
  } = useNFTs(contract);

  if (loadingContract || loadingNFTs) {
    return <div style={{ padding: 20, color: "#aaa" }}>Yükleniyor...</div>;
  }
  if (contractError) {
    return <div style={{ padding: 20, color: "#ff6b6b" }}>
      Contract hatası: {contractError.message}
    </div>;
  }
  if (nftsError) {
    return <div style={{ padding: 20, color: "#ff6b6b" }}>
      NFT hatası: {nftsError.message}
    </div>;
  }
  if (!nfts || nfts.length === 0) {
    return <div style={{ padding: 20, color: "#aaa" }}>Henüz NFT yok.</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 16
      }}>
        <h1 style={{ margin: 0, fontSize: 24, color: "#fff" }}>
          ZUZU NFT Koleksiyonu
        </h1>
        <ConnectWallet theme="dark" btnTitle="Cüzdan Bağla" />
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 16,
      }}>
        {nfts.map((nft) => (
          <div key={nft.metadata.id}
               style={{ border: "1px solid #222", borderRadius: 12, padding: 12, background: "#0b0b0b" }}>
            <MediaRenderer
              src={nft?.metadata?.image}
              alt={nft?.metadata?.name || "ZUZU NFT"}
              style={{ width: "100%", borderRadius: 10, aspectRatio: "1/1", objectFit: "cover" }}
            />
            <h3 style={{ marginTop: 10, color: "#fff" }}>{nft.metadata.name}</h3>
            <p style={{ color: "#aaa", minHeight: 40 }}>{nft.metadata.description}</p>
            <MintButton tokenId={nft.metadata.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
