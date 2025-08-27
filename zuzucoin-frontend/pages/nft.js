import Header from "../components/Header";
import Gallery from "../components/Gallery";
import MintButton from "../components/MintButton";

export default function NftPage(){
  return (
    <div className="container">
      <Header />
      <h1>ZUZU NFT Koleksiyonu</h1>
      <p className="muted">İlk 10 parçalık mini seri. Görseller public/nft altında — metadata public/metadata.</p>
      <div className="section"><Gallery /></div>
      <div className="section"><MintButton /></div>
    </div>
  );
}
