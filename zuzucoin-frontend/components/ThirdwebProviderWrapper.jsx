import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ACTIVE_CHAIN } from "../lib/constants";

export default function ThirdwebProviderWrapper({ children }) {
  const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

  return (
    <ThirdwebProvider clientId={clientId} activeChain={ACTIVE_CHAIN}>
      {children}
    </ThirdwebProvider>
  );
}
