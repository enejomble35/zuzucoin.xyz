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
  const { data: claimCondition } = useActiveClaimConditionForWallet(
    contract, tokenId, address
  );

  const { mutate: claim, isLoading, error } = useClaimNFT(contract);

  const price =
    claimCondition?.price?.displayValue && claimCondition?.currencyMetadata?.symbol
      ? `${claimCondition.price.displayValue} ${claimCondition.currencyMetadata.symbol}`
      : "Mint";

  const onMint = () => {
    if (!address) {
      alert("Lütfen önce cüzdan bağlayın.");
      return;
    }
    claim(
      { to: address, tokenId, quantity: 1 },
      {
        onSuccess: () => alert("Mint başarılı! 🎉"),
        onError: (e) => alert("Mint başarısız: " + (e?.message || "Bilinmeyen hata")),
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
        disabled={isLoading || !contract}
        style={{
          width: "100%", padding: "10px 14px", borderRadius: 10,
          border: "1px solid #333",
          background: isLoading ? "#333" : "#1a73e8",
          color: "#fff", fontWeight: 700,
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? "Mintleniyor..." : `Mint (${price})`}
      </button>

      {error && (
        <p style={{ color: "#ff6b6b", marginTop: 8, fontSize: 13 }}>
          Hata: {error?.message}
        </p>
      )}
    </div>
  );
}
