/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  reactStrictMode: true,

  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
      allowedOrigins: ['localhost:3000', 'localhost:3001']
    }
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
