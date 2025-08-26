// zuzucoin-frontend/pages/index.jsx
"use client";
import dynamic from "next/dynamic";
import ClientOnly from "../components/ClientOnly";
import Header from "../components/Header";
import Countdown from "../components/Countdown";
import MysteryBox from "../components/MysteryBox";

// Gallery thirdweb hook'ları kullanıyor, SSR devre dışı:
const Gallery = dynamic(() => import("../components/Gallery"), { ssr: false });

export default function Home() {
  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      <Header />
      <main>
        <section
          style={{
            padding: "36px 20px 8px",
            maxWidth: 1280,
            margin: "0 auto",
            color: "#fff",
          }}
        >
          <h1 style={{ margin: 0, fontSize: 28 }}>
            ZUZU NFT Koleksiyonu
          </h1>
          <p style={{ margin: "8px 0 0", color: "#aaa" }}>
            Koleksiyondaki NFT’lerimiz listelenir. Stake / Mystery Box
            entegrasyonu ile nadirlik ödülleri yakında burada!
          </p>
        </section>

        <Countdown />

        <ClientOnly fallback={<p style={{ color: "#fff", padding: 20 }}>Yükleniyor…</p>}>
          <Gallery />
        </ClientOnly>

        <MysteryBox />

        {/* Tokenomics / Roadmap / Tap-to-Earn */}
        <section
          style={{
            padding: 20,
            maxWidth: 1280,
            margin: "0 auto",
            color: "#fff",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          <div style={{ border: "1px solid #222", borderRadius: 12, padding: 16 }}>
            <h3>🪙 Tokenomics</h3>
            <ul style={{ color: "#bbb", margin: "6px 0 0", paddingLeft: 18 }}>
              <li>Toplam Arz: 1,000,000,000 ZUZU</li>
              <li>Likidite: %30</li>
              <li>Ekosistem & Ödül: %25</li>
              <li>Takım: %15 (6 ay kilit/lineer)</li>
              <li>Ön Satış & Pazarlama: %30</li>
            </ul>
          </div>
          <div style={{ border: "1px solid #222", borderRadius: 12, padding: 16 }}>
            <h3>📍 Roadmap</h3>
            <ol style={{ color: "#bbb", margin: "6px 0 0", paddingLeft: 18 }}>
              <li>Site + Koleksiyon canlı</li>
              <li>Staking & Mystery Box</li>
              <li>Borsa Listelemeleri</li>
              <li>Tap-to-Earn mini oyun</li>
              <li>Global Influencer kampanyası</li>
            </ol>
          </div>
          <div style={{ border: "1px solid #222", borderRadius: 12, padding: 16 }}>
            <h3>🎮 Tap-to-Earn</h3>
            <p style={{ color: "#bbb" }}>
              ZUZU mobil oyun ile tıklayıp puan kazan, görevleri tamamla,
              sezon ödülleri al! (Yakında)
            </p>
          </div>
        </section>

        {/* Hakkımızda / ZUZU Hikayesi */}
        <section
          style={{
            padding: 20,
            maxWidth: 980,
            margin: "0 auto",
            color: "#ddd",
          }}
        >
          <h2 style={{ color: "#fff" }}>Hakkımızda • ZUZU Hikayesi</h2>
          <p style={{ lineHeight: 1.6 }}>
            ZUZU; topluluğu tarafından büyütülen, eğlence ve faydayı merkeze
            alan bir ekosistemdir. Koleksiyonumuz; stake & ödül mekanikleri,
            gizemli kutular ve oyun entegrasyonlarıyla sürekli canlıdır.
          </p>
        </section>
      </main>

      <footer
        style={{
          padding: 20,
          textAlign: "center",
          color: "#777",
          borderTop: "1px solid #141414",
          background: "#0a0a0a",
        }}
      >
        © {new Date().getFullYear()} ZUZU • Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
