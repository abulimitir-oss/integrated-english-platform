/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NODE_ENV: process.env.NODE_ENV || 'production', // 默认为 production
  },
  // ... 其他配置
};

module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
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

