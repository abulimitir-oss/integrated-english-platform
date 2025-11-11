/** @type {import('next').NextConfig} */

// 1. 安全加载 Bundle Analyzer（仅在 ANALYZE=true 时）
let withBundleAnalyzer = (config) => config; // 默认不做任何事

if (process.env.ANALYZE === 'true') {
  try {
    const analyzer = require('@next/bundle-analyzer');
    withBundleAnalyzer = analyzer({
      enabled: true,
      openAnalyzer: true, // 开发时自动打开分析页面
    });
  } catch (error) {
    console.warn('Warning: @next/bundle-analyzer 未安装，将跳过 bundle 分析');
    console.warn('运行 `npm install --save-dev @next/bundle-analyzer` 安装');
  }
}

// 2. Next.js 核心配置（生产 + Render 优化）
const nextConfig = {
  // === 生产优化 ===
  output: 'standalone', // 必须！Render 部署生成最小 server 包
  productionBrowserSourceMaps: false, // 禁用 source maps，保护源码

  reactStrictMode: true,

  // === 实验性功能 ===
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
      allowedOrigins: ['localhost:3000', 'localhost:3001'],
    },
  },

  // === 客户端 Webpack 优化（避免 fs/net/tls 错误）===
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

// 3. 导出最终配置
module.exports = withBundleAnalyzer(nextConfig);