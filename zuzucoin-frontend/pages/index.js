// pages/index.js
import React from "react";
import Gallery from "../components/Gallery";

export default function Home() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Gallery />
    </div>
  );
}
