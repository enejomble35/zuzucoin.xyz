/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ipfs.thirdwebcdn.com", "gateway.ipfscdn.io", "nft-cdn.alchemy.com"],
  },
};

module.exports = nextConfig;
