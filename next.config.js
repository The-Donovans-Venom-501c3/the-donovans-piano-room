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
    const destinationUrl = process.env.NODE_ENV == "production" ? process.env.BE_PROD_BASE_URL : process.env.BE_BASE_URL;
    return [
      {
        source: '/api/:path*',
        destination: `${destinationUrl}/api/:path*`
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/bookstore', // ✅ FIX: Change '/shop' back to '/bookstore'
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/bookstore/:path*', // ✅ FIX: Change '/shop/:path*' back to '/bookstore/:path*'
        destination: '/shop/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;