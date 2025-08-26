import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider activeChain="polygon">
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
