// components/MintButton.jsx
import React from "react";
import {
  useAddress,
  useContract,
  useClaimNFT,
  useActiveClaimConditionForWallet,
  ConnectWallet,
} from "@thirdweb-dev/react";

// ADRESİ BURAYA GÖMDÜM
const ZUZU_COLLECTION_ADDRESS = "0xFC1F2f35c20eBF86eBac74dBF6Aaf1dEa3bB277F";

export default function MintButton({ tokenId }) {
  const address = useAddress();
  const { contract } = useContract(ZUZU_COLLECTION_ADDRESS);

  // ERC1155 (Edition Drop) için tokenId gerekli
  const { data: claimCondition } = useActiveClaimConditionForWallet(
    contract,
    tokenId,
    address
  );

  const {
    mutate: claim,
    isLoading: isClaiming,
    error,
  } = useClaimNFT(contract);

  const price =
    claimCondition?.price?.displayValue && claimCondition?.currencyMetadata?.symbol
      ? `${claimCondition.price.displayValue} ${claimCondition.currencyMetadata.symbol}`
      : "Mint";

  const onMint = () => {
    if (!address) {
      alert("Lütfen önce cüzdan bağlayın.");
      return;
    }

    // Edition Drop (ERC1155) mint
    claim(
      {
        to: address,
        tokenId: Number(tokenId), // string gelirse sayıya çevir
        quantity: 1,
      },
      {
        onSuccess: () => {
          alert("Mint başarılı! 🎉");
        },
        onError: (err) => {
          console.error(err);
          alert("Mint başarısız: " + (err?.message || "Bilinmeyen hata"));
        },
      }
    );
  };

  return (
    <div style={{ marginTop: 10 }}>
      {/* Cüzdan bağlama butonu */}
      {!address && (
        <div style={{ marginBottom: 10 }}>
          <ConnectWallet theme="dark" btnTitle="Cüzdan Bağla" />
        </div>
      )}

      <button
        onClick={onMint}
        disabled={isClaiming || !contract}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #333",
          background: isClaiming ? "#333" : "#1a73e8",
          color: "#fff",
          fontWeight: 700,
          cursor: isClaiming ? "not-allowed" : "pointer",
        }}
      >
        {isClaiming ? "Mintleniyor..." : `Mint (${price})`}
      </button>

      {error && (
        <p style={{ color: "#ff6b6b", marginTop: 8, fontSize: 13 }}>
          Hata: {error?.message}
        </p>
      )}
    </div>
  );
}
