import "../styles/globals.css";
import ThirdwebProviderWrapper from "../components/ThirdwebProviderWrapper";

export default function App({ Component, pageProps }){
  return (
    <ThirdwebProviderWrapper>
      <Component {...pageProps} />
    </ThirdwebProviderWrapper>
  );
}
