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
    BACKEND_URL: process.env.BACKEND_URL,
    BACKEND_USERNAME: process.env.BACKEND_USERNAME,
    BACKEND_PASSWORD: process.env.BACKEND_PASSWORD,
  },
};

module.exports = nextConfig;
