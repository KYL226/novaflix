/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
 /* experimental: {
    appDir: true,
  },*/
  images: {
    unoptimized: true, // car on gère les images via API sécurisée
  },
};

module.exports = nextConfig;
