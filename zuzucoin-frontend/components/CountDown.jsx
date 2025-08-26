// zuzucoin-frontend/components/Countdown.jsx
"use client";
import { useEffect, useState } from "react";
import { LAUNCH_TS } from "../lib/constants";

const pad = (v) => String(v).padStart(2, "0");

export default function Countdown() {
  const [rest, setRest] = useState(LAUNCH_TS - Date.now());

  useEffect(() => {
    const t = setInterval(() => setRest(LAUNCH_TS - Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (rest <= 0) return null;

  const sec = Math.floor(rest / 1000);
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  return (
    <div
      style={{
        margin: "18px auto",
        padding: "8px 14px",
        maxWidth: 980,
        color: "#fff",
        background: "#151515",
        border: "1px solid #262626",
        borderRadius: 10,
        textAlign: "center",
      }}
    >
      🚀 Lansman geri sayımı: <b>{pad(d)}</b>g : <b>{pad(h)}</b>s : <b>{pad(m)}</b>d : <b>{pad(s)}</b>s
    </div>
  );
}
