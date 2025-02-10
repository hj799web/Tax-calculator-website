const path = require('path');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/Tax-calculator-website/' // Change this to match your GitHub repo name
    : '/',
  devServer: {
    port: 3000,  // Force it to always use port 3000
    host: '0.0.0.0',  // Allows access from Codespaces
    allowedHosts: 'all', // Ensures the Codespaces URL works
    client: {
      webSocketURL: 'wss://sturdy-giggle-v6qj67gwgjqwf6qxv-3000.app.github.dev/ws',  // Fixes WebSocket issues
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



