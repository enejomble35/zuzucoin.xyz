import { useAddress, useContract, useOwnedNFTs, Web3Button } from "@thirdweb-dev/react";
import { CHAIN_ID, CONTRACT_ADDRESS } from "../lib/constants";

export default function MintButton(){
  const address = useAddress();
  const { contract } = useContract(CONTRACT_ADDRESS, "edition-drop");

  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS.startsWith("0x0000")) {
    return <div className="card"><b>Kontrat adresi ayarlanmadı.</b> Env değişkenlerini giriniz.</div>;
  }

  return (
    <div className="card">
      <h3>Mint (Polygon)</h3>
      <p className="muted">Cüzdanını bağla ve 1 adet NFT mint et.</p>
      <Web3Button
        contractAddress={CONTRACT_ADDRESS}
        action={async (c)=>{ await c.erc1155.claim(0, 1); }}
        onSuccess={()=>alert("Mint başarılı!")}
        onError={(e)=>alert("Hata: "+ e?.message)}
      >
        1 NFT Mint Et
      </Web3Button>
    </div>
  );
}
