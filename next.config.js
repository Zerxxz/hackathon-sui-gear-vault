/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.walrus.site',
      },
      {
        protocol: 'https',
        hostname: '**.blob.store',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_TATUM_API_KEY: process.env.NEXT_PUBLIC_TATUM_API_KEY,
    NEXT_PUBLIC_SUI_NETWORK: process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet',
  },
};

module.exports = nextConfig;