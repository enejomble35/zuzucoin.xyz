"use client";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Polygon } from "@thirdweb-dev/chains";

export default function ThirdwebProviderWrapper({ children }) {
  const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "";
  return (
    <ThirdwebProvider clientId={clientId} activeChain={Polygon}>
      {children}
    </ThirdwebProvider>
  );
}
