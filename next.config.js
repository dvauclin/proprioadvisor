/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'proprioadvisor.com', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/accueil',
        destination: '/',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/connexion',
        permanent: true,
      },
      {
        source: '/signup',
        destination: '/inscription',
        permanent: true,
      },
      {
        source: '/register',
        destination: '/inscription',
        permanent: true,
      },
      {
        source: '/directory',
        destination: '/annuaire',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/a-propos',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/conditions-utilisation',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/politique-confidentialite',
        permanent: true,
      },
      {
        source: '/legal',
        destination: '/mentions-legales',
        permanent: true,
      },
    ];
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  // Optimisations pour le SEO
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  // Configuration pour les performances
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig; 