// zuzucoin-frontend/components/MysteryBox.jsx
"use client";

export default function MysteryBox() {
  return (
    <section
      style={{
        padding: 20,
        maxWidth: 1280,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          border: "1px solid #222",
          borderRadius: 12,
          padding: 20,
          background:
            "linear-gradient(145deg, #131313 0%, #0b0b0b 60%, #151515 100%)",
          color: "#fff",
        }}
      >
        <h2 style={{ margin: "0 0 6px" }}>🎁 ZUZU Mystery Box</h2>
        <p style={{ margin: "0 0 12px", color: "#bbb" }}>
          Yakında: Sandığı aç, nadirlik derecesine göre özel ödüller kazan!
        </p>
        <button
          style={{
            background: "#ff8a00",
            border: 0,
            color: "#0b0b0b",
            fontWeight: 800,
            padding: "10px 16px",
            borderRadius: 10,
            cursor: "not-allowed",
            opacity: 0.5,
          }}
          disabled
        >
          Yakında
        </button>
      </div>
    </section>
  );
}
