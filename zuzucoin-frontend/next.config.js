/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ipfs.io" },
      { protocol: "https", hostname: "nftstorage.link" },
      { protocol: "https", hostname: "gateway.ipfscdn.io" },
      { protocol: "https", hostname: "cloudflare-ipfs.com" },
    ],
  },
};

module.exports = nextConfig;
