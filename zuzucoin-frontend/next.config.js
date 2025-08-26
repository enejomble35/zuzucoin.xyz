/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ipfs.io' },
      { protocol: 'https', hostname: 'gateway.ipfscdn.io' },
      { protocol: 'https', hostname: '**.ipfs.dweb.link' }
    ]
  },
  output: 'standalone'
};

module.exports = nextConfig;
