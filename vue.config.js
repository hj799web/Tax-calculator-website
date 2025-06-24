const path = require('path');

module.exports = {
  publicPath: process.env.DEPLOY_ENV === 'GH_PAGES'
    ? '/Tax-calculator-website/'
    : '/',
  outputDir: process.env.DEPLOY_ENV === 'GH_PAGES' ? 'docs' : 'dist',
  devServer: {
    port: 3001,
    host: '0.0.0.0',
    allowedHosts: 'all',
    client: {
      webSocketURL: 'wss://sturdy-giggle-v6qj67gjqwf6qxv-3001.app.github.dev/ws',
    },
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://static.getclicky.com https://html2canvas.hertzen.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://pagead2.googlesyndication.com https://static.getclicky.com; frame-src 'self' https://forms.gle; object-src 'none'; base-uri 'self'; form-action 'self';",
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  },
  configureWebpack: {
    resolve: {
      symlinks: false,
      alias: {
        vue: path.resolve('./node_modules/vue'),
      },
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Vendor libraries chunk
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'initial',
          },
          // Chart.js specific chunk (heavy library)
          charts: {
            test: /[\\/]node_modules[\\/](chart\.js|vue-chartjs)[\\/]/,
            name: 'charts',
            priority: 20,
            chunks: 'all',
          },
          // Lodash specific chunk
          lodash: {
            test: /[\\/]node_modules[\\/](lodash|lodash-es)[\\/]/,
            name: 'lodash',
            priority: 20,
            chunks: 'all',
          },
          // Common components chunk
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
            chunks: 'all',
          }
        }
      }
    },
    performance: {
      hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
      maxAssetSize: 512000, // 512kb
      maxEntrypointSize: 512000, // 512kb
    }
  },
  chainWebpack: config => {
    // Remove default prefetch and preload to control loading behavior
    config.plugins.delete('prefetch')
    
    // Optimize chunks
    config.optimization.splitChunks({
      cacheGroups: {
        default: false,
        vendors: false,
        // Bundle vendor libraries
        vendor: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial'
        },
        // Bundle common modules
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: 5,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    })
  }
};