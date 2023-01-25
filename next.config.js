/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['api.mapbox.com'],
  },
  env: {
    RECIPIENT_PRIVATE_KEY: process.env.RECIPIENT_PRIVATE_KEY,
    COINMARKETCAP_API_KEY: process.env.COINMARKETCAP_API_KEY,
    COINMARKETCAP_BASE_URL: process.env.COINMARKETCAP_BASE_URL,
  },
};

module.exports = nextConfig;
