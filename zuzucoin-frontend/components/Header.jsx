import Image from "next/image";
import { ConnectWallet } from "@thirdweb-dev/react";

export default function Header() {
  return (
    <div className="header container">
      <div className="brand">
        <Image src="/zuzu-logo.png" alt="ZUZU" width={42} height={42} />
        <div>
          <h1>ZUZU NFT Koleksiyonu</h1>
          <p>Stake • Mystery Box • Tap-to-Earn • Yakında!</p>
        </div>
      </div>
      <ConnectWallet
        theme="dark"
        modalSize="wide"
        btnTitle="Cüzdan Bağla"
      />
    </div>
  );
}
