module.exports = {
  context: __dirname + '/../build/front',
  entry:  './ngUdb.js',
  output: {
    filename: 'build/front/udb-front.js'
  },
  externals: {
    "binary": 'binary'
  }
};