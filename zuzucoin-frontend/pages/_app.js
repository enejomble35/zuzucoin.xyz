// pages/_app.js
import "../styles/globals.css";
import ThirdwebProviderWrapper from "../components/ThirdwebProviderWrapper";

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProviderWrapper>
      <Component {...pageProps} />
    </ThirdwebProviderWrapper>
  );
}

export default MyApp;
