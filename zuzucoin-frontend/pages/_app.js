import "../styles/globals.css";
import { ThirdwebProvider, metamaskWallet, walletConnect, coinbaseWallet } from "@thirdweb-dev/react";
import { Polygon } from "@thirdweb-dev/chains";

export default function App({ Component, pageProps }) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
      activeChain={Polygon}
      supportedWallets={[metamaskWallet(), walletConnect(), coinbaseWallet()]}
      theme="dark"
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}
