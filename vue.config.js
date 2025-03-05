const path = require('path');

module.exports = {
  publicPath: process.env.DEPLOY_ENV === 'GH_PAGES'
    ? '/Tax-calculator-website/'
    : '/',
  outputDir: process.env.DEPLOY_ENV === 'GH_PAGES' ? 'docs' : 'dist',
  devServer: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: 'all',
    client: {
      webSocketURL: 'wss://sturdy-giggle-v6qj67gjqwf6qxv-3000.app.github.dev/ws',
    },
  },
  configureWebpack: {
    resolve: {
      symlinks: false,
      alias: {
        vue: path.resolve('./node_modules/vue'),
      },
    },
  },
};