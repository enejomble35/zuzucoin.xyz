// pages/index.js
import Gallery from "../components/Gallery";

export default function Home() {
  return (
    <main style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 10 }}>ZUZU NFT Koleksiyonu</h1>
      <p style={{ color: "#777", marginBottom: 30 }}>
        Cüzdanını bağla, istediğin NFT’yi mintle. ZUZU Mystery Box ve stake ödülleri yakında!
      </p>
      <Gallery />
    </main>
  );
}
