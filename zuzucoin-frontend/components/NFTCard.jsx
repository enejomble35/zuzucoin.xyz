// components/NFTCard.jsx
import { Web3Button } from "@thirdweb-dev/react";

export default function NFTCard({ nft, contract }) {
  const image =
    nft?.metadata?.image ||
    nft?.metadata?.imageUrl ||
    nft?.metadata?.image_url;

  return (
    <article className="card">
      <div className="media">
        {image ? (
          <img src={image?.toString()} alt={nft?.metadata?.name} />
        ) : (
          <div className="placeholder">NFT</div>
        )}
      </div>

      <div className="body">
        <h3>{nft?.metadata?.name ?? "ZUZU NFT"}</h3>
        <p className="desc">{nft?.metadata?.description ?? ""}</p>

        <Web3Button
          contractAddress={contract?.getAddress()}
          action={async (cntr) => {
            await cntr.erc721.claim(1); // ERC721 Drop
          }}
          onSuccess={() => alert("Mint başarılı! 🎉")}
          onError={(e) => alert(`Mint hatası: ${e?.message ?? e}`)}
          theme="dark"
        >
          Mint Et
        </Web3Button>
      </div>

      <style jsx>{`
        .card {
          background: #0c0c12;
          border: 1px solid #1b1b25;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .media {
          width: 100%;
          aspect-ratio: 1 / 1;
          background: #101018;
          display: grid;
          place-items: center;
        }
        .media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .placeholder {
          color: #6e6e86;
          font-weight: 600;
        }
        .body {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .desc {
          min-height: 38px;
          color: #bfc3d9;
          font-size: 0.9rem;
        }
      `}</style>
    </article>
  );
}
