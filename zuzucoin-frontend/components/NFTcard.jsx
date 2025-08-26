import { MediaRenderer } from "@thirdweb-dev/react";

export default function NFTCard({ nft, onMint, priceLabel, loading }) {
  return (
    <div className="card">
      <div style={{ width: "100%", aspectRatio: "1/1", overflow: "hidden", borderRadius: 12 }}>
        {nft?.metadata?.image ? (
          <MediaRenderer
            src={nft?.metadata?.image}
            alt={nft?.metadata?.name || "ZUZU NFT"}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div className="skeleton" />
        )}
      </div>

      <div className="row">
        <div style={{ fontWeight: 700 }}>{nft?.metadata?.name || "ZUZU NFT"}</div>
        <div className="badge">#{nft?.metadata?.id ?? "-"}</div>
      </div>

      <button className="btn" onClick={onMint} disabled={loading} style={{ marginTop: 10 }}>
        {loading ? "İşlem bekleniyor..." : priceLabel || "Mint"}
      </button>
    </div>
  );
}
