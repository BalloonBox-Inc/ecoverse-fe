/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['api.mapbox.com'],
  },
  env: {
    RECIPIENT_PRIVATE_KEY: process.env.RECIPIENT_PRIVATE_KEY,
  },
};

module.exports = nextConfig;
