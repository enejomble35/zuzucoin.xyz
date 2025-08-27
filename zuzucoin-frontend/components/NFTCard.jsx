import { useAddress, useContract, useClaimNFT, useNFT } from "@thirdweb-dev/react";
import { CONTRACT_ADDRESS, CLAIM_ADDRESS } from "../lib/constants";
import { useState } from "react";

export default function NFTCard({ tokenId }) {
  const address = useAddress();

  // Edition Drop / ERC-1155 ise useContract(CONTRACT_ADDRESS, "edition-drop")
  // ERC-721 mint ise "nft-collection"
  const { contract } = useContract(CONTRACT_ADDRESS, "edition-drop");

  const { data: nft, isLoading } = useNFT(contract, tokenId);
  const { mutate: claim, isLoading: isClaiming } = useClaimNFT(contract);

  const [txStatus, setTxStatus] = useState("");

  const onClaim = async () => {
    if (!address) {
      setTxStatus("Cüzdan bağla!");
      return;
    }
    try {
      setTxStatus("İşlem gönderiliyor...");
      await claim({
        to: address,
        tokenId,
        quantity: 1,
      });
      setTxStatus("Mint başarılı!");
    } catch (e) {
      console.error(e);
      setTxStatus("Mint başarısız.");
    }
  };

  if (isLoading) return <div className="card">Yükleniyor...</div>;

  return (
    <div className="card">
      <img src={nft?.metadata?.image} alt={`ZUZU NFT #${tokenId}`} />
      <h3>{nft?.metadata?.name || `ZUZU NFT #${tokenId}`}</h3>
      <button onClick={onClaim} disabled={isClaiming}>
        {isClaiming ? "Mintleniyor..." : "Mint Et"}
      </button>
      {!!txStatus && <p className="status">{txStatus}</p>}
      <style jsx>{`
        .card { padding: 16px; border-radius: 12px; background: #121212; }
        img { width: 100%; border-radius: 10px; }
        h3 { margin: 12px 0; }
        button {
          background: #8a2be2; color: #fff; border: 0; padding: 10px 16px;
          border-radius: 10px; cursor: pointer;
        }
        .status { margin-top: 8px; font-size: 12px; color: #aaa; }
      `}</style>
    </div>
  );
}
