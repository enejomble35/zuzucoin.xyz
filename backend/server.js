import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8080;

const RPC_URL = process.env.RPC_URL;
const CLUSTER = process.env.CLUSTER || "mainnet-beta";
const TREASURY = process.env.TREASURY;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";
const FALLBACK_SOL_PER_USDT = Number(process.env.FALLBACK_SOL_PER_USDT || "0.01");

app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }));
app.get("/api/health", (_, res) => res.json({ ok: true, cluster: CLUSTER }));

// USDT -> SOL oranı (Jupiter > CoinGecko > fallback)
async function fetchSolPerUsdt() {
  try {
    const j = await fetch("https://price.jup.ag/v6/price?ids=SOL").then(r => r.json());
    const priceUsd = j?.data?.SOL?.price;
    if (priceUsd) return 1 / Number(priceUsd); // 1 USDT ~ 1 USD varsayımıyla
  } catch {}
  try {
    const c = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd").then(r => r.json());
    const priceUsd = c?.solana?.usd;
    if (priceUsd) return 1 / Number(priceUsd);
  } catch {}
  return FALLBACK_SOL_PER_USDT;
}

// USDT tutarı ver, SOL tutarını döndür
app.get("/api/quote", async (req, res) => {
  const usdt = Number(req.query.usdt || "0");
  if (!usdt || usdt <= 0) return res.status(400).json({ error: "usdt required" });
  const solPerUsdt = await fetchSolPerUsdt();
  const sol = usdt * solPerUsdt;
  res.json({ usdt, solPerUsdt, sol });
});

// Solana Pay deeplink üret (frontend de üretebilir; isteyen burada da alabilir)
app.get("/api/solana-pay", async (req, res) => {
  const usdt = Number(req.query.usdt || "0");
  const label = encodeURIComponent("ZUZUCOIN Presale");
  const message = encodeURIComponent("ZUZU presale payment");
  const reference = encodeURIComponent(req.query.reference || "zuzu");
  const solPerUsdt = await fetchSolPerUsdt();
  const sol = (usdt * solPerUsdt).toFixed(6);
  const url = `solana:${encodeURIComponent(TREASURY)}?amount=${sol}&reference=${reference}&label=${label}&message=${message}&network=${encodeURIComponent(CLUSTER)}`;
  res.json({ usdt, solPerUsdt, sol, url });
});

app.listen(PORT, () => {
  console.log(`ZUZU backend running on :${PORT}`);
  console.log({ RPC_URL, CLUSTER, TREASURY, ALLOWED_ORIGIN });
});
