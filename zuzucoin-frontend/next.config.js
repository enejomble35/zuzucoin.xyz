/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.ipfs.w3s.link' },
      { protocol: 'https', hostname: '**.ipfs.dweb.link' },
      { protocol: 'https', hostname: 'ipfs.io' },
      { protocol: 'https', hostname: '**.thirdweb.com' },
      { protocol: 'https', hostname: '**.mediarender.com' },
      { protocol: 'https', hostname: '**.nft.storage' }
    ]
  }
};
module.exports = nextConfig;
