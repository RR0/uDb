const webpack = require('webpack');

const PROD = JSON.parse(process.env.PROD_ENV || '0');

module.exports = {
  context: __dirname + '/../build/front',
  entry: './ngUdb.js',
  output: {
    filename: 'build/front/udb-front.js'
  },
  plugins: PROD ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: {warnings: false}
    })
  ] : [],
  externals: {
    'angular': 'angular'
  }
};