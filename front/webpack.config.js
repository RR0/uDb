const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const PROD = JSON.parse(process.env.PROD_ENV || '1');

module.exports = {
  context: __dirname + '/../build/front',
  mode: PROD ? 'production' : 'development',
  module: {
    rules: [
      {test: /.js$/, loaders: ['ng-annotate-loader']}
    ]
  },
  externals: {
    'angular': 'angular'
  },
  entry: './ngUdb.js',
  output: {
    filename: '../build/front/udb-front.js'
  },
  optimization: {
    minimizer: PROD ? [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: true
        },
        sourceMap: true
      })
    ] : []
  }
};
