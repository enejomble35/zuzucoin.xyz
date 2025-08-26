import { useContract, useNFTs, useActiveClaimConditionForWallet, useAddress, useClaimNFT } from "@thirdweb-dev/react";
import NFTCard from "./NFTCard";
import { CONTRACT_ADDRESS } from "../lib/constants";

export default function Gallery() {
  const address = useAddress();
  const { contract, isLoading: loadingContract, error: contractError } = useContract(CONTRACT_ADDRESS);
  const { data: nfts, isLoading: loadingNFTs, error: nftsError } = useNFTs(contract);

  const getPrice = (claimCondition) => {
    const v = claimCondition?.price?.displayValue;
    const s = claimCondition?.currencyMetadata?.symbol;
    if (v && s) return `${v} ${s}`;
    return "Mint";
  };

  return (
    <div className="container">
      {contractError && (
        <div className="card" style={{ marginBottom: 16 }}>
          <strong>Kontrat yüklenemedi.</strong>
          <p>Adres: {CONTRACT_ADDRESS}</p>
          <p style={{ color: "#ff8" }}>{String(contractError.message || contractError)}</p>
        </div>
      )}

      {(loadingContract || loadingNFTs) && (
        <div className="grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton" />
              <div className="row"><div>Yükleniyor...</div></div>
              <button className="btn" disabled>Mint</button>
            </div>
          ))}
        </div>
      )}

      {!loadingNFTs && nfts?.length > 0 && (
        <div className="grid">
          {nfts.map((nft) => {
            const tokenId = nft?.metadata?.id;
            const { data: cond } = useActiveClaimConditionForWallet(contract, tokenId, address);
            const { mutate: claim, isLoading } = useClaimNFT(contract);

            const onMint = async () => {
              if (!address) {
                alert("Lütfen önce cüzdan bağlayın.");
                return;
              }
              try {
                await claim({ to: address, tokenId, quantity: 1 });
                alert("Mint tamam! 🎉");
              } catch (e) {
                alert("Mint hatası: " + (e?.message || e));
              }
            };

            return (
              <NFTCard
                key={tokenId}
                nft={nft}
                onMint={onMint}
                priceLabel={getPrice(cond)}
                loading={isLoading}
              />
            );
          })}
        </div>
      )}

      {!loadingNFTs && (!nfts || nfts.length === 0) && (
        <div className="card">
          <strong>Henüz listelenecek NFT bulunamadı.</strong>
          <p>Kontrat adresi: {CONTRACT_ADDRESS}</p>
        </div>
      )}
    </div>
  );
}
