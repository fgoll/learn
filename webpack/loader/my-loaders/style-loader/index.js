// style-loader 的作用是把样式插入到 DOM中，方法是在head中插入一个style标签，并把样式写入到这个标签的 innerHTML 里

var path = require('path')
var loaderUtils = require('loader-utils')

/**
 * use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
 * 默认的loader都是从下向上执行，用 pitching loader 是从上到下执行的
 * 
 * 如果不用pitching loader, 按照默认的从下向上的顺序, 使用css-loader将返回一段js字符串, 而style-loader需要将css文件的内容插入dom,
 * 这样就取不到css样式了, 所以为了获取css样式, 会在style-loader中直接通过require来获取, 
 */
module.exports.pitch = function(request) {
  // console.log(loaderUtils.stringifyRequest(this, "!!" + request))
  return [
    // 获取 CSS 文件的内容
    "var content = require(" + loaderUtils.stringifyRequest(this, "!!" + request) + ");",
    // 调用 addStyles ，把CSS内容插入到DOM中去
    "var update = require(" + loaderUtils.stringifyRequest(this, "!" + path.join(__dirname, "add-style.js")) + ")(content);", 
    // 如果发现启用了 css modules，则默认导出它
    "if(content.locals) module.exports = content.locals;"
  ].join("\n")

}