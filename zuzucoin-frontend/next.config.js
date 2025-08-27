/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: { unoptimized: true }, // public içinden görüntüleri direkt kullan
};

module.exports = nextConfig;
