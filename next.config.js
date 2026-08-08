/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(mp3|wav|m4a)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/sounds/',
          outputPath: 'static/sounds/',
          name: '[name].[ext]',
        },
      },
    });

    return config;
  },
  async rewrites() {
    // 1. Resolve environment variable with safe fallbacks
    const targetBaseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.BE_PROD_BASE_URL || process.env.BE_BASE_URL || "http://localhost:5000"
        : process.env.BE_BASE_URL || "http://localhost:5000";

    // 2. Ensure protocol prefix (http:// or https://) is present
    const destinationUrl = targetBaseUrl.startsWith("http")
      ? targetBaseUrl
      : `https://${targetBaseUrl}`;

    return [
      {
        source: '/api/:path*',
        destination: `${destinationUrl}/api/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/bookstore',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/bookstore/:path*',
        destination: '/shop/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;