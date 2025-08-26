export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
export const CLAIM_ADDRESS    = process.env.NEXT_PUBLIC_CLAIM_ADDRESS    || "";
export const CHAIN_ID         = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 137); // Polygon
export const CLIENT_ID        = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "";

export const isEnvReady = () =>
  Boolean(CONTRACT_ADDRESS && CLIENT_ID && CHAIN_ID);
