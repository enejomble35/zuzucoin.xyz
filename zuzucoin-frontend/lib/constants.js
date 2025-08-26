// zuzucoin-frontend/lib/constants.js
import { Polygon } from "@thirdweb-dev/chains";

// Kontrat adresini .env ile de geçebilirsin.
// Vercel > Project > Settings > Environment Variables
export const ZUZU_COLLECTION_ADDRESS =
  process.env.NEXT_PUBLIC_ZUZU_COLLECTION_ADDRESS ||
  "0x0xF?135c20eBF06eBac74dB6Fa6Af1dEa3bB277F".replace("0x0x","0x"); // <- Burayı kendi tam adresinle doğrula

export const ACTIVE_CHAIN = Polygon; // 137 (Polygon mainnet)
export const LAUNCH_TS =
  Number(process.env.NEXT_PUBLIC_LAUNCH_TS) || // epoch ms
  new Date("2025-09-15T18:00:00+03:00").getTime(); // Geri sayım için hedef tarih (TRT)
