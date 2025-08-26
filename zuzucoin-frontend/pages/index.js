import dynamic from "next/dynamic";
import Head from "next/head";
import Header from "../components/Header";
import Gallery from "../components/Gallery";
import Footer from "../components/Footer";
import { CONTRACT_ADDRESS, THIRDWEB_CLIENT_ID } from "../lib/constants";

function Home() {
  return (
    <>
      <Head>
        <title>ZUZU NFT Koleksiyonu</title>
        <meta name="description" content="ZUZU • NFT Koleksiyonu • Stake • Mystery Box • Tap-to-Earn" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!THIRDWEB_CLIENT_ID && (
        <div className="container card" style={{ marginTop: 16 }}>
          <strong>Uyarı:</strong> THIRDWEB Client ID tanımlı değil. `.env` veya Vercel Environment’a
          <code> NEXT_PUBLIC_THIRDWEB_CLIENT_ID </code> ekleyin.
        </div>
      )}

      {!CONTRACT_ADDRESS && (
        <div className="container card" style={{ marginTop: 16 }}>
          <strong>Uyarı:</strong> Kontrat adresi boş. <code>NEXT_PUBLIC_CONTRACT_ADDRESS</code> ayarlayın.
        </div>
      )}

      <Header />
      <Gallery />
      <Footer />
    </>
  );
}

// SSR devre dışı – tarayıcıda render
export default dynamic(() => Promise.resolve(Home), { ssr: false });
