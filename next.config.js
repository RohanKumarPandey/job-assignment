/** @type {import('next').NextConfig} */
// This app requires a real Clerk publishable key in `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
// Do not use the placeholder key in production or Vercel.
const CLERK_PLACEHOLDER_PUBLISHABLE_KEY =
  'pk_test_c291Z2h0LWNvcmdpLTE0LmNsZXJrLmFjY291bnRzLmRldiQ';

const nextConfig = {
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
      (process.env.NODE_ENV === 'development' ? CLERK_PLACEHOLDER_PUBLISHABLE_KEY : ''),
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'res.cloudinary.com',
      'img.clerk.com',
      'images.clerk.dev',
      'uploadthing.com',
    ],
    formats: ['image/avif', 'image/webp'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // simple-peer / WebRTC are browser-only
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // Bundle analyzer support: ANALYZE=true npm run build
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('@next/bundle-analyzer')();
      config.plugins.push(new BundleAnalyzerPlugin());
    }

    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=*, microphone=*, display-capture=*',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
