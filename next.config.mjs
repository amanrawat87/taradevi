/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server-only packages
  serverExternalPackages: [
    'mongoose',
    'bcryptjs',
    'jsonwebtoken',
    'dotenv',
  ],

  // CKEditor 5 support
  transpilePackages: [
    'ckeditor5',
    '@ckeditor/ckeditor5-react',
  ],

  // Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 30,

    // ✅ Cloudinary & Unsplash support
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
    ],
  },

  compress: true,

  // ✅ Enable View Transitions API for smooth cross-fade navigations.
  // The CSS in globals.css anchors the header so it stays fixed.
  // Gracefully degrades to instant navigation in unsupported browsers.
  experimental: {
    viewTransition: true,
  },

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
};


export default nextConfig;