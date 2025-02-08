const path = require(`path`);

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/Tax-calculator-website/'  // Change this to match your GitHub repo name
    : '/',
    configureWebpack: {
      resolve: {
          symlinks: false,
          alias: {
              vue: path.resolve(`./node_modules/vue`)
          }
      }
  }
};