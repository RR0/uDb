const webpack = require('webpack');

const PROD = JSON.parse(process.env.PROD_ENV || '1');

module.exports = {
  context: __dirname + '/../build/front',
  module: {
    loaders: [
      {test: /.js$/, loaders: ['ng-annotate-loader']}
    ]
  },
  externals: {
    'angular': 'angular'
  },
  entry: './ngUdb.js',
  output: {
    filename: 'build/front/udb-front.js'
  },
  plugins: PROD ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: {warnings: false}
    })
  ] : [],
};