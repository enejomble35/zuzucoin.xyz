import Gallery from "../components/Gallery";

export default function Home() {
  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto", color: "#fff", background: "#000" }}>
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>ZUZU NFT Koleksiyonu</h1>
      <p style={{ marginBottom: 24, opacity: 0.85 }}>
        Koleksiyondaki NFT’lerimiz aşağıda listelenir. Stake / Mystery Box entegrasyonu
        ile nadirlik ödülleri yakında burada!
      </p>
      <Gallery />
    </main>
  );
}
