// pages/index.js
import dynamic from "next/dynamic";

const Gallery = dynamic(() => import("../components/Gallery"), {
  ssr: false,
});

export default function Home() {
  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      <Gallery />
    </div>
  );
}
