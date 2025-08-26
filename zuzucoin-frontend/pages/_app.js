import "@/styles/globals.css";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { polygon } from "viem/chains";
import { CLIENT_ID, CHAIN_ID, isEnvReady } from "@/lib/constants";

export default function App({ Component, pageProps }) {
  // SSR guard: provider sadece client tarafında render edilsin
  const [ready, setReady] = React.useState(false);
  React.useEffect(()=>{ setReady(true); }, []);

  if (!ready) return null;

  if (!isEnvReady()) {
    return (
      <div className="container">
        <div className="card">
          <h2>Env Eksik</h2>
          <p>Lütfen Vercel Environment Variables’a
            <code> NEXT_PUBLIC_THIRDWEB_CLIENT_ID</code>,
            <code> NEXT_PUBLIC_CONTRACT_ADDRESS</code>,
            <code> NEXT_PUBLIC_CHAIN_ID</code> ekleyin.</p>
        </div>
      </div>
    );
  }

  return (
    <ThirdwebProvider
      clientId={CLIENT_ID}
      activeChain={CHAIN_ID === 137 ? polygon : CHAIN_ID}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}
