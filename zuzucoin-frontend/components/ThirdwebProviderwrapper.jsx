import React from "react";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { CHAIN_ID, THIRDWEB_CLIENT_ID } from "../lib/constants";

const activeChain = {
  chainId: CHAIN_ID,       // 137
  rpc: ["https://polygon-rpc.com"], // yedek rpc otomatik seçilir
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  shortName: "matic",
  slug: "polygon",
  name: "Polygon Mainnet",
};

export default function ThirdwebProviderWrapper({ children }) {
  return (
    <ThirdwebProvider
      clientId={THIRDWEB_CLIENT_ID}
      activeChain={activeChain}
      supportedChains={[activeChain]}
      autoConnect
    >
      {children}
    </ThirdwebProvider>
  );
}
