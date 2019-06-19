var babel = require("@babel/core")

module.exports = function(source) {

  var options = {
    presets: ['@babel/preset-env'],
    sourceMaps: true,
    filename: this.request.split('!')[1].split('/').pop()
  }

  var result = babel.transformSync(source, options)

  // return result.code
  this.callback(null, result.code, result.map)
}