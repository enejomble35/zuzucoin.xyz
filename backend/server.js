// Minimal Solana Pay "transactions request" servis
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Connection, PublicKey, SystemProgram, Transaction } = require('@solana/web3.js');

const app = express();
app.use(cors());

const RPC_URL   = process.env.SOLANA_RPC;     // QuickNode URL
const TREASURY  = process.env.TREASURY_ADDR;  // Fni...QwF
const CLUSTER   = process.env.CLUSTER || 'devnet';

const connection = new Connection(RPC_URL, 'confirmed');
const treasuryPk = new PublicKey(TREASURY);

// Solana Pay Transactions API (GET)
// Example: /api/tx?amount=0.02&label=ZUZU&message=Presale
app.get('/api/tx', async (req, res) => {
  try {
    const amount = parseFloat(req.query.amount || '0');
    if (!amount || amount <= 0) return res.status(400).json({ error: 'invalid amount' });

    const payer = req.query.payer ? new PublicKey(req.query.payer) : null; // (opsiyonel)
    const label = (req.query.label || 'ZUZU Presale').toString();
    const message = (req.query.message || '').toString();

    const tx = new Transaction();
    const lamports = Math.floor(amount * 1_000_000_000); // SOL → lamports

    // Eğer payer bilinmiyorsa, cüzdan kendisi feePayer yapar (wallet doldurur).
    tx.add(SystemProgram.transfer({
      fromPubkey: payer || treasuryPk, // wallet imzalarken from'u overwrite eder
      toPubkey: treasuryPk,
      lamports
    }));

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    if (payer) tx.feePayer = payer;

    // Wallet'ların beklediği JSON: { transaction: <base64>, message, ... }
    const serialized = tx.serialize({ requireAllSignatures: false });
    const b64 = Buffer.from(serialized).toString('base64');

    res.json({
      transaction: b64,
      message,
      network: CLUSTER,
      label
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server_error', detail: e.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Solana Pay API listening on http://localhost:${port}`));
