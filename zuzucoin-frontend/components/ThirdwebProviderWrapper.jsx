"use client";
import dynamic from "next/dynamic";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Polygon } from "@thirdweb-dev/chains";

function TWProvider({ children }) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
      activeChain={Polygon}
    >
      {children}
    </ThirdwebProvider>
  );
}

// SSR'i kapatıyoruz. (window is not defined hatasını engeller)
export default dynamic(() => Promise.resolve(TWProvider), { ssr: false });
