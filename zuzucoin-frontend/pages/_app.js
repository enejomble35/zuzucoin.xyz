import "../styles/globals.css";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { defineChain } from "@thirdweb-dev/chains";
import { CHAIN_ID, THIRDWEB_CLIENT_ID } from "../lib/constants";

const activeChain = defineChain(CHAIN_ID || 137); // Polygon

export default function App({ Component, pageProps }) {
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      clientId={THIRDWEB_CLIENT_ID || undefined}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}
