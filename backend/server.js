import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Connection, PublicKey, SystemProgram, Transaction
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress, createTransferCheckedInstruction, TOKEN_PROGRAM_ID
} from '@solana/spl-token';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const {
  PORT = 8080,
  CLUSTER = 'mainnet-beta',
  RPC_URL,
  TREASURY,
  USDT_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
} = process.env;

if (!RPC_URL || !TREASURY) {
  console.error('RPC_URL ve TREASURY .env içinde zorunlu!');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const connection = new Connection(RPC_URL, 'confirmed');
const treasuryPk = new PublicKey(TREASURY);
const usdtMintPk = new PublicKey(USDT_MINT);

/* -------- health -------- */
app.get('/api/health', (_req, res) => res.json({ ok: true, cluster: CLUSTER }));

/* -------- SOL transfer tx oluştur --------
   Body: { from: string, amountSol: string }  amountSol: "0.1234"
------------------------------------------ */
app.post('/api/tx/sol-transfer', async (req, res) => {
  try {
    const from = new PublicKey(String(req.body.from || ''));
    const lamports = BigInt(Math.round(parseFloat(req.body.amountSol) * 1e9));
    if (!Number.isFinite(Number(req.body.amountSol))) throw new Error('invalid amount');

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');

    const tx = new Transaction({
      feePayer: from,
      recentBlockhash: blockhash
    }).add(
      SystemProgram.transfer({
        fromPubkey: from,
        toPubkey: treasuryPk,
        lamports: Number(lamports)
      })
    );

    const bs64 = tx.serialize({ requireAllSignatures: false }).toString('base64');
    res.json({ tx: bs64, lastValidBlockHeight });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message || 'build-failed' });
  }
});

/* -------- USDT (SPL) transfer tx oluştur --------
   Body: { from: string, amountUsdt: string }  (6 decimals)
----------------------------------------------- */
app.post('/api/tx/usdt-transfer', async (req, res) => {
  try {
    const from = new PublicKey(String(req.body.from || ''));
    const amount = BigInt(Math.round(parseFloat(req.body.amountUsdt) * 1e6));
    if (!Number.isFinite(Number(req.body.amountUsdt))) throw new Error('invalid amount');

    const fromAta = await getAssociatedTokenAddress(usdtMintPk, from);
    const toAta   = await getAssociatedTokenAddress(usdtMintPk, treasuryPk);

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');

    const ixs = [];
    // alıcının ATA'sı yoksa oluştur (payer: from)
    const toAtaInfo = await connection.getAccountInfo(toAta);
    if (!toAtaInfo) {
      const { createAssociatedTokenAccountInstruction } = await import('@solana/spl-token');
      ixs.push(createAssociatedTokenAccountInstruction(
        from, toAta, treasuryPk, usdtMintPk
      ));
    }

    ixs.push(createTransferCheckedInstruction(
      fromAta,        // source
      usdtMintPk,     // mint
      toAta,          // destination
      from,           // owner
      Number(amount), // amount in base units
      6               // decimals
    ));

    const tx = new Transaction({
      feePayer: from,
      recentBlockhash: blockhash
    }).add(...ixs);

    const bs64 = tx.serialize({ requireAllSignatures: false }).toString('base64');
    res.json({ tx: bs64, lastValidBlockHeight, tokenProgram: TOKEN_PROGRAM_ID.toBase58() });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message || 'build-failed' });
  }
});

/* -------- docs/ klasörünü statik servis et (opsiyonel) -------- */
const docsDir = path.resolve(__dirname, '..', 'docs');
app.use('/', express.static(docsDir));

app.listen(PORT, () => {
  console.log(`ZUZU backend up on http://localhost:${PORT} (${CLUSTER})`);
});
