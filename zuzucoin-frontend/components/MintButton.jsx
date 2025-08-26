import React from "react";
import {
  useAddress,
  useContract,
  useActiveClaimConditionForWallet,
  useClaimNFT,
} from "@thirdweb-dev/react";
import { CONTRACT_ADDRESS } from "@/lib/constants";

export default function MintButton({ tokenId }) {
  const address = useAddress();
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data: claimCondition } = useActiveClaimConditionForWallet(
    contract, tokenId, address
  );
  const { mutate: claim, isLoading } = useClaimNFT(contract);

  const onMint = async () => {
    if (!address) return alert("Lütfen önce cüzdan bağlayın.");
    try {
      await claim({ to: address, tokenId, quantity: 1 });
      alert("Mint başarılı!");
    } catch (e) {
      console.error(e);
      alert("Mint başarısız: " + (e?.reason || e?.message || "Bilinmeyen hata"));
    }
  };

  const price = claimCondition?.price?.displayValue && claimCondition?.currencyMetadata?.symbol
    ? `${claimCondition.price.displayValue} ${claimCondition.currencyMetadata.symbol}`
    : "Mint";

  return (
    <button className="btn" onClick={onMint} disabled={isLoading}>
      {isLoading ? "Mint ediliyor..." : price}
    </button>
  );
}
