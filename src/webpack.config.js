const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const PROD = JSON.parse(process.env.PROD_ENV || '1');

module.exports = {
  context: __dirname + "/../dist/front",
  mode: PROD ? "production" : "development",
  entry: "./webUdb.js",
  output: {
    filename: "../dist/front/udb-front.js"
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
