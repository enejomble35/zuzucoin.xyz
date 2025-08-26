import { useContract, useNFTs } from "@thirdweb-dev/react";

// ADRESİ BURAYA SABİT YAZIYORUZ
const CONTRACT_ADDRESS = "0xFC1F2f35c20eBF86eBac74dBF6Aaf1dEa3bB277F";

// ipfs:// linklerini HTTPS gateway'e çevirme (görüntü sorunu olmasın)
const ipfsToHttp = (url) => {
  if (!url) return "";
  return url.startsWith("ipfs://")
    ? `https://ipfs.io/ipfs/${url.replace("ipfs://", "")}`
    : url;
};

export default function Gallery() {
  // Kontrata bağlan
  const { contract, isLoading: loadingContract, error: contractError } = useContract(CONTRACT_ADDRESS);

  // NFT'leri çek
  const { data: nfts, isLoading, error } = useNFTs(contract);

  if (loadingContract || isLoading) return <p>Loading NFTs...</p>;
  if (contractError) return <p>Kontrata bağlanırken hata: {contractError?.message}</p>;
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
            src={ipfsToHttp(nft?.metadata?.image)}
            alt={nft?.metadata?.name}
            style={{ width: "100%", borderRadius: 8 }}
          />
          <h2 style={{ marginTop: 10, fontSize: "1.2rem" }}>
            {nft?.metadata?.name}
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
            {nft?.metadata?.description}
          </p>
        </div>
      ))}
    </div>
  );
}
