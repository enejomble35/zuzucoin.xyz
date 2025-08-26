import React from "react";
import {
  useContract,
  useNFTs,
  MediaRenderer,
  ConnectWallet
} from "@thirdweb-dev/react";
import MintButton from "./MintButton";
import { CONTRACT_ADDRESS } from "@/lib/constants";

export default function Gallery() {
  const { contract, isLoading: loadingC, error: contractError } = useContract(CONTRACT_ADDRESS);
  const { data: nfts, isLoading: loadingN, error: nftsError } = useNFTs(contract);

  if (contractError) return <div className="card">Kontrat hatası: {contractError.message}</div>;
  return (
    <div className="container">
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <div>
          <h1 style={{margin:0}}>ZUZU NFT Koleksiyonu</h1>
          <p className="badge">Contract: {CONTRACT_ADDRESS?.slice(0,8)}…{CONTRACT_ADDRESS?.slice(-6)}</p>
        </div>
        <ConnectWallet theme="dark" btnTitle="Cüzdan Bağla" />
      </header>

      {(loadingC || loadingN) && (
        <div className="grid">
          {Array.from({length:8}).map((_,i)=>(
            <div key={i} className="card" style={{height:280}}>
              <div className="skeleton" style={{height:180,borderRadius:12,marginBottom:10}}/>
              <div className="skeleton" style={{height:16,width:'60%',borderRadius:6,margin:'6px 0'}}/>
              <div className="skeleton" style={{height:16,width:'40%',borderRadius:6}}/>
            </div>
          ))}
        </div>
      )}

      {!loadingN && nftsError && (
        <div className="card">NFT’ler alınamadı: {nftsError.message}</div>
      )}

      {!loadingN && nfts?.length === 0 && (
        <div className="card">Henüz NFT yok.</div>
      )}

      {!loadingN && nfts?.length > 0 && (
        <div className="grid">
          {nfts.map((n)=>(
            <div key={n.metadata.id} className="card">
              <MediaRenderer
                src={n?.metadata?.image}
                alt={n?.metadata?.name || "ZUZU NFT"}
                style={{width:'100%',aspectRatio:'1/1',objectFit:'cover',borderRadius:12}}
              />
              <h3 style={{margin:'10px 0 6px 0'}}>{n?.metadata?.name || `#${n.metadata.id}`}</h3>
              <p className="badge">ID: {String(n.metadata.id)}</p>
              <div style={{marginTop:10}}>
                <MintButton tokenId={Number(n.metadata.id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
