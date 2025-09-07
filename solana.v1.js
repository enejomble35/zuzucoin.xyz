/* ------------------------------------------------------
   ZUZU — Solana purchase helpers (SOL & USDT-SPL transfer)
   CDN bağımlılıkları (index.html’de yüklü olmalı):
   - @solana/web3.js  (iife)
------------------------------------------------------ */

window.ZUZU_SOL = (function () {
  const OWNER = "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF"; // ALACAK HESAP
  const RPC = "https://api.mainnet-beta.solana.com";
  const USDT_MINT = "Es9vMFrzaCERa7eBwbxe9jH9n1t42AT3zh7TBTtRkP4d";
  const TOKEN_PROGRAM_ID = new solanaWeb3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
  const ASSOCIATED_TOKEN_PROGRAM_ID = new solanaWeb3.PublicKey(
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
  );

  const conn = new solanaWeb3.Connection(RPC, "confirmed");

  function getProvider() {
    return (
      window.solana ||
      window.phantom?.solana ||
      window.backpack?.solana ||
      window.solflare ||
      null
    );
  }

  async function requireWallet() {
    const prov = getProvider();
    if (!prov) throw new Error("Wallet provider not found.");
    const res = await prov.connect({ onlyIfTrusted: false });
    const pk = new solanaWeb3.PublicKey(res.publicKey?.toString?.() || res.publicKey);
    return { prov, pubkey: pk };
  }

  // ----- SOL transfer
  async function paySOL(amountSol) {
    const { prov, pubkey } = await requireWallet();
    const dest = new solanaWeb3.PublicKey(OWNER);
    const tx = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: pubkey,
        toPubkey: dest,
        lamports: Math.round(amountSol * solanaWeb3.LAMPORTS_PER_SOL),
      })
    );
    tx.feePayer = pubkey;
    tx.recentBlockhash = (await conn.getLatestBlockhash()).blockhash;
    const signed = await prov.signTransaction(tx);
    const sig = await conn.sendRawTransaction(signed.serialize());
    await conn.confirmTransaction(sig, "confirmed");
    return sig;
  }

  // ----- SPL Helpers
  async function findATA(ownerPk, mintPk) {
    const [ata] = await solanaWeb3.PublicKey.findProgramAddress(
      [ownerPk.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintPk.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    return ata;
  }

  function createATAIx(payer, owner, mint, ata) {
    return new solanaWeb3.TransactionInstruction({
      programId: ASSOCIATED_TOKEN_PROGRAM_ID,
      keys: [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: ata, isSigner: false, isWritable: true },
        { pubkey: owner, isSigner: false, isWritable: false },
        { pubkey: mint, isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: solanaWeb3.SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: solanaWeb3.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      ],
      data: Buffer.from([]), // create associated token account
    });
  }

  function transferSPLIx(source, dest, owner, amount) {
    const layout = Buffer.alloc(9);
    layout[0] = 3; // Transfer instruction
    layout.writeUInt32LE(amount & 0xffffffff, 1);
    layout.writeUInt32LE(Math.floor(amount / 0x100000000), 5);
    return new solanaWeb3.TransactionInstruction({
      programId: TOKEN_PROGRAM_ID,
      keys: [
        { pubkey: source, isSigner: false, isWritable: true },
        { pubkey: dest, isSigner: false, isWritable: true },
        { pubkey: owner, isSigner: true, isWritable: false },
      ],
      data: layout,
    });
  }

  // ----- USDT (6 decimals) transfer
  async function payUSDT(amountUsdt) {
    const { prov, pubkey } = await requireWallet();
    const payer = pubkey;
    const mint = new solanaWeb3.PublicKey(USDT_MINT);
    const destOwner = new solanaWeb3.PublicKey(OWNER);

    const fromATA = await findATA(payer, mint);
    const toATA = await findATA(destOwner, mint);

    const ixs = [];
    // destinasyon ATA yoksa oluşturmayı deneyelim (idempotent)
    const toInfo = await conn.getAccountInfo(toATA);
    if (!toInfo) ixs.push(createATAIx(payer, destOwner, mint, toATA));

    const amount = Math.round(amountUsdt * 1_000_000); // 6 decimals
    ixs.push(transferSPLIx(fromATA, toATA, payer, amount));

    const tx = new solanaWeb3.Transaction().add(...ixs);
    tx.feePayer = payer;
    tx.recentBlockhash = (await conn.getLatestBlockhash()).blockhash;

    const signed = await prov.signTransaction(tx);
    const sig = await conn.sendRawTransaction(signed.serialize());
    await conn.confirmTransaction(sig, "confirmed");
    return sig;
  }

  return {
    paySOL,
    payUSDT,
  };
})();
