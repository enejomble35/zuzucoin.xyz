// components/ThirdwebProviderWrapper.jsx
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Polygon } from "@thirdweb-dev/chains";

export default function ThirdwebProviderWrapper({ children }) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
      activeChain={Polygon}
    >
      {children}
    </ThirdwebProvider>
  );
}
