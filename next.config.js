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
      return [
        {
          source: '/api/:path*',
          destination: process.env.BE_BASE_URL + '/api/:path*'
          // 'http://localhost:3333/api/:path*',
        }
      ]
    }
  };

module.exports = nextConfig;
  