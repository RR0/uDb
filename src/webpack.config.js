const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const PROD = JSON.parse(process.env.PROD_ENV || '1');

module.exports = {
  context: __dirname + "/../build/front",
  mode: PROD ? "production" : "development",
  entry: "./webUdb.js",
  output: {
    filename: "../build/front/udb-front.js"
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
