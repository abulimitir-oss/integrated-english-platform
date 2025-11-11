/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  productionBrowserSourceMaps: false, // 禁用生产环境的 source maps 以减少内存使用
  output: 'standalone',

  reactStrictMode: true,

  // 示例：使用云图片加载器 (例如 Cloudinary) 来减少服务器内存占用
  // images: {
  //   loader: 'cloudinary',
  //   path: 'https://res.cloudinary.com/your-cloud-name/image/upload/',
  // },

  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
      allowedOrigins: ['localhost:3000', 'localhost:3001'],
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

module.exports = withBundleAnalyzer(nextConfig);
