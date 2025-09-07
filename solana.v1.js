/* =========================
   SOLANA CHAIN CONFIG
========================= */
const SOLANA_CONFIG = {
  rpc: "https://api.mainnet-beta.solana.com",
  usdtMint: "Es9vMFrzaCERa7eBwbxe9jH9n1t42AT3zh7TBTtRkP4d", // USDT SPL token
  ownerAddress: "FniLJmY5L6zQyQfot6xsiYojHeEzoGs2xZXYZh1U9QwF"
};

/* Dummy function for example (purchase flow handled via deep link) */
async function buyZUZUwithSolana(amount){
  alert(`Redirecting to wallet...\nAmount: ${amount} USDT`);
  // Real purchase handled in wallet-lite.js deeplink
}
