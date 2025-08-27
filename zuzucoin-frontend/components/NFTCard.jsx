import React from "react";

export default function NFTCard({ nft }) {
  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-xl">
      <img src={nft.metadata.image} alt={nft.metadata.name} className="rounded" />
      <h3 className="text-lg font-bold mt-2">{nft.metadata.name}</h3>
      <p className="text-sm">{nft.metadata.description}</p>
    </div>
  );
}
