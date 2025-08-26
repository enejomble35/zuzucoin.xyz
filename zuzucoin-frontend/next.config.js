/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ipfs.io" },
      { protocol: "https", hostname: "gateway.pinata.cloud" },
      { protocol: "https", hostname: "cloudflare-ipfs.com" },
      { protocol: "https", hostname: "*.thirdwebstorage.com" },
      { protocol: "https", hostname: "*.ipfs.dweb.link" },
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
