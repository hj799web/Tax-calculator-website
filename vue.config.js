const path = require('path');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/Tax-calculator-website/'  // Ensure this matches your repo name exactly (case-sensitive)
    : '/',
  outputDir: 'docs', // <-- Build output goes to the "docs" folder in your main branch
  devServer: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: 'all',
    client: {
      webSocketURL: 'wss://sturdy-giggle-v6qj67gwgjqwf6qxv-3000.app.github.dev/ws',
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




