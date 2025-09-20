/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration de production pour la sécurité
  productionBrowserSourceMaps: false,

  // Configuration pour la sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Configuration pour les médias sécurisés
  async rewrites() {
    return [
      {
        source: '/api/secure-media/:path*',
        destination: '/api/secure-media/:path*',
      },
    ];
  },
};

module.exports = nextConfig;