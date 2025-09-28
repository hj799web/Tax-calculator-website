const path = require('path');
const webpack = require('webpack');

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
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://static.getclicky.com http://in.getclicky.com https://html2canvas.hertzen.com https://fonts.googleapis.com https://ep2.adtrafficquality.google; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: http://static.getclicky.com; connect-src 'self' https://pagead2.googlesyndication.com https://static.getclicky.com wss://sturdy-giggle-v6qj67gjqwf6qxv-3001.app.github.dev:3001 ws://localhost:* https://ep1.adtrafficquality.google; frame-src 'self' https://forms.gle https://googleads.g.doubleclick.net; object-src 'none'; base-uri 'self'; form-action 'self';",
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
        'vue$': 'vue/dist/vue.esm-bundler.js',
      },
    },
    // Add chunk loading error handling
    output: {
      chunkLoadingGlobal: 'webpackChunkTaxCalculator',
      chunkLoadTimeout: 30000, // 30 seconds timeout
    },
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_DEVTOOLS__: false,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_TIPS__: false
      })
    ],
    optimization: {
      // Advanced tree shaking
      usedExports: true,
      sideEffects: false,
      // Advanced module optimization
      concatenateModules: true,
      // Better module identifiers for caching
      moduleIds: 'deterministic',
      chunkIds: 'deterministic',
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000, // Reduced from 512000 to prevent large chunks
        minChunks: 1,
        maxAsyncRequests: 20, // Reduced from 30
        maxInitialRequests: 20, // Reduced from 30
        enforceSizeThreshold: 50000,
        cacheGroups: {
          // Critical framework chunk - load first
          critical: {
            test: /[\\/]node_modules[\\/](vue|vue-router|pinia)[\\/]/,
            name: 'critical',
            priority: 50,
            chunks: 'initial',
            enforce: true
          },
          // UI/Chart libraries - lazy load
          charts: {
            test: /[\\/]node_modules[\\/](chart\.js|vue-chartjs|konva)[\\/]/,
            name: 'charts',
            priority: 40,
            chunks: 'async',
            reuseExistingChunk: true
          },
          // Utilities - separate chunk
          utilities: {
            test: /[\\/]node_modules[\\/](lodash|lodash-es|nanoid)[\\/]/,
            name: 'utilities',
            priority: 35,
            chunks: 'all',
            reuseExistingChunk: true
          },
          // PDF/Canvas libraries - consolidated chunk
          pdf: {
            test: /[\\/]node_modules[\\/](jspdf|jspdf-autotable|html2canvas|html2pdf)[\\/]/,
            name: 'pdf',
            priority: 30,
            chunks: 'async',
            reuseExistingChunk: true,
            minChunks: 1,
            enforce: true
          },
          // UI enhancement libraries
          enhancements: {
            test: /[\\/]node_modules[\\/](gsap|shepherd\.js|qrcode\.vue)[\\/]/,
            name: 'enhancements',
            priority: 25,
            chunks: 'async',
            reuseExistingChunk: true
          },
          // Polyfills and core utilities
          polyfills: {
            test: /[\\/]node_modules[\\/](core-js|@babel)[\\/]/,
            name: 'polyfills',
            priority: 20,
            chunks: 'initial',
            reuseExistingChunk: true
          },
          // All other vendor libraries
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'initial',
            reuseExistingChunk: true
          },
          // Common application code
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            chunks: 'all',
            reuseExistingChunk: true,
            enforce: true
          }
        }
      },
      // Runtime chunk optimization
      runtimeChunk: {
        name: 'runtime'
      }
    },
    performance: {
      hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
      maxAssetSize: 512000,
      maxEntrypointSize: 512000,
    }
  },
  chainWebpack: config => {
    // Remove default prefetch and preload for manual control
    config.plugins.delete('prefetch')
    config.plugins.delete('preload')
    
    // Production optimizations
    if (process.env.NODE_ENV === 'production') {
      // Advanced compression
      config.optimization.minimize(true)
      
      // Better source maps for production debugging
      config.devtool('source-map')
      
      // Advanced CSS optimization
      config.plugin('extract-css').tap(args => {
        args[0].ignoreOrder = true
        return args
      })
      
      // Tree shaking for CSS
      config.module
        .rule('css')
        .oneOf('normal')
        .use('postcss-loader')
        .tap(options => {
          const basePlugins = ['autoprefixer']
          
          if (process.env.NODE_ENV === 'production') {
            try {
              const purgecss = require('@fullhuman/postcss-purgecss')
              basePlugins.push(purgecss({
                content: [
                  './src/**/*.vue',
                  './src/**/*.js',
                  './public/index.html'
                ],
                defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
                safelist: {
                  standard: [
                    'route-loading',
                    'route-error', 
                    'loading-spinner',
                    'lazy-loading',
                    'lazy-error',
                    'animate-pulse',
                    'animate-slide-in'
                  ],
                  deep: [/^animate-/, /^transition-/, /^transform-/],
                  greedy: [/^chart-/, /^tooltip-/, /^modal-/]
                }
              }))
            } catch (e) {
              console.warn('PurgeCSS not available, skipping CSS purge')
            }
          }
          
          return {
            ...options,
            postcssOptions: {
              plugins: basePlugins
            }
          }
        })
    }
    
    // Optimize images
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp|avif)(\?.*)?$/)
      .set('type', 'asset')
      .set('parser', {
        dataUrlCondition: {
          maxSize: 8192 // 8kb
        }
      })
      .set('generator', {
        filename: 'img/[name].[hash:8][ext]'
      })
    
    // Font optimization
    config.module
      .rule('fonts')
      .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
      .set('type', 'asset')
      .set('parser', {
        dataUrlCondition: {
          maxSize: 4096 // 4kb
        }
      })
      .set('generator', {
        filename: 'fonts/[name].[hash:8][ext]'
      })
    
    // Advanced module resolution
    config.resolve.extensions
      .clear()
      .add('.mjs')
      .add('.js')
      .add('.jsx')
      .add('.vue')
      .add('.json')
      .add('.wasm')
    
    // Module optimization for better tree shaking
    config.resolve.mainFields
      .clear()
      .add('browser')
      .add('module')
      .add('main')
    
    // Better caching with content hashing
    config.output.filename(
      process.env.NODE_ENV === 'production' 
        ? 'js/[name].[contenthash:8].js' 
        : 'js/[name].js'
    )
    config.output.chunkFilename(
      process.env.NODE_ENV === 'production'
        ? 'js/[name].[contenthash:8].js'
        : 'js/[name].js'
    )
    
    // Webpack bundle analyzer for production builds
    if (process.env.ANALYZE_BUNDLE) {
      try {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
        config.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [{
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: 'bundle-analysis.html'
        }])
      } catch (e) {
        console.warn('webpack-bundle-analyzer not available, skipping bundle analysis')
      }
    }
  }
};