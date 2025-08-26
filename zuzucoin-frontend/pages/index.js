import React from "react";
import Gallery from "@/components/Gallery";

export default function Home() {
  return (
    <>
      <div className="container">
        <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:18}}>
          <img src="/zuzu-logo.svg" width="40" height="40" alt="ZUZU" />
          <h2 style={{margin:0}}>ZUZU • Mint & Koleksiyon</h2>
        </div>
        <p className="badge">Stake, Mystery Box, Tokenomics yakında!</p>
        <hr />
      </div>
      <Gallery />
    </>
  );
}
