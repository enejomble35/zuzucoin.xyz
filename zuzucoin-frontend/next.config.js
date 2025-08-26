// zuzucoin-frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ipfs.io" },
      { protocol: "https", hostname: "gateway.ipfscdn.io" },
      { protocol: "https", hostname: "nftstorage.link" },
      { protocol: "https", hostname: "cloudflare-ipfs.com" },
      { protocol: "https", hostname: "arweave.net" },
    ],
  },
};
module.exports = nextConfig;
