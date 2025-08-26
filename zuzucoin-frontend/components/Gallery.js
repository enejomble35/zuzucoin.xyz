// components/Gallery.js
import {
  useContract,
  useNFTs,
  Web3Button,
  ConnectWallet,
} from "@thirdweb-dev/react";
import { useMemo } from "react";

const CONTRACT_ADDRESS = "0xFC1F2f35c20eBF86eBac74dBF6Aaf1dEa3bB277F";

export default function Gallery() {
  const { contract, isLoading: isContractLoading } = useContract(
    CONTRACT_ADDRESS,
    "edition-drop"
  );
  const { data: nfts, isLoading } = useNFTs(contract, { start: 0, count: 100 });

  const contentLoading = isContractLoading || isLoading;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <ConnectWallet theme="dark" btnTitle="Cüzdanı Bağla" />
      </div>

      {contentLoading ? (
        <p>Loading NFTs...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          }}
        >
          {nfts?.map((nft) => {
            const rarity = getRarity(nft?.metadata?.attributes);
            return (
              <div
                key={nft.metadata.id}
                style={{
                  border: "1px solid #2a2a2a",
                  borderRadius: 12,
                  padding: 14,
                  background: "#0f0f10",
                }}
              >
                <img
                  src={nft.metadata.image}
                  alt={nft.metadata.name}
                  style={{
                    width: "100%",
                    aspectRatio: "1/1",
                    objectFit: "cover",
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <h3 style={{ fontSize: 18, margin: 0 }}>{nft.metadata.name}</h3>
                  <span style={badgeStyle(rarity)}>{rarity}</span>
                </div>

                <p style={{ color: "#9aa0a6", fontSize: 14, minHeight: 40 }}>
                  {nft.metadata.description}
                </p>

                <div style={{ marginTop: 10 }}>
                  <Web3Button
                    contractAddress={CONTRACT_ADDRESS}
                    contractType="edition-drop"
                    action={async (contract) => {
                      // 1 adet mint
                      await contract.erc1155.claim(nft.metadata.id, 1);
                    }}
                    theme="dark"
                  >
                    Mintle (Fiyat: Kontrata Göre)
                  </Web3Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getRarity(attrs = []) {
  const row =
    attrs?.find((a) => (a.trait_type || a.traitType) === "Rarity") || {};
  return row?.value || "Common";
}

function badgeStyle(rarity) {
  const base = {
    padding: "4px 8px",
    fontSize: 12,
    borderRadius: 8,
    border: "1px solid transparent",
  };
  switch (rarity) {
    case "Legendary":
      return { ...base, color: "#ffd54f", borderColor: "#ffd54f33" };
    case "Epic":
      return { ...base, color: "#c084fc", borderColor: "#c084fc33" };
    case "Rare":
      return { ...base, color: "#60a5fa", borderColor: "#60a5fa33" };
    default:
      return { ...base, color: "#c1c1c1", borderColor: "#333" };
  }
}
