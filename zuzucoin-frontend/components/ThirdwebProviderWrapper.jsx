// zuzucoin-frontend/components/ThirdwebProviderWrapper.jsx
"use client";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ACTIVE_CHAIN } from "../lib/constants";

export default function ThirdwebProviderWrapper({ children }) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
      activeChain={ACTIVE_CHAIN}
    >
      {children}
    </ThirdwebProvider>
  );
}
