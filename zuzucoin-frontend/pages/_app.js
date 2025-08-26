// zuzucoin-frontend/pages/_app.jsx
"use client";
import "../styles/global.css";
import ThirdwebProviderWrapper from "../components/ThirdwebProviderWrapper";

export default function App({ Component, pageProps }) {
  return (
    <ThirdwebProviderWrapper>
      <Component {...pageProps} />
    </ThirdwebProviderWrapper>
  );
}
