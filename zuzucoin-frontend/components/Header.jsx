// zuzucoin-frontend/components/Header.jsx
"use client";
import { ConnectWallet } from "@thirdweb-dev/react";

export default function Header() {
  return (
    <header
      style={{
        padding: "14px 20px",
        background: "#0b0b0b",
        borderBottom: "1px solid #1f1f1f",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div
          style={{
            width: 38,
            height: 38,
            background:
              "linear-gradient(135deg, #ff8a00 0%, #ff3d00 100%)",
            borderRadius: 10,
          }}
        />
        <strong style={{ color: "#fff", fontSize: 18 }}>ZUZU • NFT</strong>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <img alt="binance" src="https://cryptologos.cc/logos/binance-coin-bnb-logo.svg?v=030"
             style={{ width: 22, opacity: 0.8 }} />
        <img alt="okx" src="https://seeklogo.com/images/O/okx-logo-6A4DA2A8CA-seeklogo.com.png"
             style={{ width: 22, opacity: 0.8 }} />
        <img alt="mexc" src="https://cryptologos.cc/logos/mexc-global-mexc-logo.svg?v=030"
             style={{ width: 22, opacity: 0.8 }} />
        <div style={{ marginLeft: 10 }}>
          <ConnectWallet theme="dark" btnTitle="Cüzdan Bağla" />
        </div>
      </div>
    </header>
  );
}
