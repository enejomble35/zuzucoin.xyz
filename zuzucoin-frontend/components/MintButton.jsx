// components/MintButton.jsx
import React from "react";
import {
  useAddress,
  useContract,
  useClaimNFT,
  useActiveClaimConditionForWallet,
  ConnectWallet,
} from "@thirdweb-dev/react";
import { ZUZU_COLLECTION_ADDRESS } from "../lib/constants";

export default function MintButton({ tokenId }) {
  const address = useAddress();
  const { contract } = useContract(ZUZU_COLLECTION_ADDRESS);

  // Aktif claim koşulu (fiyat, para birimi vs.)
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

  const priceLabel =
    claimCondition?.price?.displayValue && claimCondition?.currencyMetadata?.symbol
      ? `${claimCondition.price.displayValue} ${claimCondition.currencyMetadata.symbol}`
      : "Mint";

  const onMint = () => {
    if (!address) {
      alert("Lütfen önce cüzdan bağlayın.");
      return;
    }

    // ERC1155 (Edition Drop) claim
    claim(
      {
        to: address,
        tokenId,
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
        {isClaiming ? "Mintleniyor..." : `Mint (${priceLabel})`}
      </button>

      {error && (
        <p style={{ color: "#ff6b6b", marginTop: 8, fontSize: 13 }}>
          Hata: {error?.message}
        </p>
      )}
    </div>
  );
}
