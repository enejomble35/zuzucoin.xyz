// pages/_app.js
import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider
      activeChain="polygon"
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}
